import { z } from 'genkit';
import { ai } from '../ai';
import { brainstormScenarioFlow } from './brainstormFlow.js';
import { OrchestraTimelineSchema, type OrchestraTimelineResult } from '../schemas';
import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import util from 'node:util';

const execPromise = util.promisify(exec);

/**
 * 外部スクリプトを実行するためのヘルパーツール
 */
const runStepTool = async (name: string, command: string) => {
  console.log(`\n🔹 [${name}] Starting CLI: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(`[${name} stdout]:`, stdout.trim());
    if (stderr) console.warn(`[${name} stderr]:`, stderr.trim());
    return { success: true, name };
  } catch (error: any) {
    console.error(`❌ [${name}] Failed:`, error.message);
    return { success: false, name, error: error.message };
  }
};

/**
 * オーケストレーターFlow: 
 * 1. BrainstormFlowで構成案を作成
 * 2. 各生成機能を呼び出してアセットを作成 (Whisper, Nanobanana, rembg)
 * 3. タイムラインJSONを生成
 */
export const orchestratorFlow = ai.defineFlow(
  {
    name: 'orchestratorFlow',
    inputSchema: z.string().describe('動画のテーマ'),
    outputSchema: OrchestraTimelineSchema,
  },
  async (userPrompt) => {
    const timestamp = Date.now();
    console.log(`🚀 [Genkit Conductor] Orchestrating: "${userPrompt}"`);

    // 1. 構成案の生成
    const scenario = await brainstormScenarioFlow(userPrompt);

    // 2. ディレクトリ準備 (public/assets/...)
    const assetsDir = path.resolve(process.cwd(), 'public/assets');
    const dirs = ['images', 'audio', 'video'];
    for (const d of dirs) {
      const fullPath = path.join(assetsDir, d);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
    }

    // 3. アセット生成 (Whisper, Nanobanana等)
    console.log('\n🎬 [Genkit Director] Asset generation & Processing...');
    
    // Whisperによる文字起こし (既存の transcribe-local.ts を活用)
    // 注意: 動画があることが前提ですが、ここでは音声解析のみ行う想定で調整
    console.log('🗣️ [Whisper] Starting local transcription...');
    await runStepTool('Whisper', 'npm run transcribe');
    const subtitlePath = 'src/compositions/Soregayasashisa/subtitles.json';

    // Nanobanana画像生成の準備
    // Agent側で実際のツール実行を促すためのプレースホルダ
    const generatedImages = scenario.asset_prompts.images.map((_, i) => {
      return `assets/images/gen_image_${timestamp}_${i}.png`;
    });

    // Background Removal (rembg) - 必要に応じて各画像に対して実行
    // ここでは将来的に組み込み可能な構成にしておく
    // await runStepTool('rembg', `rembg i inputs outputs`);

    const generatedAssets = {
      id: `gen_${timestamp}`,
      music: null, // 将来的にBGM生成を追加可能
      images: generatedImages,
      subtitles: subtitlePath,
      voice: null,
      generatedAt: new Date().toISOString(),
    };

    // 4. 最終タイムライン構築
    const finalTimeline: OrchestraTimelineResult = {
      ...scenario,
      generated_assets: generatedAssets
    };

    // JSON保存
    const timelinePath = 'generated_timeline.json';
    fs.writeFileSync(timelinePath, JSON.stringify(finalTimeline, null, 2));

    console.log(`\n✨ [Genkit] Pipeline complete! Timeline saved to ${timelinePath}`);
    return finalTimeline;
  }
);
