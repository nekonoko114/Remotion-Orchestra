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
import { UNITY_THEME } from './theme';
import { ImpactEffectTime as ImpactEffect } from '../../../components/effects/ImpactEffectTime';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';
import { GlitchEffect } from '../../../components/effects/GlitchEffect';

interface OpeningProps {
  title1?: string;
  title2?: string;
  title3?: string;
  subtitle?: string;
  date?: string;
}

export const Opening: React.FC<OpeningProps> = ({
  title1 = 'J.O.L',
  title2 = 'ダイヤモンド',
  title3 = 'ランキング',
  subtitle = '結果発表',
  date = '2026.04',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Staggered springs for each part
  const createSpring = (delay: number) => spring({
    frame: Math.max(0, frame - delay), // マイナスフレームの安全対策
    fps,
    config: { damping: 10, stiffness: 350, mass: 0.6 },
  });

  const spr1 = createSpring(0);   // J.O.L (最上段)
  const spr4 = createSpring(20);  // ダイヤモンド・ランキング (2段目)
  const spr3 = createSpring(45);  // 結果発表 (3段目)
  const spr5 = createSpring(60);  // 2026.04 (4段目)

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
        {impact1 > 0 && <ImpactEffect color={UNITY_THEME.colors.neonBlue} intensity="normal" />}
        {impact4 > 0 && <ImpactEffect color={UNITY_THEME.colors.neonRed} intensity="normal" />}
        {impact4 > 0.5 && (
          <ParticleBurst 
            count={20} 
            colors={[UNITY_THEME.colors.neonRed, UNITY_THEME.colors.neonBlue, UNITY_THEME.colors.textWhite]} 
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
              gap: 70, // 大ブロック間の余白（3つのグループを分ける）
            }}
          >
              {/* J.O.L */}
              <div style={getEntryStyle(spr1, 'top')}>
                <NeonGlowText 
                  text={title1} 
                  fontSize={210} 
                  color="#e0f7ff" 
                  glowColor={UNITY_THEME.colors.neonBlue} 
                  style={{ fontFamily: UNITY_THEME.fonts.main, lineHeight: 1 }} 
                />
              </div>

              {/* ダイヤモンド ランキング */}
              <div 
                style={{ 
                  ...getEntryStyle(spr4, 'bottom', 0.85),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 30, // 「ダイヤモンド」と「ランキング」の間の余白
                }}
              >
                <NeonGlowText 
                  text={title2} 
                  fontSize={170} 
                  color={UNITY_THEME.colors.textWhite} 
                  glowColor={UNITY_THEME.colors.neonRed} 
                  style={{ fontFamily: UNITY_THEME.fonts.japanese, lineHeight: 1 }} 
                />
                <NeonGlowText 
                  text={title3} 
                  fontSize={180} 
                  color={UNITY_THEME.colors.textWhite} 
                  glowColor={UNITY_THEME.colors.neonRed} 
                  style={{ fontFamily: UNITY_THEME.fonts.japanese, lineHeight: 1 }} 
                />
              </div>

              {/* 結果発表 */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 25 // 「結果発表」と「2026.04」の間の余白
                }}
              >
                 <div style={getEntryStyle(spr3, 'top')}>
                   <NeonGlowText 
                     text={subtitle} 
                     fontSize={140} 
                     color="#e0f7ff" 
                     glowColor={UNITY_THEME.colors.neonBlue} 
                     style={{ fontFamily: UNITY_THEME.fonts.japanese, lineHeight: 1 }} 
                   />
                 </div>
                <div style={getEntryStyle(spr5, 'top')}>
                  <NeonGlowText 
                    text={date}  
                    fontSize={120} 
                    color={UNITY_THEME.colors.textWhite} 
                    glowColor={UNITY_THEME.colors.neonRed} 
                    style={{ fontFamily: UNITY_THEME.fonts.japanese, lineHeight: 1 }} 
                  />
                </div>
              </div>
          </div>
        </GlitchEffect>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};