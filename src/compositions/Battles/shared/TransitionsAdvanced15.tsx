import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, random } from 'remotion';
import { TransitionProps } from './Transitions15';

const getProgress = (frame: number, duration: number) => interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// 1. DoorOpenTransition
export const DoorOpenTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const slide = interpolate(p, [0, 1], [0, 100]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', transform: `translateX(${-slide}%)` }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)', transform: `translateX(${slide}%)` }}>{SceneA}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2. SwingPendulumTransition
export const SwingPendulumTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const rotX = interpolate(p, [0, 1], [0, -90]);
  return (
    <AbsoluteFill style={{ perspective: 1200, backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: 'top center', transform: `rotateX(${rotX}deg)`, zIndex: 2 }}>{SceneA}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3. CardFoldTransition
export const CardFoldTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const rotX = interpolate(p, [0, 0.5, 1], [0, -90, -90]);
  const rotXB = interpolate(p, [0, 0.5, 1], [90, 90, 0]);
  return (
    <AbsoluteFill style={{ perspective: 1200, backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}>{SceneB}</AbsoluteFill>
      
      {/* Folding Top Half of A */}
      <AbsoluteFill style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transformOrigin: 'center 50%', transform: `rotateX(${rotX}deg)`, zIndex: 3, backfaceVisibility: 'hidden' }}>{SceneA}</AbsoluteFill>
      {/* Unfolding Top Half of B */}
      <AbsoluteFill style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transformOrigin: 'center 50%', transform: `rotateX(${rotXB}deg)`, zIndex: 4, backfaceVisibility: 'hidden' }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 4. ZoomThroughTransition
export const ZoomThroughTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = Math.pow(getProgress(frame, duration), 3); // Exponential zoom
  const radius = interpolate(p, [0, 1], [0, 150]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ 
        WebkitMaskImage: `radial-gradient(circle, transparent ${radius}%, black ${radius + 5}%, black 100%)`,
        maskImage: `radial-gradient(circle, transparent ${radius}%, black ${radius + 5}%, black 100%)`,
        zIndex: 2
      }}>{SceneA}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 5. SwirlTwirlTransition
export const SwirlTwirlTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const rotA = 360 * Math.pow(p, 2);
  const scaleA = interpolate(p, [0, 1], [1, 0]);
  const rotB = -360 * Math.pow(1 - p, 2);
  const scaleB = interpolate(p, [0, 1], [0, 1]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* Faking a swirl with aggressive spin and heavy blur */}
      <AbsoluteFill style={{ transform: `scale(${scaleA}) rotate(${rotA}deg)`, filter: `blur(${p*50}px)`, opacity: 1-p }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scaleB}) rotate(${rotB}deg)`, filter: `blur(${(1-p)*50}px)`, opacity: p }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 6. BulgeLensTransition
export const BulgeLensTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  // Bulge expands aggressively and then pops
  const scale = p < 0.5 ? interpolate(p, [0, 0.5], [1, 1.8]) : interpolate(p, [0.5, 1], [2, 1]);
  const blur = p < 0.5 ? interpolate(p, [0, 0.5], [0, 20]) : interpolate(p, [0.5, 1], [20, 0]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p < 0.5 ? (
        <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `url(#bulge-filter) blur(${blur}px)` }}>{SceneA}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `url(#bulge-filter) blur(${blur}px)` }}>{SceneB}</AbsoluteFill>
      )}
      <svg width="0" height="0">
        <filter id="bulge-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={p < 0.5 ? p*100 : (1-p)*100} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {p > 0.45 && p < 0.55 && <AbsoluteFill style={{ backgroundColor: 'white', opacity: interpolate(Math.abs(p - 0.5), [0, 0.05], [1, 0]) }} />}
    </AbsoluteFill>
  );
};

