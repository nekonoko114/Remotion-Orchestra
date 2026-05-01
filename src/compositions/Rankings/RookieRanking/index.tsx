import React from 'react';
import { AbsoluteFill, Audio, staticFile, Video, interpolate, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { IntroSequence } from './IntroSequence';
import { RankingAnnouncement } from './RankingAnnouncement';
import { Ending } from '../../DeepSeekCollaboration/components/Ending';
import { PremiumFrame } from './PremiumFrame';
import { BeatShake, GlitchOverlay } from './BeatSync';
import { LiquidGoldLines } from './LiquidGoldLines';
import { flareTransition } from '../../../components/effects/CustomTransitions';

type Props = {
  bpm: number;
  bgmFile: string;
};

export const RookieRanking: React.FC<Props> = ({ bpm, bgmFile }) => {

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', color: 'white', overflow: 'hidden' }}>
      <GlitchOverlay bpm={bpm} />
      
      {/* 1. Silken Aurora Layer (Background) */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <BeatShake bpm={bpm}>
          <AbsoluteFill style={{ transform: `scale(1.1)` }}>
             {/* Optimized Base Video with Silken Look (Single layer) */}
            <Video 
              src={staticFile("assets/video/Stop_right_there_and_continue_202604300823.mp4")} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: `brightness(${interpolate(useCurrentFrame(), [0, 60], [0.7, 1.1], { extrapolateRight: 'clamp' })}) contrast(1.1) saturate(1.4) contrast(1.1)`,
              }} 
              muted
              loop
            />
          </AbsoluteFill>
        </BeatShake>
      </AbsoluteFill>

      {/* 2. Gold Accents Layer */}
      <AbsoluteFill style={{ zIndex: 5 }}>
        <LiquidGoldLines />
      </AbsoluteFill>



      {/* 3. Main Content Layer (Icons, Names, Transitions) */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        <TransitionSeries>
          {/* Intro Sequence (Opening & NextPage Combined) */}
          <TransitionSeries.Sequence durationInFrames={390}>
            <IntroSequence bpm={bpm} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: 25 })}
            presentation={flareTransition({ color: '#F7E7CE' })}
          />

          {/* Rank 3: popoさん */}
          <TransitionSeries.Sequence durationInFrames={300}>
            <RankingAnnouncement rank={3} color="#CD7F32" name="じゅんじゅん🩷" duration={300} bpm={bpm} iconUrl="assets/avatars/popo820128.jpg" />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: 25 })}
            presentation={flareTransition({ color: '#F7E7CE' })}
          />

          {/* Rank 2: りあ🐰🍀 */}
          <TransitionSeries.Sequence durationInFrames={300}>
            <RankingAnnouncement rank={2} color="#C0C0C0" name="りあ🐰🍀" duration={300} bpm={bpm} iconUrl="assets/avatars/ria.kangoshi.jpg" />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: 25 })}
            presentation={flareTransition({ color: '#F7E7CE' })}
          />

          {/* Rank 1: なるりれ */}
          <TransitionSeries.Sequence durationInFrames={300}>
            <RankingAnnouncement rank={1} color="#FFD700" name="なるりれ" duration={300} bpm={bpm} iconUrl="assets/avatars/karaindaisuki.jpg" />
          </TransitionSeries.Sequence>

          <TransitionSeries.Sequence durationInFrames={105}>
            <Ending bpm={bpm} />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>

      {/* 6. Overall Premium Frame (Highest Layer) */}
      <PremiumFrame />

      {/* 5. Audio Sync */}
      <Audio
        src={staticFile(bgmFile)}
        startFrom={1900}
        volume={0.7}
      />
      {/* 4. Bottom Information Bar (To hide original video text and add branding) */}
      <AbsoluteFill style={{ 
        zIndex: 1000, 
        justifyContent: 'flex-end' 
      }}>
        <div style={{
          width: '100%',
          height: '160px',
          background: 'linear-gradient(to top, rgba(0, 30, 15, 0.95) 0%, rgba(0, 50, 30, 0.8) 70%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '2px solid rgba(0, 255, 136, 0.3)',
        }}>
          <div style={{
            width: '40px',
            height: '2px',
            background: '#00FF88',
            marginTop: '15px',
            opacity: 0.5,
          }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
