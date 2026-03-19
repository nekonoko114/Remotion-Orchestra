import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  staticFile,
  interpolate,
  spring,
  Img,
  random,
} from 'remotion';
import {
  KaleidoscopeBackground,
  VideoEffectStack,
  DoublingGridEffect,
  GridConvergenceEffect,
  MirrorLiverEffect,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

const GlassCrashOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 0 || frame > 30) return null;
  const p = spring({ frame, fps: 30, config: { damping: 100, mass: 1 } });
  
  const shards = [
    { clip: 'polygon(0 0, 40% 40%, 0 60%)', x: -100, y: -20, rot: -45 },
    { clip: 'polygon(0 0, 100% 0, 40% 40%)', x: 20, y: -100, rot: 45 },
    { clip: 'polygon(100% 0, 100% 100%, 60% 50%)', x: 100, y: 10, rot: 90 },
    { clip: 'polygon(0 100%, 60% 50%, 100% 100%)', x: 20, y: 100, rot: -90 },
    { clip: 'polygon(0 60%, 40% 40%, 60% 50%, 0 100%)', x: -50, y: 50, rot: -30 },
  ];

  return (
    <AbsoluteFill style={{ zIndex: 200, pointerEvents: 'none' }}>
      {shards.map((s, i) => (
        <AbsoluteFill key={i} style={{ 
          clipPath: s.clip, 
          transform: `translate(${interpolate(p, [0, 1], [0, s.x])}%, ${interpolate(p, [0, 1], [0, s.y])}%) rotate(${interpolate(p, [0, 1], [0, s.rot])}deg) scale(${1 + p*0.2})`,
          opacity: interpolate(p, [0.5, 1], [1, 0])
        }}>
          <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px) brightness(1.2)', border: '2px solid rgba(255,255,255,0.8)' }} />
        </AbsoluteFill>
      ))}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: interpolate(p, [0, 0.1, 1], [0, 0.8, 0], { extrapolateRight: 'clamp' }) }} />
    </AbsoluteFill>
  );
};

export const SceneLiver: React.FC<{ theme: BattleSpiritTheme; duration: number; startFrame?: number }> = ({ theme, duration, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + startFrame;
  const isAltImageActive = theme.liver.altImage && theme.liver.altImageStartFrame && theme.liver.altImageEndFrame && absoluteFrame >= theme.liver.altImageStartFrame && absoluteFrame <= theme.liver.altImageEndFrame;
  const displayImage = isAltImageActive ? theme.liver.altImage! : theme.liver.image;

  if (theme.features.useDoublingGrid) {
    const staticImage = staticFile(displayImage);

    return (
      <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
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
      <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
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

  // --- Confetti Burst Effect ---
  const ConfettiBurst = ({ frame, startFrame }: { frame: number, startFrame: number }) => {
    if (frame < startFrame) return null;
    const duration = 60; // 2 seconds of burst
    if (frame >= startFrame + duration) return null;
    
    const p = interpolate(frame, [startFrame, startFrame + duration], [0, 1], { extrapolateRight: 'clamp' });
    
    return (
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
        {new Array(80).fill(0).map((_, i) => {
          const seed = i * 153;
          const angle = random(seed) * Math.PI * 2;
          const speed = random(seed + 1) * 1500 + 500;
          // Apply gravity
          const gravity = Math.pow(p * 2, 2) * 500;
          const dist = p * speed;
          const x = Math.cos(angle) * dist;
          const y = Math.sin(angle) * dist + gravity;
          const size = random(seed + 2) * 40 + 15;
          const rot = (frame - startFrame) * (random(seed + 3) * 20 - 10);
          const color = ['#ff80ab', '#f06292', '#FFD700', '#ffffff', '#81d4fa'][i % 5];
          const scale = interpolate(p, [0, 0.1, 0.8, 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          return (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: '50%',
              width: size, height: size, backgroundColor: color,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg) scale(${scale})`,
              borderRadius: i % 3 === 0 ? '50%' : '5px',
              boxShadow: `0 0 10px ${color}`
            }} />
          );
        })}
      </AbsoluteFill>
    );
  };

  // --- Confetti Burst Effect ---
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
      // Shatter/Glass Crash shake starts at 350fr (relative 20)
      const localFrame = frame - 20;
      const shakeInt = localFrame >= 0 && localFrame < 15 ? Math.max(0, 1 -  localFrame / 15) : 0;
      const shakeX = (random(localFrame) - 0.5) * 80 * shakeInt;
      const shakeY = (random(localFrame + 1) - 0.5) * 80 * shakeInt;
      dynamicTransform = `translate(${shakeX}px, ${shakeY}px) scale(${1 + shakeInt * 0.15})`;
    } else {
      // 445fr~ -> 115~ inside SceneLiver
      dynamicTransform = 'none';
    }

    return (
      <AbsoluteFill style={{ overflow: 'visible', backgroundColor: 'transparent', filter: dynamicFilter, transform: dynamicTransform, transformOrigin: 'center' }}>
        <ConfettiBurst frame={frame} startFrame={25} />
        <GlassCrashOverlay frame={frame - 20} />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {isPart1 ? (
             <div style={{ transform: `scale(${entranceScale})`, opacity: entranceOpacity, filter: `drop-shadow(0 0 100px ${theme.glowColor})` }}>
               <Img src={staticFile(currentImage)} style={{ width: 850, height: 1200, objectFit: 'contain' }} />
             </div>
          ) : (
             <div style={{ 
               transform: `scale(${p2Scale * p2Pop}) translateY(${Math.sin((frame - 116) * 0.1) * 20}px) rotate(${Math.sin((frame - 116) * 0.05) * 5}deg)`, 
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
    <AbsoluteFill style={{ overflow: 'visible', transform: dynamicTransform, filter: dynamicFilter, transformOrigin: 'center', backgroundColor: 'transparent' }}>
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
