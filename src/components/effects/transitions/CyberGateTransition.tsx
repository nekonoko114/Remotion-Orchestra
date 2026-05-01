import React from 'react';
import {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';
import {
  AbsoluteFill,
  interpolate,
  Easing,
  random,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Orbitron';

const { fontFamily } = loadFont();

export const cyberGateTransition = (options?: {
  color?: string;
  accentColor?: string;
}): TransitionPresentation<any> => {
  const color = options?.color || '#00ffff';
  const accentColor = options?.accentColor || '#ff0000';

  const component: React.FC<TransitionPresentationComponentProps<any>> = ({
    children,
    presentationProgress,
    presentationDirection,
  }) => {
    const progress = Easing.bezier(0.65, 0, 0.35, 1)(presentationProgress);

    // ==========================================
    // 1. 前のシーン（Exiting）の描画
    // ==========================================
    if (presentationDirection === 'exiting') {
      return (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          <AbsoluteFill style={{ opacity: progress < 0.5 ? 1 : 0 }}>
            {children}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }

    // ==========================================
    // 2. 次のシーン（Entering）とエフェクトの描画
    // ==========================================
    const isClosing = progress < 0.5;
    const gateProgress = isClosing
      ? interpolate(progress, [0, 0.48], [0, 1], { extrapolateRight: 'clamp' })
      : interpolate(progress, [0.52, 1], [1, 0], { extrapolateLeft: 'clamp' });

    const panelOffset = (1 - gateProgress) * 50;

    const impactIntensity = interpolate(
      progress,
      [0.48, 0.5, 0.52],
      [0, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const aberration = impactIntensity * 30;
    const shakeX = impactIntensity * (random('shakeX' + presentationProgress) - 0.5) * 40;
    const shakeY = impactIntensity * (random('shakeY' + presentationProgress) - 0.5) * 20;

    return (
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        
        {/* 次のシーンは、ゲートが開く瞬間（0.5以降）に表示する */}
        <AbsoluteFill
          style={{
            opacity: progress >= 0.5 ? 1 : 0, 
            transform: `translate(${shakeX}px, ${shakeY}px)`,
            filter: impactIntensity > 0 ? `contrast(1.1) brightness(${1 + impactIntensity * 0.4})` : 'none',
          }}
        >
          <AbsoluteFill style={{ transform: `translateX(${aberration}px)`, opacity: impactIntensity * 0.5 }}>
             {children}
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `translateX(${-aberration}px)`, opacity: impactIntensity * 0.5 }}>
             {children}
          </AbsoluteFill>
          <AbsoluteFill style={{ opacity: 1 - impactIntensity }}>
            {children}
          </AbsoluteFill>
        </AbsoluteFill>

        {/* HUD Gate - Left Panel (Cyan) */}
        <div style={{ position: 'absolute', top: 0, left: `-${panelOffset}%`, width: '50%', height: '100%', background: 'linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 90%, #2a2a2a 100%)', borderRight: `4px solid ${color}`, boxShadow: `10px 0 30px ${color}33, 0 0 60px ${presentationProgress > 0.4 && presentationProgress < 0.6 ? color : 'transparent'}`, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 40, opacity: gateProgress }}>
           <div style={{ width: '80%', height: 2, background: color, opacity: 0.3, marginBottom: 20 }} />
           <div style={{ fontFamily, fontSize: 24, color: color, letterSpacing: 4, textShadow: `0 0 10px ${color}`, opacity: 0.8 }}>
             {isClosing ? 'LOCKING...' : 'SYNCED'}
           </div>
           <div style={{ width: '40%', height: 1, background: color, opacity: 0.5, marginTop: 10 }} />
        </div>

        {/* HUD Gate - Right Panel (Red) */}
        <div style={{ position: 'absolute', top: 0, right: `-${panelOffset}%`, width: '50%', height: '100%', background: 'linear-gradient(-90deg, #0a0a0a 0%, #1a1a1a 90%, #2a2a2a 100%)', borderLeft: `4px solid ${accentColor}`, boxShadow: `-10px 0 30px ${accentColor}33, 0 0 60px ${presentationProgress > 0.4 && presentationProgress < 0.6 ? accentColor : 'transparent'}`, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 40, opacity: gateProgress }}>
           <div style={{ width: '80%', height: 2, background: accentColor, opacity: 0.3, marginBottom: 20 }} />
           <div style={{ fontFamily, fontSize: 24, color: accentColor, letterSpacing: 4, textShadow: `0 0 10px ${accentColor}`, opacity: 0.8 }}>
             V-0.42.SYS
           </div>
           <div style={{ width: '40%', height: 1, background: accentColor, opacity: 0.5, marginTop: 10 }} />
        </div>

        {/* Impact Flash overlays */}
        <AbsoluteFill style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`, opacity: impactIntensity * 0.8, zIndex: 110, pointerEvents: 'none' }} />
        <AbsoluteFill style={{ backgroundColor: '#fff', opacity: impactIntensity * 0.3, zIndex: 111, pointerEvents: 'none' }} />
      </AbsoluteFill>
    );
  };

  return { component, props: {} };
};