import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

// --- Pattern 1: Path Morphing (Star to Circle) ---
const PathMorphing = () => {
    const frame = useCurrentFrame();
    const progress = Math.sin(frame * 0.05) * 0.5 + 0.5;
    
    // Simple 4-point star to circle approximation
    const starPath = "M 50 0 L 60 40 L 100 50 L 60 60 L 50 100 L 40 60 L 0 50 L 40 40 Z";
    const circlePath = "M 50 0 C 77 0 100 22 100 50 C 100 77 77 100 50 100 C 22 100 0 77 0 50 C 0 22 22 0 50 0 Z";
    
    // Note: For complex morphing, a library like flubber is better, 
    // but for simple cases we can use CSS transitions or discrete frames.
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
                <path 
                    d={progress > 0.5 ? circlePath : starPath} 
                    fill="#00ffff"
                    style={{ transition: 'd 0.5s ease-in-out' }}
                />
            </svg>
        </div>
    );
};

// --- Pattern 2: Handwriting Effect (Dash Offset) ---
const Handwriting = () => {
    const frame = useCurrentFrame();
    const length = 500;
    const progress = interpolate(frame % 100, [0, 80], [length, 0], { extrapolateRight: 'clamp' });
    
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="200" height="100" viewBox="0 0 200 100">
                <path 
                    d="M 20 80 Q 50 10 100 50 T 180 20" 
                    fill="none" 
                    stroke="#ff00ff" 
                    strokeWidth="5" 
                    strokeDasharray={length}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

// --- Pattern 3: HUD HUD Circle ---
const HUDCircle = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
                <circle 
                    cx="50" cy="50" r="40" fill="none" stroke="#00ffff" strokeWidth="2" 
                    strokeDasharray="60 100" 
                    style={{ transform: `rotate(${frame * 2}deg)`, transformOrigin: 'center' }}
                />
                <circle 
                    cx="50" cy="50" r="35" fill="none" stroke="#ff00ff" strokeWidth="1" 
                    strokeDasharray="10 20" 
                    style={{ transform: `rotate(${-frame * 3}deg)`, transformOrigin: 'center' }}
                />
            </svg>
        </div>
    );
};

// --- Pattern 4: SVG Pattern Tiling ---
const SVGPattern = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10, overflow: 'hidden' }}>
            <svg width="100%" height="100%">
                <defs>
                    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect 
                            x={Math.sin(frame * 0.1) * 10} 
                            y={Math.cos(frame * 0.1) * 10} 
                            width="20" height="20" fill="#222" rx="5" 
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
};

// --- Pattern 5: Dynamic Box ---
const DynamicBox = () => {
    const frame = useCurrentFrame();
    const w = 150 + Math.sin(frame * 0.05) * 50;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="250" height="100" viewBox="0 0 250 100">
                <rect 
                    x={125 - w/2} y="30" width={w} height="40" 
                    fill="none" stroke="#fff" strokeWidth="2" rx="10"
                />
                <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">REMOTION SVG</text>
            </svg>
        </div>
    );
};

