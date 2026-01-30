import fs from "node:fs";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Replicate from "replicate";

dotenv.config();

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

async function generateMusic(
	prompt: string,
	duration: number,
	outputPath: string,
) {
	console.log(`Generating music for: "${prompt}" (${duration}s)`);

	const output: any = await replicate.run(
		"stability-ai/stable-audio-open:d350b984e9115bc05972ed883ba8a6d654924c8b3658510bf22ba794eb84826b",
		{
			input: {
				prompt: prompt,
				seconds_total: duration,
			},
		},
	);

	console.log("Generation complete, downloading...");
	const response = await fetch(output);
	const buffer = await response.buffer();
	await fs.promises.writeFile(outputPath, buffer);
	console.log(`Saved to ${outputPath}`);
}

const args = process.argv.slice(2);
if (args.length < 3) {
	console.log(
		"Usage: npx tsx scripts/generate_replicate_music.ts <prompt> <duration> <output_path>",
	);
	process.exit(1);
}

generateMusic(args[0], Number.parseInt(args[1]), args[2]).catch(console.error);
