import React from 'react';
import { AbsoluteFill, interpolate, spring, useVideoConfig, random } from 'remotion';

export interface TransitionProps {
  frame: number;
  duration: number;
  SceneA: React.ReactNode;
  SceneB: React.ReactNode;
  themeColor?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const getProgress = (frame: number, duration: number) => interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// ===============================
// 1. Zoom Transition
// ===============================
export const ZoomTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${interpolate(p, [0, 1], [1, 5])})`, opacity: interpolate(p, [0.5, 1], [1, 0]), zIndex: 1 }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${interpolate(p, [0, 1], [0.2, 1])})`, opacity: interpolate(p, [0, 0.5], [0, 1]), zIndex: 0 }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 2. Whip Pan Transition
// ===============================
export const WhipPanTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB, direction = 'left' }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const isHorizontal = direction === 'left' || direction === 'right';
  const mult = direction === 'left' || direction === 'up' ? -1 : 1;
  const blur = Math.sin(p * Math.PI) * 40; // Max blur in middle

  const tA = interpolate(p, [0, 1], [0, 100 * mult]);
  const tB = interpolate(p, [0, 1], [-100 * mult, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transform: `translate${isHorizontal ? 'X' : 'Y'}(${tA}%)`, filter: `blur(${blur}px)`, zIndex: 1, opacity: p > 0.5 ? 0 : 1 }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate${isHorizontal ? 'X' : 'Y'}(${tB}%)`, filter: `blur(${blur}px)`, zIndex: 2, opacity: p > 0.5 ? 1 : 0 }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 3. Spin Transition
// ===============================
export const SpinTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const rotA = interpolate(p, [0, 1], [0, 180]);
  const scaleA = interpolate(p, [0, 1], [1, 0]);
  const rotB = interpolate(p, [0, 1], [-180, 0]);
  const scaleB = interpolate(p, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transform: `rotate(${rotA}deg) scale(${scaleA})`, zIndex: 1 }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `rotate(${rotB}deg) scale(${scaleB})`, zIndex: 2 }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 4. Push 3D Cube Transition
// ===============================
export const Push3DTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const rotYA = interpolate(p, [0, 1], [0, -90]);
  const rotYB = interpolate(p, [0, 1], [90, 0]);
  return (
    <AbsoluteFill style={{ perspective: 1000, backgroundColor: '#000' }}>
      <AbsoluteFill style={{ transformOrigin: 'right center', transform: `rotateY(${rotYA}deg)`, zIndex: p < 0.5 ? 2 : 1 }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: 'left center', transform: `rotateY(${rotYB}deg)`, zIndex: p < 0.5 ? 1 : 2 }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 5. Cross Blur Transition
// ===============================
export const CrossBlurTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const blurA = interpolate(p, [0, 1], [0, 80]);
  const blurB = interpolate(p, [0, 1], [80, 0]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${blurA}px)`, opacity: interpolate(p, [0, 1], [1, 0]) }}>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${blurB}px)`, opacity: interpolate(p, [0, 1], [0, 1]) }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 6. Light Leak / Film Burn
// ===============================
export const LightLeakTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB, themeColor = '#ff8800' }) => {
  const p = getProgress(frame, duration);
  const flash = Math.sin(p * Math.PI); // 0 -> 1 -> 0
  
  return (
    <AbsoluteFill>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {/* Light leak overlay */}
      <AbsoluteFill style={{ opacity: flash, background: `linear-gradient(45deg, ${themeColor}, #ffffff)`, mixBlendMode: 'screen', filter: 'blur(20px)' }} />
      <AbsoluteFill style={{ opacity: flash > 0.8 ? (flash - 0.8)*5 : 0, backgroundColor: 'white' }} />
    </AbsoluteFill>
  );
};

// ===============================
// 7. Luma Fade / Gradient Wipe
// ===============================
export const GradientWipeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const pct = interpolate(p, [0, 1], [-50, 150]);
  // Use maskImage mapped transparent to black.
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill 
        style={{ 
          WebkitMaskImage: `linear-gradient(to right, black ${pct - 50}%, transparent ${pct + 50}%)`,
          maskImage: `linear-gradient(to right, black ${pct - 50}%, transparent ${pct + 50}%)`
        }}
      >
        {SceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 8. Iris / Circle Wipe
// ===============================
export const IrisCircleTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const radius = interpolate(p, [0, 1], [0, 150]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${radius}% at 50% 50%)` }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 9. Shape Wipe (Diamond)
// ===============================
export const ShapeWipeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const r = interpolate(p, [0, 1], [0, 150]); // Expansion
  // Diamond path
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)` }}>
        {SceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 10. Blinds / Venetian
// ===============================
export const BlindsWipeTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const pct = interpolate(p, [0, 1], [0, 100]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill 
        style={{ 
          WebkitMaskImage: `repeating-linear-gradient(to bottom, black 0%, black ${pct}%, transparent ${pct}%, transparent 10%)`,
          maskImage: `repeating-linear-gradient(to bottom, black 0%, black ${pct}%, transparent ${pct}%, transparent 10%)`
        }}
      >
        {SceneB}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 11. Slice Split
// ===============================
export const SliceSplitTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14 } });
  const offset = interpolate(p, [0, 1], [0, 100]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>{SceneB}</AbsoluteFill>
      {/* Top Half flying left */}
      <AbsoluteFill style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transform: `translateX(${-offset}%)` }}>{SceneA}</AbsoluteFill>
      {/* Bottom Half flying right */}
      <AbsoluteFill style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', transform: `translateX(${offset}%)` }}>{SceneA}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 12. Glitch Transition
