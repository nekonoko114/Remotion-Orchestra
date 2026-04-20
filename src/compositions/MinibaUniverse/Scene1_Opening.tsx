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

const COLORS = {
  pink: '#FF6EB4',
  yellow: '#FFE234',
  cyan: '#5CE8F5',
  purple: '#C878FF',
  orange: '#FF8C42',
  green: '#6AFFA0',
};

// ========== インパクトフラッシュ ==========
const ImpactFlash: React.FC<{ triggerFrame: number; color?: string }> = ({
  triggerFrame,
  color = '#fff',
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 3, triggerFrame + 10],
    [0, 0.85, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background: color,
        opacity,
        pointerEvents: 'none',
        zIndex: 999,
      }}
    />
  );
};

// ========== マンガ風スピードライン（集中線） ==========
const SpeedLines: React.FC<{ triggerFrame: number; duration?: number }> = ({
  triggerFrame,
  duration = 18,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 3, triggerFrame + duration],
    [0, 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  if (opacity <= 0) return null;

  const lines = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * 360;
    return angle;
  });

  return (
    <AbsoluteFill
      style={{ pointerEvents: 'none', opacity, zIndex: 500 }}
    >
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        {lines.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 540;
          const cy = 960;
          const length = 1200 + (i % 3) * 200;
          const thickness = 0.5 + (i % 4) * 0.8;
          const x2 = cx + Math.cos(rad) * length;
          const y2 = cy + Math.sin(rad) * length;
          const startDist = 80 + (i % 5) * 30;
          const x1 = cx + Math.cos(rad) * startDist;
          const y1 = cy + Math.sin(rad) * startDist;
          const colorList = [COLORS.pink, COLORS.yellow, COLORS.cyan, COLORS.purple, COLORS.orange];
          const col = colorList[i % colorList.length];
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={col}
              strokeWidth={thickness}
              opacity={0.7}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ========== ラジアルバースト背景 ==========
const RadialBurst: React.FC<{ triggerFrame: number }> = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [triggerFrame, triggerFrame + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (progress <= 0) return null;

  const scale = interpolate(progress, [0, 1], [0.2, 2.5]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0.9, 0.6, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity, zIndex: 50 }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,110,180,0.8) 0%, rgba(200,120,255,0.5) 30%, rgba(92,232,245,0.3) 60%, transparent 80%)',
        }}
      />
    </AbsoluteFill>
  );
};

