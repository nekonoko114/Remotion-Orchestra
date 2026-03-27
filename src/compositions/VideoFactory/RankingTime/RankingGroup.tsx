import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ImpactEffectTime as ImpactEffect } from '../ImpactEffectTime';
import { Typewriter } from '../../../components/effects/Typewriter';
import { useBeatValue } from '../utils/beat-sync';
import type { Liver } from '../types';

type Props = {
  title: string;
  livers: Liver[];
  isHighlight?: boolean;
  hideRank?: boolean;
};

const BPM = 194;

const JIGSAW_PATH = "M10 20 H30 Q40 10 50 20 H90 V40 Q100 50 90 60 V80 H50 Q40 90 30 80 H10 V60 Q0 50 10 40 Z";

const getAvatarPosition = (rank: number) => {
  if (rank === 9) return 'center 10%';
  if (rank === 8) return 'center 10%';
  if (rank === 7) return 'center 10%';
  if (rank === 5) return 'center 20%';
  return 'center';
};

export const RankingGroup: React.FC<Props> = ({
  title,
  livers,
  isHighlight,
  hideRank,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = width / 1080;
  const { pulse } = useBeatValue(BPM);

  const shakePower = interpolate(frame, [5, 15], [30 * scale, 0], {
    extrapolateRight: 'clamp',
  });
  const shakeX = (random(`shake-${frame}`) - 0.5) * shakePower;

  const glowOpacity = interpolate(frame, [5, 20], [0.8, 0], {
    extrapolateRight: 'clamp',
  });

  const STAGGER_DELAY = 30; 

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translateX(${shakeX}px) scale(${1 + pulse * 0.005})`,
      }}
    >
      {glowOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
            opacity: glowOpacity,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'absolute', top: 150 * scale, zIndex: 20 }}>
        <Typewriter
          text={title}
          speed={3}
          style={{
            fontSize: 120 * scale,
            fontWeight: 'bold',
            color: '#e0e0ff',
            textShadow: `0 0 ${10 * scale}px #b82bff, 0 0 ${20 * scale}px #e066ff, 0 0 ${40 * scale}px #b82bff`,
            fontFamily: 'sans-serif',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: (isHighlight ? 40 : 60) * scale,
          width: isHighlight ? '100%' : '90%',
          top: '50%',
          left: '50%',
          position: 'absolute',
          transform: 'translate(-50%, -35%)',
        }}
      >
        {livers.map((liver, index) => {
          const reverseIndex = livers.length - 1 - index;
          const liverSpr = spring({
            frame: frame - STAGGER_DELAY * reverseIndex - 10,
            fps,
            config: { damping: 12, stiffness: 200 },
          });

          const liverY = interpolate(liverSpr, [0, 1], [-800 * scale, 0]);
          const liverOpacity = interpolate(liverSpr, [0, 0.3], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const liverScale = interpolate(liverSpr, [0, 1], [1.8, 1]);

          const is2Group = livers.length === 2;
          const iconSize = (isHighlight ? 450 : is2Group ? 250 : 200) * scale;
          const fontSize = (isHighlight ? 100 : is2Group ? 80 : 60) * scale;
          const rankWidth = (is2Group ? 250 : 220) * scale;
          const wobble = Math.sin((frame + index * 10) / 15) * 15;

          return (
            <div
              key={liver.rank}
              style={{
                display: 'flex',
                flexDirection: isHighlight ? 'column' : 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                width: '100%',
                padding: isHighlight
                  ? `${80 * scale}px ${40 * scale}px`
                  : is2Group
                    ? `${100 * scale}px ${30 * scale}px`
                    : `${40 * scale}px ${30 * scale}px`,
                borderRadius: 20 * scale,
                transform: `translateY(${liverY}px) scale(${liverScale}) ${liver.rank <= 3 ? '' : `rotateY(${Math.sin(frame / 60) * 5}deg)`}`,
                opacity: liverOpacity,
                boxShadow: isHighlight
                  ? `0 0 ${50 * scale}px rgba(208, 0, 255, 0.3), inset 0 0 ${20 * scale}px rgba(255, 255, 255, 0.1)`
                  : `0 ${4 * scale}px ${15 * scale}px rgba(0,0,0,0.5)`,
                border: isHighlight
                  ? `${3 * scale}px solid rgba(208, 0, 255, 0.5)`
                  : `${1 * scale}px solid rgba(255,255,255,0.1)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <AbsoluteFill style={{ zIndex: -1, opacity: 0.9, clipPath: `path("${JIGSAW_PATH}")` }}>
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
                    transform: liver.rank === 5 ? 'rotate(-90deg)' : 'none',
                  }}
                />
              </AbsoluteFill>

              <AbsoluteFill
                style={{
                  zIndex: -1,
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  border: `${10 * scale}px solid rgba(208, 0, 255, 0.5)`,
                  filter: `blur(${4 * scale}px)`,
                  clipPath: `path("${JIGSAW_PATH}")`,
                }}
              />
              
              {/* Puzzle Tabs */}
              <div style={{
                position: 'absolute',
                top: -15 * scale, left: '30%',
                width: 30 * scale, height: 30 * scale, borderRadius: '50%',
                backgroundColor: 'rgba(208, 0, 255, 0.8)', border: `${2 * scale}px solid white`,
                boxShadow: `0 0 ${10 * scale}px rgba(208, 0, 255, 0.5)`, zIndex: 10
              }} />
              <div style={{
                position: 'absolute',
                bottom: -15 * scale, left: '30%',
                width: 30 * scale, height: 30 * scale, borderRadius: '50%',
                backgroundColor: '#000', border: `${2 * scale}px solid rgba(208, 0, 255, 0.5)`,
                boxShadow: `0 0 ${10 * scale}px rgba(208, 0, 255, 0.5)`, zIndex: 10
              }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'end',
                  width: '100%',
                  justifyContent: isHighlight ? 'center' : 'flex-start',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {!isHighlight && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: rankWidth,
                      gap: 10 * scale,
                      marginRight: 30 * scale,
                    }}
                  >
                    <div
                      className="metallic-silver"
                      style={{
                        fontSize: 70 * scale,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        transform: `rotateY(${wobble}deg)`,
                        transformStyle: 'preserve-3d',
                        fontFamily: 'Impact, sans-serif',
                        lineHeight: 1,
                      }}
                    >
                      {liver.rank}th
                    </div>

                    <div
                      style={{
                        width: iconSize,
                        height: iconSize,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `${4 * scale}px solid white`,
                        boxShadow: `0 0 ${20 * scale}px rgba(0,0,0,0.5)`,
                        flexShrink: 0,
                        backgroundColor: '#ccc',
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
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: getAvatarPosition(liver.rank),
                          border: `${4 * scale}px solid white`,
                          transform:
                            liver.rank === 5 ? 'rotate(-90deg)' : 'none',
                        }}
                      />
                    </div>
                  </div>
                )}

                {isHighlight && (
                  <>
                    {!hideRank && (
                      <div
                        className="metallic-purple"
                        style={{
                          fontSize: 120 * scale,
                          fontWeight: 'bold',
                          marginBottom: 30 * scale,
                          textAlign: 'center',
                          transform: `rotateY(${wobble}deg)`,
                          transformStyle: 'preserve-3d',
                          fontFamily: 'Impact, sans-serif',
                        }}
                      >
                        {liver.rank}位
                      </div>
                    )}

                    <div
                      style={{
                        width: iconSize,
                        height: iconSize,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginBottom: 30 * scale,
                        border: `${8 * scale}px solid white`,
                        boxShadow: `0 0 ${20 * scale}px rgba(0,0,0,0.5)`,
                        flexShrink: 0,
                        backgroundColor: '#ccc',
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
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: getAvatarPosition(liver.rank),
                          transform:
                            liver.rank === 5 ? 'rotate(-90deg)' : 'none',
                        }}
                      />
                    </div>
                  </>
                )}

                {!isHighlight && (
                  <div
                    className="metallic-silver"
                    style={{
                      fontSize: fontSize,
                      fontWeight: 'bold',
                      color: 'white',
                      flex: 1,
                      textShadow: `0 ${2 * scale}px ${4 * scale}px rgba(0,0,0,0.8)`,
                      fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
                      lineHeight: 1.1,
                      textAlign: 'center',
                    }}
                  >
                    {liver.nickname}
                  </div>
                )}
              </div>

              {isHighlight && (
                <div
                  className="metallic-gold"
                  style={{
                    fontSize: fontSize,
                    fontWeight: 'bold',
                    color: 'white',
                    width: '100%',
                    textAlign: 'center',
                    marginTop: 20 * scale,
                    textShadow: `0 ${4 * scale}px ${10 * scale}px rgba(0,0,0,0.8)`,
                    fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
                    lineHeight: 1.1,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {liver.nickname}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <ImpactEffect beatPulse={pulse} />
    </AbsoluteFill>
  );
};
