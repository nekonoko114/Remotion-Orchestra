import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
  delayRender,
  continueRender,
  Img,
  Audio,
  staticFile,
} from 'remotion';
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  vec,
} from '@shopify/react-native-skia';

// @ts-ignore
import { loadFont } from '@remotion/google-fonts/NotoSansJP';
const { fontFamily } = loadFont('normal', {
  weights: ['400', '700', '900'],
  ignoreTooManyRequestsWarning: true,
});

// ========================
// Shader code strings
// ========================
const BLUE_FLAME_SKSL = `
uniform float time;
uniform vec2 resolution;
uniform float pulse;

float random(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(random(i), random(i + vec2(1,0)), f.x),
             mix(random(i + vec2(0,1)), random(i + vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; ++i) { v += a * noise(p); p = rot * p * 2.0 + 100.0; a *= 0.5; }
  return v;
}
// 炎のスケールを大きくし、縦に伸ばして「火柱」にする
vec4 main(vec2 fc) {
  vec2 uv = (fc / resolution.xy) * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y;
  uv.y *= 0.15; // 0.25 -> 0.1 (極限まで拡大)
  uv.x *= 0.3;  // 0.5 -> 0.3 (極限まで拡大)
  float n = fbm(uv * 2.0 - vec2(0.0, time * 0.7)); // 2.5 -> 2.0 (パターン密度を下げて大きく)
  float d = length(uv * vec2(1.5, 0.5)); 
  float g = smoothstep(1.5, 0.0, d) * pulse;
  float f = smoothstep(0.3, 0.7, n * g) * 1.8;
  vec3 col = vec3(0.0, 0.1, 1.0) * f
           + vec3(0.2, 0.4, 1.0) * pow(g, 3.0)
           + vec3(0.9, 0.95, 1.0) * pow(g, 10.0);
  return vec4(col, 1.0);
}
`;

const BLUE_INFERNO_SKSL = `
uniform float time;
uniform vec2 resolution;
uniform float intensity;
uniform vec3 color1;
uniform vec3 color2;

float random(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(random(i), random(i + vec2(1,0)), f.x),
             mix(random(i + vec2(0,1)), random(i + vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 6; ++i) { v += a * noise(p); p = rot * p * 2.0 + 100.0; a *= 0.5; }
  return v;
}
vec4 main(vec2 fc) {
  vec2 p = (fc / resolution.xy) * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  
  float angle = atan(p.y, p.x);
  float radius = length(p);
  
  // 渦巻き構造: 角度に半径を依存させて回転させる (Vortex)
  float swirl = radius * 1.0 + time * 0.5;
  vec2 uv = vec2((angle + swirl) / 6.2831, 1.0 / (radius + 0.02) - time * 1.5);
  
  vec2 q = uv;
  q.x *= 3.0; // 横方向の繰り返し
  q.y *= 0.8; // 奥行き方向のスケール
  
  float f = fbm(q);
  float tear = smoothstep(0.2, 0.8, f);
  
  // 中心（奥）に向かって吸い込まれる演出のため、中心付近の不透明度を調整
  float brightness = smoothstep(0.05, 0.6, radius) * intensity;
  
  vec3 col = mix(color1 * 0.05, color1, tear);
  col = mix(col, color2, pow(tear, 3.0));
  
  // 奥の方は収束するようにフェード
  col *= brightness;
  
  return vec4(col, 1.0);
}
`;

const KALEIDOSCOPE_SKSL = `
uniform float time;
uniform vec2 resolution;
uniform shader image;

vec2 kaleidoscope(vec2 uv, float n) {
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = abs(mod(angle, 6.2831 / n) - 3.1415 / n);
  return vec2(cos(angle), sin(angle)) * radius;
}

vec4 main(vec2 fc) {
  vec2 uv = (fc.xy / resolution.xy);
  vec2 p = uv * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  
  // 回転とゆっくりとした拡大縮小
  float t = time * 0.2;
  float s = 0.5 + sin(t * 0.5) * 0.2; 
  mat2 rot = mat2(cos(t), sin(t), -sin(t), cos(t));
  p = rot * p * s;
  
  // 万華鏡効果 (12面)
  p = kaleidoscope(p, 12.0);
  
  // サンプリング座標を [0, 1] に戻す
  vec2 samplePos = (p + 1.0) / 2.0;
  
  // 画面端で不自然にならないよう mod でリピート
  samplePos = mod(samplePos, 1.0);
  
  vec4 col = image.eval(samplePos * resolution.xy);
  
  // 中心のグローを足して青基調の高級感を出す
  float glow = exp(-length(p) * 2.5);
  col.rgb += vec3(0.5, 0.8, 1.0) * glow * 0.4;
  
  return col;
}
`

