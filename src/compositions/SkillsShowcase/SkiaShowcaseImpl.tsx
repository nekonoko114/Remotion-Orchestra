import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const SkiaShowcaseImpl: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height, durationInFrames } = useVideoConfig();

    const rotation = (frame / durationInFrames) * 360;

    return (
        <div style={{
            width,
            height,
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* The rotating gradient ring */}
            <div style={{
                position: 'absolute',
                width: 600, // 300 radius * 2
                height: 600,
                borderRadius: '50%',
                background: 'conic-gradient(cyan, magenta, yellow, cyan)',
                transform: `rotate(${rotation}deg)`,
                willChange: 'transform'
            }} />
            
            {/* The inner black circle to create the ring effect */}
            <div style={{
                position: 'absolute',
                width: 400, // 200 radius * 2
                height: 400,
                borderRadius: '50%',
                backgroundColor: 'black'
            }} />
        </div>
    );
};
