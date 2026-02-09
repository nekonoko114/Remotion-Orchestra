import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Img, spring } from 'remotion';



interface SceneProps {
    imageSrc: string;
    characterName: string;
    color: string;
    duration: number;
    index: number;
    isChorus?: boolean;
    isEpilogue?: boolean; // New prop for special final scene
    additionalImages?: string[]; // New prop for slideshow
}

export const Scene: React.FC<SceneProps> = ({ imageSrc, characterName, color, duration, index, isChorus, isEpilogue, additionalImages = [] }) => {
    const frame = useCurrentFrame();

    // --- CHORUS SLIDESHOW LOGIC ---
    let currentImage = imageSrc;
    if (isChorus && additionalImages.length > 0) {
        // Change image every 20 frames (approx 0.6s)
        const slideIndex = Math.floor(frame / 20) % (additionalImages.length + 1);
        if (slideIndex > 0) {
            currentImage = additionalImages[slideIndex - 1];
        }
    }

    // --- ANIMATION VALUES ---
    const transitionSpring = spring({ frame, fps: 30, config: { damping: 12 } });

    // 1. Zoom & Scale
    const scaleBase = 1.05;
    const entranceZoom = interpolate(frame, [0, 60], [1.15, 1], { extrapolateRight: 'clamp' });
    const exitScale = interpolate(frame, [duration - 15, duration], [1, 1.1], { extrapolateLeft: 'clamp' });
    const transitionScale = interpolate(frame, [0, 20], [1.2, 1], { extrapolateRight: 'clamp' });
    const chorusScale = isChorus ? interpolate(frame % 90, [0, 45, 90], [1, 1.02, 1]) : 1;
    const impactScale = index % 4 === 0 ? interpolate(frame, [0, 10], [1.05, 1], { extrapolateRight: 'clamp' }) : 1;
    
    // 2. Rotation (Slight sway)
    const rotation = Math.sin(frame * 0.02) * 1.5; // Gentle sway
    const entranceRotation = index % 2 === 0 ? interpolate(frame, [0, 40], [2, 0], { extrapolateRight: 'clamp' }) : 0;
    const exitRotation = interpolate(frame, [duration - 10, duration], [0, index % 2 === 0 ? -2 : 2], { extrapolateLeft: 'clamp' });

    // 3. Position Shake (Gentle float)
    const shakeX = Math.sin(frame * 0.03) * 5; 
    const shakeY = Math.cos(frame * 0.04) * 3;

    // 4. Distortion & Ripple
    const liquidDistortion = Math.sin(frame * 0.05) * 2;
    const exitRipple = interpolate(frame, [duration - 15, duration], [0, 20], { extrapolateLeft: 'clamp' });

    // 5. Filter Effects
    const brightness = interpolate(frame, [0, 20], [1.2, 1], { extrapolateRight: 'clamp' });
    const sparkle = 1 + Math.sin(frame * 0.1) * 0.1; // Saturation sparkle
    const bokehBlur = interpolate(frame, [0, 10], [10, 0], { extrapolateRight: 'clamp' });
    const exitBlur = interpolate(frame, [duration - 10, duration], [0, 5], { extrapolateLeft: 'clamp' });
    const hueRotation = Math.sin(frame * 0.01) * 10; // Subtle color shift
    const exitHueRotation = interpolate(frame, [duration - 15, duration], [0, 45], { extrapolateLeft: 'clamp' });

    // 6. Opacity (Fade in/out)
    const opacity = interpolate(frame, [0, 15, duration - 15, duration], [0, 1, 1, 0]);

    // 7. Beat Pulse (for particles/overlay)
    const beatPulse = Math.sin(frame * 0.1) * 0.5 + 0.5;

    return (
        <AbsoluteFill style={{ backgroundColor: isEpilogue ? 'transparent' : 'black', overflow: 'hidden' }}>
            
            {/* 0. Character Aura (Behind character) with Parallax */}
            <div style={{
                position: 'absolute',
                top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
                background: isEpilogue 
                    ? 'radial-gradient(circle, rgba(155, 93, 229, 0.4) 0%, transparent 80%)'
                    : 'radial-gradient(circle, rgba(255, 182, 193, 0.5) 0%, transparent 70%)',
                transform: `scale(${1.2 + beatPulse * 0.05 + (frame * 0.0005)})`, // Slow parallax zoom
                opacity: (isEpilogue ? 0.5 : 0.7) * opacity,
                zIndex: 0,
                filter: 'blur(100px)',
            }} />

            {/* 0.5 GOD RAYS (Epilogue Only) */}
            {isEpilogue && (
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    width: '200%', height: '200%',
                    transform: `translate(-50%, -50%) rotate(${frame * 0.5}deg)`,
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 255, 255, 0.1) 20deg, transparent 40deg, rgba(255, 200, 255, 0.1) 60deg, transparent 80deg, rgba(255, 255, 255, 0.1) 100deg, transparent 120deg, rgba(255, 200, 255, 0.1) 140deg, transparent 160deg)',
                    zIndex: 0,
                    opacity: 0.8 * opacity,
                    pointerEvents: 'none',
                }} />
            )}

            {/* 1. Main Image Layer (Now Dynamic!) */}
            <div style={{
                position: 'absolute',
                top: isEpilogue ? '30%' : 0, 
                left: isEpilogue ? '33.3%' : 0, 
                width: isEpilogue ? '33.3%' : '100%', 
                height: isEpilogue ? '40%' : '100%',
                transform: `
                    scale(${scaleBase * transitionScale * exitScale * impactScale * chorusScale * entranceZoom * (isEpilogue ? (1 + Math.sin(frame * 0.05) * 0.02) : 1)}) 
                    rotate(${rotation + entranceRotation + exitRotation}deg) 
                    translate(${shakeX + liquidDistortion + exitRipple}px, ${shakeY + liquidDistortion * 0.5}px)
                `,
                filter: `
                    brightness(${brightness * 1.05}) 
                    saturate(${sparkle}) 
                    contrast(1.05)
                    blur(${bokehBlur + exitBlur}px)
                    hue-rotate(${hueRotation + exitHueRotation}deg)
                    ${isEpilogue ? 'drop-shadow(0 0 30px rgba(255, 105, 180, 0.6))' : ''}
                `,
                opacity,
                zIndex: 1,
                borderRadius: isEpilogue ? '20px' : 0,
                border: isEpilogue ? '12px solid white' : 'none',
                boxShadow: isEpilogue ? '0 30px 60px rgba(0,0,0,0.8), 0 0 100px rgba(255, 182, 193, 0.8)' : 'none',
                overflow: 'hidden',
                backgroundColor: 'transparent',
            }}>
                <Img 
                    src={currentImage} // Use dynamic image
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'top', 
                        backgroundColor: 'transparent',
                        filter: `
                            drop-shadow(0 0 20px rgba(255, 182, 193, 0.6))
                            drop-shadow(0 0 40px rgba(155, 93, 229, 0.4))
                            drop-shadow(0 0 60px rgba(255, 255, 255, 0.3))
                        ` 
                    }} 
                />
            </div>

            {/* ... (Existing Polaroid Code Omitted for Brevity - kept as is) ... */}
            {isChorus && additionalImages.length > 0 && (
                <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 10 }}>
                    {additionalImages.map((img, i) => {
                        // Stagger entrance: Every 12 frames
                        const appearFrame = 10 + i * 12;
                        const animScale = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                        const animOpacity = interpolate(frame, [appearFrame, appearFrame + 5], [0, 1], { extrapolateLeft: 'clamp' });
                        
                        // Scatter positions
                        const positions = [
                            { left: '8%', top: '15%', rot: -12 },   // 1
                            { right: '8%', bottom: '20%', rot: 8 }, // 2
                            { right: '12%', top: '12%', rot: 15 },  // 3
                            { left: '12%', bottom: '15%', rot: -5 }, // 4
                            { left: '5%', top: '45%', rot: -8 },    // 5
                            { right: '5%', top: '40%', rot: 10 },   // 6
                        ];
                        const pos = positions[i % positions.length];

                        if (frame < appearFrame) return null;

                        return (
                            <div key={`photo-${i}`} style={{
                                position: 'absolute',
                                left: pos.left, right: pos.right, top: pos.top, bottom: pos.bottom,
                                width: '28%',
                                transform: `rotate(${pos.rot}deg) scale(${animScale})`,
                                opacity: animOpacity * opacity,
                                border: '8px solid white',
                                borderBottom: '35px solid white',
                                boxShadow: '0 8px 15px rgba(0,0,0,0.4)',
                                backgroundColor: 'white',
                            }}>
                                <Img src={img} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                            </div>
                        );
                    })}
                </AbsoluteFill>
            )}

            {/* 1.5 Lens Flare Sparkles (On top of character) */}
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 3 }}>
                {[...Array(8)].map((_, i) => {
                    const flarePhase = (frame * 0.03 + i * 0.5) % 1;
                    const flareOpacity = Math.sin(flarePhase * Math.PI) * (0.5 + beatPulse * 0.3);
                    const flareX = 30 + (i * 11) % 40;
                    const flareY = 20 + (i * 13) % 60;
                    const flareSize = 10 + (i % 3) * 15 + beatPulse * 10;
                    
                    return (
                        <div key={`flare-${i}`} style={{
                            position: 'absolute',
                            left: `${flareX}%`,
                            top: `${flareY}%`,
                            width: `${flareSize}px`,
                            height: `${flareSize}px`,
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 200, 255, 0.5) 40%, transparent 70%)',
                            borderRadius: '50%',
                            opacity: flareOpacity * opacity,
                            transform: `scale(${1 + flarePhase * 0.5})`,
                        }} />
                    );
                })}
            </AbsoluteFill>

            {/* 2. Pastel Rainbow Overlay (Move & Blend) */}
            <AbsoluteFill style={{ 
                zIndex: 2, 
                opacity: (isEpilogue ? 0.2 : 0.12) * opacity,
                background: `linear-gradient(${frame * 0.5}deg, #ff99cc, #9b5de5, #ccffff, #ffffcc, #ff99cc)`,
                mixBlendMode: 'screen',
                pointerEvents: 'none',
            }} />


            {/* 3. Dreamy Pink Vignette */}
            <AbsoluteFill style={{
                zIndex: 9,
                pointerEvents: 'none',
                boxShadow: isEpilogue ? 'inset 0 0 200px rgba(255, 105, 180, 0.5)' : 'inset 0 0 150px rgba(255, 153, 204, 0.4)',
                opacity,
            }} />

            {/* 3.5 Mystical Light Sweep (光の流れ) */}
            <AbsoluteFill style={{
                zIndex: 8,
                pointerEvents: 'none',
                opacity: 0.3 * opacity,
                background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 55%, transparent 70%)`,
                backgroundSize: '200% 100%',
                backgroundPosition: `${interpolate(frame % 150, [0, 150], [150, -150])}% 0`,
                mixBlendMode: 'overlay',
            }} />

            {/* 4. Bokeh & Bubbles */}
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 4 }}>
                {[...Array(isEpilogue ? 40 : (isChorus ? 20 : 12))].map((_, i) => {
                    const t = (frame + i * 45) % 200;
                    const bOpacity = interpolate(t, [0, 30, 170, 200], [0, 0.6, 0.6, 0]);
                    const bScale = interpolate(t, [0, 200], [0.5, 2.0]);
                    const isBubble = i % 3 === 0;
                    
                    return (
                        <div key={`bokeh-${i}`} style={{
                            position: 'absolute',
                            left: `${(i * 317) % 100}%`,
                            top: `${(i * 157) % 100}%`,
                            width: isBubble ? '100px' : '150px',
                            height: isBubble ? '100px' : '150px',
                            borderRadius: '50%',
                            background: isBubble 
                                ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 70%)'
                                : `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(155, 93, 229, 0.5)' : 'rgba(255, 182, 193, 0.4)'} 0%, transparent 70%)`,
                            border: isBubble ? '2px solid rgba(255, 255, 255, 0.1)' : 'none',
                            filter: isBubble ? 'none' : 'blur(40px)',
                            opacity: bOpacity * opacity,
                            transform: `scale(${bScale}) translate(${Math.sin(t * 0.02 + i) * 30}px, ${-t * 0.5}px)`,
                        }} />
                    );
                })}
            </AbsoluteFill>

            {/* 5. Hearts & Stars & Diamond Dust */}
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 6 }}>
                {[...Array(isEpilogue ? 100 : (isChorus ? 50 : 30))].map((_, i) => {
                    const colors = ['#ff99cc', '#a2d2ff', '#cdb4db', '#ffafcc', '#bde0fe', '#fff']; // Pastel palette
                    const t = (frame + i * 25) % 150;
                    const pOpacity = interpolate(t, [0, 15, 135, 150], [0, 0.9, 0.9, 0]);
                    const pY = interpolate(t, [0, 150], [10, -180]);
                    const pX = Math.sin(t * 0.04 + i) * 60;
                    const isHeart = i % 5 === 0;
                    const isDust = i % 2 === 0 && !isHeart;
                    const size = isHeart ? 25 : isDust ? 2 : 6;
                    
                    return (
                        <div key={`particle-${i}`} style={{
                            position: 'absolute',
                            left: `${(i * 223) % 100}%`,
                            bottom: '0%',
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity: pOpacity * opacity,
                            transform: `translate(${pX}px, ${pY}px) rotate(${t * 2}deg)`,
                            zIndex: 6,
                        }}>
                            {isHeart ? (
                                <svg viewBox="0 0 32 32" fill="#ff99cc" style={{ filter: 'drop-shadow(0 0 5px #ff99cc)' }}>
                                    <path d="M16 28.5L14.1 26.7C7.2 20.5 2.7 16.3 2.7 11.2C2.7 7.1 5.9 3.9 10 3.9C12.3 3.9 14.5 5 16 6.8C17.5 5 19.7 3.9 22 3.9C26.1 3.9 29.3 7.1 29.3 11.2C29.3 16.3 24.8 20.5 17.9 26.7L16 28.5Z" />
                                </svg>
                            ) : (
                                <div style={{
                                    width: '100%', height: '100%',
                                    backgroundColor: isDust ? '#fff' : colors[i % colors.length],
                                    borderRadius: isDust ? '0%' : '50%',
                                    boxShadow: isDust ? '0 0 10px #fff' : `0 0 15px ${colors[i % colors.length]}`,
                                    clipPath: isDust ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none',
                                }} />
                            )}
                        </div>
                    );
                })}
            </AbsoluteFill>

            {/* 6. Falling Flower Petals */}
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 7 }}>
                {[...Array(isChorus ? 15 : 8)].map((_, i) => {
                    const t = (frame + i * 60) % 250;
                    const pOpacity = interpolate(t, [0, 20, 200, 250], [0, 1, 1, 0]);
                    const pY = interpolate(t, [0, 250], [-50, 1050]);
                    const pX = (i * 313) % 100 + Math.sin(t * 0.03 + i) * 100;
                    const pRotation = t * (i % 2 === 0 ? 1 : -1) * 0.8;
                    
                    return (
                        <div key={`petal-${i}`} style={{
                            position: 'absolute',
                            left: `${pX}%`,
                            top: `${pY}px`,
                            width: '30px',
                            height: '20px',
                            backgroundColor: '#ffc1e3',
                            borderRadius: '80% 10% 80% 10%',
                            opacity: pOpacity * opacity,
                            transform: `rotate(${pRotation}deg) rotateX(${t * 2}deg)`,
                            boxShadow: '0 0 10px rgba(255, 193, 227, 0.5)',
                        }} />
                    );
                })}
            </AbsoluteFill>
            
            {/* Character Label - BPM SYNC */}
            <div style={{
                position: 'absolute',
                top: 60, left: 60, display: 'flex', alignItems: 'center', gap: '12px',
                opacity,
                transform: `translateX(${interpolate(transitionSpring, [0, 1], [-20, 0])}px) scale(${1 + beatPulse * 0.05})`,
                zIndex: 10,
            }}>
                <div style={{
                    width: '8px', height: '40px',
                    backgroundColor: color,
                    boxShadow: `0 0 ${20 + beatPulse * 15}px ${color}`,
                }} />
                <h1 style={{
                    fontFamily: '"Mochiy Pop One"',
                    color: 'white', fontSize: '48px', margin: 0, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
                    textShadow: `0 4px ${10 + beatPulse * 5}px rgba(0,0,0,0.5)`,
                    WebkitTextStroke: '2px white',
                }}>
                    NOVA
                </h1>
            </div>
        </AbsoluteFill>
    );
};
