import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
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

const RANKING_DATA = RANKING_DATA_JSON as unknown as Liver[];

const BPM = 152;
const BGM_START_FROM = 0;

export const OPENING_SEC = 5.5;
export const GROUP_SEC = 5;
export const TOP_RANK_SEC = 5.6;
export const GRID_BRIDGE_SEC = 8.0;
export const ENDING_SEC = 2.5;
export const TRANSITION_FRAMES = 28;
export const LAST_TRANSITION_FRAMES = 20;

export const RankingVertical = () => {
  const { fps } = useVideoConfig();

  const OPENING_DURATION = OPENING_SEC * fps;
  const GROUP_DURATION = GROUP_SEC * fps;
  const TOP_RANK_DURATION = TOP_RANK_SEC * fps;
  const GRID_BRIDGE_DURATION = GRID_BRIDGE_SEC * fps;
  const ENDING_DURATION = ENDING_SEC * fps;
  const TRANSITION_DURATION = TRANSITION_FRAMES;
  const LAST_TRANSITION_DURATION = LAST_TRANSITION_FRAMES;

  const transition = flip({
    direction: 'from-bottom',
    perspective: 1000,
  });

  const timing = linearTiming({ durationInFrames: TRANSITION_DURATION });

  const { pulse } = useBeatValue(BPM);
  const beatScale = 1 + pulse * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      <Audio
        src={staticFile('assets/audio/music/Break_the_Shell.mp3')}
        loop
        startFrom={Math.floor(BGM_START_FROM * fps)}
      />

      <AbsoluteFill style={{ transform: `scale(${beatScale})` }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
            <Opening />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n10~8'}
              livers={RANKING_DATA.filter((d) => d.rank >= 8 && d.rank <= 10)}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n7~6'}
              livers={RANKING_DATA.filter((d) => d.rank >= 6 && d.rank <= 7)}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n5~4'}
              livers={RANKING_DATA.filter((d) => d.rank >= 4 && d.rank <= 5)}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={3}
              title="3位"
              liver={RANKING_DATA.find((d) => d.rank === 3)!}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={2}
              title="2位"
              liver={RANKING_DATA.find((d) => d.rank === 2)!}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={1}
              title="1位"
              liver={RANKING_DATA.find((d) => d.rank === 1)!}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-right' })}
            timing={linearTiming({ durationInFrames: LAST_TRANSITION_DURATION })}
          />

          <TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
            <Ending />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          border: '15px solid #FF0000',
          boxShadow: 'inset 0 0 50px rgba(255, 0, 0, 0.8), 0 0 50px rgba(255, 0, 0, 0.8)',
          zIndex: 9999,
        }}
      />
    </AbsoluteFill>
  );
};
