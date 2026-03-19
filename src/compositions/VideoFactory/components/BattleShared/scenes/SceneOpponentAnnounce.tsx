import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import {
  SvgDefs,
  KineticText,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

const FloatingBokeh: React.FC<{ frame: number }> = ({ frame }) => {
  const { width, height } = useVideoConfig();
  const particles = new Array(35).fill(0).map((_, i) => {
    const seed = (i * 137) % 251;
    const startX = (seed / 251) * width;
    const size = 60 + (seed % 180); 
    const speedY = 2 + (seed % 6);
    const speedX = Math.sin(i) * 2;
    
    const yPos = height + size - ((frame * speedY + i * 80) % (height + size * 2)); 
    const xPos = startX + Math.sin(frame * 0.02 + i) * 80 * speedX;
    
    // 金色、白、水色
    const colors = ['rgba(255, 215, 0, 0.45)', 'rgba(255, 255, 255, 0.4)', 'rgba(135, 206, 235, 0.5)'];
    const color = colors[i % colors.length];

    return (
      <div 
        key={i}
        style={{
          position: 'absolute',
          left: xPos,
          top: yPos,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          filter: `blur(${size * 0.15}px)`,
          mixBlendMode: 'screen',
        }}
      />
    );
  });

  return <AbsoluteFill style={{ pointerEvents: 'none' }}>{particles}</AbsoluteFill>;
};

export const SceneOpponentAnnounce: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { stiffness: 400, damping: 10 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${theme.themeColor === 'orange' ? '#442200' : '#440000'} 0%, #000 70%)`, opacity: interpolate(frame, [0, 10], [0, 1]) }} />
      <FloatingBokeh frame={frame} />
      <AbsoluteFill style={{ filter: theme.themeColor === 'blue' ? 'none' : 'url(#glitch-red)', opacity: 0.6, transform: `translateX(${(frame % 2) * 20}px)` }}>
        <div style={{ flex: 1, border: `40px solid ${theme.themeColor}` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <KineticText text="対戦相手は！？" frame={frame} fps={fps} fontSize={120} color="#FFF" glowColor={theme.glowColor} fontFamily={theme.fontFamily} animationType={theme.textAnimation} style={{ letterSpacing: 20, transform: `scale(${interpolate(scale, [0, 1], [4.0, 1])}) rotate(${interpolate(scale, [0, 1], [360, 0])}deg) skewX(-15deg)`, opacity: 1 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
