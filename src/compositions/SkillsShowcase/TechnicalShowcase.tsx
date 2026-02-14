import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const TechnicalShowcase: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames, width, height } = useVideoConfig();
    const time = frame / fps;

    return (
        <AbsoluteFill style={{ backgroundColor: '#0f172a', color: '#38bdf8', fontFamily: 'monospace', padding: 60, fontSize: 40 }}>
             <div style={{
                position: 'absolute',
                top: 50,
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
                fontSize: 40,
                marginBottom: 50
            }}>
                Technical Skills: Metadata & Timing
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 100 }}>
                <div>Frame: <span style={{ color: 'white' }}>{frame}</span> / {durationInFrames}</div>
                <div>Time: <span style={{ color: 'white' }}>{time.toFixed(2)}s</span></div>
                <div>FPS: <span style={{ color: 'white' }}>{fps}</span></div>
                <div>Resolution: <span style={{ color: 'white' }}>{width}x{height}</span></div>
                
                <div style={{ marginTop: 40, fontSize: 30, color: '#94a3b8' }}>
                    Used for: Dynamic Layouts, Logic, Sequencing
                </div>
            </div>
        </AbsoluteFill>
    );
};
