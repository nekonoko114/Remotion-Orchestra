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
    
    // 音楽ファイルのパス (デフォルトまたは特定のものを指定可能にする)
    const musicPath = path.join(process.cwd(), 'public/assets/audio/sfx/gen_sfx_1772691683527.mp3'); 
    const outputDir = path.join(process.cwd(), 'src/compositions/Genkit'); // Genkitコンポジション用に出力

    // Whisperによる文字起こし
    console.log('🗣️ [Whisper] Starting local transcription for music...');
    await runStepTool('Whisper', `npx tsx transcribe-local.ts "${musicPath}" "${outputDir}"`);
    const subtitlePath = 'src/compositions/Genkit/subtitles.json';

    // Nanobanana画像生成の準備
    const generatedImages = scenario.asset_prompts.images.map((_, i) => {
      return `assets/images/gen_image_${timestamp}_${i}.png`;
    });

    const generatedAssets = {
      id: `gen_${timestamp}`,
      music: 'assets/audio/sfx/gen_sfx_1772691683527.mp3', 
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
