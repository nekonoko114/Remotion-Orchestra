import dotenv from 'dotenv';
import Replicate from 'replicate';

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const candidates = [
  'wan-video/wan-2.1-t2v-14b',
  'wavespeedai/wan-2.1-t2v-14b',
  'wavespeedai/wan-2.1-t2v-720p',
  'cjwbw/wan-2.1-t2v-14b',
  'ali-vilab/text-to-video-ms-1.7b', // Fallback lookup
];

async function check() {
  console.log('Checking for Wan 2.1 models on Replicate...');
  for (const modelId of candidates) {
    try {
      const [owner, name] = modelId.split('/');
      // @ts-ignore
      const model = await replicate.models.get(owner, name);
      console.log(`✅ Found: ${modelId}`);
      if (model.latest_version) {
        console.log(`   Latest version ID: ${model.latest_version.id}`);
      } else {
        // If latest_version is not populated directly, listed versions might be needed
        console.log('   (Model found but latest_version info might be hidden)');
      }
    } catch (e: any) {
      console.log(`❌ Not found: ${modelId} (${e.message})`);
    }
  }
}

check();
