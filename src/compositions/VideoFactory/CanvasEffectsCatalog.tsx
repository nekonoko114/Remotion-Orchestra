import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// --- Shared Utility for Canvas Demos ---
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

// --- Pattern 1: Starfield Particle System ---
const Starfield = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const stars = 200;
        for (let i = 0; i < stars; i++) {
            const z = ( (i * 13) + (frame * 2) ) % 1000;
            const x = ((i * 123) % width - width / 2) * (1000 / z);
            const y = ((i * 456 + frame * 5) % height - height / 2) * (1000 / z);
            const r = (1 - z / 1000) * 3;
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - z / 1000})`;
            ctx.beginPath();
            ctx.arc(width/2 + x, height/2 + y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%', filter: 'blur(1px)' }} />;
};

// --- Pattern 2: Perlin-ish Wave ---
const PlasmaWave = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${200 + i * 20}, 70%, 50%, 0.5)`;
            for (let x = 0; x < width; x += 10) {
                const y = height/2 + Math.sin(x * 0.005 + frame * 0.05 + i) * 60 + Math.cos(x * 0.01 - frame * 0.03) * 30;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 3: Rotating Wireframe Cube ---
const WireCube = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const t = frame * 0.02;
        const size = 150;
        const points = [
            [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
            [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]
        ];
        const projected = points.map(([px, py, pz]) => {
            // Rotation Y
            const x1 = px * Math.cos(t) - pz * Math.sin(t);
            const z1 = px * Math.sin(t) + pz * Math.cos(t);
            // Rotation X
            const y2 = py * Math.cos(t * 0.5) - z1 * Math.sin(t * 0.5);
            const z2 = py * Math.sin(t * 0.5) + z1 * Math.cos(t * 0.5);
            
            const p = 400 / (400 + z2 * size);
            return [width/2 + x1 * size * p, height/2 + y2 * size * p];
        });

        const lines = [
            [0,1],[1,2],[2,3],[3,0], [4,5],[5,6],[6,7],[7,4], [0,4],[1,5],[2,6],[3,7]
        ];
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        lines.forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(projected[a][0], projected[a][1]);
            ctx.lineTo(projected[b][0], projected[b][1]);
            ctx.stroke();
        });
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px #00ffff)' }} />;
};

