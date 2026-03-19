import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  SvgDefs,
  Particle,
  KineticText,
  GreenScreenOverlay,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneEndingList: React.FC<{ theme: BattleSpiritTheme; duration: number }> = ({ theme, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {frame < 10 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: 1 - frame / 10, zIndex: 10 }} />}
      <AbsoluteFill>
        {!theme.features?.hideDefaultParticles && new Array(60).fill(0).map((_, i) => <Particle key={i} seed={i * 31} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} direction={theme.themeColor === '#e0f7fa' ? 'down' : 'up'} />)}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          {(theme.themeColor !== '#e0f7fa' && theme.themeColor !== '#fce4ec') && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.7) 70%, transparent 100%)' }} />
          )}
          <KineticText text={theme.endingText} frame={frame} fps={fps} startFrame={30} fontSize={110} color="#FFFFFF" glowColor={theme.glowColor} fontFamily={theme.fontFamily} animationType={theme.textAnimation} style={{ lineHeight: 1.5, letterSpacing: 5, position: 'relative', zIndex: 2 }} />
        </AbsoluteFill>
      </AbsoluteFill>

      {frame >= 30 && theme.themeColor === '#e0f7fa' && (
        <GreenScreenOverlay
          src="assets/pixabay/videos/pixabay_heart_sparkle_overlay_green_screen_4k_love_gold_he_111573.mp4"
          frame={frame}
          startFrame={30}
          flipX={true}
          opacity={0.9}
        />
      )}
    </AbsoluteFill>
  );
};
