import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Series,
} from 'remotion';
import { ArigatoProps } from './types';
import { GoldenBokehOverlay } from '../NarandaMamade/GoldenBokehOverlay';

const ImageSlide: React.FC<{
  src: string;
  duration: number;
  offsetY?: number;
}> = ({ src, duration, offsetY = 0 }) => {
  const frame = useCurrentFrame();

  // Simple Fade In / Out
  const opacity = interpolate(
    frame,
    [0, 20, duration - 20, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Ken Burns Effect (Slow Zoom & Slight Pan)
  const scale = interpolate(
    frame,
    [0, duration],
    [1.05, 1.15], 
    { easing: Easing.out(Easing.quad) }
  );

  const driftX = interpolate(
    frame,
    [0, duration],
    [-10, 10],
    { easing: Easing.inOut(Easing.quad) }
  );

  // Slight downward drift to prevent head cutoff (Memorial photos often focus on the upper half)
  const driftY = interpolate(
    frame,
    [0, duration],
    [0, 20],
    { easing: Easing.inOut(Easing.quad) }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background - Restored secondary image layer (Safe now with WebP) */}
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <AbsoluteFill style={{ opacity: 0.5, filter: 'blur(10px)' }}>
          <Img
            src={staticFile(src)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Main Image */}
      <AbsoluteFill
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            transform: `scale(${scale}) translateX(${driftX}px) translateY(${offsetY + driftY}px)`,
            willChange: 'transform',
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.8))',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ArigatoMV: React.FC<ArigatoProps> = ({
  images,
  music,
  title = "レンレン",
  message = "いつも今までありがとう",
}) => {
  const { durationInFrames, fps } = useVideoConfig(); // default 30fps
  const frame = useCurrentFrame();

  const ENDING_IMAGE_PATH = "assets/レンレン（蓮）/IMG_20190416_181608-EFFECTS.webp";
  const ENDING_DURATION_FRAMES = 8 * fps; // 8 seconds

  const { mainImages, lastImage } = useMemo(() => {
    const filtered = images.filter(img => !img.includes("IMG_20190416_181608-EFFECTS"));
    const last = images.find(img => img.includes("IMG_20190416_181608-EFFECTS")) || ENDING_IMAGE_PATH;
    return { mainImages: filtered, lastImage: last };
  }, [images]);

  const mainDuration = durationInFrames - ENDING_DURATION_FRAMES;
  const framesPerImage = mainImages.length > 0 ? mainDuration / mainImages.length : 0;

  const globalOpacity = interpolate(
    frame,
    [0, 90, durationInFrames - 90, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Audio src={staticFile(music)} volume={0.8} />

      {/* Image Gallery */}
      <Series>
        {/* Main memory reel */}
        {mainImages.map((src, i) => {
          const sequenceDuration = Math.floor((i + 1) * framesPerImage) - Math.floor(i * framesPerImage);
          // Target frames around 2838~2953 (Index 25, 26)
          const isTargetRange = i === 25 || i === 26;
          
          return (
            <Series.Sequence
              key={i}
              durationInFrames={sequenceDuration}
            >
              <ImageSlide
                src={src}
                duration={sequenceDuration}
                offsetY={isTargetRange ? 160 : 0} // Doubled offset to prevent cut-off
              />
            </Series.Sequence>
          );
        })}

        {/* Dedicated 8-second climax/ending image */}
        <Series.Sequence durationInFrames={ENDING_DURATION_FRAMES}>
          <ImageSlide 
            src={lastImage} 
            duration={ENDING_DURATION_FRAMES} 
          />
        </Series.Sequence>
      </Series>

      {/* Ethereal Effects Layer */}
      <GoldenBokehOverlay startFrame={0} />

      {/* Light Leak Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.01) * 20}% ${30 + Math.cos(frame * 0.01) * 10}%, rgba(255, 200, 150, 0.15) 0%, transparent 60%)`,
          mixBlendMode: 'screen',
          zIndex: 15,
        }}
      />

      {/* Premium Typography Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '120px',
          opacity: globalOpacity,
          zIndex: 100,
        }}
      >
        <div style={{
          textAlign: 'center',
          textShadow: '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
        }}>
          <h1 style={{
            fontSize: '84px',
            margin: 0,
            fontFamily: '"Mochiy Pop One", sans-serif',
            letterSpacing: '8px',
            color: '#FFF',
            background: 'linear-gradient(to bottom, #FFF, #FFEFC0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
          }}>
            {title}
          </h1>
          <div style={{
            height: '2px',
            width: '200px',
            background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.8), transparent)',
            margin: '20px auto',
          }} />
          <p style={{
            fontSize: '32px',
            margin: 0,
            fontFamily: '"Yu Gothic", sans-serif',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '2px',
            fontWeight: 300,
          }}>
            {message}
          </p>
        </div>
      </AbsoluteFill>

      {/* Deep Vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)',
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  );
};


