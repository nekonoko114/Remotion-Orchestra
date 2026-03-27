import type React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

interface GlitchEffectProps {
  children: React.ReactNode;
  intensity?: number; // グリッチの激しさ
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  intensity = 10,
}) => {
  const frame = useCurrentFrame();

  // フレームごとに乱数を生成（seedをframeにすることで再現性を保つ）
  const shakeX = random(`x-${frame}`) * intensity - intensity / 2;
  const shakeY = random(`y-${frame}`) * intensity - intensity / 2;

  // 色収差（RGBズレ）用のオフセット
  const rgbOffset = random(`rgb-${frame}`) * (intensity / 2);

  // 激しいときだけ表示する（点滅効果）
  const opacity = random(`op-${frame}`) > 0.1 ? 1 : 0.8;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {/* Red Channel */}
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX + rgbOffset}px, ${shakeY}px)`,
          opacity: 0.8,
          mixBlendMode: 'screen',
        }}
      >
        <div style={{ filter: 'drop-shadow(-2px 0 red)' }}>{children}</div>
      </AbsoluteFill>

      {/* Blue Channel */}
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX - rgbOffset}px, ${shakeY}px)`,
          opacity: 0.8,
          mixBlendMode: 'screen',
        }}
      >
        <div style={{ filter: 'drop-shadow(2px 0 blue)' }}>{children}</div>
      </AbsoluteFill>

      {/* Main Content */}
      <AbsoluteFill
        style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, opacity }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
