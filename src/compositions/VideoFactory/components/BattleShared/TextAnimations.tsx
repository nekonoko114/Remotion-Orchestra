import React from 'react';
import { interpolate, spring, random } from 'remotion';

export type TextAnimProps = {
  text: string;
  frame: number;
  fps: number;
  fontSize?: number;
  color?: string;
  glowColor?: string;
};

// Helper to render split characters
const CharacterSplitter: React.FC<{
  text: string;
  renderChar: (char: string, index: number) => React.ReactNode;
}> = ({ text, renderChar }) => {
  return (
    <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block' }}>
          {char === ' ' ? '\u00A0' : renderChar(char, i)}
        </span>
      ))}
    </div>
  );
};

// 1. Typewriter (1文字ずつパッと出る)
export const TypewriterText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const isVisible = frame >= i * 3;
      return <span style={{ display: 'inline-block', opacity: isVisible ? 1 : 0, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 2. Blur Reveal (ボケからくっきり)
export const BlurRevealText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2;
      const progress = Math.max(0, Math.min(1, (frame - wait) / 15));
      const blur = interpolate(progress, [0, 1], [30, 0]);
      const opacity = interpolate(progress, [0, 1], [0, 1]);
      return <span style={{ display: 'inline-block', filter: `blur(${blur}px)`, opacity, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 3. Drop In (上から落ちてきて弾む)
export const DropInText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2;
      const s = spring({ frame: frame - wait, fps, config: { damping: 10, stiffness: 200 } });
      const y = interpolate(s, [0, 1], [-400, 0]);
      return <span style={{ display: 'inline-block', transform: `translateY(${y}px)`, opacity: s, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 4. Wave Bounce (順番にウェーブジャンプ)
export const WaveBounceText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const y = Math.sin(frame * 0.15 - i * 0.5) * 50;
      return <span style={{ display: 'inline-block', transform: `translateY(${y}px)`, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 5. Rotate In (回転しながら出現)
export const RotateInText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2;
      const s = spring({ frame: frame - wait, fps, config: { damping: 14 } });
      const rot = interpolate(s, [0, 1], [90, 0]);
      return <span style={{ display: 'inline-block', transform: `rotate(${rot}deg)`, transformOrigin: 'bottom center', opacity: s, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 6. Swing In (振り子)
export const SwingInText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2.5;
      const s = spring({ frame: frame - wait, fps, config: { damping: 8, mass: 1.5 } });
      const rot = interpolate(s, [0, 1], [-180, 0]);
      return <span style={{ display: 'inline-block', transform: `perspective(600px) rotateX(${rot}deg)`, transformOrigin: 'top center', opacity: Math.min(1, frame - wait > 0 ? 1 : 0), fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 7. Zoom Out Fade (巨大から縮小)
export const ZoomOutFadeText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  const s = spring({ frame, fps, config: { damping: 15 } });
  const scale = interpolate(s, [0, 1], [4, 1]);
  return <div style={{ transform: `scale(${scale})`, opacity: s, fontSize, color, fontWeight: 900, textAlign: 'center' }}>{text}</div>;
};

// 8. Tracking In (文字間隔が離れた状態からくっつく)
export const TrackingInText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const spacing = interpolate(s, [0, 1], [150, 0]);
  return <div style={{ letterSpacing: spacing, opacity: s, fontSize, color, fontWeight: 900, textAlign: 'center' }}>{text}</div>;
};

// 9. Elastic Pop (ゴムみたいにビヨーンと拡大)
export const ElasticPopText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const s = spring({ frame: frame - i * 1.5, fps, config: { mass: 0.8, damping: 6, stiffness: 200 } });
      return <span style={{ display: 'inline-block', transform: `scale(${s})`, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 10. Wipe Right (左から右へワイプ出現)
export const WipeRightText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  const s = spring({ frame, fps, config: { damping: 20 } });
  const clipLength = interpolate(s, [0, 1], [0, 100]);
  return (
    <div style={{ display: 'inline-block', clipPath: `polygon(0 0, ${clipLength}% 0, ${clipLength}% 100%, 0 100%)`, fontSize, color, fontWeight: 900 }}>
      {text}
    </div>
  );
};

// 11. 3D Flip Up (下から起き上がる)
export const FlipUp3DText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const s = spring({ frame: frame - i * 2, fps, config: { damping: 15 } });
      const rot = interpolate(s, [0, 1], [90, 0]);
      return <span style={{ display: 'inline-block', transform: `perspective(600px) rotateX(${rot}deg)`, transformOrigin: 'bottom', opacity: s, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 12. Reveal Up (マスクの下から上に現れる)
export const RevealUpText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const s = spring({ frame: frame - i * 1.5, fps, config: { damping: 15 } });
      const y = interpolate(s, [0, 1], [150, 0]);
      // Wrap each char in overflow-hidden box to mask it
      return (
        <span style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: 20 }}>
          <div style={{ display: 'inline-block', transform: `translateY(${y}px)`, opacity: s, fontSize, color, fontWeight: 900 }}>{char}</div>
        </span>
      );
    }} />
  );
};

// 13. Glitch Reveal (ノイズ出現)
export const GlitchRevealText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2;
      const isIntro = frame >= wait && frame < wait + 15;
      const randX = isIntro ? interpolate(random(`${frame}-${i}-x`), [0, 1], [-20, 20]) : 0;
      const randY = isIntro ? interpolate(random(`${frame}-${i}-y`), [0, 1], [-10, 10]) : 0;
      const opacity = frame < wait ? 0 : 1;
      return <span style={{ display: 'inline-block', transform: `translate(${randX}px, ${randY}px)`, opacity, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 14. Floating (ふわふわ漂う)
export const FloatingText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const opacity = Math.min(1, frame / 15);
      const y = Math.sin(frame * 0.05 + i) * 20;
      const rot = Math.cos(frame * 0.03 + i) * 10;
      return <span style={{ display: 'inline-block', transform: `translateY(${y}px) rotate(${rot}deg)`, opacity, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 15. Impact Scale (一度通り過ぎて戻る)
export const ImpactScaleText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  const s = spring({ frame, fps, config: { mass: 2, damping: 10, stiffness: 200 } });
  const scale = interpolate(s, [0, 0.5, 1], [5, 0.7, 1]); // massive -> tiny -> normal
  const opacity = interpolate(s, [0, 0.2], [0, 1]);
  return <div style={{ display: 'inline-block', transform: `scale(${scale})`, opacity, fontSize, color, fontWeight: 900 }}>{text}</div>;
};

// ==========================================
// MV-STYLE ADVANCED ANIMATIONS
// ==========================================

// 20. Kinetic Smash (キネティックスマッシュ - 衝撃波)
export const KineticSmashText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  const scale = interpolate(frame, [0, 5], [15, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const shakeX = frame >= 5 && frame < 15 ? interpolate(random(`x-${frame}`), [0, 1], [-20, 20]) : 0;
  const shakeY = frame >= 5 && frame < 15 ? interpolate(random(`y-${frame}`), [0, 1], [-20, 20]) : 0;
  const blur = interpolate(frame, [0, 4, 5], [50, 20, 0], { extrapolateRight: 'clamp' });
  
  return (
    <div style={{ display: 'inline-block', transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`, filter: `blur(${blur}px)`, fontSize, color, fontWeight: 900 }}>
      {text}
    </div>
  );
};

// 21. Blur Strobe (フラッシュ＆ボケ - ストロボ)
export const BlurStrobeText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  const isFlash = frame % 4 < 2; // Flashes every 4 frames randomly
  const blur = isFlash ? 0 : 25;
  const opacity = isFlash ? 1 : 0.4;
  
  return (
    <div style={{ display: 'inline-block', filter: `blur(${blur}px)`, opacity, fontSize, color, fontWeight: 900 }}>
      {text}
    </div>
  );
};

// 22. Letter Jumble (ランダム文字変化 - サイバー記号)
export const LetterJumbleText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const settleFrame = i * 2 + 10;
      const isSettled = frame >= settleFrame;
      const randomChar = chars[Math.floor(random(`jumble-${i}-${frame}`) * chars.length)];
      return <span style={{ display: 'inline-block', fontSize, color, fontWeight: 900, width: fontSize * 0.7, textAlign: 'center' }}>
        {isSettled ? char : randomChar}
      </span>;
    }} />
  );
};

// 23. Box Slide Reveal (ブロックで隠して出現)
export const BoxSlideRevealText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  const s1 = spring({ frame, fps, config: { damping: 15 } }); // Block width
  const s2 = spring({ frame: frame - 15, fps, config: { damping: 15 } }); // Text reveal height & Block slide away
  
  const blockWidth = interpolate(s1, [0, 1], [0, 100]);
  const slideAway = interpolate(s2, [0, 1], [0, 100]);
  const textClip = interpolate(s2, [0, 1], [100, 0]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ clipPath: `polygon(0 ${textClip}%, 100% ${textClip}%, 100% 100%, 0 100%)`, fontSize, color, fontWeight: 900 }}>
        {text}
      </div>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${slideAway}%`, width: `${blockWidth - slideAway}%`,
        backgroundColor: color, zIndex: 10
      }} />
    </div>
  );
};

// 24. Tumbling Letters (スピンフォール)
export const TumblingLettersText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2;
      const s = spring({ frame: frame - wait, fps, config: { damping: 12 } });
      const rotZ = interpolate(s, [0, 1], [360, 0]);
      const rotX = interpolate(s, [0, 1], [720, 0]);
      const zOffset = interpolate(s, [0, 1], [1000, 0]);
      const scale = interpolate(s, [0, 1], [5, 1]);
      const opacity = Math.min(1, frame - wait > 0 ? (frame - wait) / 10 : 0);
      
      return (
        <span style={{ 
          display: 'inline-block', transform: `perspective(800px) translateZ(${zOffset}px) rotateZ(${rotZ}deg) rotateX(${rotX}deg) scale(${scale})`, 
          opacity, fontSize, color, fontWeight: 900 
        }}>
          {char}
        </span>
      );
    }} />
  );
};

// 25. Vibrate/Shake (ビート振動)
export const VibrateShakeText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const x = interpolate(random(`vib-x-${frame}-${i}`), [0, 1], [-5, 5]);
      const y = interpolate(random(`vib-y-${frame}-${i}`), [0, 1], [-5, 5]);
      return <span style={{ display: 'inline-block', transform: `translate(${x}px, ${y}px)`, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 26. Text Echo/Trail (残像エコー)
export const TextEchoTrailText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white', glowColor = color }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {[3, 2, 1, 0].map((delay, idx) => {
        const df = Math.max(0, frame - delay * 3);
        const ds = spring({ frame: df, fps, config: { damping: 12 } });
        const dScale = interpolate(ds, [0, 1], [0.5, 1]);
        const dY = interpolate(ds, [0, 1], [200, 0]);
        const dOpacity = interpolate(delay, [0, 3], [1, 0.1]);
        
        return (
          <div key={idx} style={{ 
            position: delay === 0 ? 'relative' : 'absolute', 
            top: 0, left: 0, right: 0, textAlign: 'center',
            transform: `translateY(${dY}px) scale(${dScale})`, 
            opacity: delay === 0 ? 1 : dOpacity, 
            fontSize, fontWeight: 900, 
            color: delay === 0 ? color : glowColor,
            filter: delay === 0 ? 'none' : 'blur(4px)'
          }}>
            {text}
          </div>
        )
      })}
    </div>
  );
};

// 27. Horizontal Stretch (横ストレッチ圧縮)
export const HorizontalStretchText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  const s = spring({ frame, fps, config: { mass: 0.5, damping: 14 } });
  const scaleX = interpolate(s, [0, 1], [8, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  return <div style={{ display: 'inline-block', transform: `scaleX(${scaleX})`, opacity, fontSize, color, fontWeight: 900 }}>{text}</div>;
};

// 28. Cinematic Slow Reveal (シネマティックフェード)
export const CinematicSlowRevealText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  const progress = Math.min(1, frame / 60);
  const blur = interpolate(progress, [0, 1], [30, 0]);
  const spacing = interpolate(progress, [0, 1], [100, 0]);
  const opacity = interpolate(progress, [0, 0.5, 1], [0, 0.5, 1]);
  
  return (
    <div style={{ display: 'inline-block', letterSpacing: spacing, filter: `blur(${blur}px)`, opacity, fontSize, color, fontWeight: 900, textTransform: 'uppercase' }}>
      {text}
    </div>
  );
};

// 29. Bounce Stomp (バウンス・ストンプ - 重力ヒット)
export const BounceStompText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2;
      const t = Math.max(0, frame - wait);
      
      const fallLength = 10;
      const y = t < fallLength ? interpolate(t, [0, fallLength], [-300, 0], { extrapolateRight: 'clamp' }) : 0;
      
      const bounceS = spring({ frame: Math.max(0, t - fallLength), fps, config: { mass: 0.5, damping: 5, stiffness: 400 } });
      const scaleY = t < fallLength ? 1 : interpolate(bounceS, [0, 0.5, 1], [0.3, 1.2, 1]);
      const scaleX = t < fallLength ? 1 : interpolate(bounceS, [0, 0.5, 1], [1.5, 0.9, 1]);
      
      return (
        <span style={{ 
          display: 'inline-block', transform: `translateY(${y}px) scaleX(${scaleX}) scaleY(${scaleY})`, transformOrigin: 'bottom',
          opacity: t > 0 ? 1 : 0, fontSize, color, fontWeight: 900 
        }}>
          {char}
        </span>
      );
    }} />
  );
};

