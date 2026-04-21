import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { useBeatValue } from '../utils/beat-sync';

const BPM = 194;

export const CyberTunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  const LENGHT = 20; // Number of ring layers

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 1. Base Gradient */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, #1a0000 0%, #000 80%)',
        }}
      />

      {/* 2. Concentric Rings (The Tunnel) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {Array.from({ length: LENGHT }).map((_, i) => {
          // Calculate the staggering for the loop
          const offset = (i / LENGHT);
          const time = (frame / (fps * 2) + offset) % 1; // 2-second loop cycle
          
          // Exponential scale for that "zooming" feel
          const scale = Math.pow(time, 3) * 30; 
          const opacity = interpolate(time, [0, 0.1, 0.8, 1], [0, 1, 0.5, 0]);
          const rotate = frame * 0.2 + i * 5;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 400,
                height: 400,
                border: '4px solid #ff1e1e',
                borderRadius: '20px', // Soft square / HUD feel
                boxShadow: `0 0 30px #ff1e1e, inset 0 0 30px #ff1e1e`,
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                opacity: opacity * (0.8 + pulse * 0.2),
                filter: `blur(${interpolate(scale, [10, 30], [0, 10])}px)`,
                mixBlendMode: 'screen',
              }}
            >
              {/* Corner HUD markers */}
              <div style={{ position: 'absolute', top: -10, left: -10, width: 40, height: 40, borderTop: '6px solid #FFF', borderLeft: '6px solid #FFF' }} />
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 40, height: 40, borderBottom: '6px solid #FFF', borderRight: '6px solid #FFF' }} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 3. Speed Lines (Radial Stream) */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i * 9);
          const speed = 0.05 + (i % 5) * 0.02;
          const linePulse = interpolate(Math.sin(frame * speed + i), [-1, 1], [0.1, 0.6]);
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 2,
                height: 1000,
                backgroundColor: '#ff1e1e',
                opacity: linePulse * (0.3 + pulse * 0.7),
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-200px)`,
                boxShadow: '0 0 15px #ff1e1e',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* 4. Center Core Light */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 30, 30, 0.5) 0%, transparent 30%)',
          mixBlendMode: 'screen',
          transform: `scale(${1 + pulse * 0.3})`,
        }}
      />
    </AbsoluteFill>
  );
};
