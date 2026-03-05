// import { GoogleGenerativeAI } from "@google/generative-ai"; // Unused, using fetch directly
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Please set GEMINI_API_KEY in .env');
  process.exit(1);
}

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY); // Unused, using fetch directly

async function listModels() {
  try {
    // Fetch available models from the API to confirm access and model names.

    // Let's use a standard fetch to list models to be 100% sure what the API sees.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
    );
    const data = await response.json();

    if (data.error) {
      console.error('API Error:', data.error);
    } else {
      console.log('Available Models:');
      console.log((data.models || []).map((m: any) => m.name));
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
