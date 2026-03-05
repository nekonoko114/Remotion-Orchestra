import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

interface GlobalEffectsProps {
  transitionFrames?: number[];
  audioPower?: number;
}

export const GlobalEffects: React.FC<GlobalEffectsProps> = ({
  transitionFrames = [],
  audioPower = 0,
}) => {
  const frame = useCurrentFrame();

  // 青春カラー：パステルブルーとグリーン
  const pastelBlue = 'rgba(162, 210, 255, 0.2)';
  const pastelGreen = 'rgba(185, 228, 201, 0.2)';

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 100,
        // 修正：全体へのfilter適用は非常に重いため削除
      }}
    >
      {/* 0. Seishun Gradient (Soft Atmosphere) */}
      <AbsoluteFill
        style={{
          zIndex: 0,
          background: `linear-gradient(135deg, ${pastelBlue} 0%, transparent 50%, ${pastelGreen} 100%)`,
          opacity: 0.4,
        }}
      />

      {/* 1. Soft Cinematic Vignette (Not Black, but Deep Greenish Blue) */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at center, transparent 60%, rgba(20, 40, 40, 0.3) 100%)',
          zIndex: 1,
        }}
      />

      {/* 2. Sunlight / Komorebi Effect (木漏れ日のような光の粒子) */}
      <AbsoluteFill
        style={{
          zIndex: 2,
          opacity: 0.2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '120%',
            height: '120%',
            background:
              'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(185, 228, 201, 0.3), transparent 60%)',
            transform: `translate(${Math.sin(frame * 0.005) * 50}px, ${Math.cos(frame * 0.005) * 30}px) scale(${1 + Math.sin(frame * 0.01) * 0.05})`,
            filter: 'blur(40px)',
          }}
        />
      </AbsoluteFill>

      {/* 3. Elegant Frame (Friendship Pastels) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '12px solid',
          borderImageSource: `linear-gradient(45deg, rgba(162, 210, 255, 0.3), rgba(185, 228, 201, 0.3))`,
          borderImageSlice: 1,
          boxSizing: 'border-box',
          zIndex: 4,
        }}
      />

      {/* 4. Elegant Transition Glows (Mixing Blue/Green) */}
      {transitionFrames.map((tFrame, i) => {
        const diff = frame - tFrame;
        if (diff < -15 || diff > 45) return null;

        const opacity = interpolate(
          diff,
          [-15, 0, 45],
          [0, 0.45, 0], // 少しだけ光を強く
          {
            easing: Easing.out(Easing.quad),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        );

        const scale = interpolate(diff, [-15, 45], [0.98, 1.15], {
          easing: Easing.out(Easing.ease),
        });

        // 交替で色を変えるか、ミックスする
        const glowColor =
          i % 2 === 0 ? 'rgba(162, 210, 255, 0.7)' : 'rgba(185, 228, 201, 0.7)';

        return (
          <AbsoluteFill
            key={`trans-${i}-${tFrame}`}
            style={{
              zIndex: 50,
              opacity,
              background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 80%)`,
              transform: `scale(${scale})`,
              mixBlendMode: 'screen',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
