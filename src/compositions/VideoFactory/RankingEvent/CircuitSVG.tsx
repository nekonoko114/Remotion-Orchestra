import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

const UNITY_GREEN = '#f85718';
const UNITY_LIME = '#FFD700';

interface Props {
  pulse: number;
  opacity: number;
}

export const CircuitSVG: React.FC<Props> = ({ pulse, opacity }) => {
  const frame = useCurrentFrame();

  const lines = Array.from({ length: 15 }).map((_, i) => {
    const seed = i * 22.1;
    const isVertical = i % 2 === 0;
    const pos = (seed % 100) * 10;
    const length = 300 + (seed % 500);
    return { pos, length, isVertical, color: i % 3 === 0 ? UNITY_LIME : UNITY_GREEN };
  });

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <filter id="circuit-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {lines.map((l, i) => {
          const speed = 10 + (i % 5) * 5;
          const offset = (frame * speed) % 2000 - 1000;
          
          // Circuit "light up" synced to pulse
          const strokeWidth = 1 + (pulse * 4);
          const strokeOpacity = 0.2 + (pulse * 0.8);

          return (
            <line
              key={i}
              x1={l.isVertical ? l.pos : offset}
              y1={l.isVertical ? offset : l.pos}
              x2={l.isVertical ? l.pos : offset + l.length}
              y2={l.isVertical ? offset + l.length : l.pos}
              stroke={l.color}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
              filter="url(#circuit-glow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
