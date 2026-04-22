import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  staticFile,
  useVideoConfig,
  Easing,
  random, // 【NEW】ランダム関数を追加
} from 'remotion';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { CinematicBorder } from '../CinematicBorder';
import { MorphingTitle } from '../MorphingTitle';
import { Explosion } from '../../../components/effects/Explosion';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';
import { HolographicHUD } from '../../../components/effects/HolographicHUD';
import { GlitchEffect } from '../../../components/effects/GlitchEffect';
import { ChromaticAberration } from '../../../components/effects/ChromaticAberration';
import { Confetti } from '../../../components/effects/Confetti';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';
import { loadFont } from '@remotion/google-fonts/Orbitron';

const { fontFamily } = loadFont();

const BPM = 160;

type Props = {
  rank: number;
  liver: Liver;
  title: string;
  backgroundSrc?: string;
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  useBeatValue(BPM);
  const localFrame = frame;

  // ===== CYBER DECODE LOGIC =====
  const triStart = 45;
  const triDuration = 60;
  const t = Math.max(0, localFrame - triStart);
  
  const centerX = width / 2;
  const centerY = height / 2 + 80 * (height / 1080);

  // Digital Stutter
  const stutterFrame = Math.floor(t / 2) * 2;
  const revealProgress = interpolate(stutterFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  
  // RGB Convergence
  const rgbShift = interpolate(t, [0, 30], [120, 0], { easing: Easing.out(Easing.exp), extrapolateRight: 'clamp' }); // 【UPDATE】分離幅を80→120に拡大
  const rgbAlpha = interpolate(t, [0, 10, 30], [0, 0.8, 1], { extrapolateRight: 'clamp' });

  // Motion path
  const motionX = centerX;
  const motionY = interpolate(revealProgress, [0, 1], [centerY + 300, centerY]);
  const motionScale = interpolate(revealProgress, [0, 1], [2.0, 1], { easing: Easing.out(Easing.back(2)) }); // 【UPDATE】スケールを強調
  const motionRotate = interpolate(revealProgress, [0, 1], [30, 0]);

  // Scanline Wipe Mask (Softer digital reveal)
  const scanProgress = interpolate(t, [10, 45], [0, 100], { extrapolateRight: 'clamp' });
  const maskStyle: React.CSSProperties = scanProgress < 100 ? {
    maskImage: `linear-gradient(to bottom, black ${scanProgress}%, transparent ${scanProgress}%, transparent 100%)`,
    WebkitMaskImage: `linear-gradient(to bottom, black ${scanProgress}%, transparent ${scanProgress}%, transparent 100%)`,
  } : {};

  let impactRotate = 0;
  let impactY = 0;
  let rankExtraScale = 1;

  if (rank === 2) {
    const pRank2 = interpolate(t, [40, 55], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.back(1.5)) });
    impactY = interpolate(pRank2, [0, 1], [300, 0]);
  } else if (rank === 1) {
    const pRank1 = interpolate(t, [triDuration, triDuration + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.exp) });
    impactRotate = interpolate(pRank1, [0, 1], [-180, 0]);
    rankExtraScale = 1.05;
  }

  const finalImageScale = motionScale * rankExtraScale;
  const pulseScale = (1 + Math.sin(frame / 8) * 0.02);
  const finalImageOpacity = rgbAlpha;

  const sprImpact = spring({
    frame: localFrame - (triStart + triDuration),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const nameEntrance = spring({
    frame: localFrame - 80,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const rankEntrance = spring({
    frame: localFrame - 40,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  // 【NEW】ハッキング風のテキストデコード演出（文字がランダムな記号から名前に変化）
  const scramblePool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>!?';
  const decodedName = liver.nickname.split('').map((char, i) => {
    // 文字ごとに登場タイミングをずらす
    const charProgress = interpolate(localFrame - 80 - i * 3, [0, 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    if (charProgress === 1) return char; // 完全表示
    if (charProgress > 0) return scramblePool[Math.floor(random(`scramble-${frame}-${i}`) * scramblePool.length)]; // スクランブル状態
    return ''; // 未表示
  }).join('');

  const nameYPos = interpolate(nameEntrance, [0, 1], [50, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  const impactIntensity = interpolate(sprImpact, [0, 0.1, 0.5], [0, 1, 0], { extrapolateRight: 'clamp' });
  const flashOpacity = Math.max(
    impactIntensity * 0.8,
    interpolate(frame, [0, 5, 25], [0, 0.9, 0], { extrapolateRight: 'clamp' })
  );

  // 【NEW】画面全体のアグレッシブなシェイク（インパクト時）
  const masterShakeX = impactIntensity * (random('shakeX' + frame) - 0.5) * 80;
  const masterShakeY = impactIntensity * (random('shakeY' + frame) - 0.5) * 80;

  // 【NEW】ランダムなマイクロGlitch（時々一瞬だけ画面がバグる）
  const isRandomGlitch = localFrame > 60 && random('microGlitch' + frame) > 0.92;
  const microGlitchIntensity = isRandomGlitch ? random('gInt' + frame) * 50 : 0;

  // Glitchと色収差の激しさを計算
  const currentGlitchIntensity = impactIntensity * 80 + (1 - revealProgress) * 60 + microGlitchIntensity;
  const currentChromaticIntensity = impactIntensity * 40 + (1 - revealProgress) * 30 + microGlitchIntensity * 0.5;

  const rankScale = interpolate(rankEntrance, [0, 1], [6, 1], {
    easing: Easing.out(Easing.back(2)),
  });
  const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);

  const getRankColors = (r: number) => {
    if (r === 1) return { primary: '#ff0000', secondary: '#00ffff', glow: 'rgba(255, 0, 0, 0.8)' }; 
    if (r === 2) return { primary: '#00ffff', secondary: '#ff0000', glow: 'rgba(0, 255, 255, 0.6)' }; 
    return { primary: '#ff3333', secondary: '#00ffff', glow: 'rgba(255, 51, 51, 0.5)' }; 
  };

  const { primary, secondary, glow } = getRankColors(rank);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
        {frame < 20 && <ImpactEffect color={primary} intensity="normal" />}
        <Explosion delay={triStart + triDuration} color={primary} secondaryColor={secondary} />
        <ImpactEffect color={primary} intensity="normal" />
      </AbsoluteFill>

      <AbsoluteFill style={{ zIndex: 110 }}>
        <Confetti count={rank === 1 ? 250 : 150} colors={[primary, '#ffffff', secondary, '#00ffff']} />
        {(localFrame > triStart + triDuration) && (
          <ParticleBurst count={60} colors={[primary, '#ffffff', '#00ffff']} x={width/2} y={height/2 + 80 * (width/1080)} speed={4} />
        )}
      </AbsoluteFill>

      {/* 【NEW】全体を揺らすマスターラッパー */}
      <AbsoluteFill
        style={{
          transform: `translate(${masterShakeX}px, ${masterShakeY}px) scale(${1 + impactIntensity * 0.05})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily,
          color: 'white',
          zIndex: 120,
        }}
      >
        <AbsoluteFill style={{ zIndex: 120 }}>
          <div
            style={{
              position: 'absolute',
              top: 50 * (height / 1080),
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              transform: `scale(${pulseScale * rankScale})`,
              opacity: rankOpacity,
            }}
          >
            {(() => {
              const match = title.match(/^(\d+)(.*)$/);
              if (match) {
                const [, num, suffix] = match;
                return (
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <MorphingTitle
                      text={num}
                      fontSize={180 * (height / 1080)}
                      style={{
                        fontFamily,
                        textShadow: `0 0 ${2 * (height / 1080)}px ${primary}, 0 0 ${15 * (height / 1080)}px ${primary}`,
                      }}
                    />
                    <MorphingTitle
                      text={suffix}
                      fontSize={80 * (height / 1080)}
                      style={{
                        fontFamily: 'serif',
                        textShadow: `0 0 ${2 * (height / 1080)}px ${primary}, 0 0 ${10 * (height / 1080)}px ${primary}`,
                        marginLeft: 10,
                      }}
                    />
                  </div>
                );
              }
              return (
                <MorphingTitle
                  text={title}
                  fontSize={180 * (height / 1080)}
                  style={{
                    fontFamily,
                    textShadow: `0 0 ${2 * (height / 1080)}px ${primary}, 0 0 ${15 * (height / 1080)}px ${primary}`,
                  }}
                />
              );
            })()}
          </div>

          {/* CYBER MOTION WRAPPER */}
          <div
            style={{
              position: 'absolute',
              left: motionX,
              top: motionY,
              width: 500 * (height / 1080),
              height: 500 * (height / 1080),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translate(-50%, -50%) rotate(${motionRotate + impactRotate}deg) translateY(${impactY}px)`,
            }}
          >
            <GlitchEffect intensity={currentGlitchIntensity}>
              <ChromaticAberration intensity={currentChromaticIntensity}>
                
                {/* 【NEW】インポートされていたHolographicHUDをアバターの背面に配置 */}
                <AbsoluteFill style={{ transform: 'scale(1.4)', opacity: revealProgress * 0.7 }}>
                  <HolographicHUD color={primary} />
                </AbsoluteFill>

                {/* 【NEW】SF風の回転するターゲットリング */}
                <div
                  style={{
                    position: 'absolute',
                    width: '120%',
                    height: '120%',
                    top: '-10%',
                    left: '-10%',
                    borderRadius: '50%',
                    border: `2px dashed ${secondary}`,
                    opacity: revealProgress * 0.5,
                    transform: `rotate(${frame * 3}deg)`,
                    zIndex: 2,
                  }}
                />

                {/* Liver Image Container */}
                <div
                  style={{
                    width: 500 * (height / 1080),
                    height: 500 * (height / 1080),
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `${8 * (height / 1080)}px solid white`,
                    boxShadow: `0 0 ${15 * (height / 1080)}px ${primary}, 0 0 ${20 * (height / 1080)}px ${secondary}`, // 【UPDATE】影の色を2色にしてサイバー感をアップ
                    position: 'relative',
                    backgroundColor: '#000',
                    zIndex: 5,
                    opacity: finalImageOpacity,
                    transform: `scale(${finalImageScale})`,
                    ...maskStyle,
                  }}
                >
                  {/* RGB Channels Split Rendering */}
                  {[
                    { color: '#ff0000', shiftX: rgbShift, shiftY: 0, blend: 'screen' },
                    { color: '#00ff00', shiftX: -rgbShift * 0.5, shiftY: rgbShift * 0.5, blend: 'screen' },
                    { color: '#0000ff', shiftX: -rgbShift * 0.5, shiftY: -rgbShift * 0.5, blend: 'screen' },
                  ].map((layer, i) => (
                    <AbsoluteFill key={i} style={{ mixBlendMode: layer.blend as any, transform: `translate(${layer.shiftX}px, ${layer.shiftY}px)` }}>
                      <Img
                        src={liver.saved_to ? staticFile(liver.saved_to) : liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url)}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          filter: i === 0 ? 'brightness(1.5) grayscale(1) sepia(1) hue-rotate(-50deg) saturate(5)' : i === 1 ? 'brightness(1.5) grayscale(1) sepia(1) hue-rotate(80deg) saturate(5)' : 'brightness(1.5) grayscale(1) sepia(1) hue-rotate(200deg) saturate(5)',
                          opacity: t < 30 ? 0.7 : 0,
                        }}
                      />
                    </AbsoluteFill>
                  ))}

                  {/* Main Image */}
                  <Img
                    src={liver.saved_to ? staticFile(liver.saved_to) : liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url)}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: `brightness(0.9) contrast(1.2) saturate(1.1)`, // 【UPDATE】コントラストを強めにしてエッジを立たせる
                      opacity: t < 25 ? 0 : 1,
                    }}
                  />
                  
                  {/* Scanning Highlight Line */}
                  {scanProgress > 0 && scanProgress < 100 && (
                    <div style={{
                      position: 'absolute',
                      top: `${scanProgress}%`,
                      width: '100%',
                      height: '8px', // 【UPDATE】太くして発光を強める
                      backgroundColor: '#fff',
                      boxShadow: `0 0 20px #fff, 0 0 40px ${primary}`,
                      zIndex: 10,
                    }} />
                  )}

                  {/* 【NEW】ランダムな横線ノイズ（スキャンライン）を上から重ねる */}
                  {isRandomGlitch && (
                     <div style={{
                       position: 'absolute',
                       top: `${random('line' + frame) * 100}%`,
                       width: '100%',
                       height: '10px',
                       backgroundColor: 'rgba(255,255,255,0.8)',
                       mixBlendMode: 'overlay',
                       zIndex: 15,
                     }} />
                  )}

                  <AbsoluteFill
                    style={{
                      background: `radial-gradient(circle, transparent 20%, ${primary}44 100%)`,
                      mixBlendMode: 'screen',
                    }}
                  />
                </div>
              </ChromaticAberration>
            </GlitchEffect>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 80 * (height / 1080),
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <h2
              style={{
                fontFamily,
                fontSize: (rank === 1 ? 70 : 50) * (height / 1080),
                margin: 0,
                textShadow: `0 0 ${8 * (height / 1080)}px ${glow}, 0 0 ${20 * (height / 1080)}px ${glow}, 0 0 ${40 * (height / 1080)}px ${primary}`, // 【UPDATE】テキストのGlowを強化
                fontWeight: 900,
                color: '#fff',
                opacity: nameOpacity,
                transform: `translateY(${nameYPos * (height / 1080)}px)`,
                letterSpacing: `${4 * (height / 1080)}px`,
              }}
            >
              {/* 【UPDATE】普通に表示するのではなく、デコードアニメーションさせる */}
              {decodedName}
            </h2>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: flashOpacity * 0.5,
          pointerEvents: 'none',
          zIndex: 1000,
          mixBlendMode: 'overlay',
        }}
      />
      <CinematicBorder color={primary} glowColor={glow} />
    </AbsoluteFill>
  );
};