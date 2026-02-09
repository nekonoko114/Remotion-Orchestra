# Contributing to Remotion Orchestra

本プロジェクト「Remotion Orchestra」への貢献ガイドラインです。
開発に参加する際は、以下の規約とワークフローを遵守してください。

## 1. 開発環境のセットアップ

### 推奨環境

- **Node.js**: 最新のLTS (v20以上推奨)
- **Package Manager**: npm or pnpm

### インストール

\`\`\`bash
npm install
\`\`\`

## 2. コマンドリファレンス (`package.json`)

開発で頻繁に使用するコマンドです。

| コマンド               | 説明                            | 実行内容                         |
| ---------------------- | ------------------------------- | -------------------------------- |
| \`npm run dev\`        | プレビューサーバーの起動        | \`remotion studio\`              |
| \`npm run build\`      | 動画のレンダリング              | \`remotion bundle\`              |
| \`npm run lint\`       | コード品質チェックと型チェック  | \`biome check src && tsc\`       |
| \`npm run transcribe\` | 音声文字起こし (OpenAI Whisper) | \`npx tsx transcribe-openai.ts\` |

## 3. コーディング規約 (Coding Standards)

本プロジェクトは「動画編集の自立化」を目指すため、**プロフェッショナルな品質**を求めます。

### 基本原則

- **Google Style Guides**: 全般的なコードスタイルの基準。
- **TypeScript Strict Mode**: `any` 型の使用は原則禁止です。型定義を徹底してください。
- **Universal Glue Code**: 特定の動画専用のロジックではなく、再利用可能なコンポーネントとして設計してください。

### Lint & Format (Biome)

コードの整形と品質チェックには **Biome** を使用しています。コミット前には必ず以下のコマンドでエラーがないことを確認してください。

\`\`\`bash
npm run lint
\`\`\`

`biome.json` の設定により、インデントはタブ、ダブルクォート使用などが強制されます。

### HTMLエンティティの禁止

AIエージェントへの指示やドキュメントにおいて、`&quot;` や `&amp;` などのHTMLエンティティは使用せず、プレーンテキスト (`"`, `&`) を使用してください。

## 4. AIエージェントワークフロー (Jules)

本プロジェクトはAIパートナー「Jules」と共に開発します。

### エージェントの役割 (`docs/Agent.md`, `.agent/agents/`)

- **Emotion Director**: 「心が動くか？」を基準にレビューを行う感情演出家。
- **Scriptwriter**: 論理的な構成案を作成する脚本家。

### スキルの使用 (`.agent/skills/`)

開発を効率化するための特定のプロセスが定義されています。
例：テキストからナレーションを生成する場合

1. `scripts/gen_audio.py` を実行 (Narration Generation Skill)
2. `src/constants/audio_assets.ts` にアセットを追加

詳細な手順は各スキルの `SKILL.md` を参照してください。

## 5. ディレクトリ構造

- `src/`: ソースコード、コンポーネント
- `skills/`: AIエージェント用スキル定義
- `docs/`: プロジェクトドキュメント
- `.agent/`: AIエージェント定義ファイル

---

**Core Mission**: Independence of Video Editing (動画編集の自立化)
