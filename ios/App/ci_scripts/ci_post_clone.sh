#!/bin/sh
set -e

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

cd "$REPO_ROOT"

export PATH="/opt/homebrew/opt/node@20/bin:/usr/local/opt/node@20/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    brew install node@20 || brew install node
    export PATH="/opt/homebrew/opt/node@20/bin:/usr/local/opt/node@20/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
  else
    echo "npm is required to build the Capacitor web app." >&2
    exit 1
  fi
fi

node --version
npm --version

npm ci
npm run build
npx cap sync ios
