import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  OffthreadVideo,
  random,
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { LiverCubeScene } from './LiverCubeScene';
import { GodRays } from '../../../components/effects/GodRays';
import { GoldenFeathers } from '../../../components/effects/GoldenFeathers';
import { ParticleBurst } from '../../../components/effects/ParticleBurst';
import { CinematicBorder } from '../CinematicBorder';
import { AdjustmentLayer } from '../AdjustmentLayer';
import { useBeatValue } from '../utils/beat-sync';
import { LuxuryGoldText } from '../components/LuxuryGoldText';
import { ROYAL_THEME } from './theme';
import type { Liver } from '../types';

type Props = {
  rank: number;
  liver: Liver;
  title: string;
  top3Video: string;
  bpm: number;
};

export const Top1Reveal: React.FC<Props> = ({ rank, liver, title, top3Video, bpm }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { pulse } = useBeatValue(bpm);
  
  const isRank1 = rank === 1;
  const pulseScale = (1 + Math.sin(frame / 8) * 0.05) * (1 + (isRank1 ? 0 : pulse * 0.02)); // 1位は脈動させない

  const triStart = 30;
  const triDuration = isRank1 ? 50 : 40;
  const t = Math.max(0, frame - triStart);
  
  const centerX = width / 2;
  const centerY = 960; 

  const Point1X = rank === 2 ? width * 0.95 : width * 0.05;
  const Rot1 = rank === 2 ? 35 : -35;

  let triX = centerX;
  let triY = -1000;
  let triRotate = 0;
  let motionBlur = 0;

  if (isRank1) {
    if (t < 0) {
      triX = centerX;
      triY = -1000;
    } else if (t <= 50) {
      // Top 1: 真上から優雅に降りてくる
      const p = interpolate(t, [0, 50], [0, 1], { easing: Easing.out(Easing.exp) });
      triX = centerX;
      triY = interpolate(p, [0, 1], [-500, centerY]);
      triRotate = interpolate(p, [0, 1], [180, 0]); // 反回転させながら登場
      motionBlur = interpolate(p, [0, 1], [30, 0]);
    } else {
      triX = centerX;
      triY = centerY;
      triRotate = 0;
      motionBlur = 0;
    }
  } else if (t < 0) {
    triX = centerX;
    triY = -1000;
  } else if (t <= 40) {
    // Top 2, 3: サイドからのスライドは残しつつ、少し柔らかく
    const p = interpolate(t, [0, 40], [0, 1], { easing: Easing.out(Easing.back(1.5)) });
    triX = interpolate(p, [0, 1], [Point1X, centerX]);
    triY = interpolate(p, [0, 1], [height * 0.2, centerY]);
    triRotate = interpolate(p, [0, 1], [Rot1, 0]);
    motionBlur = interpolate(p, [0, 1], [20, 0]);
  } else {
    triX = centerX;
    triY = centerY;
    triRotate = 0;
    motionBlur = 0;
  }

  const rankEntrance = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 100 } });
  const nameEntrance = spring({ frame: frame - 75, fps, config: { damping: 15, stiffness: 90 } });

  const rankScale = interpolate(rankEntrance, [0, 1], [3, 1], {
    easing: Easing.out(Easing.back(1.5)),
  });
  const rankOpacity = interpolate(rankEntrance, [0, 0.5], [0, 1]);

  const nameY = interpolate(nameEntrance, [0, 1], [100, 0]);
  const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

  // ゴールド系の枠色設定
  const borderPrimary = isRank1 ? ROYAL_THEME.colors.champagneGold : ROYAL_THEME.colors.champagneGoldDark;

  if (!liver) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: ROYAL_THEME.colors.midnightBlue }}>
      {/* 背景レイヤー：動画の上にライバー画像を重ねる、または置き換える */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {/* 背景動画（うっすら見える程度） */}
        {top3Video && (
          <OffthreadVideo
            src={staticFile(top3Video)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.15) contrast(1.1) saturate(0.5)',
            }}
            startFrom={isRank1 ? 500 : rank === 2 ? 300 : rank === 3 ? 100 : rank === 4 ? 400 : 200} 
            muted
            playbackRate={0.7}
          />
        )}

        {/* ライバー背景画像 + 大胆なダイナミック・パワーシェイク演出 */}
        {(() => {
          // 揺れの周期：18フレームごとに次の目的地へ大きく移動
          const freq = 18;
          const p1 = Math.floor(frame / freq);
          const p2 = p1 + 1;
          const progress = (frame % freq) / freq;

          // 大胆な振り幅（150px）
          const intensity = 800;
          
          const x1 = (random(`x-${p1}`) - 0.5) * intensity;
          const x2 = (random(`x-${p2}`) - 0.5) * intensity;
          const y1 = (random(`y-${p1}`) - 0.5) * intensity;
          const y2 = (random(`y-${p2}`) - 0.5) * intensity;
          const r1 = (random(`r-${p1}`) - 0.5) * 5;
          const r2 = (random(`r-${p2}`) - 0.5) * 5;

          // 滑らかなイージングで繋ぐ（グワッという重み）
          const shakeX = interpolate(progress, [0, 1], [x1, x2], { easing: Easing.bezier(0.42, 0, 0.58, 1) });
          const shakeY = interpolate(progress, [0, 1], [y1, y2], { easing: Easing.bezier(0.42, 0, 0.58, 1) });
          const shakeRot = interpolate(progress, [0, 1], [r1, r2], { easing: Easing.bezier(0.42, 0, 0.58, 1) });

          const bgImg = liver.saved_to 
            ? staticFile(liver.saved_to) 
            : liver.image_url?.startsWith('http') 
              ? liver.image_url 
              : staticFile(liver.image_url || '');

          return (
            <AbsoluteFill 
              style={{ 
                // 150pxの移動に耐えるよう scale を 1.5 に引き上げ
                transform: `scale(1.5) translate(${shakeX}px, ${shakeY}px) rotate(${shakeRot}deg)`,
                zIndex: 1,
              }}
            >
              {bgImg && (
                <img
                  src={bgImg}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    // 高級感を出すために明るさとぼかしをプロレベルで調整
                    filter: 'blur(30px) brightness(0.75) saturate(1.1)',
                    opacity: 0.9,
                  }}
                />
              )}
            </AbsoluteFill>
          );
        })()}

        {/* 周辺を少し暗くして中央を立たせるグラデーション */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle, transparent 20%, rgba(0,10,30,0.8) 100%)`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      </AbsoluteFill>

      {/* 1位専用：聖域のゴッドレイ */}
      {isRank1 && (
        <AbsoluteFill style={{ zIndex: 50, pointerEvents: 'none' }}>
           <GodRays count={48} opacity={0.7} />
        </AbsoluteFill>
      )}

      {/* 1位専用：黄金の霧 (Misty Gold) */}
      {isRank1 && (
        <AbsoluteFill style={{ zIndex: 60, pointerEvents: 'none' }}>
           <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 1600, height: 1600,
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(150px)',
              opacity: interpolate(frame, [triStart, triStart + 60], [0, 1], { extrapolateRight: 'clamp' }),
           }} />
        </AbsoluteFill>
      )}

      {/* 調整レイヤー */}
      <AdjustmentLayer rank={rank} beatPulse={isRank1 ? 0 : pulse * 0.5} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: ROYAL_THEME.fonts.primary,
          color: 'white',
        }}
      >
        <AbsoluteFill style={{ zIndex: 120 }}>
          <div style={{ 
            position: 'absolute',
            top: 200 * (height / 1920),
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            transform: `scale(${rankScale * pulseScale})`, 
            opacity: rankOpacity 
          }}>
            {(() => {
              const match = title.match(/^(\d+)(.*)$/);
              if (match) {
                const [, num, suffix] = match;
                return (
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <LuxuryGoldText 
                      text={num} 
                      fontSize={(isRank1 ? 250 : 200) * (width / 1080)} 
                      delay={25}
                      style={{
                        fontStyle: 'italic',
                        textShadow: `0 10px 30px rgba(0,0,0,0.9)`,
                      }}
                    />
                    <LuxuryGoldText 
                      text={suffix} 
                      fontSize={(isRank1 ? 120 : 100) * (width / 1080)} 
                      delay={25}
                      fontFamily={ROYAL_THEME.fonts.japanese}
                      style={{
                        textShadow: `0 10px 30px rgba(0,0,0,0.9)`,
                      }}
                    />
                  </div>
                );
              }
              return (
                <LuxuryGoldText 
                  text={title} 
                  fontSize={(isRank1 ? 250 : 200) * (width / 1080)} 
                  delay={25}
                  style={{
                    fontStyle: 'italic',
                    textShadow: `0 10px 30px rgba(0,0,0,0.9)`,
                  }}
                />
              );
            })()}
          </div>

          {/* アイコン（3Dキューブ） */}
          <div
            style={{
              position: 'absolute',
              left: triX,
              top: triY,
              width: (isRank1 ? 900 : 800) * (width / 1080),
              height: (isRank1 ? 900 : 800) * (width / 1080),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `translate(-50%, -50%) rotate(${triRotate}deg)`,
              filter: `blur(${motionBlur}px)`,
              zIndex: 100,
            }}
          >
            <ThreeCanvas 
              width={(isRank1 ? 1000 : 800) * (width / 1080)} 
              height={(isRank1 ? 1000 : 800) * (width / 1080)}
              style={{
                borderRadius: '24px',
                boxShadow: isRank1 
                  ? `0 0 100px ${ROYAL_THEME.colors.goldGlow}, 0 0 40px white` 
                  : `0 0 25px rgba(255, 215, 0, 0.4)`,
                filter: isRank1 ? 'none' : 'brightness(1) contrast(2) saturate(1.3)',
              }}
            >
              <LiverCubeScene rank={rank} imageUrl={
                liver.saved_to
                  ? staticFile(liver.saved_to)
                  : liver.image_url.startsWith('http')
                    ? liver.image_url
                    : staticFile(liver.image_url)
              } />
            </ThreeCanvas>
          </div>

          {/* 名前表示 */}
          <div style={{
            position: 'absolute',
            top: 1550 * (height / 1920),
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `translateY(${nameY * (width / 1080)}px)`,
            opacity: nameOpacity,
          }}>
            <h2
              style={{
                fontSize: 100 * (width / 1080),
                margin: 0, 
                textShadow: `0 5px 15px rgba(0,0,0,0.9), 0 0 20px ${ROYAL_THEME.colors.goldGlow}`,
                fontWeight: 900,
                color: ROYAL_THEME.colors.textWhite,
                textAlign: 'center',
                fontFamily: ROYAL_THEME.fonts.japanese,
              }}
            >
              {liver.nickname}
            </h2>
            <div style={{
              width: 150, height: 4, marginTop: 25,
              background: ROYAL_THEME.gradients.goldLinear,
              borderRadius: 2,
              boxShadow: `0 0 10px ${ROYAL_THEME.colors.goldGlow}`
            }} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <CinematicBorder color={borderPrimary} glowColor={ROYAL_THEME.colors.goldGlow} />

      {/* ゴールド・シャンパンのパーティクル（羽根の舞い） */}
      <AbsoluteFill style={{ zIndex: 110, pointerEvents: 'none' }}>
        <GoldenFeathers 
          count={rank === 1 ? 120 : 80} 
        />
        {/* 到着タイミングで上品に弾けるパーティクル */}
        {frame === triStart + triDuration && (
          <ParticleBurst 
            count={80} 
            colors={[ROYAL_THEME.colors.champagneGold, '#FFFFFF']} 
            x={centerX} 
            y={centerY} 
            speed={2} 
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
