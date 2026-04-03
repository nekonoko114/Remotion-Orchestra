import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { LuxuryFontStack } from './fonts';

/**
 * アメコミ風の太い境界線付きテキストスタイル
 */
export const AmecomiTextStyle: React.CSSProperties = {
  fontFamily: LuxuryFontStack,
  fontWeight: 700,
  color: '#FFD700', // Gold
  WebkitTextStroke: '12px black',
  paintOrder: 'stroke fill',
  textShadow: '8px 8px 0px rgba(0,0,0,0.8)',
  letterSpacing: '0.05em',
};

/**
 * 網点（ハーフストーン）背景
 */
export const HalftoneBackground: React.FC<{ color?: string }> = ({ color = '#1a1a2e' }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
      }}
    />
  );
};

/**
 * スピード線（集中線）
 */
export const SpeedLines: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 3, [0, 1, 2], [0.3, 0.6, 0.3]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `conic-gradient(
          from 0deg,
          transparent 0deg,
          transparent 2deg,
          rgba(255,255,255,0.2) 3deg,
          transparent 4deg,
          transparent 10deg,
          rgba(255,255,255,0.1) 11deg,
          transparent 12deg
        )`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

/**
 * アメコミ風の吹き出し（ドット柄）
 */
export const ComicBubble: React.FC<{ children: React.ReactNode, bgColor?: string, dotColor?: string, borderColor?: string }> = ({ 
  children, 
  bgColor = '#FFD700', 
  dotColor = 'rgba(0,0,0,0.2)', 
  borderColor = 'black' 
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bubble Main Body */}
      <div style={{
        backgroundColor: bgColor,
        backgroundImage: `radial-gradient(circle, ${dotColor} 2px, transparent 2px)`,
        backgroundSize: '15px 15px',
        border: `12px solid ${borderColor}`,
        borderRadius: '50px',
        padding: '60px 100px',
        boxShadow: '20px 20px 0px rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '300px',
      }}>
        {children}
      </div>
      
      {/* Bubble Tail */}
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '40px solid transparent',
        borderRight: '40px solid transparent',
        borderTop: `60px solid ${borderColor}`,
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '30px solid transparent',
        borderRight: '30px solid transparent',
        borderTop: `45px solid ${bgColor}`,
        zIndex: 2,
      }} />
    </div>
  );
};
