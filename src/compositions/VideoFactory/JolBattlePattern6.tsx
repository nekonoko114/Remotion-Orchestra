import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BattlePattern6Template } from './components/BattleShared/BattlePattern6Template';
import { BattleSpiritTheme } from './components/BattleShared/types';

export const JolBattlePattern6: React.FC<BattleSpiritTheme> = (props) => {
  return (
    <AbsoluteFill>
      <BattlePattern6Template theme={props} />
    </AbsoluteFill>
  );
};