// --- Pattern 4: Fractal Tree (Animated) ---
const FractalTree = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const angle = interpolate(frame % 100, [0, 50, 100], [0.3, 0.6, 0.3]);
        const drawBranch = (x: number, y: number, len: number, a: number, depth: number) => {
            if (depth === 0) return;
            const x2 = x + Math.cos(a) * len;
            const y2 = y + Math.sin(a) * len;
            ctx.strokeStyle = `hsla(${120 + depth * 10}, 70%, 50%, ${depth/10})`;
            ctx.lineWidth = depth;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
            drawBranch(x2, y2, len * 0.75, a - angle, depth - 1);
            drawBranch(x2, y2, len * 0.75, a + angle, depth - 1);
        };
        drawBranch(width/2, height - 50, 120, -Math.PI/2, 10);
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 5: Grid Pulse ---
const GridPulse = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const spacing = 50;
        for (let x = 0; x <= width; x += spacing) {
            for (let y = 0; y <= height; y += spacing) {
                const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
                const pulse = Math.sin(dist * 0.01 - frame * 0.1) * 5;
                ctx.fillStyle = `rgba(255, 0, 255, ${Math.max(0, 0.5 + pulse/10)})`;
                const radius = Math.max(0, 2 + pulse);
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 6: Matrix Digital Rain ---
const MatrixRain = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#0f0';
        ctx.font = '20px monospace';
        const cols = Math.floor(width / 20);
        for (let i = 0; i < cols; i++) {
            const y = ( (frame * (1 + (i % 5))) + (i * 100) ) % height;
            ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * 20, y);
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 7: Particle Connections (Plexus) ---
const Plexus = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const count = 40;
        const pts = new Array(count).fill(0).map((_, i) => ({
            x: ((i * 1234 + frame * 0.5) % width),
            y: ((i * 5678 - frame * 0.3) % height + height) % height
        }));
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.fillStyle = '#00ffff';
        for (let i = 0; i < count; i++) {
            ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 2, 0, Math.PI * 2); ctx.fill();
            for (let j = i + 1; j < count; j++) {
                const d = Math.sqrt(Math.pow(pts[i].x - pts[j].x, 2) + Math.pow(pts[i].y - pts[j].y, 2));
                if (d < 150) {
                    ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
                }
            }
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 8: Vortex Spiral ---
const Vortex = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        for (let i = 0; i < 100; i++) {
            const angle = i * 0.2 + frame * 0.05;
            const r = i * 4;
            ctx.strokeStyle = `hsla(${i * 3 + frame}, 80%, 60%, ${1 - i/100})`;
            ctx.beginPath();
            ctx.arc(width/2 + Math.cos(angle) * r, height/2 + Math.sin(angle) * r, 2 + i * 0.1, 0, Math.PI * 2);
            ctx.stroke();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 9: Wave Interference ---
const WaveInterference = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const step = 20;
        for (let x = 0; x < width; x += step) {
            for (let y = 0; y < height; y += step) {
                const v1 = Math.sin(Math.sqrt((x-width/3)**2 + (y-height/2)**2) * 0.1 - frame * 0.1);
                const v2 = Math.sin(Math.sqrt((x-width*0.6)**2 + (y-height/2)**2) * 0.1 + frame * 0.13);
                const v = (v1 + v2) / 2;
                ctx.fillStyle = `rgb(${128 + v * 127}, 0, ${128 - v * 127})`;
                ctx.fillRect(x, y, step-2, step-2);
            }
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 10: Concentric Hexagons ---
const Hexagons = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            const s = ((i * 100 + frame * 2) % 1000);
            ctx.globalAlpha = 1 - s / 1000;
            ctx.beginPath();
            for (let side = 0; side < 6; side++) {
                const a = (side / 6) * Math.PI * 2;
                const px = width/2 + Math.cos(a) * s;
                const py = height/2 + Math.sin(a) * s;
                if (side === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 11: DNA Double Helix ---
const DNAHelix = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const count = 30;
        for (let i = 0; i < count; i++) {
            const y = (i / count) * height;
            const a = (i * 0.3) + frame * 0.1;
            const x1 = width/2 + Math.sin(a) * 100;
            const x2 = width/2 + Math.sin(a + Math.PI) * 100;
            ctx.fillStyle = '#ff0088'; ctx.beginPath(); ctx.arc(x1, y, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#0088ff'; ctx.beginPath(); ctx.arc(x2, y, 6, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 12: Metaballs (Soft Blobs) ---
const Metaballs = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 6; i++) {
            const x = width/2 + Math.sin(frame * 0.03 + i) * 150;
            const y = height/2 + Math.cos(frame * 0.04 - i) * 150;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, 100);
            grad.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
            grad.addColorStop(1, 'rgba(255, 255, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%', filter: 'contrast(20) brightness(1.2)' }} />;
};

// --- Pattern 13: Kaleidoscope ---
const Kaleidoscope = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const sides = 8;
        ctx.save();
        ctx.translate(width/2, height/2);
        for (let i = 0; i < sides; i++) {
            ctx.rotate((Math.PI * 2) / sides);
            ctx.strokeStyle = `hsla(${frame + i * 40}, 80%, 60%, 0.8)`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(Math.sin(frame * 0.05) * 100, Math.cos(frame * 0.03) * 100, 150, 50);
            ctx.stroke();
        }
        ctx.restore();
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 14: Lightning ---
const Lightning = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        if (frame % 15 > 3) { ctx.clearRect(0,0,width,height); return; }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; ctx.fillRect(0,0,width,height);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        let x = width/2, y = 0;
        ctx.beginPath(); ctx.moveTo(x, y);
        while (y < height) {
            x += (Math.random() - 0.5) * 60;
            y += Math.random() * 30;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px #fff)' }} />;
};

// --- Pattern 15: Audio-ish Bar Chart ---
const BarChart = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const bars = 20;
        const barWidth = width / bars;
        for (let i = 0; i < bars; i++) {
            const h = 50 + Math.sin(frame * 0.1 + i) * 150 + Math.random() * 20;
            ctx.fillStyle = `hsla(${i * 15}, 80%, 50%, 0.9)`;
            ctx.fillRect(i * barWidth, height - h, barWidth - 4, h);
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 16: Snow / Bubbles ---
const SnowBubbles = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 50; i++) {
            const y = (i * 15 + frame * 2) % height;
            const x = (i * 123) % width + Math.sin(frame * 0.05 + i) * 30;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath(); ctx.arc(x, y, 2 + (i % 5), 0, Math.PI * 2); ctx.fill();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 17: Square Tunnel ---
const SquareTunnel = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        for (let i = 0; i < 15; i++) {
            const p = ((i / 15) + (frame * 0.01)) % 1;
            const size = Math.pow(p, 3) * width;
            ctx.strokeStyle = `hsla(${frame + i * 10}, 80%, 60%, ${p})`;
            ctx.strokeRect(width/2 - size/2, height/2 - size/2, size, size);
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 18: Sinusoidal Grid ---
const WaveGrid = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const gap = 30;
        for (let x = gap; x < width; x += gap) {
            for (let y = gap; y < height; y += gap) {
                const off = Math.sin(x * 0.01 + y * 0.01 + frame * 0.1) * 10;
                ctx.fillStyle = '#0ff';
                ctx.beginPath(); ctx.arc(x + off, y + off, 2, 0, Math.PI * 2); ctx.fill();
            }
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 19: Procedural Fire ---
const Fire = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 60; i++) {
            const life = ((i * 10 + frame * 3) % 150) / 150;
            const x = width/2 + (Math.sin(i * 123) * 50) * (1 - life);
            const y = height - life * height;
            const size = (1 - life) * 40;
            ctx.fillStyle = `hsla(${20 - life * 20}, 100%, ${50 + life * 20}%, ${1 - life})`;
            ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%', filter: 'blur(10px) contrast(2)' }} />;
};

// --- Pattern 20: Time Visualizer ---
const TimeVisualizer = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(width/2, height/2, 100, 0, Math.PI * 2); ctx.stroke();
        const a = (frame / 30) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(width/2, height/2);
        ctx.lineTo(width/2 + Math.cos(a) * 80, height/2 + Math.sin(a) * 80);
        ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = '24px bold sans-serif';
        ctx.fillText(`FRAME: ${frame}`, width/2 - 60, height/2 + 150);
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 21: Orbital System ---
const OrbitalSystem = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const centerX = width/2, centerY = height/2;
        ctx.fillStyle = '#ff0'; ctx.beginPath(); ctx.arc(centerX, centerY, 20, 0, Math.PI * 2); ctx.fill();
        for (let i = 1; i <= 4; i++) {
            const r = i * 60;
            const a = frame * (0.05 / i) + (i * 1.5);
            const x = centerX + Math.cos(a) * r;
            const y = centerY + Math.sin(a) * r;
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(centerX, centerY, r, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = `hsla(${i * 50}, 80%, 60%, 1)`; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 22: ASCII Glitch ---
const AsciiGlitch = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#0f0'; ctx.font = '12px monospace';
        const chars = "ABCDEFGH12345678@#$%^&*";
        for (let i = 0; i < 400; i++) {
            const x = (i * 50) % width;
            const y = (Math.floor(i * 50 / width) * 20 + frame * 0.5) % height;
            if (Math.random() > 0.95) ctx.fillStyle = '#f0f';
            else ctx.fillStyle = '#0f0';
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y);
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 23: Circular Tunnel ---
const CircularTunnel = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 20; i++) {
            const p = ((i / 20) + (frame * 0.01)) % 1;
            const r = Math.pow(p, 2) * (width/1.5);
            ctx.strokeStyle = `hsla(${200 + i * 5}, 80%, 50%, ${1 - p})`;
            ctx.lineWidth = 2 + p * 20;
            ctx.beginPath(); ctx.arc(width/2, height/2, r, 0, Math.PI * 2); ctx.stroke();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 24: Rain Ripples ---
const RainRipples = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.fillStyle = 'rgba(0, 0, 50, 0.1)'; ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 10; i++) {
            const t = (frame + i * 30) % 150;
            const x = (i * 234) % width;
            const y = (i * 567) % height;
            const r = t * 2;
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - t/150})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
        }
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

// --- Pattern 25: Growing Vines ---
const GrowingVines = () => {
    const draw = React.useCallback((ctx: CanvasRenderingContext2D, frame: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const drawVine = (x: number, y: number, len: number, a: number, d: number) => {
            if (d === 0) return;
            const x2 = x + Math.cos(a) * len;
            const y2 = y + Math.sin(a) * len;
            ctx.strokeStyle = `hsla(140, 70%, ${30 + d * 5}%, 0.6)`;
            ctx.lineWidth = d;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
            const noise = Math.sin(frame * 0.05 + d) * 0.2;
            drawVine(x2, y2, len * 0.9, a + 0.3 + noise, d - 1);
            if (d % 4 === 0) drawVine(x2, y2, len * 0.5, a - 0.5, d - 1);
        };
        drawVine(width/2, height, 40, -Math.PI/2, 12);
    }, []);
    const ref = useCanvas(draw);
    return <canvas ref={ref} width={1280} height={720} style={{ width: '100%', height: '100%' }} />;
};

export const CanvasEffectsCatalog: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
        backgroundColor: '#050505', padding: 15, 
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(5, 1fr)',
        gap: 10 
    }}>
      <Starfield />
      <PlasmaWave />
      <WireCube />
      <FractalTree />
      <GridPulse />
      <MatrixRain />
      <Plexus />
      <Vortex />
      <WaveInterference />
      <Hexagons />
      <DNAHelix />
      <Metaballs />
      <Kaleidoscope />
      <Lightning />
      <BarChart />
      <SnowBubbles />
      <SquareTunnel />
      <WaveGrid />
      <Fire />
      <TimeVisualizer />
      <OrbitalSystem />
      <AsciiGlitch />
      <CircularTunnel />
      <RainRipples />
      <GrowingVines />
    </AbsoluteFill>
  );
};
