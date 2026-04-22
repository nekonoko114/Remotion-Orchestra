import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { Easing } from 'remotion';
import { wipe } from '@remotion/transitions/wipe';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
import { TimeBackground } from '../TimeBackground';
import { AbsoluteFill, useVideoConfig, Audio, staticFile, useCurrentFrame, OffthreadVideo } from 'remotion';
import RANKING_DATA_TIME_JSON from '../data-time.json';
import type { Liver } from '../types';
import { CinematicBorder } from '../CinematicBorder';

const BGM_SOURCE = staticFile('assets/audio/music/Velocity-Shift.mp3');
const BGM_START_FROM = 0.0; // Seconds

const BACKGROUND_VIDEO = staticFile('assets/pixabay/videos/pixabay_clock_time_minutes_old_gold_retro_antique_spiral_l_207864.mp4');

export const OPENING_SEC = 5;
export const GRID_BRIDGE_SEC = 4.0;
export const GROUP_SEC = 6;
export const TOP_RANK_SEC = 5.0;
export const TOP1_RANK_SEC = 6.0;
export const ENDING_SEC = 3;
export const TRANSITION_FRAMES = 16;
export const LAST_TRANSITION_FRAMES = 15;

type RankingTimeProps = {
  data?: Liver[];
  openingTitle2?: string;
  openingTitle3?: string;
  openingDate?: string;
  themeColor?: string;
  glowColor?: string;
};

export const RankingTime = (props: RankingTimeProps) => {
  const { fps } = useVideoConfig();
  const RANKING_DATA = props.data || (RANKING_DATA_TIME_JSON as unknown as Liver[]);
  const {
    openingTitle2 = '配信時間',
    openingTitle3 = 'ランキング',
    openingDate = '2026年4月',
    themeColor = '#d000ff',
    glowColor = 'rgba(208, 0, 255, 0.6)',
  } = props;

  const OPENING_DURATION = OPENING_SEC * fps;
  const GROUP_DURATION = Math.round(GROUP_SEC * fps);
  const TOP_RANK_DURATION = Math.round(TOP_RANK_SEC * fps);
  const TOP1_RANK_DURATION = Math.round(TOP1_RANK_SEC * fps);
  const GRID_BRIDGE_DURATION = Math.round(GRID_BRIDGE_SEC * fps);
  const ENDING_DURATION = ENDING_SEC * fps;
  const TRANSITION_DURATION = TRANSITION_FRAMES;

  const timing = linearTiming({
    durationInFrames: TRANSITION_DURATION,
    easing: Easing.out(Easing.quad),
  });

  const frame = useCurrentFrame();

  // Calculate range for 15-6 rank groups
  const groupScenesStart = OPENING_DURATION;
  const groupScenesEnd = OPENING_DURATION + (GROUP_DURATION * 2) + TRANSITION_DURATION;
  const isGroupScene = frame >= groupScenesStart && frame < groupScenesEnd;


  return (
    <AbsoluteFill>
      <TimeBackground />
      <AbsoluteFill>
        <Audio src={BGM_SOURCE} startFrom={BGM_START_FROM * fps} />
      </AbsoluteFill>

      <CinematicBorder color={themeColor} glowColor={glowColor} />

      {/* Persistent Background for Ranking Scenes (15th down to 1st) */}
      {frame >= groupScenesStart && frame < (ENDING_DURATION ? 99999 : 0) /* Adjust logic as needed */ && (
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
            loop
          />
          <AbsoluteFill style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }} />
        </AbsoluteFill>
      )}

      <AbsoluteFill>

        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
            <Opening title2={openingTitle2} title3={openingTitle3} date={openingDate} themeColor={themeColor} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-top-left' })} timing={timing} />

          {/* 15~11位 */}
          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup title={'TOP 11~15'} livers={RANKING_DATA.filter((d) => d.rank >= 11 && d.rank <= 15)} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={timing} />

          {/* 10~6位 (統合) */}
          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup title={'TOP 6~10'} livers={RANKING_DATA.filter((d) => d.rank >= 6 && d.rank <= 10)} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-top' })} timing={timing} />

          {/* 5位発表 */}
          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal 
              rank={5} 
              title="5th" 
              liver={RANKING_DATA.find((d) => d.rank === 5) || RANKING_DATA[0]} 
              themeColor={themeColor}
              glowColor={glowColor}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom' })} timing={timing} />

          {/* 4位発表 */}
          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal 
              rank={4} 
              title="4th" 
              liver={RANKING_DATA.find((d) => d.rank === 4) || RANKING_DATA[0]} 
              themeColor={themeColor}
              glowColor={glowColor}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: 'from-top' })} timing={timing} />

          {/* 3位発表 */}
          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal 
              rank={3} 
              title="3th" 
              liver={RANKING_DATA.find((d) => d.rank === 3) || RANKING_DATA[0]} 
              themeColor={themeColor}
              glowColor={glowColor}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: 'from-bottom' })} timing={timing} />

          {/* 2位発表 */}
          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal 
              rank={2} 
              title="2th" 
              liver={RANKING_DATA.find((d) => d.rank === 2) || RANKING_DATA[1]} 
              themeColor={themeColor}
              glowColor={glowColor}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={timing} />

          {/* 1位発表 */}
          <TransitionSeries.Sequence durationInFrames={TOP1_RANK_DURATION}>
            <Top1Reveal 
              rank={1} 
              title="1th" 
              liver={RANKING_DATA.find((d) => d.rank === 1) || RANKING_DATA[2]} 
              themeColor={themeColor}
              glowColor={glowColor}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={wipe({ direction: 'from-right' })} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
            <Ending />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
