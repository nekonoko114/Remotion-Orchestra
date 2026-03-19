import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
  staticFile,
  Img,
} from 'remotion';
import {
  SunsetBackground,
  CustomBackgroundImage,
  KaleidoscopeBackground,
  SvgDefs,
  KineticText,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneOpponent: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - 5, fps, config: { stiffness: 600, damping: 12, mass: 2 } });
  const impact = Math.max(0, 1 - Math.max(0, frame - 5) / 10);
  const shakeX = (random(frame) - 0.5) * 60 * impact;
  const shakeY = (random(frame + 11) - 0.5) * 60 * impact;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      {theme.opponentBackground ? (
        <CustomBackgroundImage src={theme.opponentBackground} frame={frame + 480} opacity={0.6} />
      ) : theme.customBackground ? (
        <CustomBackgroundImage src={theme.customBackground} frame={frame + 480} opacity={0.6} />
      ) : theme.themeColor === 'orange' ? (
        <SunsetBackground frame={frame + 480} opacity={0.6} />
      ) : null}
      {theme.features.useKaleidoscope !== false && <KaleidoscopeBackground imageSrc={staticFile(theme.opponent.image)} frame={frame} opacity={0.4} />}
      <SvgDefs frame={frame} />
      {impact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: impact, zIndex: 10 }} />}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transform: `scale(${interpolate(drop, [0, 0.4, 1], [5, 0.9, 1])}) translateY(${interpolate(drop, [0, 1], [-1000, 0])}px)`, filter: `brightness(${1 + impact * 5}) drop-shadow(0 0 ${impact * 100}px ${theme.themeColor})`, opacity: drop > 0.05 ? 1 : 0 }}>
          <div style={{ width: 800, height: 800, borderRadius: '50%', overflow: 'hidden', border: `10px solid white`, marginBottom: 20, boxShadow: `0 0 50px ${theme.themeColor}` }}>
            <Img src={staticFile(theme.opponent.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {theme.themeColor !== 'orange' && (
            <KineticText text={theme.opponent.name} frame={frame} fps={fps} startFrame={15} fontSize={120} color="white" glowColor={theme.glowColor} fontFamily={theme.fontFamily} animationType={theme.textAnimation} style={{ letterSpacing: 4, whiteSpace: 'nowrap' }} />
          )}
        </div>
      </AbsoluteFill>
      
      {theme.themeColor === 'orange' && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: 100, background: 'rgba(0,0,0,0.7)', padding: '20px 60px', borderRadius: '50px', border: '4px solid gold', fontSize: 60, fontWeight: 900, color: 'white', textShadow: `0 0 20px ${theme.themeColor}`, fontFamily: theme.fontFamily }}>
            {theme.opponent.name}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
