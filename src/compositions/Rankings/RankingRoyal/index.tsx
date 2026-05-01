import React from 'react';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import {
  AbsoluteFill,
  useVideoConfig,
  useCurrentFrame,
  Audio,
  staticFile,
  OffthreadVideo,
  Sequence,
} from 'remotion';
import type { RankingRoyalProps } from './schema';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
import { GridBridge } from './GridBridge';
import type { Liver } from '../../../types/ranking-types';
import { ROYAL_THEME } from './theme';
import { BeatPulse } from './BeatPulse';

export const OPENING_SEC = 5.5;
export const GROUP_SEC = 5;
export const TOP_RANK_SEC = 5.0;
export const GRID_BRIDGE_SEC = 2.0;
export const ENDING_SEC = 3.5;
export const TRANSITION_FRAMES = 24; // ゆったりとしたトランジション
export const LAST_TRANSITION_FRAMES = 30;

export const TOTAL_DURATION_FRAMES =
  (OPENING_SEC +
    GROUP_SEC * 2 +
    GRID_BRIDGE_SEC * 5 +
    TOP_RANK_SEC * 5 +
    ENDING_SEC) *
    60 -
  (12 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

export const RankingRoyal: React.FC<RankingRoyalProps> = ({
  bpm,
  bgmFile,
  bgmStartFrom,
  rankingVideo,
  openingTitle1,
  openingTitle2,
  openingTitle3,
  openingTitle4,
  openingDate,
  openingSubtitle,
  useGlitch,
  glitchIntensity,
  top3Video,
  livers,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const OPENING_DURATION = OPENING_SEC * fps;
  const GROUP_DURATION = GROUP_SEC * fps;
  const TOP_RANK_DURATION = TOP_RANK_SEC * fps;
  const GRID_BRIDGE_DURATION = GRID_BRIDGE_SEC * fps;
  const ENDING_DURATION = ENDING_SEC * fps;
  const TRANSITION_DURATION = TRANSITION_FRAMES;
  const LAST_TRANSITION_DURATION = LAST_TRANSITION_FRAMES;

  // 5位の個別発表（1つ目のGridBridge）が始まるフレームを計算
  const top5StartTime = OPENING_DURATION + (GROUP_DURATION * 2) + (TRANSITION_DURATION * 2);
  const currentBpm = frame < top5StartTime ? bpm / 2 : bpm;

  // ラグジュアリーなので少しゆっくりとしたフェードやスライドを使用
  const transition = fade(); // エレガントなフェード遷移
  const timing = linearTiming({ durationInFrames: TRANSITION_DURATION });

  return (
    <AbsoluteFill style={{ backgroundColor: ROYAL_THEME.colors.midnightBlue }}>
      <Audio
        src={staticFile(bgmFile)}
        loop
        startFrom={Math.floor(bgmStartFrom * fps)}
      />

      {/* ランキング発表中（15位〜1位）のみ現れる、リセットされない背景動画レイヤー */}
      <Sequence from={OPENING_DURATION - TRANSITION_DURATION} durationInFrames={(GROUP_DURATION * 2) + (GRID_BRIDGE_DURATION * 5) + (TOP_RANK_DURATION * 5) + (TRANSITION_DURATION * 13)}>
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          <OffthreadVideo
            src={staticFile(rankingVideo)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.5) contrast(1.2) saturate(0.8)',
            }}
            startFrom={306}
            muted
            playbackRate={0.7}
          />
          <AbsoluteFill
            style={{
              background: 'radial-gradient(circle, transparent 20%, rgba(0,8,20,0) 100%)',
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 背景の深みを出すためのヴィネット（周辺減光）レイヤー */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle, transparent 20%, rgba(0,8,20,0) 100%)',
          }}
        />
      </AbsoluteFill>

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
          <Opening
            title1={openingTitle1}
            title2={openingTitle2}
            title3={openingTitle3}
            title4={openingTitle4}
            date={openingDate}
            subtitle={openingSubtitle}
          />
        </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP 11~15'}
              livers={livers.filter((d) => d.rank >= 11 && d.rank <= 15) as unknown as Liver[]}
              useGlitch={useGlitch}
              glitchIntensity={glitchIntensity}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP 6~10'}
              livers={livers.filter((d) => d.rank >= 6 && d.rank <= 10) as unknown as Liver[]}
              useGlitch={useGlitch}
              glitchIntensity={glitchIntensity}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge rank={5} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={5}
              title="5th"
              liver={livers.find((d) => d.rank === 5) as unknown as Liver}
              top3Video={top3Video}
              bpm={bpm}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge rank={4} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={4}
              title="4th"
              liver={livers.find((d) => d.rank === 4) as unknown as Liver}
              top3Video={top3Video}
              bpm={bpm}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />
          
          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge rank={3} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={3}
              title="3th"
              liver={livers.find((d) => d.rank === 3) as unknown as Liver}
              top3Video={top3Video}
              bpm={bpm}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />
          
          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge rank={2} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={2}
              title="2th"
              liver={livers.find((d) => d.rank === 2) as unknown as Liver}
              top3Video={top3Video}
              bpm={bpm}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />
          
          <TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
            <GridBridge rank={1} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={transition} timing={timing} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={1}
              title="1th"
              liver={livers.find((d) => d.rank === 1) as unknown as Liver}
              top3Video={top3Video}
              bpm={bpm}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()} // エンディングへの最後もフェードで
            timing={linearTiming({ durationInFrames: LAST_TRANSITION_DURATION })}
          />

          <TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
            <Ending videoSrc={rankingVideo} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

      {/* ロイヤル仕様の外枠とロゴ */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          border: `6px solid ${ROYAL_THEME.colors.champagneGoldDark}`,
          boxShadow: `inset 0 0 100px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 0, 0, 0.8)`,
          zIndex: 9999,
        }}
      >
         <AbsoluteFill style={{
          border: `2px solid ${ROYAL_THEME.colors.champagneGoldLight}`,
          margin: 10,
          opacity: 0.5,
         }} />

      </AbsoluteFill>
      {/* 音楽に合わせたライティング・パルス（最前面で全体を照らす） */}
      <BeatPulse bpm={currentBpm} />
    </AbsoluteFill>
  );
};
