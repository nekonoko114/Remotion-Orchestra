import React from 'react';
import { AbsoluteFill, Video, staticFile } from 'remotion';

type Props = {
  opacity?: number;
  brightness?: number;
  hueRotate?: string;
  playbackRate?: number;
};

const UNITY_THEME = '#ff1e1e'; // Neon Red

export const CyberBackground: React.FC<Props> = ({
  opacity = 0.7,
  brightness = 1.0,
  hueRotate = '0deg',
  playbackRate = 1.0,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <Video
        src={staticFile('assets/pixabay/videos/webm/pixabay_tunnel_loop_science_fiction_futuristic_fantasy_227152.webm')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity,
          filter: `hue-rotate(${hueRotate}) contrast(1.1) brightness(${brightness})`,
        }}
        muted
        loop
        playbackRate={playbackRate}
      />

      {/* Cyber Grid Overlay */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${UNITY_THEME}22 1px, transparent 1px), linear-gradient(90deg, ${UNITY_THEME}22 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      {/* Split Cyber Overlay (Cyan / Red) */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to right, rgba(0, 255, 255, 0.08) 0%, transparent 50%, rgba(255, 30, 30, 0.08) 100%)',
        mixBlendMode: 'screen',
        zIndex: 2,
      }} />

      {/* Lighting Vinette Overlay */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.2) 100%)',
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};
