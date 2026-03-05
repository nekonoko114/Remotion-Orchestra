import type React from 'react';
import { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

/**
 * 不透明度を変化させるシンプルなフェードエフェクト
 */
export const CrossDissolve: React.FC<{
  type?: 'in' | 'out';
  duration?: number;
  children: React.ReactNode;
}> = ({ type = 'in', duration = 30, children }) => {
  const frame = useCurrentFrame();

  const opacity = useMemo(() => {
    if (type === 'in') {
      return interpolate(frame, [0, duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
    // out は 1 -> 0
    return interpolate(frame, [0, duration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }, [frame, duration, type]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        willChange: 'opacity',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
