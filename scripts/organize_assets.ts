import fs from 'node:fs';
import path from 'node:path';

const ASSETS_DIR = path.resolve(process.cwd(), 'public/assets');
const TIMELINE_JSON_PATH = path.resolve(
  process.cwd(),
  'generated_timeline.json',
);

// Helper to find the latest file in a directory
function getLatestFile(dir: string, extension: string): string | null {
  if (!fs.existsSync(dir)) return null;

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(extension))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(dir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time); // Descending order

  return files.length > 0 ? files[0].name : null;
}

// Helper to clean path for Remotion (relative to public)
// function cleanPath(fullPath: string): string {
//     const publicIndex = fullPath.indexOf('public/');
//     if (publicIndex !== -1) {
//         return fullPath.substring(publicIndex + 7); // Remove '.../public/'
//     }
//     return fullPath;
// }

function organizeTimeline() {
  console.log('📂 Scanning existing assets...');

  const latestVideo = getLatestFile(path.join(ASSETS_DIR, 'video'), '.mp4');
  const latestMusic = getLatestFile(
    path.join(ASSETS_DIR, 'audio/music'),
    '.mp3',
  );
  const latestVoice = getLatestFile(
    path.join(ASSETS_DIR, 'audio/voice'),
    '.mp3',
  );
  const latestSfx = getLatestFile(path.join(ASSETS_DIR, 'audio/sfx'), '.mp3');

  if (!latestVideo && !latestMusic && !latestVoice && !latestSfx) {
    console.error('❌ No assets found in public/assets!');
    return;
  }

  console.log('✅ Found latest assets:');
  if (latestVideo) console.log(`   🎬 Video: ${latestVideo}`);
  if (latestMusic) console.log(`   🎵 Music: ${latestMusic}`);
  if (latestVoice) console.log(`   🗣️ Voice: ${latestVoice}`);
  if (latestSfx) console.log(`   🔊 SFX:   ${latestSfx}`);

  // Update generated_timeline.json
  let timelineData: any = {};
  if (fs.existsSync(TIMELINE_JSON_PATH)) {
    timelineData = JSON.parse(fs.readFileSync(TIMELINE_JSON_PATH, 'utf-8'));
  } else {
    console.warn('⚠️ generated_timeline.json not found. Creating new one.');
    timelineData = { timeline: [], generated_assets: {} };
  }

  // Ensure generated_assets object exists
  if (!timelineData.generated_assets) {
    timelineData.generated_assets = {};
  }

  // Update paths
  if (latestVideo)
    timelineData.generated_assets.video = `assets/video/${latestVideo}`;
  if (latestMusic)
    timelineData.generated_assets.music = `assets/audio/music/${latestMusic}`;
  if (latestVoice)
    timelineData.generated_assets.voice = `assets/audio/voice/${latestVoice}`;
  if (latestSfx)
    timelineData.generated_assets.sfx = `assets/audio/sfx/${latestSfx}`;

  // Add metadata
  timelineData.generated_assets.lastUpdated = new Date().toISOString();
  timelineData.generated_assets.source = 'Local Scan';

  fs.writeFileSync(TIMELINE_JSON_PATH, JSON.stringify(timelineData, null, 2));
  console.log(
    `\n💾 Updated ${TIMELINE_JSON_PATH} with latest valid asset paths.`,
  );
}

organizeTimeline();
