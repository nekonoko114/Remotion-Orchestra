import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
} from 'remotion';

interface GodRaysProps {
  count?: number;
  color?: string;
  opacity?: number;
}

/**
 * 中心から放射状に放たれる神々しい光の柱（ゴッドレイ）
 * 1位のアイコン背後で使用
 */
export const GodRays: React.FC<GodRaysProps> = ({
  count = 32,
  color = '#F7E7CE',
  opacity = 0.6,
}) => {
  const frame = useCurrentFrame();

  const rays = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = `godray-${i}`;
      return {
        angle: (i / count) * 360,
        // 太さや長さをランダムに変えて自然なムラを作る
        width: 10 + random(`${seed}-width`) * 40,
        length: 2000 + random(`${seed}-length`) * 1000,
        rotationSpeed: (random(`${seed}-rot`) - 0.5) * 0.1,
        phase: random(`${seed}-phase`) * Math.PI * 2,
        individualOpacity: 0.3 + random(`${seed}-op`) * 0.7,
      };
    });
  }, [count]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          perspective: '1000px',
        }}
      >
        {rays.map((ray, i) => {
          // ゆったりとした回転
          const rotation = ray.angle + frame * ray.rotationSpeed;
          
          // 明るさのゆるやかな変化
          const pulse = Math.sin(frame * 0.02 + ray.phase) * 0.2 + 0.8;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: ray.width,
                height: ray.length,
                // 中央から外側へ消えていくグラデーション
                background: `linear-gradient(to top, ${color} 0%, transparent 80%)`,
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                opacity: opacity * ray.individualOpacity * pulse,
                filter: 'blur(30px)',
                mixBlendMode: 'screen',
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
