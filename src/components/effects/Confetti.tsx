import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = [
  '#FFD700', // Gold
  '#FF0000', // Red
  '#8B0000', // Dark Red
  '#000000', // Black
  '#333333', // Dark Gray
  '#C0C0C0', // Silver
  '#FFFFFF', // White (for contrast)
];

interface ConfettiProps {
  count?: number;
  dropHeight?: number;
  colors?: string[];
}

/**
 * 画面全体に色とりどりの紙吹雪を降らせるエフェクト
 */
export const Confetti: React.FC<ConfettiProps> = ({
  count = 100,
  colors = COLORS,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 紙吹雪一枚ごとの初期値を生成
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = `particle-${i}`;
      return {
        x: random(`${seed}-x`) * width,
        initialY: -random(`${seed}-y`) * 500, // 上からバラバラに降らせる
        size: 10 + random(`${seed}-size`) * 15,
        color: colors[Math.floor(random(`${seed}-color`) * colors.length)],
        rotationSpeed: (random(`${seed}-rot`) - 0.5) * 10,
        driftSpeed: (random(`${seed}-drift`) - 0.5) * 5,
        speed: 5 + random(`${seed}-speed`) * 10,
      };
    });
  }, [count, width, colors]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p) => {
        // 重力による落下の計算
        const y = p.initialY + frame * p.speed;
        // 画面を通り過ぎたらループ、または消す（ここではシンプルに落下）

        // 空中でのひらひらした動きをサイン波で再現
        const key = `p-${p.x}-${p.size}`;
        const xOffset = Math.sin(frame * 0.1 + p.rotationSpeed) * 20;

        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: p.x + xOffset,
              top: y,
              width: p.size,
              height: p.size * 0.6, // 少し横長に
              backgroundColor: p.color,
              transform: `rotate(${frame * p.rotationSpeed}deg) rotateX(${frame * 5}deg)`,
              borderRadius: p.size % 3 === 0 ? '50%' : '2px', // 形を混ぜる
              opacity: interpolate(y, [height * 0.8, height], [1, 0], {
                extrapolateRight: 'clamp',
              }),
              willChange: 'transform, top, opacity',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
