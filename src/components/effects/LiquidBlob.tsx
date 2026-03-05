import type React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

export const LiquidBlob: React.FC<{ color?: string }> = ({
  color = '#ff0055',
}) => {
  const frame = useCurrentFrame();

  // 複数の円をランダムに動かす
  const blobs = Array.from({ length: 5 }).map((_, i) => {
    const speed = 0.05 + random(i) * 0.05;
    const radius = 100 + random(i + 10) * 50;

    // 8の字ループのような動き
    const x = Math.sin(frame * speed + i) * 100;
    const y = Math.cos(frame * speed * 1.5 + i) * 80;

    return (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: Random blob particles
        key={`blob-${i}`}
        style={{
          position: 'absolute',
          top: `calc(50% + ${y}px)`,
          left: `calc(50% + ${x}px)`,
          width: radius,
          height: radius,
          borderRadius: '50%',
          backgroundColor: color,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        style={{ position: 'absolute', width: 0, height: 0 }}
        aria-label="Liquid filter"
      >
        <title>Liquid Filter</title>
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="20"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          filter: "url('#goo')", // SVGフィルターを適用して融合させる
        }}
      >
        {blobs}
        {/* 中心にあるメインのBlob */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
