const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadAsset(url, destination) {
  const dir = path.dirname(destination);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const writer = fs.createWriteStream(destination);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Example usage: node scripts/download-asset.js [url] [category] [id]
const [,, url, category, id] = process.argv;

if (!url || !category || !id) {
  console.log('Usage: node scripts/download-asset.js [url] [category] [id]');
  process.exit(1);
}

const dest = path.join(__dirname, '..', 'public', 'assets', 'pixabay', category, `pixabay_${id}.mp4`);

console.log(`Downloading ${url} to ${dest}...`);

downloadAsset(url, dest)
  .then(() => console.log('Download complete!'))
  .catch((err) => console.error('Download failed:', err));
