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
    config: { damping: 14, stiffness: 60 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay />
      
      <BeatShake>
        {/* Subtle Dark Radial Gradient to Dim the Center Trophy */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 65%)',
          opacity,
        }} />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            opacity,
            transform: `scale(${scale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}>          
            <div style={{
              fontFamily: LuxuryLatinFont,
              fontSize: 80,
              color: '#FFD700',
              letterSpacing: '0.2em',
              // Dark shadow for Gold text
              filter: `drop-shadow(0 0 10px rgba(0,0,0,0.8)) drop-shadow(0 0 30px rgba(0,0,0,0.6))`,
            }}>
              RANKING
            </div>

            <div style={{
              height: '4px',
              width: '200px',
              background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
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
              // Stronger dark shadow for White text
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
