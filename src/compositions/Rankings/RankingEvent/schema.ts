import { z } from 'zod';

export const RankingEventSchema = z.object({
  bgmStartFrom: z.number().optional().default(10),
  openingTitle1: z.string().optional().default('J.O.L'),
  openingTitle2: z.string().optional().default('ダイヤモンド'),
  openingTitle3: z.string().optional().default('ランキング'),
  openingSubtitle: z.string().optional().default('結果発表'),
  openingDate: z.string().optional().default('2026.04'),
});

export type RankingEventProps = z.infer<typeof RankingEventSchema>;
