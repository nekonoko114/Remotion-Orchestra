import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const LINE_COUNT = 30; // 60から30へ削減

const blastSpring = (frame: number, fps: number, delay: number) => spring({
  frame: frame - delay,
  fps,
  config: { stiffness: 100, damping: 20 }
});

export const EnergyBlast: React.FC<{ color: string, delay: number }> = ({ color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig(); // width, heightは未使用のため削除済み
  const progress = blastSpring(frame, fps, delay);

  if (frame < delay) return null;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'plus-lighter' }}>
      {/* 1. Radial Spikes (Ultra Optimized) */}
      {[...Array(LINE_COUNT)].map((_, i) => {
        const angle = (i / LINE_COUNT) * 360;
        const length = interpolate(progress, [0, 0.4, 1], [0, 800, 1200]);
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 0]);
        const thickness = interpolate(progress, [0, 1], [20, 4]);

        return (
          <div key={i} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: length,
            height: thickness,
            background: `linear-gradient(90deg, ${color}, transparent)`,
            transformOrigin: 'left center',
            transform: `translate(0, -50%) rotate(${angle}deg) translateX(${50 + progress * 150}px)`,
            opacity,
          }} />
        );
      })}

      {/* 2. Expanding Glow Ring (No blur) */}
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1000,
          height: 1000,
          transform: `translate(-50%, -50%) scale(${progress * 1.5})`,
          border: `2px solid ${color}`, // blurの代わりに太い境界線
          borderRadius: '50%',
          opacity: (1 - progress) * 0.3,
      }} />
    </AbsoluteFill>
  );
};
