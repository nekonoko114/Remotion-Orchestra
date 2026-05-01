import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, random } from 'remotion';
import { BattleSpiritTemplate } from './shared/BattleSpiritTemplate';
import { BattleSpiritTheme } from '../../types/ranking-types';

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
  sceneLiverEffect: {
    src: 'assets/pixabay/videos/webm/fire-flower01.webm',
    opacity: 0.65,
    blendMode: 'screen',
    zIndex: 10,
    muted: true,
  },
  sceneVsEffect: {
    src: 'assets/pixabay/videos/webm/fire-explotion.webm',
    opacity: 0.9,
    blendMode: 'screen',
    zIndex: 600,
    muted: true,
  },
};

export const JolBattleSpiritRed: React.FC<BattleSpiritTheme> = (props) => {
  return (
    <AbsoluteFill>
      <BattleSpiritTemplate theme={props}>
        {/* ユーザー要望: 765fr〜915frで1拍ずつSVG（stroke）をランダム・回転させつつ表示継続 (テキストの後ろ) */}
        <Sequence from={765} durationInFrames={150}>
          <BeatSyncedShapes />
        </Sequence>
      </BattleSpiritTemplate>
    </AbsoluteFill>
  );
};

const BeatSyncedShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 1拍ごとに新しい図形を追加する
  const beatInterval = 15; // 1拍分 (約15フレーム)
  const currentBeatIndex = Math.floor(frame / beatInterval);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(currentBeatIndex + 1).fill(0).map((_, i) => {
        // この図形が出現してからの経過フレーム
        const localFrame = frame - (i * beatInterval);
        
        // 登場時のポップな拡大
        const scale = spring({
          frame: localFrame,
          fps,
          config: { stiffness: 300, damping: 15 },
        });

        // 登場時の勢いよく回るスピン（0 -> 1）
        const spinEntry = spring({
          frame: localFrame,
          fps,
          config: { stiffness: 100, damping: 20 },
        });

        // ベースのランダム角度 + 登場時の回転(180度から0度へ) + じわじわ回り続ける
        const baseRotation = random(`rot-${i}`) * 360;
        const currentRotation = baseRotation + (1 - spinEntry) * 180 + localFrame * 0.5;

        // ランダム生成（シードとしてiを使用）
        const shapeType = Math.floor(random(`type-${i}`) * 3); // 0: circle, 1: rect, 2: triangle
        const posX = random(`x-${i}`) * 80; // 0~80% 
        const posY = random(`y-${i}`) * 80; // 0~80% 
        const size = 150 + random(`size-${i}`) * 300; // 150px ~ 450px
        const isOrange = random(`color-${i}`) > 0.5;
        const color = isOrange ? '#FF6600' : '#FF0000'; // 赤かオレンジ

        const strokeWidth = 15;

        // 最初だけ少しだけフェードイン（パッと出つつ滑らかに）
        const opacity = Math.min(1, localFrame / 3);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + posX}%`,
              top: `${10 + posY}%`,
              width: size,
              height: size,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${currentRotation}deg)`,
              opacity,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              filter: `drop-shadow(0 0 20px ${color})`,
            }}
          >
            <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
              {shapeType === 0 && (
                <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth={strokeWidth} />
              )}
              {shapeType === 1 && (
                <rect x="10" y="10" width="180" height="180" fill="none" stroke={color} strokeWidth={strokeWidth} rx="10" />
              )}
              {shapeType === 2 && (
                <polygon points="100,10 190,180 10,180" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
              )}
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
