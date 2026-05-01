import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

/**
 * MOCCHI-RICH PRO EDITION (FIXED & ADHERED)
 * 「もっちリッチ」な質感とプロの演出を融合させ、ノドの接着も完璧にした3Dブックシステム
 */

// 15ページのデータを自動生成
const PAGES = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  title: `STRATEGY #${String(i + 1).padStart(2, '0')}`,
  color1: `hsl(${(i * 360) / 15}, 75%, 60%)`, // ページ数に合わせて色相を調整
  color2: `hsl(${(i * 360) / 15 + 40}, 85%, 45%)`,
  text: `Chapter ${i + 1}: Professional Motion Graphics with Remotion Pro Engine.`,
}));

const PAGE_DURATION = 40;
const START_DELAY = 40;

const styles = {
  viewport: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050508',
    overflow: 'hidden',
  },
  pageBase: {
    width: '1080px',
    height: '1520px',
    position: 'absolute' as const,
    top: 0,
    boxSizing: 'border-box' as const,
    backfaceVisibility: 'hidden' as const,
    borderRadius: '40px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
};

// --- もっちリッチなページコンポーネント ---
const MocchiPage: React.FC<{ 
  page: typeof PAGES[0]; 
  progress: number;
  isBack?: boolean; 
}> = ({ page, progress, isBack }) => {
  const angleRad = (progress * 180 * Math.PI) / 180;
  const brightness = isBack 
    ? interpolate(Math.cos(angleRad), [-1, 0, 1], [0.85, 0.45, 0.25])
    : interpolate(Math.cos(angleRad), [-1, 0, 1], [0.15, 0.5, 1]);

  return (
    <div style={{ 
      ...styles.pageBase, 
      background: `linear-gradient(135deg, ${page.color1} 0%, ${page.color2} 100%)`,
      filter: `brightness(${brightness})`,
      transform: isBack ? 'rotateY(180deg)' : 'none',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '80px',
      boxShadow: isBack 
        ? 'inset 40px 0 80px rgba(0,0,0,0.5)' 
        : 'inset -40px 0 80px rgba(0,0,0,0.4)',
    }}>
      <div style={{ 
        transform: isBack ? 'scaleX(-1)' : 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '85px', fontWeight: '900', color: 'white', 
          textShadow: '0 15px 30px rgba(0,0,0,0.4)', letterSpacing: '4px'
        }}>
          {page.title}
        </h1>
        <div style={{ 
          width: '120px', height: '8px', backgroundColor: 'white', 
          margin: '45px 0', borderRadius: '4px', boxShadow: '0 0 15px rgba(255,255,255,0.3)'
        }} />
        <p style={{ 
          fontSize: '42px', color: 'rgba(255,255,255,0.95)', 
          fontWeight: '700', lineHeight: 1.4, maxWidth: '90%'
        }}>
          {page.text}
        </p>
      </div>

      {!isBack && (
        <div style={{
          position: 'absolute', top: 0, 
          left: `${interpolate(progress, [0, 1], [-120, 250])}%`,
          width: '100%', height: '100%',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)',
          transform: 'skewX(-25deg)',
          pointerEvents: 'none',
          opacity: interpolate(progress, [0, 0.4, 0.7], [0, 1, 0]),
        }} />
      )}
    </div>
  );
};

