import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Group, Fill, Rect, Circle, Paint, Blur, ColorMatrix, SweepGradient, LinearGradient, Skia, vec, BlendMode } from '@shopify/react-native-skia';

// --- 1. Glassmorphism Card ---
const GlassmorphismCard: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            {/* Dynamic Background */}
            <Group>
                <Circle cx={width/3 + Math.sin(frame*0.02)*100} cy={height/3 + Math.cos(frame*0.03)*100} r={400} color="#ff00ff" />
                <Circle cx={width*0.7 - Math.cos(frame*0.02)*100} cy={height*0.7 - Math.sin(frame*0.03)*100} r={450} color="#00ffff" />
                <Circle cx={width/2} cy={height/2 - Math.sin(frame*0.05)*200} r={300} color="#ffaa00" />
            </Group>
            
            {/* Glass Card */}
            <Group>
                <Rect x={width/2 - 300} y={height/2 - 450} width={600} height={900} color="rgba(255,255,255,0.1)">
                    <Paint><Blur blur={40} /></Paint>
                </Rect>
                <Rect x={width/2 - 300} y={height/2 - 450} width={600} height={900} color="rgba(255,255,255,0.05)" style="stroke" strokeWidth={2} />
                
                {/* Reflected Highlight */}
                <Rect x={width/2 - 300} y={height/2 - 450} width={600} height={900}>
                   <Paint><LinearGradient start={vec(width/2 - 300, height/2 - 450)} end={vec(width/2 + 300, height/2 + 450)} colors={['rgba(255,255,255,0.4)', 'transparent', 'rgba(255,255,255,0.1)']} positions={[0, 0.5, 1]}/></Paint>
                </Rect>
            </Group>
        </Group>
    );
};

// --- 2. Chromatic Aberration ---
const ChromaticAberration: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    
    // Complex scene to distort
    const Scene = () => (
        <Group>
            <Circle cx={width/2} cy={height/2} r={300} style="stroke" strokeWidth={40} />
            <Rect x={width/2 - 200} y={height/2 - 200} width={400} height={400} style="stroke" strokeWidth={20} />
            <Circle cx={width/2} cy={height/2} r={50} />
        </Group>
    );

    const offset = Math.sin(frame * 0.3) * 15 + (Math.random() < 0.1 ? 40 : 0);

    return (
        <Group>
            <Fill color="#000" />
            <Group blendMode="screen">
                <Group transform={[{translateX: -offset}]} color="#ff0000">
                    <Scene />
                </Group>
                <Group transform={[{translateX: 0}]} color="#00ff00">
                    <Scene />
                </Group>
                <Group transform={[{translateX: offset}]} color="#0000ff">
                    <Scene />
                </Group>
            </Group>
        </Group>
    );
};

// --- 3. Holographic Foil ---
const HolographicFoil: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Rect x={0} y={0} width={width} height={height}>
                <Paint><SweepGradient c={vec(width/2, height/2)} transform={[{rotate: frame * 0.05}]} colors={['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']}/></Paint>
            </Rect>
            <Group opacity={0.6} blendMode="multiply">
                {[...Array(5)].map((_, i) => (<Rect key={i} x={0} y={0} width={width} height={height}><Paint><LinearGradient start={vec(Math.sin(frame*0.01 + i)*width, 0)} end={vec(Math.cos(frame*0.015 + i)*width, height)} colors={['#000', '#fff', '#000']}/></Paint></Rect>))}
            </Group>
        </Group>
    );
};

// --- 4. Neon Plasma ---
const NeonPlasma: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    
    // Simulating plasma with massively blurred overlapping color waves
    return (
        <Group>
            <Fill color="#020010" />
            <Group blendMode="screen">
                {[...Array(6)].map((_, i) => {
                    const cx = width/2 + Math.sin(frame*0.02 + i) * width/3;
                    const cy = height/2 + Math.cos(frame*0.015 + i*2) * height/3;
                    const r = 300 + Math.sin(frame*0.05 + i)*200;
                    const hue = (frame + i * 60) % 360;
                    return (
                        <Circle key={i} cx={cx} cy={cy} r={r} color={`hsl(${hue}, 100%, 60%)`}><Paint><Blur blur={150} /></Paint></Circle>
                    );
                })}
            </Group>
        </Group>
    );
};

// --- 5. Thermal Vision ---
const ThermalVision: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    return (
        <Group>
            <Fill color="#000033" /> {/* Cold background */}
            <Group>
                {/* Heat sources */}
                <Circle cx={width/2 + Math.sin(frame*0.05)*200} cy={height/2} r={250} color="white"><Paint><Blur blur={100} /></Paint></Circle>
                <Circle cx={width*0.3} cy={height*0.7 + Math.cos(frame*0.03)*150} r={200} color="rgba(255,255,255,0.8)"><Paint><Blur blur={80} /></Paint></Circle>
                <Circle cx={width*0.8} cy={height*0.2 - Math.sin(frame*0.04)*100} r={150} color="rgba(255,255,255,0.6)"><Paint><Blur blur={60} /></Paint></Circle>
                
                {/* ColorMatrix to map Alpha (heat intensity) to Thermal Colors (Black -> Blue -> Green -> Red -> White) */}
                <Paint>
                    <ColorMatrix matrix={[
                        // R
                        2.5, 0, 0, 0, -0.5,
                        // G
                        1.5, 0, 0, 0, -0.2,
                        // B
                        -1.0, 0, 0, 0, 1.0,
                        // A
                        0, 0, 0, 1, 0,
                    ]} />
                </Paint>
            </Group>
        </Group>
    );
};

export const SHADER_EFFECTS = [
    { name: 'GLASSMORPHISM', comp: GlassmorphismCard, accent: '#ffffff' },
    { name: 'CHROMATIC ABERRATION', comp: ChromaticAberration, accent: '#ff0055' },
    { name: 'HOLOGRAPHIC FOIL', comp: HolographicFoil, accent: '#00ffff' },
    { name: 'NEON PLASMA', comp: NeonPlasma, accent: '#ff00ff' },
    { name: 'THERMAL VISION', comp: ThermalVision, accent: '#ff5500' },
];
