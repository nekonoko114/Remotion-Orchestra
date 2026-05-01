import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { AbsoluteFill, useVideoConfig, Audio, staticFile, interpolate } from 'remotion';
import type { Liver } from '../types';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
import { LiverScan } from './LiverScan';
import { DualCyberFrame } from './DualCyberFrame';
import { CyberBackground } from './CyberBackground';
import { cyberGateTransition } from '../transitions/CyberGateTransition'; 

import { useCurrentFrame } from 'remotion';
import RANKING_DATA_EVENT_JSON from '../data-event.json';

const RANKING_DATA = (RANKING_DATA_EVENT_JSON as unknown as Liver[]).map((liver) => ({
  ...liver,
  username: liver.id,
  user_id: liver.id,
  unique_id: liver.id,
  ok: true,
  error: null,
  signature: null,
  creator_account: '',
  creator_name: liver.nickname,
  content: null,
}));

const BGM_START_FROM = 10;

export const BPM = 150;
export const OPENING_SEC = 4.8;  // 12 beats
export const GROUP_SEC = 4.8;    // 12 beats
export const SCAN_SEC = 1.6;     // 4 beats
export const REVEAL_SEC = 4.8;   // 12 beats
export const REVEAL_1_SEC = 6.4; // 16 beats
export const ENDING_SEC = 4.8;   // 12 beats
export const TRANSITION_FRAMES = 24; // 1 beat (at 60fps)
export const LAST_TRANSITION_FRAMES = 96; // 4 beats

const SLASH = cyberGateTransition({ color: '#00ffff', accentColor: '#ff1e1e' });
const TIMING = linearTiming({ durationInFrames: TRANSITION_FRAMES });
const LAST_TIMING = linearTiming({ durationInFrames: LAST_TRANSITION_FRAMES });

export const RankingEvent = () => {
  const { fps } = useVideoConfig();

  const OPENING_DURATION = Math.round(OPENING_SEC * fps);
  const GROUP_DURATION = Math.round(GROUP_SEC * fps);
  const ENDING_DURATION = Math.round(ENDING_SEC * fps);


  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: 'rgb(0,0,0,0.5)' }}>
      {/* 共通の背景レイヤーを一括読み込み */}
      <CyberBackground 
        opacity={interpolate(frame, [OPENING_DURATION, OPENING_DURATION + TRANSITION_FRAMES], [1.0, 0.95], { extrapolateRight: 'clamp' })} 
        brightness={interpolate(frame, [OPENING_DURATION, OPENING_DURATION + TRANSITION_FRAMES], [1.2, 1.1], { extrapolateRight: 'clamp' })}
        playbackRate={frame < OPENING_DURATION ? 1.2 : 1.0}
      />

      <Audio
        src={staticFile('assets/audio/music/Flesh_and_Chrome.mp3')}
        loop
        startFrom={Math.floor(BGM_START_FROM * fps)}
      />

      <AbsoluteFill>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
            <Opening />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 15~11（5名） */}
          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n11~15'}
              livers={RANKING_DATA.filter((d) => d.rank >= 11 && d.rank <= 15)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 6~10（5名） */}
          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n6~10'}
              livers={RANKING_DATA.filter((d) => d.rank >= 6 && d.rank <= 10)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 5位 */}
          <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
            <LiverScan rank={5} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
            <Top1Reveal
              rank={5}
              title="5th"
              liver={RANKING_DATA.find((d) => d.rank === 5)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 4位 */}
          <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
            <LiverScan rank={4} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
            <Top1Reveal
              rank={4}
              title="4th"
              liver={RANKING_DATA.find((d) => d.rank === 4)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 3位 */}
          <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
            <LiverScan rank={3} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
            <Top1Reveal
              rank={3}
              title="3th"
              liver={RANKING_DATA.find((d) => d.rank === 3)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 2位 */}
          <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
            <LiverScan rank={2} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
            <Top1Reveal
              rank={2}
              title="2th"
              liver={RANKING_DATA.find((d) => d.rank === 2)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 1位 */}
          <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
            <LiverScan rank={1} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={Math.round(6 * fps)}>
            <Top1Reveal
              rank={1}
              title="1th"
              liver={RANKING_DATA.find((d) => d.rank === 1)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={SLASH}
            timing={LAST_TIMING}
          />

          <TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
            <Ending />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>

      <DualCyberFrame />
    </AbsoluteFill>
  );
};