// ===============================
export const GlitchTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const isGlitching = p > 0.2 && p < 0.8;
  const jitterX = isGlitching ? (random(frame) - 0.5) * 50 : 0;
  
  return (
    <AbsoluteFill>
      {p < 0.5 ? <AbsoluteFill>{SceneA}</AbsoluteFill> : <AbsoluteFill>{SceneB}</AbsoluteFill>}
      {isGlitching && (
        <>
          <AbsoluteFill style={{ transform: `translateX(${jitterX}px)`, mixBlendMode: 'difference', filter: 'hue-rotate(90deg)', opacity: 0.5 }}>
            {p < 0.5 ? SceneA : SceneB}
          </AbsoluteFill>
          {/* Glitch Noise bars */}
          {new Array(5).fill(0).map((_, i) => (
             <div key={i} style={{ position: 'absolute', top: `${random(frame + i)*100}%`, left: 0, width: '100%', height: `${random(frame + i + 1)*10}%`, backgroundColor: 'white', mixBlendMode: 'overlay', opacity: random(frame + i + 2) }} />
          ))}
        </>
      )}
    </AbsoluteFill>
  );
};

// ===============================
// 13. Pixelate (Mosaic blocky hack)
// ===============================
export const PixelateTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  // Hack to pixelate using React: render deeply scaled down and up with image-rendering (works somewhat, but really requires SVG `<feFlood>`)
  // For standard Remotion components, a heavy blur + contrast can simulate mosaic, or we just drop the resolution by forcing a tiny width container if it was an Img, but for arbitrary ReactNode, standard CSS pixelation isn't universally supported.
  // We will fake it with a sliding grid blocks effect if native pixelate is hard.
  const blocks = 10;
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      {p > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${blocks}, 1fr)`, gridTemplateRows: `repeat(${blocks}, 1fr)`, width: '100%', height: '100%' }}>
          {new Array(blocks*blocks).fill(0).map((_, i) => {
            const rx = i % blocks;
            const ry = Math.floor(i / blocks);
            // reveal threshold based on random seed
            const threshold = random(i);
            const isRevealed = p > threshold;
            return (
              <div key={i} style={{ width: '100%', height: '100%', overflow: 'hidden', opacity: isRevealed ? 1 : 0 }}>
                {/* Positional offset trick to show the exact chunk of SceneB */}
                <div style={{ width: '1080px', height: '1920px', position: 'relative', left: `-${rx * (1080/blocks)}px`, top: `-${ry * (1920/blocks)}px` }}>
                  {SceneB}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ===============================
// 14. Ripple Liquid (SVG feTurbulence)
// ===============================
export const RippleLiquidTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  const intensity = Math.sin(p * Math.PI) * 100; // max 100
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="ripple">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={intensity} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {p < 0.5 ? (
        <AbsoluteFill style={{ filter: 'url(#ripple)' }}>{SceneA}</AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ filter: 'url(#ripple)' }}>{SceneB}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ===============================
// 15. Ink Drop (Irregular mask)
// ===============================
export const InkDropTransition: React.FC<TransitionProps> = ({ frame, duration, SceneA, SceneB }) => {
  const p = getProgress(frame, duration);
  // Simulate an ink blotch expanding by scaling an irregular blob SVG
  const scale = interpolate(p, [0, 1], [0, 30]);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{SceneA}</AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: 'url(#ink)', maskImage: 'url(#ink)', WebkitMaskPosition: 'center', maskPosition: 'center', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: `${scale*100}%` }}>
        <svg width="0" height="0">
          <clipPath id="ink" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.2 C0.8,0.1 0.9,0.4 0.8,0.6 C0.7,0.8 0.4,1 0.2,0.8 C0,0.6 0.2,0.3 0.5,0.2 Z" />
          </clipPath>
        </svg>
        <AbsoluteFill style={{ clipPath: 'url(#ink)', transform: `scale(${scale === 0 ? 0 : scale})` }}>
          {SceneB}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* Since CSS masks with SVG can be tricky on some browsers inside Remotion, we forcefully use drop-shadow/scale trick on a white overlay if we want, but CSS mask-size works flawlessly! */}
      <AbsoluteFill style={{ clipPath: `circle(${interpolate(p, [0, 1], [0, 150])}% at 50% 50%)` }}>{SceneB}</AbsoluteFill>
    </AbsoluteFill>
  );
};
