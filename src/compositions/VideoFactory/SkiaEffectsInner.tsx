import React, { useMemo } from 'react';
import { MORPHING_EFFECTS } from './SkiaCategoryMorphing';
import { SHADER_EFFECTS } from './SkiaCategoryShader';
import { PARTICLES_EFFECTS } from './SkiaCategoryParticles';
import { BLEND_MASK_EFFECTS } from './SkiaCategoryBlendMask';
import { TYPOGRAPHY_EFFECTS } from './SkiaCategoryTypography';
import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { SkiaCanvas } from '@remotion/skia';
import {
    Group,
    Circle,
    Paint,
    Blur,
    Fill,
    vec,
    SweepGradient,
    Path,
    Skia,
    Rect,
} from '@shopify/react-native-skia';

// --- 1. Neon Pulse ---
const NeonPulse: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const rings = 12;
    return (
        <Group>
            <Fill color="#000" />
            {[...Array(rings)].map((_, i) => {
                const p = ((i / rings) + (frame * 0.015)) % 1;
                const radius = p * Math.max(width, height) * 0.8;
                const opacity = Math.sin(p * Math.PI) * 0.9;
                const hue = (frame * 1.2 + i * 28) % 360;
                return (
                    <Group key={i}>
                        <Circle cx={width / 2} cy={height / 2} r={radius} style="stroke" strokeWidth={6 + p * 18}>
                            <Paint color={`hsla(${hue}, 90%, 60%, ${opacity})`}>
                                <Blur blur={14 + p * 22} />
                            </Paint>
                        </Circle>
                        <Circle cx={width / 2} cy={height / 2} r={radius} style="stroke" strokeWidth={2} color="white" opacity={opacity * 0.6} />
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 2. Liquid Morph ---
const LiquidMorph: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const path = useMemo(() => {
        const p = Skia.Path.Make();
        const center = vec(width / 2, height / 2);
        const radius = 340;
        for (let i = 0; i <= 360; i += 4) {
            const angle = (i * Math.PI) / 180;
            const amp = 50 + Math.sin(frame * 0.04) * 35;
            const dist = radius + Math.sin(angle * 7 + frame * 0.09) * amp
                + Math.cos(angle * 3 - frame * 0.06) * 25;
            const x = center.x + Math.cos(angle) * dist;
            const y = center.y + Math.sin(angle) * dist;
            if (i === 0) p.moveTo(x, y); else p.lineTo(x, y);
        }
        p.close();
        return p;
    }, [frame, width, height]);
    const hue = (frame * 0.8) % 360;
    return (
        <Group>
            <Fill color="#050010" />
            <Path path={path} style="stroke" strokeWidth={24} color={`hsl(${hue},100%,60%)`}>
                <Paint><Blur blur={28} /></Paint>
            </Path>
            <Path path={path} style="stroke" strokeWidth={5} color="white" opacity={0.85}>
                <Paint><SweepGradient c={vec(width / 2, height / 2)} colors={[`hsl(${hue},100%,65%)`, `hsl(${(hue + 120) % 360},100%,70%)`, `hsl(${hue},100%,65%)`]} /></Paint>
            </Path>
        </Group>
    );
};

// --- 3. Cyber Grid ---
const CyberGrid: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#000810" />
            {[...Array(22)].map((_, i) => {
                const x = (i / 22) * width;
                return <Rect key={`v-${i}`} x={x} y={0} width={1} height={height} color="#00448866" />;
            })}
            {[...Array(13)].map((_, i) => {
                const y = (i / 13) * height;
                return <Rect key={`h-${i}`} x={0} y={y} width={width} height={1} color="#00448866" />;
            })}
            <Rect x={0} y={(frame * 7) % height} width={width} height={5} color="#00ffff">
                <Paint><Blur blur={12} /></Paint>
            </Rect>
            <Rect x={0} y={(frame * 7) % height} width={width} height={1.5} color="white" />
            <Rect x={(frame * 5) % width} y={0} width={3} height={height} color="#ff00ff80">
                <Paint><Blur blur={8} /></Paint>
            </Rect>
        </Group>
    );
};

// --- 4. Star Dust ---
const StarDust: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const count = 300;
    const stars = useMemo(() => {
        return [...Array(count)].map((_, i) => ({
            x: (Math.sin(i * 127.1) * 0.5 + 0.5) * width,
            y: (Math.cos(i * 311.7) * 0.5 + 0.5) * height,
            size: 1 + (Math.sin(i * 231.5) * 0.5 + 0.5) * 3.5,
            speed: 0.4 + (Math.sin(i * 157.3) * 0.5 + 0.5) * 2,
        }));
    }, [width, height]);
    return (
        <Group>
            <Fill color="#000" />
            {stars.map((star: { x: number; y: number; speed: number; size: number }, i: number) => {
                const y = (star.y + frame * star.speed) % height;
                const opacity = Math.sin(frame * 0.08 + i * 0.3) * 0.5 + 0.5;
                return (
                    <Circle key={i} cx={star.x} cy={y} r={star.size} color="white" opacity={opacity}>
                        {star.size > 2.5 && <Paint><Blur blur={5} /></Paint>}
                    </Circle>
                );
            })}
        </Group>
    );
};

// --- 5. Aura Blossom ---
const AuraBlossom: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#000" />
            {['#ff0088', '#00ffff', '#ffff00', '#ff00ff', '#00ff88', '#ff8800'].map((color, i) => {
                const angle = (i / 6) * Math.PI * 2 + frame * 0.008;
                const dist = 160 + Math.sin(frame * 0.04 + i) * 60;
                const x = width / 2 + Math.cos(angle) * dist;
                const y = height / 2 + Math.sin(angle) * dist;
                const r = 220 + Math.sin(frame * 0.06 + i * 1.5) * 50;
                return (
                    <Circle key={i} cx={x} cy={y} r={r}>
                        <Paint color={color} opacity={0.4}><Blur blur={70} /></Paint>
                    </Circle>
                );
            })}
            <Circle cx={width / 2} cy={height / 2} r={100}>
                <Paint color="white" opacity={0.6}><Blur blur={40} /></Paint>
            </Circle>
        </Group>
    );
};

