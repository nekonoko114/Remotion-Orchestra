import { z } from 'zod';

export const LiverSchema = z.object({
  rank: z.number(),
  id: z.string().optional(),
  username: z.string().optional(),
  image_url: z.string().optional(),
  saved_to: z.string().optional(),
  ok: z.boolean().optional(),
  error: z.string().nullable().optional(),
  user_id: z.string().optional(),
  unique_id: z.string().optional(),
  nickname: z.string().optional(),
  signature: z.string().nullable().optional(),
  creator_account: z.string().optional(),
  creator_name: z.string().optional(),
  content: z.string().nullable().optional(),
});

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
