import React from 'react';
import { AbsoluteFill, interpolate, useVideoConfig } from 'remotion';

// 1. ハートバースト（巨大なハートが弾けて画面を覆い尽くす、空間ズームイン）
export const HeartBurstTransition: React.FC<{
  progress: number;
  color?: string;
}> = ({ progress, color = '#FFB6C1' }) => {
  // progress 0 -> 1 for the transition
  // At progress 0.5, the heart fully covers the screen
  const scale = interpolate(progress, [0, 0.5, 1], [0, 150, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  // カメラが奥に突き抜けるようなモーションを追加
  const translateZ = interpolate(progress, [0, 1], [0, 2000]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 100, transform: `perspective(1000px) translateZ(${translateZ}px)` }}>
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: color,
          transform: `scale(${scale}) rotate(45deg)`,
          opacity,
          borderRadius: '50% 50% 0 50%', // CSS Box Magic Heart Shape
          filter: `drop-shadow(0 0 ${interpolate(progress, [0, 0.5], [20, 100])}px ${color}) drop-shadow(0 0 50px white)`,
        }}
      />
      {/* 放射状のパーティクル */}
      {progress > 0.4 && progress < 0.8 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {new Array(12).fill(0).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const dist = interpolate(progress, [0.4, 0.8], [0, 1500]);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(${interpolate(progress, [0.4, 0.8], [1, 0])})`,
                  boxShadow: `0 0 20px ${color}`,
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// 2. リキッドスライム改 (Ripple Wipe effect)
export const LiquidWipeTransition: React.FC<{ progress: number }> = ({ progress }) => {
  const { height } = useVideoConfig();
  
  // progress 0 to 1
  const yPos = interpolate(progress, [0, 1], [height + 200, -height - 200]);
  // 波紋のように円が広がる
  const rippleScale = interpolate(progress, [0, 0.5, 1], [0, 50, 0]);
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -15" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <div style={{ width: '100%', height: '100%', filter: 'url(#goo)' }}>
        {/* メインの巨大な波 */}
        <div
          style={{
            position: 'absolute',
            top: yPos,
            left: '-20%',
            width: '140%',
            height: height * 1.5,
            background: 'linear-gradient(180deg, rgba(255,222,233,0.8) 0%, rgba(181,255,252,0.8) 50%, rgba(255,222,233,0.8) 100%)',
            borderRadius: '50% 40% 60% 30% / 30% 50% 50% 40%',
            transform: `rotate(${interpolate(progress, [0, 1], [-20, 20])}deg) scale(${interpolate(progress, [0, 0.5, 1], [1, 1.2, 1])})`,
          }}
        />
        
        {/* 滑らかな波紋（Ripple） */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 100,
            height: 100,
            backgroundColor: '#FFDEE9',
            borderRadius: '50%',
            transform: `translate(-50%, -50%) scale(${rippleScale})`,
            opacity: interpolate(progress, [0, 0.5, 1], [0, 1, 0]),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// 3. AIモーフ風のズーム＆ツイスト（Glass Twist）
export const GlassTwistTransition: React.FC<{ progress: number }> = ({ progress }) => {
  // 画面が中央に向かってねじれながら吸い込まれ、パッと弾ける
  const twist = interpolate(progress, [0, 0.5, 1], [0, 720, 1440]);
  const scale = interpolate(progress, [0, 0.45, 0.5, 0.55, 1], [1, 0, 50, 0, 1], { extrapolateRight: 'clamp' });
  const blur = interpolate(progress, [0, 0.5, 1], [0, 50, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100, justifyContent: 'center', alignItems: 'center' }}>
       {progress > 0 && progress < 1 && (
         <div
           style={{
             width: '200%',
             height: '200%',
             background: 'conic-gradient(from 0deg, #FFDEE9, #B5FFFC, #E0BBE4, #FFB6C1, #FFDEE9)',
             transform: `rotate(${twist}deg) scale(${scale})`,
             filter: `blur(${blur}px) contrast(1.5)`,
             opacity: interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
             mixBlendMode: 'screen'
           }}
         />
       )}
    </AbsoluteFill>
  );
};
