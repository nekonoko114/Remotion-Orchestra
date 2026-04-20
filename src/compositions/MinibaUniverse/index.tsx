import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Scene1_Opening } from './Scene1_Opening';
import { Scene2_Rules } from './Scene2_Rules';
import { Scene3_Liver } from './Scene3_Liver';

// 各シーンの長さ（フレーム数）@60fps
export const SCENE1_FRAMES = 210; // 3.5秒
export const SCENE2_FRAMES = 650; // 約10.8秒
export const SCENE3_FRAMES = 300; // 5秒

// フェードトランジションの長さ
const FADE_FRAMES = 20;

export const MINIBA_UNIVERSE_TOTAL_FRAMES =
  SCENE1_FRAMES + SCENE2_FRAMES + SCENE3_FRAMES;
// = 1320フレーム = 18.5秒

export const MinibaUniverse: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* BGM */}
      <Audio
        src={staticFile('assets/audio/music/Candy-Sky.mp3')}
        startFrom={0}
        volume={0.75}
      />

      {/* シーン構成 */}
      <TransitionSeries>
        {/* Scene 1: 導入 3.5秒 */}
        <TransitionSeries.Sequence durationInFrames={SCENE1_FRAMES}>
          <Scene1_Opening />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
          presentation={fade()}
        />

        {/* Scene 2: ルール 12秒 */}
        <TransitionSeries.Sequence durationInFrames={SCENE2_FRAMES}>
          <Scene2_Rules />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: FADE_FRAMES })}
          presentation={fade()}
        />

        {/* Scene 3: ライバー紹介 5秒 */}
        <TransitionSeries.Sequence durationInFrames={SCENE3_FRAMES}>
          <Scene3_Liver />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
