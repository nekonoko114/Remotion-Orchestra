import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Img } from 'remotion';

interface EndCreditSlideProps {
    images: string[];
}

export const EndCreditSlide: React.FC<EndCreditSlideProps> = ({ images }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Split images into two rows
    const half = Math.ceil(images.length / 2);
    const topRow = images.slice(0, half);
    const bottomRow = images.slice(half);

    // Triple the images to ensure continuous loop
    const extendedTop = [...topRow, ...topRow, ...topRow];
    const extendedBottom = [...bottomRow, ...bottomRow, ...bottomRow];

    const imageWidth = 700; // Increased size for better visibility
    const imageGap = 20;
    const totalRowWidthTop = topRow.length * (imageWidth + imageGap);
    const totalRowWidthBottom = bottomRow.length * (imageWidth + imageGap);

    // Animation: Move from right to left
    const scrollTop = interpolate(
        frame,
        [0, durationInFrames],
        [0, -totalRowWidthTop],
        { extrapolateRight: 'extend' }
    );

    // Bottom row moves from Left to Right
    // Start offset at -totalRowWidthBottom (shifted left) and move to 0
    const scrollBottom = interpolate(
        frame,
        [0, durationInFrames],
        [-totalRowWidthBottom, 0], 
        { extrapolateRight: 'extend' }
    );

    return (
        <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'transparent' }}>
            {/* Top Row */}
            <div style={{
                display: 'flex',
                position: 'absolute',
                top: '8%', // Moved up slightly
                transform: `translateX(${scrollTop}px)`,
                whiteSpace: 'nowrap',
            }}>
                {extendedTop.map((src, i) => (
                    <div key={`top-${i}`} style={{
                        width: imageWidth,
                        height: imageWidth * 0.6,
                        marginRight: imageGap,
                        borderRadius: 15,
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                        <Img 
                            src={src} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
                        />
                    </div>
                ))}
            </div>

            {/* Bottom Row */}
            <div style={{
                display: 'flex',
                position: 'absolute',
                top: '55%',
                transform: `translateX(${scrollBottom}px)`,
                whiteSpace: 'nowrap',
            }}>
                {extendedBottom.map((src, i) => (
                    <div key={`bottom-${i}`} style={{
                        width: imageWidth,
                        height: imageWidth * 0.6,
                        marginRight: imageGap,
                        borderRadius: 15,
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        border: '2px solid rgba(255,255,255,0.2)'
                    }}>
                        <Img 
                            src={src} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
                        />
                    </div>
                ))}
            </div>
            
            {/* Dark overlay for depth */}
            <AbsoluteFill style={{
                background: 'linear-gradient(to right, rgba(5,5,5,1) 0%, rgba(5,5,5,0) 20%, rgba(5,5,5,0) 80%, rgba(5,5,5,1) 100%)'
            }} />
        </AbsoluteFill>
    );
};
