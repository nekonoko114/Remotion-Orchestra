import React, { useMemo } from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

interface MorphingTitleProps {
  text: string;
  fontSize?: number;
  className?: string;
  style?: React.CSSProperties;
  delayPerChar?: number; // 文字ごとの時差
}

/**
 * プレミアムな「スターダスト・スタッガー」タイトル演出
 * 一文字ずつ光の粒子が収束するように現れ、高級感のある光沢が横切る
 */
export const MorphingTitle: React.FC<MorphingTitleProps> = ({
  text,
  fontSize = 150,
  className,
  style,
  delayPerChar = 1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = useMemo(() => text.split(''), [text]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {chars.map((char, i) => {
          // 文字ごとのアニメーション進捗
          const spr = spring({
            frame: frame - i * delayPerChar,
            fps,
            config: { damping: 10, stiffness: 60, mass: 0.5 },
          });

          // 1. 不透明度
          const opacity = interpolate(spr, [0, 0.6], [0, 1]);
          
          // 2. スケール（少し小さめから元のサイズへ）
          const scale = interpolate(spr, [0, 1], [0.85, 1], {
            easing: Easing.out(Easing.back(1.2)),
          });

          // 3. 垂直移動（フワッと浮き上がる）
          const translateY = interpolate(spr, [0, 1], [25, 0], {
            easing: Easing.out(Easing.cubic),
          });

          // 4. シネマティックなブラー
          const blur = interpolate(spr, [0, 0.8], [25, 0], {
            extrapolateRight: 'clamp',
          });

          // 5. グリーム（閃光）のアニメーション - 文字が定着した後に走る
          const glintProgress = interpolate(frame - 30 - i * 0.5, [0, 40], [-100, 200], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <span
              key={i}
              className={className}
              style={{
                display: 'inline-block',
                fontSize,
                fontWeight: style?.fontWeight || 900,
                fontFamily: style?.fontFamily || 'inherit',
                opacity,
                // ブレ・点滅対策: filterの最適化
                filter: blur > 0.1 ? `blur(${blur}px)` : 'none',
                transform: `scale(${scale}) translateY(${translateY}px)`,
                position: 'relative',
                whiteSpace: 'pre',
                color: style?.color || 'white',
                // パフォーマンス向上
                backfaceVisibility: 'hidden',
                willChange: 'transform, opacity',
              }}
            >
              {char}
              
              {/* グリーム（煌めき）エフェクトのオーバーレイ */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 55%, transparent 70%)`,
                backgroundSize: '200% 100%',
                backgroundPosition: `${glintProgress}% 0`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                pointerEvents: 'none',
                opacity: interpolate(spr, [0.8, 1], [0, 0.4]),
                mixBlendMode: 'plus-lighter',
              }}>
                {char}
              </div>
            </span>
          );
        })}
      </div>
    </div>
  );
};
