import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const PARTICLE_COUNT = 20;

interface CrystalParticle {
  x: number;
  y: number;
  size: number;
  rotationSpeed: number;
  opacity: number;
  seed: number;
  color: string;
}

export const CrystalBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(() => {
    const p: CrystalParticle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const seed = i;
      const r = random(`crystal-${seed}`);
      p.push({
        x: random(`x-${seed}`) * width,
        y: random(`y-${seed}`) * height,
        size: r * 150 + 50,
        rotationSpeed: (random(`rot-${seed}`) - 0.5) * 0.02,
        opacity: random(`op-${seed}`) * 0.3 + 0.1,
        seed,
        color: r > 0.7 ? '#00f0ff' : r > 0.4 ? '#ffffff' : '#aa00ff',
      });
    }
    return p;
  }, [width, height]);

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(135deg, #020b1a 0%, #0a1f3d 50%, #050a14 100%)',
      }}
    >
      {/* Ambient Glows */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(0, 240, 255, 0.15) 0%, transparent 50%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 80% 70%, rgba(170, 0, 255, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* Floating Crystal Particles */}
      {particles.map((p) => {
        const floatY = Math.sin(frame * 0.01 + p.seed) * 50;
        const rotation = frame * p.rotationSpeed;

        return (
          <div
            key={p.seed}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y + floatY,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              transform: `rotate(${rotation}rad)`,
              background: `linear-gradient(45deg, transparent, ${p.color}44, transparent)`,
              clipPath:
                'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              border: `1px solid ${p.color}22`,
            }}
          />
        );
      })}

      {/* Lens Flares / Prism Streaks */}
      <AbsoluteFill
        style={{
          background:
            'repeating-linear-gradient(45deg, transparent, rgba(255,255,255,0.03) 100px, transparent 200px)',
          opacity: 0.5,
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
