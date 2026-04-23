import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

const LINE_COUNT = 5;

const GoldRibbon: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  
  // Create organic paths that slowly drift
  const path = useMemo(() => {
    const startY = 200 + index * 300;
    const endY = startY + 100;
    return `M -100 ${startY} C ${width * 0.3} ${startY - 200}, ${width * 0.7} ${endY + 200}, ${width + 100} ${endY}`;
  }, [width, index]);

  const dashOffset = frame * 2;
  const opacity = interpolate(Math.sin(frame * 0.01 + index), [-1, 1], [0.1, 0.4]);

  return (
    <svg 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        filter: 'drop-shadow(0 0 15px rgba(247, 231, 206, 0.6))'
      }}
    >
      <path
        d={path}
        fill="none"
        stroke="#F7E7CE" // Champagne Gold
        strokeWidth="2"
        strokeDasharray="400 600"
        strokeDashoffset={-dashOffset}
        opacity={opacity}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const LiquidGoldLines: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'plus-lighter' }}>
      {[...Array(LINE_COUNT)].map((_, i) => (
        <GoldRibbon key={i} index={i} />
      ))}
    </AbsoluteFill>
  );
};