// ==========================================
// 30~39: EXTREME MV-STYLE ANIMATIONS
// ==========================================

// 30. Glitch Slice (スライス・グリッチ - 上下泣き別れ)
export const GlitchSliceText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  const isIntro = frame < 10;
  // Intense horizontal slide during first 10 frames
  const offsetTop = isIntro ? interpolate(frame, [0, 10], [-50, 0]) : 0;
  const offsetBot = isIntro ? interpolate(frame, [0, 10], [50, 0]) : 0;
  const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });

  // Add random horizontal glitching after intro if requested, or just keep it solid
  const actOffsetTop = offsetTop + (Math.floor(frame / 3) % 2 === 0 ? random(`top-${frame}`) * 6 - 3 : 0);
  const actOffsetBot = offsetBot + (Math.floor(frame / 3) % 2 === 0 ? random(`bot-${frame}`) * 6 - 3 : 0);

  return (
    <div style={{ position: 'relative', display: 'inline-block', opacity }}>
      {/* Top Half */}
      <div style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', position: 'relative', transform: `translateX(${actOffsetTop}px)`, fontSize, color, fontWeight: 900 }}>
        {text}
      </div>
      {/* Bottom Half */}
      <div style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)', position: 'absolute', top: 0, left: 0, transform: `translateX(${actOffsetBot}px)`, fontSize, color, fontWeight: 900 }}>
        {text}
      </div>
    </div>
  );
};

