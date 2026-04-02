import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { HalftoneBackground, SpeedLines, AmecomiTextStyle } from './AmecomiElements';
import { useBeat, BeatShake, GlitchOverlay } from './BeatSync';

export const NextPage: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { kickStrength } = useBeat(bpm);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const baseScale = interpolate(entrance, [0, 1], [0.5, 1]);
  const bounce = Math.sin(frame / 5) * 2;
  
  // Beat Pulse
  const scale = baseScale + kickStrength * 0.1;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay />
      
      <BeatShake>
        <HalftoneBackground color="rgba(26, 26, 46, 0.6)" />
        <SpeedLines />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* Comic Bubble / Panel */}
          <div style={{
            backgroundColor: '#ff2c2c',
            border: '10px solid black',
            padding: '60px 100px',
            transform: `scale(${scale}) rotate(${bounce}deg)`,
            boxShadow: `${20 + kickStrength * 30}px ${20 + kickStrength * 30}px 0px rgba(0,0,0,0.5)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
            filter: `brightness(${1 + kickStrength * 0.5})`,
          }}>          
            <div style={{
              ...AmecomiTextStyle,
              fontSize: 100,
              color: '#FFD700',
              WebkitTextStroke: '6px black',
              lineHeight: 1.2,
            }}>
              RANKING
            </div>

            <h2 style={{
              ...AmecomiTextStyle,
              fontSize: 120,
              color: 'white',
              WebkitTextStroke: '8px black',
              margin: 0,
            }}>
              結果発表！
            </h2>
          </div>
        </AbsoluteFill>
      </BeatShake>
    </AbsoluteFill>
  );
};
