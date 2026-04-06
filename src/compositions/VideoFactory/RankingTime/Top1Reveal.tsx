import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  random,
  useCurrentFrame,
  staticFile,
  useVideoConfig,
  OffthreadVideo,
  Easing,
  Audio,
} from 'remotion';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { TimeBackground } from '../TimeBackground';
import { CinematicBorder } from '../CinematicBorder';
import { MorphingTitle } from '../MorphingTitle';
import { Confetti } from '../Confetti';
import { Explosion } from '../../../components/effects/Explosion';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';

const BPM = 160;

const VOICE_FIRST = staticFile('assets/audio/voice/rankVoicefirst.wav');
const VOICE_SECOND = staticFile('assets/audio/voice/rankVoiceSecond.wav');
const VOICE_THIRD = staticFile('assets/audio/voice/rankVoiceThrad.wav');


const MAGIC_CIRCLES = [
  'magic-circle-blue.png',
  'magic-circle-green.png',
  'magic-circle-orange.png',
  'magic-circle-red.png',
  'magic-circle-yellow.png',
];

const ANTIQUE_GOLD_VIDEO = staticFile('assets/pixabay/videos/pixabay_clock_time_minutes_old_gold_retro_antique_spiral_l_207864.mp4');

type Props = {
  rank: number;
  liver: Liver;
  title: string;
  themeColor?: string;
  glowColor?: string;
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title, themeColor, glowColor }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const { pulse } = useBeatValue(BPM);

  const snapReduction = pulse * 0.05;
  const localFrame = frame - snapReduction;

  // ===== FOOLPROOF SQUARE/TRIANGLE MOTION =====
  
  // Timing: Wipe completes at 40. Start sweeping at 45.
  const triStart = 45;
  const triDuration = rank === 1 ? 50 : 40;
  const t = Math.max(0, localFrame - triStart);
  
  const centerX = width / 2;
  const centerY = height / 2 + 80 * (height / 1080);
  
  const Point1X = rank === 2 ? width * 0.9 : width * 0.1;
  const Point2X = rank === 2 ? width * 0.1 : width * 0.9;
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
    // Phase 1: Top -> Bottom Side
    const p = interpolate(t, [0, 12], [0, 1], { easing: Easing.in(Easing.poly(3)) });
    triX = interpolate(p, [0, 1], [centerX, Point1X]);
    triY = interpolate(p, [0, 1], [-1000, height * 0.8]);
    triRotate = interpolate(p, [0, 1], [0, Rot1]);
    motionBlur = interpolate(p, [0, 1], [0, 25]);
    triScale = interpolate(p, [0, 1], [0.5, 1.2]); 
  } else if (t <= 24) {
    // Phase 2: Bottom Side Dash
    const p = interpolate(t, [12, 24], [0, 1]); 
    triX = interpolate(p, [0, 1], [Point1X, Point2X]);
    triY = height * 0.8;
    triRotate = interpolate(p, [0, 1], [Rot1, Rot2]);
    motionBlur = 30; 
    triScale = 1.2;
  } else if (t <= 40) {
    // Phase 3: Bottom Side -> Center 
    const p = interpolate(t, [24, 40], [0, 1], { easing: Easing.out(Easing.back(2)) });
    triX = interpolate(p, [0, 1], [Point2X, centerX]);
    triY = interpolate(p, [0, 1], [height * 0.8, centerY]);
    triRotate = interpolate(p, [0, 1], [Rot2, 0]);
    motionBlur = interpolate(p, [0, 1], [25, 0]);
    triScale = interpolate(p, [0, 1], [1.2, 1]);
  } else {
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

  if (rank === 2) {
    const pRank2 = interpolate(t, [40, 55], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.back(1.5)) });
    impactY = interpolate(pRank2, [0, 1], [300, 0]);
  } else if (rank === 1) {
    const pRank1 = interpolate(t, [triDuration, triDuration + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.exp) });
    impactRotate = interpolate(pRank1, [0, 1], [-180, 0]);
    rankExtraScale = 1.05;
  }

  const finalImageScale = triScale * rankExtraScale * (1 + pulse * 0.015);
  const pulseScale = (1 + Math.sin(frame / 8) * 0.02) * (1 + pulse * 0.03);
  const finalImageOpacity = interpolate(t, [0, 4], [0, 1], { extrapolateRight: 'clamp' });

  // Landing impact happens exactly at exactly t = triDuration
  const sprImpact = spring({
    frame: localFrame - (triStart + triDuration),
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const nameEntrance = spring({
    frame: localFrame - 80,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const rankEntrance = spring({
    frame: localFrame - 40,
    fps,
    config: { damping: 10, stiffness: 160 },
  });

  const nameLength = liver.nickname.length;
  // Get characters visible using Remotion core utilities
  const pName = interpolate(localFrame - 80, [0, 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const charsVisible = Math.floor(interpolate(pName, [0, 1], [0, nameLength]));
  const displayedName = liver.nickname.slice(0, charsVisible);

  const nameYPos = interpolate(nameEntrance, [0, 1], [50, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  const flashOpacityRaw = Math.max(
    interpolate(sprImpact, [0, 0.1, 0.5], [0, 0.8, 0], { extrapolateRight: 'clamp' }),
    interpolate(frame, [0, 5, 25], [0, 0.9, 0], { extrapolateRight: 'clamp' })
  );
  const flashOpacity = flashOpacityRaw;

  const rankScale = interpolate(rankEntrance, [0, 1], [6, 1], {
    easing: Easing.out(Easing.back(2)),
  });
  const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);

  const magicCirclesData = useMemo(() => {
    const scaleFactor = width / 2160; // Corrected to use 4K baseline
    const count = rank === 1 ? 5 : 3;
    return [...new Array(count)].map((_, i) => {
      const seed = `magic-${rank}-${i}`;
      const size = (1200 + random(seed + 'size') * 800) * scaleFactor;
      const angle = (i / count) * Math.PI * 2 + random(seed + 'ang') * 0.5;
      const baseRadius = (rank === 1 ? 500 : 450) * scaleFactor;
      const radiusVariance = (rank === 1 ? 400 : 350) * scaleFactor;
      const radius = baseRadius + random(seed + 'rad') * radiusVariance;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const rotationDir = random(seed + 'dir') > 0.5 ? 1 : -1;
      const rotationSpeed = 0.2 + random(seed + 'speed') * 2.5;
      const asset =
        count === 5
          ? MAGIC_CIRCLES[i % MAGIC_CIRCLES.length]
          : MAGIC_CIRCLES[
              Math.floor(random(seed + 'asset') * MAGIC_CIRCLES.length)
            ];
      const opacity =
        rank === 1
          ? 0.8 + random(seed + 'opacity') * 0.2
          : 0.4 + random(seed + 'opacity') * 0.3;
      const blur = 1 + random(seed + 'blur') * 4;
      return { size, x, y, rotationDir, rotationSpeed, asset, opacity, blur };
    });
  }, [rank, width]);

  const getRankColors = (r: number) => {
    const baseColor = themeColor || '#d000ff';
    const baseGlow = glowColor || 'rgba(208, 0, 255, 0.8)';
    if (r === 1) return { primary: '#9d00ff', secondary: '#00ffff', glow: 'rgba(157, 0, 255, 0.6)' };
    return { primary: baseColor, glow: baseGlow, secondary: '#00ffff' };
  };

  const { primary, secondary, glow } = getRankColors(rank);

  const bgScale = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [1, 1.08],
  );

  if (!liver) return null;

  const magicalBg = rank <= 3;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {rank === 1 && <Audio src={VOICE_FIRST} />}
      {rank === 2 && <Audio src={VOICE_SECOND} />}
      {rank === 3 && <Audio src={VOICE_THIRD} />}
      <TimeBackground
        overlayColor={primary + '33'}
        hideBackground
        hideBaseVideo
      />
      {magicalBg && (
        <AbsoluteFill style={{ zIndex: 5 }}>
          <OffthreadVideo
            src={ANTIQUE_GOLD_VIDEO}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${bgScale})`,
              opacity: 0.65,
              filter: 'sepia(0.3) brightness(1.2) contrast(1.1)',
            }}
            muted
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at center, transparent 20%, #000 100%)`,
              opacity: 0.4,
            }}
          />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
        {frame < 20 && <ImpactEffect color={primary} intensity="high" />}
        <Explosion delay={triStart + triDuration} color={primary} secondaryColor={secondary} />
        <ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 10, overflow: 'hidden' }}>
        {magicCirclesData.map((m, i) => {
          const delayFrames = i * 0.3 * fps;
          const circleEntrance = spring({
            frame: localFrame - delayFrames,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: m.size,
                  height: m.size,
                  marginLeft: -m.size / 2 + m.x,
                  marginTop: -m.size / 2 + m.y,
                  transform: `rotate(${frame * m.rotationSpeed * m.rotationDir}deg) scale(${circleEntrance})`,
                  opacity: m.opacity * circleEntrance,
                  filter:
                    rank === 1
                      ? `blur(${m.blur}px) brightness(2.0) drop-shadow(0 0 30px ${primary})`
                      : `blur(${m.blur}px) brightness(1.5)`,
                  zIndex: 2,
                }}
              >
                <Img
                  src={staticFile(`assets/magic/${m.asset}`)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: m.size * 2,
                  height: m.size * 2,
                  marginLeft: -m.size + m.x,
                  marginTop: -m.size + m.y,
                  background: `radial-gradient(circle, ${primary}66 0%, transparent 70%)`,
                  transform: `scale(${circleEntrance * (1 + pulse * 0.1)})`,
                  opacity:
                    rank === 1
                      ? m.opacity * 0.5 * circleEntrance
                      : m.opacity *
                        0.4 *
                        circleEntrance *
                        (0.8 + Math.sin(frame / 5) * 0.2),
                  filter: 'blur(40px)',
                  zIndex: 1,
                }}
              />
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 110 }}>
        <Confetti
          count={rank === 1 ? 250 : 150}
          colors={[primary, '#ffffff', '#ffd700', '#00ffff']}
        />
        {(localFrame > triStart + triDuration) && (
          <ParticleBurst 
            count={60} 
            colors={[primary, '#ffffff', '#00ffff']} 
            x={width/2} 
            y={height/2 + 80 * (width/1080)} // Adjusted to center of icon area
            speed={4}
          />
        )}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: '"Mochiy Pop One", sans-serif',
          color: 'white',
          zIndex: 120,
        }}
      >
        <AbsoluteFill style={{ zIndex: 120 }}>
          <div
            style={{
              position: 'absolute',
              top: 50 * (height / 1080),
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              transform: `scale(${pulseScale * rankScale})`,
              opacity: rankOpacity,
            }}
          >
            <MorphingTitle
              text={title}
              fontSize={180 * (height / 1080)}
              style={{
                textShadow: `0 0 ${30 * (height / 1080)}px ${primary}, 0 0 ${60 * (height / 1080)}px ${primary}`,
              }}
            />
          </div>

        {/* TRIANGLE MOTION WRAPPER */}
        <div
          style={{
            position: 'absolute',
            left: triX,
            top: triY,
            width: 750 * (height / 1080),
            height: 750 * (height / 1080),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translate(-50%, -50%) rotate(${triRotate + impactRotate}deg) translateY(${impactY}px)`,
            filter: `blur(${motionBlur}px)`,
          }}
        >
          {[...new Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: (780 + i * 35) * (height / 1080),
                height: (780 + i * 35) * (height / 1080),
                borderRadius: i % 2 === 0 ? '20%' : '50%',
                border: `${(3 - i * 0.5) * (height / 1080)}px solid ${primary}`,
                boxShadow: `0 0 ${40 * (height / 1080)}px ${glow}, inset 0 0 ${20 * (height / 1080)}px ${glow}`,
                opacity: 0.8 - i * 0.15,
                transform: `rotate(${frame * (i % 2 === 0 ? 0.3 : -0.2) * (i + 1)}deg)`,
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              width: 900 * (height / 1080),
              height: 900 * (height / 1080),
              background: `radial-gradient(circle, ${primary}99 0%, transparent 70%)`,
              opacity: 0.4 + pulse * 0.2,
              filter: `blur(${60 * (height / 1080)}px)`,
            }}
          />

          <div
            style={{
              width: 750 * (height / 1080),
              height: 750 * (height / 1080),
              borderRadius: '50%',
              overflow: 'hidden',
              border: `${8 * (height / 1080)}px solid white`,
              boxShadow: `0 0 ${120 * (height / 1080)}px ${primary}, 0 0 ${40 * (height / 1080)}px white`,
              position: 'relative',
              backgroundColor: '#000',
              zIndex: 5,
              opacity: finalImageOpacity,
              transform: `scale(${finalImageScale})`,
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
            <AbsoluteFill
              style={{
                background: `radial-gradient(circle, transparent 20%, ${primary}66 100%)`,
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </div>

          <div
            style={{
              position: 'absolute',
              bottom: 80 * (height / 1080),
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <h2
              style={{
                fontSize: (rank === 1 ? 70 : 50) * (height / 1080),
                margin: 0,
                textShadow: `0 0 ${30 * (height / 1080)}px ${glow}, 0 0 ${60 * (height / 1080)}px ${glow}, 0 0 ${100 * (height / 1080)}px ${primary}`,
                fontWeight: 900,
                color: '#fff',
                opacity: nameOpacity,
                transform: `translateY(${nameYPos * (height / 1080)}px)`,
                letterSpacing: `${4 * (height / 1080)}px`,
              }}
            >
              {displayedName}
            </h2>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: flashOpacity,
          pointerEvents: 'none',
          zIndex: 1000,
          mixBlendMode: 'overlay',
        }}
      />
      <CinematicBorder color={primary} glowColor={glow} />
    </AbsoluteFill>
  );
};
