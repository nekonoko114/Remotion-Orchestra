import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { gsap } from 'gsap';

// --- Utility for safe GSAP ease ---
const getEase = (name: string) => gsap.parseEase(name) || ((v: number) => v);

const TYPO_STYLE: React.CSSProperties = {
    color: '#fff',
    fontSize: 40,
    fontWeight: 900,
    fontFamily: 'Mochiy Pop One, sans-serif',
    textAlign: 'center',
    textShadow: '0 0 10px rgba(255,255,255,0.5)',
};

// --- Pattern 1: Staggered Reveal ---
const StaggeredReveal: React.FC = () => {
    const frame = useCurrentFrame();
    const text = "DYNAMIC";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ display: 'flex' }}>
                {text.split('').map((char, i) => {
                    const t = Math.max(0, Math.min(1, (frame - i * 3) / 30));
                    const v = getEase("back.out(2)")(t);
                    return (
                        <span key={i} style={{ ...TYPO_STYLE, transform: `translateY(${(1-v) * 50}px) scale(${v})`, opacity: v }}>
                            {char}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// --- Pattern 2: Infinite Vertical Scroll ---
const InfiniteScroll: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const y = -t * 100;
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, overflow: 'hidden' }}>
            <div style={{ transform: `translateY(${y}px)` }}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ ...TYPO_STYLE, fontSize: 30, lineHeight: '100px' }}>KINETIC</div>
                ))}
            </div>
        </div>
    );
};

// --- Pattern 3: Circular Orbit ---
const CircularOrbit: React.FC = () => {
    const frame = useCurrentFrame();
    const text = "ROTATION";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {text.split('').map((char, i) => {
                const angle = (i / text.length) * Math.PI * 2 + frame * 0.05;
                const r = 35;
                return (
                    <span key={i} style={{ 
                        ...TYPO_STYLE, fontSize: 18, position: 'absolute',
                        left: `calc(50% + ${Math.cos(angle) * r}px)`,
                        top: `calc(50% + ${Math.sin(angle) * r}px)`,
                        transform: `translate(-50%, -50%) rotate(${angle + Math.PI/2}rad)`
                    }}>
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

// --- Pattern 4: Elastic Grid (Words) ---
const ElasticScalingGrid: React.FC = () => {
    const frame = useCurrentFrame();
    const words = ["FAST", "COOL", "SHARP", "BOLD"];
    return (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            {words.map((word, i) => {
                const t = Math.max(0, Math.min(1, ((frame + i * 10) % 90) / 45));
                const v = getEase("elastic.out(1, 0.5)")(t < 1 ? t : 2 - t);
                return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ ...TYPO_STYLE, fontSize: 20, transform: `scale(${v})`, color: i % 2 ? '#00ffff' : '#ff00ff' }}>{word}</span>
                    </div>
                );
            })}
        </div>
    );
};

// --- Pattern 5: Wave Motion Text ---
const WaveMotion: React.FC = () => {
    const frame = useCurrentFrame();
    const text = "WAVE-MOTION";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ display: 'flex' }}>
                {text.split('').map((char, i) => {
                    const y = Math.sin(frame * 0.2 + i * 0.5) * 15;
                    return (
                        <span key={i} style={{ ...TYPO_STYLE, fontSize: 18, transform: `translateY(${y}px)` }}>
                            {char}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// --- Pattern 6: Glitch Typography ---
const GlitchTypo: React.FC = () => {
    const frame = useCurrentFrame();
    const isGlitch = frame % 15 < 3;
    const x = isGlitch ? (Math.random() - 0.5) * 20 : 0;
    const y = isGlitch ? (Math.random() - 0.5) * 10 : 0;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                ...TYPO_STYLE, fontSize: 35, 
                transform: `translate(${x}px, ${y}px)`,
                textShadow: isGlitch ? '2px 0 #ff00ff, -2px 0 #00ffff' : '0 0 10px rgba(255,255,255,0.5)'
            }}>
                GLITCH
            </div>
        </div>
    );
};

// --- Pattern 7: Explosion Build ---
const ExplosionBuild: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const text = "ASSEMBLE";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {text.split('').map((char, i) => {
                const ease = getEase("power4.out");
                const v = ease(t);
                const angle = (i / text.length) * Math.PI * 2;
                const dist = (1 - v) * 100;
                return (
                    <span key={i} style={{ 
                        ...TYPO_STYLE, fontSize: 18, position: 'relative',
                        transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(${v})`,
                        opacity: v
                    }}>
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

// --- Pattern 8: Skewed Slide ---
const SkewedSlide: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const ease = getEase("power2.inOut");
    const v = ease(t);
    const x = -100 + v * 200;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, overflow: 'hidden' }}>
            <div style={{ 
                ...TYPO_STYLE, transform: `translateX(${x}%) skewX(${(0.5 - v) * 60}deg)`,
                whiteSpace: 'nowrap'
            }}>
                SKEWED SLIDE
            </div>
        </div>
    );
};

// --- Pattern 9: Zoom Pulse ---
const ZoomPulse: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const ease = getEase("expo.out");
    const v = ease(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                ...TYPO_STYLE, fontSize: 30 + v * 40, 
                opacity: 1 - v,
                filter: `blur(${v * 10}px)`
            }}>
                ZOOM
            </div>
            <div style={{ ...TYPO_STYLE, position: 'absolute' }}>ZOOM</div>
        </div>
    );
};

// --- Pattern 10: Typography Wall ---
const TypoWall: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, backgroundColor: '#111', borderRadius: 20, margin: 5, overflow: 'hidden', position: 'relative' }}>
            {[...Array(6)].map((_, i) => (
                <div key={i} style={{ 
                    ...TYPO_STYLE, fontSize: 12, opacity: 0.2, whiteSpace: 'nowrap',
                    transform: `translateX(${(i % 2 ? frame : -frame) % 100}px)` 
                }}>
                    REMOTION GSAP KINETIC TYPOGRAPHY PATTERN CATALOG 
                </div>
            ))}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...TYPO_STYLE, fontSize: 35, background: 'rgba(0,0,0,0.5)', padding: '0 10px', borderRadius: 5 }}>WALL</div>
            </div>
        </div>
    );
};

// --- Pattern 11: Gradient Mask (Simulated with text clipping) ---
const GradientMask: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                ...TYPO_STYLE, fontSize: 45,
                background: `linear-gradient(${frame * 5}deg, #ff00ff, #00ffff, #ff00ff)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                backgroundPosition: `${frame % 200}% 50%`
            }}>
                MASK
            </div>
        </div>
    );
};

// --- Pattern 12: Strobe Flash ---
const StrobeFlash: React.FC = () => {
    const frame = useCurrentFrame();
    const active = Math.floor(frame / 2) % 2 === 0;
    const color = active ? '#fff' : '#333';
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: active ? '#441111' : '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, color, fontSize: 40, letterSpacing: 5 }}>STROBE</div>
        </div>
    );
};

// --- Pattern 13: 3D Perspective Flip ---
const PerspectiveFlip: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const ease = getEase("power4.inOut");
    const v = ease(t);
    const rotX = v * 360;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, perspective: 800 }}>
            <div style={{ 
                ...TYPO_STYLE, 
                transform: `rotateX(${rotX}deg) rotateY(${Math.sin(frame * 0.1) * 20}deg)`,
                width: 150, padding: 10, border: '2px solid #fff', borderRadius: 10
            }}>
                3D FLIP
            </div>
        </div>
    );
};

