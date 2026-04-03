import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CircuitSVG } from './CircuitSVG';
import { useBeatValue } from '../utils/beat-sync';

const BPM = 194;

export const UnityBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { pulse } = useBeatValue(BPM);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 1. Deep Gradient Base */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, #330000 0%, #000 70%)',
          opacity: 0.8,
        }}
      />

      {/* 2. Circuit Overlay */}
      <AbsoluteFill style={{ opacity: 0.4, transform: 'scale(1.2) rotate(15deg)' }}>
        <CircuitSVG pulse={pulse} opacity={0.6} />
      </AbsoluteFill>

      {/* 3. Convergence Pillars */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const rotation = (i * 30 + frame * 0.2) % 360;
          const opacity = interpolate(Math.sin(frame * 0.05 + i), [-1, 1], [0.1, 0.4]);
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 2,
                height: 1200,
                backgroundColor: '#FF3131',
                boxShadow: '0 0 20px #FF3131, 0 0 40px #FFD700',
                transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-200px)`,
                opacity,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* 4. Center Core Glow */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 49, 49, 0.3) 0%, transparent 40%)',
          mixBlendMode: 'screen',
          transform: `scale(${1 + pulse * 0.1})`,
        }}
      />

      {/* 5. Edge Vignette */}
      <AbsoluteFill
        style={{
          background: 'inset 0 0 300px rgba(0,0,0,0.9)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
