import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

// Simulating a Light Leak using CSS Gradients since @remotion/light-leaks is not installed
const SimulatedLightLeak: React.FC = () => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const opacity = interpolate(
        frame,
        [0, durationInFrames / 2, durationInFrames],
        [0, 0.8, 0]
    );

    const translate = interpolate(frame, [0, durationInFrames], [-20, 20]);

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(45deg, rgba(255,100,0,0.5) 0%, rgba(255,0,100,0) 70%)',
                mixBlendMode: 'screen',
                opacity,
                transform: `translateX(${translate}%) scale(1.5)`,
                pointerEvents: 'none',
            }}
        />
    );
};

export const VisualEffectsShowcase: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ color: 'white', fontFamily: 'sans-serif', fontSize: 60, zIndex: 1 }}>
                Light Leaks & FX
            </h1>
            {/* Simulated Light Leak Overlay */}
            <SimulatedLightLeak />
             <div style={{
                position: 'absolute',
                bottom: 50,
                width: '100%',
                textAlign: 'center',
                color: '#aaa',
                fontFamily: 'sans-serif',
                fontSize: 24,
            }}>
                (Simulated with CSS Gradients & Blending)
            </div>
        </AbsoluteFill>
    );
};
