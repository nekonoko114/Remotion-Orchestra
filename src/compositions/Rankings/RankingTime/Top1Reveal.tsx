import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { ConfettiTime } from './ConfettiTime';
import { CinematicBorder } from '../../../components/UI/CinematicBorder';
import { MorphingTitle } from '../../../components/effects/MorphingTitle';
import { useBeatValue } from '../../../utils/beat-sync';
import type { Liver } from '../../../types/ranking-types';
// ローカルフォント定義
const cinzelFont = "'Cinzel', serif";
const shipporiFont = "'Shippori Mincho', serif";
const bellefairFont = "'Bellefair', serif"; // 必要に応じて維持

import { GalaxyClock } from './GalaxyClock';

const BPM = 160;

export const Top1Reveal: React.FC<{ rank: number; liver: Liver; title: string; themeColor?: string; glowColor?: string }> = ({ rank, liver, title, themeColor = '#d000ff', glowColor = 'rgba(208, 0, 255, 0.6)' }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  // 時計の登場
  const entrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // ライバーのリビール（針が着地するフレーム85以降に開始）
  const revealEntrance = spring({
    frame: frame - 85,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // 名前のリビール（さらに少し遅延）
  const nameEntrance = spring({
    frame: frame - 110,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const stardustScale = 1;
  const stardustOpacity = interpolate(frame - 85, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <GalaxyClock rank={rank} themeColor={themeColor} entrance={entrance} variant="enhanced" />

      <AbsoluteFill style={{ zIndex: 110 }}>
        {frame > 85 && <ConfettiTime count={rank === 1 ? 250 : 150} />}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          fontFamily: cinzelFont,
          color: 'white',
          zIndex: 120,
        }}
      >
        {/* Title / Rank - Re-centered at the Top with Premium Typo */}
        <div
          style={{
            position: 'absolute',
            top: 80 * (height / 1080),
            left: '50%',
            transform: `translate(-50%, ${20 * (1 - revealEntrance)}px)`,
            opacity: revealEntrance,
            textAlign: 'center',
            width: '100%',
          }}
        >
          {(() => {
            const match = title.match(/^(\d+)(.*)$/);
            if (match) {
              const [, num, suffix] = match;
              return (
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  <MorphingTitle
                    text={num}
                    fontSize={120 * (height / 1080)}
                    style={{
                      fontFamily: cinzelFont,
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      textShadow: `0 0 20px ${themeColor}, 0 0 40px ${themeColor}, 0 0 80px ${themeColor}aa`,
                      display: 'inline-flex',
                    }}
                  />
                  <MorphingTitle
                    text={suffix}
                    fontSize={90 * (height / 1080)}
                    style={{
                      fontFamily: bellefairFont,
                      textShadow: `0 0 15px ${themeColor}, 0 0 30px white`,
                      marginLeft: 10,
                      fontStyle: 'italic',
                      display: 'inline-flex',
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
                  fontFamily: cinzelFont,
                  fontWeight: 900,
                  textShadow: `0 0 20px ${themeColor}, 0 0 40px ${themeColor}`,
                }}
              />
            );
          })()}
        </div>

        {/* Global Wrapper for Centered Liver Content */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
           {/* Liver Image - Fixed at Absolute Center */}
          <div
            style={{
              width: 400 * (height / 1080),
              height: 400 * (height / 1080),
              borderRadius: '50%',
              overflow: 'hidden',
              border: `10px solid ${themeColor}`,
              boxShadow: `0 0 120px ${themeColor}, 0 0 60px white`,
              transform: `scale(${revealEntrance * stardustScale})`,
              opacity: revealEntrance * stardustOpacity,
              backgroundColor: '#000510',
              position: 'relative',
            }}
          >
            <AbsoluteFill style={{
              background: `radial-gradient(circle, ${themeColor}33 0%, transparent 70%)`,
              transform: `scale(${1 + pulse * 0.1})`,
              pointerEvents: 'none',
            }} />
            
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

          {/* Liver Name - Offset from Center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              marginTop: 280 * (height / 1080),
              opacity: nameEntrance,
              transform: `translateY(${30 * (1 - nameEntrance)}px)`,
            }}
          >
            <h2
              style={{
                fontFamily: shipporiFont,
                fontSize: (rank === 1 ? 80 : 60) * (height / 1080),
                margin: 0,
                textShadow: `0 2px 20px #000, 0 0 30px ${themeColor}`,
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {liver.nickname}
            </h2>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <CinematicBorder color={themeColor} glowColor={glowColor} />
    </AbsoluteFill>
  );
};
