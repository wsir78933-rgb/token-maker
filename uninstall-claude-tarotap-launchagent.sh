#!/bin/zsh
set -euo pipefail

PLIST_PATH="$HOME/Library/LaunchAgents/com.wusir.claude-tarotap-bridge.plist"

launchctl unload "$PLIST_PATH" >/dev/null 2>&1 || true
rm -f "$PLIST_PATH"

echo "Uninstalled: $PLIST_PATH"
