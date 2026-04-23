import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from 'remotion';

const DUST_COUNT = 80;

const DustGrain: React.FC<{ seed: string }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  const initialX = random(seed + 'x') * width;
  const initialY = random(seed + 'y') * height;
  const size = random(seed + 's') * 4 + 2;
  const speed = random(seed + 'speed') * 1.5 + 0.5;
  const drift = random(seed + 'drift') * 100 - 50;

  const y = (initialY - frame * speed) % height;
  const x = initialX + Math.sin(frame * 0.02) * drift;

  // Diamond-like sparkle (Blink)
  const blinkSpeed = random(seed + 'blink') * 0.1 + 0.05;
  const opacity = interpolate(
    Math.sin(frame * blinkSpeed + random(seed + 'phase') * 10),
    [-1, 1],
    [0.1, 0.9]
  );

  // Champagne Gold & Diamond White colors
  const color = random(seed + 'color') > 0.7 ? '#F7E7CE' : '#FFFFFF';

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y < 0 ? y + height : y,
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
      opacity,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      filter: size > 4 ? 'blur(0.5px)' : 'none',
    }}>
      {/* Occasional Cross Flare for larger "Jewels" */}
      {size > 4.5 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          width: size * 4,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }} />
      )}
      {size > 4.5 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          width: 1,
          height: size * 4,
          background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
        }} />
      )}
    </div>
  );
};

export const JewelryDust: React.FC = () => {
  const seeds = useMemo(() => {
    return Array.from({ length: DUST_COUNT }).map((_, i) => `dust-${i}`);
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {seeds.map((seed) => (
        <DustGrain key={seed} seed={seed} />
      ))}
    </AbsoluteFill>
  );
};