// ========================
// Hook: wait for Skia to be ready
// ========================
function useShaders() {
  const [handle] = useState(() => delayRender('Loading Skia shaders'));
  const [shaders, setShaders] = useState<{
    blueFlame: ReturnType<typeof Skia.RuntimeEffect.Make> | null;
    blueInferno: ReturnType<typeof Skia.RuntimeEffect.Make> | null;
    kaleidoscope: ReturnType<typeof Skia.RuntimeEffect.Make> | null;
  }>({ blueFlame: null, blueInferno: null, kaleidoscope: null });

  useEffect(() => {
    let attempt = 0;
    let cancelled = false;
    const tryCompile = () => {
      if (cancelled) return;
      attempt++;
      try {
        const skiaReady =
          typeof Skia !== 'undefined' &&
          Skia.RuntimeEffect != null &&
          typeof Skia.RuntimeEffect.Make === 'function';
        
        if (skiaReady) {
          const blueFlame = Skia.RuntimeEffect.Make(BLUE_FLAME_SKSL);
          const blueInferno = Skia.RuntimeEffect.Make(BLUE_INFERNO_SKSL);
          const kaleidoscope = Skia.RuntimeEffect.Make(KALEIDOSCOPE_SKSL);
          if (blueFlame && blueInferno && kaleidoscope) {
            setShaders({ blueFlame, blueInferno, kaleidoscope });
            continueRender(handle);
            return;
          }
        }
      } catch (_) {
        // Skia still initializing — silently retry
      }
      if (attempt < 100) setTimeout(tryCompile, 100);
      else continueRender(handle);
    };
    // Wait for Skia to be likely ready before first attempt
    setTimeout(tryCompile, 200);
    return () => { cancelled = true; };
  }, [handle]);

  return shaders;
}

