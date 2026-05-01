import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { HolographicHUD } from '../../../components/effects/HolographicHUD';
import { UNITY_THEME } from './theme';



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
  const hudColor = frame % 10 < 5 ? UNITY_THEME.colors.neonRed : '#ff5555';

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
            fontFamily: UNITY_THEME.fonts.main,
            fontSize: 650,
            fontWeight: '900',
            color: UNITY_THEME.colors.textWhite,
            textShadow: `0 0 30px ${UNITY_THEME.colors.neonRed}, 0 0 80px ${UNITY_THEME.colors.neonRed}`,
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
            backgroundColor: UNITY_THEME.colors.neonRed,
            boxShadow: `0 0 30px ${UNITY_THEME.colors.neonRed}`,
            top: interpolate(frame % 45, [0, 45], [0, 100]) + '%',
            opacity: 0.8,
          }}
        />

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
