import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { HalftoneBackground, SpeedLines, AmecomiTextStyle } from './AmecomiElements';
import { useBeat, BeatShake, GlitchOverlay } from './BeatSync';

export const Ending: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { kickStrength } = useBeat(bpm);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  const baseScale = interpolate(entrance, [0, 1], [0.8, 1.2]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  
  // Beat Pulse
  const textScale = baseScale + kickStrength * 0.15;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        <HalftoneBackground color="rgba(255, 215, 0, 0.2)" />
        <SpeedLines />

        {/* Gold Flare / Glow */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          mixBlendMode: 'plus-lighter',
          opacity: 0.5 + kickStrength * 0.5
        }} />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            ...AmecomiTextStyle,
            writingMode: 'vertical-rl',
            fontSize: 220,
            color: '#FFD700',
            WebkitTextStroke: '10px black',
            transform: `scale(${textScale})`,
            opacity,
            textOrientation: 'upright',
            filter: `drop-shadow(0 0 ${40 + kickStrength * 100}px rgba(255, 215, 0, 0.8))`,
            lineHeight: 1.1,
          }}>
            新人王<br/>おめでとう
          </div>
        </AbsoluteFill>

        <div style={{
          position: 'absolute',
          bottom: 80,
          width: '100%',
          textAlign: 'center',
          fontSize: 50,
          color: '#fff',
          fontWeight: 'bold',
          textShadow: '2px 2px 10px black',
          letterSpacing: 10,
          opacity,
          transform: `translateY(${kickStrength * -15}px)`,
        }}>
          CONGRATULATIONS
        </div>
      </BeatShake>
    </AbsoluteFill>
  );
};
