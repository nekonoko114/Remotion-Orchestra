import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, random } from 'remotion';
import { TransitionProps } from './Transitions15';

const getProgress = (frame: number, duration: number) => interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// ===============================
// 1. Typography Mask Transition
// ===============================
export const TypographyMaskTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = Math.pow(getProgress(frame, duration), 3); // exponential growth
  const scale = interpolate(p, [0, 1], [0.5, 50]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ 
        WebkitMaskImage: `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><text x="50%" y="50%" font-family="Arial" font-weight="bold" font-size="300" text-anchor="middle" dominant-baseline="central" fill="black">NEXT</text></svg>')`,
        maskImage: `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><text x="50%" y="50%" font-family="Arial" font-weight="bold" font-size="300" text-anchor="middle" dominant-baseline="central" fill="black">NEXT</text></svg>')`,
        WebkitMaskPosition: 'center', maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
        WebkitMaskSize: `${scale*100}%`, maskSize: `${scale*100}%`
      }}>
        {SceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 2. Comic Panel Split Transition
// ===============================
export const ComicPanelSplitTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14 } });
  const offset1 = interpolate(p, [0, 1], [100, 0]);
  const offset2 = interpolate(p, [0, 1], [-100, 0]);
  const offset3 = interpolate(p, [0, 1], [100, 0]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff' }}>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      {/* 3 Comic Panels sliding in to cover the screen entirely */}
      <AbsoluteFill style={{ clipPath: 'polygon(0 0, 100% 0, 0 40%)', transform: `translate(${offset1}%, ${-offset1}%)`, borderBottom: '10px solid white' }}>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: 'polygon(100% 0, 100% 60%, 0 40%)', transform: `translateX(${-offset2}%)` }}>{SceneB}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: 'polygon(0 40%, 100% 60%, 100% 100%, 0 100%)', transform: `translate(${offset3}%, ${offset3}%)`, borderTop: '10px solid white' }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 3. Cinematic Black Bars Transition
// ===============================
export const CinematicBlackBarsTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  // 0 -> 0.4: close fast
  // 0.4 -> 0.6: stay closed
  // 0.6 -> 1: open very fast
  const h = p < 0.4 ? interpolate(p, [0, 0.4], [0, 50.5]) : p < 0.6 ? 50.5 : interpolate(p, [0.6, 1], [50.5, 0]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      <AbsoluteFill style={{ top: 0, height: `${h}%`, backgroundColor: 'black', zIndex: 10 }} />
      <AbsoluteFill style={{ bottom: 0, height: `${h}%`, backgroundColor: 'black', top: 'auto', zIndex: 10 }} />
    </AbsoluteFill>
  );
};

// ===============================
// 4. Speed Ramp Zoom Blur
// ===============================
export const SpeedRampZoomTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const zA = interpolate(p, [0, 1], [1, 5]);
  const zB = interpolate(p, [0, 1], [0.2, 1]);
  const blur = p < 0.5 ? interpolate(p, [0, 0.5], [0, 100]) : interpolate(p, [0.5, 1], [100, 0]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p < 0.5 ? (
        <AbsoluteFill style={{ transform: `scale(${zA})`, filter: `brightness(${1 + p}) blur(${blur}px)` }}>{SceneA}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ transform: `scale(${zB})`, filter: `brightness(${1 + (1-p)}) blur(${blur}px)` }}>{SceneB}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ===============================
// 5. Strobe Flash Transition
// ===============================
export const StrobeFlashTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const isStrobeTime = p > 0.3 && p < 0.6;
  const isFlash = isStrobeTime ? Math.floor(frame / 2) % 2 === 0 : false;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {isStrobeTime && <AbsoluteFill style={{ backgroundColor: isFlash ? 'white' : 'black', mixBlendMode: 'normal', zIndex: 10 }} />}
      {p > 0.6 && p < 0.7 && <AbsoluteFill style={{ backgroundColor: 'white', opacity: interpolate(p, [0.6, 0.7], [1, 0]) }} />}
    </AbsoluteFill>
  );
};

