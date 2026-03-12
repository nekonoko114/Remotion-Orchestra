import React from 'react';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const redTheme: BattleSpiritTheme = {
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
    name: '🔆≒ユージン≒🔆',
    image: 'assets/images-01/t.o.p_u_jin_.jpeg',
    borderColor: '#FFF',
    glowColor: '#FF6600',
  },
  liver: {
    name: '限界突破まみ🎽',
    image: 'assets/images-01/mrm0115-01.png',
    borderColor: '#fff',
    glowColor: 'red',
  },
  endingText: '配信再開の<br/>３月<br/>有終の美を<br/>飾りたいです！！',
  features: {
    useGlitch: true,
    useMirror: true,
    useDoublingGrid: false,
  },
};

export const JolBattleSpiritRed: React.FC<BattleSpiritTheme> = (props) => {
  return <BattleSpiritTemplate theme={props} />;
};
