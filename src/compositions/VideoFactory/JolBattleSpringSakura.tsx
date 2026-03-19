import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BattleSpiritTemplate } from './components/BattleShared/BattleSpiritTemplate';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const JOL_SAKURA_DURATION = 1065; // 35.5 seconds * 30 fps

export const JolBattleSpringSakura: React.FC<BattleSpiritTheme> = (props) => {
  return (
    <AbsoluteFill>
      <BattleSpiritTemplate theme={props} />
    </AbsoluteFill>
  );
};
