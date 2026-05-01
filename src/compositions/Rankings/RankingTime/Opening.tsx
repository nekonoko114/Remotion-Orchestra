import type React from 'react';
import {
  AbsoluteFill,
  random,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion';
import { TimeTunnel } from './TimeTunnel';
import { LensFlare } from '../../../components/effects/LensFlare';
import { ImpactEffectTime as ImpactEffect } from '../../../components/effects/ImpactEffectTime';
import { useBeatValue } from '../../../utils/beat-sync';
import { CinematicBorder } from '../../../components/UI/CinematicBorder';
import { GalaxyClock } from './GalaxyClock';

// ローカルインストールされたフォント名（正式名称）
const cinzelFont = "'Cinzel', serif";
const shipporiFont = "'Shippori Mincho', serif";
const orbitronFont = "'Orbitron', sans-serif";

interface StaggeredTitleProps {
  text: string;
  fontSize: number;
  delay: number;
  duration: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: string;
  yOffset: number;
}

const StaggeredTitle: React.FC<StaggeredTitleProps> = ({
  text,
  fontSize,
  delay,
  duration,
  color = '#ffffff',
  fontFamily = cinzelFont,
  fontWeight = 900,
  letterSpacing = 'normal',
  yOffset,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split('');

  return (
    <div
      style={{
        position: 'absolute',
        top: `calc(50% + ${yOffset}px)`,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 100,
      }}
    >
      {chars.map((char, i) => {
        const charDelay = delay + (i * (duration / chars.length));
        const spr = spring({
          frame: frame - charDelay,
          fps,
          config: { damping: 12, stiffness: 100, mass: 0.5 },
        });

        const opacity = interpolate(spr, [0, 1], [0, 1]);
        const scale = interpolate(spr, [0, 1], [3, 1]);
        const blur = interpolate(spr, [0, 0.8], [30, 0]);
        const translateY = interpolate(spr, [0, 1], [50, 0]);

        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontSize,
              fontWeight,
              color,
              letterSpacing,
              opacity,
              display: 'inline-block',
              transform: `scale(${scale}) translateY(${translateY}px)`,
              // ブレ・点滅対策: filterとtextShadowの最適化
              filter: blur > 0.2 ? `blur(${blur}px)` : 'none',
              textShadow: `0 0 10px ${color}, 0 0 20px ${color}aa, 0 0 40px ${color}44`,
              whiteSpace: 'pre',
              // パフォーマンスと安定性の向上
              backfaceVisibility: 'hidden',
              willChange: 'transform, opacity',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const Opening: React.FC<{
  title2?: string;
  title3?: string;
  date?: string;
  themeColor?: string;
}> = ({
  title2 = '配信時間',
  title3 = 'ランキング',
  date = '2026年3月',
  themeColor = '#d000ff',
}) => {
  const frame = useCurrentFrame();
  const { width, durationInFrames } = useVideoConfig();
  const scale = width / 1080;
  const { pulse, beatIndex } = useBeatValue(180);

  // カメラワーク: 絶え間ない前進（ズームイン）
  const cameraZoom = interpolate(frame, [0, durationInFrames], [0.95, 1.2], {
    easing: Easing.bezier(0.1, 0, 0.9, 1),
  });

  // 手ぶれエフェクト
  const shakeX = (random(`shake-x-${frame}`) - 0.5) * 4 * scale;
  const shakeY = (random(`shake-y-${frame}`) - 0.5) * 4 * scale;

  // ラストのホワイトアウト (音楽の盛り上がりの頂点)
  const whiteOut = interpolate(frame, [durationInFrames - 15, durationInFrames - 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 1. Backdrop: Giant Ghostly Clock */}
      <AbsoluteFill style={{ 
        transform: `scale(${cameraZoom * 2.5})`, // 巨大な幻影
        opacity: interpolate(frame, [0, 60], [0, 0.15]), // フィルタを消す代わりに不透明度を下げて幻想的に
        zIndex: 5,
      }}>
        <GalaxyClock 
          rank={12} 
          themeColor={themeColor} 
          entrance={1} 
          variant="subtle" 
        />
      </AbsoluteFill>

      {/* 2. Space Nebula Overlay for better blending */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle, transparent 20%, ${themeColor}11 100%)`,
        zIndex: 10,
        mixBlendMode: 'screen',
      }} />

      {/* 3. Background Scene with Zoom (Time Tunnel) */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom}) translate(${shakeX}px, ${shakeY}px)`,
          zIndex: 15,
        }}
      >
        <TimeTunnel />
      </AbsoluteFill>

      {/* 4. Overlays */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
        {beatIndex >= 4 && beatIndex % 4 === 0 && pulse > 0.6 && (
          <ImpactEffect color="#ffffff" intensity="normal" />
        )}
      </AbsoluteFill>

      {/* 5. Titles with Stagger Reveal */}
      <AbsoluteFill style={{ zIndex: 50 }}>
        <StaggeredTitle 
          text="J.O.L" 
          fontSize={320 * scale} 
          delay={10} 
          duration={20} 
          yOffset={-400 * scale} 
          color="#fff" 
          letterSpacing="20px"
        />
        <StaggeredTitle 
          text={date} 
          fontSize={80 * scale} 
          delay={40} 
          duration={20} 
          yOffset={-120 * scale} 
          color={themeColor} 
          fontFamily={shipporiFont}
          letterSpacing="10px"
        />
        <StaggeredTitle 
          text={title2} 
          fontSize={110 * scale} 
          delay={70} 
          duration={25} 
          yOffset={100 * scale} 
          color="#fff" 
          fontFamily={shipporiFont}
          letterSpacing="5px"
        />
        <StaggeredTitle 
          text={title3} 
          fontSize={110 * scale} 
          delay={100} 
          duration={25} 
          yOffset={250 * scale} 
          color="#fff" 
          fontFamily={shipporiFont}
          letterSpacing="5px"
        />
        <StaggeredTitle 
          text="RESULTS" 
          fontSize={160 * scale} 
          delay={150} 
          duration={30} 
          yOffset={500 * scale} 
          color={themeColor} 
          fontFamily={orbitronFont}
          fontWeight={900}
          letterSpacing="15px"
        />
      </AbsoluteFill>

      {/* 6. Effects layers */}
      <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none' }}>
        <LensFlare opacity={pulse * 0.05} scale={1.2 * scale} color={themeColor} intensity={1} />
      </AbsoluteFill>

      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 80 }}>
        <CinematicBorder color={themeColor} glowColor={`${themeColor}80`} />
      </div>

      {/* 7. Final White-out Flash */}
      {whiteOut > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: 'white',
            opacity: whiteOut,
            zIndex: 1000,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
