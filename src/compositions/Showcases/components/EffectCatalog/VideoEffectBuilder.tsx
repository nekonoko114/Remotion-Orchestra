import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';

export interface VideoEffectRecipe {
  id: string;
  name: string;
  src: string;
  blendMode?: React.CSSProperties['mixBlendMode'];
  opacity?: number;
  blur?: number; // in px
  hueRotate?: number; // in deg
  saturation?: number; // in %
  brightness?: number; // in %
  contrast?: number; // in %
  invert?: number; // in %
  noiseIntensity?: number; // 0 to 1
  noiseScale?: number;
  playbackRate?: number; // 速度（1が通常, 1.5で1.5倍速など）
  scale?: number; // ズーム（1が通常、1.2で少し拡大など）
}

export const VideoEffectBuilder: React.FC<{
  recipe: VideoEffectRecipe;
  style?: React.CSSProperties;
}> = ({ recipe, style }) => {
  const {
    src,
    blendMode = 'normal',
    opacity = 1,
    blur = 0,
    hueRotate = 0,
    saturation = 100,
    brightness = 100,
    contrast = 100,
    invert = 0,
    noiseIntensity = 0,
    noiseScale = 1,
    playbackRate = 1,
    scale = 1,
  } = recipe;

  // Build the CSS filter string
  const filters: string[] = [];
  if (blur > 0) filters.push(`blur(${blur}px)`);
  if (hueRotate !== 0) filters.push(`hue-rotate(${hueRotate}deg)`);
  if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (invert > 0) filters.push(`invert(${invert}%)`);

  // SVG Noise ID Generation
  const noiseFilterId = `noise-${recipe.id}`;
  const useNoise = noiseIntensity > 0;
  
  if (useNoise) {
    filters.push(`url(#${noiseFilterId})`);
  }

  const cssFilterString = filters.length > 0 ? filters.join(' ') : 'none';

  return (
    <AbsoluteFill style={{ ...style, mixBlendMode: blendMode, opacity, pointerEvents: 'none' }}>
      {/* Invisible SVG definition for the noise filter if needed */}
      {useNoise && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <filter id={noiseFilterId} colorInterpolationFilters="sRGB">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency={noiseScale} 
                numOctaves="3" 
                stitchTiles="stitch" 
                result="noise"
              />
              <feColorMatrix type="matrix" values={`
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 ${noiseIntensity} 0
              `} in="noise" result="coloredNoise" />
              
              {/* Extract the luminance of the original video to use as a mask */}
              <feColorMatrix type="luminanceToAlpha" in="SourceGraphic" result="mask" />
              
              {/* Apply the mask to the noise: only show noise where the video is bright */}
              <feComposite operator="in" in="coloredNoise" in2="mask" result="maskedNoise" />

              {/* Blend the masked noise back onto the original video */}
              <feBlend mode="screen" in="maskedNoise" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>
      )}

      <OffthreadVideo
        src={src.startsWith('assets') ? staticFile(src) : src}
        muted
        playbackRate={playbackRate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: cssFilterString,
          transform: scale !== 1 ? `scale(${scale})` : 'none',
        }}
      />
    </AbsoluteFill>
  );
};
