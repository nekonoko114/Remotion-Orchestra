import React from 'react';
import { AbsoluteFill, Audio, Video, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Opening } from './Opening';
import { NextPage } from './NextPage';
import { TensionGap } from './TensionGap';
import { RankingAnnouncement } from './RankingAnnouncement';
import { Ending } from './Ending';
// import { highIntensityZoom } from './BeatSync';

type Props = {
  bpm: number;
  bgmFile: string;
};

export const RookieRanking: React.FC<Props> = ({ bpm, bgmFile }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', color: 'white', overflow: 'hidden' }}>
      {/* 1. Permanent High-Energy Background (Fire) */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <Video
          src={staticFile("assets/pixabay/videos/partickle-fire.mp4")}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: 'hue-rotate(10deg) saturate(2) brightness(1.5) contrast(1.2)',
          }}
          muted
          loop
        />
        {/* Color Grading: Golden Overglow */}
        <AbsoluteFill style={{
          backgroundColor: '#FFD700',
          mixBlendMode: 'overlay',
          opacity: 0.4,
        }} />
      </AbsoluteFill>

      {/* 2. Main Content with Transitions */}
      <TransitionSeries>
        {/* Intro */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <Opening bpm={bpm} />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 15 })}
          presentation={highIntensityZoom()}
        />

        {/* Pre-Reveal */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <NextPage bpm={bpm} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 10 })}
          presentation={fade()}
        />

        {/* Tension Build-up */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <TensionGap bpm={bpm} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 25 })}
          presentation={highIntensityZoom()}
        />

        {/* Rank 3: まゆみ */}
        <TransitionSeries.Sequence durationInFrames={200}>
          <RankingAnnouncement rank={3} color="#CD7F32" name="まゆみ" duration={200} bpm={bpm} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 25 })}
          presentation={highIntensityZoom()}
        />

        {/* Rank 2: ぼく天然ミッキー */}
        <TransitionSeries.Sequence durationInFrames={200}>
          <RankingAnnouncement rank={2} color="#C0C0C0" name="ぼく天然ミッキー" duration={200} bpm={bpm} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 30 })}
          presentation={highIntensityZoom()}
        />

        {/* Rank 1: 一条美月 */}
        <TransitionSeries.Sequence durationInFrames={350}>
          <RankingAnnouncement rank={1} color="#FFD700" name="一条美月" duration={350} bpm={bpm} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence durationInFrames={150}>
          <Ending bpm={bpm} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* 3. Audio Sync */}
      <Audio
        src={staticFile(bgmFile)}
        startFrom={0}
        volume={0.7}
      />
    </AbsoluteFill>
  );
};
