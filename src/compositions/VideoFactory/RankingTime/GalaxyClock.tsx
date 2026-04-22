import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  random,
} from 'remotion';
// ローカルフォント
const cinzelFont = "'Cinzel', serif";

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

interface GalaxyClockProps {
  rank: number;
  themeColor: string;
  entrance?: number; // 0 to 1
  variant?: 'subtle' | 'standard' | 'enhanced';
}

const Gear: React.FC<{ 
  size: number; 
  teeth: number; 
  speed: number; 
  themeColor: string;
  frame: number;
  direction?: number; 
  opacity?: number; 
}> = ({ size, teeth, speed, themeColor, frame, direction = 1, opacity = 0.4 }) => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: size,
    height: size,
    border: `4px solid ${themeColor}44`,
    borderRadius: '50%',
    transform: `translate(-50%, -50%) rotate(${frame * speed * direction}deg)`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mixBlendMode: 'screen',
    opacity,
  }}>
    <div style={{
      position: 'absolute',
      width: size * 0.8,
      height: size * 0.8,
      border: `3px dashed ${themeColor}aa`,
      borderRadius: '50%',
      boxShadow: `0 0 25px ${themeColor}66`,
    }} />
    {Array.from({ length: teeth }).map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: 12,
        height: size * 0.1,
        background: `linear-gradient(to bottom, ${themeColor}, transparent)`,
        top: -size * 0.05,
        left: '50%',
        transform: `translateX(-50%) rotate(${i * (360 / teeth)}deg)`,
        transformOrigin: `50% ${size / 2 + size * 0.05}px`,
      }} />
    ))}
  </div>
);

/**
 * 神秘的な銀河の時計コンポーネント
 * 順位に応じて演出が「進化」する
 */