// 31. Neon Pulse (心拍パルス)
export const NeonPulseText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white', glowColor = color }) => {
  const beat = frame % 30; // 1 beat every second (if 30fps)
  const scale = beat < 5 ? interpolate(beat, [0, 2, 5], [1, 1.2, 1]) : 1;
  const brightness = beat < 5 ? interpolate(beat, [0, 2, 5], [1, 2.5, 1]) : 1;
  const blur = beat < 5 ? interpolate(beat, [0, 2, 5], [0, 10, 0]) : 0;

  return (
    <div style={{ display: 'inline-block', transform: `scale(${scale})`, filter: `brightness(${brightness}) drop-shadow(0 0 ${blur}px ${glowColor})`, fontSize, color, fontWeight: 900 }}>
      {text}
    </div>
  );
};

// 32. Random Reveal Box (ランダムタイル出現)
export const RandomRevealBoxText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      // Randomize reveal time out of order
      const seed = Math.floor(random(`order-${i}`) * 20); 
      const s = spring({ frame: frame - seed, fps, config: { damping: 14 } });
      const scale = interpolate(s, [0, 1], [0, 1]);
      
      return (
        <span style={{ position: 'relative', display: 'inline-block', width: fontSize * 0.7, textAlign: 'center' }}>
          <span style={{ opacity: frame > seed ? 1 : 0, fontSize, color, fontWeight: 900 }}>{char}</span>
          <span style={{ 
            position: 'absolute', inset: 0, backgroundColor: color, 
            transform: `scale(${1 - scale})`, opacity: s < 1 ? 1 : 0, zIndex: 10 
          }} />
        </span>
      );
    }} />
  );
};

