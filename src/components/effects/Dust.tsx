import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface DustProps {
  count?: number;
  opacity?: number;
  colors?: string[];
}

export const Dust: React.FC<DustProps> = ({
  count = 150,
  opacity = 0.8,
  colors = ['#00f0ff', '#ff00ff', '#ffff00', '#00ff00', '#fff'],
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: random(`dust-x-${i}`) * width,
      y: random(`dust-y-${i}`) * height,
      size: 3 + random(`dust-z-${i}`) * 8,
      vX: -1.5 + random(`dust-vx-${i}`) * 3,
      vY: -1.5 + random(`dust-vy-${i}`) * 3,
      o: 0.5 + random(`dust-o-${i}`) * 0.5,
      color: colors[Math.floor(random(`dust-c-${i}`) * colors.length)],
      glow: 10 + random(`dust-g-${i}`) * 20,
      phase: random(`dust-p-${i}`) * Math.PI * 2,
    }));
  }, [count, width, height, colors]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const driftX =
          (p.x + frame * p.vX + Math.sin(frame / 30 + i) * 50) % width;
        const driftY =
          (p.y + frame * p.vY + Math.cos(frame / 30 + i) * 50) % height;

        const pulse = 0.6 + Math.sin(frame / 8 + p.phase) * 0.4;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: i % 3 === 0 ? '0%' : '50%',
              opacity: p.o * opacity * pulse,
              boxShadow: `0 0 ${p.glow}px ${p.color}, 0 0 ${p.glow * 2}px ${p.color}`,
              transform: `translate3d(${driftX}px, ${driftY}px, 0) rotate(${frame * 2 + i}deg) scale(${pulse})`,
              filter: 'contrast(1.5) brightness(1.5)',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
