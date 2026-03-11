import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // フェードイン
  const opacity = Math.min(1, frame / (fps * 2));

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
      <div style={{ opacity, textAlign: 'center' }}>
        {/* ロゴのプレースホルダー */}
        <div style={{ 
          width: 400, 
          height: 200, 
          border: '5px solid white', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: 40
        }}>
          <span style={{ fontSize: 60, color: 'white' }}>LOGO</span>
        </div>
        <h2 style={{ fontSize: 60, color: '#bdc3c7', margin: 0 }}>
          Thank you for watching
        </h2>
      </div>
    </AbsoluteFill>
  );
};
