import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, random } from 'remotion';
import { LuxuryJapaneseFont, LuxuryLatinFont } from './fonts';

const LASER_COLOR = '#00ffcc'; // Sharp Green-ish Cyan
const SPARK_COUNT = 20;

export const Opening: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const scale = width / 1080;

  // Progress of the laser (0 to 1)
  const laserProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 40 },
  });

  const fadeOut = interpolate(frame, [240, 270], [1, 0], { extrapolateRight: 'clamp' });

  // Spark generation
  const sparks = useMemo(() => {
    return Array.from({ length: SPARK_COUNT }).map((_, i) => ({
      id: i,
      x: random(`spark-x-${i}`) * 400 - 200,
      y: random(`spark-y-${i}`) * 400 - 200,
      size: random(`spark-s-${i}`) * 4 + 2,
      delay: random(`spark-d-${i}`) * 30,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 1. Subtle Digital Grid Background */}
      <AbsoluteFill style={{ opacity: 0.15 }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(${LASER_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${LASER_COLOR} 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }} />
      </AbsoluteFill>

      {/* 2. Laser "Carving" Text Container */}
      <AbsoluteFill style={{ 
        justifyContent: 'center', 
        alignItems: 'center', 
        opacity: fadeOut,
        transform: `scale(${interpolate(frame, [0, 270], [1, 1.1])})`,
      }}>
        {/* Main Title: 新人王 */}
        <div style={{
          position: 'relative',
          marginBottom: 100 * scale,
        }}>
          {/* Base Dark Text (The "Carved" slot) */}
          <div style={{
            fontFamily: LuxuryJapaneseFont,
            fontSize: 240 * scale,
            fontWeight: 900,
            color: '#111',
            letterSpacing: '0.2em',
            textShadow: `0 0 40px ${LASER_COLOR}44`,
          }}>
            新人王
          </div>

          {/* Glowing Carved Path */}
          <AbsoluteFill style={{ 
            justifyContent: 'center', 
            alignItems: 'center',
            clipPath: `inset(0 ${interpolate(laserProgress, [0, 1], [100, 0])}% 0 0)`, // Right to left reveal
          }}>
             <div style={{
                fontFamily: LuxuryJapaneseFont,
                fontSize: 240 * scale,
                fontWeight: 900,
                color: LASER_COLOR,
                letterSpacing: '0.2em',
                textShadow: `0 0 10px ${LASER_COLOR}, 0 0 30px ${LASER_COLOR}, 0 0 60px ${LASER_COLOR}`,
                WebkitTextStroke: `2px ${LASER_COLOR}`,
              }}>
                新人王
              </div>
          </AbsoluteFill>

          {/* Laser Head Effect */}
          {laserProgress > 0 && laserProgress < 1 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `${interpolate(laserProgress, [0, 1], [10, 95])}%`,
              transform: 'translate(-50%, -50%)',
              width: 10 * scale,
              height: 350 * scale,
              background: `linear-gradient(to bottom, transparent, ${LASER_COLOR}, white, ${LASER_COLOR}, transparent)`,
              boxShadow: `0 0 30px ${LASER_COLOR}, 0 0 60px ${LASER_COLOR}`,
              zIndex: 100,
            }} />
          )}
        </div>

        {/* Subtitle: ROOKIE OF THE YEAR 2026 */}
        <div style={{
          fontFamily: LuxuryLatinFont,
          fontSize: 60 * scale,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.5em',
          opacity: interpolate(laserProgress, [0.7, 0.9], [0, 1]),
          transform: `translateY(${interpolate(laserProgress, [0.7, 0.9], [20, 0])}px)`,
          textShadow: `0 0 20px ${LASER_COLOR}`,
        }}>
          ROOKIE OF THE YEAR 2026
        </div>
      </AbsoluteFill>

      {/* 3. Spasms / Sparks Effect */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {sparks.map((s) => {
          const sparkActive = (frame - s.delay) / 10;
          if (sparkActive < 0 || sparkActive > 1) return null;
          
          return (
            <div key={s.id} style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: s.size,
              height: s.size,
              backgroundColor: LASER_COLOR,
              boxShadow: `0 0 10px ${LASER_COLOR}`,
              transform: `translate(calc(-50% + ${s.x * sparkActive}px), calc(-50% + ${s.y * sparkActive}px)) scale(${1 - sparkActive})`,
              opacity: 1 - sparkActive,
            }} />
          );
        })}
      </AbsoluteFill>

      {/* 4. Digital Noise Overlay */}
      <AbsoluteFill style={{ 
        opacity: (random(frame) > 0.95 ? 0.2 : 0.05),
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }} />
    </AbsoluteFill>
  );
};
