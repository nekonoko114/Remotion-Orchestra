import { z } from 'zod';

export const LiverSchema = z.object({
  rank: z.number(),
  id: z.string().default(''),
  nickname: z.string().default(''),
  image_url: z.string().default(''),
  saved_to: z.string().default(''),
  score: z.number().default(0),
}).passthrough();

export const RankingRoyalSchema = z.object({
  bpm: z.number().default(124), // TODO: BGMに合わせて変更可能
  bgmFile: z.string().default('assets/audio/music/Improba.mp3'),
  bgmStartFrom: z.number().default(29),
  // ランキング全体の背景: ダイヤモンド・ジュエリーの雨
  rankingVideo: z.string().default('assets/pixabay/videos/pixabay_diamonds_jewels_rain_falling_wealth_value_money_cr_3125.mp4'),
  openingTitle1: z.string().default('J.O.L'),
  openingTitle2: z.string().default('ダイヤモンド'),
  openingTitle3: z.string().default('ランキング'),
  openingDate: z.string().default('2026年4月'),
  openingSubtitle: z.string().default('結果発表'),
  useGlitch: z.boolean().default(false), // ラグジュアリーなのでグリッチはデフォルトOFF
  glitchIntensity: z.number().default(0),
  // Top1発表用: ダイヤモンドやクリスタルの神秘的な背景を想定（不要のため削除）
  top3Video: z.string().default(''),
  livers: z.array(LiverSchema),
});

export type RankingRoyalProps = z.infer<typeof RankingRoyalSchema>;
