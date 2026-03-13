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
import { JolBattleSpiritBlue } from './compositions/VideoFactory/JolBattleSpiritBlue';
import {
  JolBattleSpiritOrange,
  JOL_ORANGE_DURATION,
} from './compositions/VideoFactory/JolBattleSpiritOrange';
import {
  JolBattleSpiritGreen,
  greenTheme,
  JOL_GREEN_DURATION,
} from './compositions/VideoFactory/JolBattleSpiritGreen';
import {
  JolBattleSpiritMagic,
  magicTheme,
  JOL_MAGIC_DURATION,
} from './compositions/VideoFactory/JolBattleSpiritMagic';
import {
  JolBattleSpeedOrange,
  speedOrangeTheme,
  JOL_SPEED_ORANGE_DURATION,
} from './compositions/VideoFactory/JolBattleSpeedOrange';
import { MagicCircleShowcase } from './compositions/VideoFactory/MagicCircleShowcase';
import { BattleSpiritThemeSchema } from './compositions/VideoFactory/components/BattleShared/types';
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
        durationInFrames={1005} // 1065 - 60 (SceneLiver shortened)
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: '#ff2200',
          glowColor: 'rgba(255, 60, 0, 0.8)',
          particleColor1: '#cc0000',
          particleColor2: '#ff4400',
          music: {
            src: 'assets/audio/music/Breathing-Lighter.mp3',
            volume: 0.6,
            startFrom: 1440,
          },
          opponent: {
            name: '限界突破まみ🎽',
            image: 'assets/images-01/mrm0115-01.png',
            borderColor: '#fff',
            glowColor: 'red',
          },
          liver: {
            name: '🔆≒ユージン≒🔆',
            image: 'assets/images-01/t.o.p_u_jin_.jpeg',
            borderColor: '#ff0000',
            glowColor: '#FF6600',
          },
          endingText: '配信再開の<br/>３月<br/>有終の美を<br/>飾りたいです！！',
          features: {
            useGlitch: true,
            useMirror: true,
            useDoublingGrid: false,
          },
          liverIntroDuration: 120,
          reverseVsOrder: true,
          customBackground: 'assets/images-01/red-energy-bg.png',
        }}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-GREEN"
        component={JolBattleSpiritGreen}
        durationInFrames={JOL_GREEN_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={greenTheme}
      />

      <Composition
        id="JOL-BATTLE-SPIRIT-MAGIC"
        component={JolBattleSpiritMagic}
        durationInFrames={JOL_MAGIC_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={magicTheme}
      />
      <Composition
        id="JOL-BATTLE-SPEED-ORANGE"
        component={JolBattleSpeedOrange}
        durationInFrames={JOL_SPEED_ORANGE_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={speedOrangeTheme}
      />

      <Composition
        id="JOL-BATTLE-SPIRIT-BLUE"
        component={JolBattleSpiritBlue}
        durationInFrames={1065}
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: '#0066ff',
          glowColor: 'rgba(0, 100, 255, 0.8)',
          particleColor1: '#0000cc',
          particleColor2: '#0088ff',
          music: {
            src: 'assets/p-02.mp3',
            startFrom: 126 * 30,
            volume: 0.6,
          },
          opponent: {
            name: '❤️‍🔥しおぴ❤️‍🔥',
            image: 'assets/images-01/shiori_portrait.webp',
            borderColor: '#fff',
            glowColor: '#00ffff',
          },
          liver: {
            name: '限界突破まみ🎽',
            image: 'assets/images-01/mrm0115-01.png',
            borderColor: '#FFF',
            glowColor: '#0066ff',
          },
          endingText: 'この戦いは<br/>絶対に負けられない。',
          features: {
            useGlitch: true,
            useMirror: true,
            useDoublingGrid: false,
          },
        }}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-ORENGE"
        component={JolBattleSpiritOrange}
        durationInFrames={JOL_ORANGE_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: 'orange',
          glowColor: 'rgba(255, 140, 0, 0.8)',
          particleColor1: '#cc5500',
          particleColor2: '#ffbb00',
          music: {
            src: 'assets/audio/music/冷蔵庫のメモ.mp3',
            startFrom: 4717,
            volume: 0.6,
          },
          opponent: {
            name: '🔆≒ユージン≒🔆',
            image: 'assets/images-01/t.o.p_u_jin_.jpeg',
            borderColor: '#fff',
            glowColor: '#ff4400',
          },
          liver: {
            name: '限界突破まみ🎽',
            image: 'assets/images-01/mrm0115-01.png',
            borderColor: '#FFE4B5',
            glowColor: 'orange',
          },
          endingText: 'この戦いは<br/>絶対に負けられない。',
          features: {
            useGlitch: false,
            useMirror: false,
            useDoublingGrid: true,
          },
          lightLeakColor: '#ff8800',
          reverseVsOrder: true,
        }}
      />
      <Composition
        id="Magic-Circle-Showcase"
        component={MagicCircleShowcase}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
