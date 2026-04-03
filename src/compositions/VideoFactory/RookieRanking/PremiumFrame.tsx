import React from 'react';
import { AbsoluteFill } from 'remotion';

export const PremiumFrame: React.FC = () => {
  const frameWidth = 40; // px
  const goldGradient = 'linear-gradient(135deg, #FFD700 0%, #FFE082 25%, #B8860B 50%, #FFE082 75%, #FFD700 100%)';

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      {/* Main Border Frame */}
      <div style={{
        position: 'absolute',
        inset: 0,
        border: `${frameWidth}px solid transparent`,
        borderImageSource: goldGradient,
        borderImageSlice: 1,
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.8)`,
      }} />

      {/* Decorative Inner Line */}
      <div style={{
        position: 'absolute',
        inset: `${frameWidth + 8}px`,
        border: '1px solid rgba(255, 215, 0, 0.4)',
      }} />

      {/* Corner Ornaments */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...pos,
          width: 80,
          height: 80,
          border: '4px solid #FFD700',
          borderColor: `${pos.top ? '#FFD700 transparent transparent' : 'transparent transparent #FFD700'} ${pos.left ? '#FFD700 transparent transparent' : 'transparent transparent #FFD700'}`, // This is not quite right for CSS, let's use borders
          borderTop: pos.top ? '6px solid #FFD700' : 'none',
          borderBottom: pos.bottom ? '6px solid #FFD700' : 'none',
          borderLeft: pos.left ? '6px solid #FFD700' : 'none',
          borderRight: pos.right ? '6px solid #FFD700' : 'none',
          filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
        }} />
      ))}

      {/* Subtle Glow behind the frame */}
      <div style={{
        position: 'absolute',
        inset: 0,
        border: `${frameWidth}px solid transparent`,
        boxShadow: `inset 0 0 15px rgba(255, 215, 0, 0.2)`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
