#!/usr/bin/env bash
# pnpm test:e2e: builds this branch and runs the Playwright suite against it. Before that, it builds the commit
# this branch is based on in a temporary worktree and screenshots it, so visual.spec.ts can compare the two.
# The screenshots are kept in tests/e2e/__snapshots__ (git-ignored) and reused until the base commit or the
# tests change. A base that can't be built or screenshotted is reported, never a failure.
#
#   E2E_BASE=<commit>  the commit to compare with (default: where this branch left origin/main; CI: HEAD^1)
#   arguments          passed on to `playwright test`, e.g. `pnpm test:e2e e2e/visual -g home`
set -euo pipefail
cd "$(dirname "$0")/../.."

snapshots=tests/e2e/__snapshots__
manifest=$snapshots/baseline.json
worktree=

warn() { printf '\n\033[33m%s\033[0m\n\n' "$*" >&2; }

remove_worktree() {
  if [[ -n $worktree ]]; then
    git worktree remove --force "$worktree" 2>/dev/null || rm -rf "$worktree"
    git worktree prune
    worktree=
  fi
}
trap remove_worktree EXIT

# what the screenshots depend on besides the base commit: the tests, the config and the pinned Playwright
key() {
  find tests/e2e playwright.config.ts pnpm-lock.yaml -type f -not -path "$snapshots/*" -print0 |
    LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1
}

write_manifest() { # base key status [reason]
  mkdir -p "$snapshots"
  node -e 'const [base, key, status, reason] = process.argv.slice(1);
    require("fs").writeFileSync(process.argv[5], JSON.stringify({ base, key, status, reason: reason || undefined }, null, 2) + "\n");' \
    "$1" "$2" "$3" "${4:-}" "$manifest"
}

unavailable() { # base key reason
  warn "Screenshots won't be compared: $3"
  # screenshots of an earlier base would otherwise be compared without saying so
  rm -rf "$snapshots"
  write_manifest "$1" "$2" unavailable "$3"
}

is_recorded() { # base key
  node -e 'const [base, key, file] = process.argv.slice(1);
    try { const m = JSON.parse(require("fs").readFileSync(file, "utf8")); process.exit(m.base === base && m.key === key && m.status === "recorded" ? 0 : 1); }
    catch { process.exit(1); }' "$1" "$2" "$manifest"
}

record_baseline() { # base key
  local base=$1 key=$2
  echo "Screenshotting the base commit ${base:0:7} to compare this branch with"
  rm -rf "$snapshots"
  git worktree prune
  worktree=$(mktemp -d "${TMPDIR:-/tmp}/e2e-base.XXXXXX")
  git worktree add --detach --quiet "$worktree" "$base" ||
    { unavailable "$base" "$key" "couldn't check out ${base:0:7}"; return; }
  (cd "$worktree" && HUSKY=0 NUXT_TELEMETRY_DISABLED=1 pnpm install --frozen-lockfile) ||
    { unavailable "$base" "$key" "pnpm install failed on ${base:0:7}"; return; }
  (cd "$worktree" && NUXT_TELEMETRY_DISABLED=1 pnpm generate) ||
    { unavailable "$base" "$key" "pnpm generate failed on ${base:0:7}"; return; }

  # the head's tests and Playwright, pointed at the base's build
  VISUAL_BASELINE=1 E2E_SITE_DIR="$worktree/.output/public" pnpm exec playwright test --output "$worktree/test-results" ||
    warn "Some screenshots of the base commit failed (see above); those pages will be reported without a comparison."
  remove_worktree

  if [[ -z $(find "$snapshots" -name '*.png' -print -quit 2>/dev/null) ]]; then
    unavailable "$base" "$key" "no screenshot of ${base:0:7} could be taken"
    return
  fi
  write_manifest "$base" "$key" recorded
}

pnpm generate

if [[ -n ${E2E_BASE:-} ]]; then
  base=$(git rev-parse --verify --quiet "${E2E_BASE}^{commit}") || base=
  missing="E2E_BASE=$E2E_BASE isn't a commit in this clone"
else
  base=$(git merge-base HEAD origin/main 2>/dev/null) || base=
  missing="couldn't find where this branch left origin/main; run git fetch origin main (or git fetch --deepen=100 in a shallow clone)"
fi

key=$(key)
if [[ -z $base ]]; then
  unavailable none "$key" "$missing"
elif is_recorded "$base" "$key"; then
  echo "Reusing the screenshots of the base commit ${base:0:7} in $snapshots"
else
  record_baseline "$base" "$key"
fi

pnpm exec playwright test "$@"
