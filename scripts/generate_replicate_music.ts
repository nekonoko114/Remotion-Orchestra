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
		"meta/musicgen:671ac645ce5e52dda61048e1d0a0ac5347248f2a6fcda7f1d060b5711b660140",
		{
			input: {
				model_version: "stereo-large",
				prompt: prompt,
				duration: duration,
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
