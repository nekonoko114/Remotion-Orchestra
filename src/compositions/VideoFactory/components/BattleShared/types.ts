import { z } from 'zod';

export const BattleSpiritThemeSchema = z.object({
  themeColor: z.string(),
  glowColor: z.string(),
  particleColor1: z.string(),
  particleColor2: z.string(),
  music: z.object({
    src: z.string(),
    startFrom: z.number().optional(),
    volume: z.number().optional(),
  }),
  opponent: z.object({
    name: z.string(),
    image: z.string(),
    borderColor: z.string(),
    glowColor: z.string(),
  }),
  liver: z.object({
    name: z.string(),
    image: z.string(),
    borderColor: z.string(),
    glowColor: z.string(),
  }),
  endingText: z.string(),
  features: z.object({
    useGlitch: z.boolean(),
    useMirror: z.boolean(),
    useDoublingGrid: z.boolean(),
  }),
  lightLeakColor: z.string().optional(),
  liverIntroDuration: z.number().optional(),
  reverseVsOrder: z.boolean().optional(),
});

export type BattleSpiritTheme = z.infer<typeof BattleSpiritThemeSchema>;
