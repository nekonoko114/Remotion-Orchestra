import React from 'react';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const JOL_MAGIC_DURATION = 1065;

export const magicTheme: BattleSpiritTheme = {
  themeColor: 'purple',
  glowColor: 'rgba(180, 0, 255, 0.8)',
  particleColor1: '#a000ff',
  particleColor2: '#ffdd44',
  music: {
    src: 'assets/audio/music/CAPTIVATE.mp3',
    startFrom: (0 * 30),
    volume: 0.6,
  },
  opponent: {
    name: '魔導師まみ🪄',
    image: 'assets/images-01/mrm0115-01.png',
    borderColor: '#ffdd44',
    glowColor: 'purple',
  },
  liver: {
    name: '🔆≒ユージン≒🔆',
    image: 'assets/images-01/t.o.p_u_jin_.jpeg',
    borderColor: '#fff',
    glowColor: '#a000ff',
  },
  endingText: 'この儀式は、<br/>誰にも止められない。',
  features: {
    useGlitch: true,
    useMirror: true,
    useDoublingGrid: false,
  },
  lightLeakColor: '#8800ff',
};

export const JolBattleSpiritMagic: React.FC<BattleSpiritTheme> = (props) => {
  return <BattleSpiritTemplate theme={props} />;
};
