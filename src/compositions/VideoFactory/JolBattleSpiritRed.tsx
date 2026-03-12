import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
  Img,
  Audio,
  staticFile,
} from 'remotion';

// @ts-ignore
import { loadFont } from '@remotion/google-fonts/NotoSansJP';
const { fontFamily } = loadFont('normal', {
  weights: ['400', '700', '900'],
  ignoreTooManyRequestsWarning: true,
});


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
        inset: '-100%', // 余裕を持って広げる
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
              backgroundSize: '30%', // パターンの細かさ
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat',
              // 扇形にクリップ (中心から30度の範囲)
              clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((i * angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((i * angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((i + 1) * angle * Math.PI) / 180)}% ${50 + 50 * Math.sin(((i + 1) * angle * Math.PI) / 180)}%)`,
              // 1つおきに反転させて万華鏡らしくする
              transform: i % 2 === 1 ? 'scaleX(-1)' : 'none',
              filter: 'brightness(0.8) contrast(1.2)',
            }}
          />
        ))}
        {/* 中央のグロー */}
        <div style={{
          position: 'absolute',
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(255,100,0,0.4) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>
    </AbsoluteFill>
  );
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

const LightLeak: React.FC<{ frame: number; color?: string }> = ({ frame, color = '#ff2200' }) => {
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
  color = 'rgba(255, 40, 0, 0.3)', 
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

// SVG filter defs
const SvgDefs: React.FC<{ frame: number }> = ({ frame }) => {
  const freq = 0.01 + Math.sin(frame / 20) * 0.005; 
  const scale = 8 + Math.sin(frame / 10) * 4; // 20+10 -> 8+4 (さらに弱める)
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

// Alias for backwards compatibility
const TypingSaberText = KineticText;

// ========================
// Scene 1: オープニング (0-2s)
// ========================
const SceneOpening = (): any => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 180frames for 6 seconds. phase every 60 frames.
  const phase = Math.floor(frame / 60);
  const text = phase === 0 ? "ガチバトル<br/>決定‼️" : phase === 1 ? "全員の力で<br/>バチバチに行くぞ!" : "俺に力を<br/>貸してくれ！";

  const localFrame = frame % 60;
  const entry = spring({ frame: localFrame, fps, config: { stiffness: 400, damping: 15 } });
  const pulse = Math.pow(Math.max(0, 1 - localFrame / 45), 4) * 1.5 + 0.3;

  // 画面外框の赤いグローフレーム
  const framePulse = Math.sin(frame / 10) * 0.2 + 0.8;

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#050000' }}>
      {/* 画面外框の赤いグローフレーム */}
      <div style={{ 
        position: 'absolute', inset: 0,
        border: '15px solid rgba(255, 50, 0, 0.7)', 
        boxShadow: `inset 0 0 100px rgba(255, 80, 0, ${0.5 * framePulse}), 0 0 100px rgba(255, 60, 0, ${0.5 * framePulse})`,
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* スキャンライン（CRTエフェクト） */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)',
        opacity: 0.6,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, rgba(120,10,0,${0.7 * pulse}) 0%, transparent 70%)`,
      }} />

      {/* フェーズ切り替え時のショックウェーブリング */}
      {localFrame < 20 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 6 }}>
          <div style={{
            width: interpolate(localFrame, [0, 20], [0, 1600]),
            height: interpolate(localFrame, [0, 20], [0, 1600]),
            borderRadius: '50%',
            border: `${Math.max(0, 15 - localFrame * 0.7)}px solid rgba(255,100,0,${Math.max(0, 1 - localFrame / 20)})`,
            boxShadow: `0 0 60px rgba(255,60,0,${Math.max(0, 0.8 - localFrame / 20)})`,
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
                background: `rgba(255,120,30,${Math.max(0, 1 - localFrame / 8)})`,
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
          background: `radial-gradient(ellipse at 50% 60%, white 0%, #ffaa44 35%, #ff2200 65%, transparent 80%)`,
          filter: `blur(${20 + 20 * pulse}px)`, borderRadius: '40% 40% 60% 60%',
          boxShadow: `0 0 ${300 * pulse}px ${100 * pulse}px rgba(255,50,0,1)`, 
          transform: `scale(${pulse * entry})`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 50px' }}>
        <KineticText
          text={text}
          frame={localFrame}
          fps={fps}
          fontSize={phase === 2 ? 210 : 120}
          color="#fff5f0"
          glowColor="rgba(255,80,0,1)"
          style={{ 
            lineHeight: 1.2, 
            letterSpacing: 10,
            ...(phase === 2 ? {
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column', // In vertical-rl, 'column' is horizontal (block axis)
              justifyContent: 'center', // Centers the columns horizontally
              alignItems: 'center',     // Centers text within columns vertically
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
            color="#FFF"
            glowColor="#FF3300"
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
            glowColor="#FF3300"
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
  const slam = spring({ frame: frame - 10, fps, config: { stiffness: 600, damping: 12, mass: 1.5 } });
  const scale = interpolate(slam, [0, 0.5, 1], [6, 0.8, 1]);
  const yPos = interpolate(slam, [0, 1], [-1200, 0]);
  const bounceIntensity = Math.abs(Math.sin((frame - 10) / 4)) * Math.max(0, 1 - (frame - 10) / 30) * 100;
  const nameGlitchOffset = Math.max(0, 1 - (frame - 30) / 20) * (random(frame) - 0.5) * 40;

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#080000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />

      <KaleidoscopeBackground
        imageSrc={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')}
        frame={frame}
        opacity={0.4}
      />

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
      {/* Glitch filter - Focus on Red for brand color and to avoid grayish overlap */}
      <SvgDefs frame={frame} />
      
      {/* Deep Red Glow Background */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle at 50% 50%, #440000 0%, #000 70%)',
        opacity: interpolate(frame, [0, 10], [0, 1]),
      }} />

      <AbsoluteFill style={{ filter: 'url(#glitch-red)', opacity: 0.6, transform: `translateX(${(frame % 2) * 20}px)` }}>
        <div style={{ flex: 1, border: '40px solid #660000' }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <KineticText
          text="対戦相手は！？"
          frame={frame}
          fps={fps}
          fontSize={120}
          color="#FFF"
          glowColor="#FF0000"
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
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      <KaleidoscopeBackground 
        imageSrc={staticFile('assets/images-01/mrm0115-01.jpg')} 
        frame={frame} 
        opacity={0.4} 
      />
      <SvgDefs frame={frame} />
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
            <Img src={staticFile('assets/images-01/mrm0115-01.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
 Sarah: Correct path for opponent.
          </div>
          <KineticText
            text="限界突破まみ🎽"
            frame={frame}
            fps={fps}
            startFrame={15}
            fontSize={140}
            color="white"
            glowColor="#ff0000"
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
  const shakeX = (random(frame) - 0.5) * 60 * shakeDecay; // 180 -> 60
  const shakeY = (random(frame + 9) - 0.5) * 60 * shakeDecay; // 180 -> 60
  const flashOpacity = Math.max(0, 1 - frame / 4); 

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {flashOpacity > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flashOpacity, zIndex: 10 }} />}
      <RotatingFocusLines frame={frame} color="rgba(255, 50, 0, 0.4)" />

      <AbsoluteFill style={{ transform: `scale(${1 + shakeDecay * 0.1}) translate(${shakeX}px, ${shakeY}px)` }}>
        <KaleidoscopeBackground 
          imageSrc={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')} 
          frame={frame} 
          opacity={0.3} 
        />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', // 縦並びに変更
            alignItems: 'center', 
            transform: `scale(${pop})`,
            gap: 20 
          }}>
            <div style={{ textAlign: 'center', filter: 'drop-shadow(0 0 100px orange)' }}>
              <div style={{ 
                width: 600, height: 600, borderRadius: '50%', overflow: 'hidden',
                border: '15px solid #FFE4B5', margin: '0 auto 15px', boxShadow: '0 0 100px orange' 
              }}>
                <Img src={staticFile('assets/images-01/t.o.p_u_jin_.jpeg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <KineticText
                text="🔆≒ユージン≒🔆"
                frame={frame}
                fps={fps}
                startFrame={10}
                fontSize={90}
                color="#FFE4B5"
                glowColor="orange"
                style={{ letterSpacing: 4 }}
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
            
            <div style={{ textAlign: 'center', filter: 'drop-shadow(0 0 100px red)' }}>
              <div style={{ 
                width: 600, height: 600, borderRadius: '50%', overflow: 'hidden',
                border: '15px solid white', margin: '15px auto 10px', boxShadow: '0 0 100px red' 
              }}>
                <Img src={staticFile('assets/images-01/mrm0115-01.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <KineticText
                text="限界突破まみ🎽"
                frame={frame}
                fps={fps}
                startFrame={20}
                fontSize={90}
                color="#FFF"
                glowColor="red"
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
          filter: `drop-shadow(0 0 100px #ff3300)`,
        }}>
            <TypingSaberText
              text="やり直し無し<br/>一本勝負"
              frame={frame}
              fps={fps}
              startFrame={20}
              fontSize={160}
              color="#FFF"
              glowColor="#ff2200"
              style={{ fontWeight: 900 }}
            />
        </div>

        <div style={{
          transform: `scale(${interpolate(r2, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${interpolate(r2, [0, 1], [-20, 5])}deg)`,
          opacity: r2 > 0.05 ? 1 : 0,
          filter: `drop-shadow(0 0 100px #ffaa00)`,
        }}>
            <TypingSaberText
              text="フルアイテム"
              frame={frame}
              fps={fps}
              startFrame={50}
              fontSize={160}
              color="#FFF"
              glowColor="#ff8800"
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

  const fadeOut = interpolate(frame, [240, 300], [1, 0], { extrapolateRight: 'clamp' }); // Fade to black at end

  const content = (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      
      {/* 画面切り替え時のフラッシュ */}
      {frame < 10 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: 1 - frame / 10, zIndex: 10 }} />}
      
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {new Array(60).fill(0).map((_, i) => (
          <Particle key={i} seed={i * 31} frame={frame} color={i % 2 === 0 ? '#ff4400' : '#ff0000'} />
        ))}

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          {/* 読みやすさのための為暗色バック */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.7) 70%, transparent 100%)',
          }} />
          <KineticText
            text="配信再開の⁠
３月
有終の美を
飾りたいです！！"
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={110}
            color="#FFFFFF"
            glowColor="#FF4400"
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
          filter: 'drop-shadow(0 0 80px rgba(255,255,255,0.6))',
        }}
      />
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