// --- Pattern 6: Pulsing Rings ---
const PulsingRings = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
                {[0, 1, 2].map(i => {
                    const p = ((frame + i * 20) % 60) / 60;
                    return (
                        <circle 
                            key={i} cx="50" cy="50" 
                            r={p * 45} fill="none" stroke="#fff" strokeWidth={2 * (1 - p)} 
                            opacity={1 - p}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

// --- Pattern 7: Spiral Wave ---
const SpiralWave = () => {
    const frame = useCurrentFrame();
    const path = "M 50 50 m 0 0 a 5 5 0 1 1 5 -5 a 10 10 0 1 1 10 -10 a 15 15 0 1 1 15 -15 a 20 20 0 1 1 20 -20";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
                <path 
                    d={path} fill="none" stroke="#00ffff" strokeWidth="2" 
                    strokeDasharray="10 5"
                    style={{ transform: `rotate(${frame * 5}deg)`, transformOrigin: 'center' }}
                />
            </svg>
        </div>
    );
};

// --- Pattern 8: Zigzag Divider ---
const Zigzag = () => {
    const frame = useCurrentFrame();
    const length = 200;
    const progress = (frame * 2) % (length * 2);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="200" height="50" viewBox="0 0 200 50">
                <path 
                    d="M 0 25 L 20 10 L 40 40 L 60 10 L 80 40 L 100 10 L 120 40 L 140 10 L 160 40 L 180 10 L 200 25" 
                    fill="none" stroke="#ff00ff" strokeWidth="3" 
                    strokeDasharray="10 10"
                    strokeDashoffset={progress}
                />
            </svg>
        </div>
    );
};

// --- Pattern 9: Corner HUD ---
const CornerHUD = () => {
    const frame = useCurrentFrame();
    const s = 10 + Math.sin(frame * 0.1) * 5;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
                <path d={`M 10 ${10+s} L 10 10 L ${10+s} 10`} fill="none" stroke="#fff" strokeWidth="2" />
                <path d={`M 90 ${10+s} L 90 10 L ${90-s} 10`} fill="none" stroke="#fff" strokeWidth="2" />
                <path d={`M 10 ${90-s} L 10 90 L ${10+s} 90`} fill="none" stroke="#fff" strokeWidth="2" />
                <path d={`M 90 ${90-s} L 90 90 L ${90-s} 90`} fill="none" stroke="#fff" strokeWidth="2" />
                <circle cx="50" cy="50" r={s} fill="#fff" opacity="0.5" />
            </svg>
        </div>
    );
};

// --- Pattern 10: Vector Particles ---
const VectorParticles = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
                {[...Array(8)].map((_, i) => (
                    <circle 
                        key={i} 
                        cx={50 + Math.cos(frame * 0.02 + i) * 30} 
                        cy={50 + Math.sin(frame * 0.03 + i) * 30} 
                        r={2 + (i % 3)} 
                        fill="#00ffff" 
                        opacity={0.5 + Math.sin(frame * 0.1 + i) * 0.5} 
                    />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 11: Grid Dots ---
const GridDots = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[...Array(25)].map((_, i) => (
                    <circle key={i} cx={(i % 5) * 20 + 10} cy={Math.floor(i / 5) * 20 + 10} r="4" fill="#555" opacity={0.3 + Math.sin(frame * 0.1 + i) * 0.5} />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 12: Diamond Pattern ---
const Diamonds = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <rect x="25" y="25" width="50" height="50" fill="none" stroke="#fff" strokeWidth="2" style={{ transform: `rotate(${frame + 45}deg)`, transformOrigin: 'center' }} />
                <rect x="35" y="35" width="30" height="30" fill="none" stroke="#00ffff" strokeWidth="1" style={{ transform: `rotate(${-frame + 45}deg)`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 13: Line Wave ---
const LineWave = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[...Array(5)].map((_, i) => (
                    <line key={i} x1={20 + i * 15} y1="10" x2={20 + i * 15 + Math.sin(frame * 0.1 + i) * 10} y2="90" stroke="#fff" strokeWidth="2" />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 14: Bouncing Squares ---
const BouncingSquares = () => {
    const frame = useCurrentFrame();
    const x = 20 + Math.abs(Math.sin(frame * 0.05) * 40);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <rect x={x} y="30" width="20" height="20" fill="#ff00ff" />
                <rect x={60 - x} y="50" width="20" height="20" fill="#00ffff" />
            </svg>
        </div>
    );
};

// --- Pattern 15: Sine Wave Line ---
const SineLine = () => {
    const frame = useCurrentFrame();
    const points = [...Array(21)].map((_, i) => `${i * 5},${50 + Math.sin(frame * 0.1 + i * 0.5) * 20}`).join(' ');
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <polyline points={points} fill="none" stroke="#fff" strokeWidth="2" />
            </svg>
        </div>
    );
};

// --- Pattern 16: Hexagon Outline ---
const PulseHex = () => {
    const frame = useCurrentFrame();
    const s = 1 + Math.sin(frame * 0.1) * 0.1;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <path d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" fill="none" stroke="#00ffff" strokeWidth="2" style={{ transform: `scale(${s})`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 17: Step Animation ---
const Steps = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[0, 1, 2, 3].map(i => {
                    const h = (frame * 2 + i * 20) % 80;
                    return <rect key={i} x={10 + i * 20} y={90 - h} width="15" height={h} fill="#fff" opacity={0.5} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 18: Radial Lines ---
const RadialLines = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[...Array(12)].map((_, i) => (
                    <line key={i} x1="50" y1="50" x2={50 + Math.cos(i * 30 * Math.PI / 180) * 40} y2={50 + Math.sin(i * 30 * Math.PI / 180) * 40} stroke="#ff00ff" strokeWidth="1" opacity={0.5 + Math.sin(frame * 0.2 + i) * 0.5} />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 19: Simple DNA (SVG) ---
const SimpleDNA = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[...Array(10)].map((_, i) => {
                    const y = 10 + i * 8;
                    const x1 = 50 + Math.sin(frame * 0.1 + i) * 20;
                    const x2 = 50 + Math.sin(frame * 0.1 + i + Math.PI) * 20;
                    return (
                        <g key={i}>
                            <line x1={x1} y1={y} x2={x2} y2={y} stroke="#555" strokeWidth="1" />
                            <circle cx={x1} cy={y} r="2" fill="#00ffff" />
                            <circle cx={x2} cy={y} r="2" fill="#ff00ff" />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// --- Pattern 20: Scanner HUD ---
const ScannerHUD = () => {
    const frame = useCurrentFrame();
    const y = (frame * 2) % 100;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <rect x="10" y="10" width="80" height="80" fill="none" stroke="#333" strokeWidth="1" />
                <line x1="10" y1={y} x2="90" y2={y} stroke="#00ffff" strokeWidth="2" />
                <rect x="10" y={y - 10} width="80" height="10" fill="url(#scanGrad)" opacity="0.3" />
                <defs>
                    <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
                        <stop offset="100%" stopColor="#00ffff" stopOpacity="1" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

// --- Pattern 21: Spinning Crosses ---
const SpinningCrosses = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[0, 1, 2, 3].map(i => (
                    <g key={i} style={{ transform: `translate(${(i%2)*40+30}px, ${Math.floor(i/2)*40+30}px) rotate(${frame * 2}deg)` }}>
                        <line x1="-5" y1="0" x2="5" y2="0" stroke="#fff" strokeWidth="1" />
                        <line x1="0" y1="-5" x2="0" y2="5" stroke="#fff" strokeWidth="1" />
                    </g>
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 22: Concentric Hexagons ---
const ConcentricHex = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[0, 1, 2].map(i => {
                    const p = ((frame + i * 20) % 60) / 60;
                    const s = p * 1.5;
                    return (
                        <path 
                            key={i} d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" 
                            fill="none" stroke="#ff00ff" strokeWidth="1" 
                            style={{ transform: `scale(${s})`, transformOrigin: 'center' }}
                            opacity={1 - p}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

// --- Pattern 23: Digital Rain (Binary) ---
const DigitalRain = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                {[...Array(6)].map((_, i) => {
                    const y = (frame * (1 + i * 0.2) + i * 50) % 120 - 10;
                    return <text key={i} x={10 + i * 16} y={y} fill="#0f0" fontSize="10" fontFamily="monospace">{frame % 2 === 0 ? '1' : '0'}</text>
                })}
            </svg>
        </div>
    );
};

// --- Pattern 24: Shield Shape ---
const ShieldShape = () => {
    const frame = useCurrentFrame();
    const s = 0.8 + Math.sin(frame * 0.05) * 0.1;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <path d="M 50 10 C 20 10 10 30 10 60 C 10 90 50 95 50 95 C 50 95 90 90 90 60 C 90 30 80 10 50 10 Z" fill="none" stroke="#fff" strokeWidth="2" style={{ transform: `scale(${s})`, transformOrigin: 'center' }} />
                <path d="M 50 20 L 75 35 L 75 55 L 50 70 L 25 55 L 25 35 Z" fill="#fff" opacity="0.2" style={{ transform: `scale(${s})`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 25: Energy Pulse ---
// --- Pattern 25: Energy Pulse ---
const EnergyPulse = () => {
    const frame = useCurrentFrame();
    const points = [...Array(10)].map((_, i) => `${i * 10},${50 + (Math.sin(frame * 0.2 + i) * 10)}`).join(' ');
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 100 100">
                <polyline points={points} fill="none" stroke="#00ffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
    );
};

// --- Pattern 26: Cross Pattern ---
const CrossPattern = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => (
                    <g key={i} style={{ transform: `translate(${(i%2)*30+15}px, ${Math.floor(i/2)*30+15}px) rotate(${frame * 3}deg)` }}>
                        <line x1="-5" y1="0" x2="5" y2="0" stroke="#aaa" strokeWidth="1" />
                        <line x1="0" y1="-5" x2="0" y2="5" stroke="#aaa" strokeWidth="1" />
                    </g>
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 27: Wavy Grid ---
const WavyGrid = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => {
                    const points = [...Array(11)].map((_, j) => `${j * 6},${15 + i * 10 + Math.sin(frame * 0.1 + j + i) * 5}`).join(' ');
                    return <polyline key={i} points={points} fill="none" stroke="#666" strokeWidth="1" />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 28: Concentric Squares ---
const ConcentricSquares = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2].map(i => {
                    const p = ((frame + i * 20) % 60) / 60;
                    const size = p * 50;
                    return <rect key={i} x={30 - size/2} y={30 - size/2} width={size} height={size} fill="none" stroke="#fff" strokeWidth="1" opacity={1-p} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 29: Scanning Vertical ---
const ScanVertical = () => {
    const frame = useCurrentFrame();
    const x = (frame * 1.5) % 60;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <line x1={x} y1="5" x2={x} y2="55" stroke="#00ffff" strokeWidth="2" />
                <rect x={x-5} y="5" width="5" height="50" fill="rgba(0,255,255,0.2)" />
            </svg>
        </div>
    );
};

// --- Pattern 30: Morse Code Stream ---
const MorseCode = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2].map(i => {
                    const x = (frame * 2 + i * 40) % 100 - 20;
                    return <g key={i}>
                        <circle cx={x} cy="30" r="2" fill="#fff" />
                        <rect x={x+10} y="29" width="10" height="2" fill="#fff" />
                        <circle cx={x+25} cy="30" r="2" fill="#fff" />
                    </g>;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 31: Recursive Circles ---
const RecursiveCircles = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="none" stroke="#555" strokeWidth="1" />
                <circle cx="30" cy="30" r="15" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="10 5" style={{ transform: `rotate(${frame * 4}deg)`, transformOrigin: 'center' }} />
                <circle cx="30" cy="30" r="8" fill="none" stroke="#ff00ff" strokeWidth="1" style={{ transform: `rotate(${-frame * 6}deg)`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 32: Triangle Pattern ---
const Triangles = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => (
                    <polygon 
                        key={i} points="0,-10 10,10 -10,10" fill="#333" stroke="#fff" strokeWidth="0.5"
                        style={{ transform: `translate(${(i%2)*30+15}px, ${Math.floor(i/2)*30+15}px) scale(${0.5 + Math.sin(frame * 0.1 + i) * 0.2})` }}
                    />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 33: Pulse Star ---
const PulseStar = () => {
    const frame = useCurrentFrame();
    const s = 0.8 + Math.sin(frame * 0.1) * 0.2;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <path d="M 30 5 L 35 25 L 55 30 L 35 35 L 30 55 L 25 35 L 5 30 L 25 25 Z" fill="#00ffff" style={{ transform: `scale(${s})`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 34: Snake Path ---
const SnakePath = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <path 
                    d="M 10 10 L 50 10 L 50 50 L 10 50 L 10 30 L 30 30" 
                    fill="none" stroke="#ff00ff" strokeWidth="2" 
                    strokeDasharray="20 180" strokeDashoffset={frame * 2}
                />
            </svg>
        </div>
    );
};

// --- Pattern 35: Bubbles Up ---
const BubblesUp = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => {
                    const y = (60 - (frame + i * 15) % 60);
                    const x = 30 + Math.sin(frame * 0.1 + i) * 10;
                    return <circle key={i} cx={x} cy={y} r="3" fill="#fff" opacity={y/60} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 36: Orbit HUD 2 ---
const OrbitHUD2 = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="5" fill="#fff" />
                {[1, 2, 3].map(i => {
                    const a = frame * (0.1 / i);
                    const r = i * 6;
                    return <circle key={i} cx={30 + Math.cos(a) * r} cy={30 + Math.sin(a) * r} r="1.5" fill="#00ffff" />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 37: Glitch Blocks ---
const GlitchBlocks = () => {
    const frame = useCurrentFrame();
    if (frame % 10 > 2) return <div style={{ flex: 1, backgroundColor: '#111', borderRadius: 10, margin: 2 }} />;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <rect x="10" y="10" width="40" height="10" fill="#f00" opacity="0.5" />
                <rect x="20" y="30" width="30" height="5" fill="#0f0" opacity="0.5" />
                <rect x="5" y="45" width="50" height="2" fill="#00f" opacity="0.5" />
            </svg>
        </div>
    );
};

// --- Pattern 38: Rainbow Path ---
const RainbowPath = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <path d="M 5 30 Q 30 0 55 30" fill="none" stroke={`hsla(${frame * 5}, 80%, 60%, 1)`} strokeWidth="3" />
                <path d="M 5 30 Q 30 60 55 30" fill="none" stroke={`hsla(${frame * 5 + 180}, 80%, 60%, 1)`} strokeWidth="3" />
            </svg>
        </div>
    );
};

// --- Pattern 39: Checkerboard ---
const Checkerboard = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => {
                    const fill = (i + (frame % 30 < 15 ? 0 : 1)) % 2 === 0 ? '#333' : '#777';
                    return <rect key={i} x={(i%2)*30} y={Math.floor(i/2)*30} width="30" height="30" fill={fill} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 40: Vortex Spiral ---
const VortexSpiral = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => (
                    <path 
                        key={i} d="M 30 30 Q 50 10 30 0" fill="none" stroke="#fff" strokeWidth="1"
                        style={{ transform: `rotate(${frame * 4 + i * 90}deg)`, transformOrigin: 'center' }}
                    />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 41: Concentric Triangles ---
const ConcentricTri = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2].map(i => {
                    const p = ((frame + i * 20) % 60) / 60;
                    const s = p * 1.5;
                    return <polygon key={i} points="30,10 50,45 10,45" fill="none" stroke="#fff" strokeWidth="1" style={{ transform: `scale(${s})`, transformOrigin: 'center' }} opacity={1-p} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 42: Moving Barcode ---
const Barcode = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(8)].map((_, i) => (
                    <rect key={i} x={((frame + i * 15) % 80) - 10} y="10" width={2 + (i % 3) * 2} height="40" fill="#fff" />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 43: Spiral Dots ---
const SpiralDots = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(12)].map((_, i) => {
                    const r = i * 2;
                    const a = frame * 0.1 + i * 0.5;
                    return <circle key={i} cx={30 + Math.cos(a) * r} cy={30 + Math.sin(a) * r} r="1.5" fill="#00ffff" />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 44: Zigzag Wave ---
const ZigzagWave = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1].map(i => (
                    <polyline key={i} points="0,20 10,40 20,20 30,40 40,20 50,40 60,20" fill="none" stroke={i === 0 ? "#ff00ff" : "#00ffff"} strokeWidth="2" style={{ transform: `translate(${Math.sin(frame * 0.1 + i) * 10}px, ${i * 10}px)` }} />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 45: Floating Diamonds ---
const FloatingDiamonds = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => {
                    const x = (i * 123 + frame * 0.5) % 60;
                    const y = (i * 456 + frame * 0.3) % 60;
                    return <rect key={i} x={x} y={y} width="6" height="6" fill="#fff" opacity="0.4" style={{ transform: 'rotate(45deg)', transformOrigin: 'center' }} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 46: Radar Sweep ---
const RadarSweep = () => {
    const frame = useCurrentFrame();
    const a = frame * 5;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="none" stroke="#333" strokeWidth="1" />
                <line x1="30" y1="30" x2={30 + Math.cos(a * Math.PI / 180) * 25} y2={30 + Math.sin(a * Math.PI / 180) * 25} stroke="#0f0" strokeWidth="2" />
            </svg>
        </div>
    );
};

// --- Pattern 47: Grid Crosses ---
const GridCrosses = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2, 3].map(i => {
                    const s = 0.5 + Math.sin(frame * 0.1 + i) * 0.5;
                    return <g key={i} style={{ transform: `translate(${(i%2)*30+15}px, ${Math.floor(i/2)*30+15}px) scale(${s})` }}>
                        <line x1="-5" y1="0" x2="5" y2="0" stroke="#fff" strokeWidth="1" />
                        <line x1="0" y1="-5" x2="0" y2="5" stroke="#fff" strokeWidth="1" />
                    </g>
                })}
            </svg>
        </div>
    );
};

// --- Pattern 48: Double Sine Wave ---
const DoubleSine = () => {
    const frame = useCurrentFrame();
    const p1 = [...Array(13)].map((_, i) => `${i * 5},${30 + Math.sin(frame * 0.1 + i * 0.5) * 15}`).join(' ');
    const p2 = [...Array(13)].map((_, i) => `${i * 5},${30 + Math.sin(frame * 0.1 + i * 0.5 + Math.PI) * 15}`).join(' ');
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <polyline points={p1} fill="none" stroke="#ff0" strokeWidth="1" />
                <polyline points={p2} fill="none" stroke="#f0f" strokeWidth="1" />
            </svg>
        </div>
    );
};

// --- Pattern 49: Pulsing Hexagons ---
const PulsingHexagons = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 100 100">
                {[0, 1, 2].map(i => {
                    const p = ((frame + i * 20) % 60) / 60;
                    return <path key={i} d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" fill="none" stroke="#00ffff" strokeWidth="1" style={{ transform: `scale(${p*1.5})`, transformOrigin: 'center' }} opacity={1-p} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 50: Morse Vertical ---
const MorseVertical = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2].map(i => {
                    const y = (frame * 2 + i * 40) % 100 - 20;
                    return <g key={i}>
                        <circle cx="30" cy={y} r="2" fill="#fff" />
                        <rect x="29" y={y+10} width="2" height="10" fill="#fff" />
                    </g>;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 51: Recursive Squares ---
const RecursiveSquares = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[1, 2, 3].map(i => (
                    <rect key={i} x={30-i*8} y={30-i*8} width={i*16} height={i*16} fill="none" stroke="#aaa" strokeWidth="1" style={{ transform: `rotate(${frame * i}deg)`, transformOrigin: 'center' }} />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 52: L-System Tree (SVG) ---
const SVGTree = () => {
    const frame = useCurrentFrame();
    const branch = (x:number, y:number, len:number, a:number, d:number) => {
        if (d === 0) return null;
        const x2 = x + Math.cos(a) * len;
        const y2 = y + Math.sin(a) * len;
        return (
            <g key={d+len}>
                <line x1={x} y1={y} x2={x2} y2={y2} stroke="#0f0" strokeWidth={d/2} />
                {branch(x2, y2, len * 0.7, a + 0.4 + Math.sin(frame * 0.1) * 0.2, d - 1)}
                {branch(x2, y2, len * 0.7, a - 0.4, d - 1)}
            </g>
        );
    };
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {branch(30, 55, 12, -Math.PI/2, 5)}
            </svg>
        </div>
    );
};

// --- Pattern 53: Binary Stream (Dense) ---
const BinaryDense = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(12)].map((_, i) => (
                    <text key={i} x={(i % 4) * 15 + 5} y={((frame * (1 + i * 0.1) + i * 5) % 60)} fill="#0f0" fontSize="8" fontFamily="monospace">{Math.random() > 0.5 ? '1' : '0'}</text>
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 54: Radar Sweep (Fading) ---
const RadarFading = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="none" stroke="#333" />
                <path d="M 30 30 L 30 5 A 25 25 0 0 1 55 30 Z" fill="rgba(0,255,0,0.3)" style={{ transform: `rotate(${frame * 5}deg)`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 55: Bezier Curve ---
const BezierWave = () => {
    const frame = useCurrentFrame();
    const d = `M 0 30 Q 30 ${30 + Math.sin(frame * 0.1) * 30} 60 30`;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <path d={d} fill="none" stroke="#fff" strokeWidth="2" />
            </svg>
        </div>
    );
};

// --- Pattern 56: Polka Dot Bloom ---
const DotBloom = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(9)].map((_, i) => {
                    const s = 1 + Math.sin(frame * 0.1 + i) * 0.5;
                    return <circle key={i} cx={(i%3)*20+10} cy={Math.floor(i/3)*20+10} r={4 * s} fill="#00ffff" opacity="0.6" />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 57: Windy Lines ---
const WindyLines = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(10)].map((_, i) => (
                    <line key={i} x1={(frame * (i+1) * 0.5 + i * 10) % 80 - 10} y1={i * 6} x2={(frame * (i+1) * 0.5 + i * 10) % 80} y2={i * 6} stroke="#fff" strokeWidth="1" />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 58: Target HUD ---
const TargetHUD = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="10" fill="none" stroke="#f00" strokeWidth="1" />
                <line x1="15" y1="30" x2="45" y2="30" stroke="#f00" strokeWidth="1" />
                <line x1="30" y1="15" x2="30" y2="45" stroke="#f00" strokeWidth="1" />
                <path d="M 10 30 A 20 20 0 0 1 30 10" fill="none" stroke="#f00" strokeWidth="2" style={{ transform: `rotate(${frame * 5}deg)`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 59: Stardust Twinkle ---
const Stardust = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(15)].map((_, i) => (
                    <circle key={i} cx={(i * 123) % 60} cy={(i * 456) % 60} r={Math.random() * 1.5} fill="#fff" opacity={0.3 + Math.sin(frame * 0.2 + i) * 0.7} />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 60: Nested Pentagons ---
const NestedPentagons = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[1, 2].map(i => {
                    const s = (0.5 + Math.sin(frame * 0.1 + i) * 0.2) * i;
                    return <polygon key={i} points="30,5 55,25 45,55 15,55 5,25" fill="none" stroke="#00ffff" strokeWidth="1" style={{ transform: `scale(${s})`, transformOrigin: 'center' }} />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 61: Interlocking Rings ---
const InterlockingRings = () => {
    const frame = useCurrentFrame();
    const x1 = 20 + Math.sin(frame * 0.1) * 10;
    const x2 = 40 - Math.sin(frame * 0.1) * 10;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx={x1} cy="30" r="15" fill="none" stroke="#ff00ff" strokeWidth="2" />
                <circle cx={x2} cy="30" r="15" fill="none" stroke="#00ffff" strokeWidth="2" />
            </svg>
        </div>
    );
};

// --- Pattern 62: Vibrating String ---
const VibratingString = () => {
    const frame = useCurrentFrame();
    const points = [...Array(11)].map((_, i) => `${i * 6},${30 + (Math.random() - 0.5) * (Math.sin(frame * 0.5) * 10)}`).join(' ');
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <polyline points={points} fill="none" stroke="#fff" strokeWidth="1" />
            </svg>
        </div>
    );
};

// --- Pattern 63: Crystal Growth ---
const CrystalGrowth = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2].map(i => (
                    <polygon key={i} points="30,30 20,40 40,40" fill="none" stroke="#fff" style={{ transform: `rotate(${frame * 2 + i * 120}deg) translate(0, ${Math.sin(frame * 0.1) * 10}px)` }} />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 64: Flowing River ---
const FlowingRiver = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[0, 1, 2].map(i => {
                    const p = [...Array(13)].map((_, j) => `${j * 5},${15 + i * 15 + Math.sin(frame * 0.1 + j * 0.5 + i) * 5}`).join(' ');
                    return <polyline key={i} points={p} fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.6" />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 65: Star Burst ---
const StarBurst = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(8)].map((_, i) => {
                    const l = (frame % 20) / 20 * 25;
                    const a = i * 45 * Math.PI / 180;
                    return <line key={i} x1="30" y1="30" x2={30 + Math.cos(a) * l} y2={30 + Math.sin(a) * l} stroke="#fff" strokeWidth="1" />;
                })}
            </svg>
        </div>
    );
};

// --- Pattern 66: Geometric Eye ---
const GeometricEye = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <path d="M 5 30 Q 30 0 55 30 Q 30 60 5 30" fill="none" stroke="#666" strokeWidth="1" />
                <circle cx="30" cy="30" r={8 + Math.sin(frame * 0.1) * 2} fill="none" stroke="#fff" strokeWidth="2" />
                <circle cx="30" cy="30" r="3" fill="#fff" />
            </svg>
        </div>
    );
};

// --- Pattern 67: Abstract Mask ---
const AbstractMask = () => {
    const frame = useCurrentFrame();
    const d = `M 30 10 C ${10 + Math.sin(frame * 0.1) * 10} 10 10 30 30 50 C 50 30 50 10 30 10`;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <path d={d} fill="rgba(255,255,255,0.2)" stroke="#fff" strokeWidth="1" />
            </svg>
        </div>
    );
};

// --- Pattern 68: Static Noise (SVG) ---
const SVGStatic = () => {
    useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                {[...Array(20)].map((_, i) => (
                    <rect key={i} x={Math.random() * 60} y={Math.random() * 60} width="2" height="2" fill="#fff" opacity={Math.random()} />
                ))}
            </svg>
        </div>
    );
};

// --- Pattern 69: Heart Beat ---
const HeartBeat = () => {
    const frame = useCurrentFrame();
    const s = 1 + Math.pow(Math.sin(frame * 0.1), 4) * 0.3;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 100 100">
                <path d="M 50 40 C 50 20 20 20 20 40 C 20 60 50 80 50 90 C 50 80 80 60 80 40 C 80 20 50 20 50 40" fill="#f00" style={{ transform: `scale(${s})`, transformOrigin: 'center' }} />
            </svg>
        </div>
    );
};

// --- Pattern 70: Infinite Loop ---
const InfiniteLoop = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 10, margin: 2 }}>
            <svg width="60" height="60" viewBox="0 0 100 60">
                <path 
                    d="M 30 30 C 10 10 10 50 30 30 C 50 10 50 50 30 30" 
                    fill="none" stroke="#fff" strokeWidth="3" 
                    strokeDasharray="20 100" strokeDashoffset={frame * 2}
                />
            </svg>
        </div>
    );
};

export const SvgGraphicsCatalog: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
        backgroundColor: '#000', padding: 10, 
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(10, 1fr)', 
        gap: 2 
    }}>
      <PathMorphing />
      <Handwriting />
      <HUDCircle />
      <SVGPattern />
      <DynamicBox />
      <PulsingRings />
      <SpiralWave />
      <Zigzag />
      <CornerHUD />
      <VectorParticles />
      <GridDots />
      <Diamonds />
      <LineWave />
      <BouncingSquares />
      <SineLine />
      <PulseHex />
      <Steps />
      <RadialLines />
      <SimpleDNA />
      <ScannerHUD />
      <SpinningCrosses />
      <ConcentricHex />
      <DigitalRain />
      <ShieldShape />
      <EnergyPulse />
      <CrossPattern />
      <WavyGrid />
      <ConcentricSquares />
      <ScanVertical />
      <MorseCode />
      <RecursiveCircles />
      <Triangles />
      <PulseStar />
      <SnakePath />
      <BubblesUp />
      <OrbitHUD2 />
      <GlitchBlocks />
      <RainbowPath />
      <Checkerboard />
      <VortexSpiral />
      <ConcentricTri />
      <Barcode />
      <SpiralDots />
      <ZigzagWave />
      <FloatingDiamonds />
      <RadarSweep />
      <GridCrosses />
      <DoubleSine />
      <PulsingHexagons />
      <MorseVertical />
      <RecursiveSquares />
      <SVGTree />
      <BinaryDense />
      <RadarFading />
      <BezierWave />
      <DotBloom />
      <WindyLines />
      <TargetHUD />
      <Stardust />
      <NestedPentagons />
      <InterlockingRings />
      <VibratingString />
      <CrystalGrowth />
      <FlowingRiver />
      <StarBurst />
      <GeometricEye />
      <AbstractMask />
      <SVGStatic />
      <HeartBeat />
      <InfiniteLoop />
    </AbsoluteFill>
  );
};
