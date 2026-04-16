#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${CLAUDE_TAROTAP_ENV_FILE:-$HOME/.claude/tarotap-bridge.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

if [[ $# -ge 1 && -n "${1:-}" ]]; then
  export TAROTAP_API_KEY="$1"
fi

if [[ -z "${TAROTAP_API_KEY:-}" ]]; then
  echo "Missing TAROTAP_API_KEY. Put it in $ENV_FILE or pass it as the first argument." >&2
  exit 1
fi

export BRIDGE_HOST="${BRIDGE_HOST:-127.0.0.1}"
export BRIDGE_PORT="${BRIDGE_PORT:-8765}"
export TAROTAP_MODEL="${TAROTAP_MODEL:-gpt-5.4}"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

NODE_BIN="${NODE_BIN:-/opt/homebrew/bin/node}"

if [[ ! -x "$NODE_BIN" ]]; then
  echo "Node binary not found at $NODE_BIN" >&2
  exit 1
fi

exec "$NODE_BIN" "$SCRIPT_DIR/claude-tarotap-bridge.mjs"
