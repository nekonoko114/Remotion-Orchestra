import type React from 'react';
import { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

const KATAKANA =
  'アカサタナハマヤラワいきしちにひみりうくすつぬふむるえけせてねへめれおこそとのほもろ012345789';

export const DigitalRain: React.FC<{
  color?: string;
  fontSize?: number;
}> = ({ color = '#0f0', fontSize = 20 }) => {
  const frame = useCurrentFrame();
  const columns = 40; // 列数

  // 各列の設定を生成
  const streams = useMemo(() => {
    return Array.from({ length: columns }).map((_, i) => {
      return {
        x: i * (100 / columns), // %
        speed: 10 + random(i) * 20, // 落下速度
        delay: random(i + 100) * -100, // 開始タイミング（負の値で最初から表示）
        length: 5 + Math.floor(random(i + 200) * 15), // 文字列の長さ
        chars: Array.from({ length: 20 }).map(
          (__, j) =>
            KATAKANA[Math.floor(random(i * 100 + j) * KATAKANA.length)],
        ),
      };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        fontFamily: 'monospace',
        overflow: 'hidden',
      }}
    >
      {streams.map((stream, i) => {
        // 現在の位置 (Y座標 %)
        // 時間経過で下に移動 (100%を超えたらループ)
        const yPos = ((frame * stream.speed + stream.delay) % 150) - 20;

        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Digital rain columns
            key={i}
            style={{
              position: 'absolute',
              left: `${stream.x}%`,
              top: `${yPos}%`,
              fontSize: fontSize,
              lineHeight: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              willChange: 'transform',
            }}
          >
            {stream.chars.slice(0, stream.length).map((char, j) => {
              // 先頭に近いほど明るい
              const isHead = j === stream.length - 1;
              const opacity = (j + 1) / stream.length;

              // 文字をランダムに変化させる（チラツキ）
              const displayChar =
                random(frame + i + j) > 0.95
                  ? KATAKANA[Math.floor(random(frame * j) * KATAKANA.length)]
                  : char;

              return (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: Digital rain characters
                  key={j}
                  style={{
                    color: isHead ? '#fff' : color,
                    opacity: opacity,
                    textShadow: isHead
                      ? `0 0 10px ${color}, 0 0 20px #fff`
                      : 'none',
                    fontWeight: isHead ? 'bold' : 'normal',
                    transform: isHead ? 'scale(1.2)' : 'scale(1)',
                    willChange: 'transform, opacity',
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
          </div>
        );
      })}

      {/* Vignette Overlay */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle, transparent 60%, black 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