// 33. Swirl In (スピンオービット)
export const SwirlInText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 1.5;
      const progress = Math.max(0, Math.min(1, (frame - wait) / 20));
      // Swirl math: Radius decreases, Angle spins
      const radius = interpolate(progress, [0, 1], [300, 0]);
      const angle = interpolate(progress, [0, 1], [Math.PI * 2, 0]);
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const scale = interpolate(progress, [0, 1], [0.2, 1]);
      const opacity = interpolate(progress, [0, 0.3], [0, 1]);
      
      return (
        <span style={{ display: 'inline-block', transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity, fontSize, color, fontWeight: 900 }}>
          {char}
        </span>
      );
    }} />
  );
};

// 34. Camera Shake (カメラ破壊シェイク)
export const CameraShakeText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  const isIntro = frame < 15;
  const tX = isIntro ? interpolate(random(`cx-${frame}`), [0, 1], [-40, 40]) : 0;
  const tY = isIntro ? interpolate(random(`cy-${frame}`), [0, 1], [-40, 40]) : 0;
  const rZ = isIntro ? interpolate(random(`cr-${frame}`), [0, 1], [-10, 10]) : 0;
  const scale = isIntro ? interpolate(frame, [0, 15], [3, 1], { extrapolateRight: 'clamp' }) : 1;
  const blur = isIntro ? interpolate(frame, [0, 15], [20, 0]) : 0;

  return (
    <div style={{ display: 'inline-block', transform: `translate(${tX}px, ${tY}px) rotate(${rZ}deg) scale(${scale})`, filter: `blur(${blur}px)`, fontSize, color, fontWeight: 900 }}>
      {text}
    </div>
  );
};

