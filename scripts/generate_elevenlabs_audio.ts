import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// This Voice ID should ideally be configurable or passed in, but hardcoding a default is fine for now.
const ELEVENLABS_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

if (!ELEVENLABS_API_KEY) {
	console.warn(
		"⚠️ ELEVENLABS_API_KEY is missing in .env. Audio generation will be skipped.",
	);
}

interface ElevenLabsError extends Error {
	statusCode?: number;
	response?: {
		data?: unknown;
	};
}

/**
 * Helper: Write ElevenLabs response (Web Stream) to file
 */
const writeResponseToFile = async (
	response: unknown,
	outputPath: string,
): Promise<string> => {
	const fileStream = fs.createWriteStream(outputPath);

	// axios response.data is a stream when responseType: 'stream' is set
	// biome-ignore lint/suspicious/noExplicitAny: Axios stream handling is generic
	const dataStream = (response as any).data;

	return new Promise((resolve, reject) => {
		dataStream.pipe(fileStream);
		fileStream.on("finish", () => {
			resolve(outputPath);
		});
		fileStream.on("error", reject);
	});
};

/**
 * Generate Sound Effect (SFX) using ElevenLabs
 */
const generateSFX = async (
	text: string,
	outputPath: string,
): Promise<string> => {
	if (!ELEVENLABS_API_KEY) return "";

	console.log(`🔊 Generating SFX: "${text}"`);

	try {
		const response = await axios.post(
			"https://api.elevenlabs.io/v1/sound-generation",
			{
				text: text,
				duration_seconds: 2, // Short duration for SFX
				prompt_influence: 0.3,
			},
			{
				headers: {
					"xi-api-key": ELEVENLABS_API_KEY,
					"Content-Type": "application/json",
				},
				responseType: "stream",
			},
		);

		await writeResponseToFile(response, outputPath);
		console.log(`✅ SFX saved to: ${outputPath}`);
		return outputPath;
	} catch (error: unknown) {
		const err = error as ElevenLabsError;
		const msg = err.message || String(err);
		console.error("❌ Failed to generate SFX:", msg);
		if (err.statusCode === 401) {
			console.error("   Reason: Unauthorized. Check API Key.");
		}
		return "";
	}
};

/**
 * Generate Voice Speech using ElevenLabs
 */
const generateVoice = async (
	text: string,
	outputPath: string,
): Promise<string> => {
	if (!ELEVENLABS_API_KEY) return "";

	console.log(`🗣️ Generating Voice: "${text}"`);

	try {
		const response = await axios.post(
			`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
			{
				text: text,
				model_id: "eleven_monolingual_v1",
				voice_settings: {
					stability: 0.5,
					similarity_boost: 0.75,
				},
			},
			{
				headers: {
					"xi-api-key": ELEVENLABS_API_KEY,
					"Content-Type": "application/json",
				},
				responseType: "stream",
			},
		);

		await writeResponseToFile(response, outputPath);
		console.log(`✅ Voice saved to: ${outputPath}`);
		return outputPath;
	} catch (error: unknown) {
		const err = error as ElevenLabsError;
		const msg = err.message || String(err);
		console.error("❌ Failed to generate Voice:", msg);
		if (err.statusCode === 401) {
			console.error("   Reason: Unauthorized. Check API Key.");
		}
		return "";
	}
};

async function main() {
	const type = process.argv[2]; // 'sfx' | 'voice' | 'music'
	const prompt = process.argv[3];
	const outputPath = process.argv[4];

	if (!type || !prompt || !outputPath) {
		console.error(
			"Usage: npx ts-node scripts/generate_elevenlabs_audio.ts <type> <prompt> <outputPath>",
		);
		process.exit(1);
	}

	// Ensure directory
	const dir = path.dirname(outputPath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

	try {
		if (type === "sfx") {
			await generateSFX(prompt, outputPath);
		} else if (type === "voice") {
			await generateVoice(prompt, outputPath);
		} else if (type === "music") {
			console.warn(
				"⚠️ Music generation via ElevenLabs script is currently disabled/placeholder.",
			);
		} else {
			console.error(`Unknown type: ${type}`);
		}
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`❌ Script failed: ${message}`);
		process.exit(1);
	}
}

main();
