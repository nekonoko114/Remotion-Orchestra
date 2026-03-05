import type React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';

export const RadarInterface: React.FC<{
  color?: string;
}> = ({ color = '#00ffcc' }) => {
  const frame = useCurrentFrame();

  const rotation = frame * 2; // 回転速度

  // ターゲット（点）：スイープが通過した直後に光る
  const targets = Array.from({ length: 8 }).map((_, i) => {
    const key = `target-${i}`;
    const angle = random(i) * 360; // 位置（角度）
    const dist = 20 + random(i + 10) * 25; // 中心からの距離 %

    // スイープとの角度差を計算して光らせる
    // 現在のスイープ角度: rotation % 360
    // ターゲット角度: angle

    const sweepAngle = rotation % 360;
    let diff = sweepAngle - angle;
    if (diff < 0) diff += 360;

    // 通過直後(diffが小さい)に明るく、徐々に消える
    const opacity = interpolate(diff, [0, 45, 360], [1, 0, 0], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        key={key}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
          transform: `rotate(${angle}deg) translateX(${dist * 5}px) rotate(-${angle}deg)`, // 距離をpx換算(簡易)
          opacity: opacity,
        }}
      />
    );
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          boxShadow: `0 0 20px ${color}33`,
          overflow: 'hidden',
        }}
      >
        {/* 目盛り（グリッド） */}
        {[1, 2, 3].map((radius) => (
          <div
            key={radius}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${radius * 25}%`,
              height: `${radius * 25}%`,
              border: `1px solid ${color}44`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: 1,
            backgroundColor: `${color}44`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            height: '100%',
            width: 1,
            backgroundColor: `${color}44`,
          }}
        />

        {/* スイープライン（回転） */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50%',
            height: '50%',
            transformOrigin: 'top left',
            background: `conic-gradient(from 0deg, transparent 0deg, ${color}22 60deg, ${color} 90deg, transparent 90.1deg)`,
            transform: `rotate(${rotation - 90}deg)`,
            filter: 'blur(2px)',
          }}
        />

        {/* ターゲット描画 */}
        {targets}
      </div>

      {/* 数値データ装飾 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          fontFamily: 'monospace',
          color: color,
          fontSize: 14,
        }}
      >
        TRGT_COUNT: {targets.length}
        <br />
        SCAN_RATE: 200ms
        <br />
        AZIMUTH: {rotation.toFixed(1)}°
      </div>
    </AbsoluteFill>
  );
};
