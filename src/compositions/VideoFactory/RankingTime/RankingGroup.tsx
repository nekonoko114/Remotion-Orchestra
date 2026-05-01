import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { GalaxyClock } from './GalaxyClock';
import type { Liver } from '../types';
import { loadFont as loadCinzel } from '@remotion/google-fonts/Cinzel';

const { fontFamily: cinzelFont } = loadCinzel();

type Props = {
  title: string;
  livers: Liver[];
};

// Purple Theme (Unified Design for RankingTime)
const UNITY_THEME = '#d000ff'; // Vibrant Purple
const UNITY_LIME  = '#00ffff'; // Neon Cyan/Blue for Rank

const CornerOrnament: React.FC<{ size: number; color: string; position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ size, color, position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    borderTop: position.startsWith('t') ? `4px solid ${color}` : 'none',
    borderBottom: position.startsWith('b') ? `4px solid ${color}` : 'none',
    borderLeft: position.endsWith('l') ? `4px solid ${color}` : 'none',
    borderRight: position.endsWith('r') ? `4px solid ${color}` : 'none',
    zIndex: 10,
    opacity: 0.9,
  };

  if (position === 'tl') { style.top = 0; style.left = 0; }
  if (position === 'tr') { style.top = 0; style.right = 0; }
  if (position === 'bl') { style.bottom = 0; style.left = 0; }
  if (position === 'br') { style.bottom = 0; style.right = 0; }

  return <div style={style} />;
};

const getAvatarPosition = (rank: number) => {
  if (rank === 10) return 'center 20%';
  if (rank === 8) return 'center 25%';
  if (rank === 7) return 'center 20%';
  if (rank === 6) return 'center 50%';
  if (rank === 5) return 'center 20%';
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
  const gap = isCompact ? 22 : is2Group ? 80 : is3Group ? 20 : 80;
  const rankFontSize = isCompact ? 100 : is2Group ? 160 : 130;
  const nameFontSize = isCompact ? 54 : is2Group ? 85 : 75;
  const marginTop = isCompact ? 230 : 230;

  return (
    <AbsoluteFill>
      {/* ギャラクシークロック背景 (下位ランク用 subtle モード) */}
      <GalaxyClock 
        rank={livers[0].rank} 
        themeColor={UNITY_THEME} 
        entrance={opacity} 
        variant="subtle" 
      />

      {/* ===== 背景 (完全に透過させて下層の動画を表示) ===== */}

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* 1. Header Title - Cinzel Font */}
        <h1
          style={{
            position: 'absolute',
            top: 100, 
            fontSize: isCompact ? 110 : 130,
            fontFamily: cinzelFont,
            fontWeight: '900',
            textAlign: 'center',
            margin: 0,
            color: '#FFF',
            textShadow: `0 0 20px ${UNITY_THEME}, 0 0 40px ${UNITY_THEME}`,
            letterSpacing: '4px',
          }}
        >
          {title}
        </h1>

        {/* 2. Ranking List Container */}
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
                    gap: 35,
                    borderRadius: 16,
                    border: `1.5px solid rgba(255, 255, 255, 0.15)`,
                    boxShadow: `0 10px 40px rgba(0,0,0,0.5), inset 0 0 25px ${UNITY_THEME}33, 0 0 15px ${UNITY_THEME}22`,
                    background: `linear-gradient(90deg, rgba(30,0,60,0.8) 0%, rgba(10,0,30,0.6) 100%)`,
                    transform: `translateY(${slideY}px) scale(${bounceScale})`,
                    opacity: rowOpacity,
                    padding: `15px 40px`,
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  {/* Corner Ornaments */}
                  <CornerOrnament size={32} color={UNITY_LIME} position="tl" />
                  <CornerOrnament size={32} color={UNITY_LIME} position="tr" />
                  <CornerOrnament size={32} color={UNITY_LIME} position="bl" />
                  <CornerOrnament size={32} color={UNITY_LIME} position="br" />
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 9999,
                      border: `3px solid ${UNITY_LIME}`,
                      boxShadow: `0 0 15px ${UNITY_LIME}80`,
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
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span
                        style={{
                          fontSize: rankFontSize,
                          fontFamily: cinzelFont,
                          fontWeight: '900',
                          color: UNITY_LIME,
                          textShadow: `0 0 20px ${UNITY_LIME}`,
                          lineHeight: 1,
                        }}
                      >
                        {liver.rank}
                      </span>
                      <span style={{ fontSize: 40, fontFamily: cinzelFont, color: UNITY_LIME, opacity: 0.8 }}>th</span>
                    </div>
                    <span
                      style={{
                        fontSize: liver.nickname.length > 10 ? nameFontSize * 0.72 : nameFontSize,
                        fontFamily: cinzelFont,
                        fontWeight: '800',
                        color: '#FFF',
                        textShadow: `0 0 15px rgba(0,0,0,0.8), 0 0 10px ${UNITY_THEME}88`,
                        lineHeight: 1.2,
                        letterSpacing: '1px',
                      }}
                    >
                      {liver.nickname}
                    </span>
                  </div>
                </div>
              );
            }

            // is2Group / is3Group Layout (Featured Centered Icon)
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
                        fontFamily: cinzelFont,
                        fontWeight: 900,
                        color: UNITY_LIME,
                        textShadow: `0 0 30px ${UNITY_LIME}, 0 0 10px #000`,
                        textAlign: 'right',
                        paddingRight: 40,
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {liver.rank}
                      <span style={{ fontSize: rankFontSize * 0.4, marginLeft: 2, opacity: 0.8 }}>
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
                            objectPosition: getAvatarPosition(liver.rank),
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
                        fontSize: liver.nickname.length > 10 ? nameFontSize * 0.72 : nameFontSize,
                        fontFamily: cinzelFont,
                        fontWeight: 800,
                        color: '#FFF',
                        textShadow: `0 0 20px ${UNITY_THEME}, 3px 3px 15px #000`,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        letterSpacing: '2px',
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
