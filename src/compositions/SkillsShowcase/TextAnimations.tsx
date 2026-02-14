import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

const TypewriterText: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Typewriter speed: 2 frames per character
    const progress = Math.min(text.length, Math.floor(frame / 2));
    const textToShow = text.slice(0, progress);

    const cursorOpacity = Math.sin(frame * 0.5) > 0 ? 1 : 0;

    return (
        <div style={{ ...style, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {textToShow}
            <span style={{ opacity: cursorOpacity, color: '#00ff00' }}>|</span>
        </div>
    );
};

const HighlightText: React.FC<{ text: string; highlightColor: string; delay: number }> = ({ text, highlightColor, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const progress = spring({
        frame: frame - delay,
        fps,
        config: { damping: 200 },
    });

    const widthPercent = interpolate(progress, [0, 1], [0, 100]);

    return (
        <span style={{ position: 'relative', display: 'inline-block', marginRight: '0.2em' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: 0,
                height: '40%',
                backgroundColor: highlightColor,
                width: `${widthPercent}%`,
                zIndex: 0,
                opacity: 0.7,
            }} />
        </span>
    );
};


export const TextAnimations: React.FC = () => {
    return (
        <AbsoluteFill style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '50px',
            color: '#333',
        }}>
            <AbsoluteFill style={{ top: '20%', height: 'auto', textAlign: 'center', width: '100%' }}>
                <h1 style={{ fontSize: 60, marginBottom: 20 }}>Agent Skills: Text Animations</h1>
                
                {/* 1. Typewriter Effect */}
                <div style={{ fontSize: 40, background: '#111', color: '#fff', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
                    <TypewriterText text="Hello, I am using Remotion Skills!\nWriting code character by character..." />
                </div>
            </AbsoluteFill>

            <AbsoluteFill style={{ top: '60%', height: 'auto', textAlign: 'center', width: '100%' }}>
                 {/* 2. Word Highlight Effect */}
                 <div style={{ fontSize: 50, fontWeight: 'bold' }}>
                    <HighlightText text="Create" highlightColor="#ff00ff" delay={30} />
                    <HighlightText text="Amazing" highlightColor="#ffff00" delay={45} />
                    <HighlightText text="Videos" highlightColor="#00ffff" delay={60} />
                 </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
