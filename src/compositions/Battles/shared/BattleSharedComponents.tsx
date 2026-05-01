import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
  Img,
  staticFile,
  OffthreadVideo,
  Loop,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/NotoSansJP';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700', '900'],
  ignoreTooManyRequestsWarning: true,
});

export const SliceSplitText: React.FC<{ text: string; frame: number; fps: number; color: string; glowColor: string; fontSize: number }> = ({ text, frame, fps, color, glowColor, fontSize }) => {
  const p = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const topX = interpolate(p, [0, 1], [-300, 0]);
  const bottomX = interpolate(p, [0, 1], [300, 0]);
  const textStyle: React.CSSProperties = { fontSize, fontWeight: 900, color, textShadow: `0 0 20px ${glowColor}`, margin: 0, padding: 0, lineHeight: 1.2, WebkitTextStroke: '6px black', whiteSpace: 'pre-wrap', textAlign: 'center' };
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ ...textStyle, clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transform: `translateX(${topX}px)`, opacity: p }}>{text}</div>
      <div style={{ ...textStyle, clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', transform: `translateX(${bottomX}px)`, position: 'absolute', top: 0, left: 0, opacity: p }}>{text}</div>
      {/* Invisible spacer to maintain layout */}
      <div style={{ ...textStyle, visibility: 'hidden' }}>{text}</div>
    </div>
  );
};

// ----------------------------------------------------
// 新規：BurningLightningText (炎マスク＋稲妻テキスト)
// ----------------------------------------------------
export const BurningLightningText: React.FC<{
  text: string;
  frame: number;
  fontSize?: number;
}> = ({ text, frame, fontSize = 200 }) => {
  const { fps } = useVideoConfig();
  const introSpring = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  
  // Lightning strikes aggressively at the beginning, then fades out after 30 frames
  const lightningOpacity = interpolate(frame, [0, 5, 20, 30], [0, 1, 0.8, 0], { extrapolateRight: 'clamp' });

  // Add random wiggle to the text itself for a more aggressive feel
  const seed = Math.floor(frame / 3);
  const wiggleX = interpolate(random(`wxbt-${seed}`), [0, 1], [-5, 5]);
  const wiggleY = interpolate(random(`wybt-${seed}`), [0, 1], [-5, 5]);

  const width = 1200;
  const height = fontSize * 2;
  const maskId = `fire-mask-${text.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div style={{
      position: 'relative',
      width,
      height,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: `scale(${interpolate(introSpring, [0, 1], [3, 1])}) translate(${wiggleX}px, ${wiggleY}px)`,
      opacity: introSpring,
    }}>
      {/* 稲妻エフェクト (Lightning overlay) */}
      <div style={{
        position: 'absolute',
        width: '150%',
        height: '250%',
        mixBlendMode: 'screen',
        opacity: lightningOpacity,
        transform: 'rotate(-5deg)',
        zIndex: 5,
        pointerEvents: 'none'
      }}>
        <OffthreadVideo 
          src={staticFile("assets/pixabay/videos/webm/lightning-holizon.webm")} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.5) contrast(1.5)' }} 
          muted
        />
      </div>

      {/* テキスト本体 (Fire masked SVG) */}
      <svg width={width} height={height} style={{ overflow: 'visible', zIndex: 10 }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text 
              x="50%" y="50%" 
              textAnchor="middle" 
              dominantBaseline="central" 
              fill="white" 
              fontSize={fontSize} 
              fontWeight={900} 
              fontStyle="italic"
              letterSpacing={10}
            >
              {text}
            </text>
          </mask>
          {/* Inner Glow/Shadow filter for the fire text to pop out */}
          <filter id={`glow-${maskId}`}>
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Glow behind the text */}
        <text 
          x="50%" y="50%" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fill="none" 
          stroke="#ff5500" 
          strokeWidth="15"
          fontSize={fontSize} 
          fontWeight={900} 
          fontStyle="italic"
          letterSpacing={10}
          filter={`url(#glow-${maskId})`}
          opacity={0.6}
        >
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <div style={{ width: '100%', height: '100%', transform: `scale(${1 + frame * 0.005})` }}>
            <OffthreadVideo 
              src={staticFile("assets/pixabay/videos/webm/pixabay_fire_flame_beautiful_wallpaper_hot_particles_wallp_212500.webm")} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              muted
            />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// ----------------------------------------------------
// PIXABAY VIDEO TEXT EFFECTS (5 New Styles)
// ----------------------------------------------------

// 1. Galaxy Glow Text (宇宙・銀河)
export const GalaxyGlowText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 15 } });
  
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `galaxy-mask-${text.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`, opacity: s }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={20} fontFamily="serif">
              {text}
            </text>
          </mask>
          <filter id={`glow-${maskId}`}>
            <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#aa00ff" strokeWidth="10" fontSize={fontSize} fontWeight={900} letterSpacing={20} fontFamily="serif" filter={`url(#glow-${maskId})`} opacity={0.7}>
          {text}
        </text>
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <div style={{ width: '100%', height: '100%', transform: `scale(${1.5 - frame * 0.002})` }}>
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/pixabay_burst_light_space_galaxic_fire_glow_infinity_180380.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(45deg)' }} muted />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// 2. Sakura Breeze Text (桜吹雪・春)
export const SakuraBreezeText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `sakura-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: Math.min(1, frame / 15) }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5}>
              {text}
            </text>
          </mask>
          <filter id={`shadow-${maskId}`}>
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#ff66b2" floodOpacity="0.8"/>
          </filter>
        </defs>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#ffffff" strokeWidth="4" fontSize={fontSize} fontWeight={900} letterSpacing={5} filter={`url(#shadow-${maskId})`}>
          {text}
        </text>
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/pixabay_sakura_flowers_spring_nature_sky_pink_live_wallpap_117934.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 3. Cyberpunk Abstract Text (サイバーパンク・グリッチ)
export const CyberpunkAbstractText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const glitchX = interpolate(random(`cx-${frame}`), [0, 1], [-5, 5]) * (frame % 10 < 2 ? 1 : 0);
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `cyber-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `translateX(${glitchX}px)` }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} fontStyle="italic" letterSpacing={-5}>
              {text}
            </text>
          </mask>
        </defs>
        {/* Layered strokes for RGB split effect */}
        <text x="49%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#ff0055" strokeWidth="8" fontSize={fontSize} fontWeight={900} fontStyle="italic" letterSpacing={-5}>{text}</text>
        <text x="51%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#00ffff" strokeWidth="8" fontSize={fontSize} fontWeight={900} fontStyle="italic" letterSpacing={-5}>{text}</text>
        
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/absturact-turing.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.5) hue-rotate(90deg)' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 4. Rainbow Liquid Text (カラフル・リキッド)
export const RainbowLiquidText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `rainbow-mask-${Math.random()}`;
  const floatY = Math.sin(frame / 10) * 20;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `translateY(${floatY}px)` }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={10}>
              {text}
            </text>
          </mask>
          <filter id={`glow-${maskId}`}>
            <feGaussianBlur stdDeviation="15" result="blur"/>
            <feComponentTransfer><feFuncA type="linear" slope="2"/></feComponentTransfer>
          </filter>
        </defs>
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/abstruct-rainbow.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 5. Heart Sparkle Text (ハート・スパークル)
export const HeartSparkleText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const beatScale = 1 + Math.sin(frame / 5) * 0.05;
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `heart-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `scale(${beatScale})` }}>
      {/* Background Sparkles behind text */}
      <div style={{ position: 'absolute', width: '200%', height: '300%', mixBlendMode: 'screen', opacity: 0.8, pointerEvents: 'none' }}>
        <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/pixabay_heart_sparkle_overlay_green_screen_4k_love_gold_he_111573.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
      </div>

      <svg width={width} height={height} style={{ overflow: 'visible', zIndex: 10 }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5}>
              {text}
            </text>
          </mask>
          <linearGradient id={`grad-${maskId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff99cc" />
            <stop offset="100%" stopColor="#ff0066" />
          </linearGradient>
        </defs>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={`url(#grad-${maskId})`} stroke="white" strokeWidth="5" fontSize={fontSize} fontWeight={900} letterSpacing={5}>
          {text}
        </text>
      </svg>
    </div>
  );
};

// ----------------------------------------------------
// EXTREME ADVANCED TEXT EFFECTS (SVG Filters & 3D)
// ----------------------------------------------------

