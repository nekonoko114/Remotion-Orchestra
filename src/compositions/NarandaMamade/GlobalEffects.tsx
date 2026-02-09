import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

interface GlobalEffectsProps {
    transitionFrames?: number[];
}

export const GlobalEffects: React.FC<GlobalEffectsProps> = ({ transitionFrames = [] }) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ 
            pointerEvents: 'none', 
            zIndex: 100,
            filter: `contrast(1.05) saturate(1.1)`, // Global Polish
        }}>
            {/* 0. Global Chromatic Aberration (Subtle Dreamy Feel) */}
            <AbsoluteFill style={{
                zIndex: 0,
                opacity: 0.15,
                background: 'transparent',
                boxShadow: 'inset 2px 0 10px rgba(255,0,0,0.3), inset -2px 0 10px rgba(0,255,255,0.3)',
            }} />
             {/* --- RICH VISUAL EFFECTS (High Quality Polish) --- */}
            
            {/* 1. Cinematic Vignette (Adds depth and focus to center) */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
                zIndex: 1,
            }} />

            {/* 2. Color Grading Overlay (Unifies tones with Nova's Purple/Blue) - LIGHTENED */}
            <AbsoluteFill style={{
                background: 'linear-gradient(to bottom right, rgba(155, 93, 229, 0.08), transparent 50%, rgba(20, 0, 60, 0.1))',
                zIndex: 2,
                mixBlendMode: 'overlay', // Blends nicely with the brightened image
            }} />

            {/* 3. Ambient Light (Subtle "Breathing" Glow) */}
            <AbsoluteFill style={{ zIndex: 3, opacity: 0.4 }}>
                 <div style={{
                     position: 'absolute',
                     top: '-20%',
                     left: '-20%',
                     width: '140%',
                     height: '140%',
                     background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.1), transparent 60%)',
                     transform: `scale(${1 + Math.sin(frame * 0.03) * 0.05})`, // Slow breath
                 }} />
            </AbsoluteFill>

            {/* SAFE VISIBLE BORDER - Standard CSS Border */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '25px solid rgba(155, 93, 229, 0.7)', // Solid Purple Frame
                    boxSizing: 'border-box',
                    zIndex: 4,
                    boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.4)',
                }} 
            />

            {/* Inner Accent Line */}
            <div
                style={{
                    position: 'absolute',
                    top: 25,
                    left: 25,
                    right: 25,
                    bottom: 25,
                    border: '3px solid rgba(255, 255, 255, 0.6)', // Silver/White Line
                    zIndex: 21,
                    borderRadius: '2px',
                }}
             />
            {/* 4. Scene Transition Flashes */}
            {transitionFrames.map((tFrame, i) => {
                const diff = frame - tFrame;
                if (diff < 0 || diff > 20) return null;
                // Quick flash that fades
                const flashOpacity = (1 - (diff / 20)) * 0.3;
                return (
                    <AbsoluteFill key={`flash-${i}-${tFrame}`} style={{
                        backgroundColor: 'white',
                        opacity: flashOpacity,
                        zIndex: 50,
                    }} />
                );
            })}
        </AbsoluteFill>
    );
};