// --- 6. Holographic Scan ---
const HolographicScan: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const scanY = (frame * 8) % (height + 200) - 100;
    return (
        <Group>
            <Fill color="#000" />
            <Rect x={0} y={scanY} width={width} height={100} color="#00ffff33">
                <Paint><Blur blur={30} /></Paint>
            </Rect>
            <Rect x={0} y={scanY + 45} width={width} height={2} color="#00ffff" />
            {[...Array(15)].map((_, i) => {
                const x = (i / 15) * width + Math.sin(frame * 0.1 + i) * 20;
                return (
                    <Rect key={i} x={x} y={0} width={1.5} height={height} color="#00ffff22">
                        <Paint><Blur blur={4} /></Paint>
                    </Rect>
                );
            })}
        </Group>
    );
};

// --- 7. Cosmic Vortex ---
const CosmicVortex: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#020010" />
            {[...Array(40)].map((_, i) => {
                const angle = (i / 40) * Math.PI * 2 + frame * 0.02;
                const d = 50 + i * 15;
                const x = width / 2 + Math.cos(angle) * d;
                const y = height / 2 + Math.sin(angle) * d;
                const r = 5 + i * 0.8;
                return (
                    <Circle key={i} cx={x} cy={y} r={r}>
                        <Paint color={`hsla(${(frame + i * 10) % 360}, 100%, 70%, 0.4)`}>
                            <Blur blur={r * 0.5} />
                        </Paint>
                    </Circle>
                );
            })}
        </Group>
    );
};

