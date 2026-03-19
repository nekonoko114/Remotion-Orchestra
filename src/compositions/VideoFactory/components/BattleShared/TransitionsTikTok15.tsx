import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, random } from 'remotion';
import { TransitionProps } from './Transitions15';

const getProgress = (frame: number, duration: number) => interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// ===============================
// 1. Time Warp Scan Transition
// ===============================
export const TimeWarpScanTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const y = p * 100; // 0 to 100%
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(0 ${y}%, 100% ${y}%, 100% 100%, 0 100%)` }}>{SceneA}</AbsoluteFill>
      {/* Neon Scanline */}
      <AbsoluteFill style={{ top: `${y}%`, height: 10, width: '100%', backgroundColor: '#0ff', boxShadow: '0 0 20px 10px rgba(0,255,255,0.8)', zIndex: 10 }} />
    </AbsoluteFill>
  );
};

// ===============================
// 2. Hyper Zoom Fish Eye Transition
// ===============================
export const HyperZoomFishEyeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const scale = p < 0.5 ? interpolate(p, [0, 0.5], [1, 5]) : interpolate(p, [0.5, 1], [0.2, 1]);
  const blur = p < 0.5 ? interpolate(p, [0, 0.5], [0, 50]) : interpolate(p, [0.5, 1], [50, 0]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p < 0.5 ? (
        <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `url(#fisheye) blur(${blur}px)` }}>{SceneA}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `url(#fisheye) blur(${blur}px)` }}>{SceneB}</AbsoluteFill>
      )}
      <svg width="0" height="0">
        <filter id="fisheye">
           <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" result="warp" />
           <feDisplacementMap in="SourceGraphic" in2="warp" scale={p < 0.5 ? p*300 : (1-p)*300} xChannelSelector="R" yChannelSelector="R" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// ===============================
// 3. Freeze Frame Snap Transition
// ===============================
export const FreezeSnapTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const { fps } = useVideoConfig();
  const p = getProgress(frame, duration);
  const isFlash = p > 0.1 && p < 0.2;
  const slide = p > 0.4 ? spring({ frame: frame - (duration * 0.4), fps, config: { damping: 14 } }) : 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* "Photo" of Scene A */}
      <AbsoluteFill style={{ 
        transform: `scale(${p > 0.1 ? 0.8 : 1}) translateX(${-slide * 150}%) rotate(${-slide * 20}deg)`,
        border: p > 0.1 ? '20px solid white' : 'none',
        boxShadow: p > 0.1 ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
        zIndex: 2
      }}>
        {SceneA}
      </AbsoluteFill>
      {isFlash && <AbsoluteFill style={{ backgroundColor: 'white', zIndex: 10 }} />}
    </AbsoluteFill>
  );
};

