import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';
import { ThreeColorStripes } from '../ThreeColorStripes';

// 1. Quiet Night (A-Melody: 0s - 52.7s)
// Deep blue/black, slow floating particles, subtle vignette.
export const QuietNight: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
    const frame = useCurrentFrame();
    
    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(to bottom, #050510, #101025)',
            overflow: 'hidden',
        }}>
            {/* GSAP 3-Color Stripe Animation (Overlay) */}
            <ThreeColorStripes />

            {/* Subtle Stars */}
            {[...Array(50)].map((_, i) => {
                const x = random(i) * 100;
                const y = random(i + 1) * 100;
                const size = random(i + 2) * 2 + 1;
                const opacity = Math.sin(frame * 0.02 + random(i) * 10) * 0.3 + 0.5;
                
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        opacity,
                        boxShadow: `0 0 ${size * 2}px white`,
                    }} />
                );
            })}
             {/* Floating Dust */}
             {[...Array(20)].map((_, i) => {
                const x = (random(i + 10) * 100 + frame * 0.05) % 100;
                const y = (random(i + 11) * 100 + frame * 0.1) % 100;
                return (
                    <div key={`dust-${i}`} style={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        width: '1px',
                        height: '1px',
                        backgroundColor: 'rgba(200, 200, 255, 0.3)',
                        borderRadius: '50%',
                    }} />
                )
             })}
        </AbsoluteFill>
    );
};