// --- 8. Digital Rain ---
const DigitalRain: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const columns = 30;
    return (
        <Group>
            <Fill color="#000500" />
            {[...Array(columns)].map((_, i) => {
                const x = (i / columns) * width;
                const speed = 5 + (Math.sin(i * 13) * 0.5 + 0.5) * 10;
                const y = (frame * speed) % (height + 400) - 200;
                return (
                    <Group key={i}>
                        <Rect x={x} y={y - 150} width={2} height={150} color="#00ff00aa">
                            <Paint><Blur blur={8} /></Paint>
                        </Rect>
                        <Rect x={x} y={y} width={3} height={3} color="#ffffff" />
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 9. Energy Shield ---
const EnergyShield: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const path = useMemo(() => {
        const p = Skia.Path.Make();
        const sides = 6;
        const radius = 300 + Math.sin(frame * 0.05) * 20;
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const x = width / 2 + Math.cos(angle) * radius;
            const y = height / 2 + Math.sin(angle) * radius;
            if (i === 0) p.moveTo(x, y); else p.lineTo(x, y);
        }
        p.close();
        return p;
    }, [frame, width, height]);
    return (
        <Group>
            <Fill color="#000" />
            <Path path={path} style="stroke" strokeWidth={15} color="#0088ff">
                <Paint><Blur blur={40} /></Paint>
            </Path>
            <Path path={path} style="stroke" strokeWidth={3} color="#00ffff" />
            <Circle cx={width/2} cy={height/2} r={150 + Math.sin(frame*0.1)*30} color="#00ffff22">
                <Paint><Blur blur={50} /></Paint>
            </Circle>
        </Group>
    );
};

// --- 10. Prism Fractal ---
const PrismFractal: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#0a0a0a" />
            {[...Array(8)].map((_, i) => {
                const rotate = frame * 0.01 + (i * Math.PI) / 4;
                const scale = 1 + Math.sin(frame * 0.02 + i) * 0.5;
                const size = 150 * scale;
                return (
                    <Group key={i} origin={vec(width / 2, height / 2)} transform={[{ rotate }]}>
                        <Rect x={width / 2 - size / 2} y={height / 2 - size / 2} width={size} height={size} style="stroke" strokeWidth={3}>
                            <Paint color={`hsla(${(frame + i * 45) % 360}, 100%, 70%, 0.8)`}>
                                <Blur blur={10} />
                            </Paint>
                        </Rect>
                    </Group>
                );
            })}
        </Group>
    );
};
// --- 11. Fractal Kaleidoscope ---
const FractalKaleidoscope: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#000" />
            {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                return (
                    <Group key={i} origin={vec(width / 2, height / 2)} transform={[{ rotate: angle + frame * 0.005 }]}>
                        {[...Array(3)].map((__, j) => {
                            const scale = 0.5 + j * 0.4 + Math.sin(frame * 0.03 + j) * 0.1;
                            return (
                                <Group key={j} transform={[{ scale }]}>
                                    <Path
                                        path="M 0,0 L 100,-173 L -100,-173 Z"
                                        color={`hsla(${(frame * 2 + i * 30) % 360}, 100%, 65%, 0.3)`}
                                        style="stroke"
                                        strokeWidth={4}
                                        transform={[{ translate: [width / 2, height / 2] }]}
                                    >
                                        <Paint><Blur blur={12} /></Paint>
                                    </Path>
                                </Group>
                            );
                        })}
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 12. Audio Reactive Core (Simulated) ---
const AudioReactiveCore: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const intensity = Math.max(0.2, (Math.sin(frame * 0.2) + Math.cos(frame * 0.31)) * 0.5 + 0.5);
    return (
        <Group>
            <Fill color="#050510" />
            <Circle cx={width/2} cy={height/2} r={150 * (1 + intensity * 0.5)} color="#ff0088">
                <Paint><Blur blur={100 * intensity} /></Paint>
            </Circle>
            {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * Math.PI * 2 + frame * 0.04;
                const d = 250 + intensity * 150;
                return (
                    <Rect
                        key={i}
                        x={width/2 + Math.cos(angle) * d - 10}
                        y={height/2 + Math.sin(angle) * d - 5}
                        width={20 * intensity}
                        height={5}
                        color="#00ffff"
                        transform={[{ rotate: angle }]}
                    >
                        <Paint><Blur blur={5} /></Paint>
                    </Rect>
                );
            })}
        </Group>
    );
};

