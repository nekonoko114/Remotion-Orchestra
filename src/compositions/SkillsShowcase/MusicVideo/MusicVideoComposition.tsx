import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio, interpolate, random } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { AudioReactiveBackground } from './AudioReactiveBackground';
import { Tunnel3D, TunnelVariant } from './Tunnel3D';
import { ParticleField } from './ParticleField';
import { LyricOverlay } from './LyricOverlay';

const AUDIO_SRC = staticFile('/assets/audio/music/風になる日.mp3');

export const MusicVideoComposition: React.FC<{ startFrom?: number }> = ({ startFrom = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const audioData = useAudioData(AUDIO_SRC);

    // Calculate offset based on startFrom prop
    const offsetFrames = Math.floor(startFrom * fps);
    const effectiveFrame = frame + offsetFrames;
    const seconds = effectiveFrame / fps;

    if (!audioData) {
        return null;
    }

    const visualization = visualizeAudio({
        fps,
        frame: effectiveFrame, // Use effective frame for visualization
        audioData,
        numberOfSamples: 16,
    });
    
    // Low Frequency (Kick/Bass)
    const lowFreqs = visualization.slice(0, 3);
    const bass = lowFreqs.reduce((a, b) => a + b, 0) / lowFreqs.length;
    
    // High Frequency (Hi-Hats)
    const highFreqs = visualization.slice(10, 14);
    const treble = highFreqs.reduce((a, b) => a + b, 0) / highFreqs.length;

    // Camera Shake / Chromatic Aberration based on Bass
    const shake = interpolate(bass, [0, 0.5], [0, 20], { extrapolateRight: 'clamp' });
    const rgbShift = interpolate(bass, [0.2, 1], [0, 10], { extrapolateRight: 'clamp' });
    
    const randomShakeX = (random(effectiveFrame) - 0.5) * shake;
    const randomShakeY = (random(effectiveFrame + 1) - 0.5) * shake;

    // Timeline / Song Structure Mapping (30fps assumed)
    // Intro (0-10s): Ethereal - Quiet start
    // A-Melo (10-35s): Wireframe - Building structure
    // B-Melo (35-48s): Warp - Speeding up towards chorus
    // Chorus (48s-75s): Split Fire - IMPACT
    // Bridge (75s-90s): Cyberpunk - Stylistic break
    // Outro (90s+): Ethereal - Fading out

    let currentVariant: TunnelVariant = 'ethereal';

    if (seconds < 10) {
        currentVariant = 'ethereal';
    } else if (seconds < 35) {
        currentVariant = 'wireframe';
    } else if (seconds < 48) {
        currentVariant = 'warp';
    } else if (seconds < 90) { // Extended Chorus to 90s
        currentVariant = 'split-fire'; 
    } else if (seconds < 105) {
        currentVariant = 'cyberpunk';
    } else if (seconds < 120) {
        currentVariant = 'lightning';
    } else {
        currentVariant = 'ethereal';
    }

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Audio src={AUDIO_SRC} startFrom={offsetFrames} />

            {/* Layer 1: Skia Background (Fluid/Shader) */}
            {/* Treble increases opacity/intensity */}
            <AbsoluteFill style={{ opacity: 0.6 + treble * 0.4 }}>
                 <AudioReactiveBackground beat={bass} variant={currentVariant} />
            </AbsoluteFill>

            {/* Layer 2: 3D Tunnel (Depth) */}
             <AbsoluteFill style={{ opacity: 0.8 }}>
                <Tunnel3D beat={bass} variant={currentVariant} />
            </AbsoluteFill>

            {/* Layer 3: Particles (Floating) */}
            <AbsoluteFill>
                <ParticleField beat={treble} />
            </AbsoluteFill>
            
            {/* Variant Label (For Showcase Demo) */}
            <AbsoluteFill style={{ 
                justifyContent: 'flex-start', 
                alignItems: 'flex-end', 
                padding: 40,
                pointerEvents: 'none'
            }}>
                <div style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'monospace',
                    fontSize: 24,
                    textTransform: 'uppercase',
                    letterSpacing: 4
                }}>
                    Tunnel: {currentVariant}
                </div>
            </AbsoluteFill>

            {/* Layer 4: Lyrics (Impact) */}
            <AbsoluteFill style={{ 
                transform: `translate(${randomShakeX}px, ${randomShakeY}px)`,
                textShadow: `${rgbShift}px 0 red, -${rgbShift}px 0 blue`
            }}>
                <LyricOverlay beat={bass} />
            </AbsoluteFill>

             {/* Layer 5: Post-Processing Overlay (Vignette & Grain Simulation) */}
             <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, transparent 40%, black 100%)',
                    opacity: 0.8
                }}/>
             </AbsoluteFill>
             
             {/* Flash on strong beats */}
             <AbsoluteFill style={{ 
                 backgroundColor: 'white', 
                 opacity: interpolate(bass, [0.8, 1], [0, 0.2], { extrapolateRight: 'clamp' }),
                 mixBlendMode: 'overlay' 
             }} />
        </AbsoluteFill>
    );
};
