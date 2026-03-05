import type React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export interface SmokeEffectProps {
  color?: string;
  velocity?: number;
  density?: number;
}

export const SmokeEffect: React.FC<SmokeEffectProps> = ({
  color = '#ffffff',
  velocity = 0.5,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ backgroundColor: 'transparent', overflow: 'hidden' }}
    >
      {/* Optimized: Using fewer layers and simple gradients instead of SVG filters */}
      {Array.from({ length: 3 }).map((_, i) => {
        const offset = (frame * velocity * (1 + i * 0.2)) % 1000;
        const opacity = interpolate(
          Math.sin(frame * 0.02 + i),
          [-1, 1],
          [0.05, 0.15],
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '150%',
              height: '150%',
              background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
              transform: `translate(-50%, -50%) translate(${Math.sin(frame * 0.01 + i) * 50}px, ${-offset}px) rotate(${frame * 0.1 * (i + 1)}deg)`,
              opacity: opacity,
              mixBlendMode: 'screen',
              filter: 'blur(40px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
