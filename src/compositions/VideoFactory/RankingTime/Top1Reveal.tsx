import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  staticFile,
  useVideoConfig,
  Video,
  Easing, 
  random,
} from 'remotion';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { TimeBackground } from '../TimeBackground';
import { CinematicBorder } from '../CinematicBorder';
import { MorphingTitle } from '../MorphingTitle';
import { Explosion } from '../../../components/effects/Explosion';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';
import { HolographicHUD } from '../../../components/effects/HolographicHUD';
import { GlitchEffect } from '../../../components/effects/GlitchEffect';
import { ChromaticAberration } from '../../../components/effects/ChromaticAberration';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';
import { loadFont } from '@remotion/google-fonts/Orbitron';

const { fontFamily } = loadFont();

const BPM = 160;

// Cyber Tunnel Loop
const CYBER_TUNNEL_VIDEO = staticFile('assets/pixabay/videos/pixabay_tunnel_loop_science_fiction_futuristic_fantasy_227152.mp4');

type Props = {
  rank: number;
  liver: Liver;
  title: string;
  themeColor?: string;
  glowColor?: string;
  backgroundSrc?: string;
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title, themeColor, glowColor }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const { pulse } = useBeatValue(BPM);

  const localFrame = frame;

  // ===== CYBER MOTION LOGIC =====
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
      const p = interpolate(t, [0, 10], [0, 1], { easing: Easing.in(Easing.poly(3)) });
      triX = interpolate(p, [0, 1], [centerX, width * 0.1]);
      triY = interpolate(p, [0, 1], [-1000, height * 0.2]);
      triRotate = interpolate(p, [0, 1], [0, -45]);
      motionBlur = interpolate(p, [0, 1], [0, 25]);
      triScale = interpolate(p, [0, 1], [0.5, 1.2]); 
    } else if (t <= 20) {
      const p = interpolate(t, [10, 20], [0, 1]); 
      triX = width * 0.1;
      triY = interpolate(p, [0, 1], [height * 0.2, height * 0.8]);
      triRotate = -45;
      motionBlur = 30; 
      triScale = 1.2;
    } else if (t <= 30) {
      const p = interpolate(t, [20, 30], [0, 1]); 
      triX = interpolate(p, [0, 1], [width * 0.1, width * 0.9]);
      triY = height * 0.8;
      triRotate = interpolate(p, [0, 1], [-45, 45]);
      motionBlur = 30; 
      triScale = 1.2;
    } else if (t <= 40) {
      const p = interpolate(t, [30, 40], [0, 1]); 
      triX = width * 0.9;
      triY = interpolate(p, [0, 1], [height * 0.8, height * 0.2]);
      triRotate = 45;
      motionBlur = 30; 
      triScale = 1.2;
    } else if (t <= 50) {
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
  } else {
    // Ranks 2 & 3
    if (t < 0) {
      triX = centerX;
      triY = -1000;
    } else if (t <= 12) {
      const p = interpolate(t, [0, 12], [0, 1], { easing: Easing.in(Easing.poly(3)) });
      triX = interpolate(p, [0, 1], [centerX, Point1X]);
      triY = interpolate(p, [0, 1], [-1000, height * 0.8]);
      triRotate = interpolate(p, [0, 1], [0, Rot1]);
      motionBlur = interpolate(p, [0, 1], [0, 25]);
      triScale = interpolate(p, [0, 1], [0.5, 1.2]); 
    } else if (t <= 24) {
      const p = interpolate(t, [12, 24], [0, 1]); 
      triX = interpolate(p, [0, 1], [Point1X, Point2X]);
      triY = height * 0.8;
      triRotate = interpolate(p, [0, 1], [Rot1, Rot2]);
      motionBlur = 30; 
      triScale = 1.2;
    } else if (t <= 40) {
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

  // Landing impact happens exactly at t = triDuration
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
  const pName = interpolate(localFrame - 80, [0, 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const charsVisible = Math.floor(interpolate(pName, [0, 1], [0, nameLength]));
  const displayedName = liver.nickname.slice(0, charsVisible);

  const nameYPos = interpolate(nameEntrance, [0, 1], [50, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  const impactIntensity = interpolate(sprImpact, [0, 0.1, 0.5], [0, 1, 0], { extrapolateRight: 'clamp' });
  const flashOpacity = Math.max(
    impactIntensity * 0.8,
    interpolate(frame, [0, 5, 25], [0, 0.9, 0], { extrapolateRight: 'clamp' })
  );

  const rankScale = interpolate(rankEntrance, [0, 1], [6, 1], {
    easing: Easing.out(Easing.back(2)),
  });
  const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);

  const getRankColors = (r: number) => {
    // Cyber Red & Neon Blue Theme
    if (r === 1) return { primary: '#ff0000', secondary: '#00ffff', glow: 'rgba(255, 0, 0, 0.8)' }; // Intense Red for No.1
    if (r === 2) return { primary: '#00ffff', secondary: '#ff0000', glow: 'rgba(0, 255, 255, 0.6)' }; // Neon Blue for No.2
    return { primary: '#ff3333', secondary: '#00ffff', glow: 'rgba(255, 51, 51, 0.5)' }; // Red for No.3
  };

  const { primary, secondary, glow } = getRankColors(rank);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Video
        src={CYBER_TUNNEL_VIDEO}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.6,
          filter: `hue-rotate(${rank === 2 ? '0deg' : '180deg'}) contrast(1.2) brightness(1.1)`,
        }}
        muted
        loop
      />

      {/* Technical Grid Overlay */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${primary}22 1px, transparent 1px), linear-gradient(90deg, ${primary}22 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.2,
          zIndex: 2,
        }}
      />
      
      {/* Scanline Overlay */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,255,255,0.03) 50%, transparent 50%)',
          backgroundSize: '100% 4px',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
        {frame < 20 && <ImpactEffect color={primary} intensity="high" />}
        <Explosion delay={triStart + triDuration} color={primary} secondaryColor={secondary} />
        <ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
      </AbsoluteFill>

      <AbsoluteFill style={{ zIndex: 110 }}>
        <Confetti
          count={rank === 1 ? 250 : 150}
          colors={[primary, '#ffffff', secondary, '#00ffff']}
        />
        {(localFrame > triStart + triDuration) && (
          <ParticleBurst 
            count={60} 
            colors={[primary, '#ffffff', '#00ffff']} 
            x={width/2} 
            y={height/2 + 80 * (width/1080)} 
            speed={4}
          />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily,
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
              alignItems: 'baseline',
              transform: `scale(${pulseScale * rankScale})`,
              opacity: rankOpacity,
            }}
          >
            {(() => {
              const match = title.match(/^(\d+)(.*)$/);
              if (match) {
                const [, num, suffix] = match;
                return (
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <MorphingTitle
                      text={num}
                      fontSize={180 * (height / 1080)}
                      style={{
                        fontFamily,
                        textShadow: `0 0 ${30 * (height / 1080)}px ${primary}, 0 0 ${60 * (height / 1080)}px ${primary}`,
                      }}
                    />
                    <MorphingTitle
                      text={suffix}
                      fontSize={80 * (height / 1080)}
                      style={{
                        fontFamily: 'serif', // もしくは日本語フォント
                        textShadow: `0 0 ${10 * (height / 1080)}px ${primary}, 0 0 ${20 * (height / 1080)}px ${primary}`,
                        marginLeft: 10,
                      }}
                    />
                  </div>
                );
              }
              return (
                <MorphingTitle
                  text={title}
                  fontSize={180 * (height / 1080)}
                  style={{
                    fontFamily,
                    textShadow: `0 0 ${30 * (height / 1080)}px ${primary}, 0 0 ${60 * (height / 1080)}px ${primary}`,
                  }}
                />
              );
            })()}
          </div>

          {/* CYBER MOTION WRAPPER */}
          <div
            style={{
              position: 'absolute',
              left: triX,
              top: triY,
              width: 500 * (height / 1080),
              height: 500 * (height / 1080),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translate(-50%, -50%) rotate(${triRotate + impactRotate}deg) translateY(${impactY}px)`,
            }}
          >
            <GlitchEffect intensity={impactIntensity * 40}>
              <ChromaticAberration intensity={impactIntensity * 10}>
                {/* Holographic HUD */}
                <div style={{ transform: 'scale(1.6)', opacity: finalImageOpacity }}>
                  <HolographicHUD color={primary} />
                </div>

                {/* Liver Image Container */}
                <div
                  style={{
                    width: 500 * (height / 1080),
                    height: 500 * (height / 1080),
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
              </ChromaticAberration>
            </GlitchEffect>
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
                fontFamily,
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
