import React, { useMemo } from 'react';
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

// --- Pattern 16: Text Shuffle (Simulated) ---
const TextShuffle: React.FC = () => {
    const frame = useCurrentFrame();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const text = useMemo(() => {
        if (frame % 5 === 0) return Array(7).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
        return "SHUFFLE";
    }, [frame]);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, fontSize: 25, fontFamily: 'monospace' }}>{text}</div>
        </div>
    );
};

// --- Pattern 17: Gravity Fall (GSAP Bounce) ---
const GravityFall: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const ease = getEase("bounce.out");
    const v = ease(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, overflow: 'hidden' }}>
            <div style={{ ...TYPO_STYLE, transform: `translateY(${-100 + v * 100}px)` }}>FALL</div>
        </div>
    );
};

// --- Pattern 18: Blur Reveal (GSAP Power) ---
const BlurReveal: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const ease = getEase("power2.out");
    const v = ease(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, filter: `blur(${(1-v) * 20}px)`, opacity: v, scale: 0.5 + v * 0.5 }}>REVEAL</div>
        </div>
    );
};

// --- Pattern 19: Spiral Typo ---
const SpiralTypo: React.FC = () => {
    const frame = useCurrentFrame();
    const text = "SPIRAL";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {text.split('').map((char, i) => {
                const t = (frame * 0.05 + i * 0.5) % (Math.PI * 2);
                const r = t * 10;
                return (
                    <span key={i} style={{ 
                        ...TYPO_STYLE, fontSize: 14, position: 'absolute',
                        left: `calc(50% + ${Math.cos(t) * r}px)`,
                        top: `calc(50% + ${Math.sin(t) * r}px)`,
                        transform: 'translate(-50%, -50%)'
                    }}>{char}</span>
                );
            })}
        </div>
    );
};

// --- Pattern 20: Echo Text (GSAP) ---
const EchoText: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {[0, 1, 2].map(i => {
                const f = frame - i * 5;
                const dist = Math.sin(f * 0.1) * 30;
                return (
                    <div key={i} style={{ 
                        ...TYPO_STYLE, position: 'absolute', 
                        transform: `translateX(${dist}px)`,
                        opacity: 1 - i * 0.3,
                        color: i === 0 ? '#fff' : '#ff00ff'
                    }}>ECHO</div>
                );
            })}
        </div>
    );
};

// --- Pattern 21: Typewriter ---
const Typewriter: React.FC = () => {
    const frame = useCurrentFrame();
    const text = "TYPING...";
    const count = Math.floor((frame % 60) / 5);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, fontSize: 25, fontFamily: 'monospace' }}>
                {text.slice(0, count)}
                <span style={{ opacity: Math.floor(frame / 10) % 2 ? 1 : 0 }}>_</span>
            </div>
        </div>
    );
};

// --- Pattern 22: Pulse Color ---
const PulseColor: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 30) / 30;
    const v = Math.abs(Math.sin(t * Math.PI));
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, color: `hsl(${frame % 360}, 80%, ${50 + v * 30}%)`, scale: 1 + v * 0.2 }}>PULSE</div>
        </div>
    );
};

// --- Pattern 23: Perspective Roll ---
const PerspectiveRoll: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const v = getEase("power2.inOut")(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, perspective: 400 }}>
            <div style={{ ...TYPO_STYLE, transform: `rotateY(${v * 360}deg) rotateX(${v * 360}deg)` }}>ROLL</div>
        </div>
    );
};

// --- Pattern 24: Bouncing List ---
const BouncingList: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, gap: 5 }}>
            {["ITEM 1", "ITEM 2", "ITEM 3"].map((item, i) => {
                const t = Math.max(0, Math.min(1, ((frame + i * 10) % 60) / 40));
                const v = getEase("bounce.out")(t);
                return (
                    <div key={i} style={{ ...TYPO_STYLE, fontSize: 18, transform: `scale(${v})` }}>{item}</div>
                );
            })}
        </div>
    );
};

// --- Pattern 25: Rough Flicker ---
const RoughFlicker: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = Math.random() > 0.7 ? 1 : 0.2;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, opacity, color: '#ffff00' }}>NOISE</div>
        </div>
    );
};

// --- Pattern 26: Growing Underline ---
const GrowingUnderline: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.out")(t);
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, fontSize: 30 }}>UNDERLINE</div>
            <div style={{ width: v * 120, height: 4, backgroundColor: '#00ffff', marginTop: 5, borderRadius: 2 }} />
        </div>
    );
};

// --- Pattern 27: Split Reveal ---
const SplitReveal: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("expo.inOut")(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative', overflow: 'hidden' }}>
            <div style={{ ...TYPO_STYLE, clipPath: `inset(0 0 ${50 + v * 50}% 0)`, transform: `translateY(${ (1-v) * 20}px)` }}>SPLIT</div>
            <div style={{ ...TYPO_STYLE, position: 'absolute', clipPath: `inset(${50 + v * 50}% 0 0 0)`, transform: `translateY(${ -(1-v) * 20}px)` }}>SPLIT</div>
        </div>
    );
};

