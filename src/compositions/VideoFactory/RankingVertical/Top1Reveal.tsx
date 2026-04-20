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
  Audio,
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

const VOICE_FIRST = staticFile('assets/audio/voice/rankVoicefirst.wav');
const VOICE_SECOND = staticFile('assets/audio/voice/rankVoiceSecond.wav');
const VOICE_THIRD = staticFile('assets/audio/voice/rankVoiceThrad.wav');

type Props = {
  rank: number;
  liver: Liver;
  title: string;
  top3Video: string;
  bpm: number;
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title, top3Video, bpm }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const { pulse } = useBeatValue(bpm);
  
  const pulseScale = (1 + Math.sin(frame / 8) * 0.05) * (1 + pulse * 0.05);

  // ===== FOOLPROOF SQUARE/TRIANGLE MOTION (Vertical) =====
  
  // Timing: Vertical transition is 28f. Start at 30f.
  const triStart = 30;
  const triDuration = rank === 1 ? 50 : 40;
  const t = Math.max(0, frame - triStart);
  
  const centerX = width / 2;
  const centerY = 960; 

  const Point1X = rank === 2 ? width * 0.95 : width * 0.05;
  const Point2X = rank === 2 ? width * 0.05 : width * 0.95;
  const Rot1 = rank === 2 ? 35 : -35;
  const Rot2 = rank === 2 ? -35 : 35;

  let triX = centerX;
  let triY = -1000;
  let triRotate = 0;
  let motionBlur = 0;
  let triScale = 1;

  if (rank === 1) {
    if (t < 0) {
      triX = centerX;
      triY = -1000;
    } else if (t <= 10) {
      // Phase 1: Top -> Top Left
      const p = interpolate(t, [0, 10], [0, 1], { easing: Easing.in(Easing.poly(3)) });
      triX = interpolate(p, [0, 1], [centerX, width * 0.1]);
      triY = interpolate(p, [0, 1], [-1000, height * 0.2]);
      triRotate = interpolate(p, [0, 1], [0, -45]);
      motionBlur = interpolate(p, [0, 1], [0, 25]);
      triScale = interpolate(p, [0, 1], [0.5, 1.2]); 
    } else if (t <= 20) {
      // Phase 2: Top Left -> Bottom Left
      const p = interpolate(t, [10, 20], [0, 1]); 
      triX = width * 0.1;
      triY = interpolate(p, [0, 1], [height * 0.2, height * 0.8]);
      triRotate = -45;
      motionBlur = 30; 
      triScale = 1.2;
    } else if (t <= 30) {
      // Phase 3: Bottom Left -> Bottom Right
      const p = interpolate(t, [20, 30], [0, 1]); 
      triX = interpolate(p, [0, 1], [width * 0.1, width * 0.9]);
      triY = height * 0.8;
      triRotate = interpolate(p, [0, 1], [-45, 45]);
      motionBlur = 30; 
      triScale = 1.2;
    } else if (t <= 40) {
      // Phase 4: Bottom Right -> Top Right
      const p = interpolate(t, [30, 40], [0, 1]); 
      triX = width * 0.9;
      triY = interpolate(p, [0, 1], [height * 0.8, height * 0.2]);
      triRotate = 45;
      motionBlur = 30; 
      triScale = 1.2;
    } else if (t <= 50) {
      // Phase 5: Top Right -> Center
      const p = interpolate(t, [40, 50], [0, 1], { easing: Easing.out(Easing.back(2)) });
      triX = interpolate(p, [0, 1], [width * 0.9, centerX]);
      triY = interpolate(p, [0, 1], [height * 0.2, centerY]);
      triRotate = interpolate(p, [0, 1], [45, 0]);
      motionBlur = interpolate(p, [0, 1], [25, 0]);
      triScale = interpolate(p, [0, 1], [1.2, 1]);
    } else {
      triX = centerX;
      triY = centerY;
      triRotate = 0;
      motionBlur = 0;
      triScale = 1;
    }
  } else if (t < 0) {
    triX = centerX;
    triY = -1000;
  } else if (t <= 12) {
    // Phase 1: Top -> Bottom Side (12 frames)
    const p = interpolate(t, [0, 12], [0, 1], { easing: Easing.in(Easing.poly(3)) });
    triX = interpolate(p, [0, 1], [centerX, Point1X]);
    triY = interpolate(p, [0, 1], [-1000, height * 0.8]);
    triRotate = interpolate(p, [0, 1], [0, Rot1]);
    motionBlur = interpolate(p, [0, 1], [0, 25]);
    triScale = interpolate(p, [0, 1], [0.5, 1.2]); 
  } else if (t <= 24) {
    // Phase 2: Bottom Side Dash (12 frames)
    const p = interpolate(t, [12, 24], [0, 1]); // linear
    triX = interpolate(p, [0, 1], [Point1X, Point2X]);
    triY = height * 0.8;
    triRotate = interpolate(p, [0, 1], [Rot1, Rot2]);
    motionBlur = 30; 
    triScale = 1.2;
  } else if (t <= 40) {
    // Phase 3: Bottom Side -> Center (16 frames) - Snaps into place
    const p = interpolate(t, [24, 40], [0, 1], { easing: Easing.out(Easing.back(2)) });
    triX = interpolate(p, [0, 1], [Point2X, centerX]);
    triY = interpolate(p, [0, 1], [height * 0.8, centerY]);
    triRotate = interpolate(p, [0, 1], [Rot2, 0]);
    motionBlur = interpolate(p, [0, 1], [25, 0]);
    triScale = interpolate(p, [0, 1], [1.2, 1]);
  } else {
    // Set final destination
    triX = centerX;
    triY = centerY;
    triRotate = 0;
    motionBlur = 0;
    triScale = 1;
  }

  // Final scale logic
  let impactRotate = 0;
  let impactY = 0;
  let rankExtraScale = 1;

  if (rank === 3) {
    rankExtraScale = 0.9;
  } else if (rank === 2) {
    const pRank2 = interpolate(t, [40, 55], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.back(1.5)) });
    impactY = interpolate(pRank2, [0, 1], [300, 0]);
  } else if (rank === 1) {
    const pRank1 = interpolate(t, [triDuration, triDuration + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.exp) });
    impactRotate = interpolate(pRank1, [0, 1], [-180, 0]);
    rankExtraScale = 1.1;
  }

  const imageOpacity = interpolate(t, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
  const impactScaleFactor = triScale * rankExtraScale;

  const rankEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  const nameEntrance = spring({
    frame: frame - 75,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rankScale = interpolate(rankEntrance, [0, 1], [10, 1], {
    easing: Easing.out(Easing.back(2)),
  });
  const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);

  const nameY = interpolate(nameEntrance, [0, 1], [100, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  // ===== STYLES & COLORS =====

  const getRankColors = (r: number) => {
    if (r === 1) return { primary: '#FF0000', secondary: '#FFD700', glow: 'rgba(255,0,0,0.4)' };
    if (r === 2) return { primary: '#8B0000', secondary: '#C0C0C0', glow: 'rgba(139,0,0,0.4)' };
    if (r === 3) return { primary: '#A52A2A', secondary: '#CD7F32', glow: 'rgba(165,42,42,0.4)' };
    return { primary: '#8B0000', secondary: '#ccc', glow: 'transparent' };
  };

  const { primary, secondary, glow } = getRankColors(rank);

  const getTunnelFilter = (r: number) => {
    if (r === 1) return 'brightness(1.1) contrast(1.1) saturate(1.2) hue-rotate(-10deg)'; 
    if (r === 2) return 'brightness(1.0) contrast(1.1) saturate(1.1) hue-rotate(-20deg)'; 
    if (r === 3) return 'brightness(0.9) contrast(1.0) saturate(1.0) hue-rotate(0deg)'; 
    return 'none';
  };

  if (!liver) return null;

  return (
    <AbsoluteFill>
      {/* Rank voices removed by user request */}
      {/* {rank === 1 && <Audio src={VOICE_FIRST} />} */}
      {/* {rank === 2 && <Audio src={VOICE_SECOND} />} */}
      {/* {rank === 3 && <Audio src={VOICE_THIRD} />} */}
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
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle, transparent 20%, ${primary}22 100%)`,
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
        <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
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
          {/* Flash at start and impact */}
          {((frame > 0 && frame < 10) || (frame > triStart + triDuration && frame < triStart + triDuration + 10)) && <ImpactEffect color={primary} intensity="high" />}
          <Explosion delay={triStart + triDuration} color={primary} secondaryColor={secondary} />
          <ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
        </AbsoluteFill>

        <AbsoluteFill style={{ zIndex: 120 }}>
          <div style={{ 
            position: 'absolute',
            top: 200 * (height / 1920),
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${rankScale * pulseScale})`, 
            opacity: rankOpacity 
          }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500 * (width / 1080),
                height: 500 * (width / 1080),
                background: `radial-gradient(circle, ${glow} 0%, transparent 60%)`,
                opacity: 0.5,
                zIndex: -1,
              }}
            />
            <TextShine color="rgba(255, 255, 255, 0.9)" delay={15} duration={45}>
              <h1
                style={{
                  fontSize: (rank === 1 ? 280 : 220) * (width / 1080),
                  margin: 0,
                  color: rank === 1 ? '#FFD700' : '#FFFFFF',
                  textShadow: rank === 1 ? `0 0 ${20 * (width / 1080)}px ${primary}, 0 ${10 * (width / 1080)}px ${20 * (width / 1080)}px rgba(0,0,0,0.9)` : `0 0 ${15 * (width / 1080)}px ${primary}`,
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
          </div>

          {/* TRIANGLE MOTION WRAPPER */}
          <div
            style={{
              position: 'absolute',
              left: triX,
              top: triY,
              width: (rank === 1 ? 820 : 750) * (width / 1080),
              height: (rank === 1 ? 820 : 750) * (width / 1080),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translate(-50%, -50%) rotate(${triRotate + impactRotate}deg) translateY(${impactY}px)`,
              filter: `blur(${motionBlur}px)`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `${(rank === 1 ? 15 : 10) * (width / 1080)}px solid #FFD700`,
                boxShadow: rank === 1 ? `0 0 0 ${(15 * (width / 1080))}px ${primary}, 0 0 ${80 * (width / 1080)}px ${glow}, 0 ${20 * (width / 1080)}px ${60 * (width / 1080)}px rgba(0,0,0,0.9)` : `0 0 0 ${(8 * (width / 1080))}px ${primary}, 0 0 ${40 * (width / 1080)}px ${glow}, 0 ${20 * (width / 1080)}px ${40 * (width / 1080)}px rgba(0,0,0,0.8)`,
                position: 'relative',
                backgroundColor: '#000',
                zIndex: 5,
                opacity: imageOpacity,
                transform: `scale(${impactScaleFactor})`,
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
          </div>

          <div style={{
            position: 'absolute',
            top: 1550 * (height / 1920),
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <h2
              style={{
                fontSize: 100 * (width / 1080),
                margin: 0, // Removes the problematic flexbox margin
                textShadow: `0 0 ${20 * (width / 1080)}px ${glow}, 0 ${4 * (width / 1080)}px ${10 * (width / 1080)}px black`,
                fontWeight: 900,
                fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
                color: '#fff',
                transform: `translateY(${nameY * (width / 1080)}px)`,
                opacity: nameOpacity,
                textAlign: 'center',
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
            <LightningBolt color={primary} thickness={20 * (width / 1080)} />
          </AbsoluteFill>
          <AbsoluteFill style={{ zIndex: 8, pointerEvents: 'none', mixBlendMode: 'screen' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${frame}deg)`,
                width: 1500 * (width / 1080),
                height: 1500 * (width / 1080),
                background: 'radial-gradient(circle, rgba(255,215,0,0) 40%, rgba(255,215,0,0.1) 50%, rgba(255,215,0,0) 60%)',
                border: `${2 * (width / 1080)}px dashed rgba(255,215,0,0.3)`,
                borderRadius: '50%',
              }}
            />
          </AbsoluteFill>
        </>
      )}

      <AbsoluteFill style={{ zIndex: 110, pointerEvents: 'none' }}>
        <Confetti count={rank === 1 ? 200 : 100} colors={[primary, '#fff', secondary]} />
        <ParticleBurst count={50} colors={[primary, '#fff', secondary]} x={centerX} y={centerY} speed={3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