// ========================
// Component: Kaleidoscope Background
// ========================
const KaleidoscopeBackground: React.FC<{
  imageSrc: string;
  frame: number;
  opacity?: number;
}> = ({ imageSrc, frame, opacity = 1 }) => {
  const segments = 12;
  const angle = 360 / segments;
  
  // アニメーション
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
        {/* 中央のブルーグロー */}
        <div style={{
          position: 'absolute',
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(0,150,255,0.4) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>
    </AbsoluteFill>
  );
};

// 炎のカラーバリエーション — 全シーンでブルー系にサイクル
const useFireColors = (frame: number, _globalFrame?: number) => {
  // 基本的に全て青・シアン系にする
  
  // 前半は2秒ごとに青の階調が循環
  const phase = Math.floor(frame / 60) % 4;
  const palettes = [
    { c1: [0.0, 0.1, 4.0], c2: [0.2, 0.5, 5.0] },  // 深い青・シアン
    { c1: [0.0, 0.3, 3.5], c2: [0.5, 0.8, 4.5] },  // スカイブルー
    { c1: [0.5, 0.0, 4.0], c2: [0.8, 0.3, 5.0] },  // ヴァイオレット・ブルー
    { c1: [0.0, 4.0, 2.0], c2: [0.5, 5.0, 4.0] },  // ターコイズ
  ];

  return palettes[phase];
};

// CSS particle (shared helper)
const Particle: React.FC<{ seed: number; frame: number; color: string }> = ({ seed, frame, color }) => {
  const life = 35 + random(seed + 5) * 30; // Faster life
  const local = (frame + seed * 7) % life;
  const progress = local / life;
  const x = random(seed) * 1080;
  const baseY = 1920 * (0.4 + random(seed + 1) * 0.8); // Start lower
  const speed = 15 + random(seed + 2) * 20; // Much faster upward
  const w = 15 + random(seed + 3) * 60; // Bigger particles
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

// SVG filter defs
const SvgDefs: React.FC<{ frame: number }> = ({ frame }) => {
  const freq = 0.01 + Math.sin(frame / 20) * 0.005; 
  const scale = 8 + Math.sin(frame / 10) * 4; // 20+10 -> 8+4
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="heat-haze">
          <feTurbulence type="fractalNoise" baseFrequency={`${freq} 0.02`} numOctaves="3" seed={frame % 100} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <filter id="glitch-blue"><feColorMatrix type="matrix" values="0 0 0 0 0 0 0.5 0 0 0 0 0 1 0 0 0 0 0 1 0" /></filter>
        <filter id="glitch-cyan"><feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" /></filter>
      </defs>
    </svg>
  );
};

const MirrorLiver: React.FC<{ 
  frame: number; 
  imageSrc: string; 
  color: string; 
  scale?: number;
  zoomProgress?: number;
}> = ({ 
  frame, 
  imageSrc, 
  color,
  scale = 1,
  zoomProgress = 0
}) => {
  const { fps } = useVideoConfig();
  
  // 各パネルの出現タイミングをずらす (左 -> 右 -> 真ん中)
  const leftOpen = spring({ frame, fps, config: { stiffness: 100, damping: 15 } });
  const rightOpen = spring({ frame: frame - 10, fps, config: { stiffness: 100, damping: 15 } });
  const centerOpen = spring({ frame: frame - 20, fps, config: { stiffness: 100, damping: 15 } });

  // グリッチ演出用のランダム値 (出現時のみ激しく)
  const glitchIntensity = (t: number) => Math.max(0, 1 - t / 20) * (random(frame + t) > 0.7 ? 1 : 0);
  const leftGlitch = glitchIntensity(frame);
  const rightGlitch = glitchIntensity(frame - 10);
  const centerGlitch = glitchIntensity(frame - 20);

  const getGlitchStyle = (intensity: number) => ({
    filter: intensity > 0 ? `hue-rotate(${random(frame) * 360}deg) brightness(1.5)` : 'none',
    transform: `translate(${(random(frame * 2) - 0.5) * 40 * intensity}px, ${(random(frame * 3) - 0.5) * 40 * intensity}px)`,
    opacity: intensity > 0.5 && random(frame) > 0.5 ? 0.3 : 1
  });

  return (
    <div style={{
      perspective: '1200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 800 * scale,
      position: 'relative',
      transform: `scale(${scale * (1 + zoomProgress * 4)}) translateY(${zoomProgress * 200}px)`,
    }}>
      {/* 左鏡 */}
      <div style={{
        position: 'absolute',
        width: 500, height: 700, borderRadius: 40, overflow: 'hidden',
        border: `8px solid ${color}`,
        boxShadow: `0 0 50px ${color}`,
        transformOrigin: 'right center',
        transform: `translateX(${-240 * leftOpen}px) rotateY(${35 * leftOpen}deg) ${getGlitchStyle(leftGlitch).transform}`,
        opacity: leftOpen > 0.01 ? (0.6 * leftOpen) : 0,
        filter: getGlitchStyle(leftGlitch).filter,
        zIndex: 1,
      }}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
      </div>

      {/* 右鏡 */}
      <div style={{
        position: 'absolute',
        width: 500, height: 700, borderRadius: 40, overflow: 'hidden',
        border: `8px solid ${color}`,
        boxShadow: `0 0 50px ${color}`,
        transformOrigin: 'left center',
        transform: `translateX(${240 * rightOpen}px) rotateY(${-35 * rightOpen}deg) ${getGlitchStyle(rightGlitch).transform}`,
        opacity: rightOpen > 0.01 ? (0.6 * rightOpen) : 0,
        filter: getGlitchStyle(rightGlitch).filter,
        zIndex: 1,
      }}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
      </div>

      {/* メイン（中央） */}
      <div style={{
        width: 600, height: 800, borderRadius: 50, overflow: 'hidden',
        border: `12px solid #fff`,
        boxShadow: `0 0 100px #fff, 0 0 50px ${color}`,
        zIndex: 10,
        transform: `scale(${interpolate(centerOpen, [0, 1], [0.8, 1])}) ${getGlitchStyle(centerGlitch).transform}`,
        opacity: centerOpen > 0.01 ? 1 : 0,
        filter: getGlitchStyle(centerGlitch).filter,
      }}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
};

const GlobalFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 10) * 0.2 + 0.8;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      <div style={{ 
        position: 'absolute', inset: 0,
        border: '12px solid rgba(0, 100, 255, 0.8)', 
        boxShadow: `inset 0 0 80px rgba(0, 0, 255, ${0.4 * pulse}), 0 0 80px rgba(0, 0, 255, ${0.4 * pulse})`,
      }} />
    </AbsoluteFill>
  );
};

