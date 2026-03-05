import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface RainProps {
  count?: number;
  speed?: number;
  color?: string;
  opacity?: number;
  wind?: number; // -5 to 5
}

export const Rain: React.FC<RainProps> = ({
  count = 100,
  speed = 1,
  color = '#aaf',
  opacity = 0.5,
  wind = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Initialize rain drops only once
  const rainDrops = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: random(`rain-x-${i}`) * width,
      y: random(`rain-y-${i}`) * height,
      length: 10 + random(`rain-l-${i}`) * 20,
      opacity: 0.1 + random(`rain-o-${i}`) * 0.5,
      speed: 15 + random(`rain-s-${i}`) * 10,
    }));
  }, [count, width, height]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg
        width={width}
        height={height}
        style={{ overflow: 'hidden' }}
        aria-label="Rain effect"
      >
        <title>Rain Effect</title>
        {rainDrops.map((drop, i) => {
          // Calculate movement based on frame
          const dropY = (drop.y + frame * drop.speed * speed) % (height + 50);
          const dropX = (drop.x + frame * wind * 2) % width;

          const key = `drop-${i}`;

          return (
            <line
              key={key}
              x1={dropX}
              y1={dropY - drop.length}
              x2={dropX + wind}
              y2={dropY}
              stroke={color}
              strokeWidth="1"
              strokeOpacity={drop.opacity * opacity}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
