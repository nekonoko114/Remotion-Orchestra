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
      {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame + 480} opacity={0.6} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 480} opacity={0.6} /> : null)}
      <KaleidoscopeBackground imageSrc={staticFile(theme.opponent.image)} frame={frame} opacity={0.4} />
      <SvgDefs frame={frame} />
      {impact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: impact, zIndex: 10 }} />}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transform: `scale(${interpolate(drop, [0, 0.4, 1], [5, 0.9, 1])}) translateY(${interpolate(drop, [0, 1], [-1000, 0])}px)`, filter: `brightness(${1 + impact * 5}) drop-shadow(0 0 ${impact * 100}px ${theme.themeColor})`, opacity: drop > 0.05 ? 1 : 0 }}>
          <div style={{ width: 800, height: 800, borderRadius: '50%', overflow: 'hidden', border: `10px solid white`, marginBottom: 20, boxShadow: `0 0 50px ${theme.themeColor}` }}>
            <Img src={staticFile(theme.opponent.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <KineticText text={theme.opponent.name} frame={frame} fps={fps} startFrame={15} fontSize={140} color="white" glowColor={theme.glowColor} style={{ letterSpacing: 4, whiteSpace: 'nowrap' }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
