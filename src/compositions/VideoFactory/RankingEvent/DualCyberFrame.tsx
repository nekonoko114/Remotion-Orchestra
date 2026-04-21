import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random, Easing } from 'remotion';

export const DualCyberFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Colors
  const cyan = '#00ffff';
  const red = '#ff1e1e';

  // --- Left Side (Cyan Scanbar) ---
  const scanPos = interpolate(
    (frame % 120),
    [0, 60, 120],
    [0, height, 0],
    { easing: Easing.inOut(Easing.quad) }
  );

  // --- Right Side (Red Noise/Pulse) ---
  const isGlitching = random(`frame-${frame}`) > 0.85;
  const redOpacity = isGlitching ? 1 : 0.6;
  const redGlowSize = isGlitching ? 60 : 30;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 9999 }}>
      {/* Left Frame Border (Cyan) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '50%',
          borderLeft: `10px solid ${cyan}`,
          borderTop: `10px solid ${cyan}`,
          borderBottom: `10px solid ${cyan}`,
          boxShadow: `inset 20px 0 30px ${cyan}33`,
        }}
      />
      
      {/* Left Scanbar (Cyan) */}
      <div
        style={{
          position: 'absolute',
          top: scanPos,
          left: 0,
          width: '50%',
          height: 10,
          background: `linear-gradient(90deg, ${cyan} 0%, transparent 100%)`,
          boxShadow: `0 0 20px ${cyan}, 0 0 40px ${cyan}`,
          opacity: 0.8,
        }}
      />

      {/* Right Frame Border (Red) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          borderRight: `10px solid ${red}`,
          borderTop: `10px solid ${red}`,
          borderBottom: `10px solid ${red}`,
          opacity: redOpacity,
          boxShadow: `inset -20px 0 ${redGlowSize}px ${red}44`,
        }}
      />

      {/* Right Noise Pulse (Red) */}
      {isGlitching && (
        <div
          style={{
            position: 'absolute',
            top: random(`y-${frame}`) * height,
            right: 0,
            width: '30%',
            height: random(`h-${frame}`) * 100 + 50,
            background: `linear-gradient(-90deg, ${red}88 0%, transparent 100%)`,
            filter: 'blur(10px)',
          }}
        />
      )}

      {/* Top/Bottom Gradient Connectors */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '40%',
          right: '40%',
          height: 10,
          background: `linear-gradient(90deg, ${cyan} 0%, ${red} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '40%',
          right: '40%',
          height: 10,
          background: `linear-gradient(90deg, ${cyan} 0%, ${red} 100%)`,
        }}
      />

      {/* Corner Accents */}
      <div style={{ position: 'absolute', top: 30, left: 30, width: 60, height: 2, backgroundColor: cyan, boxShadow: `0 0 10px ${cyan}` }} />
      <div style={{ position: 'absolute', top: 30, left: 30, width: 2, height: 60, backgroundColor: cyan, boxShadow: `0 0 10px ${cyan}` }} />
      
      <div style={{ position: 'absolute', bottom: 30, right: 30, width: 60, height: 2, backgroundColor: red, boxShadow: `0 0 10px ${red}` }} />
      <div style={{ position: 'absolute', bottom: 30, right: 30, width: 2, height: 60, backgroundColor: red, boxShadow: `0 0 10px ${red}` }} />
    </AbsoluteFill>
  );
};
