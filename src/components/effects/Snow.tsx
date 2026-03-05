import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface SnowProps {
  count?: number;
  speed?: number;
  opacity?: number;
}

export const Snow: React.FC<SnowProps> = ({
  count = 80,
  speed = 1,
  opacity = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const flakes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: random(`snow-x-${i}`) * width,
      y: random(`snow-y-${i}`) * height,
      size: 2 + random(`snow-z-${i}`) * 4,
      drift: -1 + random(`snow-d-${i}`) * 2,
      fallSpeed: 2 + random(`snow-s-${i}`) * 3,
      o: 0.2 + random(`snow-o-${i}`) * 0.6,
    }));
  }, [count, width, height]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={width} height={height} aria-label="Snow effect">
        <title>Snow Effect</title>
        {flakes.map((flake, i) => {
          const fallY =
            (flake.y + frame * flake.fallSpeed * speed) % (height + 20);
          // Oscillate horizontally
          const fallX =
            (flake.x + Math.sin(frame / 20 + i) * 10 + frame * flake.drift) %
            width;

          return (
            <circle
              // biome-ignore lint/suspicious/noArrayIndexKey: Snow particles
              key={i}
              cx={fallX}
              cy={fallY}
              r={flake.size}
              fill="white"
              fillOpacity={flake.o * opacity}
              style={{ willChange: 'transform' }}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
