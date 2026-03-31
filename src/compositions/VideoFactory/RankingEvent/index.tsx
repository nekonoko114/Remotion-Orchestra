import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { AbsoluteFill, useVideoConfig, Audio, staticFile } from 'remotion';
import RANKING_DATA_JSON from '../data.json';
import type { Liver } from '../types';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
import { GridBridge } from './GridBridge';
import { useBeatValue } from '../utils/beat-sync';
import { slashTransition } from '../transitions/SlashTransition';

import { useCurrentFrame } from 'remotion';

const RANKING_DATA = RANKING_DATA_JSON as unknown as Liver[];

const BPM = 194; // Analyzed BPM
const BGM_START_FROM = 0;

export const OPENING_SEC = 5;
export const GROUP_SEC = 4.5;     // 10 beats (relaxed stagger)
export const TOP_RANK_SEC = 4;  // 8 beats
export const GRID_BRIDGE_SEC = 4; // 12 beats
export const ENDING_SEC = 4;    // 8 beats
export const TRANSITION_FRAMES = 12;  // Speedy slash transition
export const LAST_TRANSITION_FRAMES = 15;

const SLASH = slashTransition({ color: '#00FF7F' });
const TIMING = linearTiming({ durationInFrames: TRANSITION_FRAMES });
const LAST_TIMING = linearTiming({ durationInFrames: LAST_TRANSITION_FRAMES });

export const RankingEvent = () => {
  const { fps } = useVideoConfig();

  const OPENING_DURATION = Math.round(OPENING_SEC * fps);
  const GROUP_DURATION = Math.round(GROUP_SEC * fps);
  const TOP_RANK_DURATION = Math.round(TOP_RANK_SEC * fps);
  const GRID_BRIDGE_DURATION = Math.round(GRID_BRIDGE_SEC * fps);
  const ENDING_DURATION = Math.round(ENDING_SEC * fps);

  const { pulse } = useBeatValue(BPM);
  const beatScale = 1 + pulse * 0.01;

  const frame = useCurrentFrame();

  // Correct Timing Calculation for Event Border (based on TransitionSeries overlapping logic)
  const T = TRANSITION_FRAMES;
  const D_opening = OPENING_DURATION;
  const D_group = GROUP_DURATION;
  const D_grid = GRID_BRIDGE_DURATION;
  const D_rank = TOP_RANK_DURATION;

  // Each Sequence starts T frames before the previous one ends (overlapping)
  const offsetG1 = D_opening - T;
  const offsetG2 = offsetG1 + D_group - T;
  const offsetG3 = offsetG2 + D_group - T;
  const offsetGrid = offsetG3 + D_group - T;
  const offset3 = offsetGrid + D_grid - T; // 3位
  const offset2 = offset3 + D_rank - T;   // 2位
  const offset1 = offset2 + D_rank - T;   // 1位

  // Adjusted offsets to change color mid-transition (T/2 frames before the new sequence fully takes over)
  const MID = T / 2;
  const getBorderColor = (f: number) => {
    if (f >= offset1 + MID) return { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.8)' }; // Gold
    if (f >= offset2 + MID) return { color: '#C0C0C0', glow: 'rgba(192, 192, 192, 0.8)' }; // Silver
    if (f >= offset3 + MID) return { color: '#B87333', glow: 'rgba(184, 115, 51, 0.8)' }; // Copper
    return { color: '#00FF7F', glow: 'rgba(0, 255, 127, 0.8)' }; // Default Green
  };

  const { color: frameColor, glow: frameGlow } = getBorderColor(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Audio
        src={staticFile('assets/audio/music/Ours-to-Hold.mp3')}
        loop
        startFrom={Math.floor(BGM_START_FROM * fps)}
      />

      <AbsoluteFill style={{ transform: `scale(${beatScale})` }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
            <Opening />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n10~8'}
              livers={RANKING_DATA.filter((d) => d.rank >= 8 && d.rank <= 10)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n7~6'}
              livers={RANKING_DATA.filter((d) => d.rank >= 6 && d.rank <= 7)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n5~4'}
              livers={RANKING_DATA.filter((d) => d.rank >= 4 && d.rank <= 5)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={3}
              title="3位"
              liver={RANKING_DATA.find((d) => d.rank === 3)!}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={2}
              title="2位"
              liver={RANKING_DATA.find((d) => d.rank === 2)!}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={1}
              title="1位"
              liver={RANKING_DATA.find((d) => d.rank === 1)!}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-right' })}
            timing={LAST_TIMING}
          />

          <TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
            <Ending />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>

      {/* DYNAMIC GLOWING BORDER */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          border: `15px solid ${frameColor}`,
          boxShadow: `inset 0 0 50px ${frameGlow}, 0 0 50px ${frameGlow}`,
          zIndex: 9999,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />
    </AbsoluteFill>
  );
};
