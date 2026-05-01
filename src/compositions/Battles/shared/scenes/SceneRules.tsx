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
import { BattleSpiritTheme } from '../../../../types/ranking-types';

export const SceneRules: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rulesImpact = Math.max(0, 1 - Math.max(0, frame - 10) / 6) + Math.max(0, 1 - Math.max(0, frame - 40) / 6);
  const shakeX = (random(frame) - 0.5) * 30 * Math.min(1, rulesImpact);
  const shakeY = (random(frame + 77) - 0.5) * 30 * Math.min(1, rulesImpact);

  return (
    <AbsoluteFill style={{ backgroundColor: (theme.themeColor === '#e0f7fa' || theme.themeColor === '#fce4ec') ? 'transparent' : '#040000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {rulesImpact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: rulesImpact * 0.8, zIndex: 10 }} />}
      {!theme.features?.hideDefaultParticles && new Array(30).fill(0).map((_, i) => <Particle key={i} seed={i * 19 + 800} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} direction={theme.themeColor === '#e0f7fa' ? 'down' : 'up'} />)}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: theme.rulesText && theme.rulesText.length > 2 ? 40 : 80 }}>
        {(theme.rulesText || ['やり直し無し<br/>一本勝負', 'フルアイテム']).map((text, i) => {
          const ruleImpact = spring({ frame: frame - 10 - (i * 15), fps, config: { stiffness: 600, damping: 10 } });
          const rotate = i % 2 === 0 ? interpolate(ruleImpact, [0, 1], [20, -5]) : interpolate(ruleImpact, [0, 1], [-20, 5]);
          const ruleGlow = i % 2 === 0 ? theme.themeColor : 'orange';
          return (
            <div key={i} style={{ transform: `scale(${interpolate(ruleImpact, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${rotate}deg)`, opacity: ruleImpact > 0.05 ? 1 : 0, filter: `drop-shadow(0 0 100px ${ruleGlow})` }}>
              <KineticText text={text} frame={frame} fps={fps} startFrame={20 + (i * 15)} fontSize={theme.rulesText && theme.rulesText.length > 2 ? 120 : 160} color="#FFF" glowColor={ruleGlow} fontFamily={theme.fontFamily} animationType={theme.textAnimation} style={{ fontWeight: 900 }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
