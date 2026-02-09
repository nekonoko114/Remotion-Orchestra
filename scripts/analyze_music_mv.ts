import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
	console.error("❌ Error: OPENAI_API_KEY is not set.");
	process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const analyzeMusic = async () => {
	const musicPath = path.join(process.cwd(), "public/assets/audio/music/並んだままで.mp3");
	const outputPath = path.join(process.cwd(), "src/compositions/NarandaMamade/music_analysis.json");

	if (!fs.existsSync(musicPath)) {
		console.error("❌ Music file not found:", musicPath);
		return;
	}

	console.log(`🎵 Analyzing: ${musicPath}...`);

	try {
		const file = fs.createReadStream(musicPath);

		console.log("☁️  Transcribing with OpenAI Whisper (verbose_json)...");
		const transcription = await openai.audio.transcriptions.create({
			file: file,
			model: "whisper-1",
			response_format: "verbose_json",
			language: "ja",
			timestamp_granularities: ["segment", "word"],
		});

		fs.writeFileSync(outputPath, JSON.stringify(transcription, null, 2));
		console.log(`✅ Analysis complete! Saved to: ${outputPath}`);
	} catch (error) {
		console.error("❌ Error during analysis:", error);
	}
};

analyzeMusic();
