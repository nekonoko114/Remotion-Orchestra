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
    bpm: z.number().optional(),
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
    altImage: z.string().optional(),
    altImageStartFrame: z.number().optional(),
    altImageEndFrame: z.number().optional(),
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
    useSnowEffect: z.boolean().optional(),
    useKaleidoscope: z.boolean().optional(),
    useSpinIntro: z.boolean().optional(),
    useCircleLiver: z.boolean().optional(),
    useSakuraEffect: z.boolean().optional(),
    hideDefaultParticles: z.boolean().optional(),
  }),
  lightLeakColor: z.string().optional(),
  liverIntroDuration: z.number().optional(),
  customDurations: z.object({
    opening: z.number().optional(),
    date: z.number().optional(),
    liverIntro: z.number().optional(),
    msg: z.number().optional(),
    opponent: z.number().optional(),
    vs: z.number().optional(),
    rule: z.number().optional(),
    ending: z.number().optional(),
    logo: z.number().optional(),
  }).optional(),
  openingText: z.array(z.string()).optional(),
  rulesText: z.array(z.string()).optional(),
  dateText: z.array(z.string()).optional(),
  textStroke: z.string().optional(),
  textAnimation: z.enum(['kinetic', 'fade']).optional(),
  reverseVsOrder: z.boolean().optional(),
  customBackground: z.string().optional(),
  opponentBackground: z.string().optional(),
  sceneLiverEffect: EffectStackConfigSchema.optional(),
  sceneVsEffect: EffectStackConfigSchema.optional(),
  fontFamily: z.string().optional(),
});

export type BattleSpiritTheme = z.infer<typeof BattleSpiritThemeSchema>;
