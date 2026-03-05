import type React from 'react';
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

interface WiggleContainerProps {
  children: React.ReactNode;
  intensity?: number; // 揺れの強さ (px)
  frequency?: number; // 揺れの速さ
  rotateIntensity?: number; // 回転の揺れの強さ (deg)
  seed?: string | number;
  style?: React.CSSProperties;
}

/**
 * どんな要素もプルプルと揺らす魔法のコンテナ
 */
export const WiggleContainer: React.FC<WiggleContainerProps> = ({
  children,
  intensity = 10,
  frequency = 0.5,
  rotateIntensity = 2,
  seed = 'default-wiggle',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 時間（フレーム）に基づいてなめらかな動きを生成
  // 複数のサイン波を合成して規則性を排除し、生物的な動きにする
  const t = frame * frequency;

  // X, Y のオフセット計算
  const x =
    (Math.sin(t * 0.7) + Math.cos(t * 1.3 + random(`${seed}-x`)) * 0.5) *
    intensity;

  const y =
    (Math.cos(t * 0.9 + random(`${seed}-y`)) + Math.sin(t * 1.1) * 0.5) *
    intensity;

  // 回転のオフセット計算
  const rotation = Math.sin(t * 0.5 + random(`${seed}-r`)) * rotateIntensity;

  return (
    <div
      style={{
        display: 'inline-block',
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
