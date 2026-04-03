import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { AbsoluteFill, useVideoConfig, Audio, staticFile } from 'remotion';
import type { Liver } from '../types';
import { Ending } from './Ending';
import { Opening } from './Opening';
import { RankingGroup } from './RankingGroup';
import { Top1Reveal } from './Top1Reveal';
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

const BGM_START_FROM = 0;

export const OPENING_SEC = 5;
export const GROUP_SEC = 4.5;     // 10 beats (relaxed stagger)
export const TOP_RANK_SEC = 4;  // 8 beats
export const GRID_BRIDGE_SEC = 4; // 12 beats
export const ENDING_SEC = 4;    // 8 beats
export const TRANSITION_FRAMES = 12;  // Speedy slash transition
export const LAST_TRANSITION_FRAMES = 15;

const SLASH = slashTransition({ color: '#f85718' });
const TIMING = linearTiming({ durationInFrames: TRANSITION_FRAMES });
const LAST_TIMING = linearTiming({ durationInFrames: LAST_TRANSITION_FRAMES });

export const RankingEvent = () => {
  const { fps } = useVideoConfig();

  const OPENING_DURATION = Math.round(OPENING_SEC * fps);
  const GROUP_DURATION = Math.round(GROUP_SEC * fps);
  const ENDING_DURATION = Math.round(ENDING_SEC * fps);


  const frame = useCurrentFrame();

  // Unity Custom Theme (#f85718) for the entire video
  const frameColor = '#f85718'; 
  const frameGlow = 'rgba(248, 87, 24, 0.6)';

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Audio
        src={staticFile('assets/audio/music/Ours-to-Hold.mp3')}
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

          <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
            <Top1Reveal
              rank={3}
              title="3位"
              liver={RANKING_DATA.find((d) => d.rank === 3)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={Math.round(5 * fps)}>
            <Top1Reveal
              rank={2}
              title="2位"
              liver={RANKING_DATA.find((d) => d.rank === 2)!}
              backgroundSrc="assets/backgrounds/unity_rank_bg_top3.png"
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition presentation={SLASH} timing={TIMING} />

          <TransitionSeries.Sequence durationInFrames={Math.round(6 * fps)}>
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
          border: `10px solid ${frameColor}`,
          boxShadow: `inset 0 0 50px ${frameGlow}, 0 0 50px ${frameGlow}`,
          zIndex: 9999,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />
    </AbsoluteFill>
  );
};
