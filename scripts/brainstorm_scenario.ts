import fs from "node:fs";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// --- System Prompts with Soul ---

const EFFECTS = [
	"BurningText", "ChromaticAberration", "CinematicTitle", "Confetti", "DigitalRain",
	"Dust", "Explosion", "GeometricMask", "GlitchEffect", "HeatDistortion",
	"HighlightText", "HolographicHUD", "HyperShake", "ImpactShockwave", "KenBurns",
	"KineticText", "LensFlare", "LightningBolt", "LiquidBlob", "MotionContainer",
	"NeonGlowText", "NetworkGraph", "NumberCounter", "ParticleText", "PixelateContainer",
	"ProgressBar", "RadarInterface", "Rain", "RealisticFireText", "RoughSketch",
	"ShootingStar", "SmokeEffect", "Snow", "SplitScreen", "ThreeDText", "Typewriter",
	"UltraText", "VHSEffect", "WavesContainer", "WiggleContainer"
];

const TRANSITIONS = [
	"SeismicImpactSlam", "HyperdriveSingularity", "NeuralGlitchOverload", "VortexShredder",
	"SolarProminenceBurst", "AbyssGravityFall", "DimensionalRiftTear", "CyberPuncture",
	"KineticCrashBounce", "TectonicPlateShift", "PrismShatterBlast", "QuantumPhaseDisruption",
	"DataVoidInferno", "MagmaticMeltdown", "CircularReveal", "CubeTransition",
	"FlipTransition", "GlitchTransition", "ZoomBlurTransition", "HyperSpinTransition",
	"Wipe", "CrossDissolve", "FlashTransition"
];

const SCRIPTWRITER_SYSTEM_PROMPT = `
あなたは論理的かつ創造的な脚本家「Scriptwriter」です。
ユーザーのテーマから、Remotion動画のための「構成データ(JSON)」を作成するのが仕事です。

以下の「利用可能なエフェクト」と「トランジション」のリストから最適なものを選択してください。
架空のエフェクト名は使用しないでください。

【利用可能なエフェクト (effects)】:
${EFFECTS.join(", ")}

【利用可能なトランジション (transitions)】:
${TRANSITIONS.join(", ")}

JSONの出力フォーマットは厳密に以下を守ってください。余計なマークダウンは不要です。
JSON構造:
{
  "title": "タイトル",
  "concept": "作品のコンセプト解説",
  "timeline": [
    {
      "id": 1,
      "label": "scene_name",
      "effect": "エフェクト名",
      "transition": "トランジション名（場面転換時に使用。最後のシーンは不要）",
      "text_primary": "表示テキスト",
      "text_secondary": "サブテキスト",
      "color_theme": "neon_blue" | "vibrant_magenta" | "fire_and_ice" | "electric_gold" | "monochrome_highlight",
      "duration_frames": 150
    }
  ],
  "asset_prompts": {
    "music": "Music generation prompt (English)",
    "sfx": "SFX generation prompt (English)",
    "video": "Visual style description (English)",
    "voice": "Narration text (Japanese)"
  }
}
`;

const TECHNICAL_REVIEW_PROMPT = `
あなたはテクニカル・レビュアー「Code Guard」です。
脚本家が作成したJSONが、開発環境で使用可能なコンポーネントのみを使用しているかチェックします。

使用可能なリスト:
Effects: ${EFFECTS.join(", ")}
Transitions: ${TRANSITIONS.join(", ")}

もしリストにないエフェクト名やトランジション名が含まれている場合は、修正案を提示してください。
問題がない場合は「PASS」とだけ答えてください。
`;

const EMOTION_DIRECTOR_SYSTEM_PROMPT = `
あなたは感情演出家「Emotion Director」です。
脚本家が書いた構成案に対し、視聴者の心に響くかという観点からフィードバックを行います。
特に「インパクト」「緩急」「ストーリー性」を重視してください。
`;

async function main() {
	const userTheme = process.argv[2];
	if (!userTheme) {
		console.error("❌ Theme is required.");
		process.exit(1);
	}

	console.log(`\n🧠 [The Brain] Activated. Theme: "${userTheme}"`);

	// Round 1: Scriptwriter Draft
	console.log("✍️ [Scriptwriter] Drafting initial scenario...");
	const draftCompletion = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: SCRIPTWRITER_SYSTEM_PROMPT },
			{ role: "user", content: `テーマ: ${userTheme}` },
		],
		response_format: { type: "json_object" },
	});
	const draftJson = JSON.parse(draftCompletion.choices[0].message.content || "{}");

	// Round 2: Technical Review
	console.log("🛠️ [Code Guard] Validating components...");
	const techReview = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: TECHNICAL_REVIEW_PROMPT },
			{ role: "user", content: JSON.stringify(draftJson) },
		],
	});
	const techFeedback = techReview.choices[0].message.content;
	console.log(techFeedback === "PASS" ? "✅ Components Verified." : `⚠️ Tech Feedback: ${techFeedback}`);

	// Round 3: Emotion Review
	console.log("❤️ [Emotion Director] Reviewing impact...");
	const emotionReview = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: EMOTION_DIRECTOR_SYSTEM_PROMPT },
			{ role: "user", content: JSON.stringify(draftJson) },
		],
	});
	const emotionFeedback = emotionReview.choices[0].message.content;

	// Round 4: Final Refinement
	console.log("✨ [Scriptwriter] Finalizing scenario...");
	const finalCompletion = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: SCRIPTWRITER_SYSTEM_PROMPT },
			{ role: "user", content: `修正前: ${JSON.stringify(draftJson)}\n技術FB: ${techFeedback}\n演出FB: ${emotionFeedback}\n\nこれらを反映した最終版JSON。` },
		],
		response_format: { type: "json_object" },
	});
	const finalJson = JSON.parse(finalCompletion.choices[0].message.content || "{}");

	// Auto-calculation of frames
	let currentFrame = 0;
	finalJson.timeline = finalJson.timeline.map((scene: any, i: number) => {
		const duration = scene.duration_frames || 150;
		const s = { ...scene, id: i + 1, start_frame: currentFrame, end_frame: currentFrame + duration };
		currentFrame += duration;
		return s;
	});

	// 4. ファイル保存
	const OUTPUT_FILE = "src/ai_scenario.json";
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalJson, null, 2));

	console.log(`\n✅ Scenario Brainstorming Complete!`);
	console.log(`📂 Output saved to: ${OUTPUT_FILE}`);
	console.log(`👉 Next step: Run 'npx ts-node scripts/generate_assets_for_timeline.ts' to generate images and BGM.`);
}

main().catch(console.error);
