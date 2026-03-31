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
import type { Liver } from '../types';
import { GlitchEffect } from '../../../components/effects/GlitchEffect';

type Props = {
  title: string;
  livers: Liver[];
  useGlitch?: boolean;
  glitchIntensity?: number;
};

const getBackgroundPosition = (rank: number) => {
  if (rank === 10) return 'center 20%';
  if (rank === 8) return 'center 25%';
  if (rank === 7) return 'center 20%';
  if (rank === 6) return 'center 50%';
  if (rank === 5) return '0% 50%';
  if (rank === 4) return 'center 15%';
  return 'center';
};

const getBackgroundTransform = (rank: number) => {
  if (rank === 5) return 'scale(1.2) translateX(10%)';
  return 'none';
};

export const RankingGroup: React.FC<Props> = ({
  title,
  livers,
  useGlitch = true,
  glitchIntensity = 10,
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

  const is3Group = livers.length === 3;
  const is2Group = livers.length === 2;
  const gap = is2Group ? 160 : is3Group ? 100 : 80;
  const rankFontSize = is2Group ? 140 : is3Group ? 110 : 90;
  const rankWidth = is2Group ? 300 : is3Group ? 250 : 200;
  const nameFontSize = is2Group ? 90 : 70;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <h1
          className="metallic-gold"
          style={{
            position: 'absolute',
            top: 100, // Slightly higher to give more room for the list
            fontSize: 120,
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            fontWeight: '900',
            textAlign: 'center',
            margin: 0,
            textShadow: '0 5px 15px rgba(255,0,0,0.8)',
          }}
        >
          {title}
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
            width: '94%', // Slightly wider
            marginTop: 200, // Move up a bit to use more space
          }}
        >
          {livers.map((liver, index) => {
            const liverEntrance = spring({
              frame: frame - index * 5 - 10,
              fps,
              config: { damping: 12, stiffness: 120 },
            });

            return (
              <div
                key={liver.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center', // Center content vertically
                  gap: is2Group ? 60 : 40,
                  borderRadius: 40,
                  border: '4px solid #8B0000',
                  boxShadow: '0 0 20px 10px rgba(255, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  transform: `translateY(${interpolate(liverEntrance, [0, 1], [-1000, 0])}px)`,
                  opacity: interpolate(liverEntrance, [0, 0.4], [0, 1]),
                  position: 'relative',
                  overflow: 'hidden',
                  padding: is2Group ? '100px 50px' : is3Group ? '70px 40px' : '50px 40px', // Increased height
                }}
              >
                <AbsoluteFill style={{ opacity: 0.9 }}>
                  {useGlitch ? (
                    <GlitchEffect intensity={glitchIntensity}>
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
                          objectPosition: getBackgroundPosition(liver.rank),
                          transform: getBackgroundTransform(liver.rank),
                        }}
                      />
                    </GlitchEffect>
                  ) : (
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
                        objectPosition: getBackgroundPosition(liver.rank),
                        transform: getBackgroundTransform(liver.rank),
                      }}
                    />
                  )}
                </AbsoluteFill>

                <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center', // Center vertically
                    width: rankWidth,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: rankFontSize * 1.5, // Make rank larger
                      fontWeight: 900,
                      color: '#FFD700',
                      textAlign: 'center',
                      lineHeight: 1,
                      textShadow: '0 2px 10px rgba(255,0,0,0.8)',
                    }}
                  >
                    {liver.rank}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: liver.nickname.length > 8 ? nameFontSize * 0.8 : nameFontSize,
                    color: 'white',
                    fontWeight: 'bold',
                    flex: 1,
                    marginLeft: 20,
                    marginRight: 60,
                    position: 'relative',
                    zIndex: 1,
                    lineHeight: 1.1,
                    textAlign: 'center',
                    textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                  }}
                >
                  {liver.nickname}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