// ===============================
// 4. Luma Fade Quake Transition
// ===============================
export const LumaQuakeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const quakeX = (random(frame) - 0.5) * (1-p) * 100;
  const quakeY = (random(frame + 1) - 0.5) * (1-p) * 100;

  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ 
        transform: `translate(${quakeX}px, ${quakeY}px)`,
        filter: `contrast(1.5) brightness(${p * 2})`,
        mixBlendMode: 'screen',
        opacity: p
      }}>{SceneB}</AbsoluteFill>
      {p > 0.9 && <AbsoluteFill style={{ opacity: interpolate(p, [0.9, 1], [0, 1]) }}>{SceneB}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ===============================
// 5. Object Mask Wipe Transition
// ===============================
export const ObjectWipeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const x = interpolate(p, [0, 1], [-50, 150]); // object sweeps across
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${x}% 0, 100% 0, 100% 100%, ${x-20}% 100%)` }}>{SceneA}</AbsoluteFill>
      {/* A giant slanted black bar sweeping across, revealing B behind it */}
      <AbsoluteFill style={{ 
        left: `${x-30}%`, width: '40%', height: '120%', top: '-10%',
        backgroundColor: '#111', transform: 'skewX(-20deg)', boxShadow: '0 0 50px rgba(0,0,0,0.8)'
      }} />
    </AbsoluteFill>
  );
};

// ===============================
// 6. Watercolor Bleed Transition
// ===============================
export const WatercolorBleedTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ filter: 'url(#watercolor-bleed)', opacity: interpolate(p, [0, 0.2], [0, 1]) }}>
        {SceneB}
      </AbsoluteFill>
      <svg width="0" height="0">
        <filter id="watercolor-bleed">
          {/* Intense turbulence fading out */}
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={(1-p)*400} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// ===============================
// 7. Double Exposure Transition
// ===============================
export const DoubleExposureTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  return (
    <AbsoluteFill>
      {/* Scene A turns black and white high contrast */}
      <AbsoluteFill style={{ filter: `grayscale(${p * 100}%) contrast(${1 + p*2}) brightness(${1 - p*0.5})` }}>{SceneA}</AbsoluteFill>
      {/* Scene B layered on top with Screen blend */}
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: interpolate(p, [0, 0.8], [0, 1]) }}>{SceneB}</AbsoluteFill>
      {/* Fade fully to B at the end */}
      <AbsoluteFill style={{ opacity: interpolate(p, [0.8, 1], [0, 1]) }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 8. Torn Paper Edge Transition
// ===============================
export const TornPaperEdgeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const y = interpolate(p, [0, 1], [-20, 120]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* A rips downwards */}
      <AbsoluteFill style={{ clipPath: 'url(#torn-paper)' }}>
        <AbsoluteFill style={{ transform: `translateY(${-y}%)` }}>{SceneA}</AbsoluteFill>
      </AbsoluteFill>
      {/* Paper Mask Definition */}
      <svg width="0" height="0">
        <clipPath id="torn-paper" clipPathUnits="objectBoundingBox">
          {/* Jagged pseudo-random path using bezier curves */}
          <path d={`M0,0 L1,0 L1,0.5 Q0.9,0.52 0.8,0.48 T0.6,0.52 T0.4,0.47 T0.2,0.53 T0,0.5 Z`} />
        </clipPath>
      </svg>
      {/* Fallback to normal CSS wipe if SVG fails in some environments */}
      <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(to bottom, black ${y-10}%, transparent ${y+10}%)` }}>{SceneA}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 9. Film Roll Bounce Transition
// ===============================
export const FilmRollTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const yOff = interpolate(p, [0, 1], [0, -100]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      {/* Film strips container */}
      <AbsoluteFill style={{ transform: `translateY(${yOff}%)` }}>
        {/* A */}
        <AbsoluteFill style={{ top: '0%', height: '100%', padding: '0 40px', boxSizing: 'border-box' }}>
           <AbsoluteFill style={{ position: 'relative' }}>{SceneA}</AbsoluteFill>
        </AbsoluteFill>
        {/* B */}
        <AbsoluteFill style={{ top: '100%', height: '100%', padding: '0 40px', boxSizing: 'border-box' }}>
           <AbsoluteFill style={{ position: 'relative' }}>{SceneB}</AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      
      {/* Film Strip Sprocket Holes left & right */}
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(to bottom, transparent 0, transparent 40px, #fff 40px, #fff 60px)', width: 30, right: 'auto' }} />
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(to bottom, transparent 0, transparent 40px, #fff 40px, #fff 60px)', width: 30, left: 'auto' }} />
    </AbsoluteFill>
  );
};

// ===============================
// 10. VHS Rewind Transition
// ===============================
export const VHSRewindTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const noiseY = (frame * 50) % 2000;
  return (
    <AbsoluteFill style={{ filter: 'grayscale(0.3) contrast(1.2)' }}>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {/* VCR tearing and shaking */}
      <AbsoluteFill style={{ 
        transform: `skewX(${(random(frame)-0.5)*10}deg) translateX(${(random(frame+1)-0.5)*20}px)`, 
        opacity: p > 0.1 && p < 0.9 ? 1 : 0 
      }}>
        {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      </AbsoluteFill>
      {/* Tracking lines */}
      {p > 0.1 && p < 0.9 && (
        <AbsoluteFill style={{
          background: `repeating-linear-gradient(to bottom, transparent, rgba(255,255,255,0.2) 2px, transparent 4px)`,
          backgroundSize: '100% 10px',
          backgroundPosition: `0 ${noiseY}px`,
          mixBlendMode: 'screen'
        }} />
      )}
    </AbsoluteFill>
  );
};

// ===============================
// 11. Data Moshing Melt Transition
// ===============================
export const DataMoshingTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* FeDisplacementMap to drag pixels of A down wildly based on noise */}
      <AbsoluteFill style={{ filter: `url(#data-mosh)`, opacity: interpolate(p, [0.8, 1], [1, 0]) }}>{SceneA}</AbsoluteFill>
      <svg width="0" height="0">
        <filter id="data-mosh">
          <feTurbulence type="fractalNoise" baseFrequency="0.1 0.001" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={p * 1000} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// ===============================
