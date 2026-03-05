import { brainstormScenarioFlow } from '../src/genkit/index';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const theme = "A futuristic cyberpunk samurai duel";
  console.log("Starting Genkit test for theme:", theme);
  
  try {
    const result = await brainstormScenarioFlow(theme);
    console.log("Success! Output:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error running flow:", error);
  }
}

main();
