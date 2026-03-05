import type React from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  OffthreadVideo,
  staticFile,
  interpolate,
  useVideoConfig,
} from 'remotion';
import { LensFlare } from '../../components/effects/LensFlare';
import { ImpactEffectTime as ImpactEffect } from './ImpactEffectTime';
import { useBeatValue } from './utils/beat-sync';
import { CinematicBorder } from './CinematicBorder';

const OPENING_VIDEO = staticFile('assets/backgrounds/nobvflare.mp4');

// DIGITAL GLITCH TYPEWRITER Component
const DigitalTypewriter: React.FC<{
  text: string;
  fontSize: number;
  delay: number; // In frames
  duration: number; // In frames
  color?: string;
  yOffset: number;
}> = ({ text, fontSize, delay, duration, color = '#d000ff', yOffset }) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;

  const progress = Math.min(1, (frame - delay) / duration);
  const charCount = Math.floor(text.length * progress);
  const visibleText = text.substring(0, charCount);

  // Glitch effect for the current character
  const isGlitching = progress < 1 && charCount < text.length;
  const glitchChars = '01!@#$%^&*()_+<>{}[]';
  const glitchChar = isGlitching
    ? glitchChars[Math.floor(random(frame) * glitchChars.length)]
    : '';

  return (
    <div
      style={{
        position: 'absolute',
        top: `calc(50% + ${yOffset}px)`,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize,
        fontWeight: 900,
        color: '#fff',
        textShadow: `0 0 15px ${color}, 0 0 30px ${color}88`,
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {visibleText}
      {isGlitching && (
        <span style={{ opacity: 0.8, color: '#e088ff' }}>{glitchChar}</span>
      )}
      {/* Digital cursor */}
      {(progress < 1 || Math.floor(frame / 5) % 2 === 0) && (
        <div
          style={{
            width: 15,
            height: fontSize * 0.8,
            background: color,
            marginLeft: 8,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      )}
    </div>
  );
};

export const OpeningTitleTime: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scale = width / 1080;
  const { pulse, beatIndex } = useBeatValue(180);

  // Alternative BPM Expression: Rhythmic Color Aberration Glitch
  const glitchStr = 0;
  const glitchOffset = 0;

  // Timing Constants
  const transitionFrame = 180; // 6 seconds (White flash timing)

  // BACKGROUND WIGGLE & FIXED ZOOM
  // Fixed zoom to cover edges (original source might be small)
  const videoScale = 1.5;

  // Wiggle (shaking) - Constant subtle shake + big punch at explosion
  const baseWiggle = 5 * scale;
  const explosionWiggle = interpolate(
    frame,
    [transitionFrame, transitionFrame + 5, transitionFrame + 40],
    [0, 35 * scale, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );
  const wiggleIntensity = baseWiggle + explosionWiggle;

  const wiggleX = (random(`wiggle-x-${frame}`) - 0.5) * wiggleIntensity;
  const wiggleY = (random(`wiggle-y-${frame}`) - 0.5) * wiggleIntensity;

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        overflow: 'hidden',
        filter:
          glitchStr > 0
            ? `drop-shadow(${glitchOffset}px 0 rgba(255,0,0,0.5)) drop-shadow(${-glitchOffset}px 0 rgba(0,0,255,0.5))`
            : 'none',
      }}
    >
      {/* BACKGROUND VIDEO */}
      <AbsoluteFill
        style={{
          zIndex: 0,
          transform: `scale(${videoScale}) translate(${wiggleX}px, ${wiggleY}px)`,
        }}
      >
        <OffthreadVideo
          src={OPENING_VIDEO}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.2) contrast(1.1) saturate(1.1)',
          }}
          muted
        />
        {/* Overlay to ensure text readability - Made much lighter */}
        <AbsoluteFill
          style={{
            background: 'rgba(0,0,0,0.15)',
            mixBlendMode: 'multiply',
          }}
        />
      </AbsoluteFill>

      {/* Impact Flash & Wiggle Logic */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
        {beatIndex >= 4 && beatIndex % 4 === 0 && pulse > 0.6 && (
          <ImpactEffect color="#ffffff" intensity="normal" />
        )}
        {/* 6秒時点のアクセントフラッシュ */}
        {frame >= transitionFrame && frame < transitionFrame + 20 && (
          <ImpactEffect color="#ffffff" intensity="high" />
        )}
      </AbsoluteFill>

      {/* TYPEWRITER PHASE (Stay visible throughout) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 50,
        }}
      >
        <DigitalTypewriter
          text="J.O.L"
          fontSize={260 * scale}
          delay={0}
          duration={30}
          yOffset={-380 * scale}
        />
        <DigitalTypewriter
          text="2026年2月度"
          fontSize={130 * scale}
          delay={30}
          duration={30}
          yOffset={-120 * scale}
        />
        <DigitalTypewriter
          text="月間配信時間"
          fontSize={130 * scale}
          delay={60}
          duration={30}
          yOffset={60 * scale}
        />
        <DigitalTypewriter
          text="ランキング"
          fontSize={160 * scale}
          delay={90}
          duration={30}
          yOffset={250 * scale}
        />
        <DigitalTypewriter
          text="結果発表!"
          fontSize={160 * scale}
          delay={120}
          duration={30}
          yOffset={440 * scale}
        />
      </div>

      {/* LENS FLARE / GLOW */}
      <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none' }}>
        <LensFlare
          opacity={pulse * 0.02}
          scale={1.1 * scale}
          color="#d000ff"
          intensity={0.8}
        />
      </AbsoluteFill>

      {/* CINEMATIC BORDER (Always on top) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 80,
        }}
      >
        <CinematicBorder color="#d000ff" glowColor="rgba(208, 0, 255, 0.5)" />
      </div>
    </AbsoluteFill>
  );
};
