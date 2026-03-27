import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { useBeatValue } from '../utils/beat-sync';

const BPM = 180; // Adjusted for Velocity-Shift feel

export const TimeTunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  const LENGHT = 15; 

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 1. Base Gradient */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, #1a001a 0%, #000 85%)',
        }}
      />

      {/* 2. Concentric Clock Faces (The Tunnel) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {Array.from({ length: LENGHT }).map((_, i) => {
          const offset = (i / LENGHT);
          const time = (frame / (fps * 2.5) + offset) % 1; // Slightly slower zoom
          
          const scale = Math.pow(time, 4) * 40; 
          const opacity = interpolate(time, [0, 0.1, 0.7, 1], [0, 1, 0.3, 0]);
          const rotate = frame * 0.1 - i * 10;
          const color = i % 2 === 0 ? '#d000ff' : '#00f2ff';

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 600,
                height: 600,
                border: `2px ${i % 3 === 0 ? 'solid' : 'dashed'} ${color}`,
                borderRadius: '50%', // Circle theme for clocks
                boxShadow: `0 0 40px ${color}, inset 0 0 20px ${color}`,
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                opacity: opacity * (0.7 + pulse * 0.3),
                filter: `blur(${interpolate(scale, [15, 40], [0, 20])}px)`,
                mixBlendMode: 'screen',
              }}
            >
              {/* Radial clock markers */}
              {Array.from({ length: 12 }).map((__, j) => (
                <div
                  key={j}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 2,
                    height: 20,
                    backgroundColor: color,
                    transform: `translate(-50%, -50%) rotate(${j * 30}deg) translateY(-280px)`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 3. Fast Random Data/Counters */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 5 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const x = (i * 10 + Math.sin(frame * 0.05 + i) * 10) % 100;
          const y = (i * 20 + Math.cos(frame * 0.03 + i) * 10) % 100;
          const opacity = interpolate(Math.sin(frame * 0.1 + i), [-1, 1], [0, 0.4]);
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                fontFamily: 'Impact, sans-serif',
                color: '#d000ff',
                fontSize: 40,
                opacity,
                textShadow: '0 0 10px #d000ff',
              }}
            >
              {Math.floor(frame + i * 1234).toString(16).toUpperCase()}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 4. Center Lens Flare Effect */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, rgba(208, 0, 255, 0.4) 0%, transparent 40%)',
          mixBlendMode: 'screen',
          transform: `scale(${1 + pulse * 0.2})`,
        }}
      />
    </AbsoluteFill>
  );
};
