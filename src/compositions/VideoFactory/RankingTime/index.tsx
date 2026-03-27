import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { Easing } from 'remotion';
import { wipe } from '@remotion/transitions/wipe';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
import { GridBridge } from './GridBridge';
import { TimeBackground } from '../TimeBackground';
import { AbsoluteFill, useVideoConfig, Audio, staticFile, useCurrentFrame, OffthreadVideo } from 'remotion';
import RANKING_DATA_TIME_JSON from '../data.json';
import type { Liver } from '../types';
import { CinematicBorder } from '../CinematicBorder';

const BGM_SOURCE = staticFile('assets/audio/music/Velocity-Shift.mp3');
const BGM_START_FROM = 0.0; // Seconds

const BACKGROUND_VIDEO = staticFile('assets/pixabay/videos/pixabay_clock_time_fire_flame_ritual_149142.mp4');

export const OPENING_SEC = 5;
export const GRID_BRIDGE_SEC = 8.0;
export const GROUP_SEC = 160 / 30;
export const TOP_RANK_SEC = 160 / 30;
export const ENDING_SEC = 3;
export const TRANSITION_FRAMES = 40;

export const RankingTime = (props: { data?: Liver[] }) => {
  const { fps } = useVideoConfig();
  const RANKING_DATA = props.data || (RANKING_DATA_TIME_JSON as unknown as Liver[]);

  const OPENING_DURATION = OPENING_SEC * fps;
  const GROUP_DURATION = Math.round(GROUP_SEC * fps);
  const TOP_RANK_DURATION = Math.round(TOP_RANK_SEC * fps);
  const GRID_BRIDGE_DURATION = GRID_BRIDGE_SEC * fps;
  const ENDING_DURATION = ENDING_SEC * fps;
  const TRANSITION_DURATION = TRANSITION_FRAMES;

  const timing = linearTiming({
    durationInFrames: TRANSITION_DURATION,
    easing: Easing.out(Easing.quad),
  });

  const frame = useCurrentFrame();

  // Calculate range for 10-4 rank groups
  const groupScenesStart = OPENING_DURATION;
  const groupScenesEnd = OPENING_DURATION + (GROUP_DURATION * 3) + (TRANSITION_DURATION * 2);
  const isGroupScene = frame >= groupScenesStart && frame < groupScenesEnd;


  return (
    <AbsoluteFill>
      <TimeBackground />
      <AbsoluteFill>
        <Audio src={BGM_SOURCE} startFrom={BGM_START_FROM * fps} />
      </AbsoluteFill>

      <CinematicBorder color="#d000ff" glowColor="rgba(208, 0, 255, 0.6)" />

      {/* Persistent Background for 10-4 Ranks */}
      {isGroupScene && (
        <AbsoluteFill style={{ zIndex: 0, opacity: 0.8 }}>
          <OffthreadVideo
            src={BACKGROUND_VIDEO}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'hue-rotate(280deg) contrast(1.4) brightness(1.2)',
            }}
            muted
          />
          <AbsoluteFill style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }} />
        </AbsoluteFill>
      )}

      <AbsoluteFill>

        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
            <Opening />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-top-left' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup title={'TOP10~8'} livers={RANKING_DATA.filter((d) => d.rank >= 8 && d.rank <= 10)} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-top' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup title={'TOP7~6'} livers={RANKING_DATA.filter((d) => d.rank >= 6 && d.rank <= 7)} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-top-right' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup title={'TOP5~4'} livers={RANKING_DATA.filter((d) => d.rank >= 4 && d.rank <= 5)} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-right' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom-right' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal rank={3} title="3位" liver={RANKING_DATA.find((d) => d.rank === 3) || RANKING_DATA[0]} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal rank={2} title="2位" liver={RANKING_DATA.find((d) => d.rank === 2) || RANKING_DATA[1]} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom-left' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal rank={1} title="1位" liver={RANKING_DATA.find((d) => d.rank === 1) || RANKING_DATA[2]} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
            <Ending />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