const GlitchedIcon: React.FC<{ 
  src: string; 
  frame: number; 
  size: number; 
  borderColor: string; 
  glowColor: string;
  style?: React.CSSProperties;
}> = ({ src, frame, size, borderColor, glowColor, style }) => {
  const glitchTrigger = random(Math.floor(frame / 2)) > 0.85;
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

const LightLeak: React.FC<{ frame: number; color?: string }> = ({ frame, color = '#0066ff' }) => {
  const opacity = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.1, 0.4]
  );
  const move = Math.sin(frame * 0.02) * 100;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 90, overflow: 'hidden' }}>
      {/* Top Left */}
      <div style={{
        position: 'absolute',
        top: -200 + move,
        left: -200 - move,
        width: 1000,
        height: 1000,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(120px)',
        opacity,
        mixBlendMode: 'screen',
      }} />
      {/* Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: -300 - move,
        right: -300 + move,
        width: 1200,
        height: 1200,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(150px)',
        opacity: opacity * 0.8,
        mixBlendMode: 'screen',
      }} />
    </AbsoluteFill>
  );
};

const RotatingFocusLines: React.FC<{ frame: number; color?: string; count?: number }> = ({ 
  frame, 
  color = 'rgba(0, 100, 255, 0.3)', 
  count = 40 
}) => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={{
        width: 3000,
        height: 3000,
        transform: `rotate(${frame * 2}deg)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {new Array(count).fill(0).map((_, i) => {
          const angle = (i / count) * 360;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 2000,
                height: 4,
                background: `linear-gradient(to right, ${color}, transparent)`,
                transform: `rotate(${angle}deg) translateX(500px)`,
                transformOrigin: 'left center',
                opacity: 0.5 + Math.sin(frame * 0.2 + i) * 0.5,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ========================
// Kinetic Typography Component
// ========================
const KineticText: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame?: number;
  fontSize: number;
  color: string;
  glowColor: string;
  stagger?: number; // frames between each line's entrance
  style?: React.CSSProperties;
}> = ({ text, frame, fps, startFrame = 0, fontSize, color, glowColor, stagger = 8, style }) => {
  const t = frame - startFrame;
  const normalizedText = text.replace(/<br\s*\/?>/gi, '\n');
  const lines = normalizedText.split('\n');

  return (
    <div style={{
      fontFamily,
      textAlign: 'center',
      ...style,
    }}>
      {lines.map((line, i) => {
        const lineStart = i * stagger;
        const s = spring({
          frame: t - lineStart,
          fps,
          config: { stiffness: 500, damping: 20, mass: 1 },
        });

        // Impact + settle animation
        const scale = interpolate(s, [0, 0.6, 1], [2.5, 0.9, 1]);
        const translateY = interpolate(s, [0, 1], [-80, 0]);
        const skewX = interpolate(s, [0, 0.4, 1], [-12, 4, 0]);
        const opacity = interpolate(t - lineStart, [0, 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        // Saber flicker (ongoing ripple in glow)
        const flicker = 0.88 + random(frame * 5 + i * 100) * 0.24;

        // Flash burst at moment of arrival
        const impactBrightness = interpolate(
          t - lineStart,
          [0, 3, 8],
          [3.0, 1.5, 1.0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div key={i} style={{
            display: 'block',
            fontSize,
            fontWeight: 900,
            color,
            lineHeight: 1.15,
            letterSpacing: 2,
            opacity,
            whiteSpace: 'nowrap',
            transform: `translateY(${translateY}px) scale(${scale}) skewX(${skewX}deg)`,
            // Kinetic Saber Glow — no WebkitTextStroke
            textShadow: `
              0 0 ${6 * flicker}px #fff,
              0 0 ${18 * flicker}px ${glowColor},
              0 0 ${40 * flicker}px ${glowColor},
              0 0 ${80 * flicker}px ${glowColor},
              0 0 ${120 * flicker}px ${glowColor}
            `,
            filter: `brightness(${impactBrightness}) drop-shadow(0 4px 8px rgba(0,0,0,0.8))`,
          }}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

const TypingSaberText = KineticText;

// ========================
// Scene 1: オープニング (0-2s)
// ========================
const SceneOpening = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { blueInferno } = useShaders();
  const fireColors = useFireColors(frame);

  // 180frames for 6 seconds. phase every 60 frames.
  const phase = Math.floor(frame / 60);
  const text = phase === 0 ? "ガチバトル<br/>決定‼️" : phase === 1 ? "全員の力で<br/>バチバチに行くぞ!" : "俺に力を<br/>貸してくれ！";

  const localFrame = frame % 60;
  const entry = spring({ frame: localFrame, fps, config: { stiffness: 400, damping: 15 } });
  const pulse = Math.pow(Math.max(0, 1 - localFrame / 45), 4) * 1.5 + 0.3;

  // 画面外框の青いグローフレーム
  const framePulse = Math.sin(frame / 10) * 0.2 + 0.8;

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000005' }}>
      {/* 画面外框の青いグローフレーム */}
      <div style={{ 
        position: 'absolute', inset: 0,
        border: '15px solid rgba(0, 100, 255, 0.7)', 
        boxShadow: `inset 0 0 100px rgba(0, 120, 255, ${0.5 * framePulse}), 0 0 100px rgba(0, 80, 255, ${0.5 * framePulse})`,
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* スキャンライン（CRTエフェクト） */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)',
        opacity: 0.6,
      }} />

      {blueInferno ? (
        <Canvas style={{ flex: 1, opacity: 0.8 + 0.2 * pulse }}>
          <Fill>
            <Shader
              source={blueInferno}
              uniforms={{ time: frame / 5, resolution: vec(1080, 1920), intensity: 2.5, color1: fireColors.c1, color2: fireColors.c2 }}
            />
          </Fill>
        </Canvas>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(0,10,120,${0.7 * pulse}) 0%, transparent 70%)`,
        }} />
      )}

      {/* フェーズ切り替え時のショックウェーブリング */}
      {localFrame < 20 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 6 }}>
          <div style={{
            width: interpolate(localFrame, [0, 20], [0, 1600]),
            height: interpolate(localFrame, [0, 20], [0, 1600]),
            borderRadius: '50%',
            border: `${Math.max(0, 15 - localFrame * 0.7)}px solid rgba(0,150,255,${Math.max(0, 1 - localFrame / 20)})`,
            boxShadow: `0 0 60px rgba(0,100,255,${Math.max(0, 0.8 - localFrame / 20)})`,
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>
      )}

      {/* 放射状バースト（フェーズ切り替え瞬間） */}
      {localFrame < 8 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 3, pointerEvents: 'none' }}>
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 360;
            const len = interpolate(localFrame, [0, 8], [0, 500]);
            return (
              <div key={i} style={{
                position: 'absolute',
                width: len,
                height: Math.max(0, 4 - localFrame * 0.4),
                background: `rgba(30,150,255,${Math.max(0, 1 - localFrame / 8)})`,
                transformOrigin: '0% 50%',
                transform: `rotate(${angle}deg)`,
                filter: 'blur(1px)',
              }} />
            );
          })}
        </AbsoluteFill>
      )}

      {/* Core glow */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 250 + 150 * pulse, height: 600 + 400 * pulse,
          background: `radial-gradient(ellipse at 50% 60%, white 0%, #44ccff 35%, #0044ff 65%, transparent 80%)`,
          filter: `blur(${20 + 20 * pulse}px)`, borderRadius: '40% 40% 60% 60%',
          boxShadow: `0 0 ${300 * pulse}px ${100 * pulse}px rgba(0,100,255,1)`, 
          transform: `scale(${pulse * entry})`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 50px' }}>
        <KineticText
          text={text}
          frame={localFrame}
          fps={fps}
          fontSize={phase === 2 ? 210 : 170}
          color="#f0f5ff"
          glowColor="rgba(0,150,255,1)"
          style={{ 
            lineHeight: 1.2, 
            letterSpacing: 10,
            ...(phase === 2 ? {
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',     
              gap: '60px',
            } : {}),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return content as any;
};

// ========================
// Scene 2: バトルの日時 (2-4s)
// ========================
const SceneDate = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flash = Math.max(0, 1 - frame / 8); 
  const drop1 = spring({ frame: frame - 5, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const drop2 = spring({ frame: frame - 25, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  
  const shakeX = (random(frame) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 5) / 10);
  const shakeY = (random(frame + 11) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 25) / 10);

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000005', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 8} frame={frame} color={i % 2 === 0 ? '#0033cc' : '#00aaff'} />
      ))}
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash }} />}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 60 }}>
        {/* Date block */}
        <div style={{
          textAlign: 'center',
          transform: `scale(${interpolate(drop1, [0, 1], [5, 1])}) translateY(${interpolate(drop1, [0, 1], [-800, 0])}px)`,
          opacity: drop1 > 0.05 ? 1 : 0,
        }}>
          <KineticText
            text="2026年&#10;3月27日"
            frame={frame}
            fps={fps}
            startFrame={10}
            fontSize={210}
            color="#FFF"
            glowColor="#0066FF"
            style={{ marginBottom: 20 }}
          />
          <TypingSaberText
            text="Friday"
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={140}
            color="#FFF"
            glowColor="#00CCFF"
            style={{ letterSpacing: 10 }}
          />
        </div>

        {/* Time block */}
        <div style={{
          transform: `scale(${interpolate(drop2, [0, 1], [3, 1])}) skewX(-15deg)`,
          opacity: drop2 > 0.05 ? 1 : 0,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <TypingSaberText
            text="21:00"
            frame={frame}
            fps={fps}
            startFrame={45}
            fontSize={240}
            color="#FFF"
            glowColor="#0066FF"
            style={{ fontWeight: 900 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return content as any;
};

// ========================
// Scene 3: J.O.Lライバー (4-13s)
// ========================
const SceneLiver = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = Math.max(0, 1 - frame / 15);
  const bounceIntensity = Math.abs(Math.sin((frame - 10) / 4)) * Math.max(0, 1 - (frame - 10) / 30) * 100;
  const nameGlitchOffset = Math.max(0, 1 - (frame - 30) / 20) * (random(frame) - 0.5) * 40;

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000008', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      <KaleidoscopeBackground 
        imageSrc={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')} 
        frame={frame} 
        opacity={0.4} 
      />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${bounceIntensity}px)` }}>
          <MirrorLiver 
            frame={frame} 
            imageSrc={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')} 
            color="#0088ff" 
            zoomProgress={spring({
              frame: frame - (180 - 10),
              fps,
              config: { stiffness: 200, damping: 20 }
            })}
          />
        </div>

        <TypingSaberText
          text="🔆≒ユージン≒🔆"
          frame={frame}
          fps={fps}
          startFrame={35}
          fontSize={120}
          color="#00FFFF"
          glowColor="#0066FF"
          style={{ 
            marginTop: 40, 
            WebkitTextStroke: '4px #002255', 
            letterSpacing: 5,
            transform: `scale(${spring({ frame: frame - 25, fps, config: { stiffness: 400 } })}) translateX(${nameGlitchOffset}px)`,
          }}
        />
      </AbsoluteFill>
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash }} />}
    </AbsoluteFill>
  );

  return content as any;
};

// ========================
// Scene 4: 対戦相手告知 (13-14.5s)
// ========================
const SceneOpponentAnnounce = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const textFlash = Math.floor(frame / 4) % 2 === 0 ? 1 : 0.2; // Rapid glitch flash
  const scale = spring({ frame, fps, config: { stiffness: 400, damping: 10 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      {/* Deep Blue Glow Background */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle at 50% 50%, #000044 0%, #000 70%)',
        opacity: interpolate(frame, [0, 10], [0, 1]),
      }} />

      <AbsoluteFill style={{ filter: 'url(#glitch-blue)', opacity: 0.6, transform: `translateX(${(frame % 2) * 20}px)` }}>
        <div style={{ flex: 1, border: '40px solid #000066' }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <KineticText
          text="対戦相手は！？"
          frame={frame}
          fps={fps}
          fontSize={120}
          color="#FFF"
          glowColor="#0066FF"
          style={{ 
            letterSpacing: 20,
            transform: `scale(${interpolate(scale, [0, 1], [4.0, 1])}) rotate(${interpolate(scale, [0, 1], [360, 0])}deg) skewX(-15deg)`,
            opacity: textFlash,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========================
// Scene 5: 対戦相手 (14.5-17.5s)
// ========================
const SceneOpponent = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drop = spring({ frame: frame - 5, fps, config: { stiffness: 600, damping: 12, mass: 2 } });
  const impact = Math.max(0, 1 - Math.max(0, frame - 5) / 10);
  
  const shakeX = (random(frame) - 0.5) * 60 * impact;
  const shakeY = (random(frame + 11) - 0.5) * 60 * impact;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000005', overflow: 'hidden' }}>
      <KaleidoscopeBackground 
        imageSrc={staticFile('assets/images-01/mrm0115-01.png')} 
        frame={frame} 
        opacity={0.4} 
      />
      <SvgDefs frame={frame} />
      {impact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: impact, zIndex: 10 }} />}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          transform: `scale(${interpolate(drop, [0, 0.4, 1], [5, 0.9, 1])}) translateY(${interpolate(drop, [0, 1], [-1000, 0])}px)`,
          filter: `brightness(${1 + impact * 5}) drop-shadow(0 0 ${impact * 100}px #0066ff)`,
          opacity: drop > 0.05 ? 1 : 0,
        }}>
          <div style={{ 
             width: 800, height: 800, borderRadius: '50%', overflow: 'hidden', 
             border: '10px solid white', marginBottom: 20, boxShadow: '0 0 50px #0066ff' 
          }}>
            <Img src={staticFile('assets/images-01/mrm0115-01.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <KineticText
            text="限界突破まみ🎽"
            frame={frame}
            fps={fps}
            startFrame={15}
            fontSize={140}
            color="white"
            glowColor="#0066FF"
            style={{ 
              letterSpacing: 4,
              whiteSpace: 'nowrap'
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========================
// Scene 6: VS (17.5-21.5s)
// ========================
const SceneVs = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 600, damping: 15 } }); 
  const shakeDecay = Math.max(0, 1 - frame / 40); 
  const shakeX = (random(frame) - 0.5) * 60 * shakeDecay; 
  const shakeY = (random(frame + 9) - 0.5) * 60 * shakeDecay; 
  const flashOpacity = Math.max(0, 1 - frame / 4); 

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {flashOpacity > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flashOpacity, zIndex: 10 }} />}
      <RotatingFocusLines frame={frame} color="rgba(0, 50, 255, 0.4)" />

      <AbsoluteFill style={{ transform: `scale(${1 + shakeDecay * 0.1}) translate(${shakeX}px, ${shakeY}px)` }}>
        <KaleidoscopeBackground 
          imageSrc={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')} 
          frame={frame} 
          opacity={0.3} 
        />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            transform: `scale(${pop})`,
            gap: 20 
          }}>
            <div style={{ textAlign: 'center', filter: 'drop-shadow(0 0 100px #00aaff)' }}>
              <GlitchedIcon 
                src={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')}
                frame={frame}
                size={600}
                borderColor="#E0FFFF"
                glowColor="#00aaff"
                style={{ margin: '0 auto 15px' }}
              />
              <KineticText
                text="🔆≒ユージン≒🔆"
                frame={frame}
                fps={fps}
                startFrame={10}
                fontSize={90}
                color="#E0FFFF"
                glowColor="#00aaff"
                style={{ letterSpacing: 4 }}
              />
            </div>
            
            {/* VS Glitch Text - Center */}
            <div style={{ position: 'relative', height: 120, zIndex: 10 }}>
               <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: '#0044ff', fontStyle: 'italic', transform: `translate(-20px, 10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: 'cyan', fontStyle: 'italic', transform: `translate(20px, -10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ 
                   position: 'relative',
                   fontSize: 260, fontWeight: 900, color: 'white', fontStyle: 'italic', 
                   transform: `rotate(${Math.sin(frame / 3) * 15}deg)`, 
                   WebkitTextStroke: '8px black',
                   textShadow: '0 0 100px rgba(0,255,255,0.8)'
                 }}>
                   VS
                 </div>
               </div>
            </div>
            
            <div style={{ textAlign: 'center', filter: 'drop-shadow(0 0 100px #0066ff)' }}>
              <GlitchedIcon 
                src={staticFile('assets/images-01/mrm0115-01.png')}
                frame={frame}
                size={600}
                borderColor="white"
                glowColor="#0066ff"
                style={{ margin: '15px auto 10px' }}
              />
              <KineticText
                text="限界突破まみ🎽"
                frame={frame}
                fps={fps}
                startFrame={20}
                fontSize={90}
                color="#FFF"
                glowColor="#0066ff"
                style={{ letterSpacing: 4 }}
              />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return content as any;
};

