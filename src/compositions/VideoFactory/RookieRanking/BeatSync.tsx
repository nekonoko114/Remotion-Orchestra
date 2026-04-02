import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';

/**
 * BPM 160 のビート同期用定数
 */
export const BPM = 160;
export const FPS = 60;
export const FRAMES_PER_BEAT = (FPS * 60) / BPM; // 約 22.5 フレーム

/**
 * ビートに合わせたアニメーション値を計算するフック
 */
export const useBeat = (bpm: number = BPM) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const beat = frame / ( (60/bpm) * fps );
  const beatIndex = Math.floor(beat);
  const beatProgress = beat % 1;

  // 1. 基本となるキックの減衰曲線
  const baseKick = Math.exp(-beatProgress * 4);

  // 2. その拍でキックを発生させるかのランダム判定（拍のインデックスをシードに）
  const kickActive = useMemo(() => {
    // 小節の頭 (4拍ごと) はリズム維持のため必ず発生させる
    if (beatIndex % 4 === 0) return 1;
    
    // それ以外は 70% の確率で発生させる (この値を下げるとより「まばら」になります)
    return Math.random() > 0.3 ? 1 : 0;
  }, [beatIndex]);

  const kickStrength = baseKick * kickActive;

  const barProgress = (beat / 4) % 1;
  const isBarEnd = barProgress > 0.9;

  const glitchAlpha = useMemo(() => {
    return Math.random() > 0.92 ? 1 : 0;
  }, [beatIndex]);

  return {
    beat,
    beatIndex,
    beatProgress,
    kickStrength,
    isBarEnd,
    glitchWeight: glitchAlpha * kickStrength,
  };
};

/**
 * 色収差 & グリッチオーバーレイ
 */
export const GlitchOverlay: React.FC<{ bpm?: number }> = ({ bpm = BPM }) => {
  const { kickStrength, glitchWeight } = useBeat(bpm);
  const shift = kickStrength * 15;
  
  if (glitchWeight < 0.1 && kickStrength < 0.3) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 0, 255, 0.1)',
        transform: `translate(${shift}px, 0)`,
        mixBlendMode: 'screen',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        transform: `translate(${-shift}px, 0)`,
        mixBlendMode: 'screen',
      }} />
      
      {glitchWeight > 0.5 && (
        <div style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          width: '100%',
          height: '40px',
          backgroundColor: 'rgba(255,255,255,0.4)',
          filter: 'blur(5px)',
          mixBlendMode: 'overlay',
        }} />
      )}
    </AbsoluteFill>
  );
};

/**
 * Screen Shake
 */
export const BeatShake: React.FC<{ children: React.ReactNode; bpm?: number }> = ({ children, bpm = BPM }) => {
  const { kickStrength } = useBeat(bpm);
  const intensity = kickStrength * 10;
  const x = (Math.random() - 0.5) * intensity;
  const y = (Math.random() - 0.5) * intensity;

  return (
    <div style={{ transform: `translate(${x}px, ${y}px)`, width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

/**
 * TikTokスタイルの「激しいズーム」トランジション
 * 離脱するシーンがカメラに激突するように巨大化し、次が奥から飛び出す
 */
export const highIntensityZoom = (): TransitionPresentation<{}> => {
  return {
    component: ({ children, presentationProgress }: TransitionPresentationComponentProps<{}>) => {
      // Outgoing: 1 -> 8 (Huge scale)
      const scaleOut = interpolate(presentationProgress, [0, 1], [1, 8], { extrapolateRight: 'clamp' });
      const opacityOut = interpolate(presentationProgress, [0, 0.4], [1, 0]);
      const blurOut = interpolate(presentationProgress, [0, 1], [0, 40]);
      
      // Incoming: 0.1 -> 1 (Zoom in from distance)
      const scaleIn = interpolate(presentationProgress, [0.3, 1], [0.1, 1], { extrapolateLeft: 'clamp' });
      const opacityIn = interpolate(presentationProgress, [0.4, 0.8], [0, 1], { extrapolateLeft: 'clamp' });

      return (
        <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
          {/* Outgoing Scene */}
          <AbsoluteFill style={{
            transform: `scale(${scaleOut})`,
            opacity: opacityOut,
            filter: `blur(${blurOut}px) brightness(${1 + presentationProgress * 3})`,
          }}>
            {children}
          </AbsoluteFill>
          
          {/* Incoming Scene */}
          <AbsoluteFill style={{
            transform: `scale(${scaleIn})`,
            opacity: opacityIn,
          }}>
            {children}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    },
    props: {},
  };
};
