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
import { FlowSVG } from './FlowSVG';
import type { Liver } from '../types';


// Unity Colors (Unified Design)
const UNITY_THEME = '#f85718';
const UNITY_LIME  = '#FFD700';
const UNITY_GLOW  = 'rgba(248, 87, 24, 0.4)';

type Props = {
  title: string;
  livers: Liver[];
  showMusicShapes?: boolean;
  absoluteFrame?: number;
};

export const RankingGroup: React.FC<Props> = ({ title, livers, absoluteFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale  = interpolate(entrance, [0, 1], [0.95, 1]);
  const beatScale = 1;

  // デザイン統制：人数に応じたスケール定義
  const isCompact = livers.length >= 4; // 15-11位 (5名)
  const is3Group  = livers.length === 3;  // 10-8位 (3名)
  const is2Group  = livers.length === 2;  // 7-4位 (2名)

  // パラメータをグループごとに統一
  const gap          = isCompact ? 24  : 0; // Stack based on height
  const rankFontSize = isCompact ? 80  : 170;
  const nameFontSize = isCompact ? 40  : 80;
  const avatarSize   = 500; // Manually updated by user
  const verticalPad  = isCompact ? 16  : 0;
  const marginTop    = isCompact ? 120 : 200;

  const getEnergyOpacity = (f: number) => {
    // Return 1 during the specified backdrop particle range (545 - 1330)
    if (f >= 545 && f <= 1330) return 1;
    return 0;
  };

  const finalOpacity = getEnergyOpacity(absoluteFrame ?? 0);

  const renderBackgroundEffect = () => {
    if (absoluteFrame === undefined) return null;
    // Show flow particles between 545 and 1330 only
    if (absoluteFrame < 545 || absoluteFrame > 1330) return null;
    return <FlowSVG pulse={0} opacity={finalOpacity} />;
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
            top: 80,
            fontSize: isCompact ? 70 : 100,
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            fontWeight: '900',
            textAlign: 'center',
            margin: 0,
            color: UNITY_THEME,
            textShadow: `0 0 20px ${UNITY_THEME}, 0 0 40px ${UNITY_LIME}`,
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
              frame: frame - index * staggerFrames - 5,
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
                    border: `3px solid ${UNITY_THEME}`,
                    boxShadow: `0 0 20px ${UNITY_GLOW}, inset 0 0 15px rgba(0,0,0,0.8)`,
                    backgroundColor: 'rgba(0,15,0,0.85)',
                    transform: `translateX(${slideX}px) scale(${bounceScale})`,
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
                      width: 250,
                      height: 250,
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

                  {/* 順位 + 名前 (縦並び) */}
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
                      {liver.rank}位
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

            // ================================================================
            // 【大グループ：10~4位】
            return (
              <div
                key={liver.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  height: is2Group ? 800 : 580,
                  transform: `translateX(${slideX}px) scale(${bounceScale})`,
                  opacity: rowOpacity,
                  position: 'relative',
                  padding: '10px 40px',
                  gap: is2Group ? 40 : 20,
                }}
              >
                {/* 1. Rank Text (左) - 枠なし */}
                <div
                  style={{
                    minWidth: is2Group ? 100 : 150,
                    fontSize: rankFontSize,
                    fontWeight: 900,
                    color: UNITY_LIME,
                    textShadow: `0 0 30px ${UNITY_LIME}`,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {liver.rank}
                  <span style={{ fontSize: rankFontSize * 0.4, fontStyle: 'normal', scale: '0.8', marginLeft: 2 }}>
                    位
                  </span>
                </div>

                {/* 2. Middle Section (Avatar + Name Column) */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    gap: 16,
                  }}
                >
                  {/* Avatar Circle */}
                  <div
                    style={{
                      width: is2Group ? 550 : 400,
                      height: is2Group ? 550 : 400,
                      borderRadius: '50%',
                      border: `8px solid ${UNITY_THEME}`,
                      boxShadow: `0 0 40px ${UNITY_THEME}, inset 0 0 20px ${UNITY_THEME}`,
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      position: 'relative',
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

                  {/* Name Text (Relative) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* 装飾用ライン（スケッチの矢印に対応） */}
                    <div 
                      style={{ 
                        width: is2Group ? 400 : 300, 
                        height: 5, 
                        background: `linear-gradient(90deg, transparent 0%, ${UNITY_THEME} 50%, transparent 100%)`,
                        marginBottom: 12,
                        boxShadow: `0 0 15px ${UNITY_THEME}`,
                      }} 
                    />
                    <span
                      style={{
                        fontSize: nameFontSize,
                        fontWeight: 800,
                        color: '#FFF',
                        textShadow: `0 0 15px ${UNITY_THEME}, 3px 3px 10px #000`,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
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