import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useBeatValue } from "./utils/beat-sync";

type Props = {
    color: string;
    glowColor: string;
};


export const CinematicBorder: React.FC<Props> = ({ color, glowColor }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const { pulse } = useBeatValue(180);
    
    // Subtle breathing for the glow
    const breath = Math.sin(frame * 0.05) * 0.2 + 1;

    // Spark animation logic
    const inset = 10;
    const innerWidth = width - inset * 2;
    const innerHeight = height - inset * 2;
    const perimeter = (innerWidth + innerHeight) * 2;
    
    // Speed: 1 cycle every 3 seconds (approx 90 frames at 30fps)
    const speed = 15; // pixels per frame approx
    const progress = (frame * speed) % perimeter;
    
    let sparkX = inset;
    let sparkY = inset;
    
    if (progress < innerWidth) {
        // Top edge: left to right
        sparkX = inset + progress;
        sparkY = inset;
    } else if (progress < innerWidth + innerHeight) {
        // Right edge: top to bottom
        sparkX = inset + innerWidth;
        sparkY = inset + (progress - innerWidth);
    } else if (progress < innerWidth * 2 + innerHeight) {
        // Bottom edge: right to left
        sparkX = inset + innerWidth - (progress - (innerWidth + innerHeight));
        sparkY = inset + innerHeight;
    } else {
        // Left edge: bottom to top
        sparkX = inset;
        sparkY = inset + innerHeight - (progress - (innerWidth * 2 + innerHeight));
    }

    return (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 150 }}>
            {/* Main Red Border */}
            <div
                style={{
                    position: "absolute",
                    inset: inset,
                    border: `4px solid ${color}`,
                    boxShadow: `
                        0 0 20px ${glowColor}, 
                        inset 0 0 20px ${glowColor},
                        0 0 40px ${color},
                        inset 0 0 40px ${color}
                    `,
                    filter: `brightness(${breath})`,
                    opacity: 0.9
                }}
            />

            {/* Moving Cyan Spark */}
            <div
                style={{
                    position: "absolute",
                    left: sparkX - 30, // Center the 30px spark
                    top: sparkY - 30,
                    width: 60,
                    height: 60,
                    background: "#00ccff",
                    borderRadius: "50%",
                    boxShadow: `
                        0 0 30px #00ccff,
                        0 0 60px #d000ff,
                        0 0 100px #d000ff
                    `,
                    transform: `scale(${1 + pulse * 0.3})`,
                    zIndex: 10,
                }}
            />
            
            {/* Optional Trail for spark (Visual polish) */}
            <div
                style={{
                    position: "absolute",
                    left: sparkX - 10,
                    top: sparkY - 10,
                    width: 20,
                    height: 20,
                    background: "white",
                    borderRadius: "50%",
                    filter: "blur(5px)",
                    zIndex: 11,
                }}
            />
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
