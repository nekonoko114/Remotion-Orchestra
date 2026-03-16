import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  staticFile,
} from 'remotion';
import {
  KaleidoscopeBackground,
  SunsetBackground,
  CustomBackgroundImage,
  VideoEffectStack,
  DoublingGridEffect,
  GridConvergenceEffect,
  MirrorLiverEffect,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneLiver: React.FC<{ theme: BattleSpiritTheme; duration: number }> = ({ theme, duration }) => {
  const frame = useCurrentFrame();
  if (theme.features.useDoublingGrid) {
    const staticImage = staticFile(theme.liver.image);

    return (
      <AbsoluteFill style={{ backgroundColor: '#100800', overflow: 'hidden' }}>
        {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame + 300} opacity={0.4} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 300} opacity={0.4} /> : null)}
        <KaleidoscopeBackground imageSrc={staticImage} frame={frame} opacity={0.3} />
        <DoublingGridEffect 
          imageSrc={staticImage} 
          frame={frame} 
          themeColor={theme.themeColor} 
          seedName={theme.liver.name} 
        />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: 100, background: 'rgba(0,0,0,0.7)', padding: '20px 60px', borderRadius: '50px', border: '4px solid gold', fontSize: 60, fontWeight: 900, color: 'white', textShadow: `0 0 20px ${theme.themeColor}` }}>
            {theme.liver.name}
          </div>
        </AbsoluteFill>

        {/* --- EFFECT STACK --- */}
        <VideoEffectStack config={theme.sceneLiverEffect} />
      </AbsoluteFill>
    );
  }

  if (theme.features.useGridConvergence) {
    const staticImage = staticFile(theme.liver.image);
    return (
      <AbsoluteFill style={{ backgroundColor: '#100800', overflow: 'hidden' }}>
        {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame + 300} opacity={0.4} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 300} opacity={0.4} /> : null)}
        <KaleidoscopeBackground imageSrc={staticImage} frame={frame} opacity={0.3} />
        <GridConvergenceEffect 
          imageSrc={staticImage} 
          gridImageSrc={theme.liver.gridImage ? staticFile(theme.liver.gridImage) : undefined}
          frame={frame} 
          themeColor={theme.themeColor} 
          seedName={theme.liver.name} 
        />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: 100, background: 'rgba(0,0,0,0.7)', padding: '20px 60px', borderRadius: '50px', border: '4px solid gold', fontSize: 60, fontWeight: 900, color: 'white', textShadow: `0 0 20px ${theme.themeColor}` }}>
            {theme.liver.name}
          </div>
        </AbsoluteFill>
        {/* --- EFFECT STACK --- */}
        <VideoEffectStack config={theme.sceneLiverEffect} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <MirrorLiverEffect 
        imageSrc={theme.liver.image}
        name={theme.liver.name}
        frame={frame}
        duration={duration}
        themeColor={theme.themeColor}
        glowColor={theme.glowColor}
        useGlitch={theme.features.useGlitch}
        useMirror={theme.features.useMirror}
      />
      {/* --- EFFECT STACK --- */}
      <VideoEffectStack config={theme.sceneLiverEffect} />
    </AbsoluteFill>
  );
};
