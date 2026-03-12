import React from 'react';
import { staticFile } from 'remotion';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

const redTheme: BattleSpiritTheme = {
  themeColor: '#ff2200',
  glowColor: 'rgba(255, 60, 0, 0.8)',
  particleColor1: '#cc0000',
  particleColor2: '#ff4400',
  music: {
    src: 'assets/p-01.mp3',
    startFrom: (126 * 30),
    volume: 0.6,
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
    borderColor: '#FFF',
    glowColor: '#FF6600',
  },
  endingText: 'この戦いは<br/>絶対に負けられない。',
  features: {
    useGlitch: true,
    useMirror: true,
    useDoublingGrid: false,
  },
};

export const JolBattleSpiritRed: React.FC = () => {
  return <BattleSpiritTemplate theme={redTheme} />;
};
