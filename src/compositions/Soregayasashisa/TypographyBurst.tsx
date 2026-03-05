import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';

interface TypographyBurstProps {
  text: string;
  durationInFrames: number;
}

export const TypographyBurst: React.FC<TypographyBurstProps> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // 1. スラッシュ帯のアニメーション (中央を斬るような動き)
  // 左下から右上へ高速で移動
  const slashProgress = interpolate(
    frame,
    [0, durationInFrames * 0.4, durationInFrames * 0.8],
    [-150, 0, 150],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  // 2. 文字のズームとフェード
  const textScale = interpolate(frame, [0, durationInFrames], [0.8, 1.5], {
    easing: Easing.out(Easing.quad),
  });
  const opacity = interpolate(
    frame,
    [0, 5, durationInFrames - 5, durationInFrames],
    [0, 1, 1, 0],
  );

  // 3. ホワイトアウトの閃光
  const flashOpacity = interpolate(
    frame,
    [durationInFrames * 0.5, durationInFrames * 0.7, durationInFrames],
    [0, 1, 0],
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden', zIndex: 500 }}>
      {/* 巨大な黒い斜めの帯 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300%',
          height: '400px',
          backgroundColor: '#000',
          transform: `translate(-50%, -50%) rotate(-15deg) translateY(${slashProgress}%)`,
          boxShadow: '0 0 100px rgba(155, 93, 229, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '4px solid #9b5de5',
          borderBottom: '4px solid #9b5de5',
        }}
      >
        {/* 帯の中のテキスト */}
        <div
          style={{
            color: 'white',
            fontFamily: '"M PLUS Rounded 1c", sans-serif',
            fontSize: '120px',
            fontWeight: 900,
            letterSpacing: '20px',
            transform: `scale(${textScale})`,
            opacity,
            whiteSpace: 'nowrap',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          }}
        >
          {text}
        </div>
      </div>

      {/* 閃光エフェクト */}
      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
