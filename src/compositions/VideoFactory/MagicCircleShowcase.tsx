import React from 'react';
import { AbsoluteFill, useCurrentFrame, Sequence, interpolate } from 'remotion';
import { MagicCircle, Kaleidoscope } from './components/BattleShared/BattleSharedComponents';

export const MagicCircleShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  
  // 3D rotation animations
  const rotationX = interpolate(frame, [0, 300], [0, 360]);
  const rotationY = interpolate(frame, [0, 300], [0, 720]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#050a10' }}>
      {/* Background glow */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(0, 255, 150, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }} />
      </AbsoluteFill>

      {/* Mode 1: 3D Showcase */}
      <Sequence durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <MagicCircle 
            frame={frame} 
            color="#00ffaa" 
            size={800} 
            rotationX={rotationX * 0.1 + 45} 
            rotationY={rotationY} 
          />
          <div style={labelStyle}>3D TRANSFORM MODE</div>
        </AbsoluteFill>
      </Sequence>

      {/* Mode 2: Kaleidoscope Mode */}
      <Sequence from={150} durationInFrames={150}>
        <AbsoluteFill>
          <Kaleidoscope count={8}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ transform: `translateX(300px) rotate(${frame * 2}deg)` }}>
                <MagicCircle frame={frame} color="#ff00aa" size={400} />
              </div>
            </AbsoluteFill>
          </Kaleidoscope>
          <div style={labelStyle}>KALEIDOSCOPE MODE</div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 100,
  left: 0,
  right: 0,
  textAlign: 'center',
  color: 'white',
  fontFamily: 'Impact',
  fontSize: 40,
  letterSpacing: 4,
  opacity: 0.6,
  textShadow: '0 0 20px #00ffaa'
};
