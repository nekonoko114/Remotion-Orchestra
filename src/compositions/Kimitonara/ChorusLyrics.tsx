import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { Lyric, isChorusTime } from './Lyrics';

interface ChorusLyricsProps {
  subtitles: Lyric[];
  layer?: 'front' | 'back'; // New prop for parallax layering
}

const PRIMARY_COLOR = '#00FFFF'; // Cyan Neon for Chorus
const SECONDARY_COLOR = '#FFFFFF'; // White Core
const STRIP_COLOR = 'black'; // Black strip

// Deterministic pseudo-random number generator
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const ChorusLyrics: React.FC<ChorusLyricsProps> = ({
  subtitles,
  layer = 'front',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Sabi (Chorus) check
  const currentLyricIndex = subtitles.findIndex((lyric) => {
    const startFrame = lyric.start * fps;
    const endFrame = lyric.end * fps;
    return frame >= startFrame && frame <= endFrame;
  });
  const currentLyric = subtitles[currentLyricIndex];

  // Valid check: Must be a lyric AND within chorus time range
  if (!currentLyric || !isChorusTime(currentLyric.start)) return null;

  // Animation progress
  const startFrame = currentLyric.start * fps;
  const relativeFrame = frame - startFrame;

  // Layer-specific Adjustments
  const isBack = layer === 'back';
  const zIndex = isBack ? 5 : 100; // Back layer behind character, Front in front
  const parallaxMultiplier = isBack ? 0.5 : 1.2; // Back moves slower, Front moves faster (Parallax)

  // Back layer aesthetic: Darker, Blurred, Subtle
  const opacity = isBack ? 0.6 : 1;
  const blur = isBack ? 'blur(2px)' : 'none';
  const scaleMult = isBack ? 0.9 : 1.1; // Front is larger

  return (
    <AbsoluteFill style={{ zIndex }}>
      <KineticStripText
        text={currentLyric.text}
        relativeFrame={relativeFrame}
        width={width}
        height={height}
        index={currentLyricIndex}
        parallaxMultiplier={parallaxMultiplier}
        opacity={opacity}
        blur={blur}
        scaleMult={scaleMult}
        isBack={isBack}
      />
    </AbsoluteFill>
  );
};

const KineticStripText: React.FC<{
  text: string;
  relativeFrame: number;
  width: number;
  height: number;
  index: number;
  parallaxMultiplier: number;
  opacity: number;
  blur: string;
  scaleMult: number;
  isBack: boolean;
}> = ({
  text,
  relativeFrame,
  width,
  height,
  index,
  parallaxMultiplier,
  opacity,
  blur,
  scaleMult,
  isBack,
}) => {
  // --- Randomization Config ---
  const r1 = pseudoRandom(index * 11.11);
  const r2 = pseudoRandom(index * 22.22);
  const r3 = pseudoRandom(index * 33.33);

  // Direction: Left or Right entry
  const entryDir = r1 > 0.5 ? 'left' : 'right';

  // Angle: -10 to 10 degrees (Ado style usually has slight tilt)
  const angle = (r2 - 0.5) * 20;

  // Vertical Offset: +/- 20% from center
  // Add offset for back layer to separate it from front (so they don't perfectly overlap)
  const layerOffset = isBack ? 50 : 0;
  const yOffset = (r3 - 0.5) * (height * 0.4) + layerOffset;

  // --- Animation Setup ---
  // Fast spring for strip entry
  const progress = spring({
    frame: relativeFrame,
    fps: 30,
    config: { damping: 14, stiffness: 150, mass: 0.6 },
  });

  // Strip Animation
  const dist = width * 1.0;
  const startX = entryDir === 'left' ? -dist : dist;

  // Current X position of the STRIP
  // Apply Parallax Multiplier to the travel distance
  const currentX = interpolate(
    progress,
    [0, 1],
    [startX * parallaxMultiplier, 0],
  );

  // Text Stagger Logic
  const chars = text.split('');

  // Stagger Speed (Lower = Faster, Higher = Slower)
  // Ado style is usually very fast.
  const staggerPerChar = 1.5;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translateY(${yOffset}px) rotate(${angle}deg) scale(${scaleMult})`,
        opacity: opacity,
        filter: blur,
      }}
    >
      {/* The Black Strip */}
      <div
        style={{
          position: 'relative',
          width: '120%', // Wider than screen to cover rotation gaps
          height: 'auto',
          backgroundColor: STRIP_COLOR,
          transform: `translateX(${currentX}px)`,
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: `0 0 30px ${PRIMARY_COLOR}`, // Neon Glow behind strip
          borderTop: `4px solid ${PRIMARY_COLOR}`,
          borderBottom: `4px solid ${PRIMARY_COLOR}`,
        }}
      >
        {/* Text Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {chars.map((char, i) => {
            const charDelay = i * staggerPerChar;
            const charFrame = relativeFrame - charDelay;

            // Char Animation
            // Pop in scale
            const charProgress = spring({
              frame: charFrame,
              fps: 30,
              config: { damping: 10, stiffness: 200 },
            });

            const scale = interpolate(charProgress, [0, 1], [2.0, 1.0]);
            const charOpacity = interpolate(charFrame, [0, 3], [0, 1], {
              extrapolateRight: 'clamp',
            });

            // Kinetic shift (Letters fly in slightly)
            // Apply Parallax to text shift too? Maybe keep it tied to strip for coherence.
            const flyDist = entryDir === 'left' ? 100 : -100;
            const transX = interpolate(charProgress, [0, 1], [flyDist, 0]);

            return (
              <span
                key={i}
                style={{
                  fontFamily: "'Zen Maru Gothic Black', sans-serif", // Kanji Support!
                  fontWeight: 900,
                  fontSize: '130px',
                  color: SECONDARY_COLOR,
                  whiteSpace: 'pre',
                  display: 'inline-block',
                  transform: `scale(${scale}) translateX(${transX}px)`,
                  opacity: charOpacity,
                  textShadow: `
                                    0 0 10px ${PRIMARY_COLOR},
                                    0 0 30px ${PRIMARY_COLOR}
                                `,
                  // Ado style: Sometimes outlines
                  WebkitTextStroke: `2px ${PRIMARY_COLOR}`,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
