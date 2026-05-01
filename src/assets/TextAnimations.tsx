import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// --- Text Animations Implementation ---

/**
 * 1. WordSlideUp
 * Groups of words sliding up from transparency.
 */
export const WordSlideUp: React.FC<{
  text: string;
  color?: string;
  delay?: number;
}> = ({ text, color = 'white', delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {words.map((word, i) => {
        const spr = spring({
          frame: frame - delay - i * 3,
          fps,
          config: { damping: 12 },
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 10px',
              opacity: spr,
              transform: `translateY(${(1 - spr) * 20}px)`,
              color,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * 2. LetterBounce
 * Each letter hops in sequence.
 */
export const LetterBounce: React.FC<{ text: string; color?: string }> = ({
  text,
  color = 'white',
}) => {
  const frame = useCurrentFrame();
  const letters = text.split('');

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {letters.map((l, i) => {
        const bounce = Math.sin(Math.max(0, frame - i * 2) * 0.2) * 10;
        const opacity = interpolate(frame - i * 2, [0, 5], [0, 1], {
          extrapolateRight: 'clamp',
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${bounce < 0 ? bounce : 0}px)`,
              opacity,
              color,
            }}
          >
            {l === ' ' ? '\u00A0' : l}
          </span>
        );
      })}
    </div>
  );
};

/**
 * 3. NeonGlowText
 * Text with pulsing neon outer glow.
 */
export const NeonGlowText: React.FC<{ text: string; color?: string }> = ({
  text,
  color = '#00f0ff',
}) => {
  const frame = useCurrentFrame();
  const glow = Math.sin(frame * 0.1) * 10 + 15;

  return (
    <div
      style={{
        fontSize: '80px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: `0 0 ${glow}px ${color}, 0 0 ${glow / 2}px ${color}`,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 4. GlitchText
 * Text that jitters and shifts colors.
 */
export const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  const active = Math.random() > 0.9;
  const offset = active ? Math.random() * 10 - 5 : 0;

  return (
    <div
      style={{
        position: 'relative',
        fontSize: '100px',
        fontWeight: '900',
        color: 'white',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: offset,
          top: 0,
          color: '#ff00ff',
          opacity: active ? 0.7 : 0,
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: 'absolute',
          left: -offset,
          top: 0,
          color: '#00ffff',
          opacity: active ? 0.7 : 0,
        }}
      >
        {text}
      </div>
      <div style={{ position: 'relative' }}>{text}</div>
    </div>
  );
};

/**
 * 5. TypingEffect
 * Text appearing character by character.
 */
export const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(frame / 2);
  const visibleText = text.substring(0, charsToShow);

  return (
    <div
      style={{ fontFamily: 'monospace', fontSize: '40px', color: '#00f0ff' }}
    >
      {visibleText}
      {frame % 10 < 5 && '_'}
    </div>
  );
};

/**
 * 6. ScaleReveal
 * Text scaling up from 0.
 */
export const ScaleReveal: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame,
    fps,
    config: { damping: 10 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity: scale,
        textAlign: 'center',
        fontSize: '120px',
        fontWeight: 'bold',
        color: 'white',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 7. BlurReveal
 * Text appearing from a blur.
 */
export const BlurReveal: React.FC<{ text: string; duration?: number }> = ({
  text,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const blur = interpolate(frame, [0, duration], [20, 0], {
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        filter: `blur(${blur}px)`,
        opacity,
        textAlign: 'center',
        fontSize: '80px',
        color: 'white',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 8. StaggeredSlideIn
 * Individual letters sliding in with delay.
 */
export const StaggeredSlideIn: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {text.split('').map((l, i) => {
        const s = spring({
          frame: frame - i * 2,
          fps,
          config: { damping: 12 },
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateX(${(1 - s) * 50}px)`,
              opacity: s,
              color: 'white',
            }}
          >
            {l === ' ' ? '\u00A0' : l}
          </span>
        );
      })}
    </div>
  );
};

/**
 * 9. ElasticPop
 * Bouncy entrance.
 */
export const ElasticPop: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame,
    fps,
    config: { mass: 0.8, stiffness: 200, damping: 10 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        textAlign: 'center',
        fontSize: '90px',
        color: '#ff00ff',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 10. RainbowCycling
 * Text cycling through colors.
 */
export const RainbowCycling: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontSize: '80px',
        fontWeight: 'bold',
        textAlign: 'center',
        background: `linear-gradient(90deg, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)`,
        backgroundSize: '200% auto',
        backgroundPosition: `${frame * 2}% center`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 11. PerspectiveTilt
 * 3D rotating text.
 */
export const PerspectiveTilt: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontSize: '100px',
        fontWeight: 'bold',
        textAlign: 'center',
        perspective: '500px',
        transform: `rotateY(${Math.sin(frame * 0.05) * 30}deg) rotateX(${Math.cos(frame * 0.05) * 10}deg)`,
        color: 'white',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 12. ShadowPulse
 * Text with glowing shadow that pulses.
 */
export const ShadowPulse: React.FC<{ text: string; color?: string }> = ({
  text,
  color = '#ff00ff',
}) => {
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame * 0.2), [-1, 1], [5, 40]);
  return (
    <div
      style={{
        fontSize: '80px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        filter: `drop-shadow(0 0 ${glow}px ${color})`,
      }}
    >
      {text}
    </div>
  );
};

/**
 * 13. BorderDrawReveal
 * Text reveals along with a neon border.
 */
export const BorderDrawReveal: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 20], [0, 100], {
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{ position: 'relative', padding: '20px', display: 'inline-block' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${progress}%`,
          height: '2px',
          backgroundColor: '#00f0ff',
          boxShadow: '0 0 10px #00f0ff',
        }}
      />
      <div
        style={{
          opacity: progress / 100,
          fontSize: '60px',
          color: 'white',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/**
 * 14. WaveText
 * Letters moving in a wave pattern.
 */
export const WaveText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {text.split('').map((l, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: `translateY(${Math.sin(frame * 0.2 + i * 0.5) * 15}px)`,
            fontSize: '70px',
            color: 'white',
            margin: '0 2px',
          }}
        >
          {l === ' ' ? '\u00A0' : l}
        </span>
      ))}
    </div>
  );
};

/**
 * 15. GlitchExplosion
 * Letters scattering and fading.
 */
export const GlitchExplosion: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, 1]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        opacity: 1 - progress,
      }}
    >
      {text.split('').map((l, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: `translate(${(Math.random() - 0.5) * 100 * progress}px, ${(Math.random() - 0.5) * 100 * progress}px) rotate(${Math.random() * 360 * progress}deg)`,
            fontSize: '80px',
            color: 'white',
          }}
        >
          {l === ' ' ? '\u00A0' : l}
        </span>
      ))}
    </div>
  );
};
