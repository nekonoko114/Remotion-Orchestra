import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {
  SvgDefs,
  Particle,
  KineticText,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneEndingList: React.FC<{ theme: BattleSpiritTheme; duration: number }> = ({ theme, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeOut = interpolate(frame, [duration - 60, duration], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {frame < 10 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: 1 - frame / 10, zIndex: 10 }} />}
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {new Array(60).fill(0).map((_, i) => <Particle key={i} seed={i * 31} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} />)}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.7) 70%, transparent 100%)' }} />
          <KineticText text={theme.endingText} frame={frame} fps={fps} startFrame={30} fontSize={130} color="#FFFFFF" glowColor={theme.themeColor} fontFamily={theme.fontFamily} style={{ lineHeight: 1.5, letterSpacing: 5, position: 'relative', zIndex: 2 }} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
