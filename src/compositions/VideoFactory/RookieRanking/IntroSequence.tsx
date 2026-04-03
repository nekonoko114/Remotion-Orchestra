import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Opening } from './Opening';
import { NextPage } from './NextPage';

// アメコミ風に下から勢いよくスライドインしてくるラッパーコンポーネント
const SlideInOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 }
  });
  
  const translateY = interpolate(entrance, [0, 1], [1500, 0]);
  const rotate = interpolate(entrance, [0, 1], [15, 0]);
  
  return (
    <AbsoluteFill style={{ 
      transform: `translateY(${translateY}px) rotate(${rotate}deg)`, 
      zIndex: 10,
    }}>
        {children}
    </AbsoluteFill>
  );
};

export const IntroSequence: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  return (
    <AbsoluteFill>
      {/* 4.5秒間の「新人王」タイトル */}
      <Sequence from={0} durationInFrames={270}>
        <Opening bpm={bpm} />
      </Sequence>
      
      {/* 4.5秒から「結果発表」へ切り替え */}
      <Sequence from={270} durationInFrames={120}>
        <SlideInOverlay>
          <NextPage bpm={bpm} />
        </SlideInOverlay>
      </Sequence>
    </AbsoluteFill>
  );
};
