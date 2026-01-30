import { execSync } from "node:child_process"; // コマンド実行用
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

// ▼▼▼ ここにAPIキーをセット ▼▼▼
const OPENAI_API_KEY =
	"process.env.OPENAI_API_KEY";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const transcribeVideo = async () => {
	console.log("🚀 文字起こしプロセスを開始します...");

	// 1. 元の動画ファイルのパス
	const videoPath = path.join(
		process.cwd(),
		"public",
		"liver-formatter",
		"video",
		"test-video.MOV",
	);

	// 2. 一時的なWAVファイルのパス (Whisperに最適な形式)
	const audioPath = path.join(process.cwd(), "temp_audio.wav");

	if (!fs.existsSync(videoPath)) {
		console.error("❌ 動画ファイルが見てかりません:", videoPath);
		return;
	}

	try {
		// 3. FFmpegを使って動画から音声を抽出 (16kHz, mono, WAV)
		console.log("🎵 動画から音声を抽出中 (WAV 16kHz mono)...");
		execSync(
			`npx remotion ffmpeg -i "${videoPath}" -ar 16000 -ac 1 -y "${audioPath}"`,
			{ stdio: "ignore" },
		);
		console.log("✨ 音声抽出完了: temp_audio.wav");

		// 4. APIリクエスト (Whisper)
		console.log("☁️ OpenAI Whisperで文字起こし中...");
		const file = fs.createReadStream(audioPath);

		const transcription = await openai.audio.transcriptions.create({
			file: file,
			model: "whisper-1",
			response_format: "verbose_json",
			language: "ja",
			timestamp_granularities: ["segment", "word"],
			prompt:
				"5、4、3、2、1。Genesis合同会社。求人案件、月給、25万円、30万円、35万円、業務委託、常勤、週5勤、期間工、催事場、キャンペーン、DMをお待ちしております。",
			temperature: 0,
		});

		// 5. GPT-4oによるAI校正ステップ
		console.log("🤖 GPT-4oによる文字の詳細校正を開始...");

		const aiResponse = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content: `あなたはプロの動画テロップ製作者です。
音声認識の結果（JSON形式のwords配列）を受け取り、各単語に対して「実際の発話（word）」と「表示用の短縮テキスト（display）」を生成してください。

【出力ルール】
1. **word（維持）**: 実際の話している言葉をそのまま維持してください。これは動画のカットに使用するため、一字一句削らないでください。「〜となっておりまして」等の語尾もそのまま残してください。
2. **display（テロップ用）**:
   - 冗長な語尾（「〜となっておりまして」「〜というよりかは」等）を削り、体言止めや短い表現に変換してください。
   - 「給付案件」→「求人案件」などの誤字修正もここで行ってください。
   - 例: { "word": "なりまして、", "display": "なり" }
   - 例: { "word": "というよりかは、", "display": "というより" }
   - 特筆すべき変更がない場合は、wordと同じ値をセットしてください。

出力は、JSONオブジェクト {"words": [{ "word": "...", "display": "...", "start": 0, "end": 1 }, ...]} の形式のみを返してください。`,
				},
				{
					role: "user",
					content: JSON.stringify(transcription.words),
				},
			],
			response_format: { type: "json_object" },
		});

		let refinedWords = JSON.parse(
			aiResponse.choices[0].message.content || "{}",
		).words;

		// 6. 強制修正（セーフティネット）
		const hardReplacements: Record<string, string> = {
			給付案件: "求人案件",
			給保案件: "求人案件",
			"25番": "25万",
			上金: "常勤",
			週5金: "週5勤",
			周5金: "週5勤",
			採地場: "催事場",
			ジェネシス: "Genesis",
		};

		const finalCorrect = (text: string) => {
			let result = text;
			Object.entries(hardReplacements).forEach(([bad, good]) => {
				result = result.replace(new RegExp(bad, "g"), good);
			});
			return result;
		};

		if (refinedWords) {
			refinedWords = refinedWords.map((w: any) => ({
				...w,
				// displayプロパティを確実に適用し、なければwordを使用
				display: finalCorrect(w.display || w.word),
				word: finalCorrect(w.word), // 発話も一応誤字修正だけは通しておく
			}));

			transcription.words = refinedWords;
			// text成分はdisplay（テロップ用）で構成
			transcription.text = refinedWords.map((w: any) => w.display).join("");

			transcription.segments = transcription.segments.map((s) => {
				const segWords = refinedWords.filter(
					(w: any) => w.start >= s.start && w.end <= s.end,
				);
				return {
					...s,
					text: segWords.map((w: any) => w.display).join(""),
				};
			});
		}

		console.log("✅ AI校正および「発話・表示」分離処理が完了しました！");

		// 5. 結果をJSON保存
		const outputPath = path.join(
			process.cwd(),
			"src",
			"compositions",
			"LiverFormatter",
			"subtitles.json",
		);
		fs.writeFileSync(outputPath, JSON.stringify(transcription, null, 2));

		// 6. 後片付け
		if (fs.existsSync(audioPath)) {
			fs.unlinkSync(audioPath);
		}

		console.log(`📂 データ保存完了: ${outputPath}`);
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
	}
};

transcribeVideo();
