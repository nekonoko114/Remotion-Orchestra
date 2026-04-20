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
  OffthreadVideo
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
    [triggerFrame, triggerFrame + 2, triggerFrame + 8],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ background: color, opacity, pointerEvents: 'none', zIndex: 999 }} />
  );
};

// ===== マンガ風 POW! バースト =====
const PowBurst: React.FC<{ x: number; y: number; triggerFrame: number; color: string }> = ({
  x, y, triggerFrame, color,
}) => {
  const frame = useCurrentFrame();
  const progress = frame - triggerFrame;
  if (progress < 0) return null;

  const scale = spring({
    frame: progress,
    fps: 60,
    config: { damping: 8, stiffness: 250, mass: 0.5 },
  });
  const opacity = interpolate(progress, [0, 3, 30, 45], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (opacity <= 0) return null;

  // 星型 SVG
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const r = i % 2 === 0 ? 80 : 45;
    return `${Math.cos(angle) * r},${Math.sin(angle) * r}`;
  }).join(' ');

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <svg width="200" height="200" viewBox="-100 -100 200 200">
        <polygon points={points} fill={color} opacity={0.85} />
        <polygon
          points={points}
          fill="none"
          stroke="#fff"
          strokeWidth={3}
          opacity={0.7}
        />
      </svg>
    </div>
  );
};

// ===== スクリーンシェイク =====
const useScreenShake = (triggerFrame: number, duration = 12, intensity = 14) => {
  const frame = useCurrentFrame();
  const p = frame - triggerFrame;
  if (p < 0 || p > duration) return { x: 0, y: 0 };
  const decay = 1 - p / duration;
  return {
    x: Math.sin(p * 2.8) * intensity * decay,
    y: Math.cos(p * 3.5) * intensity * 0.6 * decay,
  };
};

