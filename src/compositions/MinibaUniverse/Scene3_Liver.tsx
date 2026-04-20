import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from 'remotion';

const COLORS = {
  pink: '#FF6EB4',
  yellow: '#FFE234',
  cyan: '#5CE8F5',
  purple: '#C878FF',
  orange: '#FF8C42',
  green: '#6AFFA0',
};

// ===== インパクトフラッシュ =====
const ImpactFlash: React.FC<{ triggerFrame: number; color?: string }> = ({
  triggerFrame,
  color = 'rgba(255,255,255,0.9)',
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 2, triggerFrame + 10],
    [0, 0.9, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill
      style={{ background: color, opacity, pointerEvents: 'none', zIndex: 999 }}
    />
  );
};

// ===== スクリーンシェイク =====
const useScreenShake = (triggerFrame: number, duration = 14, intensity = 15) => {
  const frame = useCurrentFrame();
  const p = frame - triggerFrame;
  if (p < 0 || p > duration) return { x: 0, y: 0 };
  const decay = 1 - p / duration;
  return {
    x: Math.sin(p * 2.8) * intensity * decay,
    y: Math.cos(p * 3.6) * intensity * 0.6 * decay,
  };
};

// ===== 紙吹雪（量増しバージョン） =====
const Confetti: React.FC = () => {
  const frame = useCurrentFrame();
  const items = Array.from({ length: 50 }, (_, i) => {
    const x = (i * 73) % 1080;
    const speed = 4 + (i % 6) * 0.8;
    const startY = -(i * 60 + 50);
    const y = startY + frame * speed;
    const rotation = frame * (i % 2 === 0 ? 3 : -5) + i * 40;
    const size = 18 + (i % 5) * 10;
    const opacity = Math.min(1, (y + 100) / 100);
    const colorList = Object.values(COLORS);
    const color = colorList[i % colorList.length];
    const shapes = ['■', '●', '★', '▲', '♦', '🎉', '🌟', '✨'];
    const shape = shapes[i % shapes.length];
    return { x, y, rotation, size, opacity, color, shape };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            fontSize: item.size,
            color: item.color,
            transform: `rotate(${item.rotation}deg)`,
            opacity: item.opacity > 0 && item.y < 2100 ? Math.min(item.opacity, 0.85) : 0,
            filter:
              typeof item.shape === 'string' && item.shape.length === 1
                ? `drop-shadow(0 0 6px ${item.color})`
                : 'none',
          }}
        >
          {item.shape}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ===== 四方から飛ぶスター =====
const StarBurst: React.FC<{ triggerFrame: number }> = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const elapsed = frame - triggerFrame;
  if (elapsed < 0 || elapsed > 40) return null;

  const stars = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const distance = interpolate(elapsed, [0, 40], [0, 500 + (i % 4) * 80], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 2),
    });
    const opacity = interpolate(elapsed, [0, 5, 30, 40], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const x = 540 + Math.cos(angle) * distance;
    const y = 960 + Math.sin(angle) * distance;
    const colorList = Object.values(COLORS);
    const color = colorList[i % colorList.length];
    return { x, y, opacity, color };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            transform: 'translate(-50%, -50%)',
            fontSize: 30 + (i % 4) * 8,
            opacity: s.opacity,
            filter: `drop-shadow(0 0 8px ${s.color})`,
          }}
        >
          {['⭐', '✨', '💫', '🌟'][i % 4]}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ===== メイン Scene 3 =====
