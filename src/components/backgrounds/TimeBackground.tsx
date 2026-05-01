import React, { useMemo, useRef } from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
  Loop,
  Sequence,
} from 'remotion';
import { useBeatValue } from '../../utils/beat-sync';

const STAR_COUNT = 150;
const BPM = 160;

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  seed: number;
}

interface Props {
  overlayColor?: string;
  hideBackground?: boolean;
  hideBaseVideo?: boolean;
  bgVideoSrc?: string;
  noLoop?: boolean;
  startFrame?: number; // Starting frame in the composition
  videoStartFrom?: number; // Starting frame in the video source
}

export const TimeBackground: React.FC<Props> = ({
  overlayColor,
  hideBackground,
  hideBaseVideo = false,
  bgVideoSrc,
  noLoop = false,
  startFrame = 0,
  videoStartFrom = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const stars = useMemo(() => {
    const s: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      s.push({
        x: random(`star-x-${i}`) * width,
        y: random(`star-y-${i}`) * height,
        size: random(`star-s-${i}`) * 3 + 1,
        opacity: random(`star-o-${i}`) * 0.8 + 0.2,
        speed: random(`star-sp-${i}`) * 0.5 + 0.1,
        seed: i,
      });
    }
    return s;
  }, [width, height]);

  const { pulse } = useBeatValue(BPM);

  // Canvas drawing for stardust
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    stars.forEach((s) => {
      const floatY = (s.y + frame * s.speed) % height;
      const twinkle = Math.sin(frame * 0.05 + s.seed) * 0.3 + 0.7;
      
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        s.x, floatY, 0,
        s.x, floatY, s.size * 2
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity * twinkle})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.arc(s.x, floatY, s.size * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Drawing faint connecting lines for constellations
    ctx.globalAlpha = 0.03 + pulse * 0.02;
    ctx.strokeStyle = '#d000ff';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const s1 = stars[i];
      const s2 = stars[(i + 1) % 20];
      ctx.beginPath();
      ctx.moveTo(s1.x, (s1.y + frame * s1.speed) % height);
      ctx.lineTo(s2.x, (s2.y + frame * s2.speed) % height);
      ctx.stroke();
    }
  }, [frame, width, height, stars, pulse]);

  const backgroundVideo = bgVideoSrc;
  
  // Optimization: Don't render anything (especially canvas/nebula) during opening
  // where it's hidden behind the Opening/Tunnel anyway.
  if (frame < startFrame) {
    return null;
  }

  return (
    <AbsoluteFill>
      {!hideBaseVideo && backgroundVideo && (
        <AbsoluteFill style={{ opacity: 1.0 }}>
          {noLoop ? (
            <Sequence from={startFrame} layout="none" key={backgroundVideo}>
              <OffthreadVideo
                src={backgroundVideo}
                startFrom={videoStartFrom}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(1.0) contrast(1.1)',
                  transform: 'scale(1.08)',
                }}
                muted
              />
            </Sequence>
          ) : (
            <Loop key={backgroundVideo} durationInFrames={600}>
              <OffthreadVideo
                src={backgroundVideo}
                startFrom={videoStartFrom}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(1.0) contrast(1.1)',
                }}
                muted
              />
            </Loop>
          )}
        </AbsoluteFill>
      )}

      {/* Cosmic Nebula Glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% 40%, rgba(208, 0, 255, ${0.2 + pulse * 0.1}) 0%, transparent 60%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 70% 60%, rgba(0, 100, 255, ${0.15 + pulse * 0.05}) 0%, transparent 50%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%', zIndex: 5 }}
      />

      {/* Global Starfield Sparkle Map (Lightweight Overlay) */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 100px 150px, white, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 300px 450px, white, rgba(0,0,0,0))`,
          backgroundSize: '400px 400px',
          opacity: 0.2 + pulse * 0.1,
          zIndex: 6,
        }}
      />

      {overlayColor && (
        <AbsoluteFill
          style={{
            backgroundColor: overlayColor,
            opacity: 0.3,
            zIndex: 10,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
