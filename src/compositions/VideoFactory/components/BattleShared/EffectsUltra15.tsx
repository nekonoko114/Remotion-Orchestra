import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate, spring } from 'remotion';

// ===============================
// 1. Gold Confetti Effect
// ===============================
export const GoldConfettiEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const confettiCount = 50;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {new Array(confettiCount).fill(0).map((_, i) => {
        const seed = i * 1111;
        const startX = random(seed) * width;
        const speedY = random(seed + 1) * 8 + 4;
        const swing = Math.sin((frame / (random(seed + 2) * 20 + 10)) + seed) * 30;
        const y = (frame * speedY) % (height + 100) - 50;
        const x = startX + swing;
        const rotX = frame * (random(seed + 3) * 10 + 2);
        const rotY = frame * (random(seed + 4) * 10 + 2);
        const color = random(seed + 5) > 0.5 ? '#FFD700' : '#FFA500';

        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            transform: `translate(${x}px, ${y}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            width: random(seed + 6) * 10 + 10, height: random(seed + 7) * 20 + 10,
            backgroundColor: color, opacity: 0.9,
            boxShadow: `0 0 5px ${color}`
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 2. Starry Night Effect
// ===============================
export const StarryNightEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const starCount = 100;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {new Array(starCount).fill(0).map((_, i) => {
        const seed = i * 2222;
        const x = random(seed) * width;
        const y = random(seed + 1) * height;
        const size = random(seed + 2) * 3 + 1;
        const twinkleSpeed = random(seed + 3) * 0.05 + 0.02;
        const opacity = Math.abs(Math.sin((frame * twinkleSpeed) + seed));

        return (
          <div key={i} style={{
            position: 'absolute', top: y, left: x,
            width: size, height: size,
            backgroundColor: '#ffffff', borderRadius: '50%',
            opacity: opacity,
            boxShadow: '0 0 8px #fff'
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 3. Paint Splatter Overlay
// ===============================
export const PaintSplatterOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const splatterCount = 5;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {new Array(splatterCount).fill(0).map((_, i) => {
        const seed = i * 3333;
        // Splatters appear immediately but scale up with spring
        const p = spring({ frame, fps: 30, config: { damping: 10, stiffness: 80 }, delay: i * 5 });
        const x = random(seed) * width;
        const y = random(seed + 1) * height;
        const color = ['#ff0055', '#00ffcc', '#ffdd00', '#ffffff', '#aa00ff'][i % 5];
        
        return (
          <div key={i} style={{
            position: 'absolute', left: 0, top: 0,
            transform: `translate(${x}px, ${y}px) scale(${p * (random(seed + 2) * 2 + 1)}) rotate(${random(seed + 3) * 360}deg)`,
            width: 100, height: 100, backgroundColor: color,
            clipPath: 'polygon(30% 0%, 70% 20%, 100% 30%, 80% 70%, 50% 100%, 20% 80%, 0% 50%, 10% 20%)',
            opacity: p > 0 ? 0.8 : 0, filter: 'blur(1px)' // Faux splatter shape
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 4. Cyber Hexagon Grid Effect
// ===============================
export const CyberHexagonGridEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const scrollY = (frame * 2) % 200;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.3 }}>
      <AbsoluteFill style={{
        top: -200 + scrollY, left: -200, width: '150%', height: '150%',
        background: `url('data:image/svg+xml;utf8,<svg width="60" height="100" xmlns="http://www.w3.org/2000/svg"><polygon points="30,0 60,25 60,75 30,100 0,75 0,25" fill="none" stroke="%2300ffff" stroke-width="2"/></svg>')`,
        backgroundSize: '60px 100px',
        transform: 'rotateX(45deg) scale(2)', transformOrigin: 'top center'
      }} />
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, transparent, #000 90%)' }} />
    </AbsoluteFill>
  );
};

// ===============================
// 5. Water Ripples Effect
// ===============================
export const WaterRipplesEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame / 20) * 10;
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.8 }}>
      <AbsoluteFill style={{ filter: `url(#water-ripple)` }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: '#0055ff', opacity: 0.2 }} />
      </AbsoluteFill>
      <svg width="0" height="0">
        <filter id="water-ripple">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" seed={Math.floor(frame / 5)} />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={30 + wave} xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// ===============================
// 6. Film Burn Overlay Effect
// ===============================
export const FilmBurnOverlayEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const posA = Math.sin(frame / 10) * 100;
  const posB = Math.cos(frame / 15) * 100;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', mixBlendMode: 'screen', pointerEvents: 'none' }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at ${50 + posA}% ${50 - posB}%, #ff5500 0%, #ff0000 20%, transparent 60%)`,
        opacity: Math.abs(Math.sin(frame / 5)) * 0.5 + 0.3,
        filter: 'blur(40px)'
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at ${20 - posA}% ${80 + posB}%, #ffcc00 0%, transparent 50%)`,
        opacity: Math.abs(Math.cos(frame / 8)) * 0.5 + 0.2,
        filter: 'blur(30px)'
      }} />
      {/* Occasional bright flashes */}
      {frame % 30 < 3 && <AbsoluteFill style={{ backgroundColor: 'rgba(255,100,0,0.4)', mixBlendMode: 'overlay' }} />}
    </AbsoluteFill>
  );
};

