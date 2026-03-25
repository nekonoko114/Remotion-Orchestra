import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

// --- SVG Filters (Exactly as first implemented) ---
const NativeFilters = () => {
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <filter id="native-bloom" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                    <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="liquid-distort">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="1">
                        <animate attributeName="baseFrequency" values="0.01;0.015;0.01" dur="10s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="35" />
                </filter>
            </defs>
        </svg>
    );
};

// --- Tunnel Types (Direct restore of Step 1205 logic) ---

const HexagonTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        const num = 15;
        for (let i = 0; i < num; i++) {
            const p = ((i / num) + (frame * 0.02)) % 1;
            const size = Math.max(width, height) * Math.pow(p, 3) * 2;
            ctx.strokeStyle = `hsla(${(frame + i * 20) % 360}, 80%, 70%, ${p})`;
            ctx.lineWidth = 2 + p * 10;
            ctx.beginPath();
            for (let s = 0; s <= 6; s++) {
                const a = (s / 6) * Math.PI * 2 + frame * 0.01;
                const x = width / 2 + Math.cos(a) * size;
                const y = height / 2 + Math.sin(a) * size;
                if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const GridTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#00ffff';
        for (let i = 0; i < 20; i++) {
            const p = ((i / 20) + (frame * 0.03)) % 1;
            const size = Math.max(width, height) * Math.pow(p, 2) * 1.5;
            ctx.globalAlpha = p;
            ctx.strokeRect(width / 2 - size / 2, height / 2 - size / 2, size, size);
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const StarfieldTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 100; i++) {
            const seed = i * 12345.67;
            const angle = (seed % (Math.PI * 2));
            const p = ((seed % 1) + (frame * 0.02)) % 1;
            const dist = Math.pow(p, 4) * Math.max(width, height);
            ctx.fillStyle = `rgba(255, 255, 255, ${p})`;
            ctx.beginPath(); ctx.arc(width / 2 + Math.cos(angle) * dist, height / 2 + Math.sin(angle) * dist, p * 5, 0, Math.PI * 2); ctx.fill();
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const CircuitTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 12; i++) {
            const p = ((i / 12) + (frame * 0.02)) % 1;
            const size = Math.max(width, height) * p;
            ctx.strokeStyle = `rgba(0, 255, 100, ${p})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(width / 2 - size / 2, height / 2 - size / 2, size, size);
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const LiquidTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ filter: 'url(#liquid-distort) url(#native-bloom)' }}>
            {[...Array(10)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', left: '50%', top: '50%',
                    width: 100 + ((i / 10 + frame * 0.01) % 1) * 1500,
                    height: 100 + ((i / 10 + frame * 0.01) % 1) * 1500,
                    border: '20px solid #ff0088', borderRadius: '40%',
                    transform: `translate(-50%, -50%) rotate(${frame + i * 30}deg)`,
                    opacity: 1 - ((i / 10 + frame * 0.01) % 1)
                }} />
            ))}
        </AbsoluteFill>
    );
};

const MatrixTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        ctx.font = '20px monospace'; ctx.fillStyle = '#0f0';
        for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            for (let j = 0; j < 15; j++) {
                const p = ((j / 15) + (frame * 0.02 + i * 0.1)) % 1;
                const dist = p * Math.max(width, height) * 0.8;
                ctx.globalAlpha = p;
                ctx.fillText(Math.random() > 0.5 ? '1' : '0', width / 2 + Math.cos(angle) * dist, height / 2 + Math.sin(angle) * dist);
            }
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const PrismTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 12; i++) {
            const p = ((i / 12) + (frame * 0.015)) % 1;
            const size = Math.max(width, height) * Math.pow(p, 2.5) * 1.2;
            ctx.strokeStyle = `hsla(${p * 360}, 100%, 50%, ${p})`; ctx.lineWidth = 15 * p;
            ctx.beginPath(); ctx.moveTo(width / 2, height / 2 - size); ctx.lineTo(width / 2 + size, height / 2 + size / 2); ctx.lineTo(width / 2 - size, height / 2 + size / 2); ctx.closePath(); ctx.stroke();
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const DataTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 10; i++) {
            const p = ((i / 10) + (frame * 0.025)) % 1;
            const size = Math.max(width, height) * p;
            ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 10 * p; ctx.setLineDash([20, 20]);
            ctx.beginPath(); ctx.arc(width / 2, height / 2, size, frame * 0.05, frame * 0.05 + Math.PI * 1.5); ctx.stroke();
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const VortexTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 200; i++) {
            const angle = i * 0.2 + frame * 0.1; const r = (i / 200) * Math.max(width, height) * 1.2;
            ctx.lineTo(width / 2 + Math.cos(angle) * r, width / 2 + Math.sin(angle) * r);
        }
        ctx.stroke();
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const EchoTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig(); // width was unused, now used in clearRect
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 12; i++) {
            const p = ((i / 12) + (frame * 0.02)) % 1;
            const size = Math.max(width, height) * p;
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - p})`; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(width / 2, height / 2, size, 0, Math.PI * 2); ctx.stroke();
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)' }} />;
};

const FlameTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#110000'; ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 12; i++) {
            const p = ((i / 12) + (frame * 0.025)) % 1;
            const size = Math.pow(p, 2) * Math.max(width, height) * 1.5;
            ctx.strokeStyle = `rgba(255, 100, 0, ${p})`; ctx.lineWidth = 30 * p;
            ctx.beginPath(); ctx.arc(width/2, height/2, size, 0, Math.PI * 2); ctx.stroke();
        }
    }, [frame, width, height]);
    return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'url(#native-bloom)', opacity: 0.8 }} />;
};

// --- Main Showcase Composition ---

const TUNNEL_COMPONENTS = [
    { name: "NEON HEXAGON", comp: HexagonTunnel },
    { name: "CYBER GRID", comp: GridTunnel },
    { name: "STARFIELD WARP", comp: StarfieldTunnel },
    { name: "DIGITAL CIRCUIT", comp: CircuitTunnel },
    { name: "ORGANIC LIQUID", comp: LiquidTunnel },
    { name: "MATRIX STREAM", comp: MatrixTunnel },
    { name: "PRISM TRIANGLE", comp: PrismTunnel },
    { name: "DATA ARC", comp: DataTunnel },
    { name: "VORTEX SPIRAL", comp: VortexTunnel },
    { name: "ECHO WAVE", comp: EchoTunnel },
    { name: "FLAME VORTEX", comp: FlameTunnel },
];

export const AdvancedEffectsShowcase: React.FC = () => {
    const frame = useCurrentFrame();
    const cycleDuration = 90;
    const tunnelIndex = Math.floor(frame / cycleDuration) % TUNNEL_COMPONENTS.length;
    const currentTunnel = TUNNEL_COMPONENTS[tunnelIndex];
    const opacity = interpolate(frame % cycleDuration, [0, 10, 80, 90], [0, 1, 1, 0]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden', fontFamily: 'sans-serif' }}>
            <NativeFilters />
            <AbsoluteFill style={{ opacity }}>
                <currentTunnel.comp />
            </AbsoluteFill>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    padding: '30px 50px', backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(20px)', borderRadius: 30, border: '1px solid rgba(255,255,255,0.2)',
                    opacity, textAlign: 'center'
                }}>
                    <h1 style={{ color: '#fff', fontSize: 60, margin: 0, fontWeight: 900, letterSpacing: 8, filter: 'url(#native-bloom)' }}>
                        {currentTunnel.name}
                    </h1>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
