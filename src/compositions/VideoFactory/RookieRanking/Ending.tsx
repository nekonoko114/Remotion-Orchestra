import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
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
        {/* Gold Flare / Glow */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          mixBlendMode: 'plus-lighter',
          opacity: 0.5 + kickStrength * 0.5
        }} />

        <AbsoluteFill style={{ position: 'absolute', top: 1000, left: "53%", transform: "translateX(-50%)" }}>
          {/* Centered JOL Logo */}
          <div style={{
            width: 1000, 
            transform: `scale(${textScale})`,
            opacity,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            filter: `drop-shadow(0 0 ${25 + kickStrength * 50}px rgba(255,215,0,0.4))`,
          }}>
            <Img 
              src={staticFile("video-factory/images/logo/logo.png")} 
              style={{ 
                width: '40%', 
                objectFit: 'contain' ,
                borderRadius: '10%',
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
