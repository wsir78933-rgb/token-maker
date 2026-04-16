#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLIST_PATH="$HOME/Library/LaunchAgents/com.wusir.claude-tarotap-bridge.plist"
INSTALL_DIR="$HOME/.claude/bin/claude-tarotap-bridge"
START_SCRIPT_PATH="$INSTALL_DIR/start-claude-tarotap-bridge.sh"

mkdir -p "$HOME/Library/LaunchAgents"
mkdir -p "$INSTALL_DIR"

cp "$SCRIPT_DIR/claude-tarotap-bridge.mjs" "$INSTALL_DIR/claude-tarotap-bridge.mjs"
cp "$SCRIPT_DIR/start-claude-tarotap-bridge.sh" "$START_SCRIPT_PATH"
chmod +x "$START_SCRIPT_PATH"

cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.wusir.claude-tarotap-bridge</string>

  <key>ProgramArguments</key>
  <array>
    <string>$START_SCRIPT_PATH</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$INSTALL_DIR</string>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>/tmp/claude-tarotap-bridge.out.log</string>

  <key>StandardErrorPath</key>
  <string>/tmp/claude-tarotap-bridge.err.log</string>
</dict>
</plist>
PLIST

launchctl unload "$PLIST_PATH" >/dev/null 2>&1 || true
launchctl load "$PLIST_PATH"

echo "Installed and loaded: $PLIST_PATH"
