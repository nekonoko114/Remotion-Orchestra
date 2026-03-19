import React from 'react';
import { AbsoluteFill, useVideoConfig, spring, random, staticFile } from 'remotion';
import {
  KaleidoscopeBackground,
  MirrorLiver,
  SvgDefs,
  KineticText,
} from './BattleSharedComponents';

export interface MirrorLiverEffectProps {
  imageSrc: string;
  name: string;
  frame: number;
  duration: number;
  themeColor: string;
  glowColor: string;
  useGlitch?: boolean;
  useMirror?: boolean;
  useKaleidoscope?: boolean;
  isCircle?: boolean;
  bpm?: number;
  disableExitZoom?: boolean;
}

export const MirrorLiverEffect: React.FC<MirrorLiverEffectProps> = ({
  imageSrc,
  name,
  frame,
  duration,
  themeColor,
  glowColor,
  useGlitch = true,
  useMirror = true,
  useKaleidoscope = true,
  isCircle = false,
  bpm,
  disableExitZoom = false,
}) => {
  const { fps } = useVideoConfig();

  const flash = Math.max(0, 1 - frame / 15);
  const bounceFrames = bpm ? (60 / bpm) * fps : 30; // 12.5 frames at 144 BPM
  const bounceIntensity = Math.abs(Math.sin((frame - 10) / (bounceFrames / Math.PI))) * Math.max(0, 1 - (frame - 10) / 30) * 100;
  const nameGlitchOffset = useGlitch ? (Math.max(0, 1 - (frame - 30) / 20) * (random(frame) - 0.5) * 40) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {useKaleidoscope !== false && <KaleidoscopeBackground imageSrc={staticFile(imageSrc)} frame={frame} opacity={0.4} />}
      
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${bounceIntensity}px)` }}>
          <MirrorLiver 
            frame={frame} 
            imageSrc={staticFile(imageSrc)} 
            color={themeColor} 
            zoomProgress={disableExitZoom ? 0 : spring({
              frame: frame - (duration - 10),
              fps,
              config: { stiffness: 200, damping: 20 }
            })}
            enabled={useMirror}
            isCircle={isCircle}
          />
        </div>
        <KineticText
          text={name}
          frame={frame}
          fps={fps}
          startFrame={20}
          fontSize={120}
          color="#FFD700"
          glowColor={glowColor}
          style={{ 
            marginTop: 40, 
            WebkitTextStroke: '4px #500', 
            letterSpacing: 5,
            transform: `scale(${spring({ frame: frame - 10, fps, config: { stiffness: 400 } })}) translateX(${nameGlitchOffset}px)`,
          }}
        />
      </AbsoluteFill>
      
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash, zIndex: 5 }} />}
    </AbsoluteFill>
  );
};
