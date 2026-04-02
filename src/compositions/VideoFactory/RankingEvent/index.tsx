import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { AbsoluteFill, useVideoConfig, Audio, staticFile } from 'remotion';
import type { Liver } from '../types';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
import { GridBridge } from './GridBridge';
import { useBeatValue } from '../utils/beat-sync';
import { slashTransition } from '../transitions/SlashTransition';

import { useCurrentFrame } from 'remotion';

// 3月度団結NO1 ランキングデータ
const mkLiver = (id: string, nickname: string, image_url: string, rank: number): Liver => ({
  rank, id, nickname, image_url,
  username: id, user_id: id, unique_id: id,
  saved_to: '', ok: true, error: null,
  signature: null, creator_account: '', creator_name: nickname, content: null,
});

const RANKING_DATA: Liver[] = [
  mkLiver('mizuki2525214',       '💋一条美月-Mizuki-💋',        'assets/avatars/mizuki2525214.jpg',       1),
  mkLiver('donbeikun9999',       '☠️やらかしタロー☠️',          'assets/avatars/donbeikun9999.jpg',       2),
  mkLiver('t.o.p_u_jin_',        '🔆≒ユージン≒🔆',              'assets/avatars/t.o.p_u_jin_.jpg',        3),
  mkLiver('2161646824',          'まゆみ',                       'assets/avatars/2161646824.jpg',          4),
  mkLiver('l5332541',            '🌸さくら🌸',                  'assets/avatars/l5332541.jpg',            5),
  mkLiver('karaindaisuki',       'なるりれ🦥🍉',                 'assets/avatars/karaindaisuki.jpg',       6),
  mkLiver('mrm0115',             '限界突破まみ🎽',               'assets/avatars/mrm0115.jpg',             7),
  mkLiver('ceo1014',             '🦁CEO🦁🎗️',                   'assets/avatars/ceo1014.jpg',             8),
  mkLiver('ria.kangoshi',        'りあ🐰🍀',                     'assets/avatars/ria.kangoshi.jpg',        9),
  mkLiver('ikkurrex7ja',         '✝️奏良『そら』✝️🎽',           'assets/avatars/ikkurrex7ja.jpg',         10),
  mkLiver('butterfly46490',      '🍯でっちゃんじゃん🌸',          'assets/avatars/butterfly46490.jpg',      11),
  mkLiver('yyuukkii0402',        'yukiんこ😈',                   'assets/avatars/yyuukkii0402.jpg',        12),
  mkLiver('user9577863834239',   '天然かな～？✌️マッサ画伯です👍', 'assets/avatars/user9577863834239.jpg',   13),
  mkLiver('user58402831659341',  '🐭ぼく天然ミッキー🐭',          'assets/avatars/user58402831659341.jpg',  14),
  mkLiver('ooo93o',              'あむら🧋',                     'assets/avatars/ooo93o.jpg',              15),
];

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

  // 4グループ（15名対応）+ GridBridge + Top3
  const offsetG1 = D_opening - T;
  const offsetG2 = offsetG1 + D_group - T;
  const offsetG3 = offsetG2 + D_group - T;
  const offsetG4 = offsetG3 + D_group - T;
  const offsetGrid = offsetG4 + D_group - T;
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

          {/* TOP 15~11（5名） */}
          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n15~11'}
              livers={RANKING_DATA.filter((d) => d.rank >= 11 && d.rank <= 15)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 10~8（3名） */}
          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n10~8'}
              livers={RANKING_DATA.filter((d) => d.rank >= 8 && d.rank <= 10)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 7~6（2名） */}
          <TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
            <RankingGroup
              title={'TOP\n7~6'}
              livers={RANKING_DATA.filter((d) => d.rank >= 6 && d.rank <= 7)}
              absoluteFrame={frame}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          {/* TOP 5~4（2名） */}
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
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={2}
              title="2位"
              liver={RANKING_DATA.find((d) => d.rank === 2)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
            <Top1Reveal
              rank={1}
              title="1位"
              liver={RANKING_DATA.find((d) => d.rank === 1)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
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
