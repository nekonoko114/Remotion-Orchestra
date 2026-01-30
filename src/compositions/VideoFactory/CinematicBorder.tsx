import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

type Props = {
    color: string;
    glowColor: string;
};

export const CinematicBorder: React.FC<Props> = ({ color, glowColor }) => {
    const frame = useCurrentFrame();
    
    // Subtle breathing for the glow
    const breath = Math.sin(frame * 0.05) * 0.2 + 1;

    return (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 150 }}>
            <div
                style={{
                    position: "absolute",
                    inset: 20, // 20px offset from edge
                    border: "15px solid rgba(255, 255, 255, 0.9)", // White inner border
                    boxShadow: `
                        0 0 20px ${glowColor}, 
                        inset 0 0 20px ${glowColor},
                        0 0 60px ${color},
                        inset 0 0 60px ${color}
                    `, // Double glow (inner/outer)
                    borderRadius: "30px", // Rounded corners for modern feel
                    filter: `brightness(${breath})`,
                    opacity: 0.8
                }}
            />
            
            {/* Corner Accents (Optional, for more "Tech" feel) */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </AbsoluteFill>
    );
};

export const LensFlare: React.FC<{ color: string }> = ({ color }) => {
    const frame = useCurrentFrame();
    
    // Movement of light source
    const moveX = Math.sin(frame * 0.01) * 5;
    const moveY = Math.cos(frame * 0.015) * 5;

    return (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 140, mixBlendMode: "screen" }}>
            {/* Main Source */}
            <div style={{
                position: "absolute",
                top: "15%",
                left: "15%",
                transform: `translate(${moveX}px, ${moveY}px)`,
                width: 600,
                height: 600,
                background: `radial-gradient(circle, #FFFFFF 0%, ${color} 20%, transparent 60%)`,
                filter: "blur(40px)",
                opacity: 0.8
            }} />
            
            {/* Horizontal Streak (Anamorphic) */}
            <div style={{
                position: "absolute",
                top: "15%",
                left: "50%",
                transform: `translate(-50%, ${moveY}px)`,
                width: "120%",
                height: 4,
                background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                filter: "blur(2px)",
                opacity: 0.6
            }} />
            
            {/* Artifacts / Orbs */}
            <div style={{
                position: "absolute",
                top: "40%",
                left: "40%",
                transform: `translate(${moveX * -2}px, ${moveY * -2}px)`,
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                border: `1px solid ${color}`,
                filter: "blur(2px)"
            }} />
             <div style={{
                position: "absolute",
                bottom: "30%",
                right: "30%",
                transform: `translate(${moveX * -4}px, ${moveY * -4}px)`,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                opacity: 0.2
            }} />
        </AbsoluteFill>
    );
};
