#!/usr/bin/env bash
# Sets up local development on Linux and macOS: Node.js (via nvm), pnpm (via Corepack) and dependencies.
set -euo pipefail
cd "$(dirname "$0")"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  mkdir -p "$NVM_DIR"
  [[ "${SHELL:-}" == */zsh ]] && touch "$HOME/.zshrc" # nvm only edits a profile that exists
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
fi

set +eu # nvm doesn't support errexit/nounset
# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"
nvm install # reads .nvmrc
set -eu

export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable pnpm
corepack install # reads packageManager from package.json

pnpm install --frozen-lockfile

echo "Done. Open a new terminal, run 'nvm use' here, then 'pnpm dev'."
