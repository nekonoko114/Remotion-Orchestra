import React, { useEffect, useRef, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import gsap from 'gsap';

export const ThreeColorStripes: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    
    // We need 3 elements to animate
    const stripe1Ref = useRef<HTMLDivElement>(null);
    const stripe2Ref = useRef<HTMLDivElement>(null);
    const stripe3Ref = useRef<HTMLDivElement>(null);
    
    // Timeline reference to control seek
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        // Create GSAP Timeline
        // Loop: true? User said "Animation time 4 seconds". 
        // Likely wants a repeating background or a cool cyclic effect.
        // We will make it a 4-second loop for now.
        
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true, repeat: -1 }); // Infinite repeat
            
            // Animation Design:
            // 3 Stripes (Cyan, Magenta, DeepPurple) sliding/expanding diagonally
            
            // Initial State: All off-screen or small width
            tl.set([stripe1Ref.current, stripe2Ref.current, stripe3Ref.current], {
                xPercent: -100,
                opacity: 0.8,
                skewX: -20
            });

            // Sequence
            tl.to(stripe1Ref.current, {
                xPercent: 100, // Move across
                duration: 4,
                ease: "power2.inOut"
            }, 0);
            
            tl.to(stripe2Ref.current, {
                xPercent: 100,
                duration: 4,
                ease: "power2.inOut"
            }, 0.2); // Slight delay for overlap
            
            tl.to(stripe3Ref.current, {
                xPercent: 100,
                duration: 4,
                ease: "power2.inOut"
            }, 0.4);

            tlRef.current = tl;
        });

        return () => ctx.revert();
    }, []);

    // Sync GSAP with Remotion Frame
    useEffect(() => {
        if (tlRef.current) {
            // Remotion time in seconds
            const time = frame / fps;
            // Seek the timeline. 
            // Since it repeats, simple numeric seek works.
            tlRef.current.seek(time, false);
        }
    }, [frame, fps]);

    return (
        <AbsoluteFill style={{ overflow: 'hidden', zIndex: 0 }}>
             {/* Stripe 1: Cyan/Blue */}
             <div ref={stripe1Ref} style={{
                 position: 'absolute',
                 top: 0, left: 0,
                 width: '100%', height: '100%',
                 background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(0, 100, 255, 0.4) 100%)',
                 mixBlendMode: 'screen',
             }} />
             
             {/* Stripe 2: Magenta/Purple */}
             <div ref={stripe2Ref} style={{
                 position: 'absolute',
                 top: 0, left: 0,
                 width: '100%', height: '100%',
                 background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(100, 0, 255, 0.4) 100%)',
                 mixBlendMode: 'screen',
             }} />
             
             {/* Stripe 3: Dark/Black overlay for contrast? Or another color? 
                 User asked for "Colors divided into 3". Let's do 3 distinct bands.
                 Actually, full screen gradients sliding over each other is cool.
                 Let's try 3rds of the screen moving?
                 User said "Stripe where colors are 3 divided". 
                 Maybe a static background of 3 colors that modulates? 
                 OR 3 moving stripes.
                 Let's stick to the sliding stripes for dynamic BG.
             */}
              <div ref={stripe3Ref} style={{
                 position: 'absolute',
                 top: 0, left: 0,
                 width: '100%', height: '100%',
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(200, 200, 255, 0.3) 100%)',
                 mixBlendMode: 'overlay',
             }} />
        </AbsoluteFill>
    );
};
