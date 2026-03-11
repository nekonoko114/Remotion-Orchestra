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

const RED_INFERNO_SKSL = `
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

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; ++i) { v += a * noise(p); p = rot * p * 2.0 + 50.0; a *= 0.5; }
  return v;
}

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
  
  // 回転と拡大
  float t = time * 0.15;
  float s = cos(t) * 0.15 + 0.85;
  mat2 rot = mat2(cos(t), sin(t), -sin(t), cos(t));
  p = rot * p * s;
  
  // 万華鏡効果 (10面)
  p = kaleidoscope(p, 10.0);
  
  // プロシージャルなパターン生成
  float f = fbm(p * 3.0 + time * 0.3);
  float f2 = fbm(p * 5.0 - time * 0.2);
  
  // 赤・オレンジ・金色の炎のようなカラーパレット
  vec3 c1 = vec3(0.8, 0.1, 0.0);  // 深い赤
  vec3 c2 = vec3(1.0, 0.4, 0.0);  // オレンジ
  vec3 c3 = vec3(1.0, 0.85, 0.2); // ゴールド
  
  vec3 col = mix(c1, c2, f);
  col = mix(col, c3, pow(f2, 2.0));
  
  // 中心のグロー
  float glow = exp(-length(p) * 1.5);
  col += vec3(1.0, 0.6, 0.1) * glow * 0.5;
  
  return vec4(col, 1.0);
}
`;

