import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
} from 'remotion';

const UNITY_GREEN = '#00FF7F';
const UNITY_LIME = '#BFFF00';

interface Props {
  pulse: number;
  opacity: number;
}

export const EnergySVG: React.FC<Props> = ({ pulse, opacity }) => {
  const frame = useCurrentFrame();
  
  // Create a persistent set of slashes using a simple deterministic pseudo-random logic
  const slashes = Array.from({ length: 20 }).map((_, i) => {
    const seed = i * 13.5;
    const x = (seed % 100);
    const yStart = ((seed * 7) % 100);
    const length = 200 + ((seed * 3) % 400);
    const speed = 2 + (seed % 5);
    const strokeWidth = 2 + (seed % 4);
    
    return { x, yStart, length, speed, strokeWidth, color: i % 2 === 0 ? UNITY_GREEN : UNITY_LIME };
  });

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {slashes.map((s, i) => {
          // Continuous diagonal movement
          const progress = (frame * s.speed) % 1500;
          const xPos = s.x * 10 + progress - 500;
          const yPos = s.yStart * 10 + progress - 500;
          
          // Pulsing length and opacity
          const pulseScale = 1 + pulse * 0.5;
          const lineOpacity = 0.3 + (pulse * 0.7);

          return (
            <line
              key={i}
              x1={xPos}
              y1={yPos}
              x2={xPos + s.length * pulseScale}
              y2={yPos + s.length * pulseScale}
              stroke={s.color}
              strokeWidth={s.strokeWidth}
              strokeOpacity={lineOpacity}
              filter="url(#glow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