// --- Pattern 28: Wave Gradient ---
const WaveGradient: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, overflow: 'hidden' }}>
            <div style={{ 
                ...TYPO_STYLE, fontSize: 35,
                background: `linear-gradient(${frame * 2}deg, #ff00ff, #00ffff)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%'
            }}>
                GRADIENT
            </div>
        </div>
    );
};

// --- Pattern 29: Rotate Zoom ---
const RotateZoom: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("back.out(1.7)")(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, transform: `scale(${v}) rotate(${v * 360}deg)`, opacity: v }}>BOOM</div>
        </div>
    );
};

// --- Pattern 30: Text Particles ---
const TextParticles: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {[...Array(8)].map((_, i) => {
                const t = ((frame + i * 10) % 80) / 80;
                const r = t * 40;
                const angle = i * 45;
                return (
                    <div key={i} style={{ 
                        ...TYPO_STYLE, fontSize: 10, position: 'absolute',
                        left: `calc(50% + ${Math.cos(angle) * r}px)`,
                        top: `calc(50% + ${Math.sin(angle) * r}px)`,
                        opacity: 1 - t
                    }}>T</div>
                );
            })}
            <div style={{ ...TYPO_STYLE, fontSize: 20 }}>PARTICLE</div>
        </div>
    );
};

// --- Pattern 31: Vibrate Text ---
const VibrateText: React.FC = () => {
    const frame = useCurrentFrame();
    const x = Math.sin(frame * 1.5) * 5;
    const y = Math.cos(frame * 2.1) * 5;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, transform: `translate(${x}px, ${y}px)`, color: '#ff4444' }}>VIBRATE</div>
        </div>
    );
};

// --- Pattern 32: Liquid Text ---
const LiquidText: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                ...TYPO_STYLE, 
                transform: `scaleX(${1 + Math.sin(frame * 0.1) * 0.3}) scaleY(${1 + Math.cos(frame * 0.1) * 0.3})`,
                filter: 'blur(1px)'
            }}>LIQUID</div>
        </div>
    );
};

// --- Pattern 33: Staircase Stagger ---
const StaircaseStagger: React.FC = () => {
    const frame = useCurrentFrame();
    const text = "STAIRS";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ display: 'flex', gap: 2 }}>
                {text.split('').map((char, i) => {
                    const t = Math.max(0, Math.min(1, (frame - i * 5) / 30));
                    const v = getEase("power2.out")(t);
                    return (
                        <span key={i} style={{ ...TYPO_STYLE, fontSize: 20, transform: `translateY(${(1-v) * -i * 10}px)`, opacity: v }}>{char}</span>
                    );
                })}
            </div>
        </div>
    );
};

// --- Pattern 34: Orbit 3D ---
const Orbit3D: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, perspective: 600 }}>
            {[0, 1].map(i => {
                const angle = frame * 0.05 + i * Math.PI;
                const x = Math.cos(angle) * 40;
                const z = Math.sin(angle) * 40;
                return (
                    <div key={i} style={{ 
                        ...TYPO_STYLE, position: 'absolute', fontSize: 18,
                        transform: `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}rad)`,
                        opacity: z > 0 ? 1 : 0.3
                    }}>ORBIT</div>
                );
            })}
        </div>
    );
};

// --- Pattern 35: Character Swap ---
const CharacterSwap: React.FC = () => {
    const frame = useCurrentFrame();
    const chars = "X#@!$%&*";
    const text = frame % 30 < 20 ? "SWAP" : chars[Math.floor(frame % chars.length)] + chars[Math.floor((frame+1) % chars.length)] + chars[Math.floor((frame+2) % chars.length)] + chars[Math.floor((frame+3) % chars.length)];
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, fontSize: 25, fontFamily: 'monospace', color: '#00ff00' }}>{text}</div>
        </div>
    );
};

// --- Pattern 36: Neon Glow Pulse ---
const NeonPulse: React.FC = () => {
    const frame = useCurrentFrame();
    const v = Math.abs(Math.sin(frame * 0.1));
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                ...TYPO_STYLE, color: '#fff',
                textShadow: `0 0 ${10 + v * 20}px #ff00ff, 0 0 ${20 + v * 30}px #00ffff`
            }}>NEON</div>
        </div>
    );
};

// --- Pattern 37: Expanding Kerning ---
const ExpandingKerning: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const v = Math.abs(Math.sin(t * Math.PI));
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, letterSpacing: v * 20, marginLeft: v * 20 }}>SPACE</div>
        </div>
    );
};

