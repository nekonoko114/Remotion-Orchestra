import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Video,
  staticFile,
} from 'remotion';
import { LuxuryGoldText } from '../components/LuxuryGoldText';
import { LensFlare } from '../../../components/effects/LensFlare';
import { Dust } from '../../../components/effects/Dust';
import { ROYAL_THEME } from './theme';

export type OpeningProps = {
  title1: string;
  title2: string;
  title3: string;
  date: string;
  subtitle: string;
};

export const Opening: React.FC<OpeningProps> = ({
  title1,
  title2,
  title3,
  date,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  // 1. シネマティック・ズーム
  const scale = interpolate(frame, [0, 500], [1.05, 1.15], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // 2. 文字間の広がり
  const tracking1 = interpolate(frame, [10, 300], [0, 40], { extrapolateRight: 'clamp' });
  const tracking2 = interpolate(frame, [30, 300], [0, 30], { extrapolateRight: 'clamp' });
  const tracking3 = interpolate(frame, [50, 300], [0, 25], { extrapolateRight: 'clamp' });
  const trackingSub = interpolate(frame, [80, 300], [5, 20], { extrapolateRight: 'clamp' });

  // 3. テキストアニメーション
  const title1Y = interpolate(frame, [10, 50], [60, 0], { easing: Easing.out(Easing.exp), extrapolateRight: 'clamp' });
  const blur1 = interpolate(frame, [10, 40], [20, 0], { extrapolateRight: 'clamp' });
  const opacity1 = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });

  const title2Y = interpolate(frame, [30, 70], [60, 0], { easing: Easing.out(Easing.exp), extrapolateRight: 'clamp' });
  const blur2 = interpolate(frame, [30, 60], [20, 0], { extrapolateRight: 'clamp' });
  const opacity2 = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });

  const title3Y = interpolate(frame, [50, 90], [60, 0], { easing: Easing.out(Easing.exp), extrapolateRight: 'clamp' });
  const blur3 = interpolate(frame, [50, 80], [20, 0], { extrapolateRight: 'clamp' });
  const opacity3 = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' });

  const subtitleY = interpolate(frame, [80, 120], [40, 0], { easing: Easing.out(Easing.exp), extrapolateRight: 'clamp' });
  const blurSub = interpolate(frame, [80, 110], [20, 0], { extrapolateRight: 'clamp' });
  const opacitySub = interpolate(frame, [80, 100], [0, 0.9], { extrapolateRight: 'clamp' });

  const dateY = interpolate(frame, [110, 150], [20, 0], { easing: Easing.out(Easing.exp), extrapolateRight: 'clamp' });
  const opacityDate = interpolate(frame, [110, 130], [0, 0.8], { extrapolateRight: 'clamp' });

  const lineOpacityTop = interpolate(frame, [10, 40, 150, 300], [0, 0.8, 0.4, 0.8], { extrapolateRight: 'clamp' });
  const lineOpacityBottom = interpolate(frame, [80, 110, 200, 300], [0, 1, 0.6, 1], { extrapolateRight: 'clamp' });

  // 煌めきのパルス
  const pulse = interpolate(Math.sin(frame / 30), [-1, 1], [0.85, 1.15]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        
        {/* レイヤー1: 背景動画 (Dragon) */}
        <AbsoluteFill style={{ zIndex: -10 }}>
          <Video 
            src={staticFile('assets/video/Golden_dragon_202604210349.mp4')} 
            muted 
            playbackRate={1.5}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
          />
        </AbsoluteFill>

        {/* レイヤー2: ゴールデン・ダスト (キラキラ) */}
        <AbsoluteFill style={{ zIndex: -8 }}>
          <Dust 
            count={220} 
            colors={[ROYAL_THEME.colors.champagneGold, '#FFF', '#FFD700', ROYAL_THEME.colors.champagneGoldLight]} 
            opacity={0.7 * pulse}
          />
        </AbsoluteFill>

        {/* レイヤー3: シマー・スイープ (光のベール) */}
        <AbsoluteFill style={{ zIndex: -6, pointerEvents: 'none' }}>
           <div style={{
              position: 'absolute', top: 0, bottom: 0, width: '90%',
              background: 'linear-gradient(110deg, transparent 0%, rgba(255, 235, 170, 0.08) 50%, transparent 100%)',
              transform: `translateX(${interpolate(frame, [0, 300], [-130, 170])}%) skewX(-30deg)`,
              filter: 'blur(150px)',
           }} />
        </AbsoluteFill>

        {/* レイヤー4: 王者の後光 (Glow) */}
        <AbsoluteFill style={{ zIndex: -4, pointerEvents: 'none' }}>
           <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 1400, height: 900,
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, transparent 75%)',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(120px)',
              opacity: interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' }),
           }} />
        </AbsoluteFill>

        {/* 周辺減光 (Vignette) - 究極の暗さ */}
        <AbsoluteFill style={{ zIndex: -2 }}>
          <AbsoluteFill
            style={{ background: 'radial-gradient(circle, transparent 10%, rgba(0,0,0,1) 100%)' }}
          />
        </AbsoluteFill>

        {/* レンズフレア */}
        <AbsoluteFill style={{ zIndex: 1, pointerEvents: 'none', opacity: 0.7 }}>
          <LensFlare 
            color={ROYAL_THEME.colors.champagneGoldLight} 
            intensity={1.0} 
            scale={2.5}
            cx={interpolate(frame, [0, 300], [-40, 140])}
            cy={interpolate(frame, [0, 300], [20, 80])}
            opacity={interpolate(frame, [0, 40, 250, 300], [0, 1, 1, 0])}
          />
        </AbsoluteFill>

        {/* 装飾線トップ */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: -350 }}>
          <div style={{ 
            width: 600, height: 2, 
            background: 'linear-gradient(90deg, transparent, rgba(247, 231, 206, 0.8), transparent)', 
            opacity: lineOpacityTop,
            boxShadow: '0 0 15px rgba(247, 231, 206, 0.4)' 
          }} />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30px', 
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35px' }}>
            <div style={{ transform: `translateY(${title1Y}px)`, filter: `blur(${blur1}px)`, opacity: opacity1 }}>
              <LuxuryGoldText text={title1} fontSize={220} delay={10} style={{ letterSpacing: `${tracking1}px` }} />
            </div>
            
            <div style={{ margin: '15px 0', transform: `translateY(${title2Y}px)`, filter: `blur(${blur2}px)`, opacity: opacity2 }}>
              <LuxuryGoldText text={title2} fontSize={120} delay={30} style={{ letterSpacing: `${tracking2}px` }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', transform: `translateY(${title3Y}px)`, filter: `blur(${blur3}px)`, opacity: opacity3 }}>
              <LuxuryGoldText text={title3} fontSize={160} delay={50} style={{ letterSpacing: `${tracking3}px` }} />
            </div>
            
            <div style={{ marginTop: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${subtitleY}px)`, filter: `blur(${blurSub}px)`, opacity: opacitySub }}>
              <LuxuryGoldText text={subtitle} fontSize={110} delay={80} style={{ letterSpacing: `${trackingSub}px`, fontFamily: ROYAL_THEME.fonts.japanese }} />
              <div style={{ 
                width: 400, height: 3, marginTop: 40,
                background: 'linear-gradient(90deg, transparent, rgba(247, 231, 206, 1), transparent)',
                opacity: lineOpacityBottom,
                boxShadow: '0 0 15px rgba(247, 231, 206, 0.6)'
              }} />
            </div>

            <div style={{ marginTop: '30px', transform: `translateY(${dateY}px)`, opacity: opacityDate }}>
              <div style={{ 
                color: ROYAL_THEME.colors.champagneGold, fontSize: '48px', fontWeight: 'bold', letterSpacing: '8px',
                fontFamily: ROYAL_THEME.fonts.japanese, opacity: 0.7 
              }}>
                {date}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};