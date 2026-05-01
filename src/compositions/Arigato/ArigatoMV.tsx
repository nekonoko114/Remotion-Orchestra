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
  Sequence,
} from 'remotion';
import { ArigatoProps } from '../../types/ranking-types';
import { GoldenBokehOverlay } from '../NarandaMamade/GoldenBokehOverlay';

// 動的に計算するため定数は CROSSFADE のみ保持
const CROSSFADE_FRAMES = 45; // 1.5 seconds

const ImageSlide: React.FC<{
  src: string;
  duration: number;
  offsetY?: number;
}> = ({ src, duration, offsetY = 0 }) => {
  const frame = useCurrentFrame();

  // Longer, smoother crossfade (1.5 seconds)
  const opacity = interpolate(
    frame,
    [0, CROSSFADE_FRAMES, duration - CROSSFADE_FRAMES, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Cinematic Ken Burns (Even slower zoom for more emotional weight)
  const scale = interpolate(
    frame,
    [0, duration],
    [1.02, 1.10], 
    { easing: Easing.bezier(0.33, 1, 0.68, 1) } 
  );

  const driftX = interpolate(
    frame,
    [0, duration],
    [-5, 5],
    { easing: Easing.inOut(Easing.quad) }
  );

  const driftY = interpolate(
    frame,
    [0, duration],
    [0, 10],
    { easing: Easing.inOut(Easing.quad) }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background - Soft blurred glow */}
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <AbsoluteFill style={{ opacity: 0.3, filter: 'blur(15px)' }}>
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
              filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.6))',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MysticalMemorialText: React.FC<{
  text: string;
  duration: number;
  fontSize?: string;
  delayIn?: number;
  delayOut?: number;
}> = ({ text, duration, fontSize = '52px', delayIn = 15, delayOut = 15 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 5000,
    }}>
      <div style={{
        color: '#FFFFFF',
        fontSize,
        fontFamily: '"Cinzel", serif',
        letterSpacing: '14px',
        fontWeight: 500,
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.4,
        textShadow: `
          2px 2px 4px rgba(0, 0, 0, 0.8),
          0 0 20px rgba(135, 206, 250, 0.6),
          0 0 40px rgba(135, 206, 250, 0.3)
        `,
        opacity: interpolate(
          frame,
          [0, delayIn, duration - delayOut, duration],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        ),
        transform: `translateY(${interpolate(frame, [0, duration], [10, -10])}px)`,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const ArigatoMV: React.FC<ArigatoProps> = ({
  images,
  music,
  title = "レンレン",
  message = "約9年間ありがとう",
  additionalTexts = [],
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const ENDING_IMAGE_PATH = "assets/レンレン（蓮）/IMG_20190416_181608-EFFECTS.webp";
  const ENDING_DURATION_FRAMES = 8 * fps; // 8 seconds

  const { mainImages, lastImage } = useMemo(() => {
    const filtered = images.filter(img => !img.includes("IMG_20190416_181608-EFFECTS"));
    const last = images.find(img => img.includes("IMG_20190416_181608-EFFECTS")) || ENDING_IMAGE_PATH;
    return { mainImages: filtered, lastImage: last };
  }, [images]);

  const globalOpacity = interpolate(
    frame,
    [0, 15, 1260, 1290], // Fades in at start, fades out at 43 seconds
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 音楽の長さに合わせて1枚あたりの時間を動的に計算
  const mainDuration = durationInFrames - ENDING_DURATION_FRAMES;
  const stepFrames = mainImages.length > 0 ? mainDuration / mainImages.length : 0;
  // クロスフェード分を上乗せして表示時間を決定
  const imageDuration = stepFrames + CROSSFADE_FRAMES;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Audio src={staticFile(music)} volume={0.8} />

      {/* Image Gallery - Using manual Sequence loop for precise crossfading control */}
      <AbsoluteFill>
        {mainImages.map((src, i) => {
          const startFrame = i * stepFrames;
          const isTargetRange = i === 25 || i === 26;
          
          return (
            <AbsoluteFill key={i} style={{ zIndex: i }}>
              <Sequence
                from={startFrame}
                durationInFrames={imageDuration + 1} // 余裕を持たせる
              >
                <ImageSlide
                  src={src}
                  duration={imageDuration}
                  offsetY={isTargetRange ? 160 : 0}
                />
              </Sequence>
            </AbsoluteFill>
          );
        })}

        {/* Ending Climax Image */}
        <AbsoluteFill style={{ zIndex: 999 }}>
          <Sequence 
            from={mainImages.length * stepFrames} 
            durationInFrames={ENDING_DURATION_FRAMES}
          >
            <ImageSlide 
              src={lastImage} 
              duration={ENDING_DURATION_FRAMES} 
            />
          </Sequence>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Cinematic Letterbox (Black bars) */}
      <div style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '10%',
        background: '#000',
        zIndex: 1000,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '10%',
        background: '#000',
        zIndex: 1000,
      }} />

      {/* Ethereal Effects Layer - Starts at 4:40 (8400 frames at 30fps) */}
      <GoldenBokehOverlay startFrame={8400} />

      {/* Light Leak Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.01) * 20}% ${30 + Math.cos(frame * 0.01) * 10}%, rgba(255, 200, 150, 0.12) 0%, transparent 60%)`,
          mixBlendMode: 'screen',
          zIndex: 15,
        }}
      />

      {/* Memorial Dates Overlay - Starts at 2s, stays for 8s */}
      <Sequence from={60} durationInFrames={240}>
        <MysticalMemorialText 
          text="2017.10 ~ 2026.04.30(故)" 
          duration={240} 
        />
      </Sequence>

      {/* Dynamic Additional Texts */}
      {additionalTexts.map((item, index) => (
        <Sequence 
          key={`extra-${index}`} 
          from={item.startFrame} 
          durationInFrames={item.durationInFrames}
        >
          <MysticalMemorialText 
            text={item.text} 
            duration={item.durationInFrames} 
          />
        </Sequence>
      ))}

      {/* Premium Typography Overlay */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '160px', 
          opacity: globalOpacity,
          zIndex: 5000,
        }}
      >
        <div style={{
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '84px',
            margin: 0,
            fontFamily: '"Mochiy Pop One", sans-serif',
            letterSpacing: '10px',
            color: '#FFFFFF',
            /* Combine sharp edge + mystical outer glow */
            textShadow: `
              3px 3px 6px rgba(0,0,0,0.8),
              0 0 20px rgba(173, 216, 230, 0.8),
              0 0 40px rgba(173, 216, 230, 0.4)
            `,
            filter: 'none', // Critical: removal of complex filter ensures rendering stability
          }}>
            {title}
          </h1>
          <div style={{
            height: '1px', 
            width: '260px',
            background: 'linear-gradient(to right, transparent, rgba(173, 216, 230, 0.8), transparent)',
            margin: '25px auto',
            boxShadow: '0 0 10px rgba(173, 216, 230, 0.5)',
          }} />
          <p style={{
            fontSize: '34px',
            margin: 0,
            fontFamily: '"Yu Gothic", sans-serif',
            color: '#F0F8FF',
            letterSpacing: '4px',
            fontWeight: 500,
            textShadow: `
              2px 2px 4px rgba(0, 0, 0, 0.8),
              0 0 15px rgba(173, 216, 230, 0.6)
            `,
          }}>
            {message}
          </p>
        </div>
      </AbsoluteFill>

      {/* Deep Vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.7) 100%)',
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  );
};