// --- Pattern 38: Slat Reveal ---
const SlatReveal: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {[...Array(4)].map((_, i) => {
                const lt = Math.max(0, Math.min(1, (t - i * 0.1) / 0.6));
                const v = getEase("power4.inOut")(lt);
                return (
                    <div key={i} style={{ 
                        position: 'absolute', width: '100%', height: '25%', top: `${i * 25}%`,
                        overflow: 'hidden', backgroundColor: '#111', zIndex: 1
                    }}>
                        <div style={{ ...TYPO_STYLE, transform: `translateY(${(1-v) * 100}%)`, position: 'absolute', width: '100%', top: `-${i * 100}%` }}>SLAT</div>
                    </div>
                );
            })}
        </div>
    );
};

// --- Pattern 39: Typo Grid Color ---
const TypoGridColor: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            {[...Array(9)].map((_, i) => (
                <div key={i} style={{ 
                    ...TYPO_STYLE, fontSize: 12, 
                    color: (Math.floor(frame / 10) + i) % 2 ? '#ff00ff' : '#00ffff' 
                }}>T</div>
            ))}
        </div>
    );
};

// --- Pattern 40: Scaling Ripple ---
const ScalingRipple: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {[0, 1, 2].map(i => {
                const t = ((frame + i * 20) % 60) / 60;
                return (
                    <div key={i} style={{ 
                        ...TYPO_STYLE, position: 'absolute', fontSize: 20,
                        transform: `scale(${1 + t * 3})`, opacity: 1 - t
                    }}>RIPPLE</div>
                );
            })}
            <div style={{ ...TYPO_STYLE, fontSize: 20 }}>RIPPLE</div>
        </div>
    );
};

// --- Pattern 41: Skew Column Slide ---
const SkewColumnSlide: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power2.inOut")(t);
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, overflow: 'hidden' }}>
            <div style={{ ...TYPO_STYLE, fontSize: 18, transform: `translateX(${(v - 0.5) * 100}px) skewX(30deg)` }}>COLUMN</div>
            <div style={{ ...TYPO_STYLE, fontSize: 18, transform: `translateX(${(0.5 - v) * 100}px) skewX(-30deg)` }}>COLUMN</div>
        </div>
    );
};

// --- Pattern 42: Perspective Zoom Out ---
const PerspectiveZoomOut: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const v = getEase("power4.in")(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, perspective: 1000 }}>
            <div style={{ ...TYPO_STYLE, transform: `translateZ(${-v * 1000}px)`, opacity: 1 - v }}>AWAY</div>
        </div>
    );
};

// --- Pattern 43: Double Vision ---
const DoubleVision: React.FC = () => {
    const frame = useCurrentFrame();
    const dist = Math.sin(frame * 0.2) * 10;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            <div style={{ ...TYPO_STYLE, color: '#ff00ff', transform: `translateX(${-dist}px)`, mixBlendMode: 'screen' }}>VISION</div>
            <div style={{ ...TYPO_STYLE, color: '#00ffff', transform: `translateX(${dist}px)`, mixBlendMode: 'screen', position: 'absolute' }}>VISION</div>
        </div>
    );
};

// --- Pattern 44: Bouncing Row ---
const BouncingRow: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("bounce.out")(t);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ ...TYPO_STYLE, transform: `translateY(${-30 + v * 30}px)` }}>BOUNCING</div>
        </div>
    );
};

// --- Pattern 45: Logo Build Typo ---
const LogoBuild: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {["J", "O", "L"].map((char, i) => {
                const st = Math.max(0, Math.min(1, (t - i * 0.2) / 0.4));
                const v = getEase("back.out(3)")(st);
                return (
                    <span key={i} style={{ ...TYPO_STYLE, fontSize: 40, transform: `scale(${v})`, opacity: st }}>{char}</span>
                );
            })}
        </div>
    );
};

export const KineticTypographyCatalog: React.FC = () => {
    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#000', padding: 20, 
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(9, 1fr)', 
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
            
            <TextShuffle />
            <GravityFall />
            <BlurReveal />
            <SpiralTypo />
            <EchoText />
            <Typewriter />
            <PulseColor />
            <PerspectiveRoll />
            <BouncingList />
            <RoughFlicker />
            <GrowingUnderline />
            <SplitReveal />
            <WaveGradient />
            <RotateZoom />
            <TextParticles />
            <VibrateText />
            <LiquidText />
            <Staircase Stagger={true} />
            <Orbit3D />
            <CharacterSwap />
            <NeonPulse />
            <ExpandingKerning />
            <SlatReveal />
            <TypoGridColor />
            <ScalingRipple />
            <SkewColumnSlide />
            <PerspectiveZoomOut />
            <DoubleVision />
            <BouncingRow />
            <LogoBuild />
        </AbsoluteFill>
    );
};
