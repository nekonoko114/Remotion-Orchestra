import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

// --- SVG Filter: Pure Native High-End Bloom ---
const NativeFilters = () => {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {/* 多層ぼかしによる高品質なブルーム（発色）エフェクト */}
        <filter id="native-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

// --- Canvas: Infinite Neon Tunnel ---
const CanvasTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 描画クリア
        ctx.clearRect(0, 0, width, height);

        const numShapes = 18;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < numShapes; i++) {
            // 時間とともに奥から手前へ進む (0 = 奥, 1 = 手前)
            const progress = ( (i / numShapes) + (frame * 0.015) ) % 1;
            
            // 指数関数的に拡大させて奥行きを出す
            const scale = Math.pow(progress, 3) * 2.5;
            const opacity = progress;
            const size = Math.max(width, height) * scale;
            
            if (size < 2) continue;

            // 色の変化 (虹色ネオン)
            const hue = (frame * 1 + i * 20) % 360;
            ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${opacity})`;
            ctx.lineWidth = 1 + scale * 12;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            // 六角形 (Hexagon) の描画
            for (let side = 0; side <= 6; side++) {
                const angle = (side / 6) * Math.PI * 2 + (frame * 0.01);
                const x = centerX + Math.cos(angle) * size;
                const y = centerY + Math.sin(angle) * size;
                if (side === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // 補助的な光のライン (中央へ向かう線)
            if (i % 3 === 0) {
                ctx.beginPath();
                ctx.globalAlpha = opacity * 0.3;
                ctx.moveTo(centerX, centerY);
                const angle = (i / numShapes) * Math.PI * 2;
                ctx.lineTo(centerX + Math.cos(angle) * size, centerY + Math.sin(angle) * size);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }, [frame, width, height]);

    return (
        <canvas 
            ref={canvasRef} 
            width={width} 
            height={height} 
            style={{ 
                filter: 'url(#native-bloom)', // SVGブルームを適用
                opacity: 0.9,
                transform: 'scale(1.1)'
            }} 
        />
    );
};

// --- Main Showcase Composition ---
export const AdvancedEffectsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <NativeFilters />
      
      {/* Background: Canvas Tunnel */}
      <AbsoluteFill>
        <CanvasTunnel />
      </AbsoluteFill>

      {/* Floating UI Card */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: width * 0.85,
          padding: '60px 40px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px) saturate(150%)',
          borderRadius: 40,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: textOpacity,
          boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
          transform: `translateY(${Math.sin(frame * 0.05) * 10}px)`
        }}>
          <h1 style={{ 
            color: '#fff', 
            fontSize: 70, 
            margin: 0, 
            fontWeight: 900, 
            letterSpacing: 12,
            filter: 'url(#native-bloom)',
            textShadow: '0 0 20px rgba(255,255,255,0.5)'
          }}>
            NEON TUNNEL
          </h1>
          
          <div style={{ 
            height: 4, width: 150, 
            background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
            margin: '30px 0',
            boxShadow: '0 0 15px #ff00ff'
          }} />

          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: 28, 
            textAlign: 'center',
            lineHeight: 1.5,
            fontWeight: 'bold'
          }}>
            HTML5 Canvas API × SVG Filter<br />
            Stability & High Performance
          </p>

          <div style={{ marginTop: 40, color: '#00ffff', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 }}>
            NO EXTERNAL LIBRARIES • REACT 19 READY
          </div>
        </div>
　      </AbsoluteFill>
    </AbsoluteFill>
  );
};