// ========== クロマティックアベレーション付きテキスト ==========
const ChromaText: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  offset?: number;
  style?: React.CSSProperties;
}> = ({ text, fontSize, color = '#fff', offset = 4, style }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      {/* 赤 (左にずらす) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: -offset,
          fontSize,
          fontWeight: 900,
          fontFamily: '"Mochiy Pop One", sans-serif',
          color: '#FF4466',
          opacity: 0.7,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      {/* 青 (右にずらす) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: offset,
          fontSize,
          fontWeight: 900,
          fontFamily: '"Mochiy Pop One", sans-serif',
          color: '#44CCFF',
          opacity: 0.7,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
      {/* メイン */}
      <div
        style={{
          position: 'relative',
          fontSize,
          fontWeight: 900,
          fontFamily: '"Mochiy Pop One", sans-serif',
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ========== 浮遊するキラキラ星（量・速度強化） ==========
const FloatingStars: React.FC = () => {
  const frame = useCurrentFrame();
  const stars = Array.from({ length: 30 }, (_, i) => {
    const x = (i * 137.5) % 1080;
    const speed = 1.5 + (i % 5) * 0.5;
    const y = ((frame * speed + i * 150) % 2300) - 200;
    const size = 18 + (i % 5) * 14;
    const opacity = interpolate((frame * speed + i * 150) % 2300, [0, 200, 1900, 2300], [0, 0.9, 0.9, 0]);
    const rotation = frame * (i % 2 === 0 ? 3 : -3) + i * 45;
    const colors = Object.values(COLORS);
    const color = colors[i % colors.length];
    return { x, y, size, opacity, rotation, color };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            bottom: s.y,
            fontSize: s.size,
            opacity: s.opacity,
            transform: `rotate(${s.rotation}deg)`,
            color: s.color,
            filter: `drop-shadow(0 0 12px ${s.color}) drop-shadow(0 0 4px ${s.color})`,
          }}
        >
          {['⭐', '✨', '💫', '🌟', '⚡', '💥'][i % 6]}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ========== スクリーンシェイク ==========
const useScreenShake = (triggerFrame: number, duration: number = 15, intensity: number = 12) => {
  const frame = useCurrentFrame();
  const progress = frame - triggerFrame;
  if (progress < 0 || progress > duration) return { x: 0, y: 0 };
  const decay = 1 - progress / duration;
  const x = Math.sin(progress * 2.5) * intensity * decay;
  const y = Math.cos(progress * 3.3) * intensity * 0.6 * decay;
  return { x, y };
};

// ========== メインコンポジション Scene 1 ==========
export const Scene1_Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // アバタースプリング（より強いオーバーシュート）
  const avatarScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 7, stiffness: 220, mass: 0.7 },
  });
  const avatarOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // なるりれ名前
  const nameScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 7, stiffness: 260, mass: 0.6 },
  });
  const nameOpacity = interpolate(frame, [25, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // イベントバナー
  const bannerScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.8 },
  });
  const bannerOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 背景グラデーション
  const bgHue = interpolate(frame, [0, 300], [310, 380]);

  // アバターのふわふわ浮遊
  const float = Math.sin(frame / 18) * 10;

  // スクリーンシェイク
  const shake1 = useScreenShake(25, 12, 14); // 名前登場時
  const shake2 = useScreenShake(55, 10, 10); // バナー登場時

  const shakeX = shake1.x + shake2.x;
  const shakeY = shake1.y + shake2.y;

  // クロマ効果（タイトル登場直後）
  const chromaOffset = interpolate(frame, [25, 35, 55], [8, 3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 背景パルス
  const bgPulse = (Math.sin(frame / 15) + 1) / 2;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, hsl(${bgHue}, 85%, 68%) 0%, hsl(${bgHue + 30}, 90%, 80%) 40%, hsl(${bgHue + 65}, 80%, 65%) 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* ===== 背景レイヤー ===== */}

      {/* パルスするラジアルグロー */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${700 + bgPulse * 200}px`,
            height: `${700 + bgPulse * 200}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
            transition: 'none',
          }}
        />
      </AbsoluteFill>

      {/* キラキラ星 */}
      <FloatingStars />

      {/* ===== エフェクトレイヤー ===== */}
      {/* アバター登場フラッシュ */}
      <ImpactFlash triggerFrame={5} color="rgba(255,255,255,0.9)" />
      {/* 名前登場スピードライン */}
      <SpeedLines triggerFrame={25} duration={20} />
      {/* バナー登場ラジアルバースト */}
      <RadialBurst triggerFrame={55} />
      {/* バナー登場フラッシュ */}
      <ImpactFlash triggerFrame={55} color="rgba(255,110,180,0.5)" />

      {/* ===== メインコンテンツ ===== */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 28,
          paddingBottom: 60,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* ライバーアバター */}
        <div
          style={{
            transform: `scale(${avatarScale}) translateY(${avatarOpacity > 0 ? float : 0}px)`,
            opacity: avatarOpacity,
          }}
        >
          <div style={{ position: 'relative', width: 580, height: 580 }}>
            {/* 外側のパルスリング */}
            <div
              style={{
                position: 'absolute',
                inset: -20 - bgPulse * 10,
                borderRadius: '50%',
                border: `4px solid rgba(255,110,180,${0.4 + bgPulse * 0.4})`,
                filter: `blur(${2 + bgPulse * 3}px)`,
              }}
            />
            <Img
              src={staticFile('assets/images-01/karaindaisuki.png')}
              style={{
                width: 580,
                height: 580,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '8px solid #fff',
                boxShadow: `0 0 ${50 + bgPulse * 30}px rgba(255,110,180,0.8), 0 0 ${80 + bgPulse * 40}px rgba(255,110,180,0.3)`,
              }}
            />
            {/* 虹色のコーニックリング */}
            <div
              style={{
                position: 'absolute',
                inset: -16,
                borderRadius: '50%',
                background: `conic-gradient(from ${frame * 2.5}deg, #FF6EB4, #FFE234, #5CE8F5, #C878FF, #FF8C42, #6AFFA0, #FF6EB4)`,
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 14px), black calc(100% - 14px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 14px), black calc(100% - 14px))',
                filter: `drop-shadow(0 0 ${6 + bgPulse * 6}px rgba(255,110,180,0.9))`,
              }}
            />
          </div>
        </div>

        {/* ライバー名（クロマアベレーション付き） */}
        <div
          style={{
            transform: `scale(${nameScale})`,
            opacity: nameOpacity,
            textAlign: 'center',
          }}
        >
          <ChromaText
            text="なるりれ🦚🍉"
            fontSize={140}
            color="#fff"
            offset={Math.round(chromaOffset)}
            style={{
              filter: `drop-shadow(0 6px 0 ${COLORS.pink}) drop-shadow(0 12px 20px rgba(255,110,180,0.5))`,
            }}
          />
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              fontFamily: '"Noto Sans JP", sans-serif',
              color: 'rgba(240, 91, 227, 0.95)',
              textShadow: `3px 3px 0 rgba(255,255,255,0.6), 0 0 20px rgba(240,91,227,0.5)`,
              marginTop: 8,
            }}
          >
            マイイベント開催！
          </div>
        </div>

        {/* イベント名バナー */}
        <div
          style={{
            transform: `scale(${bannerScale})`,
            opacity: bannerOpacity,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #FF6EB4, #C878FF, #5CE8F5)',
              borderRadius: 30,
              padding: '24px 52px',
              boxShadow: `0 0 ${40 + bgPulse * 30}px rgba(200,120,255,0.7), 0 16px 40px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,255,255,0.5)`,
              textAlign: 'center',
              border: '4px solid rgba(255,255,255,0.7)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* バナー内部の光沢 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
                borderRadius: '30px 30px 0 0',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                fontSize: 82,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#fff',
                textShadow: '3px 3px 0 rgba(0,0,0,0.15)',
                lineHeight: 1.4,
              }}
            >
              ミニバ集めて
            </div>
            <div
              style={{
                fontSize: 62,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#fff',
                textShadow: '3px 3px 0 rgba(0,0,0,0.15)',
                lineHeight: 1.4,
              }}
            >
              TikTokユニバースを
            </div>
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#FFE234',
                textShadow: `3px 3px 0 #FF8C42, 0 0 ${20 + bgPulse * 15}px rgba(255,226,52,0.8)`,
                lineHeight: 1.8,
              }}
            >
              集めよう！✨
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
