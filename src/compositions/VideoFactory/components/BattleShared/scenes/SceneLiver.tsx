import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  staticFile,
  interpolate,
  spring,
  Img,
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

export const SceneLiver: React.FC<{ theme: BattleSpiritTheme; duration: number; startFrame?: number }> = ({ theme, duration, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + startFrame;
  const isAltImageActive = theme.liver.altImage && theme.liver.altImageStartFrame && theme.liver.altImageEndFrame && absoluteFrame >= theme.liver.altImageStartFrame && absoluteFrame <= theme.liver.altImageEndFrame;
  const displayImage = isAltImageActive ? theme.liver.altImage! : theme.liver.image;

  if (theme.features.useDoublingGrid) {
    const staticImage = staticFile(displayImage);

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
    const staticImage = staticFile(displayImage);
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

  // --- Custom 3:7 Layout specifically for Spring Sakura Theme ---
  if (theme.themeColor === '#fce4ec') {
    const part1Duration = Math.floor(duration * 0.3);
    const isPart1 = frame < part1Duration;
    const currentImage = isPart1 ? theme.liver.image : (theme.liver.altImage || theme.liver.image);
    
    const entranceScale = isPart1 ? interpolate(frame, [0, part1Duration], [0.8, 1.1]) : 1;
    const entranceOpacity = isPart1 ? interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }) : 1;
    
    const p2Frame = frame - part1Duration;
    const p2Scale = !isPart1 ? interpolate(p2Frame, [0, duration - part1Duration], [0.95, 1.05]) : 0;
    const p2Pop = !isPart1 ? spring({ frame: p2Frame, fps: 30, config: { damping: 12 } }) : 0;
    
    const MathBpm = theme.music?.bpm || 144;
    const framesPerBeat = (60 / MathBpm) * 30;
    const colorStep = Math.floor(frame / (framesPerBeat * 0.5));
    const colorFilters = [
      'brightness(1.2) contrast(1.1)',
      'brightness(1.4) saturate(1.5) hue-rotate(15deg)',
      'brightness(1.3) contrast(1.2)',
      'brightness(1.5) saturate(1.2) hue-rotate(-10deg)'
    ];
    const dynamicFilter = colorFilters[colorStep % colorFilters.length];

    let dynamicTransform = 'none';
    if (isPart1) {
      // 350fr~365fr -> 20~35 inside SceneLiver (duration 330~539)
      const rotZ = interpolate(frame, [20, 35], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      dynamicTransform = `rotate(${rotZ}deg)`;
    } else {
      // 445fr~ -> 115~ inside SceneLiver
      const rotY = interpolate(frame, [115, duration], [0, 1080], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      dynamicTransform = `perspective(1000px) rotateY(${rotY}deg)`;
    }

    return (
      <AbsoluteFill style={{ overflow: 'visible', backgroundColor: '#000', filter: dynamicFilter, transform: dynamicTransform, transformOrigin: 'center' }}>
        <AbsoluteFill style={{ width: 2500, height: 2500, left: (1080 - 2500) / 2, top: (1920 - 2500) / 2 }}>
          <CustomBackgroundImage src={theme.customBackground!} frame={frame + 300} opacity={0.8} />
        </AbsoluteFill>

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {isPart1 ? (
             <div style={{ transform: `scale(${entranceScale})`, opacity: entranceOpacity, filter: `drop-shadow(0 0 100px ${theme.glowColor})` }}>
               <Img src={staticFile(currentImage)} style={{ width: 850, height: 1200, objectFit: 'contain' }} />
             </div>
          ) : (
             <div style={{ 
               transform: `scale(${p2Scale * p2Pop})`, 
               border: `15px solid white`, 
               borderRadius: 40,
               boxShadow: `0 0 150px ${theme.glowColor}, inset 0 0 50px ${theme.glowColor}`,
               overflow: 'hidden',
               width: 850,
               height: 1100,
               filter: `drop-shadow(0 0 50px ${theme.themeColor})`,
               position: 'relative'
             }}>
               <Img src={staticFile(currentImage)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               <div style={{ position: 'absolute', inset: 0, border: '4px solid gold', borderRadius: 25, margin: 12, pointerEvents: 'none' }} />
             </div>
          )}
        </AbsoluteFill>
        
        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
           <div style={{ 
             background: 'rgba(255,255,255,0.95)', 
             padding: '20px 80px', 
             borderRadius: '50px', 
             border: `6px solid ${theme.themeColor}`, 
             fontSize: 70, 
             fontWeight: 900, 
             color: theme.glowColor, 
             boxShadow: `0 0 50px ${theme.glowColor}`,
             transform: `translateY(${Math.sin(frame / 10) * 10}px)`
           }}>
             {theme.liver.name}
           </div>
        </AbsoluteFill>
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
          imageSrc={displayImage}
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
