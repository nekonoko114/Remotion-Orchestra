import type React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface PixelateContainerProps {
  children: React.ReactNode;
  pixelSize?: number; // 1以上の数値。大きいほどドットが粗くなる。
  animate?: boolean; // 徐々に解像度が上がるアニメーション
}

/**
 * 子要素をピクセルアート（ドット絵）風にするコンテナ
 */
export const PixelateContainer: React.FC<PixelateContainerProps> = ({
  children,
  pixelSize = 10,
  animate = false,
}) => {
  const frame = useCurrentFrame();

  // アニメーションする場合、フレームに応じてピクセルサイズを小さく（＝解像度を高く）する
  const currentPixelSize = animate
    ? interpolate(frame, [0, 45], [pixelSize, 1], { extrapolateRight: 'clamp' })
    : pixelSize;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        // CSSの image-rendering を使って、縮小してもボケないようにする
        imageRendering: 'pixelated',
        filter: `url(#pixelate-filter-${Math.round(currentPixelSize)})`,
      }}
    >
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-label="Pixelate filter"
      >
        <title>Pixelate Filter</title>
        <defs>
          <filter id={`pixelate-filter-${Math.round(currentPixelSize)}`}>
            {/* モザイク効果を作るSVGフィルターのテクニック */}
            <feFlood x="4" y="4" height="1" width="1" />
            <feComposite width={currentPixelSize} height={currentPixelSize} />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius={currentPixelSize / 2} />
          </filter>
        </defs>
      </svg>
      <div style={{ width: '100%', height: '100%' }}>{children}</div>
    </div>
  );
};
