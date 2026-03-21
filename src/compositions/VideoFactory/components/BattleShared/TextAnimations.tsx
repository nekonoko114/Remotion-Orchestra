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
