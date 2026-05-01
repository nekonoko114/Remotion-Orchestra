import { Composition } from 'remotion';
import {
  ENDING_SEC,
  GROUP_SEC,
  LAST_TRANSITION_FRAMES,
  OPENING_SEC,
  RankingVertical as RankingVideo,
  TOP_RANK_SEC,
  TRANSITION_FRAMES,
  GRID_BRIDGE_SEC,
} from './compositions/Rankings/RankingVertical';
import {
  RankingTime,
  ENDING_SEC as ENDING_SEC_TIME,
  GROUP_SEC as GROUP_SEC_TIME,
  OPENING_SEC as OPENING_SEC_TIME,
  TOP_RANK_SEC as TOP_RANK_SEC_TIME,
  TRANSITION_FRAMES as TRANSITION_FRAMES_TIME,
  GRID_BRIDGE_SEC as GRID_BRIDGE_SEC_TIME,
} from './compositions/Rankings/RankingTime';
import { RankingVerticalSchema, LiverSchema } from './compositions/Rankings/RankingVertical/schema';
import RANKING_DATA_JSON from './data/data.json';
import { RankingTimeSchema } from './compositions/Rankings/RankingTime/schema';
import './index.css';
import React from 'react';

const JOL_RANKING_FPS = 30;

const BASE_DURATION =
  (OPENING_SEC +
    GROUP_SEC * 2 +
    GRID_BRIDGE_SEC +
    TOP_RANK_SEC * 3 +
    ENDING_SEC) *
  JOL_RANKING_FPS;

const BASE_DURATION_TIME =
  (OPENING_SEC_TIME +
    GROUP_SEC_TIME * 2 +
    GRID_BRIDGE_SEC_TIME +
    TOP_RANK_SEC_TIME * 3 +
    ENDING_SEC_TIME) *
  JOL_RANKING_FPS;

const JOL_RANKING_DURATION_VERTICAL =
  BASE_DURATION - (6 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

const JOL_RANKING_DURATION_TIME =
  BASE_DURATION_TIME - 7 * TRANSITION_FRAMES_TIME;

export const RankingRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JOL-Ranking-Vertical"
        component={RankingVideo}
        durationInFrames={Math.ceil(JOL_RANKING_DURATION_VERTICAL)}
        fps={JOL_RANKING_FPS}
        width={1080}
        height={1920}
        schema={RankingVerticalSchema}
        defaultProps={{
          bpm: 152,
          bgmFile: 'assets/audio/music/doragonSrayer.mp3',
          bgmStartFrom: 25,
          openingVideo: 'backgrounds/diamond-ranking-opening.mp4',
          rankingVideo:
            'assets/pixabay/videos/pixabay_fire_flame_beautiful_wallpaper_burn_hot_smoke_feve_200715.mp4',
          openingTitle1: 'J.O.L',
          openingTitle2: '2026年3月\nダイヤモンド獲得',
          openingTitle3: 'ランキング',
          openingSubtitle: '結果発表',
          useGlitch: true,
          glitchIntensity: 10,
          top3Video:
            'assets/pixabay/videos/pixabay_dimension_space_psychedelic_abstract_portal_time_w_31183.mp4',
          openingDate: '',
          livers: (RANKING_DATA_JSON as unknown[]).map((l) =>
            LiverSchema.parse(l),
          ),
        }}
      />
      <Composition
        id="JOL-Ranking-time"
        component={RankingTime}
        durationInFrames={Math.ceil(JOL_RANKING_DURATION_TIME)}
        fps={JOL_RANKING_FPS}
        width={1080}
        height={1920}
        schema={RankingTimeSchema}
        defaultProps={{
          openingTitle2: '配信時間',
          openingTitle3: 'ランキング',
          themeColor: '#d000ff',
          glowColor: 'rgba(208, 0, 255, 0.6)',
        }}
      />
    </>
  );
};
