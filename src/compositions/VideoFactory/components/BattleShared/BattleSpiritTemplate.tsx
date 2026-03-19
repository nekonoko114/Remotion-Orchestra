import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  OffthreadVideo,
  interpolate,
} from 'remotion';
import {
  LightLeak,
  GlobalFrameThemed,
  MagicCircle,
  SnowEffect,
  GiantSnowflakeEffect,
  PanningVideoBackground,
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

// ========================
// Main Template component
// ========================

export const BattleSpiritTemplate: React.FC<{ theme: BattleSpiritTheme; children?: React.ReactNode }> = ({ theme, children }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const OP_DUR = theme.customDurations?.opening ?? 6 * fps;
  const DATE_DUR = theme.customDurations?.date ?? 4 * fps;
  const INTRO_LIVER_DUR = theme.customDurations?.liverIntro ?? theme.liverIntroDuration ?? 6 * fps;
  const MSG_DUR = theme.customDurations?.msg ?? 1.5 * fps;
  const OPPONENT_DUR = theme.customDurations?.opponent ?? 3 * fps;
  const VS_DUR = theme.customDurations?.vs ?? 4 * fps;
  const RULE_DUR = theme.customDurations?.rule ?? 3 * fps;
  const ENDING_DUR = theme.customDurations?.ending ?? 5 * fps;
  const LOGO_DUR = theme.customDurations?.logo ?? 3 * fps;

  const s1 = 0;
  const s2 = s1 + OP_DUR;
  const s3 = s2 + DATE_DUR;
  const s4 = s3 + INTRO_LIVER_DUR;
  const s5 = s4 + MSG_DUR;
  const s6 = s5 + OPPONENT_DUR;
  const s7 = s6 + VS_DUR;
  const s8 = s7 + RULE_DUR;
  const s9 = s8 + ENDING_DUR;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <GlobalFrameThemed color={theme.themeColor} glowColor={theme.glowColor} />
      <Audio src={staticFile(theme.music.src)} volume={theme.music.volume ?? 0.6} loop startFrom={theme.music.startFrom} />
      <LightLeak frame={frame} color={theme.lightLeakColor || theme.themeColor} />
      
      {theme.themeColor === 'purple' && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: 0.3, pointerEvents: 'none' }}>
          <div style={{ transform: `scale(1.5) rotate(${frame * 0.2}deg)` }}>
            <MagicCircle frame={frame} color="#ffdd44" size={1200} rotationX={60} />
          </div>
        </AbsoluteFill>
      )}

      {children}

      <Sequence from={s1} durationInFrames={OP_DUR}><SceneOpening theme={theme} /></Sequence>
      <Sequence from={s2} durationInFrames={DATE_DUR}><SceneDate theme={theme} /></Sequence>
      <Sequence from={s3} durationInFrames={INTRO_LIVER_DUR}><SceneLiver theme={theme} duration={INTRO_LIVER_DUR} /></Sequence>
      {MSG_DUR > 0 && <Sequence from={s4} durationInFrames={MSG_DUR}><SceneOpponentAnnounce theme={theme} /></Sequence>}
      <Sequence from={s5} durationInFrames={OPPONENT_DUR}><SceneOpponent theme={theme} /></Sequence>
      <Sequence from={s6} durationInFrames={VS_DUR}><SceneVs theme={theme} /></Sequence>
      {theme.themeColor === '#e0f7fa' && (
        <Sequence from={s7} durationInFrames={RULE_DUR + ENDING_DUR}>
          <PanningVideoBackground
            src="assets/pixabay/videos/pixabay_snow_globe_snowman_christmas_texture_snow_particle_98978.mp4"
            frame={frame}
            startFrame={s7}
            duration={RULE_DUR + ENDING_DUR}
          />
        </Sequence>
      )}

      <Sequence from={s7} durationInFrames={RULE_DUR}><SceneRules theme={theme} /></Sequence>
      <Sequence from={s8} durationInFrames={ENDING_DUR}><SceneEndingList theme={theme} duration={ENDING_DUR} /></Sequence>
      <Sequence from={s9} durationInFrames={LOGO_DUR}><SceneLogo /></Sequence>

      {/* Global Foreground Effects layer */}
      {theme.features?.useSnowEffect && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <SnowEffect frame={frame} />
          <GiantSnowflakeEffect frame={frame} color="#ffffff" glowColor={theme.glowColor} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
