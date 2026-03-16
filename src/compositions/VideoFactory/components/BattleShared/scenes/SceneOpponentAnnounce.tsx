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

export const SceneOpponentAnnounce: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textFlash = Math.floor(frame / 4) % 2 === 0 ? 1 : 0.2;
  const scale = spring({ frame, fps, config: { stiffness: 400, damping: 10 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${theme.themeColor === 'orange' ? '#442200' : '#440000'} 0%, #000 70%)`, opacity: interpolate(frame, [0, 10], [0, 1]) }} />
      <AbsoluteFill style={{ filter: theme.themeColor === 'blue' ? 'none' : 'url(#glitch-red)', opacity: 0.6, transform: `translateX(${(frame % 2) * 20}px)` }}>
        <div style={{ flex: 1, border: `40px solid ${theme.themeColor}` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <KineticText text="対戦相手は！？" frame={frame} fps={fps} fontSize={120} color="#FFF" glowColor={theme.glowColor} fontFamily={theme.fontFamily} style={{ letterSpacing: 20, transform: `scale(${interpolate(scale, [0, 1], [4.0, 1])}) rotate(${interpolate(scale, [0, 1], [360, 0])}deg) skewX(-15deg)`, opacity: textFlash }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
