import fs from "node:fs";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function generateTTS(text: string, outputPath: string) {
	console.log(`Generating TTS for: "${text}"`);

	const mp3 = await openai.audio.speech.create({
		model: "tts-1",
		voice: "alloy",
		input: text,
	});

	const buffer = Buffer.from(await mp3.arrayBuffer());
	await fs.promises.writeFile(outputPath, buffer);
	console.log(`Saved to ${outputPath}`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
	console.log(
		"Usage: npx tsx scripts/generate_openai_tts.ts <text> <output_path>",
	);
	process.exit(1);
}

generateTTS(args[0], args[1]).catch(console.error);
