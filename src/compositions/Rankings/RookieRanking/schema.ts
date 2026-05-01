import { z } from 'zod';

export const RookieRankingSchema = z.object({
  bpm: z.number().default(135),
  bgmFile: z.string().default('assets/audio/music/Gold_Medal_Rush.mp3'),
});

export type RookieRankingProps = z.infer<typeof RookieRankingSchema>;
