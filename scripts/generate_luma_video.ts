import fs from "node:fs";
import dotenv from "dotenv";
import { LumaAI } from "lumaai";
import fetch from "node-fetch";

dotenv.config();

const client = new LumaAI({
	authToken: process.env.LUMA_API_KEY,
});

async function generateVideo(prompt: string, outputPath: string) {
	console.log(`Creating Luma generation for: "${prompt}"`);

	let generation = await client.generations.create({
		prompt: prompt,
		model: "ray-2",
		aspect_ratio: "16:9", // Standard for YouTube/Remotion 1920x1080
	});

	console.log(
		`Generation started (ID: ${generation.id}). Waiting for completion...`,
	);

	const pollInterval = 5000;
	while (generation.state !== "completed" && generation.state !== "failed") {
		await new Promise((resolve) => setTimeout(resolve, pollInterval));
		generation = await client.generations.get(generation.id as string);
		console.log(`Current state: ${generation.state}...`);
	}

	if (generation.state === "failed") {
		throw new Error(`Generation failed: ${generation.failure_reason}`);
	}

	const videoUrl = generation.assets?.video;
	if (!videoUrl) throw new Error("No video URL found in completed generation.");

	console.log("Downloading video...");
	const response = await fetch(videoUrl);
	const buffer = await response.buffer();
	await fs.promises.writeFile(outputPath, buffer);
	console.log(`Saved to ${outputPath}`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
	console.log(
		"Usage: npx tsx scripts/generate_luma_video.ts <prompt> <output_path>",
	);
	process.exit(1);
}

generateVideo(args[0], args[1]).catch(console.error);
