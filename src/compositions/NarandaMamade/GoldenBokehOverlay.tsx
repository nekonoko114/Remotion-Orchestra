import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  random,
  interpolate,
} from 'remotion';
import React, { useMemo } from 'react';

export const GoldenBokehOverlay: React.FC<{ startFrame: number }> = ({
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Active only after startFrame
  const relativeFrame = frame - startFrame;
  // Particle count
  const PARTICLE_COUNT = 40;

  const particles = useMemo(() => {
    return new Array(PARTICLE_COUNT).fill(true).map((_, i) => {
      const x = random(`x-${i}`) * 100; // %
      const y = random(`y-${i}`) * 100; // %
      const size = interpolate(random(`size-${i}`), [0, 1], [10, 80]); // px - Smaller size
      const speed = interpolate(random(`speed-${i}`), [0, 1], [0.5, 2]);
      const delay = random(`delay-${i}`) * 200; // frames
      const blur = interpolate(random(`blur-${i}`), [0, 1], [2, 10]);

      // Assign color: 0=Gold, 1=Purple, 2=Silver
      const colorType = Math.floor(random(`color-${i}`) * 3);

      return { x, y, size, speed, delay, blur, colorType };
    });
  }, []);

  // God Rays (Light Shafts) configuration
  const rays = useMemo(() => {
    return new Array(5).fill(true).map((_, i) => ({
      rotation: random(`ray-rot-${i}`) * 30 - 15, // -15 to 15 degrees
      width: interpolate(random(`ray-w-${i}`), [0, 1], [10, 30]), // %
      delay: random(`ray-d-${i}`) * 20,
      speed: interpolate(random(`ray-s-${i}`), [0, 1], [0.02, 0.05]),
    }));
  }, []);

  // Active only after startFrame
  // MOVED CHECK HERE to satisfy Rules of Hooks (hooks must run before early return)
  if (relativeFrame < 0) return null;

  // Fade in effect
  const opacity = interpolate(relativeFrame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slow pulsing breath for the whole overlay
  const breath = interpolate(
    Math.sin(relativeFrame * 0.02),
    [-1, 1],
    [0.8, 1.2],
  );

  const getParticleColor = (type: number) => {
    switch (type) {
      case 1: // Purple
        return 'radial-gradient(circle at 30% 30%, rgba(200, 100, 255, 0.9), rgba(128, 0, 128, 0.4) 60%, transparent 100%)';
      case 2: // Silver
        return 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(192, 192, 192, 0.4) 60%, transparent 100%)';
      default: // Moonlight (Silver/Blue)
        return 'radial-gradient(circle at 30% 30%, rgba(230, 245, 255, 0.9), rgba(173, 216, 230, 0.4) 60%, transparent 100%)';
    }
  };

  return (
    <AbsoluteFill style={{ opacity, zIndex: 50, pointerEvents: 'none' }}>
      {/* 1. Dreamy Soft Focus Background tint */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(255, 250, 200, 0.15), transparent 70%)',
          mixBlendMode: 'screen',
          filter: 'blur(30px)',
        }}
      />

      {/* 2. God Rays (Light Shafts) */}
      <AbsoluteFill style={{ mixBlendMode: 'overlay', opacity: 0.6 }}>
        {rays.map((ray, i) => {
          const movement = Math.sin(relativeFrame * ray.speed + i) * 5;
          return (
            <div
              key={`ray-${i}`}
              style={{
                position: 'absolute',
                left: `${20 + i * 15}%`,
                top: '-20%',
                width: `${ray.width}%`,
                height: '150%',
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 80%)',
                transform: `rotate(${ray.rotation + movement}deg)`,
                transformOrigin: 'top center',
                filter: 'blur(20px)',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* 3. Golden Particles */}
      <div style={{ mixBlendMode: 'screen', width: '100%', height: '100%' }}>
        {particles.map((p, i) => {
          const particleFrame = relativeFrame - p.delay;

          // Improved floaty movement (Sine wave drift)
          const moveY = -1 * particleFrame * p.speed; // Always up
          const driftX = Math.sin(particleFrame * 0.01 + i) * 50;

          // Wrap loop logic visually
          const period = height + 200;
          const rawY = (p.y * height) / 100 + moveY;
          const finalY = (((rawY % period) + period) % period) - 100; // Correct modulo for negative numbers

          // Fade in/out cycle
          const particleOpacity = interpolate(
            Math.sin(relativeFrame * 0.03 + i),
            [-1, 1],
            [0.2, 0.9],
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: (p.x * width) / 100 + driftX,
                top: finalY,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                // Gradient for more realistic bokeh
                background: getParticleColor(p.colorType),
                filter: `blur(${p.blur}px)`,
                opacity: particleOpacity * breath,
                transform: `scale(${interpolate(Math.sin(relativeFrame * 0.05 + i), [-1, 1], [0.8, 1.2])})`,
              }}
            />
          );
        })}
      </div>

      {/* 4. Mystical Sparkles (Sharper, intense points of light) */}
      {new Array(25).fill(true).map((_, i) => {
        const x = random(`sx-${i}`) * 100;
        const y = random(`sy-${i}`) * 100;
        const twinkleSpeed = interpolate(random(`ts-${i}`), [0, 1], [0.1, 0.5]);
        const sparkleOpacity = interpolate(
          Math.sin(relativeFrame * twinkleSpeed + i * 10),
          [-1, 1],
          [0, 1],
        );

        return (
          <div
            key={`sparkle-${i}`}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: interpolate(random(`sw-${i}`), [0, 1], [2, 6]),
              height: interpolate(random(`sh-${i}`), [0, 1], [2, 6]),
              borderRadius: '50%',
              backgroundColor: '#FFFFE0', // Light yellow/white
              boxShadow:
                '0 0 10px 2px rgba(255, 255, 255, 0.9), 0 0 20px 5px rgba(255, 215, 0, 0.5)', // Intense glow
              opacity: sparkleOpacity,
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* 5. Vignette for depth */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle, transparent 60%, rgba(50, 0, 50, 0.3) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
