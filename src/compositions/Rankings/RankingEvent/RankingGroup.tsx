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
import { UNITY_THEME } from './theme';

const UNITY_THEME_COLOR = UNITY_THEME.colors.neonRed;
const UNITY_LIME  = UNITY_THEME.colors.neonBlue;

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
    frame: Math.max(0, frame),
    fps,
    config: { damping: 40, stiffness: 60 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale  = interpolate(entrance, [0, 1], [0.98, 1]);
  // デザイン統制：人数に応じたスケール定義
  const isCompact = livers.length >= 4; // 15-6位 (5名)
  const is2Group  = livers.length === 2;  // 7-4位 (2名)
  // パラメータをグループごとに統一
  const gap          = isCompact ? 18  : 0; // Stack based on height
  const rankFontSize = isCompact ? 90  : 170;
  const nameFontSize = isCompact ? 48  : 80;
  const verticalPad  = isCompact ? 20  : 0;
  const marginTop    = isCompact ? 140 : 200;

  const getAvatarSrc = (liver: Liver) => {
    if (liver.saved_to) return staticFile(liver.saved_to);
    if (liver.image_url.startsWith('http')) return liver.image_url;
    return staticFile(liver.image_url);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {/* 共通の背景レイヤーを使用するため、個別背景コードを削除 */}

      {/* ===== コンテンツ ===== */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* タイトル */}
        <h1
          style={{
            position: 'absolute',
            top: 100,
            fontSize: isCompact ? 120 : 130,
            fontFamily: UNITY_THEME.fonts.main,
            fontWeight: '900',
            textAlign: 'center',
            margin: 0,
            color: UNITY_THEME.colors.textWhite,
            textShadow: `0 0 20px ${UNITY_THEME_COLOR}, 0 0 40px ${UNITY_THEME_COLOR}`,
            zIndex: 10,
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
            const staggerFrames = isCompact ? 24 : 48; // ビートに同期（1拍 / 2拍）
            const liverEntrance = spring({
              frame: Math.max(0, frame - (livers.length - 1 - index) * staggerFrames - 10),
              fps,
              config: { damping: 24, stiffness: 40 }, // 非常に柔らかい動き
            });

            const bounceScale = interpolate(liverEntrance, [0, 1], [0.95, 1]);
            const slideX      = interpolate(liverEntrance, [0, 1], [-200, 0]);
            const rowOpacity  = interpolate(liverEntrance, [0, 0.4], [0, 1]);

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
                    border: `2px solid ${UNITY_THEME_COLOR}`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.5)`,
                    backgroundColor: UNITY_THEME.colors.panelBg, // 透明度を大幅に上げ、青みを少し加えた
                    transform: `translateX(${slideX}px) scale(${bounceScale})`,
                    opacity: rowOpacity,
                    padding: `${verticalPad}px 30px`,
                    position: 'relative',
                  }}
                >
                  {/* アイコン枠 */}
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 9999,
                      border: `3px solid ${UNITY_LIME}`,
                      boxShadow: `0 0 20px ${UNITY_LIME}66`,
                      flexShrink: 0,
                      overflow: 'hidden',
                      backgroundColor: 'transparent',
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
                        color: UNITY_THEME.colors.textWhite,
                        textShadow: `0 0 10px ${UNITY_THEME_COLOR}`,
                        lineHeight: 1.1,
                        fontFamily: UNITY_THEME.fonts.main,
                      }}
                    >
                      {liver.rank}
                      <span style={{ fontSize: rankFontSize * 0.4, fontStyle: 'normal', fontFamily: UNITY_THEME.fonts.suffix, marginLeft: 2 }}>
                        th
                      </span>
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
                    color: UNITY_THEME.colors.textWhite,
                    textShadow: `0 0 30px ${UNITY_THEME_COLOR}`,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    fontFamily: UNITY_THEME.fonts.main,
                  }}
                >
                  {liver.rank}
                  <span style={{ fontSize: rankFontSize * 0.4, fontStyle: 'normal', scale: '0.8', fontFamily: UNITY_THEME.fonts.suffix, marginLeft: 2 }}>
                    th
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
                      border: `8px solid ${UNITY_THEME_COLOR}`,
                      boxShadow: `0 0 40px ${UNITY_THEME_COLOR}, inset 0 0 20px ${UNITY_THEME_COLOR}`,
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: 'transparent',
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
                        background: `linear-gradient(90deg, transparent 0%, ${UNITY_THEME_COLOR} 50%, transparent 100%)`,
                        marginBottom: 12,
                        boxShadow: `0 0 15px ${UNITY_THEME_COLOR}`,
                      }} 
                    />
                    <span
                      style={{
                        fontSize: nameFontSize,
                        fontWeight: 800,
                        color: UNITY_THEME.colors.textWhite,
                        textShadow: `0 0 15px ${UNITY_THEME_COLOR}, 3px 3px 10px #000`,
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