// 9. Gold 3D Extrusion (黄金3D流体)
export const Gold3DText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `gold-mask-${Math.random()}`;
  
  // Create 3D extrusion with multiple drop-shadows
  const depth = 20;
  let textShadows = '';
  for (let i = 1; i <= depth; i++) {
    textShadows += `${i}px ${i}px 0px #8a6a1c${i === depth ? '' : ', '}`;
  }

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible', filter: `drop-shadow(10px 20px 10px rgba(0,0,0,0.8))` }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5} fontStyle="italic">
              {text}
            </text>
          </mask>
          {/* Bevel inner shadow simulating 3D metallic edge */}
          <filter id={`bevel-${maskId}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
            <feOffset dx="4" dy="4" result="offsetBlur"/>
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#ffffff" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>
        </defs>

        {/* 3D Extrusion Layer (Solid Gold Color underlying the video) */}
        <text className="gold-depth" x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#ffd700" fontSize={fontSize} fontWeight={900} letterSpacing={5} fontStyle="italic" style={{ textShadow: textShadows }}>
          {text}
        </text>

        {/* Video Masked Front Face */}
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`} filter={`url(#bevel-${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/priticle-absturact-gold.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2)' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 10. Glitch Displacement (ノイズ空間歪曲)
export const GlitchDisplacementText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `glitch-mask-${Math.random()}`;
  
  // Dynamic turbulence parameters for glitching
  const isGlitching = frame % 20 < 4; // Glitch for 4 frames every 20 frames
  const baseFreq = isGlitching ? `${0.1 + Math.random()*0.4} ${0.01 + Math.random()*0.1}` : `0.01 0.01`;
  const scale = isGlitching ? 40 : 0;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <filter id={`displace-${maskId}`}>
            <feTurbulence type="fractalNoise" baseFrequency={baseFreq} numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5}>
              {text}
            </text>
          </mask>
        </defs>
        
        {/* Abstract Video inside Text, with Displacement Filter applied to the entire text element */}
        <g filter={`url(#displace-${maskId})`}>
          {/* RGB Split Backgrounds during glitch */}
          {isGlitching && <text x="49%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="red" strokeWidth="8" fontSize={fontSize} fontWeight={900}>{text}</text>}
          {isGlitching && <text x="51%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="cyan" strokeWidth="8" fontSize={fontSize} fontWeight={900}>{text}</text>}
          
          <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/absturact-turing.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(1.2)` }} muted />
          </foreignObject>
        </g>
      </svg>
    </div>
  );
};

// 11. Inferno Outline (業火の輪郭線)
export const InfernoOutlineText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `inferno-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          {/* Mask is ONLY the outline (stroke), no fill */}
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="black" stroke="white" strokeWidth="10" fontSize={fontSize} fontWeight={900} letterSpacing={10}>
              {text}
            </text>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="black" stroke="rgba(255,255,255,0.4)" strokeWidth="30" fontSize={fontSize} fontWeight={900} letterSpacing={10}>
              {text}
            </text>
          </mask>
        </defs>
        
        {/* Glow backdrop */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#ff2a00" strokeWidth="20" fontSize={fontSize} fontWeight={900} letterSpacing={10} style={{ filter: 'blur(15px)' }}>
          {text}
        </text>

        {/* Video masked strictly to the fat outline */}
        <foreignObject x="-10%" y="-10%" width="120%" height="120%" mask={`url(#${maskId})`}>
          <div style={{ width: '100%', height: '100%', transform: 'scale(1.1)', transformOrigin: 'center' }}>
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/fire-flower01.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// 12. Hologram Scanline (ホログラム投影)
export const HologramScanText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `holo-mask-${Math.random()}`;
  
  // Flickering hologram
  const opacity = frame % 15 === 0 ? 0.3 : 0.9;
  // Scrolling scanline block
  const scanY = (frame * 15) % height;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity }}>
      {/* RGB Split shadows for hologram chromatic aberration */}
      <div style={{ position: 'absolute', fontSize, fontWeight: 900, color: 'transparent', letterSpacing: 5, WebkitTextStroke: '2px cyan', transform: 'translate(-4px, 0)' }}>{text}</div>
      <div style={{ position: 'absolute', fontSize, fontWeight: 900, color: 'transparent', letterSpacing: 5, WebkitTextStroke: '2px magenta', transform: 'translate(4px, 0)' }}>{text}</div>

      <svg width={width} height={height} style={{ overflow: 'visible', zIndex: 10 }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5}>
              {text}
            </text>
          </mask>
        </defs>
        
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <div style={{ position: 'relative', width: '100%', height: '100%', mixBlendMode: 'screen' }}>
            {/* Techy background video */}
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/abstruct01.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(180deg) brightness(1.5)' }} muted />
            {/* Global scanlines overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0, 255, 255, 0.4) 4px, rgba(0, 255, 255, 0.4) 8px)' }} />
            {/* Fat moving scan beam */}
            <div style={{ position: 'absolute', top: scanY, left: 0, right: 0, height: 20, background: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 0 30px cyan' }} />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// 13. Glass Refraction (ガラス屈折レンズ)
export const GlassRefractionText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `glass-mask-${Math.random()}`;

  // The text acts as a magnifying glass. 
  // Background = blurred video.
  // Foreground (Text) = Sharp, slightly scaled up video.
  const videoSrc = staticFile("assets/pixabay/videos/webm/boken-ball.webm");

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Background container blurred */}
      <div style={{ position: 'absolute', width: 1500, height: 500, top: -100, filter: 'blur(15px) brightness(0.6)' }}>
        <OffthreadVideo src={videoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
      </div>

      {/* Refracted sharp text layer */}
      <svg width={width} height={height} style={{ overflow: 'visible', zIndex: 10, filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.8))' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5}>
              {text}
            </text>
          </mask>
          {/* Glass bevel edge */}
          <filter id={`glass-edge-${maskId}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
            <feOffset dx="-2" dy="-2" result="offsetBlur"/>
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant=".9" specularExponent="30" lightingColor="#ffffff" result="specOut">
              <fePointLight x="-50" y="-50" z="200"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
          </filter>
        </defs>

        {/* White glass rim */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="4" fontSize={fontSize} fontWeight={900} letterSpacing={5} filter={`url(#glass-edge-${maskId})`}>
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          {/* Slightly scaled up video to simulate lens magnification */}
          <div style={{ width: '100%', height: '100%', transform: 'scale(1.1) rotate(2deg)' }}>
            <OffthreadVideo src={videoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2)' }} muted />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// ----------------------------------------------------
// ADDITIONAL 5 HIGH-END TEXT EFFECTS
// ----------------------------------------------------

// 14. Liquid AuraText (リキッドオーラ)
export const LiquidAuraText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `liquid-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={10}>
              {text}
            </text>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="20" fontSize={fontSize} fontWeight={900} letterSpacing={10} style={{ filter: 'blur(10px)' }}>
              {text}
            </text>
          </mask>
        </defs>
        
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#ff00ff" strokeWidth="6" fontSize={fontSize} fontWeight={900} letterSpacing={10} opacity={0.5}>
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/particle-reibow-mix.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(2)' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 15. Thunder Strike (蒼雷撃)
export const ThunderStrikeText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `thunder-mask-${Math.random()}`;
  
  // Flash effect synced to frame
  const flash = frame % 15 < 3 ? 1.5 : 1;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', filter: `drop-shadow(0 0 20px rgba(0, 150, 255, 0.8))` }}>
      {/* Background lightning bolts */}
      <div style={{ position: 'absolute', width: '150%', height: '200%', mixBlendMode: 'screen', opacity: 0.7, transform: 'rotate(5deg)' }}>
        <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/litinig-blue.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
      </div>

      <svg width={width} height={height} style={{ overflow: 'visible', zIndex: 10 }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5} fontStyle="italic">
              {text}
            </text>
          </mask>
        </defs>
        
        {/* Fill color brightens randomly */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize={fontSize} fontWeight={900} letterSpacing={5} fontStyle="italic" opacity={flash}>
          {text}
        </text>

        {/* Video masked over the text to give it internal energy */}
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/litinig-blue.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.5) brightness(1.2)' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 16. Explosion Impact (爆炎インパクト)
export const ExplosionImpactText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `explosion-mask-${Math.random()}`;
  
  // Very heavy shake at the start
  const introShakeX = frame < 20 ? interpolate(random(`ex-x-${frame}`), [0, 1], [-30, 30]) : 0;
  const introShakeY = frame < 20 ? interpolate(random(`ex-y-${frame}`), [0, 1], [-30, 30]) : 0;
  const scale = frame < 10 ? interpolate(frame, [0, 10], [0.5, 1.2], { extrapolateRight: 'clamp' }) : 
                frame < 20 ? interpolate(frame, [10, 20], [1.2, 1], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `translate(${introShakeX}px, ${introShakeY}px) scale(${scale})` }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={-5} fontStyle="italic">
              {text}
            </text>
          </mask>
        </defs>
        
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#000000" strokeWidth="30" fontSize={fontSize} fontWeight={900} letterSpacing={-5} fontStyle="italic">
          {text}
        </text>
        
        {/* Fire explosion inside the text */}
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/fire-explotion.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.5)' }} muted />
        </foreignObject>
        
        {/* Burning rim */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#ff3300" strokeWidth="5" fontSize={fontSize} fontWeight={900} letterSpacing={-5} fontStyle="italic">
          {text}
        </text>
      </svg>
    </div>
  );
};

// 17. Elegant Bokeh (エレガント・ボケ光)
export const ElegantBokehText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `bokeh-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={100} letterSpacing={20} fontFamily="serif">
              {text}
            </text>
          </mask>
        </defs>
        
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#ffddaa" strokeWidth="2" fontSize={fontSize} fontWeight={100} letterSpacing={20} fontFamily="serif">
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/boken-litflare-horaizon.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.5) brightness(1.2)' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 18. Tech Circuit (サイバーライン・サーキット)
export const TechCircuitText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `tech-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* HUD Background scanlines */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,255,100,0.1) 10px, rgba(0,255,100,0.1) 11px)', pointerEvents: 'none' }} />

      <svg width={width} height={height} style={{ overflow: 'visible', zIndex: 10 }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={5}>
              {text}
            </text>
            {/* Outline part as well */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="white" strokeWidth="20" fontSize={fontSize} fontWeight={900} letterSpacing={5} style={{ opacity: 0.3 }}>
              {text}
            </text>
          </mask>
        </defs>
        
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#00ffaa" strokeWidth="4" fontSize={fontSize} fontWeight={900} letterSpacing={5} style={{ filter: 'drop-shadow(0 0 10px #00ffaa)' }}>
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/outline-storke-rpg.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(-45deg) saturate(2)' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// ----------------------------------------------------
// FINAL EXTRAS 5 MORE TEXT EFFECTS
// ----------------------------------------------------

// 19. Starburst Core (星の煌めき)
export const StarburstCoreText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `star-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={10}>
              {text}
            </text>
          </mask>
          <filter id={`star-glow-${maskId}`}>
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#fff8b0" strokeWidth="15" fontSize={fontSize} fontWeight={900} letterSpacing={10} filter={`url(#star-glow-${maskId})`} opacity={0.6}>
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <div style={{ width: '100%', height: '100%', transform: `scale(${1 + frame * 0.005})` }}>
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/pixabay_144484.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// 20. Deep Abyss Heart (深淵の鼓動)
export const DeepHeartText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `deep-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={10} fontFamily="serif">
              {text}
            </text>
          </mask>
        </defs>
        
        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/haurt-depth-running.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(60deg) saturate(2)' }} muted />
        </foreignObject>
      </svg>
    </div>
  );
};

// 21. Ring of Fire (炎輪)
export const FireRingText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `ring-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={-2} fontStyle="italic">
              {text}
            </text>
          </mask>
        </defs>

        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#ff4400" strokeWidth="8" fontSize={fontSize} fontWeight={900} letterSpacing={-2} fontStyle="italic" style={{ filter: 'blur(5px)' }}>
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <div style={{ width: '100%', height: '100%', transform: 'scale(1.2)' }}>
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/pixabay_fire_flame_burning_circle_ring_particles_smoke_spa_176811.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// 22. Matrix DataStream (マトリックス・データストリーム)
export const MatrixDataText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `matrix-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={900} letterSpacing={15}>
              {text}
            </text>
          </mask>
        </defs>

        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="none" stroke="#00ff66" strokeWidth="3" fontSize={fontSize} fontWeight={900} letterSpacing={15} style={{ filter: 'drop-shadow(0 0 10px #00ff66)' }}>
          {text}
        </text>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <div style={{ width: '100%', height: '100%', transform: `translateY(${frame % 100}px)` }}>
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/pixabay_particles_light_beautiful_wallpaper_green_wallpape_202587.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(2)' }} muted />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// 23. Starlight Pulse (星脈の鼓動)
export const StarlightPulseText: React.FC<{ text: string; frame: number; fontSize?: number }> = ({ text, frame, fontSize = 200 }) => {
  const width = 1200;
  const height = fontSize * 2;
  const maskId = `starlight-mask-${Math.random()}`;

  return (
    <div style={{ position: 'relative', width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <mask id={maskId} x="-20%" y="-20%" width="140%" height="140%">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white" fontSize={fontSize} fontWeight={100} letterSpacing={20} fontFamily="serif">
              {text}
            </text>
          </mask>
        </defs>

        <foreignObject x="-20%" y="-20%" width="140%" height="140%" mask={`url(#${maskId})`}>
          <div style={{ width: '100%', height: '100%' }}>
            <OffthreadVideo src={staticFile("assets/pixabay/videos/webm/pixabay_stars_christmas_loop_glowing_light_background_beau_183279.webm")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

// ----------------------------------------------------
// その他のコンポーネント (SliceSplitText など)
// ----------------------------------------------------

export const VideoEffectStack: React.FC<{
  config?: {
    src: string;
    opacity?: number;
    blendMode?: string;
    zIndex?: number;
    muted?: boolean;
  };
}> = ({ config }) => {
  if (!config || !config.src) return null;
  return (
    <AbsoluteFill
      style={{
        opacity: config.opacity ?? 0.65,
        mixBlendMode: (config.blendMode as React.CSSProperties['mixBlendMode']) ?? 'screen',
        pointerEvents: 'none',
        zIndex: config.zIndex ?? 10,
      }}
    >
      <OffthreadVideo
        src={staticFile(config.src)}
        muted={config.muted ?? true}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </AbsoluteFill>
  );
};

export const KaleidoscopeBackground: React.FC<{
  imageSrc: string;
  frame: number;
  opacity?: number;
  glowColor?: string;
}> = ({ imageSrc, frame, opacity = 1, glowColor = 'rgba(255,100,0,0.4)' }) => {
  const segments = 12;
  const angle = 360 / segments;
  const rotation = frame * 0.2;
  const scale = 1.2 + Math.sin(frame * 0.05) * 0.1;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      <div style={{
        position: 'absolute',
        inset: '-100%',
        transform: `rotate(${rotation}deg) scale(${scale})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {new Array(segments).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '200%',
              height: '200%',
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: '30%',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat',
              clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((i * angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((i * angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((i + 1) * angle * Math.PI) / 180)}% ${50 + 50 * Math.sin(((i + 1) * angle * Math.PI) / 180)}%)`,
              transform: i % 2 === 1 ? 'scaleX(-1)' : 'none',
              filter: 'brightness(0.8) contrast(1.2)',
            }}
          />
        ))}
        <div style={{
          position: 'absolute',
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }} />
      </div>
    </AbsoluteFill>
  );
};

export const Particle: React.FC<{ seed: number; frame: number; color: string; direction?: 'up' | 'down' }> = ({ seed, frame, color, direction = 'up' }) => {
  const life = 35 + random(seed + 5) * 30;
  const local = (frame + seed * 7) % life;
  const progress = local / life;
  const x = random(seed) * 1080;
  const speed = 15 + random(seed + 2) * 20;
  const w = 15 + random(seed + 3) * 60;
  const baseY = direction === 'up' 
    ? 1920 * (0.4 + random(seed + 1) * 0.8) 
    : 1920 * (random(seed + 1) * 0.6 - 0.2);
  const y = direction === 'up' ? baseY - speed * local : baseY + speed * local;
  const opacity = interpolate(progress, [0, 0.1, 0.5, 1], [0, 1, 0.8, 0]);
  const s = interpolate(progress, [0, 0.2, 1], [0.2, 1.2, 0]);

  return (
    <div style={{
      position: 'absolute', left: x - w / 2, top: y,
      width: w, height: w * 1.5,
      background: `radial-gradient(ellipse at 50% 65%, white 0%, ${color} 30%, transparent 75%)`,
      filter: `blur(${w * 0.25}px)`, opacity, borderRadius: '50% 50% 65% 65%',
      transform: `scale(${s}) rotate(${Math.sin(frame / 8 + seed) * 15}deg)`,
      mixBlendMode: 'screen',
    }} />
  );
};

export const LightLeak: React.FC<{ frame: number; color?: string }> = ({ frame, color = '#ff8800' }) => {
  const opacity = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.1, 0.4]);
  const move = Math.sin(frame * 0.02) * 100;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 90, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -200 + move, left: -200 - move,
        width: 1000, height: 1000, background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(120px)', opacity, mixBlendMode: 'screen',
      }} />
      <div style={{
        position: 'absolute', bottom: -300 - move, right: -300 + move,
        width: 1200, height: 1200, background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(150px)', opacity: opacity * 0.8, mixBlendMode: 'screen',
      }} />
    </AbsoluteFill>
  );
};

