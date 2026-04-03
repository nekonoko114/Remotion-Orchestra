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
} from 'remotion';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { TimeBackground } from '../TimeBackground';
import { CinematicBorder } from '../CinematicBorder';
import { MorphingTitle } from '../MorphingTitle';
import { Confetti } from '../Confetti';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';

const BPM = 160;

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
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const { pulse } = useBeatValue(BPM);

  const snapReduction = pulse * 0.05;
  const localFrame = frame - snapReduction;

  const nameEntrance = spring({
    frame: localFrame - 25,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const nameLength = liver.nickname.length;
  const charsVisible = Math.floor(
    interpolate(localFrame - 25, [0, 20], [0, nameLength], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const displayedName = liver.nickname.slice(0, charsVisible);

  const imageScale =
    interpolate(frame, [0, 20], [0.7, 1.05], {
      extrapolateRight: 'clamp',
    }) *
    (1 + pulse * 0.005);
  const imageOpacity = interpolate(frame, [0, 15], [0, 1]);

  const nameY = interpolate(nameEntrance, [0, 1], [50, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  const flashOpacity = interpolate(frame, [0, 5, 25], [0, 0.9, 0], {
    extrapolateRight: 'clamp',
  });

  const pulseScale = 1 + pulse * 0.002;

  const magicCirclesData = useMemo(() => {
    const count = rank === 1 ? 5 : 3;
    return [...new Array(count)].map((_, i) => {
      const seed = `magic-${rank}-${i}`;
      const size = 1200 + random(seed + 'size') * 800;
      const angle = (i / count) * Math.PI * 2 + random(seed + 'ang') * 0.5;
      const baseRadius = rank === 1 ? 500 : 450;
      const radiusVariance = rank === 1 ? 400 : 350;
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
  }, [rank]);

  const getRankColors = (r: number) => {
    if (r === 1) return { primary: '#d000ff', glow: 'rgba(208, 0, 255, 0.8)' };
    return { primary: '#a200ff', glow: 'rgba(162, 0, 255, 0.8)' };
  };

  const { primary, glow } = getRankColors(rank);

  const bgScale = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [1, 1.08],
  );

  if (!liver) return null;

  const magicalBg = rank <= 3;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
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

              {[...new Array(12)].map((_, j) => (
                <div
                  key={`ray-${i}-${j}`}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 4,
                    height: m.size * 1.5,
                    marginLeft: -2 + m.x,
                    marginTop: -m.size * 0.75 + m.y,
                    backgroundColor: primary,
                    boxShadow: `0 0 20px ${primary}`,
                    transform: `rotate(${j * 30 + frame * 0.2 * m.rotationDir}deg) scaleY(${circleEntrance})`,
                    opacity: m.opacity * 0.3 * circleEntrance,
                    filter: 'blur(2px)',
                    zIndex: 0,
                  }}
                />
              ))}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 110 }}>
        <Confetti
          count={150}
          colors={[primary, '#ffffff', '#ffd700', '#ff0080']}
        />
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
        <div
          style={{
            marginTop: 80 * (width / 1080),
            transform: `scale(${pulseScale})`,
          }}
        >
          <MorphingTitle
            text={title}
            fontSize={220 * (width / 1080)}
            style={{
              textShadow: `0 0 ${30 * (width / 1080)}px ${primary}, 0 0 ${60 * (width / 1080)}px ${primary}`,
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            width: 850 * (width / 1080),
            height: 850 * (width / 1080),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10 * (width / 1080),
            transform: `scale(${imageScale}) rotateX(10deg)`,
            opacity: imageOpacity,
          }}
        >
          {[...new Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: (780 + i * 35) * (width / 1080),
                height: (780 + i * 35) * (width / 1080),
                borderRadius: i % 2 === 0 ? '20%' : '50%',
                border: `${(3 - i * 0.5) * (width / 1080)}px solid ${primary}`,
                boxShadow: `0 0 ${40 * (width / 1080)}px ${glow}, inset 0 0 ${20 * (width / 1080)}px ${glow}`,
                opacity: 0.8 - i * 0.15,
                transform: `rotate(${frame * (i % 2 === 0 ? 0.3 : -0.2) * (i + 1)}deg)`,
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              width: 900 * (width / 1080),
              height: 900 * (width / 1080),
              background: `radial-gradient(circle, ${primary}99 0%, transparent 70%)`,
              opacity: 0.4 + pulse * 0.2,
              filter: `blur(${60 * (width / 1080)}px)`,
            }}
          />

          <div
            style={{
              width: 750 * (width / 1080),
              height: 750 * (width / 1080),
              borderRadius: '50%',
              overflow: 'hidden',
              border: `${8 * (width / 1080)}px solid white`,
              boxShadow: `0 0 ${120 * (width / 1080)}px ${primary}, 0 0 ${40 * (width / 1080)}px white`,
              position: 'relative',
              backgroundColor: '#000',
              zIndex: 5,
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

        <h2
          style={{
            fontSize: (rank === 1 ? 100 : 80) * (width / 1080),
            marginTop: (rank === 1 ? 30 : 20) * (width / 1080),
            textShadow: `0 0 ${30 * (width / 1080)}px ${glow}, 0 0 ${60 * (width / 1080)}px ${glow}, 0 0 ${100 * (width / 1080)}px ${primary}`,
            fontWeight: 900,
            color: '#fff',
            opacity: nameOpacity,
            transform: `translateY(${nameY * (width / 1080)}px)`,
            letterSpacing: `${4 * (width / 1080)}px`,
            minHeight: `${120 * (width / 1080)}px`,
          }}
        >
          {displayedName}
        </h2>
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
