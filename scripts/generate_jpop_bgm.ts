import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Replicate from 'replicate';

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateJPopBGM() {
  const prompt =
    "High-energy J-Pop, 128 BPM, Mrs. GREEN APPLE 'Dancehall' style, bright brass section, funky electric guitar, energetic piano, sparkling synthesizer, upbeat drums, catchy melody, studio production, 44.1kHz";
  const duration = 90; // 90 seconds
  const outputPath = path.join(
    process.cwd(),
    'public/assets/audio/music/mga_dancehall_style.mp3',
  );

  console.log(`🎵 Generating Mrs. GREEN APPLE style BGM...`);
  console.log(`Prompt: "${prompt}"`);

  try {
    // Using musicgen-large for higher quality
    const output: any = await replicate.run(
      'riffusion/riffusion:8cf361ac06b044fdb356613d9c22abba66160914f141870bb785006b5278784d',
      {
        input: {
          prompt_a: prompt,
        },
      },
    );

    console.log('✅ Generation complete! Downloading file...');
    const response = await fetch(output);
    const buffer = await response.buffer();

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(outputPath, buffer);
    console.log(`🚀 Saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to generate music:', error);
  }
}

generateJPopBGM();
