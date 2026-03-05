import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

// 3. Digital Rain (B-Melody: 79.6s - 105.1s)
// Matrix-like but in theme colors (Cyan/Purple/White).
export const DigitalRain: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
  const frame = useCurrentFrame();

  // Simple vertical lines falling
  return (
    <AbsoluteFill
      style={{
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      {[...Array(30)].map((_, i) => {
        const x = i * 3.33;
        const speed = (i % 3) + 2;
        const y = (frame * speed * 2) % 1500;
        const opacity = Math.random() * 0.5;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y - 200}px`,
              width: '2px',
              height: '200px',
              background:
                'linear-gradient(to bottom, transparent, #00FFFF, transparent)',
              opacity,
            }}
          />
        );
      })}
      {/* Overlay Glitch Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};
