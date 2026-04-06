import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { flip } from '@remotion/transitions/flip';
import { slide } from '@remotion/transitions/slide';
import {
  AbsoluteFill,
  useVideoConfig,
  Audio,
  staticFile,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import type { RankingVerticalProps } from './schema';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
import { GridBridge } from './GridBridge';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';

export const OPENING_SEC = 5.5;
export const GROUP_SEC = 5;
export const TOP_RANK_SEC = 5.6;
export const GRID_BRIDGE_SEC = 3.5;
export const ENDING_SEC = 2.5;
export const TRANSITION_FRAMES = 28;
export const LAST_TRANSITION_FRAMES = 20;

export const RankingVertical: React.FC<RankingVerticalProps> = ({
  bpm,
  bgmFile,
  bgmStartFrom,
  openingVideo,
  rankingVideo,
  openingTitle1,
  openingTitle2,
  openingTitle3,
  openingDate,
  openingSubtitle,
  useGlitch,
  glitchIntensity,
  top3Video,
  livers,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

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

  const { pulse } = useBeatValue(bpm);
  const beatScale = 1 + pulse * 0.015;

  // Background video timing for Top 15-4
  const bgStart = OPENING_DURATION;
  const bgEnd = OPENING_DURATION + GROUP_DURATION * 4;
  const bgOpacity = interpolate(
    frame,
    [bgStart - 10, bgStart, bgEnd, bgEnd + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Slow pan from right to left (Show right side first, then move to left)
  const panX = interpolate(
    frame,
    [bgStart, bgEnd],
    [0, 0], // Starting at -75% (far right) and moving to 0% (far left) for 400% width
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      <Audio
        src={staticFile(bgmFile)}
        loop
        startFrom={Math.floor(bgmStartFrom * fps)}
      />

      {/* Persistent Fire Background for Ranks 10-4 */}
      <AbsoluteFill style={{ opacity: bgOpacity, overflow: 'hidden' }}>
        <AbsoluteFill
          style={{
            width: '200%', // 4x width for panning
            transform: `translateX(${panX}%)`,
          }}
        >
          <OffthreadVideo
            src={staticFile(rankingVideo)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            startFrom={0}
            muted
          />
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${beatScale})` }}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
            <Opening
              videoSrc={openingVideo}
              title1={openingTitle1}
              title2={openingTitle2}
              title3={openingTitle3}
              date={openingDate}
              subtitle={openingSubtitle}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n15~11'}
              livers={livers.filter((d) => d.rank >= 11 && d.rank <= 15) as Liver[]}
              useGlitch={useGlitch}
              glitchIntensity={glitchIntensity}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n10~8'}
              livers={livers.filter((d) => d.rank >= 8 && d.rank <= 10) as Liver[]}
              useGlitch={useGlitch}
              glitchIntensity={glitchIntensity}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n7~6'}
              livers={livers.filter((d) => d.rank >= 6 && d.rank <= 7) as Liver[]}
              useGlitch={useGlitch}
              glitchIntensity={glitchIntensity}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n5~4'}
              livers={livers.filter((d) => d.rank >= 4 && d.rank <= 5) as Liver[]}
              useGlitch={useGlitch}
              glitchIntensity={glitchIntensity}
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
              liver={livers.find((d) => d.rank === 3) as Liver}
              top3Video={top3Video}
              bpm={bpm}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={2}
              title="2位"
              liver={livers.find((d) => d.rank === 2) as Liver}
              top3Video={top3Video}
              bpm={bpm}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={1}
              title="1位"
              liver={livers.find((d) => d.rank === 1) as Liver}
              top3Video={top3Video}
              bpm={bpm}
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
