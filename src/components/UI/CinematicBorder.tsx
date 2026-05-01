import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

type Props = {
  color: string;
  glowColor: string;
};

export const CinematicBorder: React.FC<Props> = ({ color, glowColor }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // Subtle breathing for the glow
  const breath = Math.sin(frame * 0.05) * 0.2 + 1;

  const scale = width / 1080;
  const inset = 10 * scale;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 150 }}>
      {/* Main Red Border */}
      <div
        style={{
          position: 'absolute',
          inset: inset,
          border: `${4 * scale}px solid ${color}`,
          boxShadow: `
                        0 0 ${20 * scale}px ${glowColor}, 
                        inset 0 0 ${20 * scale}px ${glowColor},
                        0 0 ${40 * scale}px ${color},
                        inset 0 0 ${40 * scale}px ${color}
                    `,
          opacity: 0.7 * breath, // brightnessの代わりに不透明度で光の強弱を表現
        }}
      />
    </AbsoluteFill>
  );
};

export const LensFlare: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scale = width / 1080;

  // Movement of light source
  const moveX = Math.sin(frame * 0.01) * 5 * scale;
  const moveY = Math.cos(frame * 0.015) * 5 * scale;

  return (
    <AbsoluteFill
      style={{ pointerEvents: 'none', zIndex: 140, mixBlendMode: 'screen' }}
    >
      {/* Main Source */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          transform: `translate(${moveX}px, ${moveY}px)`,
          width: 600 * scale,
          height: 600 * scale,
          background: `radial-gradient(circle, #FFFFFF 0%, ${color} 20%, transparent 60%)`,
          filter: `blur(${120 * scale}px)`,
          opacity: 0.8,
        }}
      />

      {/* Horizontal Streak (Anamorphic) */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: `translate(-50%, ${moveY}px)`,
          width: '120%',
          height: 4 * scale,
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          filter: `blur(${2 * scale}px)`,
          opacity: 0.6,
        }}
      />

      {/* Artifacts / Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '40%',
          transform: `translate(${moveX * -2}px, ${moveY * -2}px)`,
          width: 50 * scale,
          height: 50 * scale,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: `${1 * scale}px solid ${color}`,
          filter: `blur(${2 * scale}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          right: '30%',
          transform: `translate(${moveX * -4}px, ${moveY * -4}px)`,
          width: 100 * scale,
          height: 100 * scale,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: 0.2,
        }}
      />
    </AbsoluteFill>
  );
};
