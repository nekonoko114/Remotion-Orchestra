import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

const HeartBubble: React.FC<{ seed: number; frame: number; layer: 'back' | 'front' }> = ({ seed, frame, layer }) => {
  const { height, width } = useVideoConfig();
  
  // 初期設定 
  const xOffset = random(seed) * width;
  
  // レイヤーに応じたサイズと速度の調整
  // back (奥): 大きくゆっくり / front (手前): 小さく速い
  const size = layer === 'back' 
    ? interpolate(random(seed + 1), [0, 1], [400, 1000]) // 奥は巨大
    : interpolate(random(seed + 1), [0, 1], [80, 200]);   // 手前は小さめ

  const speed = layer === 'back'
    ? interpolate(random(seed + 2), [0, 1], [300, 600]) // 奥はゆったり
    : interpolate(random(seed + 2), [0, 1], [100, 250]); // 手前はスピーディ
  const startDelay = (random(seed + 3) * 300) % 300;
  
  // ライフサイクルループ
  const cycle = (frame + startDelay) % speed;
  const progress = cycle / speed;

  // ハートか星かを選択
  const isStar = random(seed + 4) > 0.5;

  // 下から上への移動と揺れ
  const y = interpolate(progress, [0, 1], [height + size, -size * 2]);
  const x = xOffset + Math.sin(progress * Math.PI * 4 + seed) * 600;
  
  // 回転とスケール（ぷるぷる感）
  const rotate = Math.sin(progress * Math.PI * 2 + seed) * 15;
  const scaleX = 1 + Math.sin(frame * 0.1 + seed) * 0.5;
  const scaleY = 1 + Math.cos(frame * 0.1 + seed) * 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
            {/* フィルター定義（光沢感と屈折） */}
            <defs>
                <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
                    <stop offset="20%" stopColor={isStar ? "rgba(255, 255, 200, 0.6)" : "rgba(255, 182, 193, 0.5)"} />
                    <stop offset="80%" stopColor={isStar ? "rgba(255, 255, 255, 0.3)" : "rgba(175, 238, 238, 0.3)"} />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" />
                </linearGradient>
                <filter id={`blur-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" />
                </filter>
            </defs>
            {/* シャボン玉のベース（半透明） */}
            <path 
                d={isStar 
                    ? "M50 5 L63 38 L95 38 L68 58 L78 90 L50 70 L22 90 L32 58 L5 38 L37 38 Z" // ぷっくらした星
                    : "M50 85 C20 55, 10 35, 10 25 C10 10, 25 5, 35 5 C45 5, 50 15, 50 15 C50 15, 55 5, 65 5 C75 5, 90 10, 90 25 C90 35, 80 55, 50 85 Z" // ハート
                }
                fill={`url(#grad-${seed})`}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="2"
                style={{ backdropFilter: 'blur(5px)' }}
            />
            {/* ハイライト1 (星に合わせてパスを調整) */}
            <path 
                d={isStar ? "M40 25 C35 25, 30 30, 30 35" : "M35 15 C25 15, 20 20, 20 30"}
                fill="none" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                filter={`url(#blur-${seed})`}
                opacity={0.8}
            />
            {/* ハイライト2 */}
            <path 
                d={isStar ? "M70 45 C65 60, 55 65, 50 70" : "M80 40 C75 60, 60 70, 55 75"}
                fill="none" 
                stroke="rgba(255, 255, 255, 0.6)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                filter={`url(#blur-${seed})`}
            />
        </svg>
    </div>
  );
};

export const HeartBubbles: React.FC<{ count?: number; layer?: 'back' | 'front' }> = ({ count = 30, layer = 'back' }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: layer === 'back' ? 10 : 200 }}>
      {new Array(count).fill(0).map((_, i) => (
        <HeartBubble key={i} seed={i * 999} frame={frame} layer={layer} />
      ))}
    </AbsoluteFill>
  );
};
