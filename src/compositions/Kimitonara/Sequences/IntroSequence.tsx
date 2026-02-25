import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from 'remotion';

// Sequence 1: Intro & A-Melody (0:00 - 0:43)
// Theme: Loneliness, Wireframe, Noise, Glitchy Text
export const IntroSequence: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const opacity = interpolate(frame, [0, 30], [0, 1]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#050510' }}>
            <AbsoluteFill style={{ opacity }}>
                {/* Background Noise/Fog */}
                {/* Wireframes */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'rgba(100, 100, 255, 0.2)',
                    fontSize: 40,
                    fontFamily: 'monospace',
                }}>
                    [ SYSTEM LOADING ]
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