// ===== ルームカウンター（数字が転がり上がる） =====
const CounterNumber: React.FC<{ targetValue: number; startFrame: number }> = ({
  targetValue,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  if (elapsed < 0) return <span>0</span>;

  // 0→targetValueをイーズアウトで補間
  const progress = interpolate(elapsed, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const current = Math.round(progress * targetValue);

  return <span>{current.toLocaleString()}</span>;
};

// ===== インパクトルールカード =====
const RuleCard: React.FC<{
  emoji: string;
  children: React.ReactNode;
  delay: number;
  color: string;
  direction?: 'left' | 'right';
}> = ({ emoji, children, delay, color, direction = 'left' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 強いオーバーシュートスプリング
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 7, stiffness: 280, mass: 0.6 },
  });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideX = interpolate(frame, [delay, delay + 16], [direction === 'left' ? -200 : 200, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });

  // 登場後の揺れ
  const settleWobble =
    frame > delay + 16 && frame < delay + 35
      ? Math.sin((frame - delay - 16) * 0.8) * 3 * (1 - (frame - delay - 16) / 19)
      : 0;

  // 浮遊
  const floatY = frame > delay + 35 ? Math.sin((frame - delay) / 22) * 5 : 0;

  // 枠の発光パルス
  const pulse = (Math.sin(frame / 10 + delay) + 1) / 2;

  return (
    <div
      style={{
        transform: `scale(${scale}) translateX(${slideX + settleWobble}px) translateY(${floatY}px)`,
        opacity,
        width: '100%',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 22,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          boxShadow: `0 ${8 + pulse * 6}px ${32 + pulse * 16}px rgba(0,0,0,0.15), 6px 0 0 ${color} inset, 0 0 0 2px ${color}44`,
          border: '2px solid rgba(255,255,255,0.9)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* カード内横帯カラー */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />
        <span style={{
          fontSize: 60,
          filter: `drop-shadow(0 2px 8px ${color})`,
        }}>
          {emoji}
        </span>
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            fontFamily: '"Mochiy Pop One", sans-serif',
            color: '#222',
            lineHeight: 1.3,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// ===== ミニバ＆ユニバ アイコン（インパクト版） =====
const ItemShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const minibaScale = spring({ frame: frame - 20, fps, config: { damping: 6, stiffness: 300, mass: 0.5 } });
  const minibaOpacity = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const numberScale = spring({ frame: frame - 55, fps, config: { damping: 6, stiffness: 340, mass: 0.5 } });
  const numberOpacity = interpolate(frame, [55, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const arrowScale = spring({ frame: frame - 95, fps, config: { damping: 8, stiffness: 280 } });
  const arrowOpacity = interpolate(frame, [95, 108], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const univaScale = spring({ frame: frame - 120, fps, config: { damping: 6, stiffness: 300, mass: 0.5 } });
  const univaOpacity = interpolate(frame, [120, 132], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pulse = (Math.sin(frame / 8) + 1) / 2;

  // ミニバのバウンス
  const minibaBounce = frame > 30 ? Math.sin((frame - 30) / 12) * 10 : 0;
  const univaBounce = frame > 132 ? Math.sin((frame - 132) / 12) * 10 : 0;

  return (
    <div style={{ position: 'relative' }}>
      {/* POW バースト */}
      <PowBurst x={100} y={-20} triggerFrame={20} color={COLORS.pink} />
      <PowBurst x={700} y={-20} triggerFrame={120} color={COLORS.cyan} />

      {/* フラッシュ */}
      <ImpactFlash triggerFrame={20} color="rgba(255,110,180,0.5)" />
      <ImpactFlash triggerFrame={55} color="rgba(255,226,52,0.5)" />
      <ImpactFlash triggerFrame={120} color="rgba(92,232,245,0.5)" />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '16px 0',
        }}
      >
        {/* ミニバ */}
        <div
          style={{
            transform: `scale(${minibaScale}) translateY(${minibaBounce}px)`,
            opacity: minibaOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 14,
              boxShadow: `0 0 ${24 + pulse * 24}px rgba(255,110,180,${0.6 + pulse * 0.4}), 0 8px 20px rgba(0,0,0,0.15)`,
              border: `3px solid rgba(255,110,180,${0.4 + pulse * 0.4})`,
            }}
          >
            <Img src={staticFile('assets/images/みにば.png')} style={{ width: 160, height: 160, objectFit: 'contain' }} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, fontFamily: '"Mochiy Pop One", sans-serif', color: '#fff', textShadow: `3px 3px 0 ${COLORS.pink}` }}>
            ミニバ
          </div>
        </div>

        {/* × 44,999 */}
        <div
          style={{
            transform: `scale(${numberScale})`,
            opacity: numberOpacity,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 50, fontWeight: 900, fontFamily: '"Mochiy Pop One", sans-serif', color: '#FFE234', textShadow: `3px 3px 0 #FF8C42, 0 0 20px rgba(255,226,52,0.6)`, lineHeight: 1 }}>
            ×
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              fontFamily: '"Mochiy Pop One", sans-serif',
              color: '#fff',
              textShadow: `4px 4px 0 ${COLORS.purple}, 0 0 ${20 + pulse * 20}px rgba(200,120,255,0.8)`,
              lineHeight: 1.1,
              marginTop: 4,
            }}
          >
            <CounterNumber targetValue={44999} startFrame={55} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: '"Mochiy Pop One", sans-serif', color: 'rgba(255,255,255,0.8)' }}>
            個 集めて
          </div>
        </div>

        {/* → */}
        <div style={{ transform: `scale(${arrowScale})`, opacity: arrowOpacity }}>
          <div style={{ fontSize: 64, color: '#FFE234', textShadow: `3px 3px 0 #FF8C42, 0 0 20px rgba(255,226,52,0.7)` }}>
            →
          </div>
        </div>

        {/* ユニバ */}
        <div
          style={{
            transform: `scale(${univaScale}) translateY(${univaBounce}px)`,
            opacity: univaOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 14,
              boxShadow: `0 0 ${24 + pulse * 24}px rgba(92,232,245,${0.6 + pulse * 0.4}), 0 8px 20px rgba(0,0,0,0.15)`,
              border: `3px solid rgba(92,232,245,${0.4 + pulse * 0.4})`,
            }}
          >
            <Img src={staticFile('assets/images/ユニバ.png')} style={{ width: 160, height: 160, objectFit: 'contain' }} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, fontFamily: '"Mochiy Pop One", sans-serif', color: '#fff', textShadow: `3px 3px 0 ${COLORS.cyan}` }}>
            ユニバ
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== メイン Scene 2 =====
export const Scene2_Rules: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // タイトル（強めのスプリング）
  const titleScale = spring({ frame, fps, config: { damping: 7, stiffness: 260, mass: 0.6 } });
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const bgHue = interpolate(frame, [0, 550], [195, 285]);
  const bgHue2 = interpolate(frame, [0, 500], [255, 300]);
  const bgPulse = (Math.sin(frame / 20) + 1) / 2;

  const ctaScale = spring({ frame: frame - 550, fps, config: { damping: 7, stiffness: 220 } });
  const ctaOpacity = interpolate(frame, [550, 566], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ctaPulse = (Math.sin(frame / 10) + 1) / 2;

  // タイトル・カードごとのシェイク
  const shake0 = useScreenShake(0, 10, 12);
  const shake150 = useScreenShake(150, 8, 10);
  const shake200 = useScreenShake(200, 8, 8);
  const shake550 = useScreenShake(550, 10, 12);
  const shakeX = shake0.x + shake150.x + shake200.x + shake550.x;
  const shakeY = shake0.y + shake150.y + shake200.y + shake550.y;

  // コンテンツのフェードアウト（動画が目立つタイミングでテキストを消す）
  const contentOpacity = interpolate(frame, [500, 550], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* 背景動画 */}
      <AbsoluteFill style={{ mixBlendMode: 'screen' }} >
        <OffthreadVideo
          src={staticFile('assets/video/ssstik.io_1776221211598.mov')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', 
          }}
          volume={0}
        />
      </AbsoluteFill>

      {/* グラデーションオーバーレイ */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, hsla(${bgHue}, 80%, 65%, 0.65) 0%, hsla(${bgHue2}, 88%, 75%, 0.65) 100%)`,
          opacity:0.5, 
          zIndex: 1,
        }}
      />
      {/* 背景ぼかし丸 */}
      {[...Array(6)].map((_, i) => {
        const colorList = [COLORS.pink, COLORS.yellow, COLORS.cyan, COLORS.purple, COLORS.orange, COLORS.green];
        const xs = [60, 920, 180, 1020, 520, 80];
        const ys = [180, 380, 1640, 1180, 820, 1020];
        const sizes = [220, 200, 270, 180, 240, 210];
        const floatOffset = Math.sin(frame / 35 + i * 1.2) * 18;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: xs[i],
              top: ys[i] + floatOffset,
              width: sizes[i],
              height: sizes[i],
              borderRadius: '50%',
              background: colorList[i],
              opacity: 0.18,
              filter: 'blur(50px)',
            }}
          />
        );
      })}

      {/* 斜めストライプ模様（インパクト感） */}
      <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.04 }}>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <line
              key={i}
              x1={i * 80 - 500}
              y1={0}
              x2={i * 80 + 500}
              y2={1920}
              stroke="#fff"
              strokeWidth={20}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* フラッシュ */}
      <ImpactFlash triggerFrame={0} color="rgba(255,255,255,0.85)" />
      <ImpactFlash triggerFrame={150} color="rgba(255,110,180,0.45)" />
      <ImpactFlash triggerFrame={200} color="rgba(255,226,52,0.45)" />
      <ImpactFlash triggerFrame={500} color="rgba(92,232,245,0.5)" />

      {/* POW バースト */}
      <PowBurst x={900} y={100} triggerFrame={150} color={COLORS.pink} />
      <PowBurst x={80} y={1000} triggerFrame={250} color={COLORS.yellow} />
      <PowBurst x={950} y={1300} triggerFrame={300} color={COLORS.green} />

      {/* メインコンテンツ */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 55px',
          gap: 22,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
          zIndex: 2,
          opacity: contentOpacity,
        }}
      >
        {/* タイトル */}
        <div
          style={{
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #FF6EB4, #C878FF, #5CE8F5)',
              borderRadius: 25,
              padding: '14px 52px',
              display: 'inline-block',
              boxShadow: `0 0 ${30 + bgPulse * 20}px rgba(200,120,255,0.6), 0 10px 30px rgba(0,0,0,0.2)`,
              border: '4px solid rgba(255,255,255,0.65)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 光沢 */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)', borderRadius: '25px 25px 0 0' }} />
            <div
              style={{
                fontSize: 80,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#fff',
                textShadow: `3px 3px 0 rgba(0,0,0,0.15), 0 0 20px rgba(255,255,255,0.5)`,
                position: 'relative',
              }}
            >
              🎯 マイイベント詳細
            </div>
          </div>
        </div>

        {/* アイテム交換ビジュアル */}
        <div style={{ width: '100%', position: 'relative' }}>
          <ItemShowcase />
        </div>

        {/* ルールカード */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          <RuleCard emoji="🎁" color={COLORS.pink} delay={150} direction="left">
            1コインのミニバを
          </RuleCard>

          <RuleCard emoji="💰" color={COLORS.yellow} delay={200} direction="right">
            <span>
              <span style={{ fontSize: 54, fontWeight: 900, color: COLORS.purple, textShadow: `2px 2px 0 rgba(0,0,0,0.1), 0 0 15px rgba(200,120,255,0.5)` }}>
                44,999
              </span>
              個 集めて
            </span>
          </RuleCard>

          <RuleCard emoji="🌍" color={COLORS.cyan} delay={250} direction="left">
            みんなでユニバを作ろう！
          </RuleCard>

          <RuleCard emoji="📅" color={COLORS.green} delay={300} direction="right">
            4/26（土）〜 4/28（月）
          </RuleCard>
        </div>

        {/* CTA */}
        <div
          style={{
            transform: `scale(${ctaScale})`,
            opacity: ctaOpacity,
            textAlign: 'center',
            marginTop: 8,
            width: '100%',
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, hsl(${330 + ctaPulse * 30}, 90%, 60%), hsl(${270 + ctaPulse * 30}, 90%, 62%), hsl(${200 + ctaPulse * 30}, 90%, 60%))`,
              borderRadius: 28,
              padding: '20px 50px',
              boxShadow: `0 0 ${35 + ctaPulse * 25}px rgba(200,120,255,${0.55 + ctaPulse * 0.3}), 0 12px 28px rgba(0,0,0,0.2)`,
              border: '4px solid rgba(255,255,255,0.7)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)', borderRadius: '28px 28px 0 0' }} />
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                fontFamily: '"Mochiy Pop One", sans-serif',
                color: '#fff',
                textShadow: '3px 3px 0 rgba(0,0,0,0.15)',
                position: 'relative',
              }}
            >
              みんな応援してね！🎉
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
