#!/usr/bin/env bash
# Shows what a change does to the site's pages: builds the site at a base commit and from the working tree,
# screenshots every page of both builds (capture.spec.ts) and compares the screenshots (compare.ts).
#
#   pnpm visual-diff [base]
#
# base is the commit to compare with. It defaults to the commit the current branch forked from origin/main.
# The Visual diff workflow passes HEAD^1, the base branch's side of the PR's merge commit.
#
# Everything goes in visual-diff/: the full-page screenshots in before/ and after/, and the comparison in report/
# (comment.md, summary.md, report.json and the cropped images).
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
out=visual-diff
if [ $# -eq 0 ]; then
  git fetch --quiet origin main || echo "Couldn't fetch origin/main, so comparing with the local copy of it" >&2
fi
base=$(git rev-parse --verify "${1:-$(git merge-base origin/main HEAD)}^{commit}")
tmp=$(mktemp -d)
worktree="$tmp/base"

cleanup() {
  git worktree remove --force "$worktree" >/dev/null 2>&1 || true
  rm -rf "$tmp"
}
trap cleanup EXIT

# run a command, printing its output only if it fails
quietly() {
  if ! "$@" >"$tmp/log" 2>&1; then
    cat "$tmp/log"
    return 1
  fi
}

screenshot() {
  VISUAL_SITE="$1" VISUAL_OUT="$out/$2" pnpm exec playwright test --config playwright.visual.config.ts
}

rm -rf "$out"

echo "Building $(git rev-parse --short "$base") (before)"
git worktree add --quiet --detach "$worktree" "$base"
(cd "$worktree" && HUSKY=0 quietly pnpm install --frozen-lockfile && quietly pnpm generate)

echo 'Building the working tree (after)'
quietly pnpm generate

echo 'Screenshotting the before build'
screenshot "$worktree/.output/public" before
echo 'Screenshotting the after build'
screenshot .output/public after

node tests/visual/compare.ts "$out/before" "$out/after" "$out/report"
