import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { 
  Canvas, 
  Group, 
  Circle, 
  Paint, 
  Blur, 
  Fill, 
  vec, 
  SweepGradient, 
  Path, 
  Skia,
  mix
} from "@shopify/react-native-skia";

// --- 1. Neon Pulse Rings ---
const NeonPulseRings: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const rings = 8;

    return (
        <Group>
            {/* Background Layer */}
            <Fill color="#000" />
            
            {[...Array(rings)].map((_, i) => {
                const p = ((i / rings) + (frame * 0.02)) % 1;
                const radius = p * Math.max(width, height) * 0.7;
                const opacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
                
                return (
                    <Group key={i}>
                        <Circle
                            cx={width / 2}
                            cy={height / 2}
                            r={radius}
                            style="stroke"
                            strokeWidth={4 + p * 20}
                        >
                            <Paint color={`hsla(${(frame * 2 + i * 40) % 360}, 90%, 65%, ${opacity})`}>
                                <Blur blur={8 + p * 15} />
                            </Paint>
                        </Circle>
                        {/* Core Line */}
                        <Circle
                            cx={width / 2}
                            cy={height / 2}
                            r={radius}
                            style="stroke"
                            strokeWidth={2}
                            color="white"
                            opacity={opacity * 0.8}
                        />
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 2. Dynamic Liquid Path ---
const LiquidPath: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const createPath = () => {
        const path = Skia.Path.Make();
        const center = vec(width / 2, height / 2);
        const radius = 300;
        
        for (let i = 0; i <= 360; i += 10) {
            const angle = (i * Math.PI) / 180;
            const dist = radius + Math.sin(angle * 5 + frame * 0.1) * 50;
            const x = center.x + Math.cos(angle) * dist;
            const y = center.y + Math.sin(angle) * dist;
            if (i === 0) path.moveTo(x, y); else path.lineTo(x, y);
        }
        path.close();
        return path;
    };

    return (
        <Group>
            <Fill color="#050510" />
            <Path
                path={createPath()}
                style="stroke"
                strokeWidth={15}
                color="#00ffff"
            >
                <Paint>
                    <SweepGradient
                        c={vec(width / 2, height / 2)}
                        colors={["#00ffff", "#ff00ff", "#00ffff"]}
                    />
                    <Blur blur={20} />
                </Paint>
            </Path>
            <Path
                path={createPath()}
                style="stroke"
                strokeWidth={5}
                color="white"
            />
        </Group>
    );
};

// --- Main Showcase Composition ---

const SKIA_COMPONENTS = [
    { name: "NEON PULSE", comp: NeonPulseRings },
    { name: "LIQUID MORPH", comp: LiquidPath },
];

export const SkiaEffectsShowcase: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const cycleDuration = 90;
    const index = Math.floor(frame / cycleDuration) % SKIA_COMPONENTS.length;
    const current = SKIA_COMPONENTS[index];

    const contentOpacity = interpolate(
        frame % cycleDuration,
        [0, 15, cycleDuration - 15, cycleDuration],
        [0, 1, 1, 0]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <Canvas style={{ flex: 1 }}>
                <Group opacity={contentOpacity}>
                    <current.comp />
                </Group>
            </Canvas>

            {/* UI Overlay */}
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                <div style={{
                    opacity: contentOpacity,
                    padding: '40px 80px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 40,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ 
                        color: '#fff', fontSize: 70, margin: 0, 
                        fontWeight: 900, letterSpacing: 15,
                        textShadow: '0 0 20px rgba(255,255,255,0.5)'
                    }}>
                        {current.name}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, marginTop: 20, letterSpacing: 5 }}>
                        REACT-NATIVE-SKIA POWERED • 60FPS
                    </p>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
