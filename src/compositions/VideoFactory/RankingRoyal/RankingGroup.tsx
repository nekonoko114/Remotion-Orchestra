import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { Liver } from '../types';
import { ROYAL_THEME } from './theme';
import { LuxuryGoldText } from '../components/LuxuryGoldText';
import { Dust } from '../../../components/effects/Dust';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';

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

export const RankingGroup: React.FC<Props> = ({
  title,
  livers,
  useGlitch,
  glitchIntensity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 }, // 少しゆっくりな落ち着いたアニメーション
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [1.05, 1]); // 大きめから等倍へ、優雅に。

  const isCompact = livers.length >= 4;
  const is3Group = livers.length === 3;
  const is2Group = livers.length === 2;
  const gap = isCompact ? 40 : is2Group ? 40 : is3Group ? 30 : 40;
  const rankFontSize = isCompact ? 120 : is2Group ? 160 : 130;
  const nameFontSize = isCompact ? 60 : is2Group ? 85 : 75;
  const verticalPad = isCompact ? 20 : 0;

  return (
    <AbsoluteFill>
      {/* 背景の空気感演出：ゴールド・ダスト */}
      <AbsoluteFill style={{ opacity: 0.4 }}>
        <Dust count={40} colors={['#FFD700', '#FFF8E7', '#D4AF37']} opacity={0.6} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* タイトル：絶対配置をやめ、通常のフローで配置 */}
        <div style={{ marginBottom: isCompact ? 40 : 60, zIndex: 10 }}>
          <LuxuryGoldText 
            text={title.replace('\n', ' ')} 
            fontSize={isCompact ? 70 : 100} 
            delay={5}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap,
            width: isCompact ? '90%' : '94%',
            zIndex: 5,
          }}
        >
          {livers.map((liver, index) => {
            const staggerFrames = isCompact ? 12 : 18;
            const startFrame = (livers.length - 1 - index) * staggerFrames + 20;
            
            const liverEntrance = spring({
              frame: frame - startFrame,
              fps,
              config: { damping: 15, stiffness: 100 },
            });

            // 1. 豪華な3Dフリップ
            const rowRotateX = interpolate(liverEntrance, [0, 1], [90, 0], { easing: Easing.out(Easing.back(1.5)) });
            const slideY = interpolate(liverEntrance, [0, 1], [120, 0], { easing: Easing.out(Easing.quad) });
            const rowBlur = interpolate(liverEntrance, [0, 0.7], [30, 0]);
            const rowScale = interpolate(liverEntrance, [0, 1], [0.85, 1]);
            const rowOpacity = interpolate(liverEntrance, [0, 0.2], [0, 1]);

            // 2. 「ライトスリープ」スキャナー（シンプルに1本へ）
            const sweepProgress = spring({
              frame: frame - startFrame - 5,
              fps,
              config: { damping: 20, stiffness: 100 },
            });
            const sweepX = interpolate(sweepProgress, [0, 1], [-100, 200]);
            const sweepOpacity = interpolate(sweepProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

            // 3. インパクト時の微振動
            const impactFrame = 30; // springが1に近づく付近
            const shake = frame > startFrame + impactFrame && frame < startFrame + impactFrame + 5
              ? (frame % 2 === 0 ? 2 : -2)
              : 0;

            // 4. 定常シマー
            const shimmerX = interpolate(frame % 240, [0, 240], [-150, 150]);
            const ringGlowIntensity = interpolate(liverEntrance, [0.3, 0.5, 0.8], [0, 2, 0], { extrapolateRight: 'clamp' });

            const avatarSrc = liver.saved_to
              ? staticFile(liver.saved_to)
              : liver.image_url.startsWith('http')
                ? liver.image_url
                : staticFile(liver.image_url);

            const commonStyles: React.CSSProperties = {
              transform: `perspective(1200px) translateY(${slideY + shake}px) scale(${rowScale}) rotateX(${rowRotateX}deg)`,
              transformOrigin: 'top center',
              opacity: rowOpacity,
              filter: `blur(${rowBlur}px)`,
              position: 'relative',
              overflow: 'hidden',
            };

            const content = (
              <>
                {/* スッキリとした1本のライトスリープ */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, width: '40%',
                  background: `linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), white, rgba(255, 215, 0, 0.6), transparent)`,
                  transform: `translateX(${sweepX}%) skewX(-20deg)`,
                  opacity: sweepOpacity,
                  filter: 'blur(10px)',
                  zIndex: 20,
                  pointerEvents: 'none',
                }} />

                {/* 定常シマー */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: `linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 60%, transparent 100%)`,
                  transform: `translateX(${shimmerX}%)`,
                  pointerEvents: 'none',
                  zIndex: 2,
                }} />

                {/* 着地時の衝撃パーティクル */}
                {frame > startFrame + 25 && frame < startFrame + 60 && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 40 }}>
                     <ParticleBurst 
                        count={20} 
                        colors={['#FFD700', '#FFF', '#D4AF37']} 
                        x={0} y={0} 
                        speed={0.8}
                     />
                  </div>
                )}
              </>
            );

            if (isCompact) {
              return (
                <div key={liver.rank} style={{
                    ...commonStyles,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 30,
                    borderRadius: 16,
                    background: ROYAL_THEME.gradients.navyPanel,
                    border: `2px solid ${ROYAL_THEME.colors.champagneGoldDark}`,
                    boxShadow: ROYAL_THEME.shadows.boxNavy,
                    padding: `${verticalPad}px 30px`,
                  }}
                >
                  {content}
                  <div style={{
                      width: 220, height: 220, borderRadius: 9999, border: `4px solid ${ROYAL_THEME.colors.champagneGold}`,
                      boxShadow: `0 0 ${20 + ringGlowIntensity * 50}px ${ROYAL_THEME.colors.goldGlow}, 0 0 ${ringGlowIntensity * 30}px white`,
                      flexShrink: 0, overflow: 'hidden', backgroundColor: ROYAL_THEME.colors.midnightBlue,
                    }}
                  >
                    <Img src={avatarSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 4, flex: 1, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                      <LuxuryGoldText text={liver.rank.toString()} fontSize={rankFontSize} />
                      <LuxuryGoldText text="位" fontSize={rankFontSize * 0.4} />
                    </div>
                    <span style={{
                        fontSize: nameFontSize, fontWeight: 800, color: ROYAL_THEME.colors.textWhite,
                        textShadow: `0 4px 15px rgba(0,0,0,0.9), 0 0 10px ${ROYAL_THEME.colors.goldGlow}`,
                        whiteSpace: 'nowrap', fontFamily: ROYAL_THEME.fonts.japanese, lineHeight: 1.2, marginTop: 10,
                      }}
                    >
                      {liver.nickname}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={liver.rank} style={{
                  ...commonStyles,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  width: '100%', gap: 15, padding: '10px 0',
                }}
              >
                {content}
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', left: '0px', width: '28%', textAlign: 'right', paddingRight: 40 }}>
                      <LuxuryGoldText text={liver.rank.toString()} fontSize={rankFontSize * 0.9} style={{ fontStyle: 'italic' }} />
                      <span style={{ fontSize: rankFontSize * 0.25, color: ROYAL_THEME.colors.champagneGold, fontWeight: 800, fontFamily: ROYAL_THEME.fonts.japanese, marginLeft: 5 }}>位</span>
                    </div>
                    <div style={{
                          width: is2Group ? 480 : 330, height: is2Group ? 480 : 330,
                          borderRadius: '50%', border: `6px solid ${ROYAL_THEME.colors.champagneGold}`,
                          boxShadow: `0 0 ${30 + ringGlowIntensity * 50}px ${ROYAL_THEME.colors.goldGlow}, 0 0 ${ringGlowIntensity * 20}px white, inset 0 0 30px rgba(0,0,0,0.8)`,
                          overflow: 'hidden', flexShrink: 0, backgroundColor: ROYAL_THEME.colors.midnightBlue, position: 'relative',
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 70%, rgba(247, 231, 206, 0.4) 100%)', zIndex: 1, pointerEvents: 'none' }} />
                        <Img src={avatarSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: getBackgroundPosition(liver.rank) }} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{
                        fontSize: nameFontSize * 0.9, fontWeight: 800, color: ROYAL_THEME.colors.textWhite,
                        textShadow: `0 4px 15px rgba(0,0,0,0.9), 0 0 10px ${ROYAL_THEME.colors.goldGlow}`,
                        whiteSpace: 'nowrap', textAlign: 'center', fontFamily: ROYAL_THEME.fonts.japanese,
                      }}
                    >
                      {liver.nickname}
                    </span>
                    <div style={{ width: 80, height: 2, marginTop: 10, background: ROYAL_THEME.gradients.goldLinear, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
