import dotenv from 'dotenv';
import { ElevenLabsClient } from 'elevenlabs';

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is missing in .env');
  process.exit(1);
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

async function listVoices() {
  console.log('🔍 Fetching available voices...');
  try {
    const response = await client.voices.getAll();
    console.log(`✅ Success! Found ${response.voices.length} voices.`);

    // List first 5 voices
    response.voices.slice(0, 5).forEach((voice) => {
      console.log(
        `- Name: ${voice.name}, ID: ${voice.voice_id}, Category: ${voice.category}`,
      );
    });
  } catch (error: any) {
    console.error('❌ Failed to fetch voices:', error.message || error);
    if (error.statusCode === 401) {
      console.error(
        "💡 Check your ELEVENLABS_API_KEY. It might be invalid or lacks 'voice' scope.",
      );
    }
  }
}

listVoices();
