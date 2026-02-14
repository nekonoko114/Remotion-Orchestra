import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { QuietNight } from './BackgroundScenes/QuietNight';
import { TIMELINE } from './timeline';

// Scene definitions have been moved to ./BackgroundScenes/ directory


export const BackgroundScenes: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const time = frame / fps;

    // Determine current scene from TIMELINE
    const currentSection = TIMELINE.find(section => time >= section.start && time < section.end);
    const CurrentScene = currentSection ? currentSection.component : QuietNight;

    // Wrap in AbsoluteFill and Vignette
    return (
        <AbsoluteFill>
            <CurrentScene beat={beat} />
            
             {/* Global Vignette */}
             <AbsoluteFill style={{
                background: 'radial-gradient(circle at center, transparent 0%, transparent 60%, black 100%)',
                pointerEvents: 'none',
                zIndex: 2 // Above bg, below lyrics
            }} />
        </AbsoluteFill>
    );
};
