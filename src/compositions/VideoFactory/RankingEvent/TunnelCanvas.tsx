import React, { useRef, useEffect, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

const UNITY_GREEN = '#00FF7F';
const UNITY_LIME = '#BFFF00';

interface Props {
  pulse: number;
  opacity: number;
}

export const TunnelCanvas: React.FC<Props> = ({ pulse, opacity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const shards = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => { // Reduced count
      const seed = i * 45.3;
      return {
        angle: (seed % (Math.PI * 2)),
        distanceFactor: 0.1 + (seed % 0.9),
        speed: 12 + (seed % 15), // Slightly slower
        size: 2 + (seed % 6),
        color: i % 2 === 0 ? UNITY_GREEN : '#FFFFFF',
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    
    // 1. Oscillating Center
    const waveFreq = 0.04;
    const waveAmp = 50 + pulse * 100;
    const centerX = width / 2 + Math.sin(frame * waveFreq) * waveAmp;
    const centerY = height / 2 + Math.cos(frame * waveFreq * 0.8) * waveAmp;

    const numRings = 20;
    const baseRotation = frame * 0.01;

    // Helper to draw a Hexagon
    const drawHexagon = (cx: number, cy: number, radius: number, rot: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rot + (i / 6) * Math.PI * 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 1.1; // Slight stretch
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    // 2. Longitudinal lines (Grid Walls) - Aligned to Hexagon Vertices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(baseRotation);
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.strokeStyle = UNITY_GREEN;
      ctx.lineWidth = 1 + pulse * 4;
      ctx.globalAlpha = opacity * 0.25;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 3000, Math.sin(angle) * 3300);
      ctx.shadowBlur = 15 * pulse;
      ctx.shadowColor = UNITY_GREEN;
      ctx.stroke();
    }
    ctx.restore();

    // 3. Concentric Hexagon Rings
    for (let i = 0; i < numRings; i++) {
      const ringProgress = ((frame * 6.5 + i * (1000 / numRings)) % 1000) / 1000;
      const radius = Math.pow(ringProgress, 3) * 5000;
      const ringOpacity = Math.pow(1 - ringProgress, 0.4) * opacity;
      
      if (radius < 10) continue;

      const rotDir = i % 2 === 0 ? 1 : -1;
      const rotation = baseRotation + frame * 0.015 * rotDir + (i * 0.05);

      ctx.save();
      ctx.strokeStyle = i % 4 === 0 ? UNITY_LIME : UNITY_GREEN;
      ctx.lineWidth = (2 + pulse * 10) * ringProgress * 3; // Dampened pulse (25 -> 10)
      ctx.globalAlpha = ringOpacity;
      ctx.shadowBlur = 15 * pulse; // Dampened glow (25 -> 15)
      ctx.shadowColor = ctx.strokeStyle as string;

      drawHexagon(centerX, centerY, radius, rotation);
      ctx.stroke();
      
      // Sub-hexagons (double lines) for detail
      if (i % 5 === 0) {
        ctx.lineWidth *= 0.3;
        drawHexagon(centerX, centerY, radius * 0.95, rotation);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 4. High-Speed Shards
    shards.forEach((s) => {
      const shardProgress = ((frame * s.speed) % 1500) / 1500;
      const shardScale = Math.pow(shardProgress, 2) * 2500;
      
      if (shardScale < 10) return;

      const sx = centerX + Math.cos(s.angle + frame * 0.02) * shardScale * s.distanceFactor;
      const sy = centerY + Math.sin(s.angle + frame * 0.02) * shardScale * s.distanceFactor;
      
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(s.angle + frame * 0.2);
      
      ctx.fillStyle = s.color;
      ctx.globalAlpha = (1 - shardProgress) * opacity;
      
      const sz = s.size * (1 + pulse * 3);
      ctx.beginPath();
      ctx.moveTo(0, -sz*2);
      ctx.lineTo(sz, 0);
      ctx.lineTo(0, sz*2);
      ctx.lineTo(-sz, 0);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });

  }, [frame, width, height, pulse, opacity, shards]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: '100%', height: '100%' }}
      />
    </AbsoluteFill>
  );
};
