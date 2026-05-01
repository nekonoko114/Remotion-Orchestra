import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate, Img, staticFile } from 'remotion';

const SAKURA_IMAGES = [
  'assets/images/sakura-fill-01.svg',
  'assets/images/sakura-fill-02.svg',
  'assets/images/sakura-fill-03.svg',
  'assets/images/sakura-fill-04.svg',
  'assets/images/sakura-fill-05.svg',
  'assets/images/sakura-fill-06.svg',
  'assets/images/sakura-fill-07.svg',
  'assets/images/sakura-fill-08.svg',
  'assets/images/sakura-one-01.svg',
  'assets/images/sakura-one-02.svg',
  'assets/images/sakura-one-03.svg',
];

// ===============================
// 1. Sakura Petals Effect
// ===============================
export const SakuraPetalsEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const petals = 30;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {new Array(petals).fill(0).map((_, i) => {
        const seed = i * 1337;
        const startX = random(seed) * width;
        const speedY = random(seed + 1) * 15 + 8; // Faster falling
        const speedX = random(seed + 2) * 5 - 2;
        const y = (frame * speedY) % (height + 100) - 50;
        const x = startX + frame * speedX + Math.sin(frame / 20 + seed) * 30;
        const rot = frame * (random(seed + 3) * 3 + 1);
        const scale = random(seed + 4) * 1.5 + 0.8; // 0.8 to 2.3 for depth
        const imgIndex = Math.floor(random(seed + 5) * SAKURA_IMAGES.length);

        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
            width: 40, height: 40, 
            opacity: interpolate(y, [-50, 0, height, height+100], [0, 1, 1, 0]),
            filter: 'drop-shadow(0 0 5px rgba(255, 183, 197, 0.6))'
          }}>
            <Img src={staticFile(SAKURA_IMAGES[imgIndex])} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 2. Fire Sparks Effect
// ===============================
export const FireSparksEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const sparks = 40;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', mixBlendMode: 'screen', pointerEvents: 'none' }}>
      {new Array(sparks).fill(0).map((_, i) => {
        const seed = i * 999;
        const startX = random(seed) * width;
        const speedY = random(seed + 1) * 5 + 3; // Float up fast
        const y = height + 50 - ((frame * speedY) % (height + 100));
        const x = startX + Math.sin(frame / 10 + seed) * 50;
        const size = random(seed + 2) * 8 + 2;
        const rot = frame * (random(seed + 3) * 10);
        const isRed = random(seed + 4) > 0.5;

        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
            width: size, height: size,
            backgroundColor: isRed ? '#ff4500' : '#ffa500',
            borderRadius: '50%',
            boxShadow: `0 0 ${size*2}px ${isRed ? '#ff0000' : '#ffff00'}`,
            opacity: interpolate(y, [0, height/2, height], [0, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 3. Matrix Rain Effect
// ===============================
export const MatrixRainEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const columns = Math.floor(width / 30); // 30px per column
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  return (
    <AbsoluteFill style={{ overflow: 'hidden', mixBlendMode: 'screen', pointerEvents: 'none' }}>
      {new Array(columns).fill(0).map((_, i) => {
        const seed = i * 555;
        const length = Math.floor(random(seed) * 10) + 10;
        const speed = random(seed + 1) * 15 + 10;
        const yHead = (frame * speed) % 2500 - 500;
        
        return (
          <div key={i} style={{ position: 'absolute', left: i * 30, top: 0, width: 30, textAlign: 'center' }}>
            {new Array(length).fill(0).map((__, j) => {
              const char = chars.charAt(Math.floor(random(seed + j + frame*0.1) * chars.length));
              const y = yHead - j * 30; // 30px spacing
              const isHead = j === 0;
              return (
                <div key={j} style={{
                  position: 'absolute', top: y, left: 0, width: '100%',
                  color: isHead ? '#fff' : '#0f0', fontWeight: 'bold', fontSize: 24,
                  textShadow: '0 0 10px #0f0', opacity: 1 - (j / length),
                  fontFamily: 'monospace'
                }}>
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 4. Snowstorm Effect
// ===============================
export const SnowstormEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const flakes = 60;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {new Array(flakes).fill(0).map((_, i) => {
        const seed = i * 444;
        const startX = random(seed) * width;
        const speedY = random(seed + 1) * 8 + 6; // fast diagonal wind
        const speedX = random(seed + 2) * 5 + 3; // blowing right
        const y = (frame * speedY) % (height + 100) - 50;
        const x = (startX + frame * speedX) % (width + 100) - 50;
        const size = random(seed + 3) * 6 + 2;
        const blur = random(seed + 4) * 4;

        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            transform: `translate(${x}px, ${y}px)`,
            width: size, height: size,
            backgroundColor: 'white', borderRadius: '50%',
            opacity: random(seed + 5) * 0.5 + 0.3,
            filter: `blur(${blur}px)`
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 5. Camera Quake Effect
// ===============================
export const CameraQuakeEffect: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // We shake every frame! (In real usage, maybe we bound it to a duration)
  const x = (random(frame) - 0.5) * 30;
  const y = (random(frame + 1) - 0.5) * 30;
  const r = (random(frame + 2) - 0.5) * 2;

  return (
    <div style={{ flex: 1, backgroundColor: 'transparent', transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.05)` }}>
      {children}
    </div>
  );
};

// ===============================
// 6. RGB Pulse Effect
// ===============================
export const RGBPulseEffect: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // Pulses entirely based on sine wave to simulate beat pulsing
  const pulse = Math.abs(Math.sin(frame / 5)); // 0 to 1 rapidly
  const offset = pulse * 15; // up to 15px split

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', backgroundColor: 'transparent' }}>
      {/* Base children */}
      <div style={{ flex: 1 }}>{children}</div>
      {/* Overlays */}
      <AbsoluteFill style={{ transform: `translateX(${-offset}px) scale(${1 + pulse*0.05})`, mixBlendMode: 'screen', filter: 'opacity(0.6) drop-shadow(0 0 0 red)' }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${offset}px) scale(${1 + pulse*0.05})`, mixBlendMode: 'screen', filter: 'opacity(0.6) drop-shadow(0 0 0 cyan)' }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 7. Cinematic Lens Flare Effect
// ===============================
export const CinematicLensFlareEffect: React.FC = () => {
  const frame = useCurrentFrame();
  // Flare sweeps across the screen endlessly
  const pos = (frame * 5) % 150 - 25; // -25% to 125%

  return (
    <AbsoluteFill style={{ overflow: 'hidden', mixBlendMode: 'screen', pointerEvents: 'none' }}>
      <AbsoluteFill style={{ 
        background: `linear-gradient(25deg, transparent ${pos}%, rgba(0, 255, 255, 0.4) ${pos + 2}%, rgba(255, 255, 255, 0.9) ${pos + 5}%, rgba(255, 0, 150, 0.4) ${pos + 8}%, transparent ${pos + 10}%)`,
        filter: 'blur(10px)', opacity: 0.8 
      }} />
      <AbsoluteFill style={{ 
        background: `linear-gradient(25deg, transparent ${pos}%, rgba(255, 255, 255, 0.2) ${pos + 4}%, transparent ${pos + 6}%)`,
        transform: 'rotate(-10deg)' 
      }} />
    </AbsoluteFill>
  );
};

// ===============================
// 8. Light Leaks Effect
// ===============================
export const LightLeaksEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  const move1 = Math.sin(frame / 30) * 100;
  const move2 = Math.cos(frame / 20) * 150;

  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ 
        position: 'absolute', top: -100 + move1, left: -200 + move2, width: 800, height: 800, 
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,0,0.4) 0%, transparent 70%)', filter: 'blur(60px)' 
      }} />
      <div style={{ 
        position: 'absolute', bottom: -100 - move2, right: -200 - move1, width: 900, height: 900, 
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,150,0.3) 0%, transparent 70%)', filter: 'blur(80px)' 
      }} />
      <div style={{ 
        position: 'absolute', top: height/2 + move1*2, left: width/2 - move2, width: 1000, height: 500, 
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.2) 0%, transparent 70%)', filter: 'blur(100px)' 
      }} />
    </AbsoluteFill>
  );
};

// ===============================
// 9. Lightning Blitz Effect
// ===============================
export const LightningBlitzEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  // Lightning strikes every ~15 frames randomly
  const isStrike = (Math.floor(frame / 5) % 3 === 0) && (random(Math.floor(frame / 5)) > 0.5);
  
  if (!isStrike) return null;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <svg width="100%" height="100%" style={{ filter: 'drop-shadow(0 0 20px cyan)' }}>
        <path d={`M ${random(frame)*width} 0 L ${random(frame+1)*width} ${height*0.3} L ${random(frame+2)*width} ${height*0.6} L ${random(frame+3)*width} ${height}`} 
              stroke="white" strokeWidth={random(frame+4)*10 + 5} fill="none" strokeLinecap="round" strokeLinejoin="miter" />
        <path d={`M ${random(frame+5)*width} 0 L ${random(frame+6)*width} ${height*0.5} L ${random(frame+7)*width} ${height}`} 
              stroke="#0ff" strokeWidth={random(frame+8)*5 + 2} fill="none" />
      </svg>
      {/* Flash */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(255,255,255,0.3)', mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

// ===============================
// 10. Shockwave Ring Effect
// ===============================
export const ShockwaveRingEffect: React.FC = () => {
  const frame = useCurrentFrame();
  // Loop continuous shockwaves every 30 frames
  const localFrame = frame % 30;
  const p = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const scale = p * 3;
  const opacity = interpolate(p, [0, 0.8, 1], [0, 1, 0]);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        border: '30px solid rgba(255,255,255,0.8)',
        boxShadow: '0 0 50px rgba(0,255,255,0.8), inset 0 0 50px rgba(0,255,255,0.8)',
        transform: `scale(${scale})`, opacity: opacity, filter: 'blur(2px)'
      }} />
    </AbsoluteFill>
  );
};

// ===============================
// 11. Radial Speed Lines Effect
// ===============================
export const RadialSpeedLinesEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const numLines = 60;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `rotate(${frame*2}deg)` }}>
        {new Array(numLines).fill(0).map((_, i) => {
          const angle = (i * 360) / numLines;
          const length = random(i) * 500 + 400; // 400 to 900
          const thickness = random(i + 1) * 8 + 2;
          const offset = random(i + 2) * 200 + 200; // Hole in the middle
          
          return (
            <div key={i} style={{
              position: 'absolute', 
              width: length, height: thickness, backgroundColor: 'white',
              transform: `rotate(${angle}deg) translate(${offset + (frame*10 % 100)}px)`,
              opacity: random(i + frame*0.1) > 0.3 ? 0.8 : 0, // Rapid blinking
              boxShadow: '0 0 10px white'
            }} />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===============================
// 12. VHS Overlay Effect
// ===============================
export const VHSOverlayEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const scanlineY = (frame * 5) % 1920;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 999 }}>
      {/* Heavy Scanlines */}
      <AbsoluteFill style={{
        background: `repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)`
      }} />
      {/* Thick moving tracking bar */}
      <AbsoluteFill style={{
        top: scanlineY, height: 100, width: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)',
        mixBlendMode: 'screen', opacity: 0.5
      }} />
      {/* Chromatic abberation blur via pseudo-elements is hard in inline style, we use SVG filter */}
      <svg width="0" height="0">
        <filter id="vhs-glitch">
          <feOffset dx="3" dy="0" in="SourceGraphic" result="red-clip" />
          <feOffset dx="-3" dy="0" in="SourceGraphic" result="blue-clip" />
          <feBlend in="red-clip" in2="blue-clip" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: 'url(#vhs-glitch)' }} />
      {/* Font details */}
      <h1 style={{ position: 'absolute', top: 50, left: 50, color: '#fff', fontSize: 60, fontFamily: 'monospace', textShadow: '2px 2px 0 #000' }}>PLAY</h1>
      <h1 style={{ position: 'absolute', bottom: 50, left: 50, color: '#fff', fontSize: 40, fontFamily: 'monospace', textShadow: '2px 2px 0 #000' }}>SP 0:00:{(frame/30).toFixed(2).padStart(5, '0')}</h1>
    </AbsoluteFill>
  );
};

// ===============================
// 13. Digital Glitch Effect
// ===============================
export const DigitalGlitchEffect: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // Is it glitching right now?
  const isGlitching = random(Math.floor(frame / 6)) > 0.7; // Occasional bursts

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', pointerEvents: 'none' }}>
      <div style={{ flex: 1, filter: isGlitching ? `hue-rotate(${random(frame)*90}deg) contrast(1.5)` : 'none' }}>
        {children}
      </div>
      {/* Slices of screen displacing completely! */}
      {isGlitching && new Array(5).fill(0).map((_, i) => {
        const h = random(frame + i) * 200 + 50;
        const y = random(frame + i + 1) * 1920;
        const xOffset = (random(frame + i + 2) - 0.5) * 300;
        return (
          <AbsoluteFill key={i} style={{
            clipPath: `polygon(0 ${y}px, 100% ${y}px, 100% ${y + h}px, 0 ${y + h}px)`,
            transform: `translateX(${xOffset}px)`,
            filter: 'contrast(2) saturate(3)',
            mixBlendMode: 'difference' // intense color distortion
          }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)' }}>{children}</div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 14. Hologram Flicker Effect
// ===============================
export const HologramFlickerEffect: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const isFlickering = random(frame) > 0.8;
  const opacity = isFlickering ? random(frame + 1) * 0.5 + 0.2 : 0.85;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', pointerEvents: 'none' }}>
      <AbsoluteFill style={{
        opacity, filter: 'sepia(1) hue-rotate(180deg) saturate(3) blur(1px)', mixBlendMode: 'screen'
      }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{
        background: `repeating-linear-gradient(to bottom, transparent, transparent 4px, rgba(0, 255, 255, 0.2) 5px)`,
        pointerEvents: 'none'
      }} />
      {/* Hologram scanline rising up */}
      <AbsoluteFill style={{
        top: 1920 - ((frame * 10) % 2500), height: 200, width: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(0,255,255,0.4), transparent)',
        mixBlendMode: 'screen'
      }} />
    </AbsoluteFill>
  );
};

// ===============================
// 15. Film Grain Dust Effect
// ===============================
export const FilmGrainDustEffect: React.FC = () => {
  const frame = useCurrentFrame();
  // We use SVG fractalNoise filtering overlaid constantly changing to simulate physical film dirt
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.6 }}>
      <svg width="100%" height="100%">
        <filter id="film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" seed={frame % 10} />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
