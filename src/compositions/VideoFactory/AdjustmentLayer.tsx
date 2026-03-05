import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

type Props = {
  rank: number;
  beatPulse?: number;
};

export const AdjustmentLayer: React.FC<Props> = ({ rank, beatPulse = 0 }) => {
  const frame = useCurrentFrame();

  // Theme configuration based on rank - WEAKENED INTENSITY
  const getTheme = () => {
    if (rank === 1)
      return {
        tint: '#FFD700',
        contrast: 1.3,
        saturate: 1.4,
        brightness: 1.1,
      };
    if (rank === 2)
      return {
        tint: '#A0C0FF',
        contrast: 1.1,
        saturate: 1.25,
        brightness: 1.2,
      };
    if (rank === 3)
      return {
        tint: '#FF8C00',
        contrast: 1.1,
        saturate: 1.3,
        brightness: 1.2,
      };
    return { tint: '#ffffff', contrast: 1, saturate: 1, brightness: 1 };
  };

  const theme = getTheme();

  // Probability of glitch on any given frame
  const isGlitching = random(frame) < 0.02; // 2% chance per frame (very subtle)

  // Subtle Glitch Transform (Shift X/Y)
  const shiftX = isGlitching ? (random(frame + 10) - 0.5) * 10 : 0;
  const shiftY = isGlitching ? (random(frame + 20) - 0.5) * 5 : 0;

  // 1. Contrast Pumping (Intense contrast boost on beat)
  const beatBrightness = theme.brightness + (beatPulse || 0) * 0.4;
  const beatContrast = theme.contrast + (beatPulse || 0) * 0.6; // Stronger pump

  // 2. RGB Split Logic (Stylized color separation on beat)
  const aberration = (beatPulse || 0) * 15;

  const glitchFilter = isGlitching
    ? `hue-rotate(${random(frame) * 20}deg) blur(1px)`
    : '';

  // Combine base grading and glitch into a single filter string
  const combinedFilter =
    `contrast(${beatContrast}) saturate(${theme.saturate}) brightness(${beatBrightness}) ${glitchFilter}`.trim();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Single optimized backdrop-filter layer for base grading */}
      <AbsoluteFill
        style={{
          backdropFilter: combinedFilter,
          zIndex: 100,
          transform: `translate(${shiftX}px, ${shiftY}px) scale(${1 + (beatPulse || 0) * 0.01})`,
        }}
      />

      {/* RGB Split Overlays - Simplified to color overlays instead of expensive backdrop-filters */}
      {(beatPulse || 0) > 0.1 && (
        <>
          {/* Red Channel overlay */}
          <AbsoluteFill
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              transform: `translateX(${aberration}px)`,
              mixBlendMode: 'screen',
              opacity: (beatPulse || 0) * 0.4,
              zIndex: 105,
            }}
          />
          {/* Cyan Channel overlay */}
          <AbsoluteFill
            style={{
              backgroundColor: 'rgba(0, 255, 255, 0.2)',
              transform: `translateX(${-aberration}px)`,
              mixBlendMode: 'screen',
              opacity: (beatPulse || 0) * 0.4,
              zIndex: 105,
            }}
          />
        </>
      )}

      {/* 2. Vignette (Dark borders) - Kept same */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.6) 100%)',
          zIndex: 101,
          mixBlendMode: 'multiply',
        }}
      />

      {/* 3. Color Tint (Atmosphere) - WEAKENED Opacity */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${theme.tint}00, ${theme.tint}1a)`, // max 10% opacity (hex 1a)
          zIndex: 102,
          mixBlendMode: 'overlay',
        }}
      />

      {/* 4. Soft Glow (Center Bloom) - WEAKENED */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, ${theme.tint}33 0%, transparent 60%)`,
          zIndex: 103,
          mixBlendMode: 'screen',
          filter: 'blur(40px)',
        }}
      />
    </AbsoluteFill>
  );
};
