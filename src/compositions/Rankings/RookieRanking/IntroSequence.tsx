import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Opening } from '../../DeepSeekCollaboration/components/Opening';
import { NextPage } from './NextPage';


export const IntroSequence: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  return (
    <AbsoluteFill>
      {/* 4.5秒間の「新人王」タイトル */}
      <Sequence from={0} durationInFrames={270}>
        <Opening bpm={bpm} />
      </Sequence>
      
      {/* 4.5秒から「結果発表」へ切り替え（退場時は上へ抜ける） */}
      <Sequence from={270} durationInFrames={120}>
         <NextPage bpm={bpm} />
      </Sequence>
    </AbsoluteFill>
  );
};
