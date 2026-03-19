import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {
  KineticText,
  ShockwaveEffect,
  LightPillarEffect,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

const SakuraPetalPath = "M 0,0 C 30,-30 50,-60 30,-100 C 15,-105 5,-90 0,-80 C -5,-90 -15,-105 -30,-100 C -50,-60 -30,-30 0,0 Z";

const SakuraOutlineTracing: React.FC<{ frame: number; color?: string; glow?: string }> = ({ frame, color = '#ff80ab', glow = '#f06292' }) => {
  const drawProgress = interpolate(frame, [0, 120], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fillAlpha = interpolate(frame, [100, 120], [0, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fadeOut, pointerEvents: 'none', zIndex: 10 }}>
      <svg width="1500" height="1500" viewBox="-150 -150 300 300" style={{ 
        transform: `scale(${interpolate(frame, [0, 180], [1, 1.3])}) rotate(${frame * 0.1}deg)`,
        filter: `drop-shadow(0 0 20px ${glow})`
      }}>
        {[0, 1, 2, 3, 4].map(i => (
          <path
            key={i}
            d={SakuraPetalPath}
            fill={`rgba(255, 128, 171, ${fillAlpha})`}
            stroke={color}
            strokeWidth="2"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={drawProgress}
            style={{ transform: `rotate(${i * 72}deg)`, transformOrigin: '0px 0px' }}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const SceneOpening: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase = Math.floor(frame / 60);
  const defaultText = phase === 0 ? "ガチバトル<br/>決定‼️" : phase === 1 ? (theme.themeColor === 'orange' ? "みんな<br/>私についてきな！" : theme.themeColor === 'green' ? "大自然のパワー<br/>見せてあげる！" : theme.themeColor === 'purple' ? "古の魔力が<br/>今、呼び覚まされる..." : "全員の力で<br/>バチバチに行くぞ!") : (theme.themeColor === 'orange' ? "さぁ行くよ‼️" : theme.themeColor === 'green' ? "準備はいい？" : theme.themeColor === 'purple' ? "終焉の儀式を<br/>始めよう" : "俺に力を<br/>貸してくれ！"); 
  const text = theme.openingText?.[phase] || defaultText;

  const localFrame = frame % 60;
  const pulse = Math.pow(Math.max(0, 1 - localFrame / 45), 4) * 1.5 + 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)',
        opacity: 0.6,
      }} />

      {!theme.features?.useSnowEffect && !theme.features?.hideDefaultParticles && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${theme.themeColor === 'orange' ? 'rgba(120,10,0,' : theme.themeColor === 'green' ? 'rgba(0,120,50,' : theme.themeColor === 'purple' ? 'rgba(80,0,120,' : 'rgba(120,10,0,'}${0.7 * pulse}) 0%, transparent 70%)`,
        }} />
      )}

      {!theme.features?.useSnowEffect && !theme.features?.hideDefaultParticles && (
        <>
          <ShockwaveEffect 
            frame={localFrame} 
            color={theme.themeColor === 'orange' ? '#ff6400' : theme.themeColor === 'green' ? '#00c853' : theme.themeColor === 'purple' ? '#aa00ff' : theme.themeColor} 
            glowColor={theme.glowColor}
          />
          <LightPillarEffect
            frame={localFrame}
            color={theme.themeColor}
            glowColor={theme.glowColor}
          />
        </>
      )}

      {theme.themeColor === '#fce4ec' && frame < 180 && (
        <SakuraOutlineTracing frame={frame} color="white" glow={theme.glowColor} />
      )}

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 50px', zIndex: 100 }}>
        <KineticText
          text={text}
          frame={localFrame}
          fps={fps}
          fontSize={(theme.themeColor === '#fce4ec' && phase === 0) ? 210 : (theme.themeColor !== 'orange' && phase === 2 ? 210 : 120)}
          color="#FFFFFF"
          glowColor={theme.glowColor}
          fontFamily={theme.fontFamily} animationType={theme.textAnimation}
          style={{
            lineHeight: 1.2,
            letterSpacing: 10,
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))',
            ...(theme.themeColor !== 'orange' && phase === 2 ? {
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '60px',
            } : {}),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
