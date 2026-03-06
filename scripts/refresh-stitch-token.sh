#!/bin/bash
# Stitch MCP アクセストークン自動更新スクリプト
# 使い方: bash scripts/refresh-stitch-token.sh

set -e

MCP_CONFIG="$HOME/.gemini/antigravity/mcp_config.json"
GCLOUD="$HOME/google-cloud-sdk/bin/gcloud"

echo "🔄 Stitch MCP トークンを更新中..."

# トークン取得
TOKEN=$($GCLOUD auth application-default print-access-token 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ トークンの取得に失敗しました。以下を実行してログインしてください:"
  echo "   $GCLOUD auth application-default login --no-launch-browser"
  exit 1
fi

# mcp_config.json を更新
cat > "$MCP_CONFIG" << EOF
{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "Authorization": "Bearer $TOKEN",
        "X-Goog-User-Project": "gen-lang-client-0441948241"
      }
    }
  }
}
EOF

echo "✅ トークンを更新しました！"
echo "   有効期限: 約1時間"
echo ""
echo "📝 次のステップ: Antigravity を再起動するか、新しい会話を開いてください"
