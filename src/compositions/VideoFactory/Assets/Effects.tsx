import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// --- Effects Implementation ---

/**
 * 1. ScanlineOverlay
 * Classic CRT scanlines with moving flicker.
 */
export const ScanlineOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))`,
          backgroundSize: `100% 4px, 3px 100%`,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: `${(frame * 2) % 100}%`,
          width: '100%',
          height: '10%',
          background:
            'linear-gradient(transparent, rgba(255,255,255,0.1), transparent)',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 2. GlitchDistortion
 * Intermittent slice glitches and color shifts.
 */
export const GlitchDistortion: React.FC<{ frequency?: number }> = ({
  frequency = 0.1,
}) => {
  const frame = useCurrentFrame();
  const isGlitch = Math.random() < frequency;

  if (!isGlitch) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${(Math.random() - 0.5) * 5}%`,
            width: '110%',
            height: `${Math.random() * 5}%`,
            backgroundColor: `rgba(0, 255, 255, 0.3)`,
            filter: 'blur(2px)',
            transform: `skewX(${Math.random() * 20}deg)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/**
 * 3. ParticlesDust
 * Floating small particles for depth.
 */
export const ParticlesDust: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p) => {
        const yPos = (p.y - frame * p.speed) % 100;
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${yPos < 0 ? yPos + 100 : yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 0 10px #fff',
              opacity: p.opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * 4. SpeedLines
 * Anime-style speed lines for high intensity.
 */
export const SpeedLines: React.FC<{ color?: string }> = ({
  color = 'rgba(255,255,255,0.2)',
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const length = interpolate(Math.random(), [0, 1], [30, 100]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: length + '%',
              height: '2px',
              backgroundColor: color,
              transform: `rotate(${angle}rad) translateX(${interpolate(frame % 10, [0, 10], [0, 50])}%)`,
              transformOrigin: 'left center',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * 5. NeonGrid
 * Perspective grid floor/background.
 */
export const NeonGrid: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        perspective: '500px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          transform: 'rotateX(60deg)',
          backgroundImage: `
                    linear-gradient(to right, #00f0ff 1px, transparent 1px),
                    linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
                `,
          backgroundSize: '60px 60px',
          backgroundPosition: `0px ${frame * 2}px`,
          opacity: 0.2,
          maskImage:
            'radial-gradient(ellipse at center, black, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black, transparent 80%)',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 6. Vignette
 * Darkens edges to focus center.
 */
export const Vignette: React.FC<{ intensity?: number }> = ({
  intensity = 0.5,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
};

/**
 * 7. ChromaticAberrationOverlay
 * Static subtle RGB split at edges.
 */
export const ChromaticAberrationOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{
          filter: 'matrix(1,0,0,1,2,0)',
          opacity: 0.3,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          filter: 'matrix(1,0,0,1,-2,0)',
          opacity: 0.3,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 8. FloatingShapes
 * Geometric shapes floating in the background.
 */
export const FloatingShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const shapes = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 60 + 20,
        rotation: Math.random() * 360,
        speed: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff00ff',
      })),
    [],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {shapes.map((s) => {
        const yPos = ((s.y - frame * s.speed) % 120) - 10;
        return (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${yPos}%`,
              width: s.size,
              height: s.size,
              border: `1px solid ${s.color}`,
              transform: `rotate(${s.rotation + frame}deg)`,
              opacity: 0.2,
              clipPath:
                Math.random() > 0.5
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  : 'none',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * 9. DigitalRain
 * Matrix-style falling code or bars.
 */
export const DigitalRain: React.FC = () => {
  const frame = useCurrentFrame();
  const columns = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: i * 5,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 20 + 10,
      })),
    [],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {columns.map((c) => {
        const yPos = ((frame * c.speed) % 150) - 50;
        return (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${yPos}%`,
              width: '2px',
              height: `${c.length}%`,
              background: 'linear-gradient(transparent, #00f0ff)',
              opacity: 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * 10. FlashPulse
 * Periodic brightness burst synchronized with a pulse value.
 */
export const FlashPulse: React.FC<{ pulse: number; color?: string }> = ({
  pulse,
  color = '#fff',
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundColor: color,
        opacity: pulse * 0.3,
      }}
    />
  );
};

/**
 * 11. RadialBlurImpact
 * Creates a zoom-blur effect around the center.
 */
export const RadialBlurImpact: React.FC<{ intensity: number }> = ({
  intensity,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backdropFilter: `blur(${intensity * 20}px)`,
        maskImage: `radial-gradient(circle, transparent 20%, black 100%)`,
        WebkitMaskImage: `radial-gradient(circle, transparent 20%, black 100%)`,
      }}
    />
  );
};

/**
 * 12. BokehOverlay
 * Blurred soft circles for a cinematic feel.
 */
export const BokehOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 200 + 100,
        opacity: Math.random() * 0.15 + 0.05,
      })),
    [],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', filter: 'blur(40px)' }}>
      {dots.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top: `${(d.y - frame * 0.2) % 100}%`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            backgroundColor: '#00f0ff',
            opacity: d.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/**
 * 13. VectorWave
 * Animated sine waves for futuristic feel.
 */
export const VectorWave: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.2 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path
          d={`M 0 500 Q 250 ${500 + Math.sin(frame / 10) * 200} 500 500 T 1000 500`}
          fill="none"
          stroke="#00f0ff"
          strokeWidth="2"
        />
        <path
          d={`M 0 550 Q 250 ${550 + Math.cos(frame / 12) * 150} 500 550 T 1000 550`}
          fill="none"
          stroke="#ff00ff"
          strokeWidth="1"
        />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * 14. EnergyShield
 * Hexagon outline pulsing over the screen.
 */
export const EnergyShield: React.FC<{ pulse: number }> = ({ pulse }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32L30 0z' fill='none' stroke='%2300f0ff' stroke-width='1'/%3E%3C/svg%3E")`,
        opacity: pulse * 0.2,
        boxShadow: `inset 0 0 ${pulse * 100}px #00f0ff`,
      }}
    />
  );
};

/**
 * 15. GlitchBarsStatic
 * Random static lines appearing.
 */
export const GlitchBarsStatic: React.FC<{ frequency: number }> = ({
  frequency,
}) => {
  const bars =
    Math.random() < frequency
      ? Array.from({ length: 3 }).map(() => ({
          top: Math.random() * 100,
          height: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.5,
        }))
      : [];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {bars.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${b.top}%`,
            width: '100%',
            height: `${b.height}px`,
            backgroundColor: '#00f0ff',
            opacity: b.opacity,
            boxShadow: '0 0 10px #00f0ff',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
