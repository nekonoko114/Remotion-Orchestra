const fs = require('fs');
const path = require('path');

async function checkMetadata() {
  try {
    // Use a lightweight approach or just check if common metadata tools can be used via npx
    console.log('Checking metadata for audio files...');
    const files = [
      '炎の挑戦.mp3',
      '水の声.mp3',
      'タクティカルエンカウンター.mp3',
    ];
    const baseDir =
      '/Users/sumash/Developer/remotion-projects/RemotionOrchestra/public/assets/audio/music';

    for (const file of files) {
      const fullPath = path.join(baseDir, file);
      if (fs.existsSync(fullPath)) {
        console.log(`File: ${file} exists.`);
      } else {
        console.log(`File: ${file} NOT found.`);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

checkMetadata();