export const RotatingFocusLines: React.FC<{ frame: number; color?: string; count?: number }> = ({ 
  frame, 
  color = 'rgba(255, 140, 0, 0.3)', 
  count = 40 
}) => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={{
        width: 3000, height: 3000, transform: `rotate(${frame * 2}deg)`,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        {new Array(count).fill(0).map((_, i) => {
          const angle = (i / count) * 360;
          return (
            <div key={i} style={{
              position: 'absolute', width: 2000, height: 4,
              background: `linear-gradient(to right, ${color}, transparent)`,
              transform: `rotate(${angle}deg) translateX(500px)`,
              transformOrigin: 'left center',
              opacity: 0.5 + Math.sin(frame * 0.2 + i) * 0.5,
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const GlobalFrame: React.FC<{ color: string; glowColor: string }> = ({ color, glowColor }) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 10) * 0.2 + 0.8;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      <div style={{ 
        position: 'absolute', inset: 0,
        border: `12px solid ${color}`, 
        boxShadow: `inset 0 0 80px ${glowColor}${Math.floor(0.4 * pulse * 255).toString(16).padStart(2, '0')}, 0 0 80px ${glowColor}${Math.floor(0.4 * pulse * 255).toString(16).padStart(2, '0')}`,
      }} />
    </AbsoluteFill>
  );
};

// Modified GlobalFrame for easier hex usage
export const GlobalFrameThemed: React.FC<{ color: string; glowColor: string }> = ({ color, glowColor }) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 10) * 0.2 + 0.8;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      <div style={{ 
        position: 'absolute', inset: 0,
        border: `12px solid ${color}`, 
        boxShadow: `inset 0 0 80px ${glowColor}, 0 0 80px ${glowColor}`,
        opacity: 0.6 + 0.4 * pulse
      }} />
    </AbsoluteFill>
  );
};

export const GlitchedIcon: React.FC<{ 
  src: string; 
  frame: number; 
  size: number; 
  borderColor: string; 
  glowColor: string;
  style?: React.CSSProperties;
  enabled?: boolean;
}> = ({ src, frame, size, borderColor, glowColor, style, enabled = true }) => {
  const glitchTrigger = enabled ? random(Math.floor(frame / 2)) > 0.85 : false;
  const intensity = glitchTrigger ? 1 : 0;
  
  const glitchStyle = {
    transform: intensity > 0 
      ? `translate(${(random(frame + 1) - 0.5) * 40}px, ${(random(frame + 2) - 0.5) * 40}px) scale(${1 + (random(frame + 3) - 0.5) * 0.1})`
      : 'none',
    filter: intensity > 0 
      ? `hue-rotate(${random(frame + 4) * 360}deg) brightness(1.5) contrast(1.5) saturate(1.5)`
      : 'none',
    opacity: intensity > 0 && random(frame + 5) > 0.7 ? 0.3 : 1,
  };

  return (
    <div style={{ 
      width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      border: `15px solid ${borderColor}`, 
      boxShadow: `0 0 100px ${glowColor}, inset 0 0 50px ${glowColor}`,
      position: 'relative',
      backgroundColor: '#000',
      ...style,
      ...glitchStyle
    }}>
      <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {intensity > 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.2) 2px, transparent 4px)`,
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
};

export const KineticText: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame?: number;
  fontSize: number;
  color: string;
  glowColor: string;
  stagger?: number;
  style?: React.CSSProperties;
  fontFamily?: string;
  textStroke?: string;
  animationType?: 'kinetic' | 'fade';
  splitBy?: 'line' | 'character';
}> = ({ text, frame, fps, startFrame = 0, fontSize, color, glowColor, stagger = 8, style, fontFamily: customFontFamily, textStroke, animationType = 'kinetic', splitBy = 'line' }) => {
  const t = frame - startFrame;
  const lines = text.replace(/<br\s*\/?>/gi, '\n').split('\n');

  let charIndex = 0;

  return (
    <div style={{ fontFamily: customFontFamily || fontFamily, textAlign: 'center', ...style }}>
      {lines.map((line, i) => {
        if (splitBy === 'line') {
          const lineStart = i * stagger;
          const s = spring({ frame: t - lineStart, fps, config: { stiffness: 500, damping: 20, mass: 1 } });
          const scale = animationType === 'fade' 
            ? interpolate(t - lineStart, [0, 30], [0.8, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) 
            : interpolate(s, [0, 0.6, 1], [2.5, 0.9, 1]);
          const translateY = animationType === 'fade' ? interpolate(t - lineStart, [0, 15], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : interpolate(s, [0, 1], [-80, 0]);
          const skewX = animationType === 'fade' ? 0 : interpolate(s, [0, 0.4, 1], [-12, 4, 0]);
          const opacity = animationType === 'fade' 
            ? interpolate(t - lineStart, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : interpolate(t - lineStart, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const flicker = animationType === 'fade' ? 1 : 0.88 + random(frame * 5 + i * 100) * 0.24;
          const impactBrightness = animationType === 'fade' ? 1.0 : interpolate(t - lineStart, [0, 3, 8], [3.0, 1.5, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              display: 'block', fontSize, fontWeight: 900, color, lineHeight: 1.15, letterSpacing: 2, opacity, whiteSpace: 'nowrap',
              transform: `translateY(${translateY}px) scale(${scale}) skewX(${skewX}deg)`,
              WebkitTextStroke: textStroke,
              textShadow: `0 0 ${6 * flicker}px #fff, 0 0 ${18 * flicker}px ${glowColor}, 0 0 ${40 * flicker}px ${glowColor}, 0 0 ${80 * flicker}px ${glowColor}, 0 0 ${120 * flicker}px ${glowColor}`,
              filter: `brightness(${impactBrightness}) drop-shadow(0 4px 8px rgba(0,0,0,0.8))`,
            }}>
              {line}
            </div>
          );
        }

        // character splitting
        return (
          <div key={i} style={{ display: 'block', fontSize, fontWeight: 900, color, lineHeight: 1.15, letterSpacing: 2, whiteSpace: 'nowrap' }}>
            {line.split('').map((char, cIdx) => {
              const currentIdx = charIndex++;
              const charStart = currentIdx * stagger;
              const s = spring({ frame: t - charStart, fps, config: { stiffness: 500, damping: 20, mass: 1 } });
              
              const scale = animationType === 'fade' 
                ? interpolate(t - charStart, [0, 30], [0.8, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) 
                : interpolate(s, [0, 0.6, 1], [2.5, 0.9, 1]);
              const translateY = animationType === 'fade' ? interpolate(t - charStart, [0, 15], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : interpolate(s, [0, 1], [-80, 0]);
              const skewX = animationType === 'fade' ? 0 : interpolate(s, [0, 0.4, 1], [-12, 4, 0]);
              const opacity = animationType === 'fade' 
                ? interpolate(t - charStart, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                : interpolate(t - charStart, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const flicker = animationType === 'fade' ? 1 : 0.88 + random(frame * 5 + currentIdx * 100) * 0.24;
              const impactBrightness = animationType === 'fade' ? 1.0 : interpolate(t - charStart, [0, 3, 8], [3.0, 1.5, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

              return (
                <span key={cIdx} style={{
                  display: 'inline-block', opacity,
                  transform: `translateY(${translateY}px) scale(${scale}) skewX(${skewX}deg)`,
                  WebkitTextStroke: textStroke,
                  textShadow: `0 0 ${6 * flicker}px #fff, 0 0 ${18 * flicker}px ${glowColor}, 0 0 ${40 * flicker}px ${glowColor}, 0 0 ${80 * flicker}px ${glowColor}, 0 0 ${120 * flicker}px ${glowColor}`,
                  filter: `brightness(${impactBrightness}) drop-shadow(0 4px 8px rgba(0,0,0,0.8))`,
                }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const MirrorLiver: React.FC<{ 
  frame: number; 
  imageSrc: string; 
  color: string; 
  scale?: number;
  zoomProgress?: number;
  enabled?: boolean;
  isCircle?: boolean;
}> = ({ frame, imageSrc, color, scale = 1, zoomProgress = 0, enabled = true, isCircle = false }) => {
  const { fps } = useVideoConfig();
  const leftOpen = spring({ frame, fps, config: { stiffness: 100, damping: 15 } });
  const rightOpen = spring({ frame: frame - 10, fps, config: { stiffness: 100, damping: 15 } });
  const centerOpen = spring({ frame: frame - 20, fps, config: { stiffness: 100, damping: 15 } });

  const glitchIntensity = (t: number) => enabled ? (Math.max(0, 1 - t / 20) * (random(frame + t) > 0.7 ? 1 : 0)) : 0;
  const leftGlitch = glitchIntensity(frame);
  const rightGlitch = glitchIntensity(frame - 10);
  const centerGlitch = glitchIntensity(frame - 20);

  const getGlitchStyle = (intensity: number) => ({
    filter: intensity > 0 ? `hue-rotate(${random(frame) * 360}deg) brightness(1.5)` : 'none',
    transform: `translate(${(random(frame * 2) - 0.5) * 40 * intensity}px, ${(random(frame * 3) - 0.5) * 40 * intensity}px)`,
    opacity: intensity > 0.5 && random(frame) > 0.5 ? 0.3 : 1
  });

  return (
    <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 800 * scale, position: 'relative', transform: `scale(${scale * (1 + zoomProgress * 4)}) translateY(${zoomProgress * 200}px)` }}>
      {enabled && (
        <>
          <div style={{ position: 'absolute', width: 500, height: 700, borderRadius: 40, overflow: 'hidden', border: `8px solid ${color}`, boxShadow: `0 0 50px ${color}`, transformOrigin: 'right center', transform: `translateX(${-240 * leftOpen}px) rotateY(${35 * leftOpen}deg) ${getGlitchStyle(leftGlitch).transform}`, opacity: leftOpen > 0.01 ? (0.6 * leftOpen) : 0, filter: getGlitchStyle(leftGlitch).filter, zIndex: 1 }}>
            <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
          </div>
          <div style={{ position: 'absolute', width: 500, height: 700, borderRadius: 40, overflow: 'hidden', border: `8px solid ${color}`, boxShadow: `0 0 50px ${color}`, transformOrigin: 'left center', transform: `translateX(${240 * rightOpen}px) rotateY(${-35 * rightOpen}deg) ${getGlitchStyle(rightGlitch).transform}`, opacity: rightOpen > 0.01 ? (0.6 * rightOpen) : 0, filter: getGlitchStyle(rightGlitch).filter, zIndex: 1 }}>
            <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
          </div>
        </>
      )}
      <div style={{ width: isCircle ? 750 : 600, height: isCircle ? 750 : 800, borderRadius: isCircle ? '50%' : 50, overflow: 'hidden', border: `12px solid #fff`, boxShadow: `0 0 100px #fff, 0 0 50px ${color}`, zIndex: 10, transform: `scale(${interpolate(centerOpen, [0, 1], [0.8, 1])}) ${getGlitchStyle(centerGlitch).transform}`, opacity: centerOpen > 0.01 ? 1 : 0, filter: getGlitchStyle(centerGlitch).filter }}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
};

export const SvgDefs: React.FC<{ frame: number }> = ({ frame }) => {
  const freq = 0.01 + Math.sin(frame / 20) * 0.005; 
  const scale = 8 + Math.sin(frame / 10) * 4;
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="heat-haze">
          <feTurbulence type="fractalNoise" baseFrequency={`${freq} 0.02`} numOctaves="3" seed={frame % 100} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="bloom" x="-30%" y="-30%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <filter id="green-key">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 0.1 0 0 0
            0 0 1 0 0
            1.5 -2 1.5 1 0
          " />
        </filter>
      </defs>
    </svg>
  );
};

export const SunsetBackground: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 1 }) => {
  const progress = frame / (35 * 30); 
  const scale = interpolate(progress, [0, 1], [1, 3.5]);
  const translateY = interpolate(progress, [0, 1], [0, -200]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale}) translateY(${translateY}px)`, transformOrigin: '50% 50%' }}>
        <Img src={staticFile('assets/anime_sunset_background_no_girl.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.1)' }} />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(circle, rgba(255,100,0,0.2) 0%, rgba(30,0,0,0.4) 100%)', mixBlendMode: 'overlay' }} />
    </AbsoluteFill>
  );
};

export const CustomBackgroundImage: React.FC<{ src: string; frame: number; opacity?: number }> = ({ src, frame, opacity = 1 }) => {
  const currentAbsoluteFrame = useCurrentFrame();
  const scale = 1.1 + Math.sin(frame * 0.02) * 0.05;
  const rotate = Math.sin(frame * 0.01) * 2;
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
  
  let startFrom = undefined;
  let endAt = undefined;
  if (src.includes('pixabay_intro_start_spiral_flash_particle_animation_circle_171429')) {
    startFrom = 50;
    endAt = 300;
  }
  
  let panTransform = `scale(${scale}) rotate(${rotate}deg)`;
  let customWidth: string | number = '100%';
  
  if (src.includes('pixabay_sakura_peach_flowers_starry_sky_reflection_pond_re_156769')) {
    startFrom = 735;
    endAt = 974;
    customWidth = 3413;
    const panX = interpolate(frame, [0, 1000], [0, -2333], { extrapolateRight: 'clamp' });
    panTransform = `translateX(${panX}px)`;
  }

  const isSakuraBg = src.includes('pixabay_sakura_peach_flowers_starry_sky_reflection_pond_re_156769');
  const bgBrightness = (isSakuraBg && currentAbsoluteFrame <= 540) 
    ? interpolate(currentAbsoluteFrame, [0, 540], [1.0, 1.4], { extrapolateRight: 'clamp' }) 
    : 1;
  const bgSaturation = (isSakuraBg && currentAbsoluteFrame <= 540)
    ? interpolate(currentAbsoluteFrame, [0, 540], [1.0, 1.2], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity, filter: `brightness(${bgBrightness}) saturate(${bgSaturation})` }}>
      <div style={{ 
        width: customWidth, height: '100%', 
        transform: panTransform,
        transformOrigin: '50% 50%' 
      }}>
        {isVideo ? (
          <Loop durationInFrames={startFrom && endAt ? endAt - startFrom : (endAt || 1800)}>
            <OffthreadVideo src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted startFrom={startFrom} endAt={endAt} />
          </Loop>
        ) : (
          <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
    </AbsoluteFill>
  );
};

export const CanvasImageKaleidoscope: React.FC<{
  src: string;
  frame: number;
  segments?: number;
  opacity?: number;
}> = ({ src, frame, segments = 12, opacity = 1 }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const img = new Image();
    img.src = staticFile(src);
    img.onload = () => setImage(img);
  }, [src]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    
    const angle = (Math.PI * 2) / segments;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) * 1.5;

    // Time-based animation
    const rotation = frame * 0.01;
    const zoom = 1.2 + Math.sin(frame * 0.02) * 0.1;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.rotate(i * angle);

      // Create clipping slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, -angle / 2, angle / 2);
      ctx.closePath();
      ctx.clip();

      // Mirror alternate segments
      if (i % 2 === 1) {
        ctx.scale(1, -1);
      }

      // Draw image
      const imgW = width * zoom;
      const imgH = height * zoom;
      ctx.drawImage(image, -imgW / 2, -imgH / 2, imgW, imgH);

      ctx.restore();
    }
    ctx.restore();

    // Vignette
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius / 2);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(5, 5, 15, 0.7)');
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(0, 0, width, height);

  }, [frame, image, width, height, segments]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
};

export const CanvasKaleidoscope: React.FC<{
  color1?: string;
  color2?: string;
  count?: number;
  opacity?: number;
}> = ({
  color1 = '#8800ff',
  color2 = '#ffdd44',
  count = 12,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const angleStep = (Math.PI * 2) / count;
    const time = frame * 0.02;
    const radiusBase = Math.min(width, height) * 0.8;

    ctx.save();
    ctx.translate(centerX, centerY);

    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.rotate(i * angleStep);

      // Create a symmetrical slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radiusBase * 1.5, -angleStep / 2, angleStep / 2);
      ctx.closePath();
      ctx.clip();

      const drawRibbon = (offset: number, scale: number, col: string) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 4;
        ctx.globalAlpha = opacity;
        
        // Draw filled shape background
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.globalAlpha = opacity * 0.2;
        for (let j = 0; j < 30; j++) {
          const t = j / 30;
          const r = t * radiusBase * scale;
          const θ = Math.sin(t * 5 + time + offset) * (angleStep * 0.4);
          const x = r * Math.cos(θ);
          const y = r * Math.sin(θ);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(0,0);
        ctx.fill();
        ctx.restore();

        // Main line
        ctx.beginPath();
        for (let j = 0; j < 60; j++) {
          const t = j / 60;
          const r = t * radiusBase * scale;
          const θ = Math.sin(t * 8 + time + offset) * (angleStep * 0.45);
          const x = r * Math.cos(θ);
          const y = r * Math.sin(θ);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Glowing dots
        const dotR = radiusBase * 0.5 * scale;
        const dotθ = Math.cos(time * 0.4 + offset) * (angleStep * 0.35);
        ctx.fillStyle = col;
        ctx.shadowBlur = 15;
        ctx.shadowColor = col;
        ctx.beginPath();
        ctx.arc(dotR * Math.cos(dotθ), dotR * Math.sin(dotθ), 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Geometric shards
        ctx.beginPath();
        ctx.moveTo(radiusBase * 0.3, 0);
        ctx.lineTo(radiusBase * 0.7 * Math.cos(angleStep * 0.3), radiusBase * 0.7 * Math.sin(angleStep * 0.3));
        ctx.strokeStyle = col;
        ctx.globalAlpha = opacity * 0.5;
        ctx.stroke();
      };

      drawRibbon(0, 1.2, color1);
      drawRibbon(Math.PI, 0.8, color2);
      drawRibbon(time * 0.5, 1.4, color2);
      drawRibbon(time * 0.8, 0.6, color1);

      ctx.restore();
    }
    ctx.restore();

    // Edge vignette
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radiusBase);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(5, 5, 15, 0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

  }, [frame, width, height, count, color1, color2, opacity]);

  return (
    <AbsoluteFill>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      />
    </AbsoluteFill>
  );
};

export const MagicBackground: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#050a10' }}>
      <CanvasImageKaleidoscope 
        src="assets/anime_magic_nebula_background.png" 
        frame={frame} 
        opacity={0.8}
        segments={12}
      />
      
      {/* Dynamic line kaleidoscope overlay */}
      <CanvasKaleidoscope opacity={0.5} />

      <AbsoluteFill style={{ 
        background: 'radial-gradient(circle, transparent 20%, rgba(5, 10, 20, 0.6) 100%)',
      }} />
    </AbsoluteFill>
  );
};

export const EmeraldBackground: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 1 }) => {
  const progress = frame / (35 * 30); 
  const scale = interpolate(progress, [0, 1], [1, 3.5]);
  const translateY = interpolate(progress, [0, 1], [0, -200]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      <div style={{ width: '100%', height: '100%', transform: `scale(${scale}) translateY(${translateY}px)`, transformOrigin: '50% 50%' }}>
        <Img src={staticFile('assets/anime_emerald_forest_background.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.1)' }} />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(circle, rgba(0,255,100,0.2) 0%, rgba(0,30,0,0.4) 100%)', mixBlendMode: 'overlay' }} />
    </AbsoluteFill>
  );
};

export const MagicCircle: React.FC<{
  frame: number;
  color: string;
  size?: number;
  rotationX?: number;
  rotationY?: number;
  perspective?: number;
  drawProgress?: number; // 0 to 1
}> = ({ 
  frame, 
  color, 
  size = 600, 
  rotationX = 0, 
  rotationY = 0, 
  perspective = 1000,
  drawProgress = 1,
}) => {
  const rotationOuter = frame * 0.5;
  const rotationInner = -frame * 0.8;
  const pulse = 0.95 + 0.05 * Math.sin(frame * 0.1);

  const runes = "✦ ⚛ ❂ ۞ ✵ ✺ ✹ ✸ ✷ ✶ ✴ ✳ ✲ ✱ ✰ ⚡ ✮ ✭ ✬ ✫ ✪ ✩ ✧ ✦ ✡ ❂ ❉ ❈ ❊ ❋";

  // Helper for drawing animation
  const getDrawStyles = (length: number) => ({
    strokeDasharray: length,
    strokeDashoffset: length * (1 - drawProgress),
  });

  return (
    <div style={{ 
      width: size, 
      height: size, 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      perspective: `${perspective}px`,
    }}>
      <div style={{
        transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
        transformStyle: 'preserve-3d',
      }}>
        <svg width={size} height={size} viewBox="0 0 400 400" style={{ filter: 'drop-shadow(0 0 10px ' + color + ')' }}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <path id="runePath" d="M 200, 200 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" />
          </defs>

          {/* Outer Ring */}
          <circle cx="200" cy="200" r="180" fill="none" stroke={color} strokeWidth="2" opacity="0.4" style={getDrawStyles(1131)} />
          <circle cx="200" cy="200" r="190" fill="none" stroke={color} strokeWidth="1" opacity="0.2" style={getDrawStyles(1194)} />

          {/* Runes Layer */}
          <g style={{ transform: `rotate(${rotationOuter}deg)`, transformOrigin: '200px 200px', opacity: drawProgress }}>
            <text fontSize="14" fill={color} opacity="0.8">
              <textPath href="#runePath" spacing="auto">
                {runes} {runes}
              </textPath>
            </text>
          </g>

          {/* Geometric Layers */}
          <g style={{ transform: `rotate(${rotationInner}deg) scale(${pulse})`, transformOrigin: '200px 200px', filter: 'url(#glow)' }}>
            {/* Hexagram */}
            <path
              d="M 200,80 L 310,260 L 90,260 Z"
              fill="none"
              stroke={color}
              strokeWidth="3"
              opacity="0.6"
              style={getDrawStyles(800)}
            />
            <path
              d="M 200,320 L 90,140 L 310,140 Z"
              fill="none"
              stroke={color}
              strokeWidth="3"
              opacity="0.6"
              style={getDrawStyles(800)}
            />
            
            {/* Inner Circles */}
            <circle cx="200" cy="200" r="100" fill="none" stroke={color} strokeWidth="4" opacity="0.3" style={getDrawStyles(628)} />
            <circle cx="200" cy="200" r="40" fill="none" stroke={color} strokeWidth="2" style={getDrawStyles(251)} />
            
            {/* Square */}
            <rect x="130" y="130" width="140" height="140" fill="none" stroke={color} strokeWidth="1" opacity="0.4" transform="rotate(45 200 200)" style={getDrawStyles(560)} />
          </g>

          {/* Orbitals */}
          {drawProgress > 0.8 && [0, 90, 180, 270].map((angle, i) => {
            const orbitAngle = rotationOuter * 1.5 + angle;
            const r = 165;
            const x = 200 + r * Math.cos((orbitAngle * Math.PI) / 180);
            const y = 200 + r * Math.sin((orbitAngle * Math.PI) / 180);
            return (
              <circle key={i} cx={x} cy={y} r="8" fill={color} filter="url(#glow)">
                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
              </circle>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export const Kaleidoscope: React.FC<{
  count?: number;
  children: React.ReactNode;
  opacity?: number;
}> = ({ count = 6, children, opacity = 1 }) => {
  const angle = 360 / count;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      {new Array(count).fill(0).map((_, i) => (
        <AbsoluteFill 
          key={i} 
          style={{ 
            transform: `rotate(${i * angle}deg)`,
            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((-angle / 2 * Math.PI) / 180)}% ${50 + 50 * Math.sin((-angle / 2 * Math.PI) / 180)}%, ${50 + 50 * Math.cos((angle / 2 * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle / 2 * Math.PI) / 180)}%)`
          }}
        >
          <AbsoluteFill style={{ transform: i % 2 === 1 ? 'scaleX(-1)' : 'none' }}>
            {children}
          </AbsoluteFill>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

export const SpeedLinesBackground: React.FC<{
  color?: string;
  count?: number;
  frame: number;
  opacity?: number;
}> = ({ color = '#ffffff', count = 100, frame, opacity = 1 }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = 2;

    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < count; i++) {
      const angle = random(i + frame * 10) * Math.PI * 2;
      const length = 200 + random(i + frame * 20) * 800;
      const startDist = 100 + random(i + frame * 30) * 200;

      const x1 = centerX + Math.cos(angle) * startDist;
      const y1 = centerY + Math.sin(angle) * startDist;
      const x2 = centerX + Math.cos(angle) * (startDist + length);
      const y2 = centerY + Math.sin(angle) * (startDist + length);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [frame, width, height, color, count, opacity]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
};

export const GlitchNoise: React.FC<{ frame: number; opacity?: number; rotation?: number }> = ({ frame, opacity = 0.3, rotation = 0 }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const { width, height } = useVideoConfig();
  
    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      ctx.clearRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);
  
      const sliceCount = 15;
      for (let i = 0; i < sliceCount; i++) {
          const sliceH = height / sliceCount;
          const xOffset = (random(i + frame) - 0.5) * 150 * (rotation !== 0 ? 2 : 1);
          const sliceW = width + 600;
          
          if (random(i + frame * 8) > 0.6) {
              const r = random(frame + i) > 0.5 ? 255 : 0;
              const g = random(frame + i + 1) > 0.5 ? 255 : 0;
              const b = random(frame + i + 2) > 0.5 ? 255 : 0;
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.4})`;
              ctx.fillRect(xOffset - 300, i * sliceH - 100, sliceW, sliceH + 200);
          }
      }
      
      // Fine static
      for (let i = 0; i < 200; i++) {
          const x = (random(i + frame) - 0.1) * width * 1.2;
          const y = (random(i + frame + 3) - 0.1) * height * 1.2;
          const size = random(i + frame + 4) * 3;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.fillRect(x, y, size, size);
      }
  
      ctx.restore();
  
    }, [frame, width, height, opacity, rotation]);
  
    return (
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 998 }}>
        <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: '100%', mixBlendMode: 'overlay' }} />
      </AbsoluteFill>
    );
  };

export const FlashOverlay: React.FC<{ frame: number; triggerFrames: number[] }> = ({ frame, triggerFrames }) => {
  const isTriggered = triggerFrames.some(f => frame >= f && frame < f + 5);
  const triggerFrame = triggerFrames.find(f => frame >= f && frame < f + 5);
  
  const opacity = isTriggered ? interpolate(frame - (triggerFrame || 0), [0, 5], [1, 0]) : 0;

  if (!isTriggered) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: 'white', opacity, pointerEvents: 'none', zIndex: 999 }} />
  );
};

/**
 * 2D Cyber Tunnel Effect
 * Higher performance than Three.js while providing similar depth
 */
export const CyberTunnel2D: React.FC<{ frame: number; color?: string }> = ({ frame, color = '#ffdd44' }) => {
  const ringCount = 10;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      {/* Dynamic Background Speed Lines */}
      <AbsoluteFill>
        {new Array(24).fill(0).map((_, i) => (
            <div
              key={`line-${i}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 2000,
                height: 1,
                background: `linear-gradient(to right, transparent, ${color}, transparent)`,
                transform: `rotate(${i * 15 + frame * 0.1}deg) translateX(-50%)`,
                opacity: 0.1,
                transformOrigin: 'center center',
              }}
            />
        ))}
      </AbsoluteFill>

      {/* Pulsing Depth Rings */}
      {new Array(ringCount).fill(0).map((_, i) => {
        const offset = i / ringCount;
        const progress = (frame * 0.03 + offset) % 1;
        const scale = interpolate(progress, [0, 1], [0.1, 10]);
        const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 0.8, 0]);
        const blur = interpolate(progress, [0, 1], [1, 15]);
        
        return (
          <div
            key={`ring-${i}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 800,
              height: 800,
              border: `2px solid ${color}`,
              borderRadius: '50%',
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity * 0.5,
              filter: `blur(${blur}px)`,
              boxShadow: `0 0 30px ${color}, inset 0 0 30px ${color}`,
            }}
          />
        );
      })}

      {/* Cyber Grid Perspective */}
      <AbsoluteFill style={{ perspective: '800px' }}>
         <div style={{
           position: 'absolute',
           bottom: 0, width: '200%', height: '50%', left: '-50%',
           backgroundImage: `
             repeating-linear-gradient(90deg, transparent 0px, ${color}44 1px, transparent 40px),
             repeating-linear-gradient(0deg, transparent 0px, ${color}44 1px, transparent 40px)
           `,
           backgroundPosition: `center ${frame * 2}px`,
           transform: 'rotateX(75deg)',
           transformOrigin: 'bottom center',
           opacity: 0.2,
         }} />
         <div style={{
           position: 'absolute',
           top: 0, width: '200%', height: '50%', left: '-50%',
           backgroundImage: `
             repeating-linear-gradient(90deg, transparent 0px, ${color}44 1px, transparent 40px),
             repeating-linear-gradient(0deg, transparent 0px, ${color}44 1px, transparent 40px)
           `,
           backgroundPosition: `center ${-frame * 2}px`,
           transform: 'rotateX(-75deg)',
           transformOrigin: 'top center',
           opacity: 0.2,
         }} />
      </AbsoluteFill>

      {/* Core Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 600,
        height: 600,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color} 0%, transparent 75%)`,
        opacity: 0.3,
        filter: 'blur(50px)',
      }} />
    </AbsoluteFill>
  );
};
export const ShockwaveEffect: React.FC<{
  frame: number;
  color?: string;
  glowColor?: string;
  maxRadius?: number;
  duration?: number;
  thickness?: number;
  zIndex?: number;
}> = ({
  frame,
  color = '#ff6400',
  glowColor = '#ff3c00',
  maxRadius = 1600,
  duration = 20,
  thickness = 15,
  zIndex = 6,
}) => {
  if (frame >= duration) return null;

  const progress = frame / duration;
  const opacity = Math.max(0, 1 - progress);
  const currentThickness = Math.max(0, thickness - frame * (thickness / duration));
  const currentRadius = interpolate(progress, [0, 1], [0, maxRadius]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex, opacity }}>
      <div style={{
        width: currentRadius,
        height: currentRadius,
        borderRadius: '50%',
        border: `${currentThickness}px solid ${color}`,
        boxShadow: `0 0 60px ${glowColor}`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};

export const SnowEffect: React.FC<{ frame: number; count?: number }> = ({ frame, count = 100 }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      {new Array(count).fill(0).map((_, i) => {
        const seed = i;
        const speed = 2 + random(seed) * 3;
        const x = random(seed + 1) * 100; // 0 to 100vw
        const size = 3 + random(seed + 2) * 10;
        const yOffset = random(seed + 3) * 1920;
        
        // Let it fall continuously
        const y = (yOffset + frame * speed) % 1920;
        const wobble = Math.sin(frame * 0.05 + seed) * 10;
        const opacity = 0.3 + random(seed + 4) * 0.7;

        return (
          <div key={i} style={{
            position: 'absolute',
            left: `calc(${x}% + ${wobble}px)`,
            top: y - 50,
            width: size,
            height: size,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity,
            filter: `blur(${random(seed + 5) * 3}px)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const LightPillarEffect: React.FC<{
  frame: number;
  color?: string;
  glowColor?: string;
  baseWidth?: number;
  baseHeight?: number;
}> = ({
  frame,
  color = '#ff6400',
  glowColor = '#ff3c00',
  baseWidth = 250,
  baseHeight = 600,
}) => {
  const { fps } = useVideoConfig();
  const entry = spring({ frame, fps, config: { stiffness: 400, damping: 15 } });
  const pulse = Math.pow(Math.max(0, 1 - frame / 45), 4) * 1.5 + 0.3;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 5 }}>
      <div style={{
        width: baseWidth + 150 * pulse, 
        height: baseHeight + 400 * pulse,
        background: `radial-gradient(ellipse at 50% 60%, white 0%, ${glowColor} 35%, ${color} 65%, transparent 80%)`,
        filter: `blur(${20 + 20 * pulse}px)`, 
        borderRadius: '40% 40% 60% 60%',
        boxShadow: `0 0 ${300 * pulse}px ${100 * pulse}px ${color}`, 
        transform: `scale(${pulse * entry})`,
      }} />
    </AbsoluteFill>
  );
};

export const GiantSnowflakeEffect: React.FC<{ frame: number; color?: string; glowColor?: string; count?: number }> = ({ frame, color = '#ffffff', glowColor = '#b3e5fc', count = 15 }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', perspective: 1000, zIndex: 5, overflow: 'hidden' }}>
      {new Array(count).fill(0).map((_, i) => {
        const seed = i * 13;
        const life = 120 + random(seed) * 60;
        const localTime = (frame + random(seed + 1) * life) % life;
        const progress = localTime / life;
        
        const startX = random(seed + 2) * 120 - 10;
        const endX = startX + (Math.sin(frame * 0.02 + seed) * 15);
        const yPos = interpolate(progress, [0, 1], [-300, 2200]);
        
        const baseScale = 0.2 + random(seed + 3) * 0.6;
        const scale = baseScale * (1 + Math.sin(progress * Math.PI) * 0.2);
        
        const rotate = frame * (1 + random(seed + 4) * 2) * (i % 2 === 0 ? 1 : -1);
        const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);

        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${endX}%`,
            top: 0,
            transform: `translateY(${yPos}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            filter: `drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 0 40px ${color})`,
          }}>
            <svg width="300" height="300" viewBox="0 0 100 100">
              <g stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {new Array(6).fill(0).map((_, j) => (
                  <g key={j} transform={`rotate(${j * 60} 50 50)`}>
                    <line x1="50" y1="50" x2="50" y2="10" />
                    <path d="M 50 30 L 40 20 M 50 30 L 60 20 M 50 15 L 43 5 M 50 15 L 57 5" />
                    <path d="M 50 40 L 45 35 M 50 40 L 55 35" />
                  </g>
                ))}
                <circle cx="50" cy="50" r="5" fill={color} opacity="0.9" />
                <circle cx="50" cy="50" r="10" strokeDasharray="1 3" strokeWidth="1" opacity="0.7" />
              </g>
            </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const SparkleEffect: React.FC<{ frame: number; count?: number; color?: string; glowColor?: string }> = ({ frame, count = 20, color = '#ffffff', glowColor = '#b3e5fc' }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', perspective: 1000, zIndex: 6 }}>
      {new Array(count).fill(0).map((_, i) => {
        const seed = i * 27;
        const x = random(seed) * 100;
        const y = random(seed + 1) * 100;
        const baseScale = 0.2 + random(seed + 2) * 1.5;
        
        const twinkleSpeed = 0.05 + random(seed + 3) * 0.1;
        const twinklePhase = random(seed + 4) * Math.PI * 2;
        const scale = baseScale * (0.5 + 0.5 * Math.sin(frame * twinkleSpeed + twinklePhase));
        const opacity = 0.2 + 0.8 * Math.pow(Math.sin(frame * twinkleSpeed + twinklePhase), 2);
        const rotate = frame * (1 + random(seed + 5) * 2) * (i % 2 === 0 ? 1 : -1);

        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
            opacity,
            width: 80, height: 80,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            filter: `drop-shadow(0 0 15px ${glowColor}) drop-shadow(0 0 30px ${color})`,
          }}>
             <svg width="80" height="80" viewBox="0 0 100 100">
               <path d="M 50 0 C 50 40 60 50 100 50 C 60 50 50 60 50 100 C 50 60 40 50 0 50 C 40 50 50 40 50 0 Z" fill={color} />
             </svg>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export * from './DoublingGridEffect';
export * from './MirrorLiverEffect';
export const GreenScreenOverlay: React.FC<{
  src: string;
  frame: number;
  startFrame?: number;
  flipX?: boolean;
  flipY?: boolean;
  blendMode?: React.CSSProperties['mixBlendMode'];
  opacity?: number;
  zIndex?: number;
}> = ({ src, frame, startFrame = 0, flipX = false, flipY = false, blendMode = 'screen', opacity = 1, zIndex = 5 }) => {
  if (frame < startFrame) return null;
  const transform = `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`;
  
  return (
    <AbsoluteFill style={{ mixBlendMode: blendMode, transform, pointerEvents: 'none', zIndex, opacity }}>
      <OffthreadVideo
        src={staticFile(src)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'url(#green-key)' }}
        muted
      />
    </AbsoluteFill>
  );
};

export const PanningVideoBackground: React.FC<{
  src: string;
  frame: number;
  startFrame: number;
  duration: number;
  startX?: number;
  endX?: number;
  zIndex?: number;
}> = ({ src, frame, startFrame, duration, startX = 0, endX = -50, zIndex = 0 }) => {
  if (frame < startFrame || frame >= startFrame + duration) return null;
  
  return (
    <AbsoluteFill style={{ zIndex, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        width: '200%', height: '100%', left: 0, top: 0,
        transform: `translateX(${interpolate(frame - startFrame, [0, duration], [startX, endX])}%)`
      }}>
        <OffthreadVideo
          src={staticFile(src)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
        />
      </div>
    </AbsoluteFill>
  );
};

export const VsDiagonalLayout: React.FC<{
  frame: number;
  fps: number;
  topPlayer: any;
  bottomPlayer: any;
  theme: any;
  popScale: number;
}> = ({ frame, fps, topPlayer, bottomPlayer, theme, popScale }) => {
  const wiggleLift1 = Math.sin(frame / 15) * 20;
  const wiggleRot1 = Math.cos(frame / 20) * 3;
  const wiggleLift2 = Math.cos(frame / 12) * 20;
  const wiggleRot2 = Math.sin(frame / 18) * 3;

  return (
    <AbsoluteFill style={{ transform: `scale(${popScale})` }}>
      <div style={{ position: 'absolute', left: 40, top: 140, textAlign: 'center', filter: `drop-shadow(0 0 100px ${topPlayer.glowColor})`, transform: `translateY(${wiggleLift1}px) rotate(${wiggleRot1}deg)` }}>
        <GlitchedIcon src={staticFile(topPlayer.image)} frame={frame} size={460} borderColor={topPlayer.borderColor} glowColor={topPlayer.glowColor} style={{ margin: '0 auto 15px' }} enabled={theme.features.useGlitch} />
        <KineticText text={topPlayer.name} frame={frame} fps={fps} startFrame={10} fontSize={80} color={topPlayer.borderColor} glowColor={topPlayer.glowColor} fontFamily={theme.fontFamily} animationType={theme.textAnimation} style={{ letterSpacing: 4 }} />
      </div>

      <div style={{ position: 'absolute', right: 40, bottom: 200, textAlign: 'center', filter: `drop-shadow(0 0 100px ${bottomPlayer.glowColor})`, transform: `translateY(${wiggleLift2}px) rotate(${wiggleRot2}deg)` }}>
        <GlitchedIcon src={staticFile(bottomPlayer.image)} frame={frame} size={460} borderColor={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} style={{ margin: '0 auto 15px' }} enabled={theme.features.useGlitch} />
        <KineticText text={bottomPlayer.name} frame={frame} fps={fps} startFrame={20} fontSize={80} color={bottomPlayer.borderColor} glowColor={bottomPlayer.glowColor} fontFamily={theme.fontFamily} animationType={theme.textAnimation} style={{ letterSpacing: 4 }} />
      </div>
    </AbsoluteFill>
  );
};

export const CustomDateTextManager: React.FC<{
  text: string;
  frame: number;
  fps: number;
  theme: any;
  fontSize1?: number;
  fontSize2?: number;
  startFrame1?: number;
  startFrame2?: number;
}> = ({ text, frame, fps, theme, fontSize1 = 120, fontSize2 = 200, startFrame1 = 10, startFrame2 = 15 }) => {
  const parts = text.split('<br/>');
  return (
    <>
      <KineticText
        text={parts[0] || ''}
        frame={frame} fps={fps} startFrame={startFrame1} fontSize={fontSize1}
        color="#FFF" glowColor={theme.glowColor} fontFamily={theme.fontFamily} animationType={theme.textAnimation}
        style={{ marginBottom: 10 }}
      />
      {parts.length > 1 && (
        <KineticText
          text={parts[1]}
          frame={frame} fps={fps} startFrame={startFrame2} fontSize={fontSize2}
          color="#FFF" glowColor={theme.glowColor} fontFamily={theme.fontFamily} animationType={theme.textAnimation}
          style={{ marginBottom: 20 }}
        />
      )}
    </>
  );
};

export const SakuraEndingBackground: React.FC<{ type: 'day' | 'night'; frame: number; duration: number }> = ({ type, frame, duration }) => {
  const framesPer2Beats = 25; // Approx 2 beats at 144 BPM and 30fps
  const beatCycle = Math.floor(frame / framesPer2Beats) % 4;
  const src = type === 'day' ? 'assets/images-01/spring_sakura_bg.png' : 'assets/images-01/spring_sakura_ending_night.png';
  
  // Continuous scale up
  const scale = 1.0 + (frame / duration) * 0.15;

  const gradings = [
    'saturate(1.0) brightness(1.0)',
    'saturate(1.4) brightness(1.1) hue-rotate(-15deg)', 
    'saturate(1.2) brightness(1.05)',
    'saturate(1.6) brightness(1.2) hue-rotate(15deg)', 
  ];

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <Img 
        src={staticFile(src)} 
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          filter: gradings[beatCycle]
        }} 
      />
    </AbsoluteFill>
  );
};

export * from './GridConvergenceEffect';
