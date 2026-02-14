
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();

// 仮想環境のパス (プロジェクトルートからの相対パス)
const VENV_WHISPER = path.join(process.cwd(), "venv-whisper/bin/whisper");

/**
 * BudouXを使用して、意味の切れ目を守りつつ適切な長さで区切る
 */
const splitTextNaturally = (text: string, maxLen: number = 7) => {
	const chunks = parser.parse(text);
	const results: string[] = [];
	let current = "";

	for (const chunk of chunks) {
		if (current.length + chunk.length <= maxLen || current === "") {
			current += chunk;
		} else {
			results.push(current);
			current = chunk;
		}
	}
	if (current) results.push(current);
	return results;
};

const transcribeVideo = () => {
	console.log("🚀 Kimitonara: ローカルWhisperによる文字起こしを開始します...");

	// 1. 対象の音声ファイルと一時ファイルのパス設定
	const inputAudioPath = path.join(
		process.cwd(),
		"public/assets/audio/music/君となら.mp3"
	);
	const tempWavPath = path.join(process.cwd(), "temp_kimitonara.wav");
	const outputDir = path.join(
		process.cwd(),
		"src",
		"compositions",
		"Kimitonara",
	);

	if (!fs.existsSync(inputAudioPath)) {
		console.error("❌ 音声ファイルが見つかりません:", inputAudioPath);
		return;
	}

	// 出力ディレクトリ作成
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	try {
		// 2. 音声変換 (ffmpeg) - MP3 -> WAV (16kHz mono)
		console.log("🎵 音声を変換中 (WAV 16kHz mono)...");
		execSync(
			`npx remotion ffmpeg -i "${inputAudioPath}" -ar 16000 -ac 1 -y "${tempWavPath}"`,
			{ stdio: "inherit" },
		);

		// 3. ローカルWhisper実行
		// Output format needs to be 'json' to get word timestamps
		console.log("☁️  ローカルWhisper (Turboモデル) で解析中...");
		// output_dir must be specified, it will create output_dir/temp_kimitonara.json
		execSync(
			`${VENV_WHISPER} "${tempWavPath}" --model turbo --language ja --output_format json --output_dir "${outputDir}" --word_timestamps True`,
			{ stdio: "inherit" },
		);

		// 4. BudouXによる自然な整形
		// Whisper outputs filename based on input filename. temp_kimitonara.wav -> temp_kimitonara.json
		const tempJsonPath = path.join(outputDir, "temp_kimitonara.json");
		const finalJsonPath = path.join(outputDir, "subtitles.json");

		if (fs.existsSync(tempJsonPath)) {
			console.log("📝 JSONを整形中...");
			const rawData = JSON.parse(fs.readFileSync(tempJsonPath, "utf-8"));
			
			// Extract all words from segments
			// Note: structure depends on whisper version but usually segments -> words
			let allWords: any[] = [];
			if (rawData.segments) {
				rawData.segments.forEach((seg: any) => {
					if (seg.words) {
						allWords = allWords.concat(seg.words);
					}
				});
			}

			if (allWords.length === 0) {
				console.warn("⚠️  Word timestampsが見つかりません。通常のセグメントを使用します。");
				// Fallback needed if word timestamps failed
			}

			// Clean text for BudouX
			const fullText = rawData.text.replace(/ /g, ""); 
			const semanticChunks = splitTextNaturally(fullText, 7);

			let wordIdx = 0;
			const processedSubtitles = [];

			for (const chunkText of semanticChunks) {
				let start = -1;
				let end = -1;
				let collected = "";
				
				// Try to match words to the chunk
				// This is a greedy matching.
				while (wordIdx < allWords.length) {
					const w = allWords[wordIdx];
					const wText = w.word.trim();
					
					// Simple accumulation
					if (start === -1) start = w.start;
					end = w.end;
					collected += wText;
					wordIdx++;

					if (collected.length >= chunkText.length) {
						break;
					}
				}
				
				processedSubtitles.push({
					text: chunkText,
					start,
					end
				});
			}

			fs.writeFileSync(finalJsonPath, JSON.stringify(processedSubtitles, null, 2));
			console.log(`✅ 自然な改行で整形完了: ${finalJsonPath}`);
			
			// Cleanup temp json
			fs.unlinkSync(tempJsonPath);
		} else {
			console.error("❌ Whisperの出力ファイルが見つかりません:", tempJsonPath);
		}

		// 5. Cleanup
		if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath);
		console.log("✨ 全ての処理が完了しました！");

	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
		process.exit(1);
	}
};

transcribeVideo();