// 7. PixelStretchTransition
export const PixelStretchTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const stretchX = p < 0.5 ? interpolate(p, [0, 0.5], [1, 30]) : interpolate(p, [0.5, 1], [30, 1]);
  const stretchY = p < 0.5 ? interpolate(p, [0, 0.5], [1, 0.1]) : interpolate(p, [0.5, 1], [0.1, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
      {p < 0.5 ? (
        <AbsoluteFill style={{ transformOrigin: 'center', transform: `scale(${stretchX}, ${stretchY})` }}>{SceneA}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ transformOrigin: 'center', transform: `scale(${stretchX}, ${stretchY})` }}>{SceneB}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// 8. MeltingTransition
export const MeltingTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const melt = interpolate(Math.pow(p, 2), [0, 1], [0, 150]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${melt}%)`, filter: `url(#melt)` }}>{SceneA}</AbsoluteFill>
      <svg width="0" height="0">
        <filter id="melt">
          <feTurbulence type="fractalNoise" baseFrequency="0.001 0.1" numOctaves="1" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={melt * 2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// 9. ShatterGlassTransition
export const ShatterGlassTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 100, mass: 1 } });
  
  const shards = [
    { clip: 'polygon(0 0, 50% 50%, 0 100%)', x: -100, y: 0, rot: -45 },
    { clip: 'polygon(0 0, 100% 0, 50% 50%)', x: 0, y: -100, rot: 45 },
    { clip: 'polygon(100% 0, 100% 100%, 50% 50%)', x: 100, y: 0, rot: 90 },
    { clip: 'polygon(0 100%, 50% 50%, 100% 100%)', x: 0, y: 100, rot: -90 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {shards.map((s, i) => (
        <AbsoluteFill key={i} style={{ 
          clipPath: s.clip, 
          transform: `translate(${p * s.x}%, ${p * s.y}%) rotate(${p * s.rot}deg)`,
          opacity: interpolate(p, [0.5, 1], [1, 0])
        }}>{SceneA}</AbsoluteFill>
      ))}
      {frame === 0 && <AbsoluteFill style={{ backgroundColor: 'white', opacity: 0.8 }} />}
    </AbsoluteFill>
  );
};

// 10. SandDisintegrateTransition
export const SandDisintegrateTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const pct = interpolate(p, [0, 1], [-20, 120]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* SVGs mask image technique with turbulence to simulate sand blowing away */}
      <AbsoluteFill style={{ filter: `url(#sand)` }}>
        <AbsoluteFill style={{ 
          WebkitMaskImage: `linear-gradient(to right, transparent ${pct-20}%, black ${pct+20}%)`,
          maskImage: `linear-gradient(to right, transparent ${pct-20}%, black ${pct+20}%)`
        }}>{SceneA}</AbsoluteFill>
      </AbsoluteFill>
      <svg width="0" height="0">
        <filter id="sand">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={p * 150} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// 11. ConfettiBurstTransition
export const ConfettiBurstTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  return (
    <AbsoluteFill>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {/* 50 giant burst particles that cover the screen in the middle */}
      {new Array(50).fill(0).map((_, i) => {
        const seed = i * 153;
        const angle = random(seed) * Math.PI * 2;
        const speed = random(seed + 1) * 3000 + 1000;
        const dist = p * speed;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const size = random(seed + 2) * 200 + 50;
        const rot = frame * (random(seed + 3) * 10 - 5);
        const color = ['#ff0055', '#00ffcc', '#ffcc00', '#ffffff'][i % 4];
        const scale = p < 0.5 ? interpolate(p, [0, 0.5], [0, 1]) : interpolate(p, [0.5, 1], [1, 0]);
        return (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: size, height: size, backgroundColor: color,
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg) scale(${scale})`,
            borderRadius: i % 2 === 0 ? '50%' : '0%', zIndex: 10
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// 12. BurnThroughTransition
export const BurnThroughTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const r = interpolate(p, [0, 1], [0, 200]); // hole radius
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* Burn Rim */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle, transparent ${r}%, #ff5500 ${r+1}%, #ff2200 ${r+4}%, transparent ${r+10}%)`,
        mixBlendMode: 'screen', filter: 'blur(4px)', zIndex: 2
      }} />
      <AbsoluteFill style={{
        WebkitMaskImage: `radial-gradient(circle, transparent ${r}%, black ${r+2}%)`,
        maskImage: `radial-gradient(circle, transparent ${r}%, black ${r+2}%)`,
        zIndex: 1
      }}>{SceneA}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 13. CRTTVOffTransition
export const CRTTVOffTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  // Phase 1 (0-0.3): scaleY to 0.02
  // Phase 2 (0.3-0.5): scaleX to 0
  // Phase 3 (0.5) : flash
  // Phase 4 (0.5-1): scene B normal
  const scaleY = p < 0.3 ? interpolate(p, [0, 0.3], [1, 0.02]) : (p < 0.5 ? 0.02 : 1);
  const scaleX = p < 0.3 ? 1 : (p < 0.5 ? interpolate(p, [0.3, 0.5], [1, 0]) : 1);
  const flash = p > 0.45 && p < 0.55 ? 1 : 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p >= 0.5 ? <AbsoluteFill>{SceneB}</AbsoluteFill> : (
        <AbsoluteFill style={{ transform: `scale(${scaleX}, ${scaleY})` }}>{SceneA}</AbsoluteFill>
      )}
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: 'white', filter: 'blur(20px)' }} />}
    </AbsoluteFill>
  );
};

// 14. PaintBrushTransition
export const PaintBrushTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const length = interpolate(p, [0, 1], [3000, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{
        WebkitMaskImage: 'url(#brush-mask)', maskImage: 'url(#brush-mask)', backgroundColor: 'white'
      }}>
        {SceneA}
      </AbsoluteFill>
      
      <svg width="0" height="0">
        <mask id="brush-mask">
          {/* A squiggly path acting as the brush covering the screen */}
          <path d="M-200,200 Q400,0 1200,200 T2200,200 L2200,1000 L-200,1000 Z" fill="white" />
          {/* An animated stroke wiping away the mask */}
          <path d="M-100,500 L1200,500 M-100,600 L1200,600 M-100,700 L1200,700M-100,200 L1200,200 M-100,300 L1200,300 M-100,400 L1200,400 M-100,800 L1200,800 M-100,900 L1200,900 M-100,1000 L1200,1000 M-100,1100 L1200,1100" fill="none" stroke="black" strokeWidth="150" strokeDasharray="3000" strokeDashoffset={length} strokeLinecap="round" />
        </mask>
      </svg>
    </AbsoluteFill>
  );
};

// 15. HalftoneWipeTransition
export const HalftoneWipeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  // Expanding halftone dots
  const dotSize = 40;
  const radius = interpolate(p, [0, 1], [0, dotSize * 1.5]);
  
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ 
        WebkitMaskImage: `radial-gradient(circle, transparent ${radius}px, black ${radius + 2}px)`,
        maskImage: `radial-gradient(circle, transparent ${radius}px, black ${radius + 2}px)`,
        WebkitMaskSize: `${dotSize}px ${dotSize}px`,
        maskSize: `${dotSize}px ${dotSize}px`,
      }}>{SceneA}</AbsoluteFill>
    </AbsoluteFill>
  );
};
