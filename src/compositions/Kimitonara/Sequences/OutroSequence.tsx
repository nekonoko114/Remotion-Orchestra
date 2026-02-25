import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Sequence 5: Outro (1:45 - End)
// Theme: Light vortex, Title Logo
export const OutroSequence: React.FC<{ beat?: number }> = ({ beat = 0 }) => {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 30], [0, 1]);
    const logoScale = interpolate(frame, [30, 90], [0.8, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#000000' }}>
             {/* Vortex / Light effect could be added here */}
             <AbsoluteFill style={{ 
                 display: 'flex', 
                 justifyContent: 'center', 
                 alignItems: 'center',
                 opacity 
             }}>
                 <div style={{ 
                     color: 'white', 
                     fontSize: '80px', 
                     fontWeight: 'bold',
                     transform: `scale(${logoScale})`,
                     textShadow: '0 0 20px rgba(255,255,255,0.5)'
                 }}>
                     KALEIDANOVA
                 </div>
             </AbsoluteFill>
        </AbsoluteFill>
    );
};
