import React from 'react';
import { AbsoluteFill } from 'remotion';

import { AudioReactiveBackground } from '../../SkillsShowcase/MusicVideo/AudioReactiveBackground';

// 5. KaleidoNova (Last Chorus: 145.7s - End)
// Multi-color, rainbow/prism effect.
export const KaleidoNova: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
    
    return (
         <AbsoluteFill style={{
            background: '#000',
            overflow: 'hidden'
         }}>
             <AudioReactiveBackground beat={beat} variant="kaleido" />
         </AbsoluteFill>
    )
}
