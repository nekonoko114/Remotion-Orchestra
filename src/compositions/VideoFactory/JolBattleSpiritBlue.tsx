import React from 'react';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const blueTheme: BattleSpiritTheme = {
  themeColor: '#0066ff',
  glowColor: 'rgba(0, 100, 255, 0.8)',
  particleColor1: '#0000cc',
  particleColor2: '#0088ff',
  music: {
    src: 'assets/p-02.mp3',
    startFrom: (126 * 30),
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
};

export const JolBattleSpiritBlue: React.FC<BattleSpiritTheme> = (props) => {
  return <BattleSpiritTemplate theme={props} />;
};