// --- 13. Gravitational Singularity ---
const GravitationalSingularity: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#000" />
            {[...Array(100)].map((_, i) => {
                const seed = i * 45.1;
                const distProgress = ( (seed + frame * 5) % 1000 ) / 1000;
                const angle = seed + frame * 0.01;
                const r = (1 - distProgress) * 600;
                const x = width/2 + Math.cos(angle) * r;
                const y = height/2 + Math.sin(angle) * r;
                return (
                    <Circle key={i} cx={x} cy={y} r={2 + (1-distProgress)*8} color={`hsla(${(frame + i) % 360}, 100%, 80%, ${distProgress})`}>
                        <Paint><Blur blur={4} /></Paint>
                    </Circle>
                );
            })}
            <Circle cx={width/2} cy={height/2} r={80} color="black" />
            <Circle cx={width/2} cy={height/2} r={95} style="stroke" strokeWidth={15}>
                 <Paint><SweepGradient c={vec(width/2, height/2)} colors={['#fff', '#ff00ff', '#00ffff', '#fff']} /><Blur blur={25} /></Paint>
            </Circle>
        </Group>
    );
};

// --- 14. Glitch Dimension ---
const GlitchDimension: React.FC = () => {
    const { width, height } = useVideoConfig();
    const isGlitch = Math.random() < 0.15;
    const offsetX = isGlitch ? (Math.random() - 0.5) * 60 : 0;
    return (
        <Group>
            <Fill color="#101010" />
            <Group transform={[{translateX: offsetX}]}>
                <Rect x={width/2 - 200} y={height/2 - 300} width={400} height={600} color="#00ff8844" />
                <Rect x={width/2 - 180 + offsetX} y={height/2 - 280} width={360} height={560} color="#ff00ff44" />
                <Rect x={width/2 - 190} y={height/2 - 290} width={380} height={580} color="#ffffff66" style="stroke" strokeWidth={2} />
            </Group>
            {[...Array(10)].map((_, i) => (
                <Rect key={i} x={0} y={Math.random()*height} width={width} height={Math.random()*10} color="#ffffff33" />
            ))}
        </Group>
    );
};

