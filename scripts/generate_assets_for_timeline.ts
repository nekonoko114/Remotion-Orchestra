import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import Replicate from "replicate";
// Use the unified scenario file
import scenarioData from "../src/ai_scenario.json";
import type { Scene } from "../src/types/schema";

dotenv.config();

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

const TIMELINE_FILE = path.join(process.cwd(), "src/ai_scenario.json");
const OUTPUT_DIR_BASE = path.join(process.cwd(), "public/assets/images/generated");
const OUTPUT_DIR_AUDIO = path.join(process.cwd(), "public/assets/audio/music");

async function downloadFile(url: string, destPath: string) {
	const response = await fetch(url);
	if (!response.ok)
		throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	await fs.promises.writeFile(destPath, buffer);
	console.log(`Saved: ${destPath}`);
}

async function generateImageForScene(
	scene: Scene,
	basePrompt: string,
	projectId: string
): Promise<string | null> {
	const prompt = `Cinematic shot, masterpiece, 8k, highly detailed. ${basePrompt}. Scene: ${scene.label}. Context: ${scene.text_primary}. ${scene.color_theme} lighting.`;
	// Unique ID for asset mapping
	const assetId = `scene_${scene.id}`;
	const filename = `${assetId}.jpg`;
	
	const projectDir = path.join(OUTPUT_DIR_BASE, projectId);
	if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });
	
	const outputPath = path.join(projectDir, filename);

	if (fs.existsSync(outputPath)) {
		console.log(`Image already exists for asset ${assetId}, skipping...`);
		return assetId;
	}

	console.log(`Generating image for Scene ${scene.id} in project ${projectId}...`);
	try {
		const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
			input: {
				prompt: prompt,
				aspect_ratio: "16:9",
				output_format: "jpg",
				output_quality: 90,
				safety_tolerance: 2,
			},
		});

		const imageUrl = Array.isArray(output)
			? (output as any[])[0]
			: (output as unknown as string);

		await downloadFile(imageUrl, outputPath);
		return assetId;
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(`Error generating image for scene ${scene.id}:`, errorMessage);
		return null;
	}
}

async function generateBGM(
	prompt: string,
	duration: number,
): Promise<string | null> {
	const filename = "bgm_generated.mp3";
	const outputPath = path.join(OUTPUT_DIR_AUDIO, filename);

	if (fs.existsSync(outputPath)) {
		console.log("BGM already exists, skipping...");
		return `assets/audio/music/${filename}`;
	}

	console.log(`Generating BGM for prompt: "${prompt}" (${duration}s)...`);
	try {
		const output = await replicate.run(
			"meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcf9",
			{
				input: {
					prompt: prompt,
					model_version: "large",
					duration: Math.min(duration, 30),
					continuation: false,
				},
			},
		);

		await downloadFile(output as unknown as string, outputPath);
		return `assets/audio/music/${filename}`;
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("Error generating BGM:", errorMessage);
		return null;
	}
}

async function main() {
	console.log("Starting asset generation for scenario...");

	const data = scenarioData as any;
	// Handle missing project ID
	const projectId = data.project?.id || "General";
	
	const basePrompt = data.asset_prompts?.video || "Cinematic video";
	const timeline = data.timeline || [];

	if (!data.generated_assets) {
		data.generated_assets = {
			id: projectId,
			prompt: basePrompt,
			music: null,
			sfx: null,
			voice: null,
			video: null,
			generatedAt: new Date().toISOString(),
			scene_images: {}
		};
	}

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	for (const scene of timeline) {
		const assetId = await generateImageForScene(scene, basePrompt, projectId);
		if (assetId) {
			// Update the scene but also the registry if used
			scene.content_asset_id = assetId;
			if (data.generated_assets.scene_images) {
				data.generated_assets.scene_images[scene.id] = assetId;
			}
		}
		// Reduced wait time for development if needed, but keeping 5s for safety
		await delay(5000);
	}

	// 2. Generate BGM
	if (!data.generated_assets.music) {
		const lastScene = timeline[timeline.length - 1];
		const totalFrames = lastScene?.end_frame || 300;
		const durationSeconds = Math.ceil(totalFrames / 30);
		const bgmPrompt = data.asset_prompts?.music || "Atmospheric music";
		
		const musicPath = await generateBGM(bgmPrompt, durationSeconds);
		if (musicPath) {
			data.generated_assets.music = musicPath;
			// Also add to audioTracks for JsonVideoEngine
			if (!data.audioTracks) data.audioTracks = [];
			data.audioTracks.push({ src: musicPath, volume: 0.5 });
		}
	}

	// 3. Update JSON
	fs.writeFileSync(TIMELINE_FILE, JSON.stringify(data, null, 2));
	console.log(`Scenario JSON updated with assets in ${TIMELINE_FILE}`);
}

main().catch(console.error);
