import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

const SealLayer: React.FC<{ radius: number, sides: number, color: string, rotationSpeed: number, delay: number, strokeWidth?: number }> = ({ radius, sides, color, rotationSpeed, delay, strokeWidth = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawProgress = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  const rotation = frame * rotationSpeed;
  
  const points = Array.from({ length: sides + 1 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    return `${500 + Math.cos(angle) * radius},${500 + Math.sin(angle) * radius}`;
  }).join(' ');

  const perimeter = 2 * Math.PI * radius; 

  return (
    <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${rotation}deg)` }}>
      {/* フィルターなし：2重の線で光を表現 */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 1.5}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - drawProgress)}
        opacity={0.2}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - drawProgress)}
        opacity={1.0}
      />
    </svg>
  );
};

const CircleLayer: React.FC<{ radius: number, color: string, delay: number, dashArray?: string, strokeWidth?: number, reverse?: boolean }> = ({ radius, color, delay, dashArray = "0", strokeWidth = 3, reverse = false }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = spring({ frame: frame - delay, fps, config: { damping: 25 } });
    const rotation = frame * 0.2 * (reverse ? -1 : 1);

    return (
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${rotation}deg)` }}>
            <circle
                cx="500"
                cy="500"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray !== "0" ? dashArray : 2 * Math.PI * radius}
                strokeDashoffset={dashArray !== "0" ? 0 : 2 * Math.PI * radius * (1 - progress)}
                opacity={1.0 * progress}
            />
        </svg>
    );
}

export const AetherSeal: React.FC<{ rank: number, color: string }> = ({ rank, color }) => {
  const frame = useCurrentFrame();
  const champagneGold = '#FCEECB';
  const emeraldGlow = color === "#CD7F32" ? "#00FFAA" : color;

  const pulse = rank === 1 ? Math.sin(frame * 0.04) * 0.05 + 1 : 1;

  // Rank 1 Special: Luxurious Minimalist Aura
  if (rank === 1) {
    return (
      <AbsoluteFill style={{ transform: `scale(${1.6 * pulse})`, pointerEvents: 'none' }}>
        {/* Softest Outer Halo */}
        <CircleLayer radius={420} color={color} delay={10} strokeWidth={1} />
        
        {/* Rotating Champagne Ring with gaps */}
        <CircleLayer radius={380} color={champagneGold} delay={20} dashArray="2, 40" strokeWidth={3} reverse />
        
        {/* Main Glowing Circle */}
        <CircleLayer radius={320} color={color} delay={5} strokeWidth={2} />

        {/* Liquid Aura Clouds (Multi-layered CSS Gradients) */}
        <AbsoluteFill style={{
            background: `radial-gradient(circle, ${color}22 0%, transparent 60%)`,
            opacity: interpolate(Math.sin(frame * 0.03), [-1, 1], [0.3, 0.6]),
            filter: 'blur(80px)',
        }} />
        
        <AbsoluteFill style={{
            background: `radial-gradient(circle at 45% 45%, ${champagneGold}33 0%, transparent 50%)`,
            opacity: interpolate(Math.cos(frame * 0.04), [-1, 1], [0.2, 0.5]),
            filter: 'blur(100px)',
            transform: `rotate(${frame * 0.5}deg)`,
        }} />

        {/* Diamond Dust (Subtle focus particles) */}
        {[...Array(12)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 12 + (frame * 0.01);
            const r = 400 + Math.sin(frame * 0.02 + i) * 20;
            return (
                <div key={i} style={{
                    position: 'absolute',
                    top: `calc(50% + ${Math.sin(angle) * r}px)`,
                    left: `calc(50% + ${Math.cos(angle) * r}px)`,
                    width: 4,
                    height: 4,
                    backgroundColor: champagneGold,
                    borderRadius: '50%',
                    opacity: interpolate(Math.sin(frame * 0.05 + i), [-1, 1], [0.1, 0.8]),
                    boxShadow: `0 0 10px ${champagneGold}`,
                }} />
            );
        })}
      </AbsoluteFill>
    );
  }

  // Rank 2 & 3: Standard Seal (Keep it simple)
  return (
    <AbsoluteFill style={{ transform: `scale(${1.4 * pulse})`, pointerEvents: 'none', mixBlendMode: 'plus-lighter' }}>
      <CircleLayer radius={200} color={emeraldGlow} delay={5} dashArray="10, 20" strokeWidth={4} />
      <SealLayer radius={210} sides={rank === 1 ? 8 : 4} color={champagneGold} rotationSpeed={1.0} delay={8} strokeWidth={2} />
      
      <SealLayer radius={270} sides={rank === 1 ? 6 : 3} color={champagneGold} rotationSpeed={-0.6} delay={15} strokeWidth={2} />

      {rank === 2 && (
          <>
            <SealLayer radius={350} sides={6} color={emeraldGlow} rotationSpeed={0.3} delay={25} strokeWidth={2} />
            <CircleLayer radius={380} color={champagneGold} delay={30} strokeWidth={1} />
          </>
      )}
    </AbsoluteFill>
  );
};