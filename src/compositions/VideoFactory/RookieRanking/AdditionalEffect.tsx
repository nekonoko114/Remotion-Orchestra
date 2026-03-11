import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const AdditionalEffect: React.FC = () => {
  const frame = useCurrentFrame();

  // グリッチ風の点滅エフェクトモック
  const isGlitch = frame % 10 < 2;

  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: isGlitch ? '#e74c3c' : '#bdc3c7',
      transition: 'background-color 0.1s'
    }}>
      <h1 style={{ 
        fontSize: 150, 
        fontWeight: 'bold', 
        color: '#2c3e50',
        transform: isGlitch ? 'translate(10px, -10px)' : 'translate(0, 0)'
      }}>
        演出プレースホルダー
      </h1>
      <p style={{ fontSize: 50, marginTop: 20 }}>
        グリッチ / ライトニング系
      </p>
    </AbsoluteFill>
  );
};
