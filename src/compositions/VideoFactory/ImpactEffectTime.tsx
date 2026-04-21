import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

type Props = {
  color?: string;
  intensity?: 'normal' | 'high';
  beatPulse?: number;
};

export const ImpactEffectTime: React.FC<Props> = ({
  color = '#d000ff',
  intensity = 'normal',
  beatPulse = 0,
}) => {
  const frame = useCurrentFrame();

  // 1. Digital Flash (Sharp)
  const flashOpacity = interpolate(frame, [0, 3, 15], [0.6, 1, 0], {
    extrapolateRight: 'clamp',
  }) /* + beatPulse * 0.2 */; // Removed beat sync

  // 2. Neon Hexagons or Squares
  const rings = intensity === 'high' ? [0, 4] : [0];

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Scanline Flash */}
      <AbsoluteFill
        style={{
          backgroundColor: color,
          opacity: flashOpacity * 0.2,
          mixBlendMode: 'screen',
        }}
      />

      {/* Technical Frame (Cyber Style) */}
      {rings.map((delay, i) => {
        const ringFrame = frame - delay;
        if (ringFrame < 0) return null;

        const ringScale = interpolate(ringFrame, [0, 15], [0.8, 1.5], {
          easing: Easing.out(Easing.exp),
          extrapolateRight: 'clamp',
        });
        const ringOpacity = interpolate(ringFrame, [0, 10, 15], [0.8, 0.4, 0], {
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              width: 800 + i * 100,
              height: 800 + i * 100,
              border: `${2}px solid ${color}`,
              transform: `scale(${ringScale}) rotate(${frame * (i % 2 === 0 ? 0.5 : -0.3)}deg)`,
              opacity: ringOpacity,
              boxShadow: `0 0 20px ${color}, inset 0 0 10px ${color}`,
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Inner Technical Lines */}
            <div style={{
              width: '90%',
              height: '90%',
              border: `1px solid ${color}`,
              opacity: 0.5,
              transform: `rotate(${frame * 1}deg)`,
            }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
