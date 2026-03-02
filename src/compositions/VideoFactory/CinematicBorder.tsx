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

    const scale = width / 1080;

    // Spark animation logic
    const inset = 10 * scale;
    const innerWidth = width - inset * 2;
    const innerHeight = height - inset * 2;
    const perimeter = (innerWidth + innerHeight) * 2;
    
    // Speed: scale speed too
    const speed = 15 * scale; 
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
                    border: `${4 * scale}px solid ${color}`,
                    boxShadow: `
                        0 0 ${20 * scale}px ${glowColor}, 
                        inset 0 0 ${20 * scale}px ${glowColor},
                        0 0 ${40 * scale}px ${color},
                        inset 0 0 ${40 * scale}px ${color}
                    `,
                    filter: `brightness(${breath})`,
                    opacity: 0.9
                }}
            />

            {/* Moving Purple Spark */}
            <div
                style={{
                    position: "absolute",
                    left: sparkX - 60 * scale, 
                    top: sparkY - 60 * scale,
                    width: 120 * scale,
                    height: 120 * scale,
                    background: color,
                    borderRadius: "50%",
                    boxShadow: `
                        0 0 ${60 * scale}px ${color},
                        0 0 ${120 * scale}px ${color},
                        0 0 ${200 * scale}px ${color}
                    `,
                    transform: `scale(${1 + pulse * 0.3})`,
                    zIndex: 10,
                }}
            />
            
            {/* Optional Trail for spark (Visual polish) */}
            <div
                style={{
                    position: "absolute",
                    left: sparkX - 10 * scale,
                    top: sparkY - 10 * scale,
                    width: 20 * scale,
                    height: 20 * scale,
                    background: "white",
                    borderRadius: "50%",
                    filter: `blur(${5 * scale}px)`,
                    zIndex: 11,
                }}
            />
        </AbsoluteFill>
    );
};

export const LensFlare: React.FC<{ color: string }> = ({ color }) => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();
    const scale = width / 1080;

    // Movement of light source
    const moveX = Math.sin(frame * 0.01) * 5 * scale;
    const moveY = Math.cos(frame * 0.015) * 5 * scale;

    return (
        <AbsoluteFill style={{ pointerEvents: "none", zIndex: 140, mixBlendMode: "screen" }}>
            {/* Main Source */}
            <div style={{
                position: "absolute",
                top: "15%",
                left: "15%",
                transform: `translate(${moveX}px, ${moveY}px)`,
                width: 600 * scale,
                height: 600 * scale,
                background: `radial-gradient(circle, #FFFFFF 0%, ${color} 20%, transparent 60%)`,
                filter: `blur(${40 * scale}px)`,
                opacity: 0.8
            }} />
            
            {/* Horizontal Streak (Anamorphic) */}
            <div style={{
                position: "absolute",
                top: "15%",
                left: "50%",
                transform: `translate(-50%, ${moveY}px)`,
                width: "120%",
                height: 4 * scale,
                background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                filter: `blur(${2 * scale}px)`,
                opacity: 0.6
            }} />
            
            {/* Artifacts / Orbs */}
            <div style={{
                position: "absolute",
                top: "40%",
                left: "40%",
                transform: `translate(${moveX * -2}px, ${moveY * -2}px)`,
                width: 50 * scale,
                height: 50 * scale,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                border: `${1 * scale}px solid ${color}`,
                filter: `blur(${2 * scale}px)`
            }} />
             <div style={{
                position: "absolute",
                bottom: "30%",
                right: "30%",
                transform: `translate(${moveX * -4}px, ${moveY * -4}px)`,
                width: 100 * scale,
                height: 100 * scale,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                opacity: 0.2
            }} />
        </AbsoluteFill>
    );
};