// 12. Tesseract Cube 3D Transition
// ===============================
export const TesseractCubeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const rotA = interpolate(p, [0, 1], [0, -180]);
  const rotB = interpolate(p, [0, 1], [180, 0]);
  return (
    <AbsoluteFill style={{ perspective: 1500, backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transformStyle: 'preserve-3d', transform: `translateZ(-540px) rotateX(${rotA}deg) rotateY(${rotA*0.5}deg) translateZ(540px)`, backfaceVisibility: 'hidden', zIndex: p < 0.5 ? 2 : 1 }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ transformStyle: 'preserve-3d', transform: `translateZ(-540px) rotateX(${rotB}deg) rotateY(${rotB*0.5}deg) translateZ(540px)`, backfaceVisibility: 'hidden', zIndex: p < 0.5 ? 1 : 2 }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 13. Prism Shatter Transition
// ===============================
export const PrismShatterTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const splits = 6;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {new Array(splits).fill(0).map((_, i) => {
        const angle = (i * 360) / splits;
        const clipX = 50 + Math.cos((angle * Math.PI) / 180) * 100;
        const clipY = 50 + Math.sin((angle * Math.PI) / 180) * 100;
        const clipX2 = 50 + Math.cos(((angle + 360/splits) * Math.PI) / 180) * 100;
        const clipY2 = 50 + Math.sin(((angle + 360/splits) * Math.PI) / 180) * 100;
        return (
          <AbsoluteFill key={i} style={{ 
            clipPath: `polygon(50% 50%, ${clipX}% ${clipY}%, ${clipX2}% ${clipY2}%)`,
            transform: `translate(${Math.cos((angle * Math.PI)/180) * p * 200}px, ${Math.sin((angle * Math.PI)/180) * p * 200}px) rotate(${p * 45}deg)`,
            filter: `hue-rotate(${i * 60}deg) brightness(${1 + p*2})`,
            opacity: interpolate(p, [0.5, 1], [1, 0])
          }}>
            {SceneA}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 14. Cyber Neon Scan Transition
// ===============================
export const CyberNeonScanTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const y = p * 100;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(0 ${y}%, 100% ${y}%, 100% 100%, 0 100%)` }}>{SceneA}</AbsoluteFill>
      {/* Glowing Neon Laser */}
      <AbsoluteFill style={{
        top: `calc(${y}% - 5px)`, height: 10, width: '100%', 
        backgroundColor: '#fff', 
        boxShadow: '0 0 20px 10px #ff00ff, 0 0 50px 20px #00ffff',
        zIndex: 5
      }} />
      <AbsoluteFill style={{ opacity: interpolate(p, [0.9, 1], [0.5, 0]), backgroundColor: '#ff00ff', mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

// ===============================
// 15. RGB Split Flash Transition
// ===============================
export const RGBSplitFlashTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const flash = p > 0.4 && p < 0.6 ? 1 : 0;
  const splitDist = interpolate(Math.abs(p - 0.5), [0, 0.5], [50, 0]); // max split at middle
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p < 0.5 ? (
        <AbsoluteFill style={{ transform: `scale(${1 + p})` }}>{SceneA}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ transform: `scale(${1 + (1-p)})` }}>
          {/* Base Image */}
          <AbsoluteFill style={{ mixBlendMode: 'screen' }}>{SceneB}</AbsoluteFill>
          {/* RGB Split Layers */}
          <AbsoluteFill style={{ filter: 'opacity(0.8) drop-shadow(0 0 0 red)', transform: `translateX(${-splitDist}px)`, mixBlendMode: 'screen' }}>{SceneB}</AbsoluteFill>
          <AbsoluteFill style={{ filter: 'opacity(0.8) drop-shadow(0 0 0 cyan)', transform: `translateX(${splitDist}px)`, mixBlendMode: 'screen' }}>{SceneB}</AbsoluteFill>
        </AbsoluteFill>
      )}
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: 'white' }} />}
    </AbsoluteFill>
  );
};
