import { z } from 'zod';

export const EffectStackConfigSchema = z.object({
  src: z.string(),
  opacity: z.number().optional().default(0.65),
  blendMode: z.string().optional().default('screen'),
  zIndex: z.number().optional().default(10),
  muted: z.boolean().optional().default(true),
});

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
    gridImage: z.string().optional(), // 16分割用画像（指定がない場合はimageを使用）
    borderColor: z.string(),
    glowColor: z.string(),
  }),
  endingText: z.string(),
  features: z.object({
    useGlitch: z.boolean(),
    useMirror: z.boolean(),
    useDoublingGrid: z.boolean(),
    useGridConvergence: z.boolean().optional(),
  }),
  lightLeakColor: z.string().optional(),
  liverIntroDuration: z.number().optional(),
  reverseVsOrder: z.boolean().optional(),
  customBackground: z.string().optional(),
  sceneLiverEffect: EffectStackConfigSchema.optional(),
  sceneVsEffect: EffectStackConfigSchema.optional(),
  fontFamily: z.string().optional(),
});

export type BattleSpiritTheme = z.infer<typeof BattleSpiritThemeSchema>;
