import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
} from 'remotion';
import { TransitionPresentationComponentProps, TransitionPresentation } from '@remotion/transitions';

const UNITY_LIME = '#00ffff';
const UNITY_THEME = '#d000ff';

const XII = "XII";
const III = "III";
const VI = "VI";
const IX = "IX";

// --- Sub-components for the sweep effect ---

const CelestialDial: React.FC<{ progress: number }> = ({ progress }) => {
  // 0.5付近で最も明るくなる
  const opacity = interpolate(progress, [0, 0.4, 0.6, 1], [0, 0.3, 0.3, 0], {
     extrapolateLeft: 'clamp',
     extrapolateRight: 'clamp',
  });
  
  const scale = interpolate(progress, [0, 1], [0.8, 1.2]);

  return (
    <AbsoluteFill style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      opacity,
      transform: `scale(${scale})`,
      pointerEvents: 'none',
    }}>
      <svg width="800" height="800" viewBox="0 0 800 800" style={{ filter: `drop-shadow(0 0 10px ${UNITY_THEME})` }}>
        {/* 外周リング */}
        <circle cx="400" cy="400" r="380" fill="none" stroke={UNITY_LIME} strokeWidth="1" opacity="0.5" />
        <circle cx="400" cy="400" r="350" fill="none" stroke={UNITY_THEME} strokeWidth="2" opacity="0.3" />
        
        {/* コンパス/魔法陣風の装飾 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 30}, 400, 400)`}>
            <line x1="400" y1="20" x2="400" y2="60" stroke={UNITY_LIME} strokeWidth="2" />
            <text 
              x="400" y="90" 
              fill={UNITY_LIME} 
              fontSize="24" 
              textAnchor="middle" 
              fontFamily="Cinzel"
              style={{ fontWeight: 'bold' }}
            >
              {i === 0 ? XII : i === 3 ? III : i === 6 ? VI : i === 9 ? IX : ''}
            </text>
          </g>
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <rect 
            key={i} 
            x="398" y="398" 
            width="4" height="350" 
            fill={UNITY_THEME} 
            transform={`rotate(${i * 90 + 45}, 400, 400)`} 
            opacity="0.1" 
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Stardust: React.FC<{ progress: number }> = ({ progress }) => {
  const rotation = progress * 360;
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: 0,
      y: -300 - Math.random() * 200,
      size: 2 + Math.random() * 6,
      speed: 0.8 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 40,
    }));
  }, [progress < 0.1]); // 最初の瞬間だけ生成

  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: `rotate(${rotation}deg)`,
      pointerEvents: 'none',
    }}>
      {particles.map((p) => {
        const pOpacity = interpolate(progress, [0, 0.8, 1], [0.8, 0.6, 0]);
        
        return (
          <div key={p.id} style={{
            position: 'absolute',
            left: `calc(50% + ${p.drift * progress}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: `0 0 ${p.size * 2}px ${UNITY_LIME}, 0 0 ${p.size * 4}px ${UNITY_THEME}`,
            opacity: pOpacity,
          }} />
        );
      })}
    </div>
  );
};

const CometHand: React.FC<{ progress: number }> = ({ progress }) => {
  const rotation = progress * 360;
  const needleGlow = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: `rotate(${rotation}deg)`,
      pointerEvents: 'none',
      opacity: needleGlow,
      zIndex: 200,
    }}>
      {/* 光のポインター本体 */}
      <div style={{
        position: 'absolute',
        bottom: '50%',
        left: '50%',
        width: 8,
        height: '60%',
        transform: 'translateX(-50%)',
        background: `linear-gradient(to top, transparent, ${UNITY_THEME}, white)`,
        borderRadius: 4,
        boxShadow: `0 0 30px ${UNITY_THEME}, 0 0 60px ${UNITY_LIME}`,
      }} />
      
      {/* 彗星の尾（Conic Gradientで表現） */}
      <div style={{
        position: 'absolute',
        width: '200%',
        height: '200%',
        top: '-50%',
        left: '-50%',
        background: `conic-gradient(from -15deg, ${UNITY_THEME}dd 0deg, transparent 30deg, transparent 360deg)`,
        opacity: 0.4,
        transform: 'rotate(-90deg)', // 針の方向に合わせる
      }} />
    </div>
  );
};

const StarlightSweepPresentation: React.FC<TransitionPresentationComponentProps<{}>> = ({
  children, // これは「新シーン」です
  presentationProgress,
}) => {
  // 針の回転角 (0 to 360)
  const rotation = presentationProgress * 360;

  return (
    <AbsoluteFill>
      {/* 前のシーンは TransitionSeries によって背後で自動的に描画されます */}
      
      {/* 中間に浮かび上がる魔法陣 */}
      <CelestialDial progress={presentationProgress} />

      {/* 新しいシーン (扇状のマスクで露出) */}
      <AbsoluteFill style={{
        clipPath: `conic-gradient(from 0deg, white 0deg, white ${rotation}deg, transparent ${rotation}deg)`,
        zIndex: 10,
      }}>
        {children}
      </AbsoluteFill>

      {/* パーティクルと光の針を最前面に配置 */}
      <Stardust progress={presentationProgress} />
      <CometHand progress={presentationProgress} />
    </AbsoluteFill>
  );
};

/**
 * starlightSweep() Presentation Factory
 */
export const starlightSweep = (): TransitionPresentation<{}> => {
  return {
    component: StarlightSweepPresentation,
    props: {},
  };
};