// ========================
// Scene 7: ルール (21.5-24.5s)
// ========================
const SceneRules = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const r1 = spring({ frame: frame - 10, fps, config: { stiffness: 600, damping: 10 } });
  const r2 = spring({ frame: frame - 40, fps, config: { stiffness: 600, damping: 10 } });
  
  const rulesImpact = Math.max(0, 1 - Math.max(0, frame - 10) / 6) + Math.max(0, 1 - Math.max(0, frame - 40) / 6);
  const shakeX = (random(frame) - 0.5) * 30 * Math.min(1, rulesImpact);
  const shakeY = (random(frame + 77) - 0.5) * 30 * Math.min(1, rulesImpact);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000004', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      {rulesImpact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: rulesImpact * 0.8, zIndex: 10 }} />}

      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 19 + 800} frame={frame} color={i % 2 === 0 ? '#0044ff' : '#00ccff'} />
      ))}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 80 }}>
        <div style={{
          transform: `scale(${interpolate(r1, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${-(interpolate(r1, [0, 1], [20, 5]))}deg)`,
          opacity: r1 > 0.05 ? 1 : 0,
          filter: `drop-shadow(0 0 100px #0066ff)`,
        }}>
            <TypingSaberText
              text="やり直し無し<br/>一本勝負"
              frame={frame}
              fps={fps}
              startFrame={20}
              fontSize={160}
              color="#FFF"
              glowColor="#0044ff"
              style={{ fontWeight: 900 }}
            />
        </div>

        <div style={{
          transform: `scale(${interpolate(r2, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${interpolate(r2, [0, 1], [-20, 5])}deg)`,
          opacity: r2 > 0.05 ? 1 : 0,
          filter: `drop-shadow(0 0 100px #00ffff)`,
        }}>
            <TypingSaberText
              text="フルアイテム"
              frame={frame}
              fps={fps}
              startFrame={50}
              fontSize={160}
              color="#FFF"
              glowColor="#00ccff"
              style={{ fontWeight: 900 }}
            />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ========================
