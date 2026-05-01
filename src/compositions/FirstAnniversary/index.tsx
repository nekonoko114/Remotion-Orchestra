import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const FirstAnniversary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: 80, fontWeight: 'bold' }}>
        First Anniversary
      </h1>
      <p style={{ fontSize: 40, marginTop: 20 }}>
        Frame: {frame} / {durationInFrames}
      </p>
    </AbsoluteFill>
  );
};
