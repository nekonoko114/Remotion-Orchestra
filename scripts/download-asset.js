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

// Example usage: node scripts/download-asset.js [url] [mediaType] [id] [ext] [tags]
const [,, url, mediaType, id, ext, tags] = process.argv;

if (!url || !mediaType || !id || !ext) {
  console.log('Usage: node scripts/download-asset.js [url] [mediaType] [id] [ext] [tags]');
  process.exit(1);
}

// Clean up tags for filename if provided
let tagPrefix = '';
if (tags && typeof tags === 'string') {
  tagPrefix = tags
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '_') // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, '')      // Trim leading/trailing underscores
    .substring(0, 50);            // Limit length
  
  if (tagPrefix.length > 0) {
    tagPrefix += '_';
  }
}

// Media type determines the subfolder (videos, images, audio)
const dest = path.join(__dirname, '..', 'public', 'assets', 'pixabay', mediaType, `pixabay_${tagPrefix}${id}.${ext}`);

console.log(`Downloading ${url} to ${dest}...`);

downloadAsset(url, dest)
  .then(() => console.log('Download complete!'))
  .catch((err) => console.error('Download failed:', err));
