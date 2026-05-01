import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { useBeatValue } from '../../../utils/beat-sync';
import { loadFont } from '@remotion/google-fonts/Orbitron';

const { fontFamily: orbitronFont } = loadFont();

const BPM = 180; // Adjusted for Velocity-Shift feel

export const TimeTunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  const RING_COUNT = 10; 
  const STREAK_COUNT = 30;

  // 放射状のスピードライン
  const streaks = useMemo(() => {
    return Array.from({ length: STREAK_COUNT }).map((_, i) => ({
      angle: random(`angle-${i}`) * 360,
      width: random(`w-${i}`) * 4 + 1,
      speed: random(`s-${i}`) * 0.05 + 0.02,
      opacity: random(`o-${i}`) * 0.5 + 0.2,
      color: i % 2 === 0 ? '#d000ff' : '#00f2ff',
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 1. Base Deep Space Gradient */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, #0a000a 0%, #000 90%)',
        }}
      />

      {/* 2. Speed Streaks (Warpspace effect) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {streaks.map((s, i) => {
          const progress = (frame * s.speed + (i / STREAK_COUNT)) % 1;
          const length = interpolate(progress, [0, 1], [0, 1200]);
          const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, s.opacity, s.opacity, 0]);
          const thickness = s.width * (1 + pulse * 0.5);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: thickness,
                height: length,
                backgroundColor: s.color,
                boxShadow: `0 0 10px ${s.color}`,
                transformOrigin: 'top center',
                transform: `rotate(${s.angle}deg) translateY(${interpolate(progress, [0, 1], [0, 800])}px)`,
                opacity,
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* 3. Concentric Clock Faces (The Tunnel) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {Array.from({ length: RING_COUNT }).map((_, i) => {
          const offset = (i / RING_COUNT);
          const time = (frame / (fps * 2.2) + offset) % 1; 
          
          const scale = Math.pow(time, 4) * 45; 
          const opacity = interpolate(time, [0, 0.1, 0.7, 1], [0, 1, 0.2, 0]);
          const rotate = frame * 0.15 - i * 15;
          const color = i % 2 === 0 ? '#d000ff' : '#00f2ff';

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 600,
                height: 600,
                border: `2px ${i % 3 === 0 ? 'solid' : 'dashed'} ${color}`,
                borderRadius: '50%',
                boxShadow: `0 0 30px ${color}, inset 0 0 15px ${color}`,
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                opacity: opacity * (0.6 + pulse * 0.4),
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* 4. High-Tech Background Counters */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const x = (random(`x-${i}`) * 90) + 5;
          const y = (random(`y-${i}`) * 90) + 5;
          const opacity = interpolate(Math.sin(frame * 0.08 + i), [-1, 1], [0, 0.5]);
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                fontFamily: orbitronFont,
                color: i % 2 === 0 ? '#d000ff' : '#00f2ff',
                fontSize: 32,
                letterSpacing: '2px',
                opacity,
                textShadow: `0 0 15px ${i % 2 === 0 ? '#d000ff' : '#00f2ff'}`,
              }}
            >
              {Math.floor(frame + i * 999).toString(16).padStart(4, '0').toUpperCase()}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 5. Central Flare Burst */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, rgba(208, 0, 255, 0.5) 20%, transparent 60%)',
          mixBlendMode: 'screen',
          transform: `scale(${1.2 + pulse * 0.3})`,
        }}
      />
    </AbsoluteFill>
  );
};