export const Scene3_Liver: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgHue = interpolate(frame, [0, 300], [330, 400]);
  const bgPulse = (Math.sin(frame / 14) + 1) / 2;

  // 地球
  const globeScale = spring({ frame, fps, config: { damping: 10, stiffness: 130 } });
  const globeOpacity = interpolate(frame, [0, 20], [0, 0.65], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const globeRotation = frame * 0.35;
  const globeFloat = Math.sin(frame / 18) * 12;

  // 写真：下からスライドイン（インパクト強め）
  const photoY = interpolate(frame, [10, 40], [400, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });
  const photoScale = spring({ frame: frame - 10, fps, config: { damping: 7, stiffness: 240, mass: 0.7 } });
  const photoOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const photoFloat = frame > 40 ? Math.sin((frame - 40) / 18) * 8 : 0;

  // テキスト（左からスライド）
  const textX = interpolate(frame, [50, 80], [-200, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const textScale = spring({ frame: frame - 50, fps, config: { damping: 8, stiffness: 220 } });
  const textOpacity = interpolate(frame, [50, 68], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // CTA（右からスライド）
  const ctaX = interpolate(frame, [130, 160], [200, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const ctaScale = spring({ frame: frame - 130, fps, config: { damping: 7, stiffness: 250 } });
  const ctaOpacity = interpolate(frame, [130, 148], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // スクリーンシェイク
  const shake1 = useScreenShake(10, 14, 16);  // 写真登場
  const shake2 = useScreenShake(130, 10, 10); // CTA登場
  const shakeX = shake1.x + shake2.x;
  const shakeY = shake1.y + shake2.y;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, hsl(${bgHue}, 82%, 72%) 0%, hsl(${bgHue + 40}, 88%, 80%) 50%, hsl(${bgHue + 75}, 78%, 68%) 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* 紙吹雪 */}
      <Confetti />

      {/* 背景ラジアルグロー */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${600 + bgPulse * 200}px`,
            height: `${600 + bgPulse * 200}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
          }}
        />
      </AbsoluteFill>

      {/* エフェクトレイヤー */}
      <ImpactFlash triggerFrame={10} color="rgba(255,255,255,0.9)" />
      <ImpactFlash triggerFrame={130} color="rgba(255,110,180,0.5)" />
      <StarBurst triggerFrame={10} />

      {/* メインコンテンツ */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          padding: '30px 30px 50px',
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* ライバー写真 */}
        <div
          style={{
            transform: `scale(${photoScale}) translateY(${photoY + (photoOpacity > 0 ? photoFloat : 0)}px)`,
            opacity: photoOpacity,
            position: 'relative',
          }}
        >
          {/* 発光する虹リング（太め） */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              borderRadius: 32,
              background: `conic-gradient(from ${frame * 2}deg, #FF6EB4, #FFE234, #5CE8F5, #C878FF, #FF8C42, #6AFFA0, #FF6EB4)`,
              filter: `blur(6px)`,
              opacity: 0.85,
            }}
          />
          {/* 外側追加リング */}
          <div
            style={{
              position: 'absolute',
              inset: -30,
              borderRadius: 38,
              border: `4px solid rgba(255,255,255,${0.3 + bgPulse * 0.4})`,
              filter: `blur(3px)`,
            }}
          />
          <Img
            src={staticFile('assets/images/karaindaisuki01.jpg')}
            style={{
              width: 900,
              height: 950,
              objectFit: 'cover',
              objectPosition: 'center top',
              borderRadius: 24,
              border: '8px solid #fff',
              boxShadow: `0 0 ${40 + bgPulse * 30}px rgba(255,110,180,0.6), 0 24px 60px rgba(0,0,0,0.3)`,
              position: 'relative',
            }}
          />
        </div>

        {/* テキスト（左スライドイン） */}
        <div
          style={{
            transform: `scale(${textScale}) translateX(${textX}px)`,
            opacity: textOpacity,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 28,
              padding: '20px 44px',
              boxShadow: `0 0 ${24 + bgPulse * 16}px rgba(255,110,180,0.4), 0 12px 36px rgba(0,0,0,0.15)`,
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255,255,255,0.8)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 光沢 */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)', borderRadius: '28px 28px 0 0' }} />
            <div
              style={{
                fontSize: 68,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                background: 'linear-gradient(90deg, #FF6EB4, #C878FF, #5CE8F5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.25,
                position: 'relative',
              }}
            >
              なるりれ🦚🍉
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 700,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#555',
                marginTop: 6,
                position: 'relative',
              }}
            >
              のマイイベント
            </div>
          </div>
        </div>

        {/* CTAバナー（右スライドイン） */}
        <div
          style={{
            transform: `scale(${ctaScale}) translateX(${ctaX}px)`,
            opacity: ctaOpacity,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg,
                hsl(${330 + bgPulse * 25}, 92%, 62%),
                hsl(${270 + bgPulse * 25}, 92%, 64%),
                hsl(${200 + bgPulse * 25}, 92%, 62%)
              )`,
              borderRadius: 30,
              padding: '22px 52px',
              boxShadow: `0 0 ${40 + bgPulse * 30}px rgba(200,120,255,${0.58 + bgPulse * 0.3}), 0 14px 32px rgba(0,0,0,0.22)`,
              border: '4px solid rgba(255,255,255,0.72)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '42%', background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)', borderRadius: '30px 30px 0 0' }} />
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#fff',
                textShadow: '3px 3px 0 rgba(0,0,0,0.12)',
                lineHeight: 1.4,
                position: 'relative',
              }}
            >
              ３日間やり切る！
            </div>
            <div
              style={{
                fontSize: 66,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#FFE234',
                textShadow: `4px 4px 0 #FF8C42, 0 0 ${22 + bgPulse * 18}px rgba(255,226,52,0.7)`,
                lineHeight: 1.25,
                position: 'relative',
              }}
            >
              みんなで一緒に<br />
              盛り上げてね😊
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
