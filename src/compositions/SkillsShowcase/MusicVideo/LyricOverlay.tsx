import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';

const wordList = [
    { text: "RHYTHM", start: 0, end: 40 },
    { text: "SOUL", start: 40, end: 80 },
    { text: "LIGHT", start: 80, end: 120 },
    { text: "FUTURE", start: 120, end: 160 },
    { text: "KALEIDANOVA", start: 160, end: 220 },
    // Loop or extend as needed
];

export const LyricOverlay: React.FC<{ beat: number }> = ({ beat }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            {wordList.map((word, index) => {
                 // Loop the lyrics logic for demo purposes based on frame
                 const loopDuration = 220;
                 const currentLoopFrame = frame % loopDuration;
                 
                 if (currentLoopFrame < word.start || currentLoopFrame >= word.end) return null;

                 const duration = word.end - word.start;
                 const relativeFrame = currentLoopFrame - word.start;
                 
                 // Spring animation for entry (Bounce)
                 const scale = spring({
                     frame: relativeFrame,
                     fps,
                     config: { damping: 10, stiffness: 100 }
                 });

                 // Beat impact
                 const beatScale = interpolate(beat, [0, 1], [1, 1.2]);
                 
                 // Random position jitter per word (Chaos)
                 const seed = index * 123;
                 // Randomize position based on seed but keep it readable
                 const randomX = interpolate(seed % 10, [0, 9], [-width * 0.1, width * 0.1]);
                 const randomY = interpolate((seed * 2) % 10, [0, 9], [-height * 0.05, height * 0.05]);

                 // Fly in effect
                 const flyIn = interpolate(relativeFrame, [0, 10], [100, 0], { 
                     easing: Easing.out(Easing.exp),
                     extrapolateRight: 'clamp'
                 });

                return (
                    <div
                        key={index}
                        style={{
                            fontFamily: 'Impact, sans-serif',
                            fontSize: 150,
                            color: 'white',
                            textShadow: '0 0 30px cyan, 4px 4px 0px #ff00ff',
                            // Combine transforms: Scale (spring + beat), Rotate, Translate (Jitter + FlyIn)
                            transform: `
                                translate(${randomX}px, ${randomY + flyIn}px) 
                                scale(${scale * beatScale}) 
                                rotate(${(scale - 1) * 10}deg)
                            `,
                            letterSpacing: '10px',
                            textAlign: 'center',
                            opacity: interpolate(relativeFrame, [duration - 10, duration], [1, 0]),
                        }}
                    >
                        {word.text}
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
