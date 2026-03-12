import React from 'react';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const JOL_ORANGE_DURATION = 1065;

export const orangeTheme: BattleSpiritTheme = {
  themeColor: 'orange',
  glowColor: 'rgba(255, 140, 0, 0.8)',
  particleColor1: '#cc5500',
  particleColor2: '#ffbb00',
  music: {
    src: 'assets/audio/music/冷蔵庫のメモ.mp3',
    startFrom: (126 * 30),
    volume: 0.6,
  },
  opponent: {
    name: '限界突破まみ🎽',
    image: 'assets/images-01/mrm0115-01.png',
    borderColor: '#FFE4B5',
    glowColor: 'orange',
  },
  liver: {
    name: '🔆≒ユージン≒🔆',
    image: 'assets/images-01/t.o.p_u_jin_.jpeg',
    borderColor: '#fff',
    glowColor: '#ff4400',
  },
  endingText: 'この戦いは<br/>絶対に負けられない。',
  features: {
    useGlitch: false,
    useMirror: false,
    useDoublingGrid: true,
  },
  lightLeakColor: '#ff8800',
};

export const JolBattleSpiritOrange: React.FC<BattleSpiritTheme> = (props) => {
  return <BattleSpiritTemplate theme={props} />;
};
