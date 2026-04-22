import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from 'remotion';
import React from 'react';

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 【安全策】フェード時間の定義
  const fadeDuration = 20;
  // durationInFrames が短い場合でもエラーにならないよう、interpolate の範囲を正規化
  const fadeOutStart = Math.max(fadeDuration + 1, durationInFrames - fadeDuration);

  // シーケンス全体のフェード
  const opacity = interpolate(
    frame,
    [0, fadeDuration, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  // ロゴの登場（frame-10がマイナスにならないようガード）
  const logoSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      
      {/* 全体に opacity を適用 */}
      <AbsoluteFill style={{ opacity }}>
        
        {/* ロゴ（右側に配置） */}
        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: '80px', paddingBottom: '80px' }}>
          <div
            style={{
              transform: `scale(${scale * logoSpring}) translateX(${interpolate(logoSpring, [0, 1], [100, 0])}px)`,
              width: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Img
              src={staticFile('jol-logo-800.png')}
              style={{
                width: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.5))',
              }}
            />
          </div>
        </AbsoluteFill>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
