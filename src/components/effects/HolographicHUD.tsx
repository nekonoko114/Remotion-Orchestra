import type React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const HolographicHUD: React.FC<{ color?: string; text?: string }> = ({
  color = '#00f3ff',
  text,
}) => {
  const frame = useCurrentFrame();

  // 回転アニメーション
  const rotate1 = frame * 1.5;
  const rotate2 = frame * -1;
  const rotate3 = frame * 0.5;

  // 点滅アニメーション
  const blink = Math.sin(frame * 0.2) > 0 ? 1 : 0.5;

  const ringStyle: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    border: `2px solid ${color}`,
    boxShadow: `0 0 10px ${color}, inset 0 0 10px ${color}`,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      {/* Outer Ring with Dashes */}
      <div
        style={{
          ...ringStyle,
          width: 400,
          height: 400,
          border: `2px dashed ${color}`,
          transform: `translate(-50%, -50%) rotate(${rotate1}deg)`,
          opacity: 0.6,
        }}
      />

      {/* Middle Ring */}
      <div
        style={{
          ...ringStyle,
          width: 300,
          height: 300,
          borderTop: 'none',
          borderBottom: 'none',
          borderWidth: 4,
          transform: `translate(-50%, -50%) rotate(${rotate2}deg)`,
          opacity: 0.8,
        }}
      />

      {/* Inner Ring with Gaps */}
      <div
        style={{
          ...ringStyle,
          width: 200,
          height: 200,
          borderLeft: 'none',
          borderRight: 'none',
          borderWidth: 8,
          transform: `translate(-50%, -50%) rotate(${rotate3}deg)`,
          boxShadow: `0 0 20px ${color}`,
        }}
      />

      {/* Core Data */}
      {text && (
        <div
          style={{
            position: 'absolute',
            color: color,
            fontFamily: 'monospace',
            fontSize: 24,
            fontWeight: 'bold',
            textShadow: `0 0 5px ${color}`,
            opacity: blink,
            textAlign: 'center',
          }}
        >
          {text}
          <br />
          {Math.floor(frame * 1.25)}%
        </div>
      )}

      {/* Grid Background (Optional) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(${color}22 1px, transparent 1px), linear-gradient(90deg, ${color}22 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.2,
          zIndex: -1,
        }}
      />
    </AbsoluteFill>
  );
};
