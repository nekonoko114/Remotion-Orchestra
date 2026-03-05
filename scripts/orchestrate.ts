import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import dotenv from 'dotenv';
import type { OrchestraTimeline } from '../src/types/schema';

dotenv.config();
const execPromise = util.promisify(exec);

/**
 * Antigravity Orchestrator (The Conductor)
 *
 * 1. Analyzes user prompt
 * 2. Generates Audio (Music, SFX, Voice) using ElevenLabs
 * 3. Generates Video using Luma Dream Machine
 * 4. Outputs a timeline JSON for Remotion
 */

async function runStep(name: string, command: string): Promise<void> {
  console.log(`\n🔹 [${name}] Running...`);
  // console.log(`   Command: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command);
    console.log(`✅ [${name}] Complete.`);
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ [${name}] Failed:`, message);
    throw error;
  }
}

async function main() {
  const userPrompt = process.argv[2];
  if (!userPrompt) {
    console.error(
      "❌ Please provide a prompt. Example: npx ts-node scripts/orchestrate.ts 'A cyberpunk battle scene'",
    );
    process.exit(1);
  }

  const timestamp = Date.now();
  console.log(
    `🚀 [Conductor] Starting generation pipeline for: "${userPrompt}"`,
  );

  // --- Output Paths (Absolute/Relative for Logic) ---
  // Base directories
  const assetsDir = path.resolve(process.cwd(), 'public/assets'); // Use absolute path to public/assets

  // Ensure directories exist
  if (!fs.existsSync(path.join(assetsDir, 'audio/music')))
    fs.mkdirSync(path.join(assetsDir, 'audio/music'), { recursive: true });
  if (!fs.existsSync(path.join(assetsDir, 'audio/sfx')))
    fs.mkdirSync(path.join(assetsDir, 'audio/sfx'), { recursive: true });
  if (!fs.existsSync(path.join(assetsDir, 'audio/voice')))
    fs.mkdirSync(path.join(assetsDir, 'audio/voice'), { recursive: true });
  if (!fs.existsSync(path.join(assetsDir, 'video')))
    fs.mkdirSync(path.join(assetsDir, 'video'), { recursive: true });

  // File paths
  const musicFilename = `gen_music_${timestamp}.mp3`;
  const sfxFilename = `gen_sfx_${timestamp}.mp3`;
  const voiceFilename = `gen_voice_${timestamp}.mp3`;
  const videoFilename = `gen_luma_${timestamp}.mp4`;

  const musicPath = path.join(assetsDir, 'audio/music', musicFilename);
  const sfxPath = path.join(assetsDir, 'audio/sfx', sfxFilename);
  const voicePath = path.join(assetsDir, 'audio/voice', voiceFilename);
  const videoPath = path.join(assetsDir, 'video', videoFilename);

  // --- Step 0: Brainstorming (The 3-Step Thinking) ---
  console.log(
    '\n🧠 [Producer] Consulting with Scriptwriter & Emotion Director...',
  );
  try {
    await execPromise(`npx tsx scripts/brainstorm_scenario.ts "${userPrompt}"`);
  } catch (e) {
    console.error('❌ Brainstorming failed. Falling back to simple mode.');
  }

  // Read generated scenario
  // biome-ignore lint/suspicious/noExplicitAny: Temporary loose typing for scenario file import
  let scenarioData: any = {};
  try {
    if (fs.existsSync('src/ai_scenario.json')) {
      const raw = fs.readFileSync('src/ai_scenario.json', 'utf-8');
      scenarioData = JSON.parse(raw);
      console.log(`\n📜 [Producer] Scenario adopted: "${scenarioData.title}"`);
      console.log(`   Concept: ${scenarioData.concept}`);
    }
  } catch (e) {
    console.warn('⚠️ Could not read ai_scenario.json');
  }

  // --- Step 1: Scenario Planning ---
  // Use prompts from AI scenario if available, otherwise fallback
  const prompts = scenarioData.asset_prompts || {};

  // We append the visual style to the prompt to ensure consistency
  const musicPrompt =
    prompts.music ||
    `Cinematic background music for: ${userPrompt}, intense, epic`;
  const sfxPrompt = prompts.sfx || `Sound effects for: ${userPrompt}`;
  const voicePrompt = prompts.voice || `Narrate this scene: ${userPrompt}`;
  const videoPrompt = prompts.video || userPrompt;

  console.log('\n--- 🎨 Production Assets ---');
  console.log(`🎵 Music: ${musicPrompt.substring(0, 50)}...`);
  console.log(`🎥 Video: ${videoPrompt.substring(0, 50)}...`);
  console.log(`🗣️ Voice: ${voicePrompt.substring(0, 50)}...`);

  // --- Step 2: Parallel Asset Generation ---
  console.log('\n🎬 [Director] Starting parallel asset generation...');

  const tasks = [
    // 1. Music (ElevenLabs) - Disabled per user request
    // runStep('Music Data', `npx ts-node scripts/generate_elevenlabs_audio.ts music "${musicPrompt}" "${musicPath}"`),

    // 2. SFX (ElevenLabs)
    runStep(
      'SFX Data',
      `npx ts-node scripts/generate_elevenlabs_audio.ts sfx "${sfxPrompt}" "${sfxPath}"`,
    ),

    // 3. Voice (ElevenLabs)
    runStep(
      'Voice Data',
      `npx ts-node scripts/generate_elevenlabs_audio.ts voice "${voicePrompt}" "${voicePath}"`,
    ),

    // 4. Video (Luma)
    // Using 'tsx' as specified in the luma script
    runStep(
      'Video Luma',
      `npx tsx scripts/generate_luma_video.ts "${videoPrompt}" "${videoPath}"`,
    ),
  ];

  try {
    await Promise.all(tasks);
  } catch (e) {
    console.error(
      '\n⚠️ Some assets failed to generate. Continuing with available assets...',
    );
  }

  // --- Step 3: Assembly Data ---
  // Decision: Use AI Scenario if available, otherwise fallback to battle.json
  let timelineData: OrchestraTimeline | Record<string, unknown> = {};
  const aiScenarioPath = 'src/ai_scenario.json';
  const templatePath = 'battle.json';

  try {
    if (fs.existsSync(aiScenarioPath)) {
      const raw = fs.readFileSync(aiScenarioPath, 'utf-8');
      timelineData = JSON.parse(raw);
      console.log(`\n📄 [Producer] Using AI Script from ${aiScenarioPath}`);
    } else if (fs.existsSync(templatePath)) {
      const raw = fs.readFileSync(templatePath, 'utf-8');
      timelineData = JSON.parse(raw);
      console.log(`\n📄 [Producer] Using Template from ${templatePath}`);
    }
  } catch (e) {
    console.warn('⚠️ Could not read timeline data.');
  }

  // Generate Relative Paths for JSON (relative to 'public' folder)
  // Example: /Users/.../public/assets/audio/music.mp3 -> assets/audio/music.mp3
  const publicDir = path.resolve(process.cwd(), 'public');
  const getRelativePath = (absPath: string) => {
    return path.relative(publicDir, absPath);
  };

  // Check if files exist to prevent 404s in Remotion
  const safePath = (p: string | null) => {
    if (!p) return null;
    if (fs.existsSync(p)) return getRelativePath(p);
    console.warn(`⚠️ Asset missing: ${p}`);
    return null;
  };

  // Merge generated assets
  const newAssets = {
    id: `gen_${timestamp}`,
    prompt: userPrompt,
    music: safePath(musicPath),
    sfx: safePath(sfxPath),
    voice: safePath(voicePath),
    video: safePath(videoPath),
    generatedAt: new Date().toISOString(),
  };

  // Ensure generated_assets structure exists
  if (!('generated_assets' in timelineData)) {
    (timelineData as any).generated_assets = newAssets;
  } else {
    // biome-ignore lint/suspicious/noExplicitAny: Merge assets
    (timelineData as any).generated_assets = {
      ...(timelineData as any).generated_assets,
      ...newAssets,
    };
  }

  const timelinePath = 'generated_timeline.json';
  fs.writeFileSync(timelinePath, JSON.stringify(timelineData, null, 2));

  console.log('\n✨ [Producer] All assets generated!');
  console.log(`📄 Timeline data saved to: ${timelinePath}`);
  // console.log(JSON.stringify(timelineData, null, 2));
  console.log('\n👉 Next: Run Remotion to view the result!');
}

main();
