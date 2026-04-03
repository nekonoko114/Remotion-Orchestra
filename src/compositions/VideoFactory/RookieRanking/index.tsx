import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, Sequence, Video } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { IntroSequence } from './IntroSequence';
import { TensionGap } from './TensionGap';
import { RankingAnnouncement } from './RankingAnnouncement';
import { Ending } from './Ending';
import { BeatShake, GlitchOverlay, highIntensityZoom } from './BeatSync';

type Props = {
  bpm: number;
  bgmFile: string;
};

export const RookieRanking: React.FC<Props> = ({ bpm, bgmFile }) => {

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', color: 'white', overflow: 'hidden' }}>
      <GlitchOverlay bpm={bpm} />
      
      {/* 1. Permanent Unified Background (Rookie Ranking Image) */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <BeatShake bpm={bpm}>
          <AbsoluteFill style={{ 
            transform: `scale(1.1)`,
          }}>
            <Img 
              src={staticFile("assets/backgrounds/rookie-ranking.png")} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: 'brightness(0.9) contrast(1.1)',
              }} 
            />
            {/* Subtle Vignette Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
              mixBlendMode: 'multiply',
            }} />
          </AbsoluteFill>
        </BeatShake>
      </AbsoluteFill>

      {/* 2. Main Content with Transitions */}
      <TransitionSeries>
        {/* Intro Sequence (Opening & NextPage Combined) */}
        <TransitionSeries.Sequence durationInFrames={390}>
          <IntroSequence bpm={bpm} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 10 })}
          presentation={fade()}
        />

        {/* Tension Build-up */}
        <TransitionSeries.Sequence durationInFrames={260}>
          <TensionGap bpm={bpm} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 25 })}
          presentation={highIntensityZoom()}
        />

        {/* Rank 3: まゆみ */}
        <TransitionSeries.Sequence durationInFrames={200}>
          <RankingAnnouncement rank={3} color="#CD7F32" name="まゆみ" duration={200} bpm={bpm} iconUrl="assets/avatars/2161646824.jpg" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 25 })}
          presentation={highIntensityZoom()}
        />

        {/* Rank 2: ぼく天然ミッキー */}
        <TransitionSeries.Sequence durationInFrames={200}>
          <RankingAnnouncement rank={2} color="#C0C0C0" name="ぼく天然ミッキー" duration={200} bpm={bpm} iconUrl="assets/avatars/user58402831659341.jpg" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 30 })}
          presentation={highIntensityZoom()}
        />

        {/* Rank 1: 一条美月 */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <RankingAnnouncement rank={1} color="#FFD700" name="一条美月" duration={240} bpm={bpm} iconUrl="assets/avatars/mizuki2525214.jpg" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Sequence durationInFrames={150}>
          <Ending bpm={bpm} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* 3. Global Overlay Effect (380 - 640) - Outline RPG */}
      <Sequence from={380} durationInFrames={260}>
        <Video 
          src={staticFile("assets/pixabay/videos/outline-storke-rpg.mp4")}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'screen',
          }}
          muted
        />
      </Sequence>

      {/* 5. Fire Overlay (785 - 1480) - Rank 3 to Rank 1 */}
      <Sequence from={785} durationInFrames={695}>
        <Video 
          src={staticFile("assets/pixabay/videos/partickle-fire.mp4")}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'plus-lighter',
            opacity: 0.8,
            zIndex: 100,
          }}
          muted
          loop
        />
      </Sequence>

      {/* 4. Audio Sync */}
      <Audio
        src={staticFile(bgmFile)}
        startFrom={0}
        volume={0.7}
      />
    </AbsoluteFill>
  );
};


