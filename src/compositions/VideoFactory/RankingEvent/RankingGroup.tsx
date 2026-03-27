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
import { useBeatValue } from '../utils/beat-sync';
import { EnergySVG } from './EnergySVG';
import { CircuitSVG } from './CircuitSVG';
import { FlowSVG } from './FlowSVG';
import type { Liver } from '../types';

const getBackgroundTransform = (rank: number) => {
  if (rank === 5) return 'scale(1.2) translateX(10%)';
  return 'none';
};

const BPM = 194;

// Refined Unity Colors
const UNITY_GREEN = '#00FF7F'; // Emerald
const UNITY_LIME = '#BFFF00';  // Electric Lime
const UNITY_GLOW = 'rgba(0, 255, 127, 0.6)';

// Slash Mosaic Clip Path
const SLASH_CLIP = 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)';

type Props = {
  title: string;
  livers: Liver[];
  showMusicShapes?: boolean;
  absoluteFrame?: number;
};

const getAvatarPosition = (rank: number) => {
  if (rank === 10) return 'center 20%';
  if (rank === 8) return 'center 25%';
  if (rank === 7) return 'center 20%';
  if (rank === 6) return 'center 50%';
  if (rank === 5) return 'center 50%';
  if (rank === 4) return 'center 15%';
  return 'center';
};

const getBackgroundPosition = (rank: number) => {
  if (rank === 5) return '0% 50%';
  return getAvatarPosition(rank);
};

export const RankingGroup: React.FC<Props> = ({ title, livers, showMusicShapes, absoluteFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  const beatScale = 1 + pulse * 0.02;

  const is3Group = livers.length === 3;
  const is2Group = livers.length === 2;
  const gap = is2Group ? 120 : is3Group ? 80 : 60;
  const rankFontSize = is2Group ? 120 : is3Group ? 90 : 70;
  const nameFontSize = is2Group ? 70 : is3Group ? 40 : 32;

  // Multiple Energy Zones for different segments
  const energyOpacity = interpolate(
    absoluteFrame || 0,
    [180, 192, 400, 426, 555, 565, 744, 756, 1026, 1050],
    [0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const renderBackgroundSVG = () => {
    if (absoluteFrame === undefined) return null;
    if (absoluteFrame < 555) return <EnergySVG pulse={pulse} opacity={energyOpacity} />;
    if (absoluteFrame < 756) return <CircuitSVG pulse={pulse} opacity={energyOpacity} />;
    return <FlowSVG pulse={pulse} opacity={energyOpacity} />;
  };


  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#001a00' }}>
        <Img
          src={staticFile(
            title.includes('10')
              ? 'assets/backgrounds/dark_temple_bg_top10.png'
              : 'assets/backgrounds/dark_temple_bg_top6.png',
          )}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
            filter: 'hue-rotate(100deg) brightness(1.2) contrast(1.3)',
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle, ${UNITY_GLOW} 0%, rgba(0,20,0,0.8) 100%)`,
            pointerEvents: 'none',
          }}
        />
        {energyOpacity > 0 && renderBackgroundSVG()}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale * beatScale})`, // POP pulse on scale
        }}
      >
        <h1
          style={{
            position: 'absolute',
            top: 120,
            fontSize: 120,
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            fontWeight: '900',
            textAlign: 'center',
            margin: 0,
            color: UNITY_GREEN,
            textShadow: `0 0 20px ${UNITY_GREEN}, 0 0 40px ${UNITY_LIME}`,
          }}
        >
          {title}
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
            width: '90%',
            marginTop: 250,
          }}
        >
          {livers.map((liver: Liver, index: number) => {
            const staggerFrames = 18; // 1 beat at 194 BPM
            const liverEntrance = spring({
              frame: frame - index * staggerFrames - 40,
              fps,
              config: { damping: 10, stiffness: 350 }, // Maximum Speed
            });

            const bounceScale = interpolate(liverEntrance, [0, 1], [0.6, 1]);

            return (
              <div
                key={liver.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: is2Group ? 60 : 40,
                  borderRadius: 0,
                  clipPath: SLASH_CLIP,
                  border: `4px solid ${UNITY_GREEN}`,
                  boxShadow: `0 0 30px ${UNITY_GLOW}, inset 0 0 20px rgba(0,0,0,0.8)`,
                  backgroundColor: 'rgba(0,30,0,0.4)',
                  transform: `translateX(${interpolate(liverEntrance, [0, 1], [-1000, 0])}px) scale(${bounceScale * (1 + pulse * 0.03)})`,
                  opacity: interpolate(liverEntrance, [0, 0.2], [0, 1]),
                  position: 'relative',
                  overflow: 'hidden',
                  padding: is2Group ? '40px 60px' : is3Group ? '30px 50px' : '20px 40px',
                }}
              >
                <AbsoluteFill style={{ opacity: 0.9, clipPath: SLASH_CLIP }}>
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
                </AbsoluteFill>

                <AbsoluteFill style={{ backgroundColor: 'rgba(0,60,30,0.2)', clipPath: SLASH_CLIP }} />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    gap: 30,
                  }}
                >
                  {/* Unity Slash Decor */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 10,
                    width: 10, height: '100%',
                    backgroundColor: UNITY_LIME,
                    boxShadow: `0 0 15px ${UNITY_LIME}`,
                    opacity: 0.8,
                    transform: 'skewX(-15deg)'
                  }} />

                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: is2Group ? 40 : 20,
                    }}
                  >
                    <span
                      style={{
                        fontSize: rankFontSize,
                        fontWeight: '900',
                        color: UNITY_LIME,
                        fontStyle: 'italic',
                        textShadow: `0 0 15px ${UNITY_LIME}`,
                        minWidth: is2Group ? 160 : 120,
                      }}
                    >
                      {liver.rank}
                    </span>
                    <span
                      style={{
                        fontSize: nameFontSize,
                        fontWeight: '800',
                        color: '#FFF',
                        textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
                      }}
                    >
                      {liver.nickname}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
