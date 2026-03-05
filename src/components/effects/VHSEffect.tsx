import type React from 'react';
import { random, useCurrentFrame } from 'remotion';

interface VHSEffectProps {
  children: React.ReactNode;
  showOverlay?: boolean; // PLAY文字や日付を表示するか
  intensity?: number; // ノイズの強さ
}

/**
 * 映像に古いビデオテープ（VHS）のような質感を与える
 */
export const VHSEffect: React.FC<VHSEffectProps> = ({
  children,
  showOverlay = true,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* メインコンテンツ（わずかに彩度を落とし、コントラストを調整） */}
      <div
        style={{
          filter: `contrast(1.1) brightness(1.1) saturate(0.8) blur(${0.5 * intensity}px)`,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>

      {/* 走査線（スキャンライン）層 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 4px, 3px 100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* ノイズ/粒子層 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05 * intensity,
          backgroundColor: 'white',
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          // フレームごとにランダムに位置をずらしてノイズを動かす
          transform: `translate(${random(frame) * 10}px, ${random(frame + 1) * 10}px)`,
          pointerEvents: 'none',
          zIndex: 11,
        }}
      />

      {/* VHSオーバーレイ（PLAY, 00:00:00 など） */}
      {showOverlay && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            color: '#fff',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 30,
            textShadow: '2px 2px #000',
            zIndex: 20,
            opacity: 0.8,
          }}
        >
          <div>PLAY ▶</div>
          <div style={{ marginTop: 10 }}>
            {String(Math.floor(frame / (30 * 60))).padStart(2, '0')}:
            {String(Math.floor((frame / 30) % 60)).padStart(2, '0')}:
            {String(frame % 30).padStart(2, '0')}
          </div>
        </div>
      )}
    </div>
  );
};
