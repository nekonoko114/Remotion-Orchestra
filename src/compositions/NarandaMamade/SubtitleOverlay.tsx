import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill, Sequence, spring, useVideoConfig } from 'remotion';
import { LYRICS } from './lyrics';



const SoftBlurChar: React.FC<{ 
    char: string; 
    delay: number;
    isMegaPop?: boolean;
    offsetY?: number;
    offsetX?: number;
}> = ({ char, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- SOFT BLUR RISE ANIMATION ---
    const t = frame - delay;
    
    // 1. Opacity Fade
    const opacity = interpolate(t, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    
    // 2. Blur Dissolve (Reduced from 8px to 4px for better visibility)
    const blur = interpolate(t, [0, 10], [4, 0], { extrapolateRight: 'clamp' });
    
    // 3. Gentle Float Up (Offset 10px -> 0px)
    // Using a soft spring for the landing
    const moveSpr = spring({
        frame: t,
        fps,
        config: { damping: 100, stiffness: 20, mass: 2 }, // Very slow, gentle settling
    });
    const translateY = interpolate(moveSpr, [0, 1], [10, 0]);

    // 4. Subtle Shimmer (Anime Glow)
    const shimmer = Math.sin(t * 0.05) * 0.15 + 0.85; // Oscillates between 0.7 and 1.0

    return (
        <span style={{
            display: 'inline-block',
            transform: `translateY(${translateY}px)`,
            opacity: opacity,
            filter: `blur(${blur}px) drop-shadow(0 0 8px rgba(155, 93, 229, ${0.4 * shimmer}))`,
            willChange: 'transform, opacity, filter',
            // Specific kerning for vertical writing visual balance
            margin: '2px 0', 
            // Add a subtle white aura for readability against dark bgs
            textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
        }}>
            {char === ' ' ? '\u00A0' : char}
        </span>
    );
};

const CinematicChar: React.FC<{ 
    char: string; 
    delay: number;
    isMegaPop?: boolean;
    offsetY?: number;
    offsetX?: number;
}> = ({ char, delay }) => {
    const frame = useCurrentFrame();
    
    // Slow Fade In
    const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    
    // Tracking (Letter Spacing) Expansion Simulation (via margin)
    // Actually, spacing is better handled at container, but we can do subtle scale/blur
    const blur = interpolate(frame - delay, [0, 20], [5, 0], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame - delay, [0, 60], [1.1, 1], { extrapolateRight: 'clamp' });

    return (
        <span style={{
            display: 'inline-block',
            opacity,
            transform: `scale(${scale})`,
            filter: `blur(${blur}px) drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))`,
            willChange: 'opacity, filter, transform',
            margin: '0 4px', // Wider spacing
        }}>
            {char === ' ' ? '\u00A0' : char}
        </span>
    );
};

const PopChar: React.FC<{ 
    char: string; 
    delay: number;
    isMegaPop?: boolean;
    offsetY?: number;
    offsetX?: number; // Add random horizontal scatter
    color?: string; // Fixed color (purple or white)
}> = ({ char, delay, isMegaPop = false, offsetY = 0, offsetX = 0, color = 'purple' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // Use the delay as-is (calculated in ImpactLyric to fill duration)
    const t = frame - delay;
    
    const spr = spring({
        frame: t,
        fps,
        config: { 
            damping: isMegaPop ? 15 : 12, 
            stiffness: isMegaPop ? 300 : 200, 
            mass: 0.5 
        }, // Snappy bounce
    });
    
    // Pop Effects with 3D Rotation & RGB Glitch
    
    // 1. Initial Scale Bounce (バウンス入場)
    const initialScale = isMegaPop ? 20 : 3; 
    const scale = interpolate(spr, [0, 1], [initialScale, 1]); 
    
    // 2. 3D Rotation (3D回転)
    // Rotate from 90deg (sideways) to 0deg (facing forward)
    const rotateY = interpolate(spr, [0, 1], [90, 0]);
    
    // 3. RGB Chromatic Aberration (RGB分離グリッチ)
    // Strongest during entrance, fades out
    const glitchIntensity = interpolate(spr, [0, 0.5, 1], [8, 4, 0]);
    
    // 4. Opacity
    const flickerOpacity = 1;

    // 5. Fixed Color with Contrast Outline (紫 or 白 + コントラストアウトライン)
    const colorMap: Record<string, string> = {
        'purple': '#9b5de5',
        'white': '#FFFFFF',
    };
    const currentColor = colorMap[color] || colorMap['purple'];
    
    // Contrast outline: white text → purple outline, purple text → white outline
    const outlineColor = color === 'white' ? '#9b5de5' : '#FFFFFF';

    // 6. Continuous Growth (継続的成長) - After bounce, slowly grow
    const growthProgress = Math.max(0, (t / fps) - 0.5); 
    const growthScale = interpolate(growthProgress, [0, 5], [1, 1.2], { extrapolateRight: 'clamp' });
    const finalScale = scale * growthScale;

    // 7. Pulsing Glow (鼓動するグロー)
    const glowPulse = Math.sin(t * 0.2) * 4 + 6; // 2-10px pulse
    const combinedFilter = `
        drop-shadow(0 0 ${glowPulse}px ${currentColor})
        drop-shadow(0 0 ${glowPulse / 2}px white)
        drop-shadow(0 0 2px rgba(0,0,0,0.4))
    `;
    
    // RGB separation using text-shadow
    const rgbGlitch = glitchIntensity > 0 
        ? `${glitchIntensity}px 0 0 rgba(255,0,0,0.7), -${glitchIntensity}px 0 0 rgba(0,255,255,0.7)`
        : 'none';

    return (
        <span style={{
            display: 'inline-block',
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${finalScale}) rotateY(${rotateY}deg) rotateZ(-5deg)`,
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            opacity: t >= 0 ? flickerOpacity : 0,
            filter: combinedFilter,
            textShadow: rgbGlitch,
            color: currentColor,
            WebkitTextStroke: `3px ${outlineColor}`,
            paintOrder: 'stroke fill',
            willChange: 'transform, opacity',
            margin: '0 1px',
            fontWeight: 900,
        }}>
            {char === ' ' ? '\u00A0' : char}
        </span>
    );
};

const ImpactLyric: React.FC<{ 
    text: string; 
    duration: number; 
    index: number;
    style?: 'emotional' | 'cinematic' | 'pop';
    color?: string; // Color for Pop style
}> = ({ text, duration, index, style = 'emotional', color = 'purple' }) => {
    const frame = useCurrentFrame();
    
    // Total Fade
    const containerOpacity = interpolate(
        frame,
        [0, 10, duration - 10, duration],
        [0, 1, 1, 0]
    );

    // --- Dynamic Layout Configuration ---
    let writingMode: 'vertical-lr' | 'horizontal-tb' = 'vertical-lr';
    let containerStyle: React.CSSProperties = {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: '300px',
        paddingTop: '150px',
    };
    let fontSize = 60;
    let CharComponent = SoftBlurChar;
    let charDelayMultiplier = 5;

    if (style === 'pop') {
        writingMode = 'horizontal-tb';
        containerStyle = {
            justifyContent: 'flex-end',
            alignItems: 'flex-end', // Bottom of screen
            paddingLeft: '0',
            paddingBottom: '50px', // Closer to bottom (Matched with Cinematic)
            width: '100%',
        };

        fontSize = 150; // HUGE for Pop (Chorus) - Increased for better visibility
        CharComponent = PopChar;
        // Dynamic delay calculation to fill the entire duration
        // We want the last character to finish its entrance roughly when the lyric ends.
        // Duration is in frames.
        // Let's say we reserve last 15 frames for the animation to fully settle.
        // Delay per char = (Duration - 15) / (LineLength)
        // Ensure minimum delay so it doesn't happen INSTANTLY if duration is short.
        const safeDuration = Math.max(duration - 20, 10);
        const charCount = text.replace(/\s/g, '').length || 1; // Count non-space chars
        charDelayMultiplier = safeDuration / charCount; 
    } else if (style === 'cinematic') {
        writingMode = 'horizontal-tb';
        containerStyle = {
            justifyContent: 'flex-end',
            alignItems: 'flex-end', // Bottom area
            paddingLeft: '0',
            paddingBottom: '50px', // Closer to bottom
            width: '100%',
        };
        fontSize = 100; // Large cinematic font for impactful outro
        CharComponent = CinematicChar;
        charDelayMultiplier = 8; // Slow cinematic
    }

    const segments = text.split(' ');

    return (
        <AbsoluteFill style={{ 
            display: 'flex', 
            pointerEvents: 'none',
            zIndex: 100,
            ...containerStyle
        }}>
            <div style={{
                opacity: containerOpacity,
                width: style === 'emotional' ? 'auto' : '100%', 
                height: style === 'emotional' ? '70%' : 'auto',
                writingMode,
                textAlign: style === 'emotional' ? 'start' : 'center',
                whiteSpace: 'nowrap',
                display: 'flex',
                flexDirection: style === 'emotional' ? 'column' : 'row',
                justifyContent: 'center', // Always center content horizontally
            }}>
                <h2
                    style={{
                        fontFamily: '"Mochiy Pop One", sans-serif',
                        fontSize: `${fontSize}px`,
                        margin: 0,
                        fontWeight: 900,
                        letterSpacing: style === 'cinematic' ? '0.3em' : '0.1em', 
                        lineHeight: 1.4,
                        color: 'white',
                        filter: style === 'pop' 
                            ? 'drop-shadow(2px 2px 0px #9b5de5)' // Sharp pop shadow
                            : 'drop-shadow(0 0 2px #9b5de5) drop-shadow(0 0 8px #9b5de5)', // Glow for others
                    }}
                >
                    {segments.map((segment, sIdx) => {
                         // For horizontal layouts, we need to handle segments differently ideally, 
                         // but for now simple mapping works.
                         // Add space between segments for horizontal
                         const segmentMargin = style === 'emotional' ? '0 10px' : '0 20px';
                         return (
                            <span key={sIdx} style={{ display: 'inline-block', margin: segmentMargin }}>
                                {segment.split('').map((c, i) => {
                                    const charIndex = text.indexOf(segment) + i;
                                    // Calculate delay based on index across the whole string to ensure linear progression
                                    // We need actual index in the full text without spaces for accurate timing distribution if we want it perfect,
                                    // but using global index is fine.
                                    // Correct global index calculation:
                                    let globalCharIndex = 0;
                                    for(let k=0; k<sIdx; k++) globalCharIndex += segments[k].length;
                                    globalCharIndex += i;
                                    
                                    // Center all text (no scatter/offset)
                                    const scatterX = 0;
                                    const scatterY = 0;

                                    return style === 'pop' ? (
                                        <PopChar 
                                            key={`${sIdx}-${i}`} 
                                            char={c} 
                                            delay={globalCharIndex * charDelayMultiplier}
                                            isMegaPop={((charIndex * 7 + sIdx * 3) % 4 === 0) && c !== ' '}
                                            offsetY={scatterY} 
                                            offsetX={scatterX}
                                            color={color}
                                        />
                                    ) : (
                                        <CharComponent 
                                            key={`${sIdx}-${i}`} 
                                            char={c} 
                                            delay={globalCharIndex * charDelayMultiplier}
                                            isMegaPop={false}
                                            offsetY={scatterY} 
                                            offsetX={scatterX}
                                        />
                                    );
                                })}
                            </span>
                        );
                    })}
                </h2>
            </div>
        </AbsoluteFill>
    );
};

export const SubtitleOverlay: React.FC = () => {
	return (
		<AbsoluteFill style={{ zIndex: 100 }}>
            {LYRICS.map((lyric, index) => {
                const duration = lyric.endFrame - lyric.startFrame;
                if (duration <= 0) return null;
                return (
                    <Sequence 
                        key={index} 
                        from={lyric.startFrame} 
                        durationInFrames={duration}
                        name={`Lyric: ${lyric.text}`}
                    >
                        <ImpactLyric 
                            text={lyric.text} 
                            duration={duration} 
                            index={index} 
                            style={lyric.style}
                            color={lyric.color}
                        />
                    </Sequence>
                );
            })}
		</AbsoluteFill>
	);
};
