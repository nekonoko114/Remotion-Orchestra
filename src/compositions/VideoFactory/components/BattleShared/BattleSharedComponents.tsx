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
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/NotoSansJP';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700', '900'],
  ignoreTooManyRequestsWarning: true,
});

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

export const Particle: React.FC<{ seed: number; frame: number; color: string }> = ({ seed, frame, color }) => {
  const life = 35 + random(seed + 5) * 30;
  const local = (frame + seed * 7) % life;
  const progress = local / life;
  const x = random(seed) * 1080;
  const baseY = 1920 * (0.4 + random(seed + 1) * 0.8);
  const speed = 15 + random(seed + 2) * 20;
  const w = 15 + random(seed + 3) * 60;
  const y = baseY - speed * local;
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
}> = ({ text, frame, fps, startFrame = 0, fontSize, color, glowColor, stagger = 8, style }) => {
  const t = frame - startFrame;
  const lines = text.replace(/<br\s*\/?>/gi, '\n').split('\n');

  return (
    <div style={{ fontFamily, textAlign: 'center', ...style }}>
      {lines.map((line, i) => {
        const lineStart = i * stagger;
        const s = spring({ frame: t - lineStart, fps, config: { stiffness: 500, damping: 20, mass: 1 } });
        const scale = interpolate(s, [0, 0.6, 1], [2.5, 0.9, 1]);
        const translateY = interpolate(s, [0, 1], [-80, 0]);
        const skewX = interpolate(s, [0, 0.4, 1], [-12, 4, 0]);
        const opacity = interpolate(t - lineStart, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const flicker = 0.88 + random(frame * 5 + i * 100) * 0.24;
        const impactBrightness = interpolate(t - lineStart, [0, 3, 8], [3.0, 1.5, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        return (
          <div key={i} style={{
            display: 'block', fontSize, fontWeight: 900, color, lineHeight: 1.15, letterSpacing: 2, opacity, whiteSpace: 'nowrap',
            transform: `translateY(${translateY}px) scale(${scale}) skewX(${skewX}deg)`,
            textShadow: `0 0 ${6 * flicker}px #fff, 0 0 ${18 * flicker}px ${glowColor}, 0 0 ${40 * flicker}px ${glowColor}, 0 0 ${80 * flicker}px ${glowColor}, 0 0 ${120 * flicker}px ${glowColor}`,
            filter: `brightness(${impactBrightness}) drop-shadow(0 4px 8px rgba(0,0,0,0.8))`,
          }}>
            {line}
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
}> = ({ frame, imageSrc, color, scale = 1, zoomProgress = 0, enabled = true }) => {
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
      <div style={{ position: 'absolute', width: 500, height: 700, borderRadius: 40, overflow: 'hidden', border: `8px solid ${color}`, boxShadow: `0 0 50px ${color}`, transformOrigin: 'right center', transform: `translateX(${-240 * leftOpen}px) rotateY(${35 * leftOpen}deg) ${getGlitchStyle(leftGlitch).transform}`, opacity: leftOpen > 0.01 ? (0.6 * leftOpen) : 0, filter: getGlitchStyle(leftGlitch).filter, zIndex: 1 }}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
      </div>
      <div style={{ position: 'absolute', width: 500, height: 700, borderRadius: 40, overflow: 'hidden', border: `8px solid ${color}`, boxShadow: `0 0 50px ${color}`, transformOrigin: 'left center', transform: `translateX(${240 * rightOpen}px) rotateY(${-35 * rightOpen}deg) ${getGlitchStyle(rightGlitch).transform}`, opacity: rightOpen > 0.01 ? (0.6 * rightOpen) : 0, filter: getGlitchStyle(rightGlitch).filter, zIndex: 1 }}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
      </div>
      <div style={{ width: 600, height: 800, borderRadius: 50, overflow: 'hidden', border: `12px solid #fff`, boxShadow: `0 0 100px #fff, 0 0 50px ${color}`, zIndex: 10, transform: `scale(${interpolate(centerOpen, [0, 1], [0.8, 1])}) ${getGlitchStyle(centerGlitch).transform}`, opacity: centerOpen > 0.01 ? 1 : 0, filter: getGlitchStyle(centerGlitch).filter }}>
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
        <Img src={staticFile('assets/anime_sunset_background.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.1)' }} />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(circle, rgba(255,100,0,0.2) 0%, rgba(30,0,0,0.4) 100%)', mixBlendMode: 'overlay' }} />
    </AbsoluteFill>
  );
};

export const CustomBackgroundImage: React.FC<{ src: string; frame: number; opacity?: number }> = ({ src, frame, opacity = 1 }) => {
  const scale = 1.1 + Math.sin(frame * 0.02) * 0.05;
  const rotate = Math.sin(frame * 0.01) * 2;

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      <div style={{ 
        width: '100%', height: '100%', 
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: '50% 50%' 
      }}>
        <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

export const GlitchNoise: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.3 }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const { width, height } = useVideoConfig();
  
    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      ctx.clearRect(0, 0, width, height);
  
      const sliceCount = 15;
      for (let i = 0; i < sliceCount; i++) {
          const sliceH = height / sliceCount;
          const xOffset = (random(i + frame) - 0.5) * 150;
          const sliceW = width + 300;
          
          if (random(i + frame * 8) > 0.6) {
              const r = random(frame + i) > 0.5 ? 255 : 0;
              const g = random(frame + i + 1) > 0.5 ? 255 : 0;
              const b = random(frame + i + 2) > 0.5 ? 255 : 0;
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.4})`;
              ctx.fillRect(xOffset - 150, i * sliceH, sliceW, sliceH);
          }
      }
      
      // Fine static
      for (let i = 0; i < 200; i++) {
          const x = random(i + frame) * width;
          const y = random(i + frame + 3) * height;
          const size = random(i + frame + 4) * 3;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.fillRect(x, y, size, size);
      }
  
    }, [frame, width, height, opacity]);
  
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
