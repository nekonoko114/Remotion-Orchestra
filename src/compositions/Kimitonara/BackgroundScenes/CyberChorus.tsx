import React from 'react';
import { AbsoluteFill } from 'remotion';

import { AudioReactiveBackground } from '../../SkillsShowcase/MusicVideo/AudioReactiveBackground';

// 2. Cyber Chorus (Chorus A: 52.7s - 79.6s)
// The existing upbeat cyber aesthetic.
export const CyberChorus: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
    
    return (
        <AbsoluteFill style={{
            background: 'radial-gradient(circle at 50% 30%, #2D144B 0%, #1A0B2E 70%, #0F051A 100%)',
            overflow: 'hidden',
        }}>
            <AudioReactiveBackground beat={beat} variant="cyberpunk" />
        </AbsoluteFill>
    );
};
