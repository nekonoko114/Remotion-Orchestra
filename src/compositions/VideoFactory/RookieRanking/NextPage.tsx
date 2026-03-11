import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const NextPage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 下から上へのスライドインのアニメーション
  const translateY = spring({
    frame,
    fps,
    config: { damping: 15 },
    from: 500,
    to: 0,
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#2c3e50' }}>
      <div style={{ transform: `translateY(${translateY}px)`, textAlign: 'center' }}>
        <h2 style={{ fontSize: 80, fontWeight: 'bold', margin: '0 0 60px 0', color: '#ecf0f1' }}>
          アイコン使用OK？
        </h2>
        <h2 style={{ fontSize: 90, fontWeight: 'bold', margin: 0, color: '#e74c3c' }}>
          銀のランクインは誰だ？
        </h2>
      </div>
    </AbsoluteFill>
  );
};
