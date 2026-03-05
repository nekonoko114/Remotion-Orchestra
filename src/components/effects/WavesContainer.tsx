import type React from 'react';
import { useCurrentFrame } from 'remotion';

interface WavesContainerProps {
  children: React.ReactNode;
  baseFrequency?: number; // 波の細かさ (0.01 - 0.1 程度)
  numOctaves?: number; // 波の複雑さ
  speed?: number; // 波の速さ
  intensity?: number; // 歪みの強さ
}

/**
 * 映像を水面や炎のようにゆらゆらと歪ませる（Turbulence）エフェクト
 */
export const WavesContainer: React.FC<WavesContainerProps> = ({
  children,
  baseFrequency = 0.02,
  numOctaves = 2,
  speed = 1,
  intensity = 20,
}) => {
  const frame = useCurrentFrame();
  // Calculate animated frequency
  const animFreq =
    baseFrequency + Math.sin(frame * 0.05 * speed) * (baseFrequency * 0.1);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-label="Waves filter definition"
      >
        <title>Waves Filter</title>
        <defs>
          <filter id="waves-filter">
            {/* 乱数を生成して歪ませる */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${animFreq} ${animFreq * 1.5}`}
              numOctaves={numOctaves}
              seed={1}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={intensity}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          filter: 'url(#waves-filter)',
          width: '100%',
          height: '100%',
          // 歪みで端が切れないように少しだけ大きくする
          transform: 'scale(1.05)',
          willChange: 'filter',
        }}
      >
        {children}
      </div>
    </div>
  );
};
