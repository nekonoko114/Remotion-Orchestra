import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import { LuxuryJapaneseFont } from './fonts';
import { useBeat, BeatShake } from './BeatSync';

// --- Sub-components for Stadium Effects ---

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

const AuraEffect: React.FC<{ color: string }> = ({ color }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ 
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
            opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.6]),
            mixBlendMode: 'plus-lighter',
        }} />
    );
};

// --- Main Ranking Announcement ---

export const RankingAnnouncement: React.FC<{ rank: number, color: string, name?: string, duration: number, bpm?: number, iconUrl?: string }> = ({ rank, color, name = "USER NAME", duration, bpm = 160, iconUrl }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = width / 1080;
  const { kickStrength } = useBeat(bpm);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Position Mapping Based on Stadium Video
  // 3rd: Side Monitors, 2nd: Central Pillar Arches, 1st: Main Gate Center
  const position = useMemo(() => {
    if (rank === 1) return { top: '50%', left: '50%', scale: 1.2 };
    if (rank === 2) return { top: '48%', left: '50%', scale: 0.8 };
    return { top: '42%', left: '15%', scale: 0.6 }; // Side monitor left
  }, [rank]);

  const baseScale = interpolate(entrance, [0, 1], [0, position.scale]);
  
  // Final Zoom
  const finalZoom = interpolate(
    frame,
    [duration - 15, duration],
    [1, 2.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const revealOpacity = interpolate(entrance, [0.5, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      
      {/* Searchlights Converging (Rank 1 Highlight) */}
      <AbsoluteFill style={{ opacity: rank === 1 ? entrance : 0.4 }}>
        {[...Array(6)].map((_, i) => {
            const angle = interpolate(entrance, [0, 1], [rank === 1 ? (i - 2.5) * 40 : 20, (i - 2.5) * 15]);
            return (
                <Searchlight 
                    key={i} 
                    x={rank === 3 ? 15 : 50} 
                    y={rank === 3 ? 30 : 20} 
                    color={color} 
                    angle={angle} 
                    opacity={rank === 1 ? 1 : 0.3} 
                />
            );
        })}
      </AbsoluteFill>

      <BeatShake bpm={bpm}>
        {/* Main Content: Stadium-Integrated Reveal */}
        <div style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          transform: `translate(-50%, -50%) scale(${baseScale * finalZoom})`,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {rank === 1 && <AuraEffect color={color} />}

          {/* Profile Frame */}
          <div style={{
            width: 500 * scale, 
            height: 500 * scale,
            borderRadius: "50%",
            border: `${12 * scale}px solid ${color}`,
            backgroundColor: '#000',
            boxShadow: `0 0 ${40 + kickStrength * 60}px ${color}, inset 0 0 40px ${color}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {iconUrl ? (
              <Img
                src={staticFile(iconUrl)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
                <div style={{ color: '#333', fontSize: 40 }}>NO IMAGE</div>
            )}
            
            {/* Gloss Overlay */}
            <AbsoluteFill style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                pointerEvents: 'none',
            }} />
          </div>

          {/* Rank Badge & Name Plate */}
          <div style={{
              marginTop: 40 * scale,
              opacity: revealOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 800 * scale,
          }}>
            {/* Rank Text */}
            <div style={{
                fontFamily: LuxuryJapaneseFont,
                fontSize: 100 * scale,
                fontWeight: 900,
                color: color,
                textShadow: `0 0 20px black, 0 0 40px ${color}`,
                marginBottom: 10 * scale,
            }}>
                第{rank}位
            </div>

            {/* Name Plate */}
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: `${15 * scale}px ${50 * scale}px`,
                border: `2px solid ${color}`,
                borderRadius: '4px',
                boxShadow: `0 0 30px ${color}88`,
            }}>
                <span style={{
                    fontFamily: LuxuryJapaneseFont,
                    fontSize: 60 * scale,
                    fontWeight: 700,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                }}>
                    {name}
                </span>
            </div>
          </div>
        </div>

        {/* Side Monitor 2nd Icon (for Rank 3 symmetry or multi-monitor feel) */}
        {rank === 3 && (
            <div style={{
                position: 'absolute',
                top: '42%',
                right: '15%',
                transform: `translate(50%, -50%) scale(${baseScale * 0.6})`,
                opacity: revealOpacity * 0.5,
                filter: 'grayscale(0.5) brightness(0.7)',
            }}>
                <div style={{ width: 400, height: 400, borderRadius: '50%', border: `10px solid ${color}`, overflow: 'hidden' }}>
                    {iconUrl && <Img src={staticFile(iconUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
            </div>
        )}
      </BeatShake>

      {/* Burst Effect for Rank 1 Transition */}
      {rank === 1 && frame > duration - 20 && (
          <AbsoluteFill style={{
              backgroundColor: 'white',
              opacity: interpolate(frame, [duration - 15, duration - 5], [0, 1]),
              zIndex: 1000,
          }} />
      )}
    </AbsoluteFill>
  );
};

