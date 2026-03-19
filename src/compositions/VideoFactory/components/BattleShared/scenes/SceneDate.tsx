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
  KineticText,
  SvgDefs,
  Particle,
  SparkleEffect,
  CustomDateTextManager,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneDate: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop1 = spring({ frame: frame - 5, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const drop2 = spring({ frame: frame - 20, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const shakeX = theme.textAnimation === 'fade' ? 0 : (random(frame) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 5) / 10);
  const shakeY = theme.textAnimation === 'fade' ? 0 : (random(frame + 11) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 25) / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {!theme.features?.hideDefaultParticles && new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 8} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} direction={theme.themeColor === '#e0f7fa' ? 'down' : 'up'} />
      ))}
      
      {theme.textAnimation === 'fade' && (
        <SparkleEffect frame={frame} count={25} glowColor="#ffea00" color="#fff9c4" />
      )}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 60 }}>
        <div style={{
          textAlign: 'center',
          transform: theme.textAnimation === 'fade' ? 'none' : `scale(${interpolate(drop1, [0, 1], [5, 1])}) translateY(${interpolate(drop1, [0, 1], [-800, 0])}px)`,
          opacity: theme.textAnimation === 'fade' ? 1 : (drop1 > 0.05 ? 1 : 0),
        }}>
          <CustomDateTextManager
            text={theme.dateText?.[0] || '2026年<br/>3月27日'}
            frame={frame} fps={fps} theme={theme}
            fontSize1={theme.themeColor === '#e0f7fa' ? 120 : 140}
            fontSize2={theme.themeColor === '#e0f7fa' ? 200 : undefined}
            startFrame1={10}
            startFrame2={15}
          />
          <KineticText
            text={theme.dateText?.[1] || 'Friday'}
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={theme.themeColor === '#e0f7fa' ? 120 : 90}
            color="#FFF"
            glowColor={theme.glowColor}
            fontFamily={theme.fontFamily} animationType={theme.textAnimation}
            style={{ letterSpacing: 10 }}
          />
        </div>
        {theme.dateText?.length === 0 ? null : (
          <>
            <div style={{
              transform: theme.textAnimation === 'fade' ? 'none' : `scale(${interpolate(drop2, [0, 1], [3, 1])}) skewX(-15deg)`,
              opacity: theme.textAnimation === 'fade' ? 1 : (drop2 > 0.05 ? 1 : 0),
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <KineticText
                text={theme.dateText?.[2] || '21:00'}
                frame={frame}
                fps={fps}
                startFrame={45}
                fontSize={theme.themeColor === '#e0f7fa' ? 200 : 180}
                color="#FFF"
                glowColor={theme.glowColor}
                fontFamily={theme.fontFamily} animationType={theme.textAnimation}
                style={{ fontWeight: 900 }}
              />
            </div>
            <div style={{
              transform: theme.textAnimation === 'fade' ? 'none' : `scale(${interpolate(drop2, [0, 1], [3, 1])}) skewX(-15deg)`,
              opacity: theme.textAnimation === 'fade' ? 1 : (drop2 > 0.05 ? 1 : 0),
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <KineticText
                text={theme.dateText?.[3] || '出陣‼️'}
                frame={frame}
                fps={fps}
                startFrame={45}
                fontSize={theme.themeColor === '#e0f7fa' ? 200 : 160}
                color={(theme.themeColor === '#e0f7fa' || theme.themeColor === '#fce4ec') ? '#FFEA00' : '#FFF'}
                glowColor={theme.glowColor}
                fontFamily={theme.fontFamily} animationType={theme.textAnimation}
                style={{ fontWeight: 900 }}
              />
            </div>
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
