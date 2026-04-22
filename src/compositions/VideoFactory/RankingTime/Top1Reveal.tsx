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
} from 'remotion';
import { ConfettiTime } from './ConfettiTime';
import { CinematicBorder } from '../CinematicBorder';
import { MorphingTitle } from '../MorphingTitle';
import { TimeBackground } from '../TimeBackground';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';
import { loadFont } from '@remotion/google-fonts/Orbitron';

const { fontFamily } = loadFont();

const BPM = 160;

// Reverting to the original Clock theme
const CLOCK_BACK_VIDEO = staticFile('assets/pixabay/videos/pixabay_clock_time_minutes_old_gold_retro_antique_spiral_l_207864.mp4');

type Props = {
  rank: number;
  liver: Liver;
  title: string;
  themeColor?: string;
  glowColor?: string;
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title, themeColor = '#d000ff', glowColor = 'rgba(208, 0, 255, 0.6)' }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  const entrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const nameEntrance = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const rankScale = interpolate(entrance, [0, 1], [0.8, 1], { easing: Easing.out(Easing.back(1.5)) });
  const contentOpacity = interpolate(frame, [10, 20], [0, 1]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ zIndex: 110 }}>
        <ConfettiTime count={rank === 1 ? 250 : 150} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily,
          color: 'white',
          zIndex: 120,
        }}
      >
        {/* Title / Rank */}
        <div
          style={{
            transform: `translateY(${-300 * (1 - entrance)}px) scale(${rankScale * (1 + pulse * 0.02)})`,
            opacity: entrance,
            marginBottom: 40 * (height / 1080),
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
                    fontSize={220 * (height / 1080)}
                    style={{
                      fontFamily,
                      textShadow: `0 0 30px ${themeColor}, 0 0 60px ${themeColor}`,
                    }}
                  />
                  <MorphingTitle
                    text={suffix}
                    fontSize={100 * (height / 1080)}
                    style={{
                      fontFamily: 'serif',
                      textShadow: `0 0 15px ${themeColor}`,
                      marginLeft: 15,
                    }}
                  />
                </div>
              );
            }
            return (
              <MorphingTitle
                text={title}
                fontSize={220 * (height / 1080)}
                style={{
                  fontFamily,
                  textShadow: `0 0 30px ${themeColor}, 0 0 60px ${themeColor}`,
                }}
              />
            );
          })()}
        </div>

        {/* Liver Image */}
        <div
          style={{
            width: 500 * (height / 1080),
            height: 500 * (height / 1080),
            borderRadius: '50%',
            overflow: 'hidden',
            border: `10px solid white`,
            boxShadow: `0 0 80px ${themeColor}, 0 0 30px white`,
            transform: `scale(${entrance}) rotate(${rank === 1 ? frame * 0.2 : 0}deg)`,
            opacity: entrance,
            backgroundColor: '#111',
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

        {/* Liver Name */}
        <div
          style={{
            marginTop: 60 * (height / 1080),
            opacity: nameEntrance,
            transform: `translateY(${50 * (1 - nameEntrance)}px)`,
          }}
        >
          <h2
            style={{
              fontFamily,
              fontSize: (rank === 1 ? 80 : 60) * (height / 1080),
              margin: 0,
              textShadow: `0 0 20px black, 0 0 40px ${themeColor}`,
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '4px',
            }}
          >
            {liver.nickname}
          </h2>
        </div>
      </AbsoluteFill>

      <CinematicBorder color={themeColor} glowColor={glowColor} />
    </AbsoluteFill>
  );
};
