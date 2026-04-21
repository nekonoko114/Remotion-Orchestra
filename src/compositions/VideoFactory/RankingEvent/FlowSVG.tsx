import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

const UNITY_GREEN = '#00ffff'; // Cyan
const UNITY_RED = '#ff1e1e';  // Red

interface Props {
  pulse: number;
  opacity: number;
}

export const FlowSVG: React.FC<Props> = ({ pulse, opacity }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 40 }).map((_, i) => {
    const seed = i * 37.7;
    const xBase = (seed % 100) * 10;
    const size = 2 + (seed % 6);
    return { xBase, size, color: i % 2 === 0 ? UNITY_GREEN : UNITY_RED };
  });

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <filter id="flow-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {particles.map((p, i) => {
          const speed = 15 + (i % 10) * 3;
          // Flowing UPWARD
          const yPos = 1100 - ((frame * speed) % 1200);
          
          // Pulse the size and opacity to the beat
          const currentSize = p.size * (1 + pulse * 1.5);
          const pOpacity = 0.4 + (pulse * 0.6);

          return (
            <circle
              key={i}
              cx={p.xBase}
              cy={yPos}
              r={currentSize}
              fill={p.color}
              fillOpacity={pOpacity}
              filter="url(#flow-glow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
