import { z } from 'genkit';

// 利用可能なエフェクトのリスト（元のスクリプトの定義を利用）
export const EFFECTS = [
  'zoom_and_glitch',
  'split_vertical_slide',
  'camera_shake_with_particles',
  'awakening_flash',
  'dim_and_focus',
] as const;

// 利用可能なトランジションのリスト
export const TRANSITIONS = [
  'SeismicImpactSlam',
  'HyperdriveSingularity',
  'NeuralGlitchOverload',
  'VortexShredder',
  'SolarProminenceBurst',
  'AbyssGravityFall',
  'DimensionalRiftTear',
  'CyberPuncture',
  'KineticCrashBounce',
  'TectonicPlateShift',
  'PrismShatterBlast',
  'QuantumPhaseDisruption',
  'DataVoidInferno',
  'MagmaticMeltdown',
  'CircularReveal',
  'CubeTransition',
  'FlipTransition',
  'GlitchTransition',
  'ZoomBlurTransition',
  'HyperSpinTransition',
  'Wipe',
  'CrossDissolve',
  'FlashTransition',
] as const;

export const COLOR_THEMES = [
  'neon_blue',
  'vibrant_magenta',
  'fire_and_ice',
  'electric_gold',
  'monochrome_highlight',
] as const;

// タイムラインの各シーンの定義
export const SceneSchema = z.object({
  id: z.number().describe('シーンの一意なID (1から連番)'),
  label: z.string().describe('シーン名（例: Opening, Climax, Ending）'),
  effect: z.enum(EFFECTS).describe('シーン内で使用するエフェクト'),
  transition: z.enum(TRANSITIONS).optional().describe('次のシーンへ移行する際のトランジション（最終シーンは不要）'),
  text_primary: z.string().describe('画面中央または大きく表示するメインテキスト'),
  text_secondary: z.string().describe('補足的なサブテキスト'),
  color_theme: z.enum(COLOR_THEMES).describe('シーンの全体のカラートーン'),
  duration_frames: z.number().describe('このシーンの継続時間（フレーム数。例: 150）').default(150),
  start_frame: z.number().optional().describe('シーンの開始フレーム（システムで自動計算）'),
  end_frame: z.number().optional().describe('シーンの終了フレーム（システムで自動計算）'),
});

// アセット生成用のプロンプト群
export const AssetPromptsSchema = z.object({
  music: z.string().optional().describe('BGM生成用のプロンプト (英語)'),
  sfx: z.string().optional().describe('効果音(SFX)生成用のプロンプト (英語)'),
  images: z.array(z.string()).describe('Nanobanana用の画像生成プロンプトの配列 (英語)'),
  description: z.string().describe('作品全体のビジュアルスタイルの記述 (英語)'),
});

// 生成されたアセット情報の定義
export const GeneratedAssetsSchema = z.object({
  id: z.string().describe('アセットセットの一意なID'),
  music: z.string().nullable().describe('使用されたBGMのパス'),
  images: z.array(z.string()).describe('生成された画像のパスの配列'),
  subtitles: z.string().nullable().describe('生成された字幕情報のパス (JSON)'),
  voice: z.string().nullable().describe('生成された音声のパス'),
  generatedAt: z.string().describe('生成日時 (ISO形式)'),
});

// 動画の構成（シナリオ）全体のスキーマ
export const ScenarioSchema = z.object({
  title: z.string().describe('動画のタイトル'),
  concept: z.string().describe('動画作品のコンセプト解説'),
  timeline: z.array(SceneSchema).describe('動画を構成するシーンの配列（時間順）'),
  asset_prompts: AssetPromptsSchema.describe('各メディアを生成するためのAIプロンプト'),
});

// 最終的なオーケストレーション結果のスキーマ
export const OrchestraTimelineSchema = ScenarioSchema.extend({
  generated_assets: GeneratedAssetsSchema.describe('実際に生成されたアセットのパス情報'),
});

export type ScenarioResult = z.infer<typeof ScenarioSchema>;
export type OrchestraTimelineResult = z.infer<typeof OrchestraTimelineSchema>;
