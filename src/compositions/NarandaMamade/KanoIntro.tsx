import React from 'react';
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from 'remotion';

export const KanoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // アニメーションのタイミング設定
  const spr = spring({ frame, fps, config: { damping: 12 } });
  const starDraw = interpolate(frame, [0, 45], [1, 0], {
    extrapolateRight: 'clamp',
  });
  const textOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  const kTranslate = interpolate(spr, [0, 1], [-50, 0]);
  const nTranslate = interpolate(spr, [0, 1], [50, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        width="600"
        height="400"
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* KNロゴ部分 */}
        <g
          style={{
            transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
            transformOrigin: 'center',
          }}
        >
          {/* Kの文字 */}
          <path
            d="M150 100V300L220 200L150 100ZM220 200L280 100H320L240 200L320 300H280L220 200Z"
            fill="#4B0082" // 深い紫
            style={{
              opacity: textOpacity,
              transform: `translateX(${kTranslate}px)`,
            }}
          />

          {/* Nの文字 */}
          <path
            d="M380 300V100H420L480 220V100H520V300H480L420 180V300H380Z"
            fill="#4B0082"
            style={{
              opacity: textOpacity,
              transform: `translateX(${nTranslate}px)`,
            }}
          />

          {/* 中心の星（SVGパスアニメーション） */}
          <path
            d="M300 150L315 190L355 205L315 220L300 260L285 220L245 205L285 190L300 150Z"
            stroke="#C0C0C0" // 銀色
            strokeWidth="4"
            strokeDasharray="500"
            strokeDashoffset={starDraw * 500}
            fill={frame > 45 ? '#C0C0C0' : 'none'}
            style={{ transition: 'fill 0.5s ease-in-out' }}
          />
        </g>

        {/* 正式名称テキスト */}
        <text
          x="300"
          y="360"
          textAnchor="middle"
          fill="#4B0082"
          style={{
            fontFamily: 'sans-serif',
            fontSize: '32px',
            fontWeight: 'bold',
            letterSpacing: '8px',
            opacity: textOpacity,
          }}
        >
          KALEIDANOVA
        </text>
      </svg>
    </AbsoluteFill>
  );
};
