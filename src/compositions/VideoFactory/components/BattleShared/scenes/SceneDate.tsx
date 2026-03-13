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
  SunsetBackground,
  CustomBackgroundImage,
  KineticText,
  SvgDefs,
  Particle,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneDate: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = Math.max(0, 1 - frame / 8); 
  const drop1 = spring({ frame: frame - 5, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const drop2 = spring({ frame: frame - 20, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const shakeX = (random(frame) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 5) / 10);
  const shakeY = (random(frame + 11) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 25) / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame + 180} opacity={0.8} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 180} opacity={0.8} /> : null)}
      <SvgDefs frame={frame} />
      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 8} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} />
      ))}
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash }} />}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 60 }}>
        <div style={{
          textAlign: 'center',
          transform: `scale(${interpolate(drop1, [0, 1], [5, 1])}) translateY(${interpolate(drop1, [0, 1], [-800, 0])}px)`,
          opacity: drop1 > 0.05 ? 1 : 0,
        }}>
          <KineticText
            text="2026年&#10;3月27日"
            frame={frame}
            fps={fps}
            startFrame={10}
            fontSize={210}
            color="#FFF"
            glowColor={theme.glowColor}
            style={{ marginBottom: 20 }}
          />
          <KineticText
            text="Friday"
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={140}
            color="#FFF"
            glowColor={theme.glowColor}
            style={{ letterSpacing: 10 }}
          />
        </div>
        <div style={{
          transform: `scale(${interpolate(drop2, [0, 1], [3, 1])}) skewX(-15deg)`,
          opacity: drop2 > 0.05 ? 1 : 0,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <KineticText
            text="21:00"
            frame={frame}
            fps={fps}
            startFrame={45}
            fontSize={240}
            color="#FFF"
            glowColor={theme.glowColor}
            style={{ fontWeight: 900 }}
          />
        </div>
        <div style={{
          transform: `scale(${interpolate(drop2, [0, 1], [3, 1])}) skewX(-15deg)`,
          opacity: drop2 > 0.05 ? 1 : 0,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <KineticText
            text="出陣‼️"
            frame={frame}
            fps={fps}
            startFrame={45}
            fontSize={240}
            color="#FFF"
            glowColor={theme.glowColor}
            style={{ fontWeight: 900 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
