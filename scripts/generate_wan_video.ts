import fs from "node:fs";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Replicate from "replicate";

dotenv.config();

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

async function generateWanVideo(prompt: string, outputPath: string) {
	console.log(`🎬 Generating Wan 2.1 Video for: "${prompt}"...`);
	console.log("Using model: wavespeedai/wan-2.1-t2v-720p");

	const input = {
		prompt: prompt,
		// aspect_ratio: "16:9" // Uncomment if supported and needed
	};

	try {
		const output = await replicate.run(
			"wavespeedai/wan-2.1-t2v-720p:f5576aa30f5d363b6cfa6ff8193de59a32c0f8bee3c73cdf17df92844a8b5570",
			{ input },
		);

		console.log("Generation complete!");
		// Wan output is typically a ReadableStream or URL string
		const videoUrl = Array.isArray(output) ? output[0] : output;

		// Check if it's a stream (Replicate sometimes returns streams)
		if (typeof videoUrl !== "string" && videoUrl) {
			console.log("Output is a stream, handling extraction...");
			// Handling string case first, complex stream handling might be needed if not URL
		}

		console.log(`Video URL: ${videoUrl}`);

		if (!videoUrl || typeof videoUrl !== "string") {
			throw new Error("No valid output URL returned.");
		}

		console.log("Downloading video...");
		const response = await fetch(videoUrl);
		if (!response.ok)
			throw new Error(`Failed to download: ${response.statusText}`);

		// @ts-ignore - node-fetch buffer()
		const buffer = await response.buffer();
		await fs.promises.writeFile(outputPath, buffer);
		console.log(`✅ Saved Wan video to ${outputPath}`);
	} catch (error: unknown) {
		console.error("Error generating Wan video:", error);
		process.exit(1);
	}
}

const args = process.argv.slice(2);
if (args.length < 2) {
	console.log(
		"Usage: npx tsx scripts/generate_wan_video.ts <prompt> <output_path>",
	);
	process.exit(1);
}

generateWanVideo(args[0], args[1]);
