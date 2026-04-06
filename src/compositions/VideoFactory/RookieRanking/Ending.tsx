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

        {/* Bottom Right Logo Container */}
        <div style={{ 
          position: 'absolute', 
          bottom: 60, 
          right: 60, 
          width: 300,
          zIndex: 110,
          opacity,
          transform: `scale(${textScale})`,
          filter: `drop-shadow(0 0 ${15 + kickStrength * 30}px rgba(255,215,0,0.5))`,
        }}>
          <Img 
            src={staticFile("jol-logo-800.png")} 
            style={{ 
              width: '100%', 
              height: 'auto',
              objectFit: 'contain',
            }} 
          />
        </div>
      </BeatShake>
    </AbsoluteFill>
  );
};
