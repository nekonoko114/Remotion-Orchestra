import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const PastelBackgroundSchema = z.object({
  baseColor: z.string().optional().default('#FFF0F5'),
  gradientStart: z.string().optional().default('#FFDEE9'),
  gradientEnd: z.string().optional().default('#B5FFFC'),
  orb1Color: z.string().optional().default('rgba(255, 182, 193, 0.8)'),
  orb2Color: z.string().optional().default('rgba(224, 187, 228, 0.8)'),
  orb3Color: z.string().optional().default('rgba(255, 255, 204, 0.7)'),
  orb4Color: z.string().optional().default('rgba(175, 238, 238, 0.6)'),
  speedMultiplier: z.number().optional().default(1),
});

type Props = z.infer<typeof PastelBackgroundSchema>;

export const PastelBackground: React.FC<Props> = ({
  baseColor = '#FFF0F5',
  gradientStart = '#FFDEE9',
  gradientEnd = '#B5FFFC',
  orb1Color = 'rgba(255, 182, 193, 0.8)',
  orb2Color = 'rgba(224, 187, 228, 0.8)',
  orb3Color = 'rgba(255, 255, 204, 0.7)',
  orb4Color = 'rgba(175, 238, 238, 0.6)',
  speedMultiplier = 1,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // ゆっくりと動く背景
  const time = frame * 0.01 * speedMultiplier;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: baseColor }}>
      {/* ベースのグラデーション */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        }}
      />
      
      {/* 液体のように混ざり合うオーブ */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: width * 0.8,
          height: width * 0.8,
          background: `radial-gradient(circle, ${orb1Color} 0%, rgba(255, 182, 193, 0) 70%)`,
          borderRadius: '50%',
          filter: 'blur(100px)',
          transform: `translate(-50%, -50%) translate(${Math.sin(time) * 100}px, ${Math.cos(time * 0.8) * 100}px) scale(${1 + Math.sin(time * 0.5) * 0.2})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '20%',
          width: width * 0.7,
          height: width * 0.7,
          background: `radial-gradient(circle, ${orb2Color} 0%, rgba(224, 187, 228, 0) 70%)`,
          borderRadius: '50%',
          filter: 'blur(80px)',
          transform: `translate(50%, 50%) translate(${Math.cos(time * 1.2) * 120}px, ${Math.sin(time * 0.9) * 120}px) scale(${1 + Math.cos(time * 0.6) * 0.2})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '10%',
          width: width * 0.6,
          height: width * 0.6,
          background: `radial-gradient(circle, ${orb3Color} 0%, rgba(255, 255, 204, 0) 70%)`,
          borderRadius: '50%',
          filter: 'blur(90px)',
          transform: `translate(-50%, 50%) translate(${Math.sin(time * 1.5) * 80}px, ${Math.cos(time * 1.1) * 80}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: width * 0.6,
          height: width * 0.6,
          background: `radial-gradient(circle, ${orb4Color} 0%, rgba(175, 238, 238, 0) 70%)`,
          borderRadius: '50%',
          filter: 'blur(120px)',
          transform: `translate(50%, -50%) translate(${Math.cos(time * 0.7) * 150}px, ${Math.sin(time * 1.3) * 150}px)`,
        }}
      />

      {/* グラスモーフィズム調のノイズまたは薄いオーバーレイレイヤー */}
      <AbsoluteFill
        style={{
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};
