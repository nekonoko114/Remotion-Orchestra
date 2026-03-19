import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const JOL_WHITE_DURATION = 1065; // 35.5 seconds * 30 fps

export const whiteSnowTheme: BattleSpiritTheme = {
  themeColor: '#e0f7fa',
  glowColor: '#0277bd', // Darker blue to separate text from background
  textStroke: '3px #01579b', // Strong icy blue border for KineticText
  textAnimation: 'fade', // Use a calm fade animation
  particleColor1: '#ffffff',
  particleColor2: '#b3e5fc',
  music: {
    src: 'assets/audio/music/その先へ.mp3',
    startFrom: 48 * 30,
    volume: 0.6,
    bpm: 144,
  },
  customDurations: {
    opening: 180, // 5.5s
    date: 150,    // 4.5s (increased from 1s)
    liverIntro: 210, // 7s
    msg: 0,       // 0s (Skipped)
    opponent: 105,// 3.5s
    vs: 90,       // 3s
    rule: 120,    // 3.5s
    ending: 120,  // 4s 
    logo: 90,     // 2.5s
  },
  openingText: ['予約バトル', '決まりました！', 'みんな<br/>応援してね❤️'],
  dateText: ['2026年<br/>3月28日', 'SATURDAY', '22時30分', 'START!'],
  rulesText: ['【ルール】','グローブ2', 'アイテム他なし', '一本勝負'],
  endingText: '初予約バトルー！<br/>いつもの<br/>なるりれらしく',
  reverseVsOrder: true,
  opponent: {
    name: '🐄モゥーミルク🍼🐃',
    image: 'assets/images-01/user1817765055425.jpeg',
    borderColor: '#aed581', 
    glowColor: '#7cb342',
  },
  liver: {
    name: 'なるりれ🦥🍉',
    image: 'assets/images-01/karaindaisuki.png',
    borderColor: '#ffffff',
    glowColor: '#81d4fa',
  },
  features: {
    useGlitch: false,
    useMirror: false,
    useDoublingGrid: false,
    useGridConvergence: false,
    useSnowEffect: true,
    useKaleidoscope: false,
    useSpinIntro: true,
    useCircleLiver: true,
  },
  customBackground: 'assets/pixabay/videos/pixabay_christmas_tree_snowy_landscape_snow_winter_christm_323093.mp4',
  opponentBackground: 'assets/images-01/meadow_animals_bg.png',
  fontFamily: '"Mochiy Pop One", sans-serif',
};

export const JolBattleWhiteSnow: React.FC<BattleSpiritTheme> = (props) => {
  return (
    <AbsoluteFill>
      <BattleSpiritTemplate theme={props} />
    </AbsoluteFill>
  );
};