// Scene 8: バトルに向けて一言 (24.5-29.5s)
// ========================
const SceneEnding = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { blueInferno } = useShaders();
  const fireColors = useFireColors(frame, 200);

  const fadeOut = interpolate(frame, [240, 300], [1, 0], { extrapolateRight: 'clamp' }); 

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      {frame < 10 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: 1 - frame / 10, zIndex: 10 }} />}
      
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {blueInferno ? (
          <Canvas style={{ flex: 1 }}>
            <Fill>
              <Shader 
                source={blueInferno} 
                uniforms={{ 
                  time: frame / 5, 
                  resolution: vec(1080, 1920), 
                  intensity: 3.0,
                  color1: fireColors.c1,
                  color2: fireColors.c2
                }} 
              />
            </Fill>
          </Canvas>
        ) : (
          new Array(60).fill(0).map((_, i) => (
            <Particle key={i} seed={i * 31} frame={frame} color={i % 2 === 0 ? '#0066ff' : '#00ccff'} />
          ))
        )}

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,10,0.6) 30%, rgba(0,0,20,0.7) 70%, transparent 100%)',
          }} />
          <KineticText
            text="配信再開の&#10;３月&#10;有終の美を&#10;飾りたいです！！"
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={110}
            color="#FFFFFF"
            glowColor="#0066FF"
            style={{ 
              lineHeight: 1.5, 
              letterSpacing: 5,
              position: 'relative',
              zIndex: 2,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return content as any;
};

// ========================
// Scene 9: Logo (29.5-32.5s)
// ========================
const SceneLogo = (): any => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 180], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Img
        src={staticFile('jol-logo-800.png')}
        style={{
          width: 800,
          opacity,
          transform: `scale(${scale})`,
          filter: 'drop-shadow(0 0 80px rgba(0,150,255,0.6))',
        }}
      />
    </AbsoluteFill>
  );
};

