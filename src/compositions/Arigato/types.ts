import { z } from 'zod';

export const ArigatoSchema = z.object({
  images: z.array(z.string()),
  music: z.string(),
  title: z.string().optional(),
  message: z.string().optional(),
  fps: z.number().default(60),
});

export type ArigatoProps = z.infer<typeof ArigatoSchema>;
