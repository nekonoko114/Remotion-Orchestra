import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const SpeedSlash: React.FC = () => {
  const frame = useCurrentFrame();
  // const { fps } = useVideoConfig(); // Unused

  // Loop the slash every 2 seconds (approx 60 frames)
  const durationInFrames = 60;
  const slashDuration = 15; // 0.4s-ish (fast!)

  // Create a looping frame counter
  const loopFrame = frame % durationInFrames;

  // Animation progress (0 to 1) during the slash active time
  // Delay 0.1s (~3 frames)
  const delay = 3;

  const progress = interpolate(loopFrame - delay, [0, slashDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.cubic, // Matches "power3.in" roughly
  });

  // Map progress to X position (-150% -> 150%)
  const xPercent = interpolate(progress, [0, 1], [-150, 150]);

  // Opacity fades out at the very end
  const opacity = interpolate(progress, [0.8, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Only render when active in the loop
  if (loopFrame < delay || loopFrame > delay + slashDuration + 10) return null;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* ▼ これが紫の帯！ ▼ */}
      <div
        style={{
          position: 'absolute',
          width: '200%', // 画面より長く！
          height: '100px', // 帯の太さ
          background:
            'linear-gradient(90deg, transparent, #A020F0, #FFFFFF, #A020F0, transparent)', // 発光する紫のグラデーション
          top: '60%', // 出現する高さ
          left: '-50%', // 初期位置調整
          transform: `translateX(${xPercent}%) rotate(-20deg) skewX(-30deg)`, // 斜めに歪ませる！
          filter: 'blur(10px) contrast(1.5)', // スピード感のあるブラー
          boxShadow: '0 0 20px #A020F0', // 強い発光
          opacity: opacity,
        }}
      />
    </AbsoluteFill>
  );
};
