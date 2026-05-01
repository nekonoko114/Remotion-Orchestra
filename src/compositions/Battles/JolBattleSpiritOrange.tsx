import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, random } from 'remotion';
import { BattleSpiritTemplate } from './shared/BattleSpiritTemplate';
import { BattleSpiritTheme } from '../../types/ranking-types';

export const JOL_ORANGE_DURATION = 1065;

export const orangeTheme: BattleSpiritTheme = {
  themeColor: 'orange',
  glowColor: 'rgba(255, 140, 0, 0.8)',
  particleColor1: '#cc5500',
  particleColor2: '#ffbb00',
  music: {
    src: 'assets/audio/music/冷蔵庫のメモ.mp3',
    startFrom: (126 * 30),
    volume: 0.6,
  },
  opponent: {
    name: '🔆≒ユージン≒🔆',
    image: 'assets/images-01/t.o.p_u_jin_.jpeg',
    borderColor: '#FFE4B5',
    glowColor: 'orange',
  },
  liver: {
    name: '限界突破まみ🎽',
    image: 'assets/images-01/mrm0115-01.png',
    gridImage: 'assets/images-01/mrm0115.jpeg',
    borderColor: '#fff',
    glowColor: '#ff4400',
  },
  endingText: 'この戦いは<br/>絶対に負けられない',
  features: {
    useGlitch: false,
    useMirror: false,
    useDoublingGrid: false,
    useGridConvergence: true,
  },
  lightLeakColor: '#ff8800',
  fontFamily: '"Mochiy Pop One", sans-serif',
};

export const JolBattleSpiritOrange: React.FC<BattleSpiritTheme> = (props) => {
  return (
    <AbsoluteFill>
      <BattleSpiritTemplate theme={props}>
        {/* ひまわりのSVGアニメーション (825fr〜975fr エンディング) */}
        <Sequence from={825} durationInFrames={150}>
          <SunflowerShapes />
        </Sequence>
      </BattleSpiritTemplate>
    </AbsoluteFill>
  );
};

const SunflowerShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 5frごとにひまわりを追加
  const beatInterval = 5; 
  const currentBeatIndex = Math.floor(frame / beatInterval);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(currentBeatIndex + 1).fill(0).map((_, i) => {
        const localFrame = frame - (i * beatInterval);
        
        // ふんわりとした拡大 (dampingを高めにしてバウンスを減らし、stiffnessを下げてゆっくりに)
        const scale = spring({
          frame: localFrame,
          fps,
          config: { stiffness: 100, damping: 20 },
        });

        // スピン登場もゆっくりふわっと
        const spinEntry = spring({
          frame: localFrame,
          fps,
          config: { stiffness: 50, damping: 25 },
        });

        const baseRotation = random(`rot-${i}`) * 360;
        const currentRotation = baseRotation + (1 - spinEntry) * 180 + localFrame * 0.2; // 回転し続ける速度もゆっくりに

        // --- 円を描くように配置 ---
        // 5frごとに1つ出現。1周を20個で描くとする（100frで1周、150frなら1.5周）
        const itemsPerCircle = 6;
        const currentCircle = Math.floor(i / itemsPerCircle); // 何周目か
        
        // 周回ごとに半径を広げる
        const baseRadius = 40; // 最初の円の半径（%）
        const radius = baseRadius + (currentCircle * 15); // 2周目はもっと外側

        // 時計回りに角度をつけていく（最初は12時の方向=-90度からスタート）
        const angle = (i * (Math.PI * 2) / itemsPerCircle) - (Math.PI / 2);
        
        const posX = 50 + radius * Math.cos(angle);
        const posY = 50 + radius * Math.sin(angle);

        const size = 200 + random(`size-${i}`) * 250; // 200px ~ 450px
        const isYellow = random(`color-${i}`) > 0.5;
        const petalColor = isYellow ? '#FFD700' : '#FFA500';

        // ふんわりフェードイン（時間をかける）
        const opacity = Math.min(1, localFrame / 15);
        const petals = 12;

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
              filter: `drop-shadow(0 0 30px rgba(255, 165, 0, 0.6))`,
            }}
          >
            <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
              <g transform="translate(100, 100)">
                {/* 花びら */}
                {new Array(petals).fill(0).map((_, p) => (
                  <ellipse 
                    key={p}
                    cx="0" cy="-45" 
                    rx="15" ry="45" 
                    fill={petalColor} 
                    transform={`rotate(${(p * 360) / petals})`} 
                  />
                ))}
                {/* 中心部分 */}
                <circle cx="0" cy="0" r="35" fill="#5c3a21" />
                <circle cx="0" cy="0" r="25" fill="none" stroke="#3b2110" strokeWidth="4" strokeDasharray="5 5" />
              </g>
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
