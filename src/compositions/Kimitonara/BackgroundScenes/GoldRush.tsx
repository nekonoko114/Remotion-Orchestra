import React from 'react';
import { AbsoluteFill } from 'remotion';

import { AudioReactiveBackground } from '../../SkillsShowcase/MusicVideo/AudioReactiveBackground';

// 4. Gold Rush (Chorus B: 105.1s - 145.7s)
// Warm, Golden, Energetic.
export const GoldRush: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
    
    return (
        <AbsoluteFill style={{
             background: 'linear-gradient(135deg, #1a0b00 0%, #3e1e00 100%)', // Dark Brown/Gold base
             overflow: 'hidden'
        }}>
            <AudioReactiveBackground beat={beat} variant="gold" />
        </AbsoluteFill>
    )
}