// --- 15. Molecular Network ---
const MolecularNetwork: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const points = useMemo(() => {
        return [...Array(20)].map((_, i) => ({
            x: (Math.sin(i * 123) * 0.5 + 0.5) * width,
            y: (Math.cos(i * 456) * 0.5 + 0.5) * height,
            vx: Math.sin(i * 789),
            vy: Math.cos(i * 321),
        }));
    }, [width, height]);

    return (
        <Group>
            <Fill color="#000510" />
            {points.map((p, i) => {
                const x = (p.x + p.vx * frame * 0.5) % width;
                const y = (p.y + p.vy * frame * 0.5) % height;
                return (
                    <Group key={i}>
                        {points.slice(i + 1, i + 4).map((p2, j) => {
                            const x2 = (p2.x + p2.vx * frame * 0.5) % width;
                            const y2 = (p2.y + p2.vy * frame * 0.5) % height;
                            return <Path key={j} path={`M ${x} ${y} L ${x2} ${y2}`} color="#00ffff44" style="stroke" strokeWidth={1} />;
                        })}
                        <Circle cx={x} cy={y} r={6} color="#00ffff">
                            <Paint><Blur blur={10} /></Paint>
                        </Circle>
                        <Circle cx={x} cy={y} r={2} color="white" />
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 16. Hyperspace Warp ---
const HyperspaceWarp: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const count = 150;
    const stars = useMemo(() => {
        return [...Array(count)].map((_, i) => ({
            angle: (i / count) * Math.PI * 2 + Math.random() * 0.1,
            seed: Math.random() * 1000,
        }));
    }, [count]);

    return (
        <Group>
            <Fill color="#000" />
            {stars.map((star, i) => {
                const speed = 15 + (i % 10);
                const progress = ((frame * speed + star.seed) % 2000) / 2000;
                const d = progress * Math.max(width, height);
                const x1 = width / 2 + Math.cos(star.angle) * d;
                const y1 = height / 2 + Math.sin(star.angle) * d;
                const x2 = width / 2 + Math.cos(star.angle) * (d + progress * 200);
                const y2 = height / 2 + Math.sin(star.angle) * (d + progress * 200);
                return (
                    <Path
                        key={i}
                        path={`M ${x1} ${y1} L ${x2} ${y2}`}
                        color={`rgba(255, 255, 255, ${progress})`}
                        style="stroke"
                        strokeWidth={2 + progress * 4}
                    >
                        <Paint><Blur blur={10 * progress} /></Paint>
                    </Path>
                );
            })}
        </Group>
    );
};

// --- 17. Kinetic Waveform ---
const KineticWaveform: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#020510" />
            {[...Array(5)].map((_, j) => {
                const path = useMemo(() => {
                    const p = Skia.Path.Make();
                    for (let x = 0; x <= width; x += 10) {
                        const freq = 0.02 + j * 0.005;
                        const amp = 100 + j * 40;
                        const y = height / 2 + Math.sin(x * freq + frame * 0.2 + j) * amp;
                        if (x === 0) p.moveTo(x, y); else p.lineTo(x, y);
                    }
                    return p;
                }, [frame, width, height, j]);
                return (
                    <Path
                        key={j}
                        path={path}
                        style="stroke"
                        strokeWidth={4}
                        color={`hsla(${(frame * 3 + j * 40) % 360}, 100%, 70%, 0.6)`}
                    >
                        <Paint><Blur blur={20} /></Paint>
                    </Path>
                );
            })}
        </Group>
    );
};

// --- 18. Techno Pulse Grid ---
const TechnoPulseGrid: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const gridCount = 20;
    return (
        <Group>
            <Fill color="#000" />
            <Group origin={vec(width/2, height/2)} transform={[{skewX: 0.3}]}>
                {[...Array(gridCount)].map((_, i) => {
                    const x = (i / gridCount) * width;
                    const brightness = Math.sin(frame * 0.3 + i * 0.5) * 0.5 + 0.5;
                    return <Rect key={i} x={x} y={0} width={2} height={height} color={`rgba(0, 255, 255, ${brightness * 0.3})`} />;
                })}
                {[...Array(gridCount)].map((_, i) => {
                    const y = ( (frame * 15 + i * (height/gridCount)) % (height + 100) ) - 50;
                    return (
                        <Rect key={i} x={0} y={y} width={width} height={4} color="#00ffff">
                            <Paint><Blur blur={15} /></Paint>
                        </Rect>
                    );
                })}
            </Group>
        </Group>
    );
};

// --- 19. Lightning Burst ---
const LightningBurst: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const lightning = useMemo(() => {
        if (Math.random() > 0.1) return null;
        const p = Skia.Path.Make();
        let x = Math.random() * width;
        let y = 0;
        p.moveTo(x, y);
        for (let i = 0; i < 15; i++) {
            x += (Math.random() - 0.5) * 150;
            y += Math.random() * (height / 10);
            p.lineTo(x, y);
        }
        return p;
    }, [frame, width, height]);

    return (
        <Group>
            <Fill color="#050015" />
            {lightning && (
                <Group>
                    <Path path={lightning} style="stroke" strokeWidth={15} color="#88aaff">
                        <Paint><Blur blur={50} /></Paint>
                    </Path>
                    <Path path={lightning} style="stroke" strokeWidth={3} color="#ffffff" />
                </Group>
            )}
            <Fill color={lightning ? "rgba(255,255,255,0.1)" : "transparent"} />
        </Group>
    );
};

