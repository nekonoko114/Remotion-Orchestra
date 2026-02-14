import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, staticFile } from 'remotion';
import { TIMELINE } from './timeline';

// Default character if not specified in timeline
const DEFAULT_CHARACTER = staticFile('assets/characters/nova-chracter-02.png');

export const CharacterScenes: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const time = frame / fps;

    // Find current scene
    const activeSection = TIMELINE.find(s => time >= s.start && time < s.end);

    // Default to handling if no specific section is found (e.g., gap filling) 
    // or if the section implies character presence.
    // For now, let's assume always visible unless explicitly hidden or 'none'.
    
    const image = activeSection?.characterImage || DEFAULT_CHARACTER;
    const layout = activeSection?.characterLayout || 'center';
    
    // Simple entry animation per section
    // If it's the very start of a section, fade in?
    const sectionStart = activeSection?.start || 0;
    const timeInSection = time - sectionStart;
    
    // Fade in at start of section
    const opacity = interpolate(timeInSection, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

    // Layout styles
    const layoutStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '80%',
        width: 'auto',
        objectFit: 'contain',
    };

    if (layout === 'center') {
        layoutStyle.left = '50%';
        layoutStyle.transform = 'translate(-50%, -50%)';
    } else if (layout === 'left') {
        layoutStyle.left = '10%';
        layoutStyle.transform = 'translate(0, -50%)';
    } else if (layout === 'right') {
        layoutStyle.right = '10%';
        layoutStyle.transform = 'translate(0, -50%)';
    } else if (layout === 'hidden') {
        return null;
    }

    return (
        <AbsoluteFill style={{ zIndex: 10 }}>
            <img 
                src={image} 
                style={{ ...layoutStyle, opacity }}
                alt="Character"
            />
        </AbsoluteFill>
    );
};

// Utility to get current layout for other components (e.g. lyrics)
export const getSceneLayout = (time: number) => {
    const section = TIMELINE.find(s => time >= s.start && time < s.end);
    return section?.characterLayout || 'center';
};
