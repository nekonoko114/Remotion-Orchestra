import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { LuxuryJapaneseFont, LuxuryLatinFont } from './fonts';
import { BeatShake, GlitchOverlay } from './BeatSync';

export const NextPage: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 40 },
  });

  // 全体タイムラインでの365フレーム目（NextPage開始から95フレーム目）から退場開始
  const exit = spring({
    frame: frame - 95,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.95, 1]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1]) - interpolate(exit, [0, 0.5], [0, 1]);
  const blur = interpolate(entrance, [0, 0.8], [30, 0]) + interpolate(exit, [0, 1], [0, 30]);
  const letterSpacingReveal = interpolate(entrance, [0, 1], [40, 0]);
  const translateY = interpolate(exit, [0, 1], [0, -200]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay />
      
      <BeatShake>
        {/* White burst at the very start of the transition */}
        <AbsoluteFill style={{
          backgroundColor: 'white',
          opacity: interpolate(frame, [0, 10], [0.6, 0]),
          zIndex: 100,
        }} />

        {/* Subtle Dark Radial Gradient to Dim the Center Trophy */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 65%)',
          opacity: opacity * 0.8,
        }} />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            opacity,
            transform: `scale(${scale}) translateY(${translateY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            filter: `blur(${blur}px)`,
          }}>          
            <div style={{
              fontFamily: LuxuryLatinFont,
              fontSize: 80,
              color: '#99ff00ff',
              letterSpacing: `${0.2 + (letterSpacingReveal * 0.05)}em`,
              filter: `drop-shadow(0 0 10px rgba(0,0,0,0.8)) drop-shadow(0 0 30px rgba(0,0,0,0.6))`,
            }}>
              RANKING
            </div>

            <div style={{
              height: '4px',
              width: interpolate(entrance, [0, 1], [0, 400]) + 'px',
              background: 'linear-gradient(90deg, transparent, #00FF88, transparent)',
              margin: '10px 0',
            }} />

            <div style={{
              fontFamily: LuxuryJapaneseFont,
              fontSize: 140,
              fontWeight: 900,
              color: 'white',
              margin: 0,
              background: 'linear-gradient(to bottom, #ffffff 50%, #cccccc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: `${letterSpacingReveal}px`,
              filter: `drop-shadow(0 0 15px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 40px rgba(0, 0, 0, 0.5))`,
            }}>
              結果発表！
            </div>
          </div>
        </AbsoluteFill>
      </BeatShake>
    </AbsoluteFill>
  );
};
