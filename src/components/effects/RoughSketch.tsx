import type React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

export interface RoughSketchProps {
  children: React.ReactNode;
  frequency?: number; // How "rough" the paper texture/lines are 0.01 - 0.1
  amplitude?: number; // How much it distorts (pixels)
  seed?: number;
}

export const RoughSketch: React.FC<RoughSketchProps> = ({
  children,
  frequency = 0.02,
  amplitude = 3,
  seed = 0,
}) => {
  const frame = useCurrentFrame();

  // Animate the seed/noise every few frames to make it "boil" like hand-drawn animation
  // 6fps animation look is classic for this style
  const animationFrame = Math.floor(frame / 4);
  const currentSeed = seed + animationFrame;

  const filterId = `rough-sketch-${random(seed)}`;

  return (
    <AbsoluteFill>
      {/* Define the SVG Filter */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0 }}
        aria-label="Rough sketch filter"
      >
        <title>Rough Sketch Filter</title>
        <defs>
          <filter id={filterId}>
            {/* 
              feTurbulence generates noise.
              baseFrequency is the roughness. type="fractalNoise" or "turbulence".
              seed changes the noise pattern.
            */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency={frequency}
              numOctaves={3}
              seed={currentSeed}
              result="noise"
            />
            {/* 
              feDisplacementMap uses the noise to distort the source graphic.
              scale controls how much pixels move.
            */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={amplitude}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Apply the filter to children */}
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: `url(#${filterId})`,
          willChange: 'filter',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
