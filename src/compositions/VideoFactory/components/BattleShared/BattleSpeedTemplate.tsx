import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  interpolate,
} from 'remotion';
import {
  LightLeak,
  GlobalFrameThemed,
  SpeedLinesBackground,
  FlashOverlay,
  GlitchNoise,
} from './BattleSharedComponents';
import { BattleSpiritTheme } from './types';

import { SceneOpening } from './scenes/SceneOpening';
import { SceneDate } from './scenes/SceneDate';
import { SceneLiver } from './scenes/SceneLiver';
import { SceneOpponentAnnounce } from './scenes/SceneOpponentAnnounce';
import { SceneOpponent } from './scenes/SceneOpponent';
import { SceneVs } from './scenes/SceneVs';
import { SceneRules } from './scenes/SceneRules';
import { SceneEndingList } from './scenes/SceneEndingList';
import { SceneLogo } from './scenes/SceneLogo';

export const BattleSpeedTemplate: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const OP_DUR = 6 * fps;
  const DATE_DUR = 4 * fps;
  const INTRO_LIVER_DUR = theme.liverIntroDuration ?? 6 * fps;
  const MSG_DUR = 1.5 * fps;
  const OPPONENT_DUR = 3 * fps;
  const VS_DUR = 4 * fps;
  const RULE_DUR = 3 * fps;
  const ENDING_DUR = 5 * fps;
  const LOGO_DUR = 3 * fps;

  const s1 = 0;
  const s2 = s1 + OP_DUR;
  const s3 = s2 + DATE_DUR;
  const s4 = s3 + INTRO_LIVER_DUR;
  const s5 = s4 + MSG_DUR;
  const s6 = s5 + OPPONENT_DUR;
  const s7 = s6 + VS_DUR;
  const s8 = s7 + RULE_DUR;
  const s9 = s8 + ENDING_DUR;

  // Rapid flash logic
  const flashTriggers = [s2, s3, s4, s5, s6, s7, s8, s9];

  // Hyper-Speed Camera Logic (10fr cycles)
  const getCameraStyle = () => {
    if (frame >= s1 && frame < s2) {
      const cycle = Math.floor(frame / 10) % 6;
      const progress = (frame % 10) / 10;
      
      // Dramatic zoom base
      const baseZoom = 2.0;
      
      const positions = [
        { x: -100, y: -100, z: 1.2 }, // Top-Left + Zoom
        { x: 100, y: 100, z: 0.8 },   // Bottom-Right + Wide
        { x: 200, y: -50, z: 1.5 },   // Far-Right + Tight
        { x: -200, y: 50, z: 1.3 },   // Far-Left + Tight
        { x: 0, y: 300, z: 1.1 },     // Extreme Bottom
        { x: 0, y: -300, z: 1.4 },    // Extreme Top
      ];

      const pos = positions[cycle];
      
      // Instant switch logic (or very fast interpolation)
      const x = interpolate(progress, [0, 0.1, 1], [pos.x, pos.x, pos.x * 1.5]);
      const y = interpolate(progress, [0, 0.1, 1], [pos.y, pos.y, pos.y * 1.5]);
      const z = baseZoom * interpolate(progress, [0, 1], [pos.z, pos.z * 1.2]);

      return {
        transform: `translate(${x}px, ${y}px) scale(${z})`,
      };
    }
    return { transform: 'scale(1)' };
  };

  const cameraStyle = getCameraStyle();
  
  // Glitch Logic: 20fr before 615fr, 5fr after 615fr
  const glitchInterval = frame >= 615 ? 5 : 20;
  const showGlitch = (frame % glitchInterval) < 3;
  const glitchRotation = frame >= 615 ? (Math.floor(frame / 5) * 30) % 180 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', ...cameraStyle }}>
      <GlobalFrameThemed color={theme.themeColor} glowColor={theme.glowColor} />
      <Audio src={staticFile(theme.music.src)} volume={theme.music.volume ?? 0.6} loop startFrom={theme.music.startFrom} />
      
      {/* Background Speed Effects */}
      <Sequence from={0}>
        <SpeedLinesBackground frame={frame} color={theme.themeColor} opacity={0.4} count={150} />
      </Sequence>
      
      {showGlitch && <GlitchNoise frame={frame} opacity={0.6} rotation={glitchRotation} />}

      <LightLeak frame={frame} color={theme.lightLeakColor || theme.themeColor} />
      <FlashOverlay frame={frame} triggerFrames={flashTriggers} />

      <Sequence from={s1} durationInFrames={OP_DUR}><SceneOpening theme={theme} /></Sequence>
      <Sequence from={s2} durationInFrames={DATE_DUR}><SceneDate theme={theme} /></Sequence>
      <Sequence from={s3} durationInFrames={INTRO_LIVER_DUR}><SceneLiver theme={theme} duration={INTRO_LIVER_DUR} /></Sequence>
      <Sequence from={s4} durationInFrames={MSG_DUR}><SceneOpponentAnnounce theme={theme} /></Sequence>
      <Sequence from={s5} durationInFrames={OPPONENT_DUR}><SceneOpponent theme={theme} /></Sequence>
      <Sequence from={s6} durationInFrames={VS_DUR}><SceneVs theme={theme} /></Sequence>
      <Sequence from={s7} durationInFrames={RULE_DUR}><SceneRules theme={theme} /></Sequence>
      <Sequence from={s8} durationInFrames={ENDING_DUR}><SceneEndingList theme={theme} duration={ENDING_DUR} /></Sequence>
      <Sequence from={s9} durationInFrames={LOGO_DUR}><SceneLogo /></Sequence>
    </AbsoluteFill>
  );
};
