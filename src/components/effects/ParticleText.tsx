import { useEffect, useMemo, useRef } from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { z } from 'zod';

export const ParticleTextSchema = z.object({
  text: z.string(),
  fontSize: z.number(),
  color: z.string().optional().default('#D4AF37'),
  delay: z.number().optional().default(0),
  yOffset: z.number().optional().default(0),
});

type Props = z.infer<typeof ParticleTextSchema>;

export const ParticleText: React.FC<Props> = ({ text, fontSize, color = '#D4AF37', delay = 0, yOffset = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // High quality sampling but restricted to text area for performance
  const points = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(text, width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height);
    const sampledPoints: { x: number; y: number }[] = [];

    // Balanced step for visibility vs performance
    const step = 4;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (imageData.data[index + 3] > 100) {
          // Transparency threshold
          sampledPoints.push({ x, y });
        }
      }
    }
    return sampledPoints;
  }, [text, fontSize, width, height]);

  // Particle state
  const particles = useMemo(() => {
    return points.map((p, i) => {
      const seed = `p-${text}-${i}`;
      return {
        startX: (random(`${seed}x`) - 0.5) * width * 1.5,
        startY: (random(`${seed}y`) - 0.5) * height * 1.5,
        targetX: p.x,
        targetY: p.y + yOffset,
        speed: random(`${seed}s`) * 0.5 + 0.5,
        size: random(`${seed}size`) * 2 + 1,
        delay: random(`${seed}delay`) * 10,
      };
    });
  }, [points, text, width, height, yOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const animFrame = frame - delay;
    if (animFrame < 0) return;

    ctx.fillStyle = color;

    particles.forEach((p) => {
      const spr = spring({
        frame: animFrame - p.delay,
        fps,
        config: { damping: 15, stiffness: 100, mass: 0.5 },
      });

      if (spr <= 0) return;

      const curX = interpolate(spr, [0, 1], [p.startX, p.targetX]);
      const curY = interpolate(spr, [0, 1], [p.startY, p.targetY]);

      const alpha = interpolate(spr, [0, 0.4], [0, 1]);
      const flicker = 0.8 + Math.sin(frame * 0.2 + p.delay) * 0.2;

      ctx.globalAlpha = alpha * flicker;

      // Rect is much faster than arc
      ctx.fillRect(curX, curY, p.size, p.size);
    });
  }, [frame, delay, particles, width, height, fps, color]);

  return (
    <AbsoluteFill>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      />
    </AbsoluteFill>
  );
};
