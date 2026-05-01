import { z } from 'zod';
import { LiverSchema } from '../RankingVertical/schema';

export const RankingTimeSchema = z.object({
  data: z.array(LiverSchema).optional(),
  openingTitle2: z.string().optional(),
  openingTitle3: z.string().optional(),
  openingDate: z.string().optional(),
  themeColor: z.string().optional(),
  glowColor: z.string().optional(),
});

export type RankingTimeProps = z.infer<typeof RankingTimeSchema>;
