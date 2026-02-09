import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import Replicate from "replicate";
import recipe from "./nova_fix_recipe.json";

dotenv.config();

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

const OUTPUT_DIR = path.join(process.cwd(), "public/assets/generated/nanobana");

async function downloadFile(url: string, destPath: string) {
	const response = await fetch(url);
	if (!response.ok)
		throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	await fs.promises.writeFile(destPath, buffer);
	console.log(`Saved: ${destPath}`);
}

async function generateImage(item: any) {
    const outputPath = path.join(OUTPUT_DIR, item.filename);
    
    // We overwrite existing files as per plan
    console.log(`Generating ${item.scene} -> ${item.filename}...`);
    console.log(`Prompt: ${item.prompt}`);

	try {
		const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
			input: {
				prompt: item.prompt,
				aspect_ratio: "16:9",
				output_format: "png",
				output_quality: 90,
				safety_tolerance: 2,
			},
		});

		const imageUrl = Array.isArray(output)
			? (output as any[])[0]
			: (output as unknown as string);

        if (!imageUrl) {
            throw new Error("No image URL returned");
        }

		await downloadFile(imageUrl, outputPath);
        console.log(`Successfully generated ${item.filename}`);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(`Error generating ${item.scene}:`, errorMessage);
	}
}

async function main() {
    console.log("Starting Nova Fix Regeneration...");
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const item of recipe) {
        await generateImage(item);
        console.log("Waiting 10s to avoid rate limits...");
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
    console.log("All done!");
}

main().catch(console.error);
