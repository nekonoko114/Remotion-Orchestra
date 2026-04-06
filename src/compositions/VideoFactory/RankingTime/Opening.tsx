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
import { TimeTunnel } from './TimeTunnel';
import { LensFlare } from '../../../components/effects/LensFlare';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { useBeatValue } from '../utils/beat-sync';
import { CinematicBorder } from '../CinematicBorder';

const OPENING_VIDEO = staticFile('assets/pixabay/videos/pixabay_clock_time_countdown_red_black_6066.mp4');

const DigitalTypewriter: React.FC<{
  text: string;
  fontSize: number;
  delay: number;
  duration: number;
  color?: string;
  yOffset: number;
}> = ({ text, fontSize, delay, duration, color = '#d000ff', yOffset }) => {
  const frame = useCurrentFrame();
  const lines = text.split('\n');
  const totalLength = text.length;

  return (
    <div
      style={{
        position: 'absolute',
        top: `calc(50% + ${yOffset}px)`,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: fontSize * 0.2, // Increased gap for clarity
        zIndex: 100,
      }}
    >
      {lines.map((line, segmentIdx) => {
        const charStartIdx = lines.slice(0, segmentIdx).join('\n').length + (segmentIdx > 0 ? 1 : 0);
        const segmentProgress = Math.min(1, Math.max(0, (frame - delay - (charStartIdx / totalLength) * duration) / (line.length / totalLength * duration)));
        const charCount = Math.floor(line.length * segmentProgress);
        const visibleText = line.substring(0, charCount);

        const isGlitching = segmentProgress < 1 && charCount < line.length;
        const glitchChars = '01!@#$%^&*()_+<>{}[]';
        const glitchChar = isGlitching
          ? glitchChars[Math.floor(random(frame + segmentIdx) * glitchChars.length)]
          : '';

        if (visibleText.length === 0 && !isGlitching && frame < delay + (charStartIdx / totalLength) * duration) return null;

        return (
          <div
            key={segmentIdx}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize,
              fontWeight: 900,
              color: '#fff',
              textShadow: `0 0 15px ${color}, 0 0 30px ${color}88`,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              lineHeight: 1.1, // Added a bit more line height
            }}
          >
            {visibleText}
            {isGlitching && (
              <span style={{ opacity: 0.8, color: '#e088ff' }}>{glitchChar}</span>
            )}
            {segmentIdx === lines.filter(l => l.length > 0).length - 1 && (segmentProgress < 1 || Math.floor(frame / 5) % 2 === 0) && (
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
      })}
    </div>
  );
};

export const Opening: React.FC<{
  title2?: string;
  title3?: string;
  date?: string;
  themeColor?: string;
}> = ({
  title2 = '配信時間',
  title3 = 'ランキング',
  date = '2026年3月',
  themeColor = '#d000ff',
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scale = width / 1080;
  const { pulse, beatIndex } = useBeatValue(180);

  const transitionFrame = 180;
  const videoScale = 1.1;

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
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      {/* 1. Time Tunnel Core */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <TimeTunnel />
      </AbsoluteFill>

      {/* 2. Flare Video Layered with Mix Mode */}
      <AbsoluteFill
        style={{
          zIndex: 5,
          transform: `scale(${videoScale}) translate(${wiggleX}px, ${wiggleY}px)`,
          mixBlendMode: 'screen',
        }}
      >
        <OffthreadVideo
          src={OPENING_VIDEO}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          muted
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
        {beatIndex >= 4 && beatIndex % 4 === 0 && pulse > 0.6 && (
          <ImpactEffect color="#ffffff" intensity="normal" />
        )}
        {frame >= transitionFrame && frame < transitionFrame + 20 && (
          <ImpactEffect color="#ffffff" intensity="high" />
        )}
      </AbsoluteFill>

      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 50 }}>
        <DigitalTypewriter text="J.O.L" fontSize={260 * scale} delay={0} duration={30} yOffset={-450 * scale} color={themeColor} />
        <DigitalTypewriter text={date} fontSize={120 * scale} delay={45} duration={30} yOffset={-200 * scale} color={themeColor} />
        <DigitalTypewriter text={title2} fontSize={140 * scale} delay={90} duration={30} yOffset={0 * scale} color={themeColor} />
        <DigitalTypewriter text={title3} fontSize={140 * scale} delay={140} duration={30} yOffset={200 * scale} color={themeColor} />
        <DigitalTypewriter text="結果発表!" fontSize={160 * scale} delay={190} duration={30} yOffset={450 * scale} color={themeColor} />
      </div>

      <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none' }}>
        <LensFlare opacity={pulse * 0.02} scale={1.1 * scale} color={themeColor} intensity={0.8} />
      </AbsoluteFill>

      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 80 }}>
        <CinematicBorder color={themeColor} glowColor={`${themeColor}80`} />
      </div>
    </AbsoluteFill>
  );
};
