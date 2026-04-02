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

const BPM = 194;

// Unity Colors (Unified Design)
const UNITY_GREEN = '#00FF7F';
const UNITY_LIME  = '#BFFF00';
const UNITY_GLOW  = 'rgba(0, 255, 127, 0.2)'; // Reduced for clarity (0.6 -> 0.2)

type Props = {
  title: string;
  livers: Liver[];
  showMusicShapes?: boolean;
  absoluteFrame?: number;
};

export const RankingGroup: React.FC<Props> = ({ title, livers, absoluteFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale  = interpolate(entrance, [0, 1], [0.95, 1]);
  const beatScale = 1 + pulse * 0.005;

  // デザイン統制：人数に応じたスケール定義
  const isCompact = livers.length >= 4; // 15-11位 (5名)
  const is3Group  = livers.length === 3;  // 10-8位 (3名)
  const is2Group  = livers.length === 2;  // 7-4位 (2名)

  // パラメータをグループごとに統一
  const gap          = isCompact ? 24  : is3Group ? 50  : 80;
  const rankFontSize = isCompact ? 80  : is3Group ? 120 : 160;
  const nameFontSize = isCompact ? 40  : is3Group ? 60  : 75;
  const avatarSize   = isCompact ? 220 : is3Group ? 160 : 180;
  const verticalPad  = isCompact ? 16  : is3Group ? 150  : 200;
  const marginTop    = isCompact ? 120 : is3Group ? 180 : 200;

  const getEnergyOpacity = (f: number) => {
    if (f >= 150 && f <= 420) return interpolate(f, [150, 160, 410, 420], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    if (f >= 420 && f <= 565) return interpolate(f, [420, 426, 555, 565], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    if (f >= 474 && f <= 744) return 1;
    if (f >= 756 && f <= 1026) return 1;
    return 0;
  };

  const finalOpacity = getEnergyOpacity(absoluteFrame ?? 0);

  const renderBackgroundEffect = () => {
    if (absoluteFrame === undefined) return null;
    if (absoluteFrame < 555) return <EnergySVG pulse={pulse} opacity={finalOpacity} />;
    if (absoluteFrame < 756) return <CircuitSVG pulse={pulse} opacity={finalOpacity} />;
    return <FlowSVG pulse={pulse} opacity={finalOpacity} />;
  };

  const getAvatarSrc = (liver: Liver) => {
    if (liver.saved_to) return staticFile(liver.saved_to);
    if (liver.image_url.startsWith('http')) return liver.image_url;
    return staticFile(liver.image_url);
  };

  return (
    <AbsoluteFill>
      {/* ===== 背景 (CLEAN DESIGN) ===== */}
      <AbsoluteFill style={{ backgroundColor: '#011201' }}>
        <Img
          src={staticFile(
            isCompact || is3Group
              ? 'assets/backgrounds/dark_temple_bg_top10.png'
              : 'assets/backgrounds/dark_temple_bg_top6.png',
          )}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.4,
            filter: 'brightness(1.1) contrast(1.2)', 
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle, ${UNITY_GLOW} 0%, rgba(0,10,0,0.9) 100%)`,
            pointerEvents: 'none',
          }}
        />
        {finalOpacity > 0 && renderBackgroundEffect()}
      </AbsoluteFill>

      {/* ===== コンテンツ ===== */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale * beatScale})`,
        }}
      >
        {/* タイトル */}
        <h1
          style={{
            position: 'absolute',
            top: 40,
            fontSize: isCompact ? 70 : 100,
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

        {/* リスト */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
            width: '90%',
            marginTop,
          }}
        >
          {livers.map((liver: Liver, index: number) => {
            const staggerFrames = isCompact ? 12 : 18;
            const liverEntrance = spring({
              frame: frame - index * staggerFrames - 30,
              fps,
              config: { damping: 10, stiffness: 350 },
            });

            const bounceScale = interpolate(liverEntrance, [0, 1], [0.6, 1]);
            const slideX      = interpolate(liverEntrance, [0, 1], [-1000, 0]);
            const rowOpacity  = interpolate(liverEntrance, [0, 0.2], [0, 1]);

            if (isCompact) {
              // ================================================================
              // 【小グループ：15~11位】 コンパクトレイアウト (RECTANGLE)
              // ================================================================
              return (
                <div
                  key={liver.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    borderRadius: 12,
                    border: `3px solid ${UNITY_GREEN}`,
                    boxShadow: `0 0 20px ${UNITY_GLOW}, inset 0 0 15px rgba(0,0,0,0.8)`,
                    backgroundColor: 'rgba(0,15,0,0.85)',
                    transform: `translateX(${slideX}px) scale(${bounceScale * (1 + pulse * 0.02)})`,
                    opacity: rowOpacity,
                    padding: `${verticalPad}px 30px`,
                    position: 'relative',
                  }}
                >
                  {/* アイコン枠 */}
                  <div
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      borderRadius: 10,
                      border: `2px solid ${UNITY_LIME}`,
                      boxShadow: `0 0 10px ${UNITY_LIME}, inset 0 0 4px rgba(0,0,0,0.5)`,
                      flexShrink: 0,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(0,30,0,0.4)',
                    }}
                  >
                    <Img
                      src={getAvatarSrc(liver)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                      }}
                    />
                  </div>

                  {/* 順位 + 名前 */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flex: 1, whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontSize: rankFontSize,
                        fontWeight: '900',
                        color: UNITY_LIME,
                        textShadow: `0 0 10px ${UNITY_LIME}`,
                        minWidth: 70,
                        lineHeight: 1,
                      }}
                    >
                      {liver.rank}
                    </span>
                    <span
                      style={{
                        fontSize: nameFontSize,
                        fontWeight: '800',
                        color: '#FFF',
                        textShadow: '3px 3px 10px rgba(0,0,0,1)',
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {liver.nickname}
                    </span>
                  </div>
                </div>
              );
            }

            // ================================================================
            // 【大グループ：10~4位】 レクタングルレイアウト (RECTANGLE)
            // ================================================================
            return (
              <div
                key={liver.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 16,
                  border: `4px solid ${UNITY_GREEN}`,
                  boxShadow: `0 0 25px ${UNITY_GLOW}, inset 0 0 20px rgba(0,0,0,0.8)`,
                  backgroundColor: 'rgba(0,20,0,0.5)',
                  transform: `translateX(${slideX}px) scale(${bounceScale * (1 + pulse * 0.03)})`,
                  opacity: rowOpacity,
                  position: 'relative',
                  overflow: 'hidden',
                  padding: `${verticalPad}px 40px`,
                }}
              >
                {/* 背景アイコン */}
                <AbsoluteFill style={{ opacity: 0.8 }}>
                  <Img
                    src={getAvatarSrc(liver)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      filter: 'blur(2px)',
                    }}
                  />
                </AbsoluteFill>

                <AbsoluteFill style={{ backgroundColor: 'rgba(0,30,15,0.2)' }} />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    paddingBottom: 20,
                  }}
                >

                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: is2Group ? 40 : 25,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: rankFontSize,
                        fontWeight: '900',
                        color: UNITY_LIME,
                        textShadow: `0 0 15px ${UNITY_LIME}`,
                        minWidth: is2Group ? 180 : 140,
                        flexShrink: 0,
                      }}
                    >
                      {liver.rank}
                    </span>
                    <span
                      style={{
                        fontSize: nameFontSize,
                        fontWeight: '800',
                        color: '#FFF',
                        textShadow: '4px 4px 15px rgba(0,0,0,1)',
                        whiteSpace: 'nowrap',
                        flexShrink: 1,
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
