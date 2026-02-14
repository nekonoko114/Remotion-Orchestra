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
		// 現在の塊に足しても制限内、もしくは最初の一つ目なら足す
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
	console.log("🚀 ローカルWhisperによる文字起こしを開始します...");

	// 1. 対象の動画ファイルと一時ファイルのパス設定
	const videoPath = path.join(
		process.cwd(),
		"public",
		"liver-formatter",
		"video",
		"test-video.MOV",
	);
	const audioPath = path.join(process.cwd(), "temp_audio.wav"); // Whisper推奨のWAV
	// ここでは Soregayasashisa のディレクトリに書き出すように変更します
	const outputDir = path.join(
		process.cwd(),
		"src",
		"compositions",
		"Soregayasashisa",
	);

	if (!fs.existsSync(videoPath)) {
		console.error("❌ 動画ファイルが見つかりません:", videoPath);
		return;
	}

	try {
		// 2. 音声抽出 (ffmpeg)
		console.log("🎵 動画から音声を抽出中 (WAV 16kHz mono)...");
		execSync(
			`npx remotion ffmpeg -i "${videoPath}" -ar 16000 -ac 1 -y "${audioPath}"`,
			{ stdio: "inherit" },
		);

		// 3. ローカルWhisper実行
		console.log("☁️  ローカルWhisper (Turboモデル) で解析中...");
		execSync(
			`${VENV_WHISPER} "${audioPath}" --model turbo --language ja --output_format json --output_dir "${outputDir}" --word_timestamps True`,
			{ stdio: "inherit" },
		);

		// 4. BudouXによる自然な整形
		const tempJsonPath = path.join(outputDir, "temp_audio.json");
		const finalJsonPath = path.join(outputDir, "subtitles.json");

		if (fs.existsSync(tempJsonPath)) {
			const rawData = JSON.parse(fs.readFileSync(tempJsonPath, "utf-8"));
			const allWords = rawData.segments.flatMap((s: any) => s.words);
			
			// 全文をBudouXで「意味のある塊」に分ける（ターゲット：5〜8文字）
			const fullText = rawData.text.replace(/ /g, ""); // Whisperの空白を除去
			const semanticChunks = splitTextNaturally(fullText, 7);

			let wordIdx = 0;
			const processedSubtitles = semanticChunks.map((chunkText) => {
				let start = -1;
				let end = -1;
				let collected = "";

				// このchunkTextに一致する単語を見つけるまでwordsをスキャン
				while (wordIdx < allWords.length && collected.length < chunkText.length) {
					const w = allWords[wordIdx];
					if (start === -1) start = w.start;
					end = w.end;
					collected += w.word.trim();
					wordIdx++;
				}

				return {
					text: chunkText,
					start,
					end,
				};
			});

			fs.writeFileSync(finalJsonPath, JSON.stringify(processedSubtitles, null, 2));
			console.log(`✅ 自然な改行で整形完了: ${finalJsonPath}`);
			
			// 一時ファイルを削除
			fs.unlinkSync(tempJsonPath);
		} else {
			console.error("❌ Whisperの出力ファイルが見つかりません。");
		}

		// 5. 後片付け
		if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
		console.log("✨ 全ての処理が完了しました！");

	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
		process.exit(1);
	}
};

transcribeVideo();
