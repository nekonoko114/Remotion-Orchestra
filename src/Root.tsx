import { Composition } from 'remotion';

import {
  ENDING_SEC,
  GRID_BRIDGE_SEC,
  GROUP_SEC,
  LAST_TRANSITION_FRAMES,
  OPENING_SEC,
  RankingVideo,
  TOP_RANK_SEC,
  TRANSITION_FRAMES,
} from './compositions/VideoFactory/RankingVideo';
import {
  RankingTime,
  OPENING_SEC as OPENING_SEC_TIME,
  GROUP_SEC as GROUP_SEC_TIME,
  TOP_RANK_SEC as TOP_RANK_SEC_TIME,
  ENDING_SEC as ENDING_SEC_TIME,
  TRANSITION_FRAMES as TRANSITION_FRAMES_TIME,
  GRID_BRIDGE_SEC as GRID_BRIDGE_SEC_TIME,
} from './compositions/VideoFactory/RankingTime';
import { BattleCrystal } from './compositions/VideoFactory/BattleCrystal';
import { BattleWater } from './compositions/VideoFactory/BattleWater';
import { BattleKawaii } from './compositions/VideoFactory/BattleKawaii';
import {
  PastelDreamShowcase,
  pastelDreamSchema,
} from './compositions/VideoFactory/PastelDreamShowcase';
import { NarandaMamadeMV } from './compositions/NarandaMamade';
import { SoregayasashisaMV } from './compositions/Soregayasashisa';
import narandaMamadeMusicAnalysis from './compositions/NarandaMamade/music_analysis.json';
import { NovaShowMV } from './components/NovaShowMV';
import { KimitonaraComposition } from './compositions/Kimitonara';
import {
  GenkitComposition,
  genkitCompositionSchema,
} from './compositions/Genkit';
import { StitchOverlay } from './compositions/Stitch';
import { RookieRanking } from './compositions/VideoFactory/RookieRanking';
import { JolBattleSpiritRed } from './compositions/VideoFactory/JolBattleSpiritRed';
import './index.css';
import React from 'react';

const JOL_RANKING_FPS = 30;

// Calculate Vertical Duration
// Updated to 3 groups (10-8, 7-6, 5-4)
const JOL_RANKING_DURATION_VERTICAL =
  (OPENING_SEC +
    GROUP_SEC * 3 +
    GRID_BRIDGE_SEC +
    TOP_RANK_SEC * 3 +
    ENDING_SEC) *
    JOL_RANKING_FPS -
  (7 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

// Calculate Time Duration (Correctly using its own 7s opening)
// Updated to 3 groups (10-8, 7-6, 5-4)
const JOL_RANKING_DURATION_TIME =
  (OPENING_SEC_TIME +
    GROUP_SEC_TIME * 3 +
    GRID_BRIDGE_SEC_TIME +
    TOP_RANK_SEC_TIME * 3 +
    ENDING_SEC_TIME) *
    JOL_RANKING_FPS -
  8 * TRANSITION_FRAMES_TIME;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Imported from video-factory-v1 */}
      <Composition
        id="JOL-Ranking-Vertical"
        component={RankingVideo}
        durationInFrames={Math.ceil(JOL_RANKING_DURATION_VERTICAL)}
        fps={JOL_RANKING_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-Ranking-time"
        component={RankingTime}
        durationInFrames={Math.ceil(JOL_RANKING_DURATION_TIME)}
        fps={JOL_RANKING_FPS}
        width={2160}
        height={3840}
      />
      <Composition
        id="JOL-Battle"
        component={BattleCrystal}
        durationInFrames={844} // Trimmed version: 13 measures + 3s ending
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-Battle-Water"
        component={BattleWater}
        durationInFrames={652}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-Battle-Crystal"
        component={BattleCrystal}
        durationInFrames={652}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-Battle-Kawaii"
        component={BattleKawaii}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-PastelDream"
        component={PastelDreamShowcase}
        durationInFrames={840} // 31秒から3秒減らして28秒 (840フレーム)
        fps={30}
        width={1080}
        height={1920}
        schema={pastelDreamSchema}
        defaultProps={{
          player1: {
            name: '🌸さくら🌸',
            image: 'assets/images-01/l5332541.jpeg',
            color: '#FFB6C1',
          },
          player2: {
            name: '🌸さくら🌸',
            image: 'assets/images-01/l5332541-01.png',
            color: '#FFB6C1',
          },
          player3: {
            name: '🌸さくら🌸',
            image: 'assets/images-01/l5332541-02.png',
            color: '#FFB6C1',
          },
          tatan: {
            name: 'たー𝕥𝕒𝕟🏡☀️',
            image: 'assets/images-01/ta-tan.png',
            color: '#87CEEB',
          },
          musicStartSec: 36.4,
        }}
      />
      <Composition
        id="NarandaMamadeMV"
        component={NarandaMamadeMV}
        durationInFrames={Math.ceil(narandaMamadeMusicAnalysis.duration * 30)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="soregayasashisa"
        component={SoregayasashisaMV}
        durationInFrames={6800} // ~226 seconds
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NOVA-SHOW-MV"
        component={NovaShowMV}
        durationInFrames={15 * 8} // 歌詞8セット分
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Kimitonara"
        component={KimitonaraComposition}
        durationInFrames={30 * 222} // 3分42秒
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Sakura"
        component={GenkitComposition}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        schema={genkitCompositionSchema}
        defaultProps={{
          title: 'Sakura',
          concept: 'Generated by Genkit',
        }}
      />
      <Composition
        id="Stitch-Gaming-Overlay"
        component={StitchOverlay}
        durationInFrames={300} // 10 seconds
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-Rookie-Ranking"
        component={RookieRanking}
        durationInFrames={1260} // 42 seconds total
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-RED"
        component={JolBattleSpiritRed}
        durationInFrames={1065} // 35.5 seconds * 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-BLUE"
        component={JolBattleSpiritRed}
        // 35.5 seconds * 30fps
        durationInFrames={1065}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
