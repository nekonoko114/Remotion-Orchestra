import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  random,
  Easing,
} from 'remotion';
import { NeonGlowText } from '../../../components/effects/NeonGlowText';
import { loadFont as loadOrbitron } from '@remotion/google-fonts/Orbitron';
import { loadFont as loadDelaGothic } from '@remotion/google-fonts/DelaGothicOne';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';
import { GlitchEffect } from '../../../components/effects/GlitchEffect';

const { fontFamily: orbitron } = loadOrbitron();
const { fontFamily: delaGothic } = loadDelaGothic();

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Staggered springs for each part
  const createSpring = (delay: number) => spring({
    frame: Math.max(0, frame - delay), // マイナスフレームの安全対策
    fps,
    config: { damping: 10, stiffness: 350, mass: 0.6 },
  });

  const spr1 = createSpring(0);   // J.O.L (最上段)
  const spr4 = createSpring(20);  // 団結No.1 (2段目)
  const spr3 = createSpring(45);  // ランキング (4段目)
  const spr5 = createSpring(60);  // 結果発表 (5段目)

  // 登場スタイルの定義（アニメーションのみに限定）
  const getEntryStyle = (spr: number, direction: 'top' | 'bottom' | 'center', baseScale: number = 1) => {
    const opacity = interpolate(spr, [0, 0.4], [0, 1]);
    const scale = interpolate(spr, [0, 1], [0.3 * baseScale, 1 * baseScale], { easing: Easing.out(Easing.back(1.5)) });
    let translate = 0;

    if (direction === 'top') {
      translate = interpolate(spr, [0, 1], [-100, 0]);
    } else if (direction === 'bottom') {
      translate = interpolate(spr, [0, 1], [50, 0]);
    }

    return {
      opacity,
      transform: `translateY(${translate}px) scale(${scale})`,
    };
  };

  // 各パートの登場インパクト計算
  const getImpact = (f: number, delay: number) => interpolate(Math.max(0, f - delay), [0, 5, 20], [0, 1, 0], { extrapolateRight: 'clamp' });
  
  const impact1 = getImpact(frame, 0);
  const impact4 = getImpact(frame, 20);
  const impact5 = getImpact(frame, 60);

  const masterImpact = Math.max(impact1, impact4, impact5);
  const masterShakeX = masterImpact * (random('oshakeX' + frame) - 0.5) * 10;
  const masterShakeY = masterImpact * (random('oshakeY' + frame) - 0.5) * 10;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        transform: `translate(${masterShakeX}px, ${masterShakeY}px) scale(${1 + masterImpact * 0.05})`,
      }}
    >
      {/* 1. エフェクトレイヤー (背景側の閃光や火花) */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
        {impact1 > 0 && <ImpactEffect color="#00ffff" intensity="normal" />}
        {impact4 > 0 && <ImpactEffect color="#ff1e1e" intensity="normal" />}
        {impact4 > 0.5 && (
          <ParticleBurst 
            count={20} 
            colors={['#ff1e1e', '#00ffff', '#ffffff']} 
            x={width/2} 
            y={height/2} 
            speed={3}
          />
        )}
      </AbsoluteFill>

      {/* 2. メインコンテンツ (中央配置を保証する構造) */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <GlitchEffect intensity={masterImpact * 20}>
          {/* 中央寄せを確定させる */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 45,
            }}
          >
              {/* J.O.L */}
              <div style={getEntryStyle(spr1, 'top')}>
                <NeonGlowText text="J.O.L" fontSize={210} color="#e0f7ff" glowColor="#00e5ff" style={{ fontFamily: orbitron }} />
              </div>

              {/* 団結力 NO.1 を勝ち取れ */}
              <div 
                style={{ 
                  ...getEntryStyle(spr4, 'bottom', 0.85),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <NeonGlowText text="⭐団結力⭐" fontSize={210} color="#FFFFFF" glowColor="#ff1e1e" style={{ fontFamily: delaGothic }} />
                <NeonGlowText text="NO.1" fontSize={210} color="#FFFFFF" glowColor="#00ffff" style={{ fontFamily: orbitron }} />
                <NeonGlowText text="を勝ち取れ" fontSize={180} color="#FFFFFF" glowColor="#ff1e1e" style={{ fontFamily: delaGothic }} />
              </div>

              {/* ランキング 結果発表 */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 15
                }}
              >
                 <div style={getEntryStyle(spr3, 'top')}>
                   <NeonGlowText text="ランキング" fontSize={140} color="#e0f7ff" glowColor="#00e5ff" style={{ fontFamily: delaGothic }} />
                 </div>
                <div style={getEntryStyle(spr5, 'top')}>
                  <NeonGlowText text="結果発表" fontSize={120} color="#FFFFFF" glowColor="#ff1e1e" style={{ fontFamily: delaGothic }} />
                </div>
              </div>
          </div>
        </GlitchEffect>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};