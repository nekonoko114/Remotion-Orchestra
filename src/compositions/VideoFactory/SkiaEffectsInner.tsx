import React, { useMemo } from 'react';
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

// --- Orchestrator ---
const EFFECTS = [
    { name: 'NEON PULSE', comp: NeonPulse, accent: '#00ffff' },
    { name: 'LIQUID MORPH', comp: LiquidMorph, accent: '#ff00ff' },
    { name: 'CYBER GRID', comp: CyberGrid, accent: '#00ff88' },
    { name: 'STAR DUST', comp: StarDust, accent: '#aaaaff' },
    { name: 'AURA BLOSSOM', comp: AuraBlossom, accent: '#ffaa00' },
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