// ===============================
// 7. Sonar Radar Effect
// ===============================
export const SonarRadarEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = (frame * 3) % 360; // spinning sweep
  
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        width: 1000, height: 1000, borderRadius: '50%',
        border: '2px solid rgba(0,255,0,0.3)',
        boxShadow: '0 0 50px rgba(0,255,0,0.1) inset',
        position: 'absolute'
      }} />
      <div style={{ width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(0,255,0,0.2)', position: 'absolute' }} />
      <div style={{ width: 200, height: 200, borderRadius: '50%', border: '1px dotted rgba(0,255,0,0.5)', position: 'absolute' }} />
      {/* Sweeping Cone */}
      <div style={{
        width: 1000, height: 1000, borderRadius: '50%', position: 'absolute',
        background: `conic-gradient(from 0deg, transparent 270deg, rgba(0,255,0,0.8) 360deg)`,
        transform: `rotate(${rot}deg)`, mixBlendMode: 'screen', filter: 'blur(2px)'
      }} />
    </AbsoluteFill>
  );
};

// ===============================
// 8. Floating Dust Motes Effect
// ===============================
export const FloatingDustMotesEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const motesCount = 30;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {new Array(motesCount).fill(0).map((_, i) => {
        const seed = i * 4444;
        const xAmplitude = random(seed) * 100 + 50;
        const ySpeed = random(seed + 1) * 1 + 0.5; // Very slow
        const startY = random(seed + 2) * height;
        const cycle = frame * ySpeed;
        const y = height - (cycle % (height + 200)) + 100;
        const x = (random(seed + 3) * width) + Math.sin(frame / (random(seed + 4)*50 + 20)) * xAmplitude;
        const size = random(seed + 5) * 30 + 10;
        
        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0,
            transform: `translate(${x}px, ${y}px)`,
            width: size, height: size,
            backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '50%',
            filter: `blur(${random(seed + 6) * 10 + 5}px)`
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 9. Prism Caustics Effect
// ===============================
export const PrismCausticsEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const pos = (frame * 2) % 1080;
  
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.5, pointerEvents: 'none' }}>
      <AbsoluteFill style={{ filter: 'url(#caustics) hue-rotate(90deg)' }}>
        <div style={{ width: '100%', height: '100%', background: `linear-gradient(${pos}deg, #f00, #0f0, #00f, #f0f)` }} />
      </AbsoluteFill>
      <svg width="0" height="0">
        <filter id="caustics">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" seed={Math.floor(frame / 3)} />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

// ===============================
// 10. Glitch Text String Effect
// ===============================
export const GlitchTextStringEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const texts = ["ERROR_404", "SYSTEM FAILURE", "BUFFER OVERFLOW", "01101000 01101001", "CRITICAL WARNING", "null", "undefined"];
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'difference', color: '#0f0', fontFamily: 'monospace', fontSize: 40, fontWeight: 'bold' }}>
      {new Array(5).fill(0).map((_, i) => {
        // Randomly appear for 2-3 frames
        const isActive = random(frame + i) > 0.95;
        if (!isActive) return null;
        
        const text = texts[Math.floor(random(frame + i*2) * texts.length)];
        const x = random(frame + i*3) * 80 + 10; // 10% to 90%
        const y = random(frame + i*4) * 80 + 10;
        
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            textShadow: '5px 0 0 red, -5px 0 0 blue'
          }}>
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 11. Vignette Pulse Effect
// ===============================
export const VignettePulseEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.abs(Math.sin(frame / 8)) * 30; // 0 to 30 blur increase
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 1000, pointerEvents: 'none' }}>
      <div style={{
        width: '100%', height: '100%',
        boxShadow: `inset 0 0 ${150 + pulse}px rgba(0,0,0,0.8)`
      }} />
    </AbsoluteFill>
  );
};

