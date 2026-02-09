import fs from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const execAsync = promisify(exec);

// Configuration
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || "remotion-orchestra-449300"; // Fallback or env
const LOCATION = "us-central1";
const MODEL_ID = "veo-2.0-generate-001"; // Updated to likely valid model ID for Veo, or we can try 'veo-001-3-1' if 2.0 fails. 
// Note: As of late 2025/early 2026, Veo naming convention might vary. 
// Using a variable so it's easy to change.

async function getAccessToken() {
	try {
		const { stdout } = await execAsync("gcloud auth print-access-token");
		return stdout.trim();
	} catch (error) {
		console.error("Error getting access token:", error);
		throw new Error("Failed to get gcloud access token. Run 'gcloud auth login' first.");
	}
}

async function generateVeoVideo(prompt: string, outputPath: string) {
	console.log(`🎬 Generating Veo Video for: "${prompt}"...`);
	
	const accessToken = await getAccessToken();
	const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:predict`;

	const requestBody = {
		instances: [
			{
				prompt: prompt,
				// Veo specific parameters might include:
				// aspect_ratio: "9:16" (for portrait) or "16:9"
				// duration_seconds: 6 or 8
			}
		],
		parameters: {
			aspectRatio: "9:16", // Ranking video is vertical
			sampleCount: 1,
            video_length: "5s" // or generic parameter
		}
	};

	console.log(`Sending request to Verify AI (${MODEL_ID})...`);

	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`API Request Failed: ${response.status} ${response.statusText}\n${errorText}`);
		}

		console.log("Generation request sent successfully. Processing response...");
		
		const data = await response.json() as any;
        
        // Vertex AI Veo response structure parsing
        // Usually returns predictions[0].bytesBase64Encoded or a GCS URI
        // For this script, we'll handle Base64 which is common for smaller generations or check for a URI.
        
        let videoData: Buffer | null = null;

        if (data.predictions && data.predictions[0]) {
            const prediction = data.predictions[0];
            
            if (prediction.bytesBase64Encoded) {
                 videoData = Buffer.from(prediction.bytesBase64Encoded, 'base64');
            } else if (prediction.videoUri) {
                console.log(`Video URI returned: ${prediction.videoUri}. Downloading...`);
                // If it's a GCS URI, we might need to use gsutil or fetch if it's signed. 
                // For simplified script, assuming direct access or Base64 is preferred.
                // If it's a http link:
                if (prediction.videoUri.startsWith('http')) {
                     const vidRes = await fetch(prediction.videoUri);
                     videoData = await vidRes.buffer();
                } else {
                    console.log("Returned a GCS URI. Please ensure you have permissions or run: gsutil cp " + prediction.videoUri + " " + outputPath);
                    return;
                }
            }
        }

        if (!videoData) {
            console.log("Full Response:", JSON.stringify(data, null, 2));
            throw new Error("Could not find video data in response.");
        }

		await fs.promises.writeFile(outputPath, videoData);
		console.log(`✅ Saved Veo video to ${outputPath}`);

	} catch (error) {
		console.error("Error generating Veo video:", error);
		process.exit(1);
	}
}

const args = process.argv.slice(2);
if (args.length < 2) {
	console.log(
		"Usage: npx tsx scripts/generate_veo_video.ts <prompt> <output_path>",
	);
	process.exit(1);
}

generateVeoVideo(args[0], args[1]);
