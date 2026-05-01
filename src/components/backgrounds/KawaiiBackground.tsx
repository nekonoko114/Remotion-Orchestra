import type React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const Heart: React.FC<{ seed: number; frame: number }> = ({ seed, frame }) => {
  const { height, width } = useVideoConfig();
  const opacity = interpolate(random(seed), [0, 1], [0.2, 0.6]);
  const size = interpolate(random(seed + 1), [0, 1], [40, 100]);

  // Movement
  const initialX = random(seed + 2) * width;
  const duration = 150 + random(seed + 3) * 100;
  const startTime = (random(seed + 4) * 300) % 300;
  const cycle = (frame + startTime) % duration;
  const progress = cycle / duration;

  const y = interpolate(progress, [0, 1], [height + 100, -100]);
  const x = initialX + Math.sin(progress * Math.PI * 2) * 50;
  const rotation = interpolate(progress, [0, 1], [0, 360]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        transform: `rotate(${rotation}deg)`,
        fontSize: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.5))',
      }}
    >
      ❤️
    </div>
  );
};

const Sparkle: React.FC<{ seed: number; frame: number }> = ({
  seed,
  frame,
}) => {
  const { height, width } = useVideoConfig();
  const x = random(seed) * width;
  const y = random(seed + 1) * height;
  const size = interpolate(random(seed + 2), [0, 1], [10, 30]);
  const opacity = interpolate(
    Math.sin(frame / 10 + random(seed) * 10),
    [-1, 1],
    [0, 0.8],
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: '#FFF',
        borderRadius: '50%',
        opacity,
        boxShadow: '0 0 15px #FFF',
        transform: 'scale(' + (0.5 + Math.sin(frame / 5) * 0.5) + ')',
      }}
    />
  );
};

export const KawaiiBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
      }}
    >
      {/* Rainbow Aura */}
      <AbsoluteFill
        style={{
          background:
            'conic-gradient(from 180deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff, #ff0000)',
          opacity: 0.1,
          filter: 'blur(100px)',
          transform: `rotate(${frame * 0.5}deg) scale(2)`,
        }}
      />

      {/* Floating Hearts */}
      {new Array(15).fill(0).map((_, i) => (
        <Heart key={`heart-${i}`} seed={i * 133} frame={frame} />
      ))}

      {/* Sparkling Stars */}
      {new Array(30).fill(0).map((_, i) => (
        <Sparkle key={`sparkle-${i}`} seed={i * 777} frame={frame} />
      ))}

      {/* Glossy Overlay */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 60%, rgba(255, 255, 255, 0.3) 100%)',
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};
