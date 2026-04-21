import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { HolographicHUD } from '../../../components/effects/HolographicHUD';
import { loadFont } from '@remotion/google-fonts/Orbitron';

const { fontFamily } = loadFont();

// Unity Colors
const UNITY_THEME = '#ff1e1e'; // Neon Red
const UNITY_LIME  = '#00ffff'; // Neon Blue

type Props = {
  rank: number;
};

export const LiverScan: React.FC<Props> = ({ rank }) => {
  const frame = useCurrentFrame();

  // Animations
  const opacity = interpolate(frame, [0, 10, 80, 90], [0, 1, 1, 0]);
  const hudScale = interpolate(frame, [0, 90], [0.8, 1.2]);
  
  const rankStr = rank.toString().padStart(2, '0');
  
  // HUD Color pulses with frame
  const hudColor = frame % 10 < 5 ? UNITY_THEME : '#ff5555';

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      {/* 共通の背景レイヤーを使用 */}

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
        }}
      >
        {/* HUD Scaling */}
        <div style={{ transform: `scale(${hudScale})` }}>
          <HolographicHUD color={hudColor} text="LIVER DATA SCANNING..." />
        </div>

        {/* Big Rank Number */}
        <div
          style={{
            position: 'absolute',
            fontFamily,
            fontSize: 650,
            fontWeight: '900',
            color: '#fff',
            textShadow: `0 0 30px ${UNITY_THEME}, 0 0 80px ${UNITY_THEME}`,
            opacity: interpolate(frame, [0, 20], [0, 0.4], { extrapolateRight: 'clamp' }),
            transform: `scale(${interpolate(frame, [0, 90], [1.2, 1])})`,
            fontStyle: 'italic',
          }}
        >
          {rankStr}
        </div>

        {/* Scanning Line */}
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: 10,
            backgroundColor: UNITY_THEME,
            boxShadow: `0 0 30px ${UNITY_THEME}`,
            top: interpolate(frame % 45, [0, 45], [0, 100]) + '%',
            opacity: 0.8,
          }}
        />

        {/* Bottom Status Labels */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: UNITY_LIME,
            fontFamily: 'monospace',
            fontSize: 120,
            letterSpacing: 12,
            textShadow: `0 0 15px ${UNITY_LIME}`,
          }}
        >
          {frame < 30 ? 'ENCRYPTING...' : frame < 60 ? 'DECRYPTING...' : 'TARGET IDENTIFIED'}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
