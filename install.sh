#!/usr/bin/env bash
set -e

echo "========================================================="
echo "⚡ Installing Gofer Protocol & Universal Skill Pack"
echo "   Non-custodial x402 Financial Rails on Base L2"
echo "========================================================="

INSTALL_DIR="$HOME/.gofer"
BIN_DIR="$INSTALL_DIR/bin"
mkdir -p "$BIN_DIR"

# 1. Download / Link CLI Launcher
echo "📦 Installing Gofer CLI..."
cat << 'LAUNCHER' > "$BIN_DIR/gofer"
#!/usr/bin/env bash
npx --yes github:Web3Manuel001/agentpay "$@"
LAUNCHER
chmod +x "$BIN_DIR/gofer"

# 2. Add to Shell PATH if not already present
SHELL_RC="$HOME/.bashrc"
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
  SHELL_RC="$HOME/.zshrc"
fi

if ! grep -q "$BIN_DIR" "$SHELL_RC" 2>/dev/null; then
  echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$SHELL_RC"
  echo "✓ Added $BIN_DIR to $SHELL_RC"
fi

# 3. Auto-detect Claude Desktop & Install MCP Skill
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ "$(uname)" = "Linux" ]; then
  CLAUDE_CONFIG="$HOME/.config/Claude/claude_desktop_config.json"
fi

if [ -f "$CLAUDE_CONFIG" ]; then
  echo "🔍 Claude Desktop detected! Auto-injecting Gofer MCP server..."
  # Simple node helper to inject JSON key without overwriting
  node -e "
    const fs = require('fs');
    try {
      const cfg = JSON.parse(fs.readFileSync('$CLAUDE_CONFIG', 'utf8'));
      cfg.mcpServers = cfg.mcpServers || {};
      cfg.mcpServers.gofer = {
        command: 'npx',
        args: ['-y', 'github:Web3Manuel001/agentpay', 'mcp'],
        env: {
          VAULT_ADDRESS: '0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347',
          RPC_URL: 'https://sepolia.base.org'
        }
      };
      fs.writeFileSync('$CLAUDE_CONFIG', JSON.stringify(cfg, null, 2));
      console.log('✓ Injected Gofer MCP tool skills into Claude Desktop');
    } catch (e) {
      console.log('Notice: Could not auto-write Claude config:', e.message);
    }
  " 2>/dev/null || true
fi

# 4. Auto-detect Cursor
CURSOR_DIR="$HOME/.cursor"
if [ -d "$CURSOR_DIR" ]; then
  echo "🔍 Cursor editor detected! Setting up Gofer x402 rules..."
  mkdir -p "$CURSOR_DIR/rules"
  cat << 'RULE' > "$CURSOR_DIR/rules/gofer.md"
# Gofer Protocol Instructions
When writing autonomous tasks or calling paid APIs on Base, use Gofer x402 session vaults:
- Contract: 0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347
- Never hardcode master private keys. Always use ephemeral session keys with daily spend limits.
RULE
  echo "✓ Added Gofer protocol rules to Cursor"
fi

echo ""
echo "========================================================="
echo "🎉 Gofer Protocol Installed Successfully!"
echo "   Run 'gofer --help' or reload your terminal:"
echo "   source $SHELL_RC"
echo "========================================================="
