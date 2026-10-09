#!/usr/bin/env bash
# Sets up the tooling for local development on Linux and macOS. Safe to re-run: steps that are
# already done are skipped.
#
#   1. Node.js at the version in .nvmrc, through nvm or fnm (installs nvm if neither is present)
#   2. pnpm at the version pinned by "packageManager" in package.json, through Corepack
#   3. The site's dependencies
#
# With --functions it also installs the Lambda functions' dependencies and the Serverless
# Framework v4 CLI (see functions/README.md).

set -euo pipefail

NVM_VERSION=v0.40.8

usage() {
  cat <<EOF
Usage: ./init.sh [--functions]

  --functions  Also set up functions/: their dependencies and the Serverless Framework v4 CLI
  -h, --help   Show this help
EOF
}

info() { printf '==> %s\n' "$*"; }
warn() { printf 'warning: %s\n' "$*" >&2; }
die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

with_functions=false
while [ $# -gt 0 ]; do
  case "$1" in
    --functions) with_functions=true ;;
    -h | --help)
      usage
      exit 0
      ;;
    *) die "unknown option: $1 (see --help)" ;;
  esac
  shift
done

os="$(uname -s)"
case "$os" in
  Linux | Darwin) ;;
  *) die "unsupported OS: $os (only Linux and macOS are supported)" ;;
esac

cd "$(dirname "${BASH_SOURCE[0]}")"

# Anything this script activates only lasts until it exits; these are passed on to the user at the end
reminders=()

node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null; }

# nvm is a shell function that doesn't work under errexit/nounset
nvm_run() {
  set +eu
  nvm "$@"
  local status=$?
  set -eu
  return $status
}

load_nvm() {
  local dir
  for dir in "${NVM_DIR:-}" "$HOME/.nvm" "${XDG_CONFIG_HOME:-$HOME/.config}/nvm"; do
    if [ -n "$dir" ] && [ -s "$dir/nvm.sh" ]; then
      export NVM_DIR="$dir"
      set +eu
      # shellcheck source=/dev/null
      . "$NVM_DIR/nvm.sh" --no-use
      set -eu
      return 0
    fi
  done
  # Homebrew installs nvm.sh outside NVM_DIR
  if command -v brew >/dev/null 2>&1 && [ -s "$(brew --prefix nvm)/nvm.sh" ]; then
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    mkdir -p "$NVM_DIR"
    set +eu
    # shellcheck source=/dev/null
    . "$(brew --prefix nvm)/nvm.sh" --no-use
    set -eu
    return 0
  fi
  return 1
}

setup_node() {
  local want
  want="$(tr -d 'v \t\r\n' <.nvmrc)"

  if [ "$(node_major)" = "$want" ]; then
    info "Node.js $(node -v) is already active"
    return
  fi

  if load_nvm; then
    info "Switching to Node.js $want with nvm"
    nvm_run use --silent || nvm_run install || die "nvm could not install Node.js $want"
    reminders+=("Run \`nvm use\` in this directory to switch your shell to Node.js $want.")
  elif command -v fnm >/dev/null 2>&1; then
    info "Switching to Node.js $want with fnm"
    eval "$(fnm env --shell bash)"
    fnm use --install-if-missing
    reminders+=("Run \`fnm use\` in this directory to switch your shell to Node.js $want.")
  else
    command -v curl >/dev/null 2>&1 || die "curl is required to install nvm"
    info "Installing nvm $NVM_VERSION (it adds itself to your shell profile)"
    # nvm only edits a profile that already exists, and a new Mac has no ~/.zshrc
    case "${SHELL:-}" in
      */zsh) touch "${ZDOTDIR:-$HOME}/.zshrc" ;;
    esac
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash
    load_nvm || die "nvm was installed but nvm.sh could not be found"
    info "Installing Node.js $want with nvm"
    nvm_run install || die "nvm could not install Node.js $want"
    reminders+=("Open a new terminal to load nvm, then run \`nvm use\` in this directory.")
  fi

  [ "$(node_major)" = "$want" ] || die "expected Node.js $want, found $(node -v 2>/dev/null || echo none)"
}

setup_pnpm() {
  local want bin_dir
  want="$(node -p 'require("./package.json").packageManager')"
  want="${want#pnpm@}"
  want="${want%%+*}"
  export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

  # pnpm 9.7+ also counts here: it runs the pinned version itself
  if [ "$(pnpm --version 2>/dev/null)" = "$want" ]; then
    info "pnpm $want is already available"
    return
  fi

  command -v corepack >/dev/null 2>&1 ||
    die "Corepack not found; install pnpm $want yourself (https://pnpm.io/installation) and re-run"

  info "Enabling pnpm $want with Corepack"
  # Corepack prints its errors to stdout
  if ! corepack enable pnpm >/dev/null 2>&1; then
    bin_dir="$HOME/.local/bin"
    info "Can't write next to $(command -v node), linking pnpm into $bin_dir instead"
    mkdir -p "$bin_dir"
    corepack enable --install-directory "$bin_dir" pnpm
    case ":$PATH:" in
      *":$bin_dir:"*) ;;
      *)
        export PATH="$bin_dir:$PATH"
        reminders+=("Add $bin_dir to your PATH so your shell finds pnpm.")
        ;;
    esac
  fi
  corepack install

  [ "$(pnpm --version 2>/dev/null)" = "$want" ] ||
    die "expected pnpm $want, found $(pnpm --version 2>/dev/null || echo none) at $(command -v pnpm || echo '(none)')"
}

setup_serverless() {
  if command -v serverless >/dev/null 2>&1; then
    info "Serverless Framework is already installed at $(command -v serverless) (functions need v4)"
    return
  fi

  # pnpm only installs global packages once its global bin directory is on PATH
  if ! pnpm bin --global >/dev/null 2>&1; then
    if [ -z "${PNPM_HOME:-}" ]; then
      case "$os" in
        Darwin) PNPM_HOME="$HOME/Library/pnpm" ;;
        *) PNPM_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/pnpm" ;;
      esac
      export PNPM_HOME
    fi
    export PATH="$PNPM_HOME/bin:$PATH"
    info "Setting up pnpm's global bin directory (pnpm adds it to your shell profile)"
    pnpm setup
    reminders+=("Open a new terminal so your shell finds the \`serverless\` command.")
  fi

  info "Installing Serverless Framework v4"
  pnpm add --global serverless@4
  reminders+=("Sign in to Serverless with \`serverless login\`, or set SERVERLESS_ACCESS_KEY.")
}

setup_functions() {
  local dir
  for dir in functions/*/; do
    [ -f "$dir/pnpm-lock.yaml" ] || continue
    info "Installing dependencies in ${dir%/}"
    (cd "$dir" && pnpm install --frozen-lockfile)
  done

  setup_serverless

  [ -f functions/stripe-lambda/config.js ] ||
    reminders+=("Create functions/stripe-lambda/config.js with your Stripe key (see functions/README.md).")
}

setup_node
setup_pnpm

info "Installing site dependencies"
pnpm install --frozen-lockfile

if $with_functions; then
  setup_functions
fi

info "Done. Start the dev server with \`pnpm dev\`."
if [ ${#reminders[@]} -gt 0 ]; then
  printf '\nNext steps:\n'
  printf '  - %s\n' "${reminders[@]}"
fi
