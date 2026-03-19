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
  SparkleEffect,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneDate: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = Math.max(0, 1 - frame / 8); 
  const drop1 = spring({ frame: frame - 5, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const drop2 = spring({ frame: frame - 20, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const shakeX = theme.textAnimation === 'fade' ? 0 : (random(frame) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 5) / 10);
  const shakeY = theme.textAnimation === 'fade' ? 0 : (random(frame + 11) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 25) / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame + 180} opacity={0.8} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 180} opacity={0.8} /> : null)}
      <SvgDefs frame={frame} />
      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 8} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} direction={theme.themeColor === '#e0f7fa' ? 'down' : 'up'} />
      ))}
      
      {theme.textAnimation === 'fade' && (
        <SparkleEffect frame={frame} count={25} glowColor="#ffea00" color="#fff9c4" />
      )}
      
      {theme.textAnimation === 'fade' ? (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: theme.themeColor === '#e0f7fa' ? 'white' : 'black', opacity: interpolate(frame, [0, 20], [1, 0], { extrapolateRight: 'clamp' }), zIndex: 100, pointerEvents: 'none' }} />
      ) : (
        flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash, zIndex: 100, pointerEvents: 'none' }} />
      )}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 60 }}>
        <div style={{
          textAlign: 'center',
          transform: theme.textAnimation === 'fade' ? 'none' : `scale(${interpolate(drop1, [0, 1], [5, 1])}) translateY(${interpolate(drop1, [0, 1], [-800, 0])}px)`,
          opacity: theme.textAnimation === 'fade' ? 1 : (drop1 > 0.05 ? 1 : 0),
        }}>
          {theme.themeColor === '#e0f7fa' ? (
            <>
              <KineticText
                text={(theme.dateText?.[0] || '2026年<br/>3月27日').split('<br/>')[0] || '2026年'}
                frame={frame}
                fps={fps}
                startFrame={10}
                fontSize={120}
                color="#FFF"
                glowColor={theme.glowColor}
                fontFamily={theme.fontFamily} animationType={theme.textAnimation}
                style={{ marginBottom: 10 }}
              />
              <KineticText
                text={(theme.dateText?.[0] || '2026年<br/>3月27日').split('<br/>')[1] || '3月28日'}
                frame={frame}
                fps={fps}
                startFrame={15}
                fontSize={200}
                color="#FFF"
                glowColor={theme.glowColor}
                fontFamily={theme.fontFamily} animationType={theme.textAnimation}
                style={{ marginBottom: 20 }}
              />
            </>
          ) : (
            <KineticText
              text={theme.dateText?.[0] || '2026年<br/>3月27日'}
              frame={frame}
              fps={fps}
              startFrame={10}
              fontSize={140}
              color="#FFF"
              glowColor={theme.glowColor}
              fontFamily={theme.fontFamily} animationType={theme.textAnimation}
              style={{ marginBottom: 20 }}
            />
          )}
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
                color={theme.themeColor === '#e0f7fa' ? '#FFEA00' : '#FFF'}
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
