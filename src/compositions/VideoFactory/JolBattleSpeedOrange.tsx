import React from 'react';
import { BattleSpeedTemplate } from './components/BattleShared/BattleSpeedTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const JOL_SPEED_ORANGE_DURATION = 1065;

export const speedOrangeTheme: BattleSpiritTheme = {
  themeColor: 'orange',
  glowColor: 'rgba(255, 100, 0, 0.9)',
  particleColor1: '#ff4400',
  particleColor2: '#ffcc00',
  music: {
    src: 'assets/audio/music/Blastwave.mp3', // Using a fast-paced track
    startFrom: (0 * 30),
    volume: 0.7,
  },
  opponent: {
    name: '限界突破まみ🎽',
    image: 'assets/images-01/mrm0115-01.png',
    borderColor: '#ffaa00',
    glowColor: 'orange',
  },
  liver: {
    name: '🔆≒ユージン≒🔆',
    image: 'assets/images-01/t.o.p_u_jin_.jpeg',
    borderColor: '#fff',
    glowColor: '#ff2200',
  },
  endingText: 'この一瞬に、<br/>すべてを懸ける。',
  features: {
    useGlitch: true,
    useMirror: false,
    useDoublingGrid: true,
  },
  lightLeakColor: '#ffbb00',
};

export const JolBattleSpeedOrange: React.FC<BattleSpiritTheme> = (props) => {
  return <BattleSpeedTemplate theme={props} />;
};
