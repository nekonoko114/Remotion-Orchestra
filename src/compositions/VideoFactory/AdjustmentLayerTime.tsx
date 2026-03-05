import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

type Props = {
  rank: number;
  beatPulse?: number;
};

export const AdjustmentLayerTime: React.FC<Props> = ({
  rank,
  beatPulse = 0,
}) => {
  const frame = useCurrentFrame();

  const getTheme = () => {
    // Time Theme: Cyan, Magenta, Purple
    if (rank === 1)
      return { tint: '#ff0000', contrast: 1.2, saturate: 1.5, brightness: 1.1 };
    if (rank === 2)
      return {
        tint: '#ff4400',
        contrast: 1.1,
        saturate: 1.4,
        brightness: 1.05,
      };
    if (rank === 3)
      return {
        tint: '#cc0000',
        contrast: 1.1,
        saturate: 1.2,
        brightness: 1.05,
      };
    return { tint: '#ff0000', contrast: 1, saturate: 1.1, brightness: 1 };
  };

  const theme = getTheme();
  const isGlitching = random(frame) < 0.02;
  const shiftY = isGlitching ? Math.floor(random(frame + 1) * 20) : 0;

  // Subtle pulse glow
  const pulseAlpha = beatPulse * 0.15;

  // Chromatic Aberration Simulation (Offset filters)
  const aberration = pulseAlpha * 10;

  const glitchFilter = isGlitching
    ? `hue-rotate(${random(frame) * 90}deg) brightness(1.5) saturate(2)`
    : 'none';

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Base Adjustment Layer with Glitch */}
      <AbsoluteFill
        style={{
          backdropFilter: `contrast(${theme.contrast + beatPulse * 0.1}) saturate(${theme.saturate}) brightness(${theme.brightness + beatPulse * 0.2}) ${glitchFilter}`,
          zIndex: 100,
          transform: `translateY(${shiftY}px)`,
        }}
      />

      {/* Chromatic Aberration Overlays (Offset backdrop filters) */}
      {pulseAlpha > 0.05 && (
        <>
          <AbsoluteFill
            style={{
              backdropFilter: `hue-rotate(5deg) brightness(1.1)`,
              transform: `translateX(${aberration}px)`,
              zIndex: 101,
              mixBlendMode: 'screen',
              opacity: 0.5,
            }}
          />
          <AbsoluteFill
            style={{
              backdropFilter: `hue-rotate(-5deg) brightness(1.1)`,
              transform: `translateX(-${aberration}px)`,
              zIndex: 101,
              mixBlendMode: 'screen',
              opacity: 0.5,
            }}
          />
        </>
      )}

      {/* Neon Overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, ${theme.tint}${Math.floor(
            pulseAlpha * 255,
          )
            .toString(16)
            .padStart(2, '0')} 0%, transparent 70%)`,
          zIndex: 102,
          mixBlendMode: 'screen',
        }}
      />

      {/* Digital Scanlines */}
      <AbsoluteFill
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.05) 2px, rgba(255, 0, 0, 0.05) 4px)',
          zIndex: 103,
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};
