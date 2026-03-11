import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // 簡易的なアニメーション用
  const opacity = Math.min(1, frame / (fps * 1));

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
      <div style={{ opacity, textAlign: 'center' }}>
        <h1 style={{ fontSize: 80, fontWeight: 'bold', margin: '0 0 40px 0' }}>
          第○回
        </h1>
        <h2 style={{ fontSize: 120, fontWeight: 'bold', margin: 0, color: '#f39c12' }}>
          新人王
        </h2>
        <p style={{ fontSize: 50, marginTop: 40, letterSpacing: 5 }}>
          202X.0X.0X
        </p>
      </div>
    </AbsoluteFill>
  );
};