export const BookFlipSample: React.FC = () => {
  const frame = useCurrentFrame();
  const perspective = 3000;

  const totalFlipFrames = PAGES.length * PAGE_DURATION;
  // ★ extrapolateRight のスペルミスを修正済
  const overallProgress = interpolate(frame, [START_DELAY, START_DELAY + totalFlipFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp' 
  });

  const camScale = interpolate(overallProgress, [0, 0.5, 1], [0.68, 0.64, 0.68]);
  const camRotateX = interpolate(overallProgress, [0, 1], [16, 10]);
  const camRotateY = interpolate(overallProgress, [0, 1], [-19, -13]);
  const camTranslateY = interpolate(overallProgress, [0, 1], [0, 60]);

  const bookX = -10;

  return (
    <AbsoluteFill style={{ ...styles.viewport, perspective: `${perspective}px` }}>
      {/* カメラレイヤー */}
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transformStyle: 'preserve-3d' as const,
        transform: `scale(${camScale}) rotateX(${camRotateX}deg) rotateY(${camRotateY}deg) translateY(${camTranslateY}px)`,
      }}>
        
        {/* ブック本体 */}
        <div style={{
          width: '800px', height: '1400px',
          position: 'relative',
          transformStyle: 'preserve-3d' as const,
          transform: `translateX(${bookX}px)`,
        }}>
          
          {/* 背表紙のエフェクト */}
          <div style={{
            position: 'absolute', left: 0, top: 0, width: '6px', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 0 30px rgba(0,0,0,1)',
            zIndex: 1000, transform: 'translateZ(15px)',
          }} />

          {/* 右の台紙（ベース） */}
          <div style={{
            ...styles.pageBase, right: 0, backgroundColor: '#0a0a0f',
            border: '2px solid #1a1a2a', transform: 'translateZ(-20px)',
            boxShadow: '40px 40px 100px rgba(0,0,0,0.8)',
          }} />

          {PAGES.map((page, i) => {
            const startFrame = START_DELAY + i * PAGE_DURATION;
            const endFrame = startFrame + PAGE_DURATION;

            // 「もっちり」したイージング
            const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              easing: Easing.bezier(0.33, 0, 0.67, 1),
            });

            // 物理演算演出
            const rotationY = progress * -180;
            // ★ ノドが浮いて見えないよう、X軸のしなり（ねじれ）をマイルドに抑制済
            const rotationX = interpolate(progress, [0, 0.45, 1], [0, 2, 0]); 
            // ★ zLift（全体を浮浮かせる処理）を完全に廃止済
            // ★ もっちり感を維持するため scale のみ適用
            const elasticScale = interpolate(progress, [0, 0.5 , 1], [1, 1.05, 1]);

            const isFlipped = frame > endFrame;
            const isCurrentlyFlipping = frame >= startFrame && frame <= endFrame;

            const zIndex = isCurrentlyFlipping ? 1000 : (isFlipped ? i + 1 : PAGES.length - i);
            
            // ★【接着ロジック修正点】
            // 右側のスタックの高さ（めくる前）と、左側のスタックの高さ（めくった後）を計算し、
            // めくりの進行度(progress)に合わせてZ軸（厚み）をスムーズにスライド移動させる
            const startStackZ = (PAGES.length - i) * 0.8;
            const endStackZ = i * 0.8;
            const currentStackZ = interpolate(progress, [0, 1], [startStackZ, endStackZ]);

            const nextFrameDist = frame - startFrame;
            const nextZoom = isCurrentlyFlipping 
              ? interpolate(nextFrameDist, [0, PAGE_DURATION], [0.98, 1.0]) 
              : isFlipped ? 1.0 : 0.98;

            return (
              <div
                key={page.id}
                style={{
                  width: '800px', height: '1400px',
                  position: 'absolute', right: 0,
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d' as const,
                  // ★ zLift を外し、currentStackZ を適用
                  transform: `translateZ(${currentStackZ}px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) scale(${elasticScale * (isCurrentlyFlipping ? 1 : nextZoom)})`,
                  zIndex,
                }}
              >
                {/* 表面 */}
                <MocchiPage page={page} progress={progress} isBack={false} />
                {/* 裏面 */}
                <MocchiPage page={page} progress={progress} isBack={true} />
              </div>
            );
          })}
        </div>
      </div>

      {/* プログレスバー（高級感演出） */}
      <div style={{ position: 'absolute', bottom: '100px', width: '70%', height: '2px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <div style={{
          width: `${overallProgress * 100}%`, height: '100%',
          backgroundColor: '#00d2ff', boxShadow: '0 0 20px #00d2ff',
          transition: 'width 0.2s linear',
        }} />
      </div>
    </AbsoluteFill>
  );
};