// ===============================
// 6. Glitch Slice Offset
// ===============================
export const GlitchSliceOffsetTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const banding = 15;
  const isGlitching = p > 0.2 && p < 0.8;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {isGlitching && new Array(banding).fill(0).map((_, i) => {
        const top = (i * 100) / banding;
        const height = 100 / banding;
        const offset = (random(frame + i) - 0.5) * 200;
        const src = (random(frame + i*10) > 0.5) ? SceneA : SceneB;
        return (
          <AbsoluteFill key={i} style={{
            clipPath: `polygon(0 ${top}%, 100% ${top}%, 100% ${top + height}%, 0 ${top + height}%)`,
            transform: `translateX(${offset}px)`,
            filter: random(frame + i*2) > 0.8 ? 'hue-rotate(90deg) contrast(2)' : 'none'
          }}>
            {src}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 7. Negative Color Invert
// ===============================
export const NegativeColorInvertTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const invertVal = (p > 0.2 && p < 0.5) ? 100 : (p >= 0.5 && p < 0.8 ? 100 : 0);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      {p < 0.5 ? (
        <AbsoluteFill style={{ filter: `invert(${invertVal}%) hue-rotate(${invertVal}deg)` }}>{SceneA}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ filter: `invert(${invertVal}%) hue-rotate(${invertVal}deg)` }}>{SceneB}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ===============================
// 8. Ink Splatter Transition
// ===============================
export const InkSplatterTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = Math.pow(getProgress(frame, duration), 2);
  const size = interpolate(p, [0, 1], [0, 250]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{
        WebkitMaskImage: `radial-gradient(circle, black ${size/2}%, transparent ${size}%)`,
        maskImage: `radial-gradient(circle, black ${size/2}%, transparent ${size}%)`,
        filter: `url(#splatter)`
      }}>{SceneB}</AbsoluteFill>
      <svg width="0" height="0">
        <filter id="splatter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={150} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// ===============================
// 9. CMYK Color Split Transition
// ===============================
export const CMYKColorSplitTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const offset = p < 0.5 ? interpolate(p, [0, 0.5], [0, 100]) : interpolate(p, [0.5, 1], [100, 0]);
  const BaseScene = p < 0.5 ? SceneA : SceneB;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Three colored layers blending together with screen */}
      <AbsoluteFill style={{ transform: `translate(${-offset}px, ${-offset}px)`, mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(180deg) saturate(5)' }}>{BaseScene}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${offset}px, ${offset}px)`, mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(300deg) saturate(5)' }}>{BaseScene}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(0, 0)`, mixBlendMode: 'screen', filter: 'sepia(1) hue-rotate(60deg) saturate(5)' }}>{BaseScene}</AbsoluteFill>
      {/* Final snap */}
      {p > 0.8 && <AbsoluteFill style={{ opacity: interpolate(p, [0.8, 1], [0, 1]) }}>{SceneB}</AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ===============================
// 10. Screen Tear Transition
// ===============================
export const ScreenTearTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const slip = interpolate(p, [0, 1], [0, 150]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* Tear top right away */}
      <AbsoluteFill style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)', transform: `translate(${slip}%, ${-slip}%) rotate(${p*10}deg)` }}>{SceneA}</AbsoluteFill>
      {/* Tear bottom left away */}
      <AbsoluteFill style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%, 0 0)', transform: `translate(${-slip}%, ${slip}%) rotate(${-p*10}deg)` }}>{SceneA}</AbsoluteFill>
      {/* Heavy Tear line glow */}
      {p > 0.1 && p < 0.9 && (
        <AbsoluteFill style={{ 
          background: 'linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.8) 50%, transparent 52%)', 
          transform: `scale(${1 + p})`, mixBlendMode: 'overlay', filter: 'blur(5px)' 
        }} />
      )}
    </AbsoluteFill>
  );
};

// ===============================
// 11. Hyperspace Grid Transition
// ===============================
export const HyperspaceGridTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const z = interpolate(p, [0, 1], [0, 2000]); // intense forward motion
  
  return (
    <AbsoluteFill style={{ perspective: 500, backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transform: `translateZ(${z}px)`, opacity: interpolate(p, [0, 0.4], [1, 0]) }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateZ(${z - 2000}px)`, opacity: interpolate(p, [0.6, 1], [0, 1]) }}>{SceneB}</AbsoluteFill>
      {/* Flying passing lines / stars */}
      {p > 0.2 && p < 0.8 && new Array(30).fill(0).map((_, i) => (
        <AbsoluteFill key={i} style={{
          left: `${random(i)*100}%`, top: `${random(i+1)*100}%`, width: 4, height: 100,
          backgroundColor: '#0ff', transform: `translateZ(${z + random(i+2)*1000}px)`, boxShadow: '0 0 10px #0ff'
        }} />
      ))}
    </AbsoluteFill>
  );
};

