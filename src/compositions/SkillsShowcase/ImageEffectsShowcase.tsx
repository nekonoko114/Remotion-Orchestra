import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export const ImageEffectsShowcase: React.FC = () => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    
    // Ken Burns Effect
    const scale = interpolate(frame, [0, durationInFrames], [1.1, 1.3]);
    const translateX = interpolate(frame, [0, durationInFrames], [0, -50]);
    const translateY = interpolate(frame, [0, durationInFrames], [0, -20]);

    return (
        <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'black' }}>
             <div style={{
                position: 'absolute',
                top: 50,
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
                fontSize: 40,
                zIndex: 10,
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}>
                Image Skill: Ken Burns Effect
            </div>
            <AbsoluteFill style={{
                transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            }}>
                <Img 
                    src={staticFile('assets/characters/nova-chracter-02.png')} 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
