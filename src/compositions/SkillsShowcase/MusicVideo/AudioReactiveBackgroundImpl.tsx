import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { TunnelVariant } from './Tunnel3D';

export const AudioReactiveBackgroundImpl: React.FC<{ beat: number; variant?: TunnelVariant }> = ({ beat, variant = 'cyberpunk' }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    
    // ベースとなる時間やオーディオに反応するパラメータ群
    const time = frame / fps;
    const pulseScale = interpolate(beat, [0, 1], [1, 1.15]);
    const pulseOpacity = interpolate(beat, [0, 1], [0.5, 0.9]);
    const scrollY = (frame * 5) % 1000;

    const renderVariant = () => {
        switch (variant) {
            case 'wireframe':
                return (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#001100',
                        backgroundImage: `
                            linear-gradient(rgba(0, 255, 0, ${0.2 + beat * 0.3}) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 255, 0, ${0.2 + beat * 0.3}) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        backgroundPosition: `center ${scrollY}px`,
                        transform: `scale(${pulseScale}) perspective(500px) rotateX(45deg)`,
                        transformOrigin: 'bottom',
                        boxShadow: `inset 0 0 100px rgba(0,255,0,${beat})`
                    }} />
                );

            case 'fire':
                return (
                    <div style={{
                        position: 'absolute',
                        left: '-50%', top: '-50%', width: '200%', height: '200%',
                        background: `radial-gradient(circle at 50% ${60 + Math.sin(time*5)*10}%, rgba(255, 50, 0, ${pulseOpacity}), transparent 60%)`,
                        filter: `url(#fractal-noise) blur(${interpolate(beat, [0, 1], [20, 10])}px) contrast(20)`,
                        transform: `scale(${pulseScale})`,
                        mixBlendMode: 'screen'
                    }}>
                        <div style={{
                            width: '100%', height: '100%',
                            background: 'linear-gradient(0deg, #ff9900 0%, #ff0000 50%, transparent 100%)',
                            opacity: 0.7 + beat * 0.3,
                            mixBlendMode: 'multiply'
                        }} />
                    </div>
                );

            case 'warp':
                return (
                    <div style={{
                        width: '100%', height: '100%',
                        background: `conic-gradient(from ${time * 180}deg, #000, #40f, #000, #f04, #000)`,
                        transform: `scale(${pulseScale * 2})`, //大きくして中心に向かう吸い込み感を出す
                        filter: `blur(${interpolate(beat, [0, 1], [10, 0])}px)`,
                        opacity: 0.6 + beat * 0.4
                    }}>
                        <div style={{
                            width: '100%', height: '100%',
                            background: `repeating-radial-gradient(circle at center, transparent 0, transparent 20px, rgba(255,255,255,0.1) 21px, transparent 22px)`,
                            backgroundSize: '100% 100%',
                            transform: `scale(${1 + (frame % 30) / 30})`,
                            opacity: pulseOpacity
                        }}/>
                    </div>
                );

            case 'ethereal':
                return (
                     <div style={{
                        width: '100%', height: '100%',
                        background: `radial-gradient(circle at ${50 + Math.sin(time)*20}% ${50 + Math.cos(time)*20}%, #a2d2ff, #bde0fe, transparent)`,
                        opacity: 0.3 + beat * 0.2,
                        filter: 'blur(50px)',
                        transform: `scale(${pulseScale})`
                    }} />
                );

            case 'lightning':
                const isFlash = Math.random() < (0.05 + beat * 0.5);
                return (
                    <div style={{
                        width: '100%', height: '100%',
                        backgroundColor: isFlash ? '#fff' : '#000022',
                        opacity: isFlash ? 1 : 0.4
                    }}>
                        {isFlash && (
                            <div style={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                width: '2px', height: '100%',
                                backgroundColor: '#fff',
                                boxShadow: '0 0 20px #00f, 0 0 50px #0ff',
                                transform: `rotate(${Math.random() * 30 - 15}deg)`
                            }} />
                        )}
                    </div>
                );

            case 'split-fire':
               return (
                    <div style={{
                        display: 'flex', width: '100%', height: '100%',
                        transform: `scale(${pulseScale})`
                    }}>
                        {/* Red Side */}
                        <div style={{
                            flex: 1, height: '100%',
                            background: 'radial-gradient(circle at right, #ff0000, transparent)',
                            filter: `blur(40px) contrast(1.5) saturate(${1 + beat})`,
                        }} />
                        {/* Green Side */}
                        <div style={{
                            flex: 1, height: '100%',
                            background: 'radial-gradient(circle at left, #00ff00, transparent)',
                            filter: `blur(40px) contrast(1.5) saturate(${1 + beat})`,
                        }} />
                    </div>
                );

            case 'gold':
                return (
                    <div style={{
                        width: '100%', height: '100%',
                        background: `linear-gradient(${time * 50}deg, #332200, #ffcc00, #fff, #ffcc00, #332200)`,
                        backgroundSize: '200% 200%',
                        backgroundPosition: `${Math.sin(time)*100}% ${Math.cos(time)*100}%`,
                        opacity: pulseOpacity,
                        filter: `saturate(${1 + beat * 2}) brightness(${1 + beat})`
                    }} />
                );

            case 'kaleido':
                 return (
                    <div style={{
                        width: '100%', height: '100%',
                        background: `conic-gradient(from ${time * 90}deg, red, yellow, lime, aqua, blue, magenta, red)`,
                        maskImage: `repeating-conic-gradient(from 0deg, black 0deg 30deg, transparent 30deg 60deg)`,
                        WebkitMaskImage: `repeating-conic-gradient(from 0deg, black 0deg 30deg, transparent 30deg 60deg)`,
                        transform: `scale(${pulseScale}) rotate(${time * 20}deg)`,
                        opacity: 0.5 + beat * 0.5
                    }} />
                );

            case 'cyberpunk':
            default:
                // Grid moving forward with cyan/magenta highlights
                return (
                    <div style={{
                        width: '100%', height: '100%',
                        backgroundColor: '#0a0a1a',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Floor Grid */}
                        <div style={{
                            position: 'absolute', bottom: 0, width: '100%', height: '50%',
                            backgroundImage: `
                                linear-gradient(rgba(0, 255, 255, ${0.3 + beat*0.4}) 2px, transparent 2px),
                                linear-gradient(90deg, rgba(255, 0, 255, ${0.3 + beat*0.4}) 2px, transparent 2px)
                            `,
                            backgroundSize: '100px 100px',
                            backgroundPosition: `center ${scrollY * 2}px`,
                            transform: `perspective(500px) rotateX(60deg) scale(${pulseScale * 1.5})`,
                            transformOrigin: 'top center'
                        }} />
                        {/* Pulsing Core */}
                        <div style={{
                            position: 'absolute', top: '20%', left: '50%',
                            transform: `translate(-50%, -50%) scale(${pulseScale * 1.5})`,
                            width: 300, height: 300,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(0,255,255,${beat}), rgba(255,0,255,${beat*0.5}), transparent 70%)`,
                            filter: 'blur(20px)'
                        }} />
                    </div>
                );
        }
    };

    return (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
            {/* SVG Filters for specialized effects (like fire) */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="fractal-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" seed={frame % 100} />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" in="noise" result="coloredNoise" />
                    <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" />
                </filter>
            </svg>

            {renderVariant()}
        </AbsoluteFill>
    );
};