// ===============================
// 12. Liquid Morph Transition
// ===============================
export const LiquidMorphTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const warp = p < 0.5 ? interpolate(p, [0, 0.5], [0, 500]) : interpolate(p, [0.5, 1], [500, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `url(#liquid) blur(${p < 0.5 ? p*20 : (1-p)*20}px)` }}>
        {p < 0.5 ? SceneA : SceneB}
      </AbsoluteFill>
      <svg width="0" height="0">
        <filter id="liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={warp} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// ===============================
// 13. CRT Tube Collapse Transition
// ===============================
export const CRTTubeCollapseTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const scale = interpolate(p, [0, 0.3], [1, 0]);
  const flash = p > 0.3 && p < 0.5 ? 1 : 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
      {p > 0.4 ? <AbsoluteFill>{SceneB}</AbsoluteFill> : (
        <AbsoluteFill style={{ transform: `scale(${scale})`, borderRadius: `${p * 50}%`, overflow: 'hidden' }}>
          {SceneA}
        </AbsoluteFill>
      )}
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: 'white' }} />}
    </AbsoluteFill>
  );
};

// ===============================
// 14. VHS Fast Forward Transition
// ===============================
export const VHSFastForwardTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const yScroll = (frame * 150) % 1920;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#111', filter: 'contrast(1.2)' }}>
      {p < 0.5 ? <AbsoluteFill style={{ transform: `translateY(${-yScroll}px)` }}>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {p < 0.5 && <AbsoluteFill style={{ transform: `translateY(${1920 - yScroll}px)` }}>{SceneA}</AbsoluteFill>}
      {/* Fast Forward scanning lines */}
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px)', opacity: p < 0.8 ? 1 : 0, mixBlendMode: 'screen' }} />
      {p > 0.4 && p < 0.6 && <h1 style={{ position: 'absolute', top: 100, right: 100, color: '#0f0', fontSize: 100, fontFamily: 'monospace' }}>▶▶ FF</h1>}
    </AbsoluteFill>
  );
};

// ===============================
// 15. Shape Burst Transition
// ===============================
export const ShapeBurstTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {/* Concentric bursting shapes */}
      {new Array(5).fill(0).map((_, i) => {
        const delays = i * 0.1;
        const adjustedP = Math.max(0, p - delays);
        const scale = interpolate(adjustedP, [0, 0.5], [0, 3], { extrapolateRight: 'clamp' });
        const strokeWidth = interpolate(adjustedP, [0, 0.5], [100, 0], { extrapolateRight: 'clamp' });
        return (
          <AbsoluteFill key={i} style={{
            position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${scale})`,
            width: 1000, height: 1000, border: `${strokeWidth}px solid white`, opacity: adjustedP > 0 ? 1 : 0,
            borderRadius: i % 2 === 0 ? '50%' : '0%', transformOrigin: 'center center' // alternating circles and squares
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
