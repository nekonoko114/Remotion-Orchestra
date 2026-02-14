import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from 'remotion';

// --- Speed Lines Component (Intensified) ---
const HighSpeedLines: React.FC = () => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();

    const lines = useMemo(() => {
        return new Array(40).fill(0).map((_, i) => { // More lines
            const seed = i;
            const top = random(seed) * 100;
            const height = random(seed + 1) * 40 + 5; // Thicker
            const speed = random(seed + 2) * 5 + 2; // Much faster
            const delay = random(seed + 3) * 10; 
            const opacity = random(seed + 4) * 0.8 + 0.2;
            const color = i % 2 === 0 ? '#00ffff' : '#ff00ff'; // Neon colors

            return { top, height, speed, delay, opacity, color };
        });
    }, []);

    return (
        <AbsoluteFill style={{ overflow: 'hidden', zIndex: 0 }}>
            {lines.map((line, i) => {
                const duration = 15 / line.speed; 
                const activeFrame = (frame - line.delay) % (duration + 5); 
                
                if (frame < line.delay) return null;

                const progress = interpolate(activeFrame, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
                if (progress >= 1) return null;

                const translateX = interpolate(progress, [0, 1], [width * 1.5, -width * 0.5]);

                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '150%',
                            height: `${line.height}px`,
                            top: `${line.top}%`,
                            left: 0,
                            background: `linear-gradient(90deg, transparent, ${line.color}, transparent)`,
                            transform: `translateX(${translateX}px) rotate(-5deg) skewX(-40deg)`,
                            opacity: line.opacity,
                            filter: 'blur(4px) brightness(1.5)',
                            boxShadow: `0 0 15px ${line.color}`,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

// --- Glitch Text Component ---
const GlitchText: React.FC<{text: string}> = ({ text }) => {
    const frame = useCurrentFrame();
    
    // Random glitch offsets
    const offsetX = random(frame) > 0.8 ? (random(frame + 1) - 0.5) * 40 : 0;
    const offsetY = random(frame + 2) > 0.8 ? (random(frame + 3) - 0.5) * 40 : 0;
    const skew = random(frame + 4) > 0.9 ? (random(frame + 5) - 0.5) * 60 : 0;
    
    // Split color channels (RGB Split)
    const rShift = random(frame + 6) > 0.7 ? 10 : 0;
    const gShift = random(frame + 7) > 0.7 ? -10 : 0;
    const bShift = 0;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Main Text with Glitch Transform */}
            <h1
                style={{
                    color: 'white',
                    fontSize: 120,
                    fontFamily: 'Impact, sans-serif',
                    transform: `translate(${offsetX}px, ${offsetY}px) skewX(${skew}deg)`,
                    textShadow: `${rShift}px 0 red, ${gShift}px 0 green, ${bShift}px 0 blue`,
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {text}
            </h1>
        </div>
    );
}

// --- Camera Shake Container ---
const CameraShake: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    
    // Intense shake logic
    const shakeX = (random(frame * 123) - 0.5) * 30; // 30px magnitude
    const shakeY = (random(frame * 456) - 0.5) * 30;
    const rotate = (random(frame * 789) - 0.5) * 5; // 5 deg rotation

    return (
        <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px) rotate(${rotate}deg)` }}>
            {children}
        </AbsoluteFill>
    );
}


export const HighEnergyShowcase: React.FC = () => {
    const frame = useCurrentFrame();

    const bgColor = frame % 5 === 0 ? '#111' : '#000'; // Strobe background slightly

    return (
        <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden' }}>
            <CameraShake>
                <HighSpeedLines />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <GlitchText text="HIGH ENERGY" />
                    <GlitchText text="ACTION SKILLS" />
                     <div style={{
                        marginTop: 40,
                        backgroundColor: 'yellow',
                        color: 'black',
                        padding: '10px 30px',
                        fontSize: 40,
                        fontWeight: 'bold',
                        transform: `scale(${1 + Math.sin(frame * 0.5) * 0.1})`, // Pulse
                        boxShadow: '0 0 20px yellow'
                    }}>
                        SPEEDLINES + SHAKE + GLITCH
                    </div>
                </AbsoluteFill>
            </CameraShake>
        </AbsoluteFill>
    );
};
