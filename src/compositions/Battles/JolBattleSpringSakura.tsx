import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BattleSpiritTemplate } from './shared/BattleSpiritTemplate';
import { BattleSpiritTheme } from '../../types/ranking-types';

export const JOL_SAKURA_DURATION = 1065; // 35.5 seconds * 30 fps

export const JolBattleSpringSakura: React.FC<BattleSpiritTheme> = (props) => {
  return (
    <AbsoluteFill>
      <BattleSpiritTemplate theme={props} />
    </AbsoluteFill>
  );
};
