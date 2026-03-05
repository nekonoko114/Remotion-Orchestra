import type React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const SkyBattleBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 1. Base Gradient: Sky Blue to White */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 50%, #FFFFFF 100%)',
        }}
      />

      {/* 2. Moving Clouds / Wind Lines (CSS Animation) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          background:
            'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.3) 50px, rgba(255,255,255,0.3) 100px)',
          transform: `translateX(-${(frame * 5) % 100}px) skewX(-20deg)`,
          opacity: 0.5,
        }}
      />

      {/* 3. Sun Glare (Top Left) */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -200,
          width: 800,
          height: 800,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          filter: 'blur(60px)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* 4. Speed Lines (Subtle) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.8) 100%)',
          opacity: 0.3,
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};
