import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { ROYAL_THEME } from '../RankingRoyal/theme';

interface LuxuryGoldTextProps {
  text: string;
  fontSize: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * シャンパンゴールドの金属的な光沢と、
 * 光が表面を走るシマー（Shimmer）エフェクトを持つ高級感のあるテキスト
 */
export const LuxuryGoldText: React.FC<LuxuryGoldTextProps> = ({
  text,
  fontSize,
  delay = 0,
  className = '',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);

  // ゆったりとした登場
  const opacity = interpolate(t, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(t, [0, 40], [0.95, 1], {
    easing: Easing.out(Easing.poly(3)),
    extrapolateRight: 'clamp',
  });

  // テキスト表面を光が走るアニメーション (-100% から 200% へ移動)
  const shimmerPosition = interpolate(t, [0, 60], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        fontSize,
        opacity,
        transform: `scale(${scale})`,
        fontFamily: ROYAL_THEME.fonts.primary,
        fontWeight: '900',
        lineHeight: 1.2,
        ...style,
      }}
    >
      {/* ドロップシャドウ専用のラッパー（影が文字の透過部分に干渉しないように分離） */}
      <div style={{ filter: `drop-shadow(0px 8px 16px rgba(0,0,0,0.9)) drop-shadow(0px 0px 40px ${ROYAL_THEME.colors.goldGlow})` }}>
        <span
          style={{
            background: ROYAL_THEME.gradients.goldLinear,
            backgroundSize: '200% auto',
            backgroundPosition: `${shimmerPosition / 2}% center`, 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            display: 'inline-block',
            WebkitTextStroke: `2px ${ROYAL_THEME.colors.champagneGoldDark}`,
          }}
        >
          {text}
          
          {/* 光沢（シマー）のオーバーレイレイヤー：mixBlendMode: 'screen'にすることで明るさだけを加算 */}
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 70%, transparent 100%)`,
              backgroundSize: '250% 100%',
              backgroundPosition: `${shimmerPosition}% 0`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              pointerEvents: 'none',
              mixBlendMode: 'screen', // overlayだと暗くなる原因になるためscreenに変更
            }}
          >
            {text}
          </span>
        </span>
      </div>
    </div>
  );
};
