import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  OffthreadVideo,
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

const BPM = 152;

type Props = {
  rank: number;
  liver: Liver;
  title: string;
  top3Video: string;
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title, top3Video }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rankEntrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  const imageEntrance = spring({
    frame: frame - Math.floor(fps * 0.9),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const nameEntrance = spring({
    frame: frame - Math.floor(fps * 1.2),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const rankScale = interpolate(rankEntrance, [0, 1], [10, 1], {
    easing: Easing.out(Easing.back(2)),
  });
  const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);

  let imageScale = interpolate(imageEntrance, [0, 1], [2, 1], {
    easing: Easing.out(Easing.exp),
  });
  let imageRotate = interpolate(imageEntrance, [0, 1], [-45, 0]);
  let imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);
  let imageY = 0;

  if (rank === 3) {
    imageScale = interpolate(imageEntrance, [0, 1], [0.1, 1], {
      easing: Easing.out(Easing.back(3)),
    });
    imageRotate = 0;
  } else if (rank === 2) {
    imageY = interpolate(imageEntrance, [0, 1], [800, 0], {
      easing: Easing.out(Easing.back(1.5)),
    });
    imageScale = interpolate(imageEntrance, [0, 1], [0.5, 1], {
      easing: Easing.out(Easing.exp),
    });
    imageRotate = 0;
  } else if (rank === 1) {
    imageScale = interpolate(imageEntrance, [0, 1], [0, 1], {
      easing: Easing.out(Easing.back(2)),
    });
    imageRotate = interpolate(imageEntrance, [0, 1], [-1080, 0], {
      easing: Easing.out(Easing.exp),
    });
  }

  const nameY = interpolate(nameEntrance, [0, 1], [100, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  const { pulse } = useBeatValue(BPM);
  const pulseScale = (1 + Math.sin(frame / 8) * 0.05) * (1 + pulse * 0.05);

  const getRankColors = (r: number) => {
    if (r === 1) return { primary: '#FF0000', secondary: '#FFD700', glow: 'rgba(255,0,0,0.8)' };
    if (r === 2) return { primary: '#8B0000', secondary: '#C0C0C0', glow: 'rgba(139,0,0,0.8)' };
    if (r === 3) return { primary: '#A52A2A', secondary: '#CD7F32', glow: 'rgba(165,42,42,0.8)' };
    return { primary: '#8B0000', secondary: '#ccc', glow: 'transparent' };
  };

  const { primary, secondary, glow } = getRankColors(rank);

  // Fire Tunnel Filter based on rank
  const getTunnelFilter = (r: number) => {
    // Psychedelic video is colorful. We want to push it towards fire colors (Red/Orange/Gold)
    if (r === 1) return 'brightness(1.5) contrast(1.2) saturate(2) hue-rotate(-20deg)'; // Golden/Red intense
    if (r === 2) return 'brightness(1.2) contrast(1.3) saturate(1.5) hue-rotate(-40deg)'; // Deep Red
    if (r === 3) return 'brightness(1.1) contrast(1.1) saturate(1.8) hue-rotate(0deg)'; // Orange/Fire
    return 'none';
  };

  if (!liver) return null;

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(top3Video)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: getTunnelFilter(rank),
            transform: `scale(${bgScale})`,
          }}
          muted
        />
        {/* Fire Tint Overlay */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle, transparent 20%, ${primary}44 100%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        <AbsoluteFill style={{ backgroundColor: rank === 1 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.0)' }} />
      </AbsoluteFill>

      <AdjustmentLayer rank={rank} beatPulse={pulse} />

      <AbsoluteFill style={{ opacity: 0.4, pointerEvents: 'none', zIndex: 110 }}>
        <SmokeEffect color={primary} density={0.015} velocity={0.2} />
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
          {frame < 12 && <ImpactEffect color={primary} intensity="high" />}
          <Explosion delay={4} color={primary} secondaryColor={secondary} />
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
                width: 500,
                height: 500,
                background: `radial-gradient(circle, ${glow} 0%, transparent 60%)`,
                opacity: 0.8,
                zIndex: -1,
              }}
            />
            <TextShine color="rgba(255, 255, 255, 0.9)" delay={15} duration={45}>
              <h1
                style={{
                  fontSize: rank === 1 ? 380 : 300,
                  margin: 0,
                  color: rank === 1 ? '#FFD700' : '#FFFFFF',
                  textShadow: rank === 1 ? `0 0 40px ${primary}, 0 0 80px ${primary}, 0 10px 20px rgba(0,0,0,0.8)` : `0 0 20px ${primary}, 0 0 40px ${primary}`,
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
                  top: -230,
                  left: '50%',
                  transform: 'translateX(-50%) rotate(-5deg)',
                  fontSize: 180,
                  textShadow: `0 0 30px ${primary}, 0 0 60px ${primary}, 0 10px 20px rgba(0,0,0,0.8)`,
                  zIndex: 10,
                }}
              >
                👑
              </div>
            )}
          </div>

          <div
            style={{
              width: rank === 1 ? 1000 : 896,
              height: rank === 1 ? 1000 : 896,
              borderRadius: '50%',
              overflow: 'hidden',
              border: rank === 1 ? '15px solid #FFD700' : '10px solid #FFFFFF',
              boxShadow: rank === 1 ? `0 0 0 15px ${primary}, 0 0 80px ${glow}, 0 20px 60px rgba(0,0,0,0.9)` : `0 0 0 8px ${primary}, 0 0 40px ${glow}, 0 20px 40px rgba(0,0,0,0.8)`,
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
              fontSize: 100,
              marginTop: 50,
              textShadow: `0 0 20px ${glow}, 0 4px 10px black`,
              fontWeight: 900,
              fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
              color: '#fff',
              transform: `translateY(${nameY}px)`,
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
            <LightningBolt color={primary} thickness={20} />
          </AbsoluteFill>
          <AbsoluteFill style={{ zIndex: 8, pointerEvents: 'none', mixBlendMode: 'screen' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${frame}deg)`,
                width: 1500,
                height: 1500,
                background: 'radial-gradient(circle, rgba(255,215,0,0) 40%, rgba(255,215,0,0.1) 50%, rgba(255,215,0,0) 60%)',
                border: '2px dashed rgba(255,215,0,0.3)',
                borderRadius: '50%',
              }}
            />
          </AbsoluteFill>
        </>
      )}

      <AbsoluteFill style={{ zIndex: 110, pointerEvents: 'none' }}>
        <Confetti count={rank === 1 ? 200 : 100} colors={[primary, '#fff', secondary]} />
        <ParticleBurst count={50} colors={[primary, '#fff', secondary]} x={540} y={960} speed={3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
