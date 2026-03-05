import { orchestratorFlow } from '../src/genkit/index';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const theme = process.argv[2] || "A cyber-battle in a neon city";
  console.log("🚀 Starting Genkit Orchestrator Test for theme:", theme);
  
  try {
    const result = await orchestratorFlow(theme);
    console.log("\n✅ Success! Final Timeline generated.");
    console.log("-----------------------------------------");
    console.log("Title:", result.title);
    console.log("Assets Generated at:", result.generated_assets.generatedAt);
    console.log("Images Count:", result.generated_assets.images.length);
    console.log("Subtitle Path:", result.generated_assets.subtitles);
    console.log("First Image:", result.generated_assets.images[0]);
    console.log("-----------------------------------------");
    console.log("👉 Check 'generated_timeline.json' for full details.");
  } catch (error) {
    console.error("❌ Error running orchestrator flow:", error);
  }
}

main();
