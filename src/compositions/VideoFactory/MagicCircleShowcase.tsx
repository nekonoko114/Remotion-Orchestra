import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MagicCircle } from './components/BattleShared/BattleSharedComponents';

export const MagicCircleShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#050a10', justifyContent: 'center', alignItems: 'center' }}>
      {/* Background glow to make it pop */}
      <div style={{
        position: 'absolute',
        width: 800,
        height: 800,
        background: 'radial-gradient(circle, rgba(0, 255, 150, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
      }} />
      
      <MagicCircle frame={frame} color="#00ffaa" size={800} />
      
      <div style={{
        position: 'absolute',
        bottom: 100,
        color: 'white',
        fontFamily: 'Impact',
        fontSize: 40,
        letterSpacing: 4,
        opacity: 0.6,
        textShadow: '0 0 20px #00ffaa'
      }}>
        SVG MAGIC CIRCLE PROTOTYPE
      </div>
    </AbsoluteFill>
  );
};
