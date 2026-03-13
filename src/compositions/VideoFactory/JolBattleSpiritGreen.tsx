import React from 'react';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const JOL_GREEN_DURATION = 1065;

export const greenTheme: BattleSpiritTheme = {
  themeColor: 'green',
  glowColor: 'rgba(0, 255, 100, 0.8)',
  particleColor1: '#006600',
  particleColor2: '#00cc44',
  music: {
    src: 'assets/audio/music/Siege_Buster.mp3', // A different energetic music for green
    startFrom: (126 * 30),
    volume: 0.6,
  },
  opponent: {
    name: '🌸さくら🌸',
    image: 'assets/images-01/l5332541.jpeg',
    borderColor: '#fff',
    glowColor: 'green',
  },
  liver: {
    name: '🏙️飛鳥あすか🏙️',
    image: 'assets/images-01/asuka_portrait.webp',
    borderColor: '#00FF7F',
    glowColor: '#00FF00',
  },
  endingText: 'この戦いは<br/>絶対に負けられない。',
  features: {
    useGlitch: true,
    useMirror: true,
    useDoublingGrid: false,
  },
  lightLeakColor: '#00ff88',
};

export const JolBattleSpiritGreen: React.FC<BattleSpiritTheme> = (props) => {
  return <BattleSpiritTemplate theme={props} />;
};
