import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const ShootingStar: React.FC<{
  triggerFrame: number;
  speed?: number;
}> = ({ triggerFrame, speed = 45 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const trailDots = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      delay: i * 2,
      size: 2 + random(`spark-${i}`) * 6,
      color: random(`spark-c-${i}`) > 0.5 ? '#00f0ff' : '#ff00ff',
    }));
  }, []);

  const progress = interpolate(frame - triggerFrame, [0, speed], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const x = interpolate(progress, [0, 1], [-500, width + 500]);
  const y = interpolate(progress, [0, 1], [100, 600]);
  const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);

  if (frame < triggerFrame || frame > triggerFrame + speed + 20) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Screen Space Flash */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          opacity: Math.max(
            0,
            0.4 - Math.abs(frame - (triggerFrame + speed / 2)) / 10,
          ),
          pointerEvents: 'none',
        }}
      />

      {/* The Mega Glow Halo */}
      <div
        style={{
          position: 'absolute',
          left: x + 150,
          top: y,
          width: '120px',
          height: '120px',
          backgroundColor: '#3498db',
          filter: 'blur(60px)',
          borderRadius: '50%',
          opacity: opacity * 0.9,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Trailing Sparks */}
      {trailDots.map((dot, i) => {
        const dotOpacity = Math.max(0, opacity - i / 15);
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Trail particles
            key={i}
            style={{
              position: 'absolute',
              left: x + 250 - i * 20,
              top: y + i * 2,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
              boxShadow: `0 0 10px ${dot.color}`,
              borderRadius: '50%',
              opacity: dotOpacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* The Multi-layered Tail */}
      <div
        style={{
          position: 'absolute',
          left: x - 100,
          top: y,
          width: '400px',
          height: '8px',
          background:
            'linear-gradient(90deg, transparent, #ff00ff, #00f0ff, #fff)',
          boxShadow: '0 0 20px #00f0ff, 0 0 40px #ff00ff',
          transform: 'rotate(-15deg)',
          transformOrigin: 'right center',
          opacity,
          borderRadius: '4px',
        }}
      />

      {/* The Hyper Bright Head */}
      <div
        style={{
          position: 'absolute',
          left: x + 300,
          top: y,
          width: '20px',
          height: '20px',
          backgroundColor: '#fff',
          boxShadow: '0 0 20px #fff, 0 0 40px #3498db, 0 0 60px #fff',
          borderRadius: '50%',
          opacity,
          transform: 'translate(-50%, -50%) rotate(-15deg)',
        }}
      />
    </AbsoluteFill>
  );
};
