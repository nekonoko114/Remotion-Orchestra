import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = [
  '#d000ff', // Theme Purple
  '#ffd700', // Gold
  '#ffffff', // White
  '#a200ff', // Light Purple
  '#222222', // Dark accent
];

interface ConfettiProps {
  count?: number;
  colors?: string[];
}

export const ConfettiTime: React.FC<ConfettiProps> = ({
  count = 150,
  colors = COLORS,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = `time-confetti-${i}`;
      return {
        x: random(`${seed}-x`) * width,
        initialY: -random(`${seed}-y`) * 500,
        size: 8 + random(`${seed}-size`) * 12,
        color: colors[Math.floor(random(`${seed}-color`) * colors.length)],
        rotationSpeed: (random(`${seed}-rot`) - 0.5) * 15,
        driftSpeed: (random(`${seed}-drift`) - 0.5) * 8,
        speed: 8 + random(`${seed}-speed`) * 12,
      };
    });
  }, [count, width, colors]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const y = p.initialY + frame * p.speed;
        const xOffset = Math.sin(frame * 0.1 + p.rotationSpeed) * 30;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + xOffset,
              top: y,
              width: p.size,
              height: p.size * 0.5,
              backgroundColor: p.color,
              transform: `rotate(${frame * p.rotationSpeed}deg) rotateX(${frame * 8}deg)`,
              borderRadius: p.size % 2 === 0 ? '50%' : '1px',
              opacity: interpolate(y, [height * 0.7, height], [1, 0], {
                extrapolateRight: 'clamp',
              }),
              boxShadow: `0 0 10px ${p.color}aa`,
              willChange: 'transform, top, opacity',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
