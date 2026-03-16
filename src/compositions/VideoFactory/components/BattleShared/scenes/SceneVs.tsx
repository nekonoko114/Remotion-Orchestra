import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  random,
  staticFile,
  OffthreadVideo,
  interpolate,
} from 'remotion';
import {
  SvgDefs,
  RotatingFocusLines,
  KaleidoscopeBackground,
  GlitchedIcon,
  KineticText,
  VideoEffectStack,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneVs: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 600, damping: 15 } }); 
  const shakeDecay = Math.max(0, 1 - frame / 40); 
  const shakeX = (random(frame) - 0.5) * 60 * shakeDecay; 
  const shakeY = (random(frame + 9) - 0.5) * 60 * shakeDecay; 
  const flashOpacity = Math.max(0, 1 - frame / 4); 
  
  // Wiggle effect variables (subtle floating motion)
  const wiggleLift1 = Math.sin(frame / 15) * 20;
  const wiggleRot1 = Math.cos(frame / 20) * 3;
  const wiggleLift2 = Math.cos(frame / 12) * 20;
  const wiggleRot2 = Math.sin(frame / 18) * 3;

  const topPlayer = theme.reverseVsOrder ? theme.liver : theme.opponent;
  const bottomPlayer = theme.reverseVsOrder ? theme.opponent : theme.liver;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {flashOpacity > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flashOpacity, zIndex: 10 }} />}
      <RotatingFocusLines frame={frame} color={theme.themeColor} />
      <AbsoluteFill style={{ transform: `scale(${1 + shakeDecay * 0.1}) translate(${shakeX}px, ${shakeY}px)` }}>
        {theme.themeColor === 'orange' ? (
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <OffthreadVideo 
              src={staticFile('assets/pixabay/effects/pixabay_vs.mp4')} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)' }} 
              muted 
            />
            {/* 赤と青のVS背景などに合わせた色調補正（必要であれば） */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 120, 0, 0.1)', mixBlendMode: 'color' }} />
          </AbsoluteFill>
        ) : theme.themeColor === '#ff2200' ? (
          <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#300' }}>
            <OffthreadVideo 
              src={staticFile('assets/pixabay/videos/pixabay_versus_against_action_banner_clash_competition_com_88031.mp4')} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transform: 'scale(1.2)' }} 
              muted 
            />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 0, 0, 0.2)', mixBlendMode: 'color' }} />
          </AbsoluteFill>
        ) : (
          <KaleidoscopeBackground imageSrc={staticFile(theme.opponent.image)} frame={frame} opacity={0.3} glowColor={theme.glowColor} />
        )}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {theme.themeColor === 'orange' ? (
            // --- 斜めレイアウト (Orange Theme) ---
            <>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', transform: `scale(${interpolate(pop, [0, 1], [0.8, 0.95])})`, gap: 80, width: '100%', zIndex: 1 }}>
                <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${topPlayer.glowColor})`, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${-550 + wiggleLift1}px) rotate(${wiggleRot1}deg)` }}>
                <GlitchedIcon src={staticFile(topPlayer.image)} frame={frame} size={420} borderColor={topPlayer.borderColor} glowColor={topPlayer.glowColor} style={{ marginBottom: 15 }} enabled={theme.features.useGlitch} />
                <KineticText text={topPlayer.name} frame={frame} fps={fps} startFrame={10} fontSize={60} color={topPlayer.borderColor} glowColor={topPlayer.glowColor} fontFamily={theme.fontFamily} style={{ letterSpacing: 2, whiteSpace: 'nowrap' }} />
              </div>

              <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${bottomPlayer.glowColor})`, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${550 + wiggleLift2}px) rotate(${wiggleRot2}deg)` }}>
                <GlitchedIcon src={staticFile(bottomPlayer.image)} frame={frame} size={420} borderColor={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} style={{ marginBottom: 15 }} enabled={theme.features.useGlitch} />
                <KineticText text={bottomPlayer.name} frame={frame} fps={fps} startFrame={20} fontSize={60} color={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} fontFamily={theme.fontFamily} style={{ letterSpacing: 2, whiteSpace: 'nowrap' }} />
              </div>
              </div>
            </>
          ) : (
            // --- 上下レイアウト (Standard) ---
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop})`, gap: 20 }}>
              <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${topPlayer.glowColor})`, transform: theme.themeColor === '#ff2200' ? 'translateX(-150px)' : 'none' }}>
                <GlitchedIcon src={staticFile(topPlayer.image)} frame={frame} size={600} borderColor={topPlayer.borderColor} glowColor={topPlayer.glowColor} style={{ margin: '0 auto 15px' }} enabled={theme.features.useGlitch} />
                <KineticText text={topPlayer.name} frame={frame} fps={fps} startFrame={10} fontSize={90} color={topPlayer.borderColor} glowColor={topPlayer.glowColor} fontFamily={theme.fontFamily} style={{ letterSpacing: 4 }} />
              </div>

              {theme.themeColor !== '#ff2200' && (
                <div style={{ position: 'relative', height: 120, zIndex: 10 }}>
                   <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                     <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: theme.themeColor, fontStyle: 'italic', transform: `translate(-20px, 10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                     <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: 'cyan', fontStyle: 'italic', transform: `translate(20px, -10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                     <div style={{ position: 'relative', fontSize: 260, fontWeight: 900, color: 'white', fontStyle: 'italic', transform: `rotate(${Math.sin(frame / 3) * 15}deg)`, WebkitTextStroke: '8px black', textShadow: `0 0 100px ${theme.glowColor}` }}>VS</div>
                   </div>
                </div>
              )}

              <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${bottomPlayer.glowColor})` }}>
                <GlitchedIcon src={staticFile(bottomPlayer.image)} frame={frame} size={600} borderColor={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} style={{ margin: '15px auto 10px' }} enabled={theme.features.useGlitch} />
                <KineticText text={bottomPlayer.name} frame={frame} fps={fps} startFrame={20} fontSize={90} color={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} fontFamily={theme.fontFamily} style={{ letterSpacing: 4 }} />
              </div>
            </div>
          )}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* --- EFFECT STACK --- */}
      <VideoEffectStack config={theme.sceneVsEffect} />
    </AbsoluteFill>
  );
};
