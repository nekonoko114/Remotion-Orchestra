import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

type Props = {
    children: React.ReactNode;
    color?: string; // Color of the shine (usually white or gold)
    delay?: number;
    duration?: number;
};

export const TextShine: React.FC<Props> = ({ 
    children, 
    color = "rgba(255, 255, 255, 0.8)", 
    delay = 10, 
    duration = 30 
}) => {
    const frame = useCurrentFrame();
    
    // Mask Position: moves from -100% to 200% (left to right)
    const progress = interpolate(frame - delay, [0, duration], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 1, 0.5, 1),
    });

    const opacity = interpolate(frame - delay, [0, duration/2, duration], [0, 1, 0], {
         extrapolateLeft: "clamp",
         extrapolateRight: "clamp",
    });

    if (frame < delay) return <>{children}</>;

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {/* The Base Text */}
            {children}

            {/* The Shine Overlay - Masked by the text itself (using background-clip: text if supported, or just absolute overlay with mix-blend-mode) */}
            {/* Since mixing blend modes on text can be tricky, we'll use a mask-image approach or simple overlay if the shape is simple. */}
            {/* For precise text shine, typically we duplicate the text and mask it. */}
            
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                mixBlendMode: "overlay", // Enhances brightness
                background: `linear-gradient(120deg, transparent ${progress - 20}%, ${color} ${progress}%, transparent ${progress + 20}%)`,
                opacity: opacity,
                zIndex: 10
            }} />
             
             {/* "Glint" Sparkle that follows the sweep */}
             <div style={{
                 position: "absolute",
                 top: "20%",
                 left: `${progress}%`,
                 width: 20,
                 height: "60%",
                 background: "white",
                 filter: "blur(5px)",
                 transform: "skewX(-20deg)",
                 opacity: opacity * 0.8,
                  zIndex: 11
             }} />
        </div>
    );
};
