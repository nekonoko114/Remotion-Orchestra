import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw concentric "Slash" shapes (parallelograms)
    const centerX = width / 2;
    const centerY = height / 2;
    const numShapes = 12;
    
    for (let i = 0; i < numShapes; i++) {
      // Each shape moves outward
      const shapeProgress = ((frame * 8 + i * (1000 / numShapes)) % 1000) / 1000;
      
      // Exponential scale for "tunnel" effect
      const scale = Math.pow(shapeProgress, 2.5) * 3000;
      const shapeOpacity = (1 - shapeProgress) * opacity;
      
      if (scale < 10) continue;

      ctx.beginPath();
      ctx.strokeStyle = i % 2 === 0 ? UNITY_GREEN : UNITY_LIME;
      ctx.lineWidth = (2 + pulse * 10) * shapeProgress;
      ctx.globalAlpha = shapeOpacity;

      // Draw a "Slash" shaped diamond/parallelogram
      const w = scale;
      const h = scale * 1.2;
      const skew = scale * 0.2;

      ctx.moveTo(centerX - w/2 + skew, centerY - h/2);
      ctx.lineTo(centerX + w/2 + skew, centerY - h/2);
      ctx.lineTo(centerX + w/2 - skew, centerY + h/2);
      ctx.lineTo(centerX - w/2 - skew, centerY + h/2);
      ctx.closePath();
      
      // Add a slight glow
      ctx.shadowBlur = 15 * pulse;
      ctx.shadowColor = ctx.strokeStyle as string;
      
      ctx.stroke();
    }
  }, [frame, width, height, pulse, opacity]);

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
