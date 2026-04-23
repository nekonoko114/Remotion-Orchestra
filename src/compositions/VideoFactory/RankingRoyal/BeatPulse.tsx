import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { ROYAL_THEME } from './theme';

export const BeatPulse: React.FC<{ bpm: number }> = ({ bpm }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1拍のフレーム数
  const framesPerBeat = (fps * 60) / bpm;
  
  // 現在の拍内での進捗 (0 to 1)
  const beatProgress = (frame % framesPerBeat) / framesPerBeat;

  // 強弱をつけるための波形 (アタック速め、リリース遅め)
  const intensity = interpolate(
    beatProgress,
    [0, 0.1, 0.4, 1.0],
    [0.2, 1.0, 0.3, 0.0],
    { extrapolateRight: 'clamp' }
  );

  // 1. 全体のライティング（露出）の揺らぎ（極限まで強化）
  const brightness = 1 + (intensity * 0.35);
  const contrast = 1 + (intensity * 0.15);

  // 2. 画面端から迫るゴールドの閃光 (Vignette Glow)
  const vignetteOpacity = intensity * 0.02;
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100000 }}>
       {/* レイヤーA: 明るさ・コントラストを直接いじるフィルター */}
       <AbsoluteFill style={{
         backdropFilter: `brightness(${brightness}) contrast(${contrast})`,
       }} />

       {/* レイヤーB: 黄金の光を「焼き付ける」カラーフラッシュ */}
       <AbsoluteFill style={{
         backgroundColor: ROYAL_THEME.colors.champagneGold,
         opacity: intensity * 0.08, // 30%まで引き上げ
         mixBlendMode: 'screen', // 背景と馴染ませつつ輝かせる
       }} />

       {/* レイヤーC: 画面四隅からのゴールド・オーラの脈動 */}
       <div style={{
         position: 'absolute',
         top: 0, left: 0, right: 0, bottom: 0,
         background: `radial-gradient(circle, transparent 20%, ${ROYAL_THEME.colors.champagneGoldDark} 100%)`,
         opacity: vignetteOpacity * 0.7,
         mixBlendMode: 'plus-lighter',
       }} />

       {/* 拍の頭で一瞬走る水平方向の光の筋 */}
       <div style={{
         position: 'absolute',
         top: '50%',
         left: '50%',
         width: '200%',
         height: 100,
         background: `linear-gradient(to bottom, transparent, ${ROYAL_THEME.colors.champagneGoldLight}22, transparent)`,
         transform: `translate(-50%, -50%) scaleY(${intensity})`,
         opacity: intensity * 0.6,
         filter: 'blur(20px)',
         mixBlendMode: 'screen',
       }} />
    </AbsoluteFill>
  );
};