// ========================
// Main Composition
// ========================
export const JolBattleSpiritBlue: React.FC = () => {
  const { fps } = useVideoConfig();
  
  const OP_DUR = 6 * fps;      
  const DATE_DUR = 4 * fps;    
  const INTRO_LIVER_DUR = 6 * fps;
  const MSG_DUR = 1.5 * fps;   
  const OPPONENT_DUR = 3 * fps; 
  const VS_DUR = 4 * fps;      
  const RULE_DUR = 3 * fps;    
  const ENDING_DUR = 5 * fps;  
  const LOGO_DUR = 3 * fps;

  const s1 = 0;
  const s2 = s1 + OP_DUR;
  const s3 = s2 + DATE_DUR;
  const s4 = s3 + INTRO_LIVER_DUR;
  const s5 = s4 + MSG_DUR;
  const s6 = s5 + OPPONENT_DUR;
  const s7 = s6 + VS_DUR;
  const s8 = s7 + RULE_DUR;
  const s9 = s8 + ENDING_DUR;

  return (
    <AbsoluteFill>
      <GlobalFrame />
      <Audio src={staticFile('assets/audio/music/冷蔵庫のメモ.mp3')} volume={0.6} loop />
      <LightLeak frame={useCurrentFrame()} />

      <Sequence from={s1} durationInFrames={OP_DUR}><SceneOpening /></Sequence>
      <Sequence from={s2} durationInFrames={DATE_DUR}><SceneDate /></Sequence>
      <Sequence from={s3} durationInFrames={INTRO_LIVER_DUR}><SceneLiver /></Sequence>
      <Sequence from={s4} durationInFrames={MSG_DUR}><SceneOpponentAnnounce /></Sequence>
      <Sequence from={s5} durationInFrames={OPPONENT_DUR}><SceneOpponent /></Sequence>
      <Sequence from={s6} durationInFrames={VS_DUR}><SceneVs /></Sequence>
      <Sequence from={s7} durationInFrames={RULE_DUR}><SceneRules /></Sequence>
      <Sequence from={s8} durationInFrames={ENDING_DUR}><SceneEnding /></Sequence>
      <Sequence from={s9} durationInFrames={LOGO_DUR}><SceneLogo /></Sequence>
    </AbsoluteFill>
  );
};