export const GalaxyClock: React.FC<GalaxyClockProps> = ({ 
  rank, 
  themeColor, 
  entrance = 1,
  variant = 'standard'
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * 0.2;
  const pulse = Math.sin(frame * 0.05) * 0.1 + 0.9;

  // 演出強度の設定
  const isEnhanced = variant === 'enhanced';
  const isSubtle = variant === 'subtle';

  const clockOpacity = isSubtle ? 0.92 : 1.0;

  // 星屑の生成
  const particles = useMemo(() => {
    const count = isEnhanced ? 60 : 15;
    return Array.from({ length: count }).map((_, i) => ({
      x: random(`clk-x-${i}`) * 100,
      y: random(`clk-y-${i}`) * 100,
      size: random(`clk-s-${i}`) * (isEnhanced ? 6 : 3) + 1,
      speed: random(`clk-sp-${i}`) * 0.4 + 0.1,
      opacity: random(`clk-o-${i}`) * 0.5 + 0.2,
    }));
  }, [variant]);

  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center', 
      opacity: entrance * clockOpacity,
    }}>
      {/* 0. Background Cosmic Nebula mask */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 1800,
        height: 1800,
        background: `radial-gradient(circle, ${themeColor}1a 0%, rgba(0, 0, 0, 0.4) 50%, transparent 80%)`,
        filter: `blur(${isEnhanced ? 120 : 80}px)`,
        transform: 'translate(-50%, -50%)',
        opacity: interpolate(frame, [0, 30], [0, 1]),
      }} />

      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // 上位ランクのみ追加の深度ブラーを適用
        filter: isEnhanced ? `drop-shadow(0 0 50px ${themeColor}44)` : 'none',
      }}>
        
        {/* 光の回転レイヤー */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 2000,
          height: 2000,
          borderRadius: '50%',
          background: `conic-gradient(from ${rotation}deg, transparent, ${themeColor}22, transparent, ${themeColor}11, transparent)`,
          filter: `blur(${isEnhanced ? 60 : 40}px)`,
          transform: `translate(-50%, -50%) scale(${pulse})`,
          mixBlendMode: 'plus-lighter',
        }} />

        {/* 星屑パーティクル */}
        <AbsoluteFill style={{ mixBlendMode: 'screen' }}>
          {particles.map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${(p.y - frame * p.speed) % 100}%`,
              width: p.size,
              height: p.size,
              backgroundColor: 'white',
              borderRadius: '50%',
              boxShadow: `0 0 ${p.size * 2}px ${themeColor}, 0 0 ${p.size * 5}px white`,
              opacity: p.opacity * (Math.sin(frame * 0.08 + i) * 0.5 + 0.5),
            }} />
          ))}
        </AbsoluteFill>

        {/* 2. Inner Mechanical Gears */}
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: `drop-shadow(0 0 ${isEnhanced ? 60 : 30}px ${themeColor}aa)`,
          opacity: isSubtle ? 0.65 : 1.0,
        }}>
          <Gear size={520} teeth={36} speed={0.2} themeColor={themeColor} frame={frame} opacity={0.6} />
          <Gear size={380} teeth={24} speed={0.4} themeColor={themeColor} frame={frame} direction={-1} opacity={0.8} />
          <Gear size={260} teeth={16} speed={0.6} themeColor={themeColor} frame={frame} />
          {!isSubtle && <Gear size={160} teeth={12} speed={1.0} themeColor={themeColor} frame={frame} direction={-1} />}
        </div>
        
        {/* 3. Middle Ring (Ticks) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 900,
          height: 900,
          border: `2px solid ${themeColor}44`,
          borderRadius: '50%',
          transform: `translate(-50%, -50%) rotate(${-rotation * 0.2}deg)`,
          boxShadow: `inset 0 0 60px ${themeColor}22`,
          opacity: isSubtle ? 0.7 : 1.0,
        }}>
          {Array.from({ length: 60 }).map((_, i) => {
            const isMajor = i % 5 === 0;
            if (isSubtle && !isMajor) return null; // 下位ランクでは細かい目盛りを省略
            return (
              <div key={i} style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: isMajor ? 8 : 4,
                height: isMajor ? 32 : 16,
                background: isMajor ? 'white' : themeColor,
                transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-450px)`,
                boxShadow: isMajor ? `0 0 20px white, 0 0 40px ${themeColor}` : `0 0 10px ${themeColor}`,
                opacity: isMajor ? 1 : 0.6,
              }} />
            )
          })}
        </div>

        {/* 4. Outer Dial: The Main Roman Numerals */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1050,
          height: 1050,
          border: `${isEnhanced ? 12 : 8}px solid ${themeColor}44`,
          borderRadius: '50%',
          transform: `translate(-50%, -50%) rotate(${rotation * 0.1}deg)`,
          boxShadow: `0 0 100px ${themeColor}33, inset 0 0 100px ${themeColor}33`,
          opacity: isSubtle ? 0.6 : 0.9,
          // 上位ランク用: 淵に強いボケを追加
          filter: isEnhanced ? 'blur(2px)' : 'none',
        }}>
          {ROMAN_NUMERALS.map((val, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 470 * Math.cos(angle);
            const y = 470 * Math.sin(angle);
            return (
              <div key={i} style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-rotation * 0.1}deg)`,
                color: 'white',
                fontSize: 80,
                fontWeight: 900,
                fontFamily: cinzelFont,
                textShadow: `0 0 15px white, 0 0 32px ${themeColor}, 0 0 64px ${themeColor}`,
                opacity: 0.9,
              }}>
                {val}
              </div>
            );
          })}
        </div>

        {/* 5. Pointer Needle */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transformOrigin: 'bottom center',
          transform: `translate(-50%, -100%) rotate(${
            isSubtle 
              ? frame * 1.5 // subtle のときは常に回転
              : spring({ 
                  frame: frame - 20, 
                  fps: 60, 
                  config: { stiffness: 60, damping: 10 }
                }) * (360 * 3 + ((rank - 1) * 30))
          }deg)`,
          zIndex: 150,
          mixBlendMode: 'screen',
          filter: isEnhanced ? 'drop-shadow(0 0 20px white)' : 'none',
          opacity: isSubtle ? 0.6 : 1.0,
        }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: 150,
              height: 700,
              background: `linear-gradient(to top, transparent, ${themeColor}66, transparent)`,
              transform: 'translateX(-50%)',
              filter: `blur(${isEnhanced ? 60 : 40}px)`,
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: isEnhanced ? 16 : 12,
              height: 520,
              background: `linear-gradient(to top, transparent 10%, ${themeColor}, white, white)`,
              transform: 'translateX(-50%)',
              boxShadow: `0 0 30px white, 0 0 70px ${themeColor}, 0 0 120px ${themeColor}`,
              borderRadius: '10px 10px 0 0',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 520,
              left: '50%',
              width: isEnhanced ? 50 : 40,
              height: isEnhanced ? 50 : 40,
              background: 'white',
              borderRadius: '50%',
              transform: `translate(-50%, -50%) scale(${1 + (Math.sin(frame * 0.4) * 0.2 + 1) * 0.5})`,
              boxShadow: `0 0 30px white, 0 0 80px ${themeColor}, 0 0 150px ${themeColor}`,
            }} />
          </div>
      </div>

      {/* Reveal Flash - ONLY for Non-Subtle variants */}
      {!isSubtle && (
        <AbsoluteFill style={{
          background: `radial-gradient(circle at center, white 0%, ${themeColor} 50%, transparent 100%)`,
          opacity: interpolate(frame, [80, 85, 100], [0, 0.9, 0], { extrapolateRight: 'clamp' }),
          mixBlendMode: 'plus-lighter',
          zIndex: 200,
          pointerEvents: 'none',
        }} />
      )}
    </AbsoluteFill>
  );
};
