import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import {
  SunsetBackground,
  EmeraldBackground,
  MagicBackground,
  CustomBackgroundImage,
  KineticText,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneOpening: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase = Math.floor(frame / 60);
  const text = phase === 0 ? "ガチバトル<br/>決定‼️" : phase === 1 ? (theme.themeColor === 'orange' ? "みんな<br/>私についてきな！" : theme.themeColor === 'green' ? "大自然のパワー<br/>見せてあげる！" : theme.themeColor === 'purple' ? "古の魔力が<br/>今、呼び覚まされる..." : "全員の力で<br/>バチバチに行くぞ!") : (theme.themeColor === 'orange' ? "さぁ行くよ‼️" : theme.themeColor === 'green' ? "準備はいい？" : theme.themeColor === 'purple' ? "終焉の儀式を<br/>始めよう" : "俺に力を<br/>貸してくれ！"); 

  const localFrame = frame % 60;
  const entry = spring({ frame: localFrame, fps, config: { stiffness: 400, damping: 15 } });
  const pulse = Math.pow(Math.max(0, 1 - localFrame / 45), 4) * 1.5 + 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000' }}>
      {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame} /> : theme.themeColor === 'green' ? <EmeraldBackground frame={frame} /> : theme.themeColor === 'purple' ? <MagicBackground frame={frame} /> : null)}
      
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)',
        opacity: 0.6,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, ${theme.themeColor === 'orange' ? 'rgba(120,10,0,' : theme.themeColor === 'green' ? 'rgba(0,120,50,' : theme.themeColor === 'purple' ? 'rgba(80,0,120,' : 'rgba(120,10,0,'}${0.7 * pulse}) 0%, transparent 70%)`,
      }} />

      {localFrame < 20 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 6 }}>
          <div style={{
            width: interpolate(localFrame, [0, 20], [0, 1600]),
            height: interpolate(localFrame, [0, 20], [0, 1600]),
            borderRadius: '50%',
            border: `${Math.max(0, 15 - localFrame * 0.7)}px solid rgba(255,100,0,${Math.max(0, 1 - localFrame / 20)})`,
            boxShadow: `0 0 60px rgba(255,60,0,${Math.max(0, 0.8 - localFrame / 20)})`,
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>
      )}

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 250 + 150 * pulse, height: 600 + 400 * pulse,
          background: `radial-gradient(ellipse at 50% 60%, white 0%, ${theme.glowColor} 35%, ${theme.themeColor} 65%, transparent 80%)`,
          filter: `blur(${20 + 20 * pulse}px)`, borderRadius: '40% 40% 60% 60%',
          boxShadow: `0 0 ${300 * pulse}px ${100 * pulse}px ${theme.themeColor}`, 
          transform: `scale(${pulse * entry})`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 50px' }}>
        <KineticText
          text={text}
          frame={localFrame}
          fps={fps}
          fontSize={theme.themeColor !== 'orange' && phase === 2 ? 210 : 120}
          color="#FFFFFF"
          glowColor={theme.glowColor}
          fontFamily={theme.fontFamily}
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
