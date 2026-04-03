import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { LuxuryJapaneseFont } from './fonts';
import { BeatShake, GlitchOverlay } from './BeatSync';

export const Opening: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance animation for text
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  // Fade out at the end (last 30 frames before the sequence ends)
  const fadeOut = interpolate(frame, [240, 270], [1, 0], { extrapolateRight: 'clamp' });

  // Master Image Animation
  const titleOpacity = interpolate(entrance, [0, 1], [0, 1]) * fadeOut;
  const titleTranslateY = interpolate(entrance, [0, 1], [50, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        {/* Subtle Dark Radial Gradient to Dim the Center Trophy */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, transparent 60%)',
          opacity: titleOpacity * 0.8,
        }} />

        {/* Main Vertical Title (Animated Characters) */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}>
            {['新', '人', '王'].map((char, i) => {
              const charDelay = i * 15;
              const charEntrance = spring({
                frame: frame - charDelay,
                fps,
                config: { damping: 12, stiffness: 80 },
              });

              const charScale = interpolate(charEntrance, [0, 1], [0.8, 1]);
              const charOpacity = interpolate(charEntrance, [0, 1], [0, 1]);

              return (
                <div key={i} style={{
                  fontFamily: LuxuryJapaneseFont,
                  fontSize: 320,
                  fontWeight: 900,
                  color: '#FFD700', // Gold
                  opacity: charOpacity,
                  transform: `scale(${charScale})`,
                  // Dark Shadow for Contrast
                  filter: `drop-shadow(0 0 20px rgba(0, 0, 0, 0.8)) drop-shadow(0 10px 40px rgba(40, 20, 0, 0.6))`,
                  lineHeight: 1.0,
                  textOrientation: 'upright',
                  zIndex: 10 - i,
                  // Gold Gradient Effect
                  background: 'linear-gradient(to bottom, #FFE082 0%, #FFD700 50%, #B8860B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {char}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </BeatShake>
    </AbsoluteFill>
  );
};
