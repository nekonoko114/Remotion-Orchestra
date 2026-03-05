import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface ExplosionProps {
  delay?: number;
  duration?: number;
  color?: string;
  secondaryColor?: string;
  scale?: number;
}

export const Explosion: React.FC<ExplosionProps> = ({
  delay = 0,
  duration = 30,
  color = '#ff4d00',
  secondaryColor = '#ffea00',
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const relFrame = frame - delay;

  // Core animation drive
  const spr = spring({
    frame: relFrame,
    fps,
    durationInFrames: duration,
    config: { damping: 12, stiffness: 200 },
  });

  // Debris/Particle data
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      angle: random(`explosion-p-angle-${i}`) * Math.PI * 2,
      distance: 100 + random(`explosion-p-dist-${i}`) * 600,
      size: 4 + random(`explosion-p-size-${i}`) * 15,
      vX: (random(`vx-${i}`) - 0.5) * 40,
      vY: (random(`vy-${i}`) - 0.5) * 40,
      rotation: random(`rot-${i}`) * 360,
      color: random(`c-${i}`) > 0.3 ? color : secondaryColor,
    }));
  }, [color, secondaryColor]);

  // Radial Spikes data
  const spikes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      rotation: i * 30 + (random(`spike-rot-${i}`) - 0.5) * 15,
      length: 300 + random(`spike-len-${i}`) * 400,
      width: 10 + random(`spike-w-${i}`) * 40,
    }));
  }, []);

  if (relFrame < 0 || relFrame > duration + 30) return null;

  // 1. Initial Flash
  const flashOpacity = interpolate(relFrame, [0, 2, 8], [0, 0.9, 0], {
    extrapolateRight: 'clamp',
  });

  // 2. Core Sphere
  const coreScale = interpolate(spr, [0, 0.1, 0.4, 1], [0, 1.2, 1, 0.8]);
  const coreOpacity = interpolate(spr, [0, 0.05, 0.6, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{ pointerEvents: 'none', transform: `scale(${scale})` }}
    >
      {/* Screen Flash */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          opacity: flashOpacity,
          zIndex: 100,
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 2. Radial Spikes (Impact Lines) */}
        {spikes.map((s, i) => {
          const sProgress = spring({
            frame: relFrame - Math.floor(random(`spike-d-${i}`) * 3),
            fps,
            durationInFrames: 15,
          });
          const sLen = interpolate(
            sProgress,
            [0, 0.2, 1],
            [0, s.length, s.length * 1.5],
          );
          const sOp = interpolate(sProgress, [0, 0.1, 0.5, 1], [0, 1, 1, 0]);

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Visual explosion spikes
              key={`spike-${i}`}
              style={{
                position: 'absolute',
                width: s.width,
                height: sLen,
                backgroundColor: 'white',
                boxShadow: `0 0 20px ${color}`,
                transform: `rotate(${s.rotation}deg) translateY(-50%)`,
                transformOrigin: 'center center',
                opacity: sOp,
                borderRadius: '50% / 10%',
              }}
            />
          );
        })}

        {/* 3. Central Core Burst */}
        <div
          style={{
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, white 0%, ${secondaryColor} 40%, ${color} 70%, transparent 100%)`,
            borderRadius: '50%',
            transform: `scale(${coreScale * 3})`,
            opacity: coreOpacity,
            filter: 'blur(10px)',
            boxShadow: `0 0 100px ${color}`,
          }}
        />

        {/* 4. Falling Debris / Flying Shards */}
        {particles.map((p, i) => {
          const pProgress = spring({
            frame: relFrame - 2,
            fps,
            durationInFrames: duration + 10,
            config: { stiffness: 100 },
          });

          // Gravity and physics simulation using spring progress for better control
          const x = p.vX * pProgress * 30;
          const y = p.vY * pProgress * 30 + 500 * pProgress * pProgress; // Improved gravity
          const pOpacity = interpolate(pProgress, [0.7, 1], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Visual explosion debris
              key={`debris-${i}`}
              style={{
                position: 'absolute',
                left: width / 2 + x,
                top: height / 2 + y,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 15px ${p.color}`,
                transform: `rotate(${p.rotation + pProgress * 360}deg)`,
                opacity: pOpacity,
                borderRadius: i % 4 === 0 ? '0%' : '50%',
                willChange: 'transform, opacity',
              }}
            />
          );
        })}

        {/* 5. Shockwave Ring */}
        <div
          style={{
            position: 'absolute',
            width: '1000px',
            height: '1000px',
            border: '8px solid white',
            borderRadius: '50%',
            transform: `scale(${spr * 2.5})`,
            opacity: interpolate(spr, [0, 0.1, 0.8, 1], [0, 0.8, 0.8, 0]),
            filter: 'blur(5px)',
            boxShadow: '0 0 50px white, inset 0 0 50px white',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
