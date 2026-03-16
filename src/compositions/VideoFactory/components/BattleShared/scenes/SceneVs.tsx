import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  random,
  staticFile,
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

  const topPlayer = theme.reverseVsOrder ? theme.liver : theme.opponent;
  const bottomPlayer = theme.reverseVsOrder ? theme.opponent : theme.liver;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {flashOpacity > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flashOpacity, zIndex: 10 }} />}
      <RotatingFocusLines frame={frame} color={theme.themeColor} />
      <AbsoluteFill style={{ transform: `scale(${1 + shakeDecay * 0.1}) translate(${shakeX}px, ${shakeY}px)` }}>
        <KaleidoscopeBackground imageSrc={staticFile(theme.opponent.image)} frame={frame} opacity={0.3} glowColor={theme.glowColor} />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop})`, gap: 20 }}>
            <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${topPlayer.glowColor})` }}>
              <GlitchedIcon src={staticFile(topPlayer.image)} frame={frame} size={600} borderColor={topPlayer.borderColor} glowColor={topPlayer.glowColor} style={{ margin: '0 auto 15px' }} enabled={theme.features.useGlitch} />
              <KineticText text={topPlayer.name} frame={frame} fps={fps} startFrame={10} fontSize={90} color={topPlayer.borderColor} glowColor={topPlayer.glowColor} fontFamily={theme.fontFamily} style={{ letterSpacing: 4 }} />
            </div>
            <div style={{ position: 'relative', height: 120, zIndex: 10 }}>
               <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: theme.themeColor, fontStyle: 'italic', transform: `translate(-20px, 10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: 'cyan', fontStyle: 'italic', transform: `translate(20px, -10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ position: 'relative', fontSize: 260, fontWeight: 900, color: 'white', fontStyle: 'italic', transform: `rotate(${Math.sin(frame / 3) * 15}deg)`, WebkitTextStroke: '8px black', textShadow: `0 0 100px ${theme.glowColor}` }}>VS</div>
               </div>
            </div>
            <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${bottomPlayer.glowColor})` }}>
              <GlitchedIcon src={staticFile(bottomPlayer.image)} frame={frame} size={600} borderColor={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} style={{ margin: '15px auto 10px' }} enabled={theme.features.useGlitch} />
              <KineticText text={bottomPlayer.name} frame={frame} fps={fps} startFrame={20} fontSize={90} color={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} fontFamily={theme.fontFamily} style={{ letterSpacing: 4 }} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* --- EFFECT STACK --- */}
      <VideoEffectStack config={theme.sceneVsEffect} />
    </AbsoluteFill>
  );
};
