import React from 'react';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { useVideoConfig, useCurrentFrame, staticFile, Audio, AbsoluteFill } from 'remotion';

const MUSIC_SOURCE = staticFile('assets/audio/music/君となら.mp3');

export const AudioVisualizerShowcase: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const audioData = useAudioData(MUSIC_SOURCE);

    if (!audioData) {
        return null;
    }

    const visualization = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: 16,
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
            <Audio src={MUSIC_SOURCE} />
             <div style={{
                position: 'absolute',
                top: 50,
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
                fontSize: 40,
            }}>
                Audio Skill: @remotion/media-utils
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '200px' }}>
                {visualization.map((v, i) => (
                    <div
                        key={i}
                        style={{
                            width: 30,
                            height: `${300 * v}px`,
                            backgroundColor: `hsl(${i * 20}, 100%, 50%)`,
                            borderRadius: '4px 4px 0 0',
                        }}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};
