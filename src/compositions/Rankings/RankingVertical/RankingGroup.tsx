import type React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { Liver } from '../../../types/ranking-types';

type Props = {
  title: string;
  livers: Liver[];
  useGlitch?: boolean;
  glitchIntensity?: number;
};

// Unity Colors (Unified Design)
const UNITY_THEME = '#f85718';
const UNITY_LIME  = '#FFD700';
const UNITY_GLOW  = 'rgba(248, 87, 24, 0.4)';

const getBackgroundPosition = (rank: number) => {
  if (rank === 10) return 'center 20%';
  if (rank === 8) return 'center 25%';
  if (rank === 7) return 'center 20%';
  if (rank === 6) return 'center 50%';
  if (rank === 5) return '0% 50%';
  if (rank === 4) return 'center 15%';
  return 'center';
};

export const RankingGroup: React.FC<Props> = ({
  title,
  livers,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  const isCompact = livers.length >= 4; // 15-11位 (5名)
  const is3Group = livers.length === 3;
  const is2Group = livers.length === 2;
  const gap = isCompact ? 18 : is2Group ? 80 : is3Group ? 30 : 80;
  const rankFontSize = isCompact ? 90 : is2Group ? 160 : 130;
  const nameFontSize = isCompact ? 48 : is2Group ? 85 : 75;
  const verticalPad = isCompact ? 20 : 0;
  const marginTop = isCompact ? 140 : 200;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            position: 'absolute',
            top: 100, 
            fontSize: isCompact ? 80 : 120,
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            fontWeight: '900',
            textAlign: 'center',
            margin: 0,
            color: UNITY_THEME,
            textShadow: `0 0 10px ${UNITY_THEME}, 0 0 30px ${UNITY_THEME}, 0 0 60px ${UNITY_LIME}`,
          }}
        >
          {title}
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
            width: isCompact ? '90%' : '94%',
            marginTop,
          }}
        >
          {livers.map((liver, index) => {
            const staggerFrames = isCompact ? 12 : 18;
            const liverEntrance = spring({
              frame: frame - (livers.length - 1 - index) * staggerFrames - 10,
              fps,
              config: { damping: 12, stiffness: 120 },
            });

            const slideY = interpolate(liverEntrance, [0, 1], [-1000, 0]);
            const rowOpacity = interpolate(liverEntrance, [0, 0.4], [0, 1]);
            const bounceScale = interpolate(liverEntrance, [0, 1], [0.8, 1]);

            const avatarSrc = liver.saved_to
              ? staticFile(liver.saved_to)
              : liver.image_url.startsWith('http')
                ? liver.image_url
                : staticFile(liver.image_url);

            if (isCompact) {
              return (
                <div
                  key={liver.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 30,
                    borderRadius: 12,
                    border: `2px solid ${UNITY_THEME}`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.5)`,
                    backgroundColor: 'rgba(0,10,2,0.6)',
                    transform: `translateY(${slideY}px) scale(${bounceScale})`,
                    opacity: rowOpacity,
                    padding: `${verticalPad}px 30px`,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 9999,
                      border: `3px solid ${UNITY_LIME}`,
                      boxShadow: `0 0 15px rgba(255, 215, 0, 0.4)`,
                      flexShrink: 0,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <Img
                      src={avatarSrc}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                      }}
                    />
                  </div>

                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      alignItems: 'flex-start', 
                      gap: 4, 
                      flex: 1, 
                      whiteSpace: 'nowrap' 
                    }}
                  >
                    <span
                      style={{
                        fontSize: rankFontSize,
                        fontWeight: '900',
                        color: UNITY_LIME,
                        textShadow: `0 0 10px ${UNITY_LIME}`,
                        lineHeight: 1.1,
                      }}
                    >
                      {liver.rank}th
                    </span>
                    <span
                      style={{
                        fontSize: nameFontSize,
                        fontWeight: '800',
                        color: '#FFF',
                        textShadow: `0 0 10px rgba(0,0,0,0.8)`,
                        lineHeight: 1.2,
                      }}
                    >
                      {liver.nickname}
                    </span>
                  </div>
                </div>
              );
            }

            // is2Group / is3Group Layout (Image format)
            return (
              <div
                key={liver.rank}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transform: `translateY(${slideY}px) scale(${bounceScale})`,
                  opacity: rowOpacity,
                  position: 'relative',
                  width: '100%',
                  gap: 15,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', justifyContent: 'center' }}>
                    {/* Rank Text (Left) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '0px',
                        width: '24%',
                        fontSize: rankFontSize,
                        fontWeight: 900,
                        color: UNITY_LIME,
                        textShadow: `0 0 30px ${UNITY_LIME}, 0 0 10px #000`,
                        fontStyle: 'italic',
                        textAlign: 'right',
                        paddingRight: 40,
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {liver.rank}
                      <span style={{ fontSize: rankFontSize * 0.4, fontStyle: 'normal', marginLeft: 2 }}>
                        th
                      </span>
                    </div>

                    {/* Avatar Circle (Center) */}
                    <div
                        style={{
                          width: is2Group ? 550 : 380,
                          height: is2Group ? 550 : 380,
                          borderRadius: '50%',
                          border: `8px solid ${UNITY_THEME}`,
                          boxShadow: `0 0 50px ${UNITY_THEME}, inset 0 0 25px ${UNITY_THEME}`,
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          position: 'relative',
                        }}
                    >
                        <Img
                          src={avatarSrc}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: getBackgroundPosition(liver.rank),
                          }}
                        />
                    </div>
                </div>

                {/* Nickname (Below) */}
                <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                >
                    <span
                      style={{
                        fontSize: nameFontSize,
                        fontWeight: 800,
                        color: '#FFF',
                        textShadow: `0 0 20px ${UNITY_THEME}, 3px 3px 10px #000`,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}
                    >
                      {liver.nickname}
                    </span>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
