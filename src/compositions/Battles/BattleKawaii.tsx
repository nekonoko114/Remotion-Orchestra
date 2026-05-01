import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  spring,
  Img,
  random,
} from 'remotion';
import { KawaiiBackground } from '../../components/backgrounds/KawaiiBackground';
import { useBeatValue } from '../../utils/beat-sync';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(MorphSVGPlugin);
}
// @ts-ignore
import { loadFont as loadZenMaru } from '@remotion/google-fonts/ZenMaruGothic';
import { loadFont as loadHachiMaru } from '@remotion/google-fonts/HachiMaruPop';

// @ts-ignore — このサブセット分割フォントはオプション型が合わないため ignore
const { fontFamily } = loadZenMaru('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});
// @ts-ignore
const { fontFamily: kawaiiFont } = loadHachiMaru('normal', {
  weights: ['400'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

const ShimmerOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
      {new Array(30).fill(0).map((_, i) => {
        const seed = i * 444;
        const x = random(seed) * 100;
        const y = random(seed + 1) * 100;
        const size = random(seed + 2) * 20 + 10;
        const opacity = interpolate(
          Math.sin(frame / 10 + seed),
          [-1, 1],
          [0.1, 0.4],
        );
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              backgroundColor: 'white',
              borderRadius: '50%',
              opacity,
              boxShadow: '0 0 10px white',
              transform: `scale(${interpolate(Math.sin(frame / 5 + seed), [-1, 1], [0.5, 1.5])})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// --- Types ---
interface PlayerData {
  name: string;
  image: string;
  color: string;
  glowColor: string;
}

const MOCK_JOL_PLAYER: PlayerData = {
  name: '3/9生誕祭🎂♛じゅん♛🐳💫',
  image: 'assets/images-01/j.uotami.0309_hd.jpg',
  color: '#FF69B4',
  glowColor: '#FF1493',
};

const MOCK_OPPONENT: PlayerData = {
  name: '🌸桃🌸',
  image: 'assets/images-01/momo.jpeg',
  color: '#FF69B4',
  glowColor: '#FF1493',
};

const BPM = 130;
const START_OFFSET_FRAMES = -183;
const FINE_TUNE_OFFSET = 0;

const CHARACTER_PATHS = {
  誕: 'M19.80 106.90L19.80 106.90Q14.10 106.90 11 105.40Q7.90 103.90 6.75 100.55Q5.60 97.20 5.60 91.70L5.60 91.70Q5.60 86 6.75 82.65Q7.90 79.30 11 77.90Q14.10 76.50 19.80 76.50L19.80 76.50Q25.60 76.50 28.65 77.90Q31.70 79.30 32.85 82.65Q34 86 34 91.70L34 91.70Q34 94.30 33.70 96.40L33.70 96.40Q35.80 93.40 37.55 90.60Q39.30 87.80 40.70 85L40.70 85Q37 78.60 34.40 70.10L34.40 70.10Q33.70 67.70 34.85 65.90Q36 64.10 38 63.50L38 63.50Q40.30 62.90 42.15 63.85Q44 64.80 44.70 67.30L44.70 67.30Q44.90 68 45.10 68.60Q45.30 69.20 45.50 69.90L45.50 69.90Q45.70 68.50 45.95 67.20Q46.20 65.90 46.30 64.50L46.30 64.50Q46.60 62.20 46 61.35Q45.40 60.50 43.50 60.20L43.50 60.20Q38.70 59.60 37.50 56.50Q36.30 53.40 37.90 48.80L37.90 48.80Q39.30 44.20 40.35 41.05Q41.40 37.90 42.40 34.60L42.40 34.60Q42.90 32.90 42.50 32.35Q42.10 31.80 40.40 31.80L40.40 31.80L39 31.80Q36.20 31.80 34.65 30.05Q33.10 28.30 33.10 25.90L33.10 25.90Q33.10 23.30 34.75 21.50Q36.40 19.70 39.30 19.70L39.30 19.70L44.60 19.70Q52.80 19.70 55.05 23.15Q57.30 26.60 54.90 33.80L54.90 33.80Q54 36.60 53.20 39.10Q52.40 41.60 51.30 44.80L51.30 44.80Q50.60 46.80 51.10 47.60Q51.60 48.40 53.90 48.60L53.90 48.60Q56.50 48.90 57.75 51.10Q59 53.30 58.70 57.90L58.70 57.90Q58.20 66 57 72.65Q55.80 79.30 53.80 84.90L53.80 84.90Q58.60 89.80 65.40 91.80Q72.20 93.80 81.80 93.80L81.80 93.80Q84.10 93.80 86.40 93.75Q88.70 93.70 90.40 93.60L90.40 93.60Q93.60 93.40 95.55 95.10Q97.50 96.80 97.30 99.80L97.30 99.80Q97.20 103.10 95.10 104.45Q93 105.80 89.20 105.80L89.20 105.80L81.80 105.80Q72 105.80 63.75 103.60Q55.50 101.40 49 95.60L49 95.60Q47.90 97.60 46.60 99.50Q45.30 101.40 43.90 103.30L43.90 103.30Q42.30 105.30 39.65 105.80Q37 106.30 34.90 104.80L34.90 104.80Q33 103.60 32.50 101.30L32.50 101.30Q31.20 104.20 28.20 105.55Q25.20 106.90 19.80 106.90ZM91.60 88.10L61.50 88.10Q59.20 88.10 57.55 86.40Q55.90 84.70 55.90 82.40L55.90 82.40Q55.90 80.10 57.45 78.45Q59 76.80 61.20 76.70L61.20 76.70L61.20 45.40Q61.20 43.10 62.80 41.55Q64.40 40 66.60 40L66.60 40Q68.90 40 70.45 41.55Q72 43.10 72 45.40L72 45.40L72 76.70L74.90 76.70L74.90 32.60Q72.90 33 70.95 33.35Q69 33.70 67.20 33.90L67.20 33.90Q64.20 34.30 62.20 33.25Q60.20 32.20 59.60 29.40L59.60 29.40Q59.20 27.10 60.55 25.05Q61.90 23 65 22.60L65 22.60Q68.10 22.20 72.20 21.40Q76.30 20.60 80.35 19.60Q84.40 18.60 87.40 17.60L87.40 17.60Q90.10 16.60 92.40 17.40Q94.70 18.20 95.40 20.60L95.40 20.60Q96.20 23.10 95.40 25.25Q94.60 27.40 92.10 28.20L92.10 28.20Q90.80 28.60 89.30 29Q87.80 29.40 86.20 29.90L86.20 29.90L86.20 46.20L89.80 46.20Q92.40 46.20 94.30 48.10Q96.20 50 96.20 52.60L96.20 52.60Q96.20 55.20 94.30 57.10Q92.40 59 89.80 59L89.80 59L86.20 59L86.20 76.70L91.60 76.70Q93.90 76.70 95.60 78.35Q97.30 80 97.30 82.40L97.30 82.40Q97.30 84.70 95.60 86.40Q93.90 88.10 91.60 88.10L91.60 88.10ZM31.10 44.70L7.60 44.70Q5.40 44.70 3.75 43.10Q2.10 41.50 2.10 39.20L2.10 39.20Q2.10 36.90 3.75 35.30Q5.40 33.70 7.60 33.70L7.60 33.70L31.10 33.70Q33.40 33.70 35 35.30Q36.60 36.90 36.60 39.20L36.60 39.20Q36.60 41.50 35 43.10Q33.40 44.70 31.10 44.70L31.10 44.70ZM27.20 30.50L12.10 30.50Q9.70 30.50 8.05 28.80Q6.40 27.10 6.40 24.80L6.40 24.80Q6.40 22.50 8.05 20.80Q9.70 19.10 12.10 19.10L12.10 19.10L27.20 19.10Q29.60 19.10 31.25 20.80Q32.90 22.50 32.90 24.80L32.90 24.80Q32.90 27.10 31.25 28.80Q29.60 30.50 27.20 30.50L27.20 30.50ZM27.40 73.40L11.80 73.40Q9.60 73.40 7.95 71.75Q6.30 70.10 6.30 67.80L6.30 67.80Q6.30 65.50 7.95 63.90Q9.60 62.30 11.80 62.30L11.80 62.30L27.40 62.30Q29.70 62.30 31.30 63.90Q32.90 65.50 32.90 67.80L32.90 67.80Q32.90 70.10 31.30 71.75Q29.70 73.40 27.40 73.40L27.40 73.40ZM27.40 59L11.80 59Q9.60 59 7.95 57.40Q6.30 55.80 6.30 53.50L6.30 53.50Q6.30 51.20 7.95 49.55Q9.60 47.90 11.80 47.90L11.80 47.90L27.40 47.90Q29.70 47.90 31.30 49.55Q32.90 51.20 32.90 53.50L32.90 53.50Q32.90 55.80 31.30 57.40Q29.70 59 27.40 59L27.40 59ZM19.80 96L19.80 96Q21.50 96 21.90 95.10Q22.30 94.20 22.30 91.70L22.30 91.70Q22.30 89.10 21.90 88.20Q21.50 87.30 19.80 87.30L19.80 87.30Q18.20 87.30 17.75 88.20Q17.30 89.10 17.30 91.70L17.30 91.70Q17.30 94.20 17.75 95.10Q18.20 96 19.80 96Z',
  生: 'M88.70 104.20L11 104.20Q8.30 104.20 6.40 102.30Q4.50 100.40 4.50 97.60L4.50 97.60Q4.50 94.90 6.40 93Q8.30 91.10 11 91.10L11 91.10L43.70 91.10L43.70 75L24.90 75Q22.10 75 20.15 73.05Q18.20 71.10 18.20 68.30L18.20 68.30Q18.20 65.50 20.15 63.60Q22.10 61.70 24.90 61.70L24.90 61.70L43.70 61.70L43.70 48.90L24.60 48.90Q22.80 52 21 54.75Q19.20 57.50 17.50 59.80L17.50 59.80Q15.60 62.40 12.50 63.20Q9.40 64 6.50 62.10L6.50 62.10Q4 60.60 3.50 57.65Q3 54.70 4.70 52.40L4.70 52.40Q6.60 49.70 8.85 46.10Q11.10 42.50 13.30 38.50Q15.50 34.50 17.35 30.65Q19.20 26.80 20.40 23.70L20.40 23.70Q21.70 20.30 24.40 19.20Q27.10 18.10 30.20 19.20L30.20 19.20Q33.10 20.20 34.30 22.85Q35.50 25.50 34.30 28.70L34.30 28.70Q33.70 30.30 32.90 32.15Q32.10 34 31.30 35.90L31.30 35.90L43.70 35.90L43.70 23.80Q43.70 20.20 45.95 18.10Q48.20 16 51.40 16L51.40 16Q54.70 16 56.95 18.10Q59.20 20.20 59.20 23.80L59.20 23.80L59.20 35.90L85.60 35.90Q88.30 35.90 90.20 37.80Q92.10 39.70 92.10 42.40L92.10 42.40Q92.10 45.10 90.20 47Q88.30 48.90 85.60 48.90L85.60 48.90L59.20 48.90L59.20 61.70L77.40 61.70Q80.20 61.70 82.15 63.60Q84.10 65.50 84.10 68.30L84.10 68.30Q84.10 71.10 82.15 73.05Q80.20 75 77.40 75L77.40 75L59.20 75L59.20 91.10L88.70 91.10Q91.40 91.10 93.35 93Q95.30 94.90 95.30 97.60L95.30 97.60Q95.30 100.40 93.35 102.30Q91.40 104.20 88.70 104.20L88.70 104.20Z',
  日: 'M53.80 102.50L46.20 102.50Q37.50 102.50 31.60 101.30Q25.70 100.10 22.25 97.10Q18.80 94.10 17.30 88.80Q15.80 83.50 15.80 75.40L15.80 75.40L15.80 48.60Q15.80 40.50 17.30 35.20Q18.80 29.90 22.25 26.90Q25.70 23.90 31.60 22.70Q37.50 21.50 46.20 21.50L46.20 21.50L53.80 21.50Q62.50 21.50 68.40 22.70Q74.30 23.90 77.75 26.90Q81.20 29.90 82.70 35.20Q84.20 40.50 84.20 48.60L84.20 48.60L84.20 75.40Q84.20 83.50 82.70 88.80Q81.20 94.10 77.75 97.10Q74.30 100.10 68.40 101.30Q62.50 102.50 53.80 102.50L53.80 102.50ZM46.20 88.90L46.20 88.90L53.80 88.90Q60.30 88.90 63.55 87.90Q66.80 86.90 67.90 83.95Q69 81 69 75.40L69 75.40L69 67.90L31.10 67.90L31.10 75.40Q31.10 81 32.20 83.95Q33.30 86.90 36.55 87.90Q39.80 88.90 46.20 88.90ZM31.10 48.60L31.10 54.50L69 54.50L69 48.60Q69 42.90 67.90 40Q66.80 37.10 63.55 36.10Q60.30 35.10 53.80 35.10L53.80 35.10L46.20 35.10Q39.80 35.10 36.55 36.10Q33.30 37.10 32.20 40Q31.10 42.90 31.10 48.60L31.10 48.60Z',
};
const CIRCLE_DATA = 'M 50, 60 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0';

const MorphCharacter: React.FC<{
  char: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({ char, frame, fps, delay }) => {
  const pathRef = React.useRef<SVGPathElement>(null);
  const tweenRef = React.useRef<gsap.core.Tween | null>(null);
  const targetPath = CHARACTER_PATHS[char as keyof typeof CHARACTER_PATHS];

  React.useEffect(() => {
    if (pathRef.current && !tweenRef.current) {
      tweenRef.current = gsap.to(pathRef.current, {
        duration: 1, // Doesn't matter because we manually seek
        morphSVG: targetPath,
        ease: 'elastic.out(1, 0.5)',
        paused: true,
      });
    }
    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [targetPath]);

  React.useEffect(() => {
    if (tweenRef.current) {
      const relativeFrame = frame - delay;
      // Morph over 20 frames (approx 0.6 seconds at 30 fps)
      const progress = Math.max(0, Math.min(1, relativeFrame / 20));
      tweenRef.current.progress(progress);
    }
  }, [frame, delay]);

  // viewBox 0 0 110 110 captures the font's 100x100 box well.
  return (
    <svg viewBox="0 0 110 110" style={{ width: 220, height: 220 }}>
      {/* Background shadow */}
      <path
        d={targetPath}
        fill="transparent"
        stroke="rgba(255, 105, 180, 0.5)"
        strokeWidth="10"
        style={{
          filter: 'blur(10px)',
          transform: 'translate(5px, 5px)',
          opacity: Math.max(0, Math.min(1, (frame - delay) / 20)),
        }}
      />
      {/* Main morphing path */}
      <path
        ref={pathRef}
        d={CIRCLE_DATA}
        fill="#FF1493"
        stroke="white"
        strokeWidth="4"
        style={{
          filter: 'drop-shadow(3px 3px 0px white)',
        }}
      />
    </svg>
  );
};

// --- Sub-components ---

const StageLight: React.FC<{ color: string; side: 'left' | 'right' }> = ({
  color,
  side,
}) => {
  const frame = useCurrentFrame();
  const angle = side === 'left' ? -20 : 20;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: -200,
          [side]: 100,
          width: 800,
          height: 2000,
          background: `linear-gradient(to bottom, ${color}66, transparent)`,
          filter: 'blur(100px)',
          transform: `rotate(${angle + Math.sin(frame / 20) * 5}deg)`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

const KawaiiCard: React.FC<{
  player: PlayerData;
  frame: number;
  direction: 'left' | 'right';
  pulse: number;
}> = ({ player, frame, direction, pulse }) => {
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { stiffness: 100, damping: 15 },
  });

  // Brightness flash on entry
  const flash = interpolate(frame, [0, 15], [2, 1], {
    extrapolateRight: 'clamp',
  });
  // Floating & Beat Bounce (Restored!)
  const floatY = Math.sin(frame / 10) * 20;
  const beatScale = 1 + pulse * 0.05;
  const glowPulse = interpolate(pulse, [0, 1], [0.8, 1.5]);

  const color = player.color;

  return (
    <div
      style={{
        transform: `translateX(${(direction === 'left' ? -500 : 500) * (1 - entry)}px) scale(${1.12 + 0.28 * entry * beatScale}) translateY(${floatY}px) `,
        opacity: entry,
        position: 'relative',
        filter: `brightness(${flash})`,
      }}
    >
      {/* Stage Spotlight */}
      <StageLight color={color} side={direction} />

      {/* Glowing Halo */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          left: -30,
          right: -30,
          bottom: -30,
          background: color,
          borderRadius: 40,
          filter: 'blur(40px)',
          opacity: 0.4 * glowPulse,
          zIndex: -1,
        }}
      />

      <div
        style={{
          width: 450 * 1.4, // Increased size
          height: 550 * 1.4, // Increased size
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 40,
          border: `12px solid ${color}`,
          boxShadow: `0 0 50px ${color}66, inset 0 0 30px white`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Image Container with Pop Styling */}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ribbon Corner Decorations */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              left: -20,
              width: 100,
              height: 100,
              background: color,
              transform: 'rotate(-45deg)',
              zIndex: 5,
              border: '4px solid white',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: color,
              transform: 'rotate(45deg)',
              zIndex: 5,
              border: '4px solid white',
            }}
          />

          {/* Inner Sparkles */}
          <AbsoluteFill style={{ opacity: 0.3 }}>
            <div
              style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                fontSize: 40,
              }}
            >
              ✨
            </div>
            <div
              style={{
                position: 'absolute',
                top: '70%',
                right: '15%',
                fontSize: 30,
              }}
            >
              💖
            </div>
          </AbsoluteFill>

          <img
            src={staticFile(player.image)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt={player.name}
          />
        </div>

        {/* Name Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            background: color,
            padding: '10px 40px',
            borderRadius: 50,
            color: 'white',
            fontSize: 40,
            fontFamily,
            fontWeight: 'bold',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            border: '5px solid white',
            zIndex: 10,
            transform: `rotate(${Math.sin(frame / 5) * 2}deg)`,
          }}
        >
          {player.name}
        </div>
      </div>
    </div>
  );
};

const VsImpact: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
  const scale = interpolate(progress, [0, 1], [0.5, 4]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, #FFF 0%, #FF69B4 70%, transparent 100%)',
          transform: `scale(${scale})`,
          opacity,
          filter: 'blur(30px)',
        }}
      />
      {/* Heart Particles */}
      {new Array(12).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            fontSize: 60,
            transform: `rotate(${i * 30}deg) translateY(${interpolate(progress, [0, 1], [0, -500])}px) scale(${1 - progress})`,
            opacity: interpolate(progress, [0, 0.2], [0, 1]),
          }}
        >
          💖
        </div>
      ))}
    </AbsoluteFill>
  );
};

const DecoEmoji: React.FC<{ seed: number; frame: number }> = ({
  seed,
  frame,
}) => {
  const emojis = ['🍬', '🍭', '✨', '🎀', '🌈', '🍦', '🌸', '🧸', '🐱', '🐰'];
  const emoji = emojis[Math.floor(random(seed) * emojis.length)];
  const spr = spring({
    frame: frame - random(seed + 1) * 30,
    fps: 30,
    config: { damping: 12 },
  });

  const x = random(seed + 2) * 1080;
  const y = random(seed + 3) * 1920;
  const beatScale =
    1 + (random(seed + 4) > 0.5 ? 1 : 0) * (Math.sin(frame / 5) * 0.2);
  const scale =
    interpolate(spr, [0, 1], [0, 1]) *
    (0.8 + Math.sin(frame / 10 + seed) * 0.2) *
    beatScale;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontSize: 100,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${Math.sin(frame / 15 + seed) * 30}deg)`,
        filter: 'drop-shadow(0 0 15px rgba(255,255,255,1))',
        pointerEvents: 'none',
      }}
    >
      {emoji}
    </div>
  );
};

const SubtleBackgroundPlayer: React.FC<{ image: string; opacity?: number }> = ({
  image,
  opacity = 0.15,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <Img
        src={staticFile(image)}
        style={{
          width: '150%',
          height: '150%',
          objectFit: 'cover',
          position: 'absolute',
          top: '-25%',
          left: '-25%',
          opacity,
          filter: 'blur(20px) saturate(1.5)',
          transform: `scale(${1.1 + Math.sin(frame / 50) * 0.1})`,
        }}
      />
    </AbsoluteFill>
  );
};

// --- Main Composition ---

export const BattleKawaii: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { pulse } = useBeatValue(BPM, FINE_TUNE_OFFSET);

  const OP_DURATION = 5 * fps;
  const JOL_INTRO_DURATION = 4 * fps; // Exactly 4 seconds
  const OPPONENT_INTRO_DURATION = 4 * fps; // Exactly 4 seconds
  const MATCHUP_DURATION = 3 * fps; // Exactly 3 seconds
  const VS_RULES_DURATION = 3 * fps; // Exactly 3 seconds
  const MESSAGE_DURATION = 4 * fps; // Exactly 4 seconds
  const END_DURATION = 3 * fps; // Exactly 3 seconds

  const startJol = OP_DURATION;
  const startOpponent = startJol + JOL_INTRO_DURATION;
  const startMatchup = startOpponent + OPPONENT_INTRO_DURATION;
  const startVs = startMatchup + MATCHUP_DURATION;
  const startMessage = startVs + VS_RULES_DURATION;
  const startEnd = startMessage + MESSAGE_DURATION;

  const flashOpacity = interpolate(pulse, [0, 1], [0, 0.15]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFF0F5' }}>
      <KawaiiBackground />
      <ShimmerOverlay />

      <Audio
        src={staticFile('assets/audio/music/Please_me,_my_honey.mp3')}
        volume={0.6}
        loop
        startFrom={START_OFFSET_FRAMES > 0 ? 0 : -START_OFFSET_FRAMES}
      />

      {/* BEAT FLASH FOR SYNC CHECK */}
      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: pulse * 0.05,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      />

      {/* 1. OPENING TITLE */}
      <Sequence durationInFrames={OP_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Scattered Deco Items */}
          {new Array(15).fill(0).map((_, i) => (
            <DecoEmoji key={i} seed={i * 99} frame={frame} />
          ))}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* 3月9日 - Outside Top */}
            <div
              style={{
                fontSize: 160,
                color: '#FF1493',
                fontWeight: 'bold',
                marginBottom: 40,
                fontFamily,
                textShadow:
                  '4px 4px 0px white, -4px -4px 0px white, 4px -4px 0px white, -4px 4px 0px white',
                opacity: spring({ frame, fps, delay: 0 }),
                transform: `scale(${spring({ frame, fps, delay: 0 })})`,
              }}
            >
              3月9日
            </div>

            {/* The Frame - Morphing "誕生日" */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.4)',
                padding: '40px 60px',
                borderRadius: '80px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 50px rgba(255, 105, 180, 0.3)',
                marginBottom: 60,
                opacity: spring({ frame, fps, delay: 9 }), // 0.3s delay
                transform: `scale(${spring({ frame, fps, delay: 9 })})`,
              }}
            >
              {/* Kinetic Typography Morphing */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <MorphCharacter char="誕" frame={frame} fps={fps} delay={18} />
                <MorphCharacter char="生" frame={frame} fps={fps} delay={27} />
                <MorphCharacter char="日" frame={frame} fps={fps} delay={36} />
              </div>

              <div
                style={{
                  fontSize: 100,
                  color: '#FFD700',
                  fontFamily: kawaiiFont,
                  textShadow:
                    '3px 3px 0px white, -3px -3px 0px white, 3px -3px 0px white, -3px 4px 0px white, 0 0 20px #FFD700',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  opacity: spring({ frame, fps, delay: 45 }),
                  transform: `translateY(${interpolate(spring({ frame, fps, delay: 45 }), [0, 1], [50, 0])}px)`,
                }}
              >
                3/9生誕祭
                <br />
                🎂♛じゅん♛🐳💫
              </div>
            </div>

            {/* 21:30 & バトル決定 - Outside Bottom */}
            <div
              style={{
                marginTop: 20,
                opacity: spring({ frame, fps, delay: 54 }),
                transform: `scale(${spring({ frame, fps, delay: 54 })})`,
              }}
            >
              <div
                style={{
                  fontSize: 160,
                  color: '#FF1493',
                  fontWeight: 'bold',
                  fontFamily,
                  marginBottom: 20,
                  textShadow: '3px 3px 0px white',
                }}
              >
                21:30
              </div>
              <div
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(to right, #FF69B4, #FF1493)',
                  color: 'white',
                  padding: '20px 60px',
                  borderRadius: 60,
                  fontSize: 100,
                  fontWeight: 'bold',
                  fontFamily,
                  boxShadow: '0 15px 30px rgba(255, 20, 147, 0.4)',
                }}
              >
                バトル決定 ❤️
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 2. JOL INTRO */}
      <Sequence from={startJol} durationInFrames={JOL_INTRO_DURATION}>
        <SubtleBackgroundPlayer image={MOCK_JOL_PLAYER.image} />
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <svg
            width="800"
            height="200"
            viewBox="0 0 800 200"
            style={{
              position: 'absolute',
              top: 150,
              overflow: 'visible',
              opacity: spring({ frame: frame - startJol, fps, delay: 15 }),
              transform: `translateY(${interpolate(spring({ frame: frame - startJol, fps, delay: 15 }), [0, 1], [-50, 0])}px) scale(${spring({ frame: frame - startJol, fps, delay: 15 })}) rotate(${Math.sin((frame - startJol) / 10) * 5}deg)`,
              filter: 'drop-shadow(0 10px 20px rgba(255, 105, 180, 0.4))',
            }}
          >
            <defs>
              <linearGradient
                id="jolGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
            <text
              x="400"
              y="150"
              textAnchor="middle"
              fontFamily={kawaiiFont}
              fontSize="180"
              fontWeight="bold"
              fill="url(#jolGradient)"
              stroke="#FF1493"
              strokeWidth="15"
              strokeLinejoin="round"
            >
              J.O.L
            </text>
            <text
              x="400"
              y="150"
              textAnchor="middle"
              fontFamily={kawaiiFont}
              fontSize="180"
              fontWeight="bold"
              fill="url(#jolGradient)"
            >
              J.O.L
            </text>
          </svg>
          <KawaiiCard
            player={MOCK_JOL_PLAYER}
            frame={frame - startJol}
            direction="left"
            pulse={pulse}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 3. OPPONENT INTRO */}
      <Sequence from={startOpponent} durationInFrames={OPPONENT_INTRO_DURATION}>
        <SubtleBackgroundPlayer image={MOCK_OPPONENT.image} />
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <KawaiiCard
            player={MOCK_OPPONENT}
            frame={frame - startOpponent}
            direction="right"
            pulse={pulse}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 4. MATCH-UP (VS Scene) */}
      <Sequence from={startMatchup} durationInFrames={MATCHUP_DURATION}>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '50%',
              top: 0,
              overflow: 'hidden',
            }}
          >
            <SubtleBackgroundPlayer
              image={MOCK_JOL_PLAYER.image}
              opacity={0.1}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '50%',
              bottom: 0,
              overflow: 'hidden',
            }}
          >
            <SubtleBackgroundPlayer image={MOCK_OPPONENT.image} opacity={0.1} />
          </div>

          {frame - startMatchup === 10 && <VsImpact frame={0} />}

          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              transform: 'scale(0.65)',
            }}
          >
            <KawaiiCard
              player={MOCK_JOL_PLAYER}
              frame={frame - startMatchup}
              direction="left"
              pulse={pulse}
            />
          </div>

          <AbsoluteFill
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 250,
                fontFamily,
                fontWeight: 'bold',
                background:
                  'linear-gradient(180deg, #FF69B4, #FFD700, #FF1493)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter:
                  'drop-shadow(0 0 20px rgba(255,255,255,0.8)) drop-shadow(0 0 40px #FF69B4)',
                transform: `scale(${1 + pulse * 0.3}) rotate(${Math.sin(frame / 3) * 10}deg)`,
              }}
            >
              VS
            </div>
          </AbsoluteFill>

          <div
            style={{
              position: 'absolute',
              bottom: '5%',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              transform: 'scale(0.65)',
            }}
          >
            <KawaiiCard
              player={MOCK_OPPONENT}
              frame={frame - startMatchup}
              direction="right"
              pulse={pulse}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 5. RULES */}
      <Sequence from={startVs} durationInFrames={VS_RULES_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              padding: '60px',
              borderRadius: 60,
              border: '10px solid #FF69B4',
              textAlign: 'center',
              width: 800,
              transform: `scale(${spring({ frame: frame - startVs, fps, config: { damping: 10 } })})`,
            }}
          >
            <h2 style={{ color: '#FF1493', fontSize: 70, margin: 0 }}>
              GAME RULES
            </h2>
            <div
              style={{
                marginTop: 40,
                fontSize: 60,
                color: '#555',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0 }}>アイテムなしの</p>
              <p style={{ margin: 0 }}>1本勝負</p>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 6. MESSAGE */}
      <Sequence from={startMessage} durationInFrames={MESSAGE_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '80px 100px',
              borderRadius: '100px',
              boxShadow: '0 20px 50px rgba(255, 105, 180, 0.3)',
              border: '8px solid white',
              textAlign: 'center',
              maxWidth: '90%',
              transform: `scale(${spring({ frame: frame - startMessage, fps, config: { damping: 10 } })}) rotate(${Math.sin((frame - startMessage) / 15) * 2}deg)`,
            }}
          >
            <h2
              style={{
                color: '#FF1493',
                fontSize: 70,
                margin: 0,
                fontFamily: kawaiiFont,
                lineHeight: 1.3,
                textShadow:
                  '5px 5px 0px white, -5px -5px 0px white, 5px -5px 0px white, -5px 5px 0px white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                wordBreak: 'keep-all',
              }}
            >
              <div>
                {'初の誕生日イベント！じゅんの大切な仲間'
                  .split('')
                  .map((char, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        opacity: spring({
                          frame: frame - startMessage,
                          fps,
                          delay: i * 2,
                        }),
                        transform: `scale(${spring({ frame: frame - startMessage, fps, delay: i * 2 })})`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
              </div>
              <div>
                {'集まってくれると凄く嬉しいです！'.split('').map((char, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      opacity: spring({
                        frame: frame - startMessage,
                        fps,
                        delay: 20 + i * 2,
                      }),
                      transform: `scale(${spring({ frame: frame - startMessage, fps, delay: 20 + i * 2 })})`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </h2>
          </div>
          {/* Message specific Hearts Decoration */}
          {new Array(8).fill(0).map((_, i) => (
            <div
              key={`msg-heart-${i}`}
              style={{
                position: 'absolute',
                left: `${10 + i * 12}%`,
                bottom: 150 + Math.sin(i * 99) * 100,
                fontSize: 80,
                opacity: interpolate(
                  frame - startMessage,
                  [0 + i * 5, 20 + i * 5, 40 + i * 5],
                  [0, 1, 0],
                  { extrapolateRight: 'clamp' },
                ),
                transform: `translateY(${interpolate(frame - startMessage, [0 + i * 5, 40 + i * 5], [100, -200])}px) scale(${1 + Math.sin(frame / 10) * 0.2})`,
              }}
            >
              💖
            </div>
          ))}
        </AbsoluteFill>
      </Sequence>

      {/* 7. ENDING */}
      <Sequence from={startEnd} durationInFrames={END_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <div
            style={{
              textAlign: 'center',
              opacity: interpolate(frame - startEnd, [0, 20], [0, 1]),
            }}
          >
            <h2 style={{ fontSize: 80, color: '#FF69B4' }}>COMING SOON</h2>
            <Img
              src={staticFile('video-factory/images/logo/logo.png')}
              style={{ width: 500, marginTop: 40 }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          backgroundColor: '#FF69B4',
          opacity: flashOpacity,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
