import { z } from 'zod';

export const LiverSchema = z.object({
  rank: z.number(),
  id: z.string().default(''),
  nickname: z.string().default(''),
  image_url: z.string().default(''),
  saved_to: z.string().default(''),
  score: z.number().default(0),
}).passthrough(); // data.json に追加フィールドがあっても無視

export const RankingVerticalSchema = z.object({
  bpm: z.number().default(124),
  bgmFile: z.string().default('assets/audio/music/Breathing-Lighter.mp3'),
  bgmStartFrom: z.number().default(29),
  openingVideo: z.string().default('assets/pixabay/videos/pixabay_sword_diamond_nice_hd_background_of_screen_minecra_99299.mp4'),
  rankingVideo: z.string().default('assets/pixabay/videos/pixabay_fire_flame_beautiful_wallpaper_burn_hot_smoke_feve_200715.mp4'),
  openingTitle1: z.string().default('J.O.L'),
  openingTitle2: z.string().default('ダイヤモンド'),
  openingTitle3: z.string().default('RANKING'),
  openingDate: z.string().default('2026年3月'),
  openingSubtitle: z.string().default('結果発表'),
  useGlitch: z.boolean().default(true),
  glitchIntensity: z.number().default(10),
  top3Video: z.string().default('assets/pixabay/videos/pixabay_dimension_space_psychedelic_abstract_portal_time_w_31183.mp4'),
  livers: z.array(LiverSchema),
});

export type RankingVerticalProps = z.infer<typeof RankingVerticalSchema>;
