import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
} from 'remotion';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';

type Props = {
  title: string;
  livers: Liver[];
  isHighlight?: boolean;
};

const BPM = 180; // Velocity-Shift BPM

// Burning Fire Theme (Orange & Gold)
const THEME_COLOR = '#d000ff';
const SECONDARY_COLOR = '#00f2ff';
const GLOW_COLOR = 'rgba(208, 0, 255, 0.6)';

const BACKGROUND_VIDEO = staticFile('assets/pixabay/videos/pixabay_clock_time_fire_flame_ritual_149142.mp4');

const getAvatarPosition = (rank: number) => {
  if (rank === 10) return 'center 20%';
  if (rank === 8) return 'center 25%';
  if (rank === 7) return 'center 20%';
  if (rank === 6) return 'center 50%';
  if (rank === 5) return 'center 20%';
  if (rank === 4) return 'center 15%';
  return 'center';
};

export const RankingGroup: React.FC<Props> = ({
  title,
  livers,
  isHighlight,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = width / 1080;
  const { pulse } = useBeatValue(BPM);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const beamScale = interpolate(entrance, [0, 1], [0.9, 1]);
  const beatScale = 1 + pulse * 0.02;

  const is2Group = livers.length === 2;
  const is3Group = livers.length === 3;
  const gap = is2Group ? 120 : is3Group ? 80 : 60;
  const iconSize = (is2Group ? 220 : 160) * scale;
  const fontSize = (is2Group ? 80 : 60) * scale;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `scale(${beamScale * beatScale})`,
        backgroundColor: '#000',
      }}
    >
      {/* 0. Background Video Layer */}
      <AbsoluteFill style={{ zIndex: 0, opacity: 0.8 }}>
        <OffthreadVideo
          src={BACKGROUND_VIDEO}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'hue-rotate(280deg) contrast(1.4) brightness(1.2)',
          }}
          muted
        />
        {/* Subtle dark overlay to keep text legible */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }} />
      </AbsoluteFill>

      {/* 1. Header Title */}
      <div style={{ position: 'absolute', top: 120 * scale, zIndex: 100 }}>
        <h1
          style={{
            fontSize: 100 * scale,
            fontWeight: '900',
            color: '#FFF',
            margin: 0,
            fontStyle: 'italic',
            textShadow: `0 0 20px ${THEME_COLOR}, 0 0 40px ${SECONDARY_COLOR}`,
            fontFamily: 'Impact, sans-serif',
          }}
        >
          {title}
        </h1>
      </div>

      {/* 2. Ranking List Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: gap * scale,
          width: '90%',
          marginTop: 200 * scale,
        }}
      >
        {livers.map((liver, index) => {
          const staggerFrames = 15;
          const liverEntrance = spring({
            frame: frame - index * staggerFrames - 20,
            fps,
            config: { damping: 14, stiffness: 200 },
          });

          const scaleIn = interpolate(liverEntrance, [0, 1], [0.6, 1]);
          const blurIn = interpolate(liverEntrance, [0, 1], [40, 0]);
          const rowOpacity = interpolate(liverEntrance, [0, 0.4], [0, 1]);

          return (
            <div
              key={liver.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(5, 0, 15, 0.7)',
                padding: `${is2Group ? 50 : 30}px ${40}px`,
                borderRadius: 15 * scale,
                transform: `scale(${scaleIn})`,
                filter: `blur(${blurIn}px)`,
                opacity: rowOpacity,
                border: `2px solid ${THEME_COLOR}`,
                boxShadow: `0 0 15px ${GLOW_COLOR}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background Digital Decor (Time themed) */}
              <div style={{
                position: 'absolute',
                top: 0, right: 0, bottom: 0, left: '60%',
                background: `linear-gradient(to right, transparent, ${THEME_COLOR}15)`,
                zIndex: 0,
              }} />

              {/* Rank Badge */}
              <div style={{
                width: 40 * scale,
                height: 380 * scale,
                fontSize: 80 * scale,
                fontWeight: '900',
                color: SECONDARY_COLOR,
                fontStyle: 'italic',
                textShadow: `0 0 10px ${SECONDARY_COLOR}`,
                fontFamily: 'Impact, sans-serif',
                zIndex: 2,
              }}>
                {liver.rank}
              </div>

              {/* Avatar Icon */}
              <div style={{
                width: iconSize,
                height: iconSize,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid #FFF`,
                boxShadow: `0 0 15px rgba(0,0,0,0.5)`,
                flexShrink: 0,
                zIndex: 2,
                backgroundColor: '#222',
              }}>
                <Img
                  src={
                    liver.saved_to
                      ? staticFile(liver.saved_to)
                      : liver.image_url.startsWith('http')
                        ? liver.image_url
                        : staticFile(liver.image_url)
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: getAvatarPosition(liver.rank),
                  }}
                />
              </div>

              {/* Nickname and "Time" Decor */}
              <div style={{
                marginLeft: 40 * scale,
                flex: 1,
                zIndex: 2,
              }}>
                <div style={{
                  fontSize: fontSize,
                  fontWeight: '800',
                  color: '#FFF',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  marginBottom: 10 * scale,
                }}>
                  {liver.nickname}
                </div>
                {/* Time Progress Bar Mockup */}
                <div style={{
                  height: 10 * scale,
                  width: '80%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${interpolate(random(liver.rank), [0, 1], [40, 95])}%`,
                    backgroundColor: THEME_COLOR,
                    boxShadow: `0 0 10px ${THEME_COLOR}`,
                  }} />
                </div>
                <div style={{
                  fontSize: 60 * scale,
                  color: THEME_COLOR,
                  marginTop: 5,
                  fontFamily: 'monospace',
                }}>
                  配信時間: {Math.floor(random(liver.rank) * 99999).toString(16).toUpperCase()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ImpactEffect beatPulse={pulse} color={THEME_COLOR} />
    </AbsoluteFill>
  );
};