// --- Pattern 14: Focus Blur ---
const FocusBlur: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const v = Math.abs(Math.sin(t * Math.PI));
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                ...TYPO_STYLE, 
                filter: `blur(${v * 15}px)`,
                scale: 1 + v * 0.5,
                opacity: 1 - v * 0.5
            }}>
                FOCUS
            </div>
        </div>
    );
};

// --- Pattern 15: Magnetic Float ---
const MagneticFloat: React.FC = () => {
    const frame = useCurrentFrame();
    const targetX = Math.sin(frame * 0.05) * 40;
    const targetY = Math.cos(frame * 0.03) * 30;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            <div style={{ position: 'absolute', width: 4, height: 4, backgroundColor: '#555', transform: `translate(${targetX}px, ${targetY}px)` }} />
            <div style={{ 
                ...TYPO_STYLE, fontSize: 25,
                transform: `translate(${targetX * 0.7}px, ${targetY * 0.7}px)`,
                transition: 'transform 0.1s ease-out'
            }}>
                MAGNETIC
            </div>
        </div>
    );
};

export const KineticTypographyCatalog: React.FC = () => {
    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#000', padding: 20, 
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', 
            gap: 10 
        }}>
            <StaggeredReveal />
            <InfiniteScroll />
            <CircularOrbit />
            <ElasticScalingGrid />
            <WaveMotion />
            <GlitchTypo />
            <ExplosionBuild />
            <SkewedSlide />
            <ZoomPulse />
            <TypoWall />
            <GradientMask />
            <StrobeFlash />
            <PerspectiveFlip />
            <FocusBlur />
            <MagneticFloat />
        </AbsoluteFill>
    );
};
