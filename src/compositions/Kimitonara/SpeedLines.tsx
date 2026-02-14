import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from 'remotion';

const STAR_COLOR = '#B19CD9'; // Lavender / Purple theme

export const SpeedLines: React.FC = () => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();

    const lines = useMemo(() => {
        return new Array(15).fill(0).map((_, i) => {
            const seed = i;
            const top = random(seed) * 100; // 0-100%
            const height = random(seed + 1) * 20 + 2; // 2-22px thickness
            const speed = random(seed + 2) * 1.5 + 0.5; // speed multiplier
            const delay = random(seed + 3) * 20; // frame delay
            const opacity = random(seed + 4) * 0.5 + 0.1;

            return { top, height, speed, delay, opacity };
        });
    }, []);

    return (
        <AbsoluteFill style={{ overflow: 'hidden', zIndex: 1 }}>
            {lines.map((line, i) => {
                // Animation loop
                const duration = 20 / line.speed; // frames to cross screen
                const activeFrame = (frame - line.delay) % (duration + 30); // Loop with existing gap
                
                // Only render if active cycle
                if (frame < line.delay) return null;

                // Move from Left (-50%) to Right (150%)? Or Right to Left?
                // Ado style often Right->Left. Let's do Right->Left for impact.
                // Start: 150%, End: -50%
                
                const progress = interpolate(activeFrame, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
                
                // If progress > 1, it's in the "wait" period
                if (progress >= 1) return null;

                const translateX = interpolate(progress, [0, 1], [width * 1.2, -width * 0.5]);

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '150%', // Extra wide
                            height: `${line.height}px`,
                            top: `${line.top}%`,
                            left: 0,
                            background: `linear-gradient(90deg, transparent, ${STAR_COLOR}, transparent)`,
                            transform: `translateX(${translateX}px) rotate(-10deg) skewX(-20deg)`,
                            opacity: line.opacity,
                            filter: 'blur(2px)',
                            boxShadow: `0 0 10px ${STAR_COLOR}`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
