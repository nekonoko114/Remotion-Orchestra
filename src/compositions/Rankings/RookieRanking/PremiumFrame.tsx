import React from 'react';
import { AbsoluteFill } from 'remotion';

export const PremiumFrame: React.FC = () => {
  const frameWidth = 40; // px
  const emeraldGradient = 'linear-gradient(135deg, #00A86B 0%, #00FF7F 25%, #004B23 50%, #00FF7F 75%, #00A86B 100%)';
  const champagneGold = '#F7E7CE';

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      {/* Main Emerald Border Frame */}
      <div style={{
        position: 'absolute',
        inset: 0,
        border: `${frameWidth}px solid transparent`,
        borderImageSource: emeraldGradient,
        borderImageSlice: 1,
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.8)`,
      }} />

      {/* Champagne Gold Inset Lines (High-jewelry style) */}
      <div style={{
        position: 'absolute',
        inset: `${frameWidth + 4}px`,
        border: `1px solid ${champagneGold}66`,
        opacity: 0.8,
      }} />
      <div style={{
        position: 'absolute',
        inset: `${frameWidth - 4}px`,
        border: `1px solid ${champagneGold}44`,
        opacity: 0.5,
      }} />

      {/* Decorative Inner Line */}
      <div style={{
        position: 'absolute',
        inset: `${frameWidth + 8}px`,
        border: `1px solid rgba(0, 255, 127, 0.2)`,
      }} />

      {/* Corner Ornaments in Gold */}
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
          borderTop: pos.top ? `6px solid ${champagneGold}` : 'none',
          borderBottom: pos.bottom ? `6px solid ${champagneGold}` : 'none',
          borderLeft: pos.left ? `6px solid ${champagneGold}` : 'none',
          borderRight: pos.right ? `6px solid ${champagneGold}` : 'none',
          filter: `drop-shadow(0 0 10px ${champagneGold}aa)`,
        }} />
      ))}

      {/* Subtle Glow behind the frame */}
      <div style={{
        position: 'absolute',
        inset: 0,
        border: `${frameWidth}px solid transparent`,
        boxShadow: `inset 0 0 15px rgba(0, 255, 136, 0.3)`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
