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
    return Array.from({ length: 40 }).map((_, i) => {
      const seed = i * 45.3;
      return {
        angle: (seed % (Math.PI * 2)),
        distanceFactor: 0.1 + (seed % 0.9),
        speed: 12 + (seed % 18),
        size: 3 + (seed % 7),
        color: i % 2 === 0 ? UNITY_GREEN : UNITY_LIME,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    
    const waveFreq = 0.045;
    const waveAmp = 60 + pulse * 120;
    const centerX = width / 2 + Math.sin(frame * waveFreq) * waveAmp;
    const centerY = height / 2 + Math.cos(frame * waveFreq * 0.8) * waveAmp;

    const numRings = 18;
    const numLongitudinal = 12;

    // 1. Render Longitudinal Lines (Grid Walls)
    ctx.save();
    ctx.translate(centerX, centerY);
    // Use the base rotation for the grid
    const baseRotation = frame * 0.01;
    ctx.rotate(baseRotation);

    for (let j = 0; j < numLongitudinal; j++) {
      const angle = (j / numLongitudinal) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      
      ctx.beginPath();
      ctx.strokeStyle = j % 2 === 0 ? UNITY_GREEN : UNITY_LIME;
      ctx.lineWidth = 1 + pulse * 4;
      ctx.globalAlpha = opacity * 0.3;
      
      // Moving from center to far out
      ctx.moveTo(0, 0);
      ctx.lineTo(x * 3000, y * 3000);
      
      ctx.shadowBlur = 10 * pulse;
      ctx.shadowColor = ctx.strokeStyle as string;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Render Concentric Warp Rings (More substantial)
    for (let i = 0; i < numRings; i++) {
      const ringProgress = ((frame * 7 + i * (1000 / numRings)) % 1000) / 1000;
      const scale = Math.pow(ringProgress, 3.2) * 5000;
      const ringOpacity = Math.pow(1 - ringProgress, 0.4) * opacity;
      
      if (scale < 8) continue;

      ctx.save();
      ctx.translate(centerX, centerY);
      
      const rotDir = i % 2 === 0 ? 1 : -1;
      const rotation = baseRotation + frame * 0.02 * rotDir + (i * 0.15);
      ctx.rotate(rotation);

      ctx.beginPath();
      ctx.strokeStyle = i % 4 === 0 ? UNITY_LIME : UNITY_GREEN;
      ctx.lineWidth = (2 + pulse * 20) * ringProgress * 3; // Thicker, more substantial
      ctx.globalAlpha = ringOpacity;

      const w = scale;
      const h = scale * 1.35;
      const skew = scale * 0.35;

      ctx.moveTo(-w/2 + skew, -h/2);
      ctx.lineTo(w/2 + skew, -h/2);
      ctx.lineTo(w/2 - skew, h/2);
      ctx.lineTo(-w/2 - skew, h/2);
      ctx.closePath();
      
      ctx.shadowBlur = 25 * pulse;
      ctx.shadowColor = ctx.strokeStyle as string;
      ctx.stroke();
      
      // Add diagonal "Digital Scanline" inner effect for substance
      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.moveTo(-w/4, -h/4);
        ctx.lineTo(w/4, h/4);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 3. Render High-Speed Shards
    shards.forEach((s) => {
      const shardProgress = ((frame * s.speed) % 1500) / 1500;
      const shardScale = Math.pow(shardProgress, 2.2) * 2500;
      
      if (shardScale < 10) return;

      const sx = centerX + Math.cos(s.angle + frame * 0.01) * shardScale * s.distanceFactor;
      const sy = centerY + Math.sin(s.angle + frame * 0.01) * shardScale * s.distanceFactor;
      
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(s.angle + frame * 0.15);
      
      ctx.fillStyle = s.color;
      ctx.globalAlpha = (1 - shardProgress) * opacity * 0.9;
      
      const sz = s.size * (1 + pulse * 2.5);
      ctx.beginPath();
      ctx.moveTo(0, -sz*2.5);
      ctx.lineTo(sz, 0);
      ctx.lineTo(0, sz*2.5);
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