// 35. Wavy Typewriter (バウンシング・タイプライター)
export const WavyTypewriterText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 3;
      const s = spring({ frame: frame - wait, fps, config: { mass: 0.5, damping: 5, stiffness: 300 } });
      const y = interpolate(s, [0, 1], [100, 0]);
      const opacity = frame >= wait ? 1 : 0;
      return <span style={{ display: 'inline-block', transform: `translateY(${y}px)`, opacity, fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 36. Decode Scramble (順番にパスワード解析完了)
export const DecodeScrambleText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      // Decode sequentially from left to right (wait = i * 3 frames)
      const decodeFrame = i * 3;
      
      const isDecoded = frame > (30 + decodeFrame);
      const randChar = chars[Math.floor(random(`dec-${i}-${frame}`) * chars.length)];
      
      const colorVal = isDecoded ? color : '#00ffcc'; // Green hacker color while scrambling
      
      return (
        <span style={{ display: 'inline-block', fontSize, color: colorVal, fontWeight: 900, width: fontSize * 0.7, textAlign: 'center' }}>
          {isDecoded ? char : randChar}
        </span>
      );
    }} />
  );
};

// 37. Backlight Sweep (後光のレーザースウィープ)
export const BacklightSweepText: React.FC<TextAnimProps> = ({ text, frame, fontSize = 150, color = 'white' }) => {
  // A glowing line sweeps from left to right (-50% to 150%) over 60 frames
  const sweepPercent = interpolate(frame, [0, 60], [-50, 150], { extrapolateRight: 'clamp' });
  
  return (
    <div style={{ position: 'relative', display: 'inline-block', fontSize, color, fontWeight: 900 }}>
      {/* Base Text */}
      <span style={{ opacity: 0.4 }}>{text}</span>
      
      {/* Sweep overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
        background: `linear-gradient(90deg, transparent ${sweepPercent - 15}%, white ${sweepPercent}%, transparent ${sweepPercent + 15}%)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 0 20px cyan)'
      }}>
        {text}
      </div>
    </div>
  );
};

// 38. Flip Flop (スプリット・フラップ)
export const FlipFlopText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 2;
      const s = spring({ frame: frame - wait, fps, config: { damping: 10 } });
      const rotX = interpolate(s, [0, 1], [-90, 0]);
      return <span style={{ display: 'inline-block', transform: `perspective(400px) rotateX(${rotX}deg)`, transformOrigin: 'center center', opacity: Math.min(1, frame - wait > 0 ? 1 : 0), fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};

// 39. Elastic Skew (斜めからビヨーンと戻る)
export const ElasticSkewText: React.FC<TextAnimProps> = ({ text, frame, fps, fontSize = 150, color = 'white' }) => {
  return (
    <CharacterSplitter text={text} renderChar={(char, i) => {
      const wait = i * 1.5;
      const s = spring({ frame: frame - wait, fps, config: { mass: 0.8, damping: 6, stiffness: 200 } });
      const skewX = interpolate(s, [0, 1], [45, 0]);
      const x = interpolate(s, [0, 1], [200, 0]);
      return <span style={{ display: 'inline-block', transform: `translateX(${x}px) skewX(${skewX}deg)`, opacity: Math.min(1, frame - wait > 0 ? 1 : 0), fontSize, color, fontWeight: 900 }}>{char}</span>;
    }} />
  );
};