// ========================
// Hook: wait for Skia to be ready
// ========================
function useShaders() {
  const [handle] = useState(() => delayRender('Loading Skia shaders'));
  const [shaders, setShaders] = useState<{
    blue: ReturnType<typeof Skia.RuntimeEffect.Make> | null;
    red: ReturnType<typeof Skia.RuntimeEffect.Make> | null;
    kaleidoscope: ReturnType<typeof Skia.RuntimeEffect.Make> | null;
  }>({ blue: null, red: null, kaleidoscope: null });

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
          const blue = Skia.RuntimeEffect.Make(BLUE_FLAME_SKSL);
          const red = Skia.RuntimeEffect.Make(RED_INFERNO_SKSL);
          const kaleidoscope = Skia.RuntimeEffect.Make(KALEIDOSCOPE_SKSL);
          if (blue && red && kaleidoscope) {
            setShaders({ blue, red, kaleidoscope });
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

// 炎のカラーバリエーションをReact側で制御 (グローバルフレーム対応版)
const useFireColors = (frame: number, globalFrame?: number) => {
  const gf = globalFrame ?? frame;
  
  // frame 180（シーン内フレーム）以降は青灮に切り替わる
  if (gf >= 180) {
    // 青・コバルトブルーの車肎
    const blueFlicker = 0.8 + Math.sin(frame * 0.3) * 0.2;
    return {
      c1: [0.0, 0.2 * blueFlicker, 4.0],  // Deep blue
      c2: [0.3 * blueFlicker, 0.8, 5.0],  // Bright cyan-blue
    };
  }

  const cycleSpeed = 0.02;
  const phase = Math.floor(frame * cycleSpeed) % 3;
  
  // Skiaのvec3は [r, g, b] の配列形式
  const palettes = [
    { c1: [4.0, 0.2, 0.0], c2: [4.0, 1.2, 0.0] },  // Red/Orange
    { c1: [1.5, 0.0, 3.0], c2: [3.5, 0.5, 3.5] },  // Purple/Pink
    { c1: [4.0, 2.5, 0.0], c2: [5.0, 5.0, 2.0] },  // Gold/White
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
  const freq = 0.01 + Math.sin(frame / 20) * 0.005; // 0.02 -> 0.01 (calmer)
  const scale = 20 + Math.sin(frame / 10) * 10; // 50+30 -> 20+10 (much lower)
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
        <filter id="glitch-red"><feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" /></filter>
        <filter id="glitch-cyan"><feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" /></filter>
      </defs>
    </svg>
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

// Alias for backwards compatibility
const TypingSaberText = KineticText;

// ========================
// Scene 1: オープニング (0-2s)
// ========================
const SceneOpening = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { blue: blueShader } = useShaders();

  // 180frames for 6 seconds. phase every 60 frames.
  const phase = Math.floor(frame / 60);
  const text = phase === 0 ? "ガチバトル<br/>決定‼️" : phase === 1 ? "全員の力で<br/>バチバチに行くぞ!" : "いざ出陣！";

  const localFrame = frame % 60;
  const entry = spring({ frame: localFrame, fps, config: { stiffness: 400, damping: 15 } });
  const pulse = Math.pow(Math.max(0, 1 - localFrame / 45), 4) * 1.5 + 0.3;

  // 青いフレーム（枠）の演出
  const framePulse = Math.sin(frame / 10) * 0.2 + 0.8;

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000008' }}>
      {/* 画面外枠の青いグローフレーム */}
      <div style={{ 
        position: 'absolute', inset: 0,
        border: '15px solid rgba(0, 100, 255, 0.6)', 
        boxShadow: `inset 0 0 100px rgba(0, 150, 255, ${0.5 * framePulse}), 0 0 100px rgba(0, 150, 255, ${0.5 * framePulse})`,
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {blueShader ? (
        <Canvas style={{ flex: 1, opacity: 0.8 + 0.2 * pulse }}>
          <Fill>
            <Shader
              source={blueShader}
              uniforms={{ time: frame / 60, resolution: vec(1080, 1920), pulse }}
            />
          </Fill>
        </Canvas>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(10,10,120,${0.7 * pulse}) 0%, transparent 70%)`,
        }} />
      )}

      {/* Core glow */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 250 + 150 * pulse, height: 600 + 400 * pulse, // 縦長に
          background: `radial-gradient(ellipse at 50% 60%, white 0%, #88aaff 35%, #2244ff 65%, transparent 80%)`,
          filter: `blur(${20 + 20 * pulse}px)`, borderRadius: '40% 40% 60% 60%',
          boxShadow: `0 0 ${300 * pulse}px ${100 * pulse}px rgba(50,100,255,1)`, 
          transform: `scale(${pulse * entry})`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 50px' }}>
        <KineticText
          text={text}
          frame={localFrame}
          fps={fps}
          fontSize={phase === 2 ? 210 : 170}
          color="#e6f0ff"
          glowColor="rgba(50,150,255,1)"
          style={{ 
            lineHeight: 1.2, 
            letterSpacing: 10,
            ...(phase === 2 ? {
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              whiteSpace: 'nowrap',
              height: '85vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 8} frame={frame} color={i % 2 === 0 ? '#cc0000' : '#ff4400'} />
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
            color="#FF0000"
            glowColor="#FF0000"
            style={{ marginBottom: 20 }}
          />
          <TypingSaberText
            text="Friday"
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={140}
            color="#FFF"
            glowColor="#FFD700"
            style={{ letterSpacing: 10 }}
          />
        </div>

        {/* Time block */}
        <div style={{
          background: '#FFF', padding: '20px 80px', borderRadius: 40, border: '15px solid #FF0000',
          boxShadow: '20px 20px 0 #FFD700, 0 0 100px #FF0000',
          transform: `scale(${interpolate(drop2, [0, 1], [3, 1])}) skewX(-15deg)`,
          opacity: drop2 > 0.05 ? 1 : 0,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <TypingSaberText
            text="21:00"
            frame={frame}
            fps={fps}
            startFrame={45}
            fontSize={190}
            color="#000"
            glowColor="transparent"
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
  const { kaleidoscope: kShader } = useShaders();

  const flash = Math.max(0, 1 - frame / 15);
  const slam = spring({ frame: frame - 10, fps, config: { stiffness: 600, damping: 12, mass: 1.5 } });
  const scale = interpolate(slam, [0, 0.5, 1], [6, 0.8, 1]);
  const yPos = interpolate(slam, [0, 1], [-1200, 0]);
  const bounceIntensity = Math.abs(Math.sin((frame - 10) / 4)) * Math.max(0, 1 - (frame - 10) / 30) * 100;
  const nameGlitchOffset = Math.max(0, 1 - (frame - 30) / 20) * (random(frame) - 0.5) * 40;

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#080000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      {kShader ? (
        <AbsoluteFill>
          <Canvas style={{ flex: 1 }}>
            <Fill>
              <Shader 
                source={kShader} 
                uniforms={{ time: frame / 30, resolution: vec(1080, 1920) }} 
              />
            </Fill>
          </Canvas>
          <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          {new Array(80).fill(0).map((_, i) => (
            <Particle key={i} seed={i * 23} frame={frame} color={i % 2 === 0 ? '#ff2200' : '#ff6600'} />
          ))}
        </AbsoluteFill>
      )}

      {/* 激しく落下するアイコン */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 700, height: 700, borderRadius: '50%', backgroundColor: '#0a0000', 
          border: '24px solid #ff4400',
          boxShadow: `0 0 350px rgba(255,50,0,1), inset 0 0 150px rgba(255,50,0,0.5)`, 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          transform: `scale(${scale}) translateY(${yPos + bounceIntensity}px)`,
          opacity: slam > 0.05 ? 1 : 0, 
          filter: `drop-shadow(0 0 100px #ff0000)`,
          overflow: 'hidden',
        }}>
          <Img src={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <TypingSaberText
          text="🔆≒ユージン≒🔆"
          frame={frame}
          fps={fps}
          startFrame={35}
          fontSize={120}
          color="#FFD700"
          glowColor="#FF6600"
          style={{ 
            marginTop: 100, 
            WebkitTextStroke: '4px #500', 
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
      {/* Glitch filter over the scene */}
      <SvgDefs frame={frame} />
      <AbsoluteFill style={{ filter: 'url(#glitch-red)', opacity: 0.8, transform: `translateX(${(frame % 3) * 15}px)` }}>
        <div style={{ flex: 1, backgroundColor: '#220000' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ filter: 'url(#glitch-cyan)', opacity: 0.8, transform: `translateX(${-(frame % 3) * 15}px)` }}>
        <div style={{ flex: 1, backgroundColor: '#002222' }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TypingSaberText
          text="対戦相手"
          frame={frame}
          fps={fps}
          fontSize={180}
          color="#FFF"
          glowColor="#FF0000"
          style={{ 
            letterSpacing: 30,
            transform: `scale(${interpolate(scale, [0, 1], [3.0, 1])}) skewX(-15deg)`,
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
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 9} frame={frame} color={i % 2 === 0 ? '#ff0000' : '#ff4400'} />
      ))}
      {impact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: impact, zIndex: 10 }} />}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          transform: `scale(${interpolate(drop, [0, 0.4, 1], [5, 0.9, 1])}) translateY(${interpolate(drop, [0, 1], [-1000, 0])}px)`,
          filter: `brightness(${1 + impact * 5}) drop-shadow(0 0 ${impact * 100}px red)`,
          opacity: drop > 0.05 ? 1 : 0,
        }}>
          <div style={{ 
             width: 800, height: 800, borderRadius: '50%', overflow: 'hidden', 
             border: '10px solid white', marginBottom: 20, boxShadow: '0 0 50px red' 
          }}>
            <Img src={staticFile('assets/images-01/mrm0115.jpeg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <TypingSaberText
            text="限界突破まみ🎽"
            frame={frame}
            fps={fps}
            startFrame={15}
            fontSize={130}
            color="white"
            glowColor="#ff0000"
            style={{ 
              WebkitTextStroke: '3px #800',
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
  const { red: redShader } = useShaders();
  const fireColors = useFireColors(frame, 200); // 全グローバル180fr以降なので青炎

  const pop = spring({ frame, fps, config: { stiffness: 600, damping: 15 } }); 
  const shakeDecay = Math.max(0, 1 - frame / 40); 
  const shakeX = (random(frame) - 0.5) * 60 * shakeDecay; // 180 -> 60
  const shakeY = (random(frame + 9) - 0.5) * 60 * shakeDecay; // 180 -> 60
  const flashOpacity = Math.max(0, 1 - frame / 4); 

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {flashOpacity > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flashOpacity, zIndex: 10 }} />}

      <AbsoluteFill style={{ transform: `scale(${1 + shakeDecay * 0.1}) translate(${shakeX}px, ${shakeY}px)`, filter: 'url(#heat-haze)' }}>
        {redShader ? (
          <Canvas style={{ flex: 1, filter: `brightness(${1 + shakeDecay * 2})` }}>
            <Fill>
              <Shader 
                source={redShader} 
                uniforms={{ 
                  time: frame / 15, 
                  resolution: vec(1080, 1920), 
                  intensity: 2.5,
                  color1: fireColors.c1,
                  color2: fireColors.c2
                }} 
              />
            </Fill>
          </Canvas>
        ) : (
          new Array(80).fill(0).map((_, i) => (
            <Particle key={i} seed={i * 13 + 2000} frame={frame} color={['#ff0000', '#ff6600', '#0055ff', '#ff2200', '#ffaa00'][i % 5]} />
          ))
        )}

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', // 縦並びに変更
            alignItems: 'center', 
            transform: `scale(${pop})`,
            gap: 20 
          }}>
            {/* Top: Eugene */}
            <div style={{ textAlign: 'center', filter: 'drop-shadow(0 0 100px orange)' }}>
              <div style={{ 
                width: 450, height: 450, borderRadius: '50%', overflow: 'hidden', // 300 -> 450
                border: '15px solid #FFE4B5', margin: '0 auto 10px', boxShadow: '0 0 80px orange' 
              }}>
                <Img src={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <TypingSaberText
                text="ユージン"
                frame={frame}
                fps={fps}
                startFrame={10}
                fontSize={80}
                color="#FFE4B5"
                glowColor="orange"
                style={{ WebkitTextStroke: '2px #840' }}
              />
            </div>
            
            {/* VS Glitch Text - Center */}
            <div style={{ position: 'relative', height: 120, zIndex: 10 }}>
               <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: 'red', fontStyle: 'italic', transform: `translate(-20px, 10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: 'cyan', fontStyle: 'italic', transform: `translate(20px, -10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ 
                   position: 'relative',
                   fontSize: 260, fontWeight: 900, color: 'white', fontStyle: 'italic', 
                   transform: `rotate(${Math.sin(frame / 3) * 15}deg)`, 
                   WebkitTextStroke: '8px black',
                   textShadow: '0 0 100px rgba(255,255,255,0.8)'
                 }}>
                   VS
                 </div>
               </div>
            </div>
            
            {/* Bottom: Mami */}
            <div style={{ textAlign: 'center', filter: 'drop-shadow(0 0 100px red)' }}>
              <div style={{ 
                width: 450, height: 450, borderRadius: '50%', overflow: 'hidden', // 300 -> 450
                border: '15px solid white', margin: '20px auto 10px', boxShadow: '0 0 80px red' 
              }}>
                <Img src={staticFile('assets/images-01/mrm0115.jpeg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <TypingSaberText
                text="まみ"
                frame={frame}
                fps={fps}
                startFrame={20}
                fontSize={80}
                color="#FFF"
                glowColor="red"
                style={{ WebkitTextStroke: '2px #800' }}
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
  
  // 525-645フレーム（ルールシーン）の揺れを大幅軽減 (100 -> 30)
  const rulesImpact = Math.max(0, 1 - Math.max(0, frame - 10) / 6) + Math.max(0, 1 - Math.max(0, frame - 40) / 6);
  const shakeX = (random(frame) - 0.5) * 30 * Math.min(1, rulesImpact);
  const shakeY = (random(frame + 77) - 0.5) * 30 * Math.min(1, rulesImpact);

  return (
    <AbsoluteFill style={{ backgroundColor: '#040000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      {/* 画面切り替え時のフラッシュ */}
      {rulesImpact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: rulesImpact * 0.8, zIndex: 10 }} />}

      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 19 + 800} frame={frame} color={i % 2 === 0 ? '#ff1100' : '#ff5500'} />
      ))}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 80 }}>
        <div style={{
          transform: `scale(${interpolate(r1, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${-(interpolate(r1, [0, 1], [20, 5]))}deg)`,
          opacity: r1 > 0.05 ? 1 : 0,
          filter: `drop-shadow(0 0 80px red)`,
        }}>
          <div style={{
            background: '#FFFFFF', padding: '40px 70px',
            boxShadow: '40px 40px 0 #FF0000', transform: 'skewX(-10deg)', border: '12px solid #000',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <TypingSaberText
              text="「やり直し無し（一本勝負）」"
              frame={frame}
              fps={fps}
              startFrame={20}
              fontSize={120}
              color="#000"
              glowColor="transparent"
              style={{ fontWeight: 900 }}
            />
          </div>
        </div>

        <div style={{
          transform: `scale(${interpolate(r2, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${interpolate(r2, [0, 1], [-20, 5])}deg)`,
          opacity: r2 > 0.05 ? 1 : 0,
          filter: `drop-shadow(0 0 80px yellow)`,
        }}>
          <div style={{
            background: '#FFFFFF', padding: '40px 100px',
            boxShadow: '-40px 40px 0 #FFD700', transform: 'skewX(10deg)', border: '12px solid #000',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <TypingSaberText
              text="「フルアイテム」"
              frame={frame}
              fps={fps}
              startFrame={50}
              fontSize={140}
              color="#000"
              glowColor="transparent"
              style={{ fontWeight: 900 }}
            />
          </div>
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
  const { red: redShader } = useShaders();
  const fireColors = useFireColors(frame, 200); // SceneEnding\u306f\u5e38\u306b\u9752\u708e

  const fadeOut = interpolate(frame, [240, 300], [1, 0], { extrapolateRight: 'clamp' }); // Fade to black at end

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      {/* 画面切り替え時のフラッシュ */}
      {frame < 10 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: 1 - frame / 10, zIndex: 10 }} />}
      
      <AbsoluteFill style={{ opacity: fadeOut, filter: 'url(#heat-haze)' }}>
        {redShader ? (
          <Canvas style={{ flex: 1 }}>
            <Fill>
              <Shader 
                source={redShader} 
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
            <Particle key={i} seed={i * 31} frame={frame} color={i % 2 === 0 ? '#ff4400' : '#ff0000'} />
          ))
        )}

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TypingSaberText
            text="配信再開の<br/>３月<br/>有終の美を<br/>飾りたいです！！"
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={120}
            color="#FFF"
            glowColor="#FF0000"
            style={{ 
              lineHeight: 1.7, 
              letterSpacing: 5,
              WebkitTextStroke: '6px #200',
              filter: `drop-shadow(0 20px 50px black)`,
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
      {/* 
        Ensure J.O.L logo png exists at static/assets/images-01/logo.png
        If standard Path doesn't match, we rely on text fallback or user replacing it. 
      */}
      <div style={{
        fontFamily, fontSize: 160, fontWeight: 900, color: '#FFF', 
        letterSpacing: 20, opacity, transform: `scale(${scale})`,
        textShadow: '0 0 60px rgba(255,255,255,0.8)'
      }}>
        J.O.L
      </div>
    </AbsoluteFill>
  );
};


// ========================
// Main Composition
// ========================
export const JolBattleSpiritRed: React.FC = () => {
  const { fps } = useVideoConfig();
  
  // Timing Adjustments: OP_DUR extended to 6s, DATE_DUR extended to 4s
  const OP_DUR = 6 * fps;      
  const DATE_DUR = 4 * fps;    
  const INTRO_LIVER_DUR = 6 * fps; // 9 -> 6
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

  // Total duration will be calculated via AbsoluteFill but visually controlled by Sequence

  return (
    <AbsoluteFill>
      <Audio src={staticFile('assets/audio/music/冷蔵庫のメモ.mp3')} volume={0.6} loop />

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
