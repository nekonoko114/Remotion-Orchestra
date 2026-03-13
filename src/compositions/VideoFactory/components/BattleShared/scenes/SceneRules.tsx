import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from 'remotion';
import {
  SvgDefs,
  Particle,
  KineticText,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneRules: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r1 = spring({ frame: frame - 10, fps, config: { stiffness: 600, damping: 10 } });
  const r2 = spring({ frame: frame - 40, fps, config: { stiffness: 600, damping: 10 } });
  const rulesImpact = Math.max(0, 1 - Math.max(0, frame - 10) / 6) + Math.max(0, 1 - Math.max(0, frame - 40) / 6);
  const shakeX = (random(frame) - 0.5) * 30 * Math.min(1, rulesImpact);
  const shakeY = (random(frame + 77) - 0.5) * 30 * Math.min(1, rulesImpact);

  return (
    <AbsoluteFill style={{ backgroundColor: '#040000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {rulesImpact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: rulesImpact * 0.8, zIndex: 10 }} />}
      {new Array(30).fill(0).map((_, i) => <Particle key={i} seed={i * 19 + 800} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} />)}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 80 }}>
        <div style={{ transform: `scale(${interpolate(r1, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${-(interpolate(r1, [0, 1], [20, 5]))}deg)`, opacity: r1 > 0.05 ? 1 : 0, filter: `drop-shadow(0 0 100px ${theme.themeColor})` }}>
          <KineticText text="やり直し無し<br/>一本勝負" frame={frame} fps={fps} startFrame={20} fontSize={160} color="#FFF" glowColor={theme.glowColor} style={{ fontWeight: 900 }} />
        </div>
        <div style={{ transform: `scale(${interpolate(r2, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${interpolate(r2, [0, 1], [-20, 5])}deg)`, opacity: r2 > 0.05 ? 1 : 0, filter: `drop-shadow(0 0 100px orange)` }}>
          <KineticText text="フルアイテム" frame={frame} fps={fps} startFrame={50} fontSize={160} color="#FFF" glowColor="orange" style={{ fontWeight: 900 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