// ===============================
// 12. Laser Scope Effect
// ===============================
export const LaserScopeEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Create a spring-based locking movement
  // To avoid useVideoConfig in loops, we use random steps
  const targetX = random(Math.floor(frame / 30)) * width;
  const targetY = random(Math.floor(frame / 30) + 1) * height;
  
  // Smoothly move towards target (faking a spring with simple lerp for overlay purposes)
  // We'll use absolute positions and animate transition with CSS
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div style={{
        position: 'absolute', left: targetX, top: targetY,
        width: 100, height: 100, transform: 'translate(-50%, -50%)',
        border: '3px solid red', borderRadius: '50%',
        transition: 'left 0.5s cubic-bezier(0.1, 0.9, 0.2, 1), top 0.5s cubic-bezier(0.1, 0.9, 0.2, 1)',
        boxShadow: '0 0 20px red, inset 0 0 20px red'
      }}>
        <div style={{ position: 'absolute', top: -20, left: 48, width: 4, height: 140, backgroundColor: 'red' }} />
        <div style={{ position: 'absolute', top: 48, left: -20, width: 140, height: 4, backgroundColor: 'red' }} />
        {/* Laser Dot */}
        <div style={{ position: 'absolute', top: 45, left: 45, width: 10, height: 10, backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 0 10px red' }} />
      </div>
    </AbsoluteFill>
  );
};

// ===============================
// 13. Speed Warp Tunnel Effect
// ===============================
export const SpeedWarpTunnelEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const ringCount = 10;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none', alignItems: 'center', justifyContent: 'center' }}>
      {new Array(ringCount).fill(0).map((_, i) => {
        // Rings flying outwards
        const rawScale = ((frame * 0.1) + (i / ringCount)) % 1; // 0 to 1
        // Make it scale aggressively exponential to simulate 3D tunnel depth towards camera
        const scale = Math.pow(rawScale * 5, 2);
        const opacity = interpolate(rawScale, [0, 0.5, 1], [0, 1, 0], { extrapolateRight: 'clamp' });
        
        return (
          <AbsoluteFill key={i} style={{
            position: 'absolute', width: 200, height: 200, left: '50%', top: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`, border: '2px dashed #0ff',
            borderRadius: '50%', opacity, mixBlendMode: 'screen', boxShadow: '0 0 20px #0ff'
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ===============================
// 14. CRT Thick Scanline Scroll
// ===============================
export const CRTScanlineScrollEffect: React.FC = () => {
  const frame = useCurrentFrame();
  const y = (frame * 10) % 1920;
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'multiply' }}>
      <AbsoluteFill style={{
        background: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 50px, transparent 100px)`,
        height: 100, width: '100%', top: y
      }} />
      <AbsoluteFill style={{
        background: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 50px, transparent 100px)`,
        height: 100, width: '100%', top: y - 1920
      }} />
      {/* Micro scanlines */}
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.1) 3px)', opacity: 0.5 }} />
    </AbsoluteFill>
  );
};

// ===============================
// 15. Magical Aura Glow Effect
// ===============================
export const MagicalAuraGlowEffect: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const pulse = Math.abs(Math.sin(frame / 10)); // 0 to 1
  
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
      <div style={{ position: 'relative' }}>
        {/* Glow behind */}
        <AbsoluteFill style={{
          transform: `scale(${1 + pulse * 0.3})`,
          background: 'radial-gradient(ellipse, #ff00ff 0%, #00ffff 50%, transparent 80%)',
          filter: 'blur(30px)', opacity: 0.8, mixBlendMode: 'screen'
        }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
