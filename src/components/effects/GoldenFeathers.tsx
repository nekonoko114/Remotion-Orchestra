import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ROYAL_THEME } from '../../compositions/VideoFactory/RankingRoyal/theme';

interface GoldenFeathersProps {
  count?: number;
  colors?: string[];
}

/**
 * 黄金の羽根が優雅に舞い落ちるエフェクト
 * 紙吹雪よりもゆったりとした、空気抵抗を感じる動きを再現
 */
export const GoldenFeathers: React.FC<GoldenFeathersProps> = ({
  count = 120,
  colors = [
    ROYAL_THEME.colors.champagneGold,
    ROYAL_THEME.colors.champagneGoldLight,
    '#FFFFFF',
    '#D4AF37',
  ],
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 羽根一枚ごとの初期パラメーターを生成
  const feathers = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = `feather-${i}`;
      return {
        x: random(`${seed}-x`) * width,
        // 上から順次降ってくるように初期Yをバラけさせる
        initialY: -random(`${seed}-y`) * 800 - 100, 
        baseSize: 15 + random(`${seed}-size`) * 25,
        aspectRatio: 2.5 + random(`${seed}-aspect`) * 1.5, // 羽根らしく細長く
        color: colors[Math.floor(random(`${seed}-color`) * colors.length)],
        
        // 挙動パラメーター
        swingSpeed: 0.03 + random(`${seed}-swing`) * 0.04,
        swingAmplitude: 30 + random(`${seed}-amp`) * 70,
        fallSpeed: 2 + random(`${seed}-speed`) * 4,
        rotationSpeed: (random(`${seed}-rot`) - 0.5) * 2,
        phase: random(`${seed}-phase`) * Math.PI * 2,
      };
    });
  }, [count, width, colors]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {feathers.map((f, i) => {
        // 現在のY座標（落下）
        const y = f.initialY + frame * f.fallSpeed;
        
        // 左右の揺れ（ひらひら感に不規則なうねりを追加）
        const turbulence = Math.sin(frame * f.swingSpeed * 0.5 + f.phase) * 20;
        const xOffset = Math.sin(frame * f.swingSpeed + f.phase) * f.swingAmplitude + turbulence;
        
        // 三次元的な回転挙動（さらに複雑に）
        const tilt = Math.cos(frame * f.swingSpeed + f.phase) * 45;
        const spin = frame * f.rotationSpeed * 2;
        const rotation = f.phase * 50 + frame * f.rotationSpeed + tilt;
        
        const opacity = interpolate(
          y,
          [height * 0.7, height],
          [0.85, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        if (y > height || opacity <= 0) return null;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: f.x + xOffset,
              top: y,
              width: f.baseSize * f.aspectRatio,
              height: f.baseSize,
              // 玉虫色の干渉光、金粉、メインカラーを多層合成
              background: `
                linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.6) 45%, rgba(0,255,255,0.2) 50%, rgba(255,0,255,0.2) 55%, transparent 100%),
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 40%),
                repeating-radial-gradient(circle at 50% 50%, white 0%, white 1px, transparent 2px, transparent 10px),
                ${f.color}
              `,
              backgroundSize: '200% 100%, 100% 100%, 20px 20px, 100% 100%',
              borderRadius: '100% 25% 100% 25% / 100% 25% 100% 25%',
              clipPath: 'polygon(0% 50%, 5% 20%, 20% 5%, 50% 0%, 85% 15%, 100% 50%, 90% 85%, 60% 100%, 25% 95%, 5% 75%)',
              boxShadow: `
                0 0 20px ${f.color}66,
                0 0 40px ${f.color}22
              `,
              transform: `rotate(${rotation}deg) rotateX(${tilt}deg) rotateY(${spin}deg)`,
              opacity,
              filter: `blur(${f.baseSize / 40}px) contrast(1.2) brightness(1.2)`,
              willChange: 'transform, top, opacity',
            }}
          >
            {/* 羽根の軸（Shaft）をより神々しく */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              width: '90%',
              height: '2px',
              background: `linear-gradient(90deg, transparent, rgba(237, 217, 166, 0.9), white, rgba(237, 217, 166, 0.9), transparent)`,
              boxShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 15px gold',
              transform: 'translateY(-50%)',
              opacity: 0.9,
            }} />

            {/* 鱗粉が舞っているようなキラキラ感のオーバーレイ */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
              backgroundSize: '8px 8px',
              opacity: 0.4,
              mixBlendMode: 'overlay',
            }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
