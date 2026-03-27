import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  random,
} from 'remotion';
import { Confetti } from '../../../components/effects/Confetti';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';
import { Explosion } from '../../../components/effects/Explosion';
import { LightningBolt } from '../../../components/effects/LightningBolt';
import { SmokeEffect } from '../../../components/effects/SmokeEffect';
import { ImpactEffect } from '../ImpactEffect';
import { CinematicBorder } from '../CinematicBorder';
import { TextShine } from '../TextShine';
import { AdjustmentLayer } from '../AdjustmentLayer';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';

const BPM = 95;

type Props = {
  rank: number;
  liver: Liver;
  title: string;
};

const FloatingDeco: React.FC<{ seed: number; emoji: string }> = ({ seed, emoji }) => {
  const frame = useCurrentFrame();
  const x = random(`${seed}-x`) * 100;
  const duration = 200 + random(seed) * 100;
  const y = interpolate((frame + random(seed) * 200) % duration, [0, duration], [110, -10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rotate = (frame * 1.2 + random(seed) * 360) % 360;
  const opacity = interpolate(y, [0, 10, 90, 100], [0, 0.4, 0.4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        fontSize: 100,
        opacity,
        transform: `rotate(${rotate}deg) scale(${0.8 + Math.sin(frame / 12) * 0.2})`,
        filter: 'drop-shadow(0 0 15px rgba(0, 255, 127, 0.6))',
      }}
    >
      {emoji}
    </div>
  );
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rankEntrance = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 220 }, // Snappy "Poyon"
  });

  const imageEntrance = spring({
    frame: frame - Math.floor(fps * 0.8),
    fps,
    config: { damping: 8, stiffness: 220 },
  });

  const nameEntrance = spring({
    frame: frame - Math.floor(fps * 1.1),
    fps,
    config: { damping: 10, stiffness: 180 }, // Slightly softer for name
  });

  const rankScale = interpolate(rankEntrance, [0, 1], [0.2, 1]);
  const rankOpacity = interpolate(rankEntrance, [0, 0.2], [0, 1]);

  let imageScale = interpolate(imageEntrance, [0, 1], [0, 1], {
    easing: (t) => t,
  });
  let imageRotate = interpolate(imageEntrance, [0, 1], [-20, 0]);
  let imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);
  let imageY = 0;

  if (rank === 3) {
    imageScale = interpolate(imageEntrance, [0, 1], [0, 1], {
      easing: (t) => t,
    });
    imageRotate = 0;
  } else if (rank === 2) {
    imageY = interpolate(imageEntrance, [0, 1], [600, 0], {
      easing: (t) => t,
    });
    imageScale = interpolate(imageEntrance, [0, 1], [0.2, 1]);
    imageRotate = 0;
  } else if (rank === 1) {
    imageScale = interpolate(imageEntrance, [0, 1], [0, 1], {
      easing: (t) => t,
    });
    imageRotate = interpolate(imageEntrance, [0, 1], [-720, 0]); // More spin for top 1
  }

  const nameY = interpolate(nameEntrance, [0, 1], [100, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  const { pulse } = useBeatValue(BPM);
  const pulseScale = (1 + Math.sin(frame / 6) * 0.04) * (1 + pulse * 0.06);

  const getRankColors = (r: number) => {
    // Brighter Theme Colors for Bouncy POP
    if (r === 1) return { primary: '#00FF7F', secondary: '#FFFFFF', glow: 'rgba(0,255,127,0.8)' };
    if (r === 2) return { primary: '#00FA9A', secondary: '#E0FFE0', glow: 'rgba(0,250,154,0.7)' };
    if (r === 3) return { primary: '#3CB371', secondary: '#D0FFD0', glow: 'rgba(60,179,113,0.6)' };
    return { primary: '#00FF7F', secondary: '#FFFFFF', glow: 'transparent' };
  };

  const { primary, secondary, glow } = getRankColors(rank);

  if (!liver) return null;

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <Img
          src={staticFile(`assets/backgrounds/rank_${rank}_bg_new.png`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: `scale(${bgScale})`,
            filter: 'hue-rotate(100deg) contrast(1.3) brightness(1.1)', // Brighter POP BG
          }}
        />
        <AbsoluteFill style={{ backgroundColor: rank === 1 ? 'rgba(0,50,0,0.3)' : 'rgba(0,0,0,0.1)' }} />
      </AbsoluteFill>

      {/* Floating Background Decos */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
        <FloatingDeco seed={201} emoji="✨" />
        <FloatingDeco seed={202} emoji="🍬" />
        <FloatingDeco seed={203} emoji="🍭" />
        <FloatingDeco seed={204} emoji="✨" />
      </AbsoluteFill>

      <AdjustmentLayer rank={rank} beatPulse={pulse} />

      <AbsoluteFill style={{ opacity: 0.5, pointerEvents: 'none', zIndex: 110 }}>
        <SmokeEffect color={primary} density={0.01} velocity={0.3} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
          color: 'white',
        }}
      >
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
          {frame < 15 && <ImpactEffect color={primary} intensity="high" />}
          <Explosion delay={5} color={primary} secondaryColor={secondary} />
          <ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
        </AbsoluteFill>

        <div style={{ zIndex: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ transform: `scale(${rankScale * pulseScale})`, opacity: rankOpacity, marginBottom: 30, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                height: 600,
                background: `radial-gradient(circle, ${glow} 0%, transparent 60%)`,
                opacity: 0.9,
                zIndex: -1,
              }}
            />
            <TextShine color="rgba(255, 255, 255, 1.0)" delay={15} duration={45}>
              <h1
                style={{
                  fontSize: rank === 1 ? 400 : 320,
                  margin: 0,
                  color: '#FFFFFF',
                  textShadow: `0 0 40px ${primary}, 0 0 80px ${primary}, 0 15px 30px rgba(0,0,0,0.9)`,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  lineHeight: 0.8,
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {title}
              </h1>
            </TextShine>
            {rank === 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: -250,
                  left: '50%',
                  transform: `translateX(-50%) rotate(${Math.sin(frame / 5) * 10}deg)`,
                  fontSize: 220,
                  textShadow: `0 0 40px ${primary}, 0 10px 30px rgba(0,0,0,0.9)`,
                  zIndex: 10,
                }}
              >
                🏆
              </div>
            )}
          </div>

          <div
            style={{
              width: rank === 1 ? 1050 : 920,
              height: rank === 1 ? 1050 : 920,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '12px solid #00FF7F', // Brighter Event border
              boxShadow: rank === 1 ? `0 0 0 20px ${primary}, 0 0 100px ${glow}, 0 30px 80px rgba(0,0,0,0.9)` : `0 0 0 10px ${primary}, 0 0 50px ${glow}, 0 20px 50px rgba(0,0,0,0.8)`,
              position: 'relative',
              backgroundColor: '#000',
              zIndex: 5,
              marginTop: 10,
              transform: `scale(${imageScale}) rotate(${imageRotate}deg) translateY(${imageY}px)`,
              opacity: imageOpacity,
            }}
          >
            <Img
              src={
                liver.saved_to
                  ? staticFile(liver.saved_to)
                  : liver.image_url.startsWith('http')
                    ? liver.image_url
                    : staticFile(liver.image_url)
              }
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: rank === 1 ? 'rotate(-90deg)' : 'none' }}
            />
          </div>

          <h2
            style={{
              fontSize: 110,
              marginTop: 60,
              textShadow: `0 0 30px ${glow}, 0 6px 15px black`,
              fontWeight: 900,
              fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
              color: '#fff',
              transform: `translateY(${nameY}px) scale(${1 + pulse * 0.1})`,
              opacity: nameOpacity,
            }}
          >
            {liver.nickname}
          </h2>
        </div>
      </AbsoluteFill>

      <CinematicBorder color={primary} glowColor={glow} />

      <AdjustmentLayer rank={rank} />

      {rank === 1 && (
        <>
          <AbsoluteFill style={{ zIndex: 120, pointerEvents: 'none' }}>
            <LightningBolt color={primary} thickness={25} />
          </AbsoluteFill>
          <AbsoluteFill style={{ zIndex: 8, pointerEvents: 'none', mixBlendMode: 'screen' }}>
            <div
              style={{
                position: 'absolute',
                top: '54%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${frame * 2}deg)`,
                width: 1600,
                height: 1600,
                background: 'radial-gradient(circle, rgba(0,255,127,0) 40%, rgba(0,255,127,0.2) 50%, rgba(0,255,127,0) 60%)',
                border: '200px dashed rgba(255, 220, 47, 0.4)',
                borderRadius: '50%',
                
              }}
            />
          </AbsoluteFill>
        </>
      )}

      <AbsoluteFill style={{ zIndex: 110, pointerEvents: 'none' }}>
        <Confetti count={rank === 1 ? 250 : 150} colors={[primary, '#fff', secondary]} />
        <ParticleBurst count={rank === 1 ? 100 : 60} colors={[primary, '#fff', secondary]} x={540} y={960} speed={4} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
