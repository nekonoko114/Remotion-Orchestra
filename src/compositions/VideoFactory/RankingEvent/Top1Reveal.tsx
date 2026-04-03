import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
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
import type { Liver } from '../types';


type Props = {
  rank: number;
  liver: Liver;
  title: string;
  backgroundSrc?: string;
};



export const Top1Reveal: React.FC<Props> = ({ rank, liver, title, backgroundSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  let imageScale = interpolate(imageEntrance, [0, 1], [0.1, 1]);
  let imageRotate = interpolate(imageEntrance, [0, 1], [-20, 0]);
  let imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);
  let imageY = 0;

  if (rank === 3) {
    imageScale = interpolate(imageEntrance, [0, 1], [0.1, 1]);
    imageRotate = 0;
  } else if (rank === 2) {
    imageY = interpolate(imageEntrance, [0, 1], [600, 0], {
      easing: (t) => t,
    });
    imageScale = interpolate(imageEntrance, [0, 1], [0.2, 1]);
    imageRotate = 0;
  } else if (rank === 1) {
    imageScale = interpolate(imageEntrance, [0, 1], [0.1, 1]);
    imageRotate = interpolate(imageEntrance, [0, 1], [-720, 0]); // More spin for top 1
  }

  const nameY = interpolate(nameEntrance, [0, 1], [100, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);


  const getRankColors = (r: number) => {
    // Restore the intense metallic colors
    if (r === 1) return { primary: '#FFD700', secondary: '#FFFFFF', glow: 'rgba(255, 215, 0, 0.8)' }; // Gold
    if (r === 2) return { primary: '#C0C0C0', secondary: '#FFFFFF', glow: 'rgba(192, 192, 192, 0.8)' }; // Silver
    if (r === 3) return { primary: '#B87333', secondary: '#FFFFFF', glow: 'rgba(184, 115, 51, 0.8)' }; // Copper
    return { primary: '#f85718', secondary: '#FFFFFF', glow: 'rgba(248, 87, 24, 0.5)' };
  };

  const { primary, secondary, glow } = getRankColors(rank);

  if (!liver) return null;

  return (
    <AbsoluteFill>
      {/* ===== Abstract Turing Video Background (Fixed for TOP 3rd-1st) ===== */}
      <AbsoluteFill>
        <Video
          src={staticFile('assets/pixabay/videos/absturact-turing.mp4')}
          loop
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(2.5) rotate(90deg)', 
          }}
        />
        {/* Subtle overlay to keep text readable */}
        <AbsoluteFill style={{ backgroundColor: 'rgba(0,10,5,0.4)' }} />
      </AbsoluteFill>

      <AdjustmentLayer rank={rank} />

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
          <ImpactEffect color={primary} intensity="high" />
        </AbsoluteFill>

        <AbsoluteFill style={{ zIndex: 120 }}>
          {/* Rank Title */}
          <div 
            style={{ 
              position: 'absolute',
              top: 80,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              transform: `scale(${rankScale})`, 
              opacity: rankOpacity
            }}
          >
            <div style={{ position: 'relative' }}>
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
                    lineHeight: 1.0,
                  }}
                >
                  {title}
                </h1>
              </TextShine>
            </div>
          </div>

          {/* Avatar Circle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${imageScale}) rotate(${imageRotate}deg) translateY(${imageY}px)`,
              width: 550,
              height: 550,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: rank === 1 ? `0 0 0 15px ${primary}, 0 0 100px ${glow}, 0 30px 80px rgba(0,0,0,0.9)` : `0 0 0 10px ${primary}, 0 0 50px ${glow}, 0 20px 50px rgba(0,0,0,0.8)`,
              backgroundColor: '#000',
              zIndex: 5,
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Laurel Wreath */}
          {(rank === 1 || rank === 2 || rank === 3) && (
            <div
              style={{
                position: 'absolute',
                top: rank === 1 ? '51%' : '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${imageScale * (rank === 1 ? 1.5 : 1.3)})`,
                opacity: imageOpacity * 1,
                width: 700,
                height: 700,
                zIndex: 4,
                pointerEvents: 'none',
              }}
            >
              <Img
                src={staticFile(
                  rank === 1 
                    ? 'assets/images/laurel-wreath-gold.svg' 
                    : rank === 2 
                      ? 'assets/images/laurel-wreath-silver.svg' 
                      : 'assets/images/laurel-wreath-copper.svg'
                )}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 30px ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'})`,
                }}
              />
            </div>
          )}

          {/* Nickname Title */}
          <div 
            style={{ 
              position: 'absolute',
              bottom: 300,
              left: 0,
            width: '100%',
              display: 'flex',
              justifyContent: 'center',
              opacity: nameOpacity,
            }}
          >
            <h2
              style={{
                fontSize: 110,
                margin: 0,
                textShadow: `0 0 30px ${glow}, 2px 2px 20px black`,
                fontWeight: 900,
                fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
                color: '#fff',
                transform: `translateY(${nameY}px)`,
              }}
            >
              {liver.nickname}
            </h2>
          </div>
        </AbsoluteFill>
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
                background: `radial-gradient(circle, ${primary}00 40%, ${primary}33 50%, ${primary}00 60%)`,
                border: `200px dashed ${primary}66`,
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
