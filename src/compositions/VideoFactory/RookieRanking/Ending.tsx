import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import { HalftoneBackground, SpeedLines } from './AmecomiElements';
import { useBeat, BeatShake, GlitchOverlay } from './BeatSync';
import { LuxuryFontStack } from './fonts';

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
  
  // Beat Pulse (Removed as requested)
  const textScale = baseScale;

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
          {/* Centered JOL Logo */}
          <div style={{
            width: 800,
            height: 400,
            transform: `scale(${textScale})`,
            opacity,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            filter: `drop-shadow(0 0 ${20 + kickStrength * 40}px rgba(255,215,0,0.6))`,
          }}>
            <Img 
              src={staticFile("jol-logo-800.png")} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          </div>
        </AbsoluteFill>

        <div style={{
          position: 'absolute',
          bottom: 80,
          width: '100%',
          textAlign: 'center',
          fontSize: 50,
          fontFamily: LuxuryFontStack,
          color: '#FFD700',
          fontWeight: 700,
          letterSpacing: 12,
          opacity,
          filter: `drop-shadow(0 0 ${10 + kickStrength * 30}px rgba(255,215,0,0.8))`,
          transform: `translateY(${kickStrength * -15}px)`,
        }}>
          CONGRATULATIONS
        </div>
      </BeatShake>
    </AbsoluteFill>
  );
};