// --- 20. Velocity Trails ---
const VelocityTrails: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#0a0010" />
            {[...Array(8)].map((_, i) => {
                const xStep = width / 8;
                const x = i * xStep + xStep / 2;
                const speed = 15 + i * 5;
                const y = (frame * speed) % (height + 600) - 300;
                return (
                    <Group key={i}>
                        {[...Array(5)].map((__, j) => (
                            <Rect
                                key={j}
                                x={x - 25}
                                y={y - j * 40}
                                width={50}
                                height={20}
                                color={`hsla(${(frame*5 + i*20) % 360}, 100%, 70%, ${1 - j * 0.2})`}
                            >
                                <Paint><Blur blur={j * 5 + 5} /></Paint>
                            </Rect>
                        ))}
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 21. Vortex Tunnel ---
const VortexTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#000" />
            {[...Array(20)].map((_, i) => {
                const depth = ((i * 100 - frame * 5) % 2000 + 2000) % 2000;
                const scale = (2000 - depth) / 2000;
                const rotate = frame * 0.02 + i * 0.4;
                const hue = (frame + i * 15) % 360;
                return (
                    <Group key={i} origin={vec(width/2, height/2)} transform={[{scale}, {rotate}]}>
                        <Rect
                            x={width/2 - 400} y={height/2 - 400} width={800} height={800}
                            style="stroke" strokeWidth={10 / scale}
                            color={`hsla(${hue}, 100%, 60%, ${scale})`}
                        >
                            <Paint><Blur blur={20} /></Paint>
                        </Rect>
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 22. Hexagonal Corridor ---
const HexagonalCorridor: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const path = useMemo(() => {
        const p = Skia.Path.Make();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI/2;
            const x = Math.cos(angle) * 300;
            const y = Math.sin(angle) * 300;
            if (i === 0) p.moveTo(x, y); else p.lineTo(x, y);
        }
        p.close();
        return p;
    }, []);

    return (
        <Group>
            <Fill color="#020010" />
            {[...Array(15)].map((_, i) => {
                const z = ((i * 150 - frame * 8) % 2250 + 2250) % 2250;
                const scale = (2250 - z) / 2250;
                const opacity = scale;
                return (
                    <Group key={i} transform={[{translate: [width/2, height/2]}, {scale}]}>
                        <Path path={path} style="stroke" strokeWidth={5 / scale} color="#00ffff" opacity={opacity}>
                            <Paint><Blur blur={10} /></Paint>
                        </Path>
                        <Path path={path} style="stroke" strokeWidth={1 / scale} color="#ffffff" opacity={opacity} />
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 23. Data Stream Tunnel ---
const DataStreamTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#000" />
            {[...Array(40)].map((_, i) => {
                const seed = i * 73.1;
                const angle = seed;
                const d = 300;
                const xBase = Math.cos(angle) * d;
                const yBase = Math.sin(angle) * d;
                const z = ((seed + frame * 15) % 3000) / 3000;
                const scale = z * 2;
                const opacity = z;
                return (
                    <Group key={i} transform={[{translate: [width/2 + xBase * z, height/2 + yBase * z]}, {scale}]}>
                        <Rect x={-5} y={-20} width={10} height={40} color="#00ff00" opacity={opacity}>
                            <Paint><Blur blur={5} /></Paint>
                        </Rect>
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 24. Neon Transit ---
const NeonTransit: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#050015" />
            {[...Array(12)].map((_, i) => {
                const progress = ((i * 150 - frame * 10) % 1800 + 1800) % 1800;
                const scale = (1800 - progress) / 1800;
                const r = 400;
                return (
                    <Group key={i} transform={[{translate: [width/2, height/2]}, {scale}]}>
                        <Circle cx={0} cy={0} r={r} style="stroke" strokeWidth={8 / scale} color="#ff00ff">
                            <Paint><Blur blur={25} /></Paint>
                        </Circle>
                        <Circle cx={0} cy={0} r={r} style="stroke" strokeWidth={2 / scale} color="#ffffff" />
                    </Group>
                );
            })}
            <Fill color="rgba(255,0,255,0.05)" />
        </Group>
    );
};

// --- 25. Abstract Flow ---
const AbstractFlow: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#000" />
            {[...Array(30)].map((_, i) => {
                const seed = i * 19.3;
                const z = ((seed + frame * 4) % 1000) / 1000;
                const scale = z * 4;
                const x = (Math.sin(seed) * 0.8) * width/2;
                const y = (Math.cos(seed * 0.7) * 0.8) * height/2;
                return (
                    <Group key={i} transform={[{translate: [width/2 + x * z, height/2 + y * z]}, {scale}, {rotate: frame * 0.05 + i}]}>
                        <Rect x={-25} y={-25} width={50} height={50} color={`hsla(${(frame + i * 20) % 360}, 100%, 70%, ${z})`}>
                            <Paint><Blur blur={10} /></Paint>
                        </Rect>
                    </Group>
                );
            })}
        </Group>
    );
};

// --- Orchestrator ---
const EFFECTS = [
    { name: 'NEON PULSE', comp: NeonPulse, accent: '#00ffff' },
    { name: 'LIQUID MORPH', comp: LiquidMorph, accent: '#ff00ff' },
    { name: 'CYBER GRID', comp: CyberGrid, accent: '#00ff88' },
    { name: 'STAR DUST', comp: StarDust, accent: '#aaaaff' },
    { name: 'AURA BLOSSOM', comp: AuraBlossom, accent: '#ffaa00' },
    { name: 'HOLOGRAPHIC SCAN', comp: HolographicScan, accent: '#00ffff' },
    { name: 'COSMIC VORTEX', comp: CosmicVortex, accent: '#ff77ff' },
    { name: 'DIGITAL RAIN', comp: DigitalRain, accent: '#00ff00' },
    { name: 'ENERGY SHIELD', comp: EnergyShield, accent: '#0088ff' },
    { name: 'PRISM FRACTAL', comp: PrismFractal, accent: '#ffffff' },
    { name: 'FRACTAL KALEIDO', comp: FractalKaleidoscope, accent: '#ff00aa' },
    { name: 'AUDIO CORE', comp: AudioReactiveCore, accent: '#ff0088' },
    { name: 'SINGULARITY', comp: GravitationalSingularity, accent: '#00ffff' },
    { name: 'GLITCH DIMENSION', comp: GlitchDimension, accent: '#00ff88' },
    { name: 'MOLECULAR NET', comp: MolecularNetwork, accent: '#00ffff' },
    { name: 'HYPERSPACE', comp: HyperspaceWarp, accent: '#ffffff' },
    { name: 'KINETIC WAVE', comp: KineticWaveform, accent: '#00ffff' },
    { name: 'TECHNO GRID', comp: TechnoPulseGrid, accent: '#00ffff' },
    { name: 'LIGHTNING', comp: LightningBurst, accent: '#88aaff' },
    { name: 'VELOCITY TRAILS', comp: VelocityTrails, accent: '#ff00ff' },
    { name: 'VORTEX TUNNEL', comp: VortexTunnel, accent: '#00ffff' },
    { name: 'HEX CORRIDOR', comp: HexagonalCorridor, accent: '#ffffff' },
    { name: 'DATA STREAM', comp: DataStreamTunnel, accent: '#00ff00' },
    { name: 'NEON TRANSIT', comp: NeonTransit, accent: '#ff00ff' },
    { name: 'ABSTRACT FLOW', comp: AbstractFlow, accent: '#ffff00' },
    ...MORPHING_EFFECTS,
    ...SHADER_EFFECTS,
    ...PARTICLES_EFFECTS,
    ...BLEND_MASK_EFFECTS,
    ...TYPOGRAPHY_EFFECTS,
];

export const SkiaEffectsInner: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const cycleDuration = 180;
    const index = Math.floor(frame / cycleDuration) % EFFECTS.length;
    const current = EFFECTS[index];
    const opacity = interpolate(
        frame % cycleDuration,
        [0, 20, cycleDuration - 20, cycleDuration],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return (
        <>
            <SkiaCanvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} width={width} height={height}>
                <Group opacity={opacity}>
                    <current.comp />
                </Group>
            </SkiaCanvas>
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                pointerEvents: 'none',
            }}>
                <div style={{
                    width: '75%', padding: '50px 70px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(40px)',
                    borderRadius: 50, border: `1px solid ${current.accent}55`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    opacity,
                    boxShadow: `0 0 80px ${current.accent}22, 0 40px 100px rgba(0,0,0,0.6)`,
                    transform: `translateY(${Math.sin(frame * 0.05) * 8}px)`,
                }}>
                    <div style={{ color: current.accent, fontSize: 16, fontWeight: '800', letterSpacing: 10, marginBottom: 18 }}>
                        SKIA ENGINE • {index + 1} / {EFFECTS.length}
                    </div>
                    <h1 style={{
                        color: '#fff', fontSize: 72, margin: 0, fontWeight: 900, letterSpacing: 12,
                        textShadow: `0 0 40px ${current.accent}`, textAlign: 'center',
                    }}>
                        {current.name}
                    </h1>
                    <div style={{
                        height: 4, width: 200,
                        background: `linear-gradient(90deg, transparent, ${current.accent}, transparent)`,
                        marginTop: 36, borderRadius: 2,
                    }} />
                </div>
            </div>
        </>
    );
};

export default SkiaEffectsInner;
