import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import { LuxuryJapaneseFont } from './fonts';
import { useBeat, BeatShake } from './BeatSync';
import { AetherSeal } from './AetherSeal';
import { EnergyBlast } from './EnergyBlast';

const Searchlight: React.FC<{ x: number, y: number, color: string, angle: number, opacity: number }> = ({ x, y, color, angle, opacity }) => {
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: 4,
      height: 2000,
      background: `linear-gradient(to top, ${color}, transparent)`,
      transformOrigin: 'top center',
      transform: `translate(-50%, 0) rotate(${angle}deg)`,
      opacity: opacity * 0.4,
      filter: 'blur(20px)',
      mixBlendMode: 'screen',
    }} />
  );
};

const LightPillar: React.FC<{ color: string, delay: number }> = ({ color, delay }) => {
  const frame = useCurrentFrame();
  const progress = spring({ frame: frame - delay, fps: 60, config: { damping: 20 } });
  
  const height = interpolate(progress, [0, 1], [0, 2000]);
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 100,
      height: height,
      background: `linear-gradient(to right, transparent, ${color}, white, ${color}, transparent)`,
      opacity: opacity * 0.6,
      filter: 'blur(30px)',
      mixBlendMode: 'screen',
      zIndex: 50,
    }} />
  );
};

const Shockwave: React.FC<{ color: string, delay: number }> = ({ color, delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 0]);
  const scale = interpolate(progress, [0, 1], [0.5, 3]);

  if (frame < delay) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) scale(${scale})`,
      width: 500,
      height: 500,
      border: `8px solid ${color}`,
      borderRadius: '50%',
      opacity,
      filter: 'blur(10px)',
      zIndex: 40,
    }} />
  );
};

const AuraEffect: React.FC<{ color: string, intensity: number }> = ({ color, intensity }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ 
            background: `radial-gradient(circle, ${color}66 0%, transparent 70%)`,
            opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3 * intensity, 0.8 * intensity]),
            mixBlendMode: 'plus-lighter',
            filter: 'blur(50px)',
        }} />
    );
};

// --- Main Ranking Announcement ---

export const RankingAnnouncement: React.FC<{ rank: number, color: string, name?: string, duration: number, bpm?: number, iconUrl?: string }> = ({ rank, color, name = "USER NAME", duration, bpm = 160, iconUrl }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scaleFactor = width / 1080;
  const { kickStrength } = useBeat(bpm);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  // Position Mapping Based on Aurora Background
  const position = useMemo(() => {
    if (rank === 1) return { top: '56%', left: '50%', scale: 1.12 }; // スケールを抑えて気品を出す
    if (rank === 2) return { top: '56%', left: '50%', scale: 1.0 };
    return { top: '56%', left: '50%', scale: 0.95 };
  }, [rank]);

  const baseScale = interpolate(entrance, [0, 1], [0.2, position.scale]);
  const rotateY = interpolate(entrance, [0, 1], [90, 0]); // 3D Flip
  
  // Final Zoom
  const finalZoom = interpolate(
    frame,
    [duration - 15, duration],
    [1, 2.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const revealOpacity = interpolate(entrance, [0.4, 0.8], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', perspective: '1000px' }}>
      
      {/* 1. Global Light Effects */}
      <LightPillar color={color === "#CD7F32" ? "#00FF88" : color} delay={5} />
      <Shockwave color={color === "#CD7F32" ? "#00FF88" : color} delay={10} />

      {/* Searchlights (Theme-consistent) */}
      <AbsoluteFill style={{ opacity: rank === 1 ? entrance : 0.4 }}>
        {[...Array(6)].map((_, i) => {
            const angle = interpolate(entrance, [0, 1], [rank === 1 ? (i - 2.5) * 40 : 20, (i - 2.5) * 15]);
            return (
                <Searchlight 
                    key={i} 
                    x={rank === 3 ? 15 : 50} 
                    y={rank === 3 ? 30 : 20} 
                    color={color === "#CD7F32" ? "#00FF88" : color} 
                    angle={angle} 
                    opacity={rank === 1 ? 1 : 0.3} 
                />
            );
        })}
      </AbsoluteFill>

      <BeatShake bpm={bpm}>
        {/* Main Content: Premium 3D Reveal */}
        <div style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          width: 1200 * scaleFactor, // Explicit size to ensure AbsoluteFill children show up
          height: 1200 * scaleFactor,
          transform: `translate(-50%, -50%) scale(${baseScale * finalZoom}) rotateY(${rotateY}deg)`,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center children vertically
          transformStyle: 'preserve-3d',
        }}>
          {/* Energy Burst behind everything */}
          <EnergyBlast color={color === "#CD7F32" ? "#00FF88" : color} delay={10} />
          
          <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
            <AetherSeal rank={rank} color={color === "#CD7F32" ? "#00FF88" : color} />
          </div>
          
          <AuraEffect color={color === "#CD7F32" ? "#00FF88" : color} intensity={rank === 1 ? 1.5 : 0.8} />

          {/* 1. Profile Frame with 3D Depth (MIDDLE - Enlarged) */}
          <div style={{
            width: 600 * scaleFactor, 
            height: 600 * scaleFactor,
            borderRadius: "50%",
            border: `${16 * scaleFactor}px solid ${color}`,
            backgroundColor: '#000',
            boxShadow: `
              0 0 ${50 + kickStrength * 80}px ${color}, 
              0 0 120px ${color === "#CD7F32" ? "#00FF88" : color}44,
              inset 0 0 60px ${color}
            `,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Crown Decoration (TOP OF ICON - Slightly lifted) */}
            <div style={{
                position: 'absolute',
                top: -270 * scaleFactor, // さらに上へ移動
                width: 600 * scaleFactor,
                zIndex: 100,
                transform: 'translateZ(60px)', // さらに手前へ
                opacity: revealOpacity,
            }}>
                <Img 
                    src={staticFile(
                        rank === 1 ? "assets/images/gold-crown.png" : 
                        rank === 2 ? "assets/images/silver-crown.png" : 
                        "assets/images/copper-crown.png"
                    )}
                    style={{ 
                        width: '100%', 
                        height: 'auto', 
                        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' // 浮遊感を出すための深い影
                    }}
                />
            </div>

            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                {iconUrl ? (
                <Img
                    src={staticFile(iconUrl)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                ) : (
                    <div style={{ color: '#333', fontSize: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>NO IMAGE</div>
                )}
            </div>

            {/* Rank Text Label (High Above everything) */}
            <div style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 110,
                transform: `translateZ(80px) translateY(${-450 * scaleFactor}px)`,
            }}>
                <div style={{
                    fontFamily: LuxuryJapaneseFont,
                    fontSize: 200 * scaleFactor,
                    fontWeight: 900,
                    color: color,
                    textShadow: `
                        0 0 20px black,
                        0 0 40px ${color},
                        2px 2px 0px rgba(0,0,0,0.5)
                    `,
                    letterSpacing: '12px',
                    opacity: revealOpacity,
                }}>
                    第{rank}位
                </div>
            </div>
          </div>

          {/* 3. Name Plate (BOTTOM) */}
          <div style={{
              marginTop: 120 * scaleFactor,
              opacity: revealOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 900 * scaleFactor,
              transform: 'translateZ(50px)', // Bring forward in 3D space
          }}>
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: `${18 * scaleFactor}px ${60 * scaleFactor}px`,
                border: `3px solid ${color}`,
                borderRadius: '8px',
                boxShadow: `0 0 40px ${color}AA`,
                transform: `translateY(${interpolate(revealOpacity, [0, 1], [40, 0])}px)`, // Dramatic slide up
                filter: `drop-shadow(0 0 10px ${color})`,
            }}>
                <span style={{
                    fontFamily: LuxuryJapaneseFont,
                    fontSize: 70 * scaleFactor,
                    fontWeight: 700,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    opacity: revealOpacity,
                    letterSpacing: interpolate(revealOpacity, [0, 1], [10, 0]) + 'px', // Letter spacing assemble
                }}>
                    {name}
                </span>
            </div>
          </div>
        </div>
      </BeatShake>

      {/* High-Intensity Flash for Rank 1 Reveal / Transition */}
      {rank === 1 && frame > duration - 25 && (
          <AbsoluteFill style={{
              backgroundColor: 'white',
              opacity: interpolate(frame, [duration - 20, duration - 5], [0, 1]),
              zIndex: 2000,
          }} />
      )}
    </AbsoluteFill>
  );
};

