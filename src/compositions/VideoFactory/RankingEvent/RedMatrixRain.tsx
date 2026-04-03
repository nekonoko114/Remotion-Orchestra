import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

// Custom hook for Canvas usage
const useCanvas = (draw: (ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    draw(ctx, frame, width, height);
  }, [draw, frame, width, height]);

  return canvasRef;
};

export const RedMatrixRain: React.FC<{ opacity?: number, pulse?: number }> = ({ opacity = 0.4, pulse = 0 }) => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        // Semi-transparent black clear for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        
        // Intense Crimson/Red color for Matrix rain
        ctx.fillStyle = '#f85718';
        ctx.font = '24px monospace';
        ctx.shadowBlur = 10 + (pulse * 20);
        ctx.shadowColor = '#FF0000';

        const cols = Math.floor(width / 24);
        for (let i = 0; i < cols; i++) {
            // Each column has its own speed and stagger
            const speedMultiplier = 1 + (i % 7) * 0.5;
            const y = ( (frame * 12 * speedMultiplier) + (i * 200) ) % (height + 200) - 100;
            
            // Random character string
            const char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
            
            // Adjust opacity based on pulse
            const currentOpacity = 0.6 + (pulse * 0.4);
            ctx.globalAlpha = currentOpacity;
            
            ctx.fillText(char, i * 24, y);
        }
        ctx.globalAlpha = 1.0;
    }, [pulse]);

    const ref = useCanvas(draw);
    const { width, height } = useVideoConfig();

    return (
        <AbsoluteFill style={{ opacity, pointerEvents: 'none', mixBlendMode: 'screen' }}>
            <canvas ref={ref} width={width} height={height} style={{ width: '100%', height: '100%' }} />
        </AbsoluteFill>
    );
};
