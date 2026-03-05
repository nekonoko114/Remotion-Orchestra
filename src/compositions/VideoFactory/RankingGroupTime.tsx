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
import { ImpactEffectTime as ImpactEffect } from './ImpactEffectTime';
import { Typewriter } from '../../components/effects/Typewriter';
import { useBeatValue } from './utils/beat-sync';
import type { Liver } from './types';

type Props = {
  title: string;
  livers: Liver[];
  isHighlight?: boolean; // 上位3名の特別演出用
  hideRank?: boolean; // ランクバッジを非表示にする（TopRankReveal用）
};

const BPM = 160;

const getAvatarPosition = (rank: number) => {
  // Stream Time Ranking specific adjustments
  if (rank === 9) return 'center 10%'; // 限界突破まみ (より上に)
  if (rank === 8) return 'center 10%'; // yukiんこ (より上に)
  if (rank === 7) return 'center 10%'; // 小悪魔 (より上に)
  if (rank === 5) return 'center 20%'; // ジンヤ (顔を縦に調整)
  return 'center';
};

export const RankingGroupTime: React.FC<Props> = ({
  title,
  livers,
  isHighlight,
  hideRank,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = width / 1080;
  const { pulse } = useBeatValue(BPM);

  // Impact Shake: Just at the moment of landing (around frame 5-15)
  const shakePower = interpolate(frame, [5, 15], [30 * scale, 0], {
    extrapolateRight: 'clamp',
  });
  const shakeX = (random(`shake-${frame}`) - 0.5) * shakePower;

  // Glow Burst intensity
  const glowOpacity = interpolate(frame, [5, 20], [0.8, 0], {
    extrapolateRight: 'clamp',
  });

  // Calculate per-liver staggered animation
  const STAGGER_DELAY = 18; // 0.3s at 60fps

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translateX(${shakeX}px) scale(${1 + pulse * 0.005})`,
      }}
    >
      {/* Impact Glow Burst Overlay */}
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
      {/* タイトル (タイピング演出・魔法ネオン) */}
      <div
        style={{
          position: 'absolute',
          top: 150 * scale,
          zIndex: 20,
        }}
      >
        <Typewriter
          text={title}
          speed={3}
          style={{
            fontSize: (isHighlight ? 120 : 180) * scale,
            fontWeight: 'bold',
            color: '#e0e0ff',
            textShadow: `0 0 ${10 * scale}px #b82bff, 0 0 ${20 * scale}px #e066ff, 0 0 ${40 * scale}px #b82bff`,
            fontFamily: 'sans-serif',
          }}
        />
      </div>

      {/* ライバーリストを表示するエリア */}
      <div
        style={{
          display: 'flex',
          flexDirection: isHighlight ? 'column' : 'column', // Highlight is basically single item anyway
          gap: (isHighlight ? 40 : 60) * scale, // Increase gap for highlight
          width: isHighlight ? '100%' : '90%',
          top: '50%',
          left: '50%', // Correctly center horizontally
          position: 'absolute',
          transform: 'translate(-50%, -35%)', // Shift back by 50% of width and 35% of height
        }}
      >
        {livers.map((liver, index) => {
          // Staggered Spring Logic: Reverse order (10 -> 7)
          // Delay is based on reverse index
          // Staggered Spring Logic: Reverse order (10 -> 7)
          const reverseIndex = livers.length - 1 - index;
          const liverSpr = spring({
            frame: frame - STAGGER_DELAY * reverseIndex - 10, // Start after title slam
            fps,
            config: { damping: 10, stiffness: 150 }, // Bouncier and faster
          });

          // Deep drop from top (-800px), faster fade-in, slamming down from 2x scale
          const liverY = interpolate(liverSpr, [0, 1], [-800 * scale, 0]);
          const liverOpacity = interpolate(liverSpr, [0, 0.3], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const liverScale = interpolate(liverSpr, [0, 1], [1.8, 1]);

          const is2Group = livers.length === 2;
          // Highlight Sizing
          const iconSize = (isHighlight ? 450 : is2Group ? 250 : 200) * scale;
          const fontSize = (isHighlight ? 100 : is2Group ? 80 : 60) * scale;
          const rankWidth = (is2Group ? 250 : 220) * scale;

          // ゆらゆら揺れるアニメーション (Y軸回転)
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
                // Entrance (Dropdown) + Wobble Animation
                transform: `translateY(${liverY}px) scale(${liverScale}) ${liver.rank <= 3 ? '' : `rotateY(${Math.sin(frame / 60) * 5}deg)`}`,
                opacity: liverOpacity,
                boxShadow: isHighlight
                  ? `0 0 ${50 * scale}px rgba(208, 0, 255, 0.3), inset 0 0 ${20 * scale}px rgba(255, 255, 255, 0.1)`
                  : `0 ${4 * scale}px ${15 * scale}px rgba(0,0,0,0.5)`,
                border: isHighlight
                  ? `${3 * scale}px solid rgba(208, 0, 255, 0.5)`
                  : `${1 * scale}px solid rgba(255,255,255,0.1)`,
                position: 'relative', // Needed for absolute background
                overflow: 'hidden', // Clip the blur
              }}
            >
              {/* Blurred Background */}
              <AbsoluteFill style={{ zIndex: -1, opacity: 0.9 }}>
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

              {/* Dark overlay for readability */}
              <AbsoluteFill
                style={{
                  zIndex: -1,
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  border: `${10 * scale}px solid rgba(208, 0, 255, 0.5)`,
                  filter: `blur(${4 * scale}px)`,
                }}
              />
              {/* Row content */}
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
                {/* Vertical Stack for Rank and Icon */}
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
                    {/* Rank Number */}
                    <div
                      className="metallic-silver" // Always silver for 10-4
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

                    {/* Icon image */}
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

                {/* Original Highlight Logic (Special Handling for top 3) */}
                {isHighlight && (
                  <>
                    {/* 順位バッジ */}
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

                    {/* アイコン画像 */}
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

                {/* Name Area */}
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

              {/* Highlight Name is BELOW icon */}
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

              {/* ポイント (Optionally hidden) */}
              {/* 
            <div style={{
              fontSize: 40,
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'Roboto Mono, monospace' // 数字等幅
            }}>
              {liver.points.toLocaleString()} pt
            </div>
             */}
            </div>
          );
        })}
      </div>
      <ImpactEffect beatPulse={pulse} />
    </AbsoluteFill>
  );
};
