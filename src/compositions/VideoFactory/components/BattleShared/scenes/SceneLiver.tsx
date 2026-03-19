import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  staticFile,
  interpolate,
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
        {theme.features.useKaleidoscope !== false && <KaleidoscopeBackground imageSrc={staticImage} frame={frame} opacity={0.3} />}
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
        {theme.features.useKaleidoscope !== false && <KaleidoscopeBackground imageSrc={staticImage} frame={frame} opacity={0.3} />}
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

  const MathBpm = theme.music?.bpm || 144;
  const framesPerBeat = (60 / MathBpm) * 30;

  // 0.5拍ごとの明るいカラーグレーディング
  const colorStep = Math.floor(frame / (framesPerBeat * 0.5));
  const colorFilters = [
    'brightness(1.2) contrast(1.1)', // Bright and punchy
    'brightness(1.4) saturate(1.5) hue-rotate(15deg)', // Very bright and warm
    'brightness(1.3) contrast(1.2) sepia(0.2)', // Bright and cinematic
    'brightness(1.5) saturate(1.2) hue-rotate(-10deg)'  // Flashy bright
  ];
  const dynamicFilter = theme.features.useSpinIntro ? colorFilters[colorStep % colorFilters.length] : 'none';

  // --- 3分割演出 ---
  const partDuration = duration / 3;
  const isPart1 = frame < partDuration;
  const isPart2 = frame >= partDuration && frame < partDuration * 2;
  const isPart3 = frame >= partDuration * 2;
  const partFrame = frame % partDuration;

  let dynamicTransform = 'none';
  let sceneOpacity = 1;

  if (theme.features.useSpinIntro) {
    if (isPart1) {
      // 1回転 (1.5秒強かけて1回転)
      const rotZ = interpolate(partFrame, [0, 20], [0, 360], { extrapolateRight: 'clamp' });
      dynamicTransform = `rotate(${rotZ}deg)`;
    } else if (isPart2) {
      // フェードイン (opacity 0から1へ)
      sceneOpacity = interpolate(partFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
    } else if (isPart3) {
      // Y軸に対して3回転 (残り時間で3回転)
      const rotY = interpolate(partFrame, [0, partDuration], [0, 640], { extrapolateRight: 'clamp' });
      dynamicTransform = `perspective(600px) rotateY(${rotY}deg)`;
    }
  }

  return (
    <AbsoluteFill style={{ overflow: 'visible', transform: dynamicTransform, filter: dynamicFilter, transformOrigin: 'center', backgroundColor: '#020508' }}>
      <AbsoluteFill style={{ width: 2500, height: 2500, left: (1080 - 2500) / 2, top: (1920 - 2500) / 2 }}>
        {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame + 300} opacity={0.7} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 300} opacity={0.4} /> : null)}
      </AbsoluteFill>
      
      <AbsoluteFill style={{ opacity: sceneOpacity }}>
        <MirrorLiverEffect 
          imageSrc={theme.liver.image}
          name={theme.liver.name}
          frame={partFrame}
          duration={partDuration}
          themeColor={theme.themeColor}
          glowColor={theme.glowColor}
          useGlitch={theme.features.useGlitch}
          useMirror={theme.features.useMirror}
          useKaleidoscope={theme.features.useKaleidoscope}
          isCircle={theme.features.useCircleLiver}
          bpm={theme.music.bpm}
          disableExitZoom={!isPart3}
        />
        {/* --- EFFECT STACK --- */}
        <VideoEffectStack config={theme.sceneLiverEffect} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
