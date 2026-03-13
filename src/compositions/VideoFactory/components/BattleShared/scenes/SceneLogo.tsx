import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
} from 'remotion';

export const SceneLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 180], [0.95, 1.05]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Img src={staticFile('jol-logo-800.png')} style={{ width: 800, opacity, transform: `scale(${scale})`, filter: 'drop-shadow(0 0 80px rgba(255,255,255,0.6))' }} />
    </AbsoluteFill>
  );
};
