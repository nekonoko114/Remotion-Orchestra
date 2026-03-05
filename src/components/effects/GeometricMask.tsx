import type React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type MaskShape = 'circle' | 'wipeDiagonal' | 'blind' | 'diamond';

interface GeometricMaskProps {
  children: React.ReactNode;
  type: MaskShape;
  reverse?: boolean; // 閉じる動きにするか
}

export const GeometricMask: React.FC<GeometricMaskProps> = ({
  children,
  type,
  reverse = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // 線形な進行度（0 -> 100）
  const rawProgress = interpolate(frame, [0, 20], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  const progress = reverse ? 100 - rawProgress : rawProgress;

  const getClipPath = () => {
    switch (type) {
      case 'circle':
        return `circle(${progress * 1.5}% at 50% 50%)`;
      case 'wipeDiagonal':
        return `polygon(0 0, ${progress * 2}% 0, ${progress * 2 - 100}% 100%, 0 100%)`;
      case 'blind': {
        // 簡易的なブラインド効果（ストライプ）
        const p = progress;
        return `polygon(
          0% 0%, 100% 0%, 100% ${p}%, 0% ${p}%,
          0% 20%, 100% 20%, 100% ${20 + p}%, 0% ${20 + p}%,
          0% 40%, 100% 40%, 100% ${40 + p}%, 0% ${40 + p}%
        )`;
      }
      case 'diamond':
        return `polygon(50% ${50 - progress}%, ${50 + progress}% 50%, 50% ${50 + progress}%, ${50 - progress}% 50%)`;
      default:
        return 'none';
    }
  };

  return (
    <AbsoluteFill style={{ clipPath: getClipPath(), backgroundColor: 'white' }}>
      {children}
    </AbsoluteFill>
  );
};
