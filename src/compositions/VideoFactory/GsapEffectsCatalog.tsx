import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { gsap } from 'gsap';

// --- Utility for safe GSAP ease ---
const getEase = (name: string) => gsap.parseEase(name) || ((v: number) => v);

// --- Pattern 1: Staggered Grid (GSAP) ---
const StaggeredGrid: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const duration = 2 * fps;
    const progress = (frame % duration) / duration;

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
                {[...Array(25)].map((_, i) => {
                    // Calculate local progress for each cell with stagger
                    const staggerAmount = (i % 5 + Math.floor(i / 5)) * 0.1;
                    const localProgress = Math.max(0, Math.min(1, (progress - staggerAmount) / 0.5));
                    // In a real GSAP usage, we might use a timeline, 
                    // but for Remotion integration, mapping progress is safer.
                    const rotate = localProgress * 180;
                    const scale = 1 - Math.abs(localProgress - 0.5) * 2;
                    
                    return (
                        <div 
                            key={i} 
                            style={{ 
                                width: 15, height: 15, backgroundColor: i % 2 === 0 ? '#ff00ff' : '#00ffff',
                                transform: `rotate(${rotate}deg) scale(${scale})`,
                                borderRadius: 2
                            }} 
                        />
                    );
                })}
            </div>
        </div>
    );
};

// --- Pattern 2: Elastic Bounce (GSAP) ---
const ElasticBounce: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const duration = 2 * fps;
    const progress = (frame % duration) / duration;

    // Use GSAP's ease function directly
    const ease = gsap.parseEase("elastic.out(1, 0.3)");
    const v = ease(progress);

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <div style={{ 
                width: 50 * v, height: 50 * v, 
                backgroundColor: '#fff', 
                borderRadius: '50%',
                boxShadow: '0 0 20px rgba(255,255,255,0.5)'
            }} />
        </div>
    );
};

// --- Pattern 3: GSAP Path Follower ---
const PathFollower: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const duration = 3 * fps;
    const progress = (frame % duration) / duration;

    // Simple path logic (could be more complex with GSAP MotionPath)
    const x = 30 + Math.sin(progress * Math.PI * 2) * 30;
    const y = 30 + Math.cos(progress * Math.PI * 4) * 20;

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <svg width="80" height="80" viewBox="0 0 100 100">
                <path d="M 30 10 Q 90 50 30 90" fill="none" stroke="#333" strokeWidth="2" />
                <circle cx={x + 20} cy={y + 20} r="5" fill="#ff00ff" />
            </svg>
        </div>
    );
};

// --- Pattern 4: Floating Bubbles (GSAP Ease) ---
const FloatingBubbles: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10, position: 'relative', overflow: 'hidden' }}>
            {[...Array(5)].map((_, i) => {
                const t = (frame / (60 + i * 10) + i) % 1;
                const ease = gsap.parseEase("power1.inOut");
                const y = 80 - ease(t) * 100;
                const x = 20 + i * 15 + Math.sin(frame * 0.05 + i) * 10;
                return (
                    <div key={i} style={{
                        position: 'absolute', left: `${x}%`, top: `${y}%`,
                        width: 10, height: 10, borderRadius: '50%',
                        border: '1px solid #00ffff', opacity: 1 - t
                    }} />
                );
            })}
        </div>
    );
};

// --- Pattern 5: Text Reveal (GSAP Style Stagger) ---
const TextReveal: React.FC = () => {
    const frame = useCurrentFrame();
    const text = "GSAP";
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <div style={{ display: 'flex', gap: 5 }}>
                {text.split('').map((char, i) => {
                    const t = Math.max(0, Math.min(1, (frame - i * 5) / 20));
                    const ease = gsap.parseEase("back.out(2)");
                    const v = ease(t);
                    return (
                        <span key={i} style={{ 
                            color: '#fff', fontSize: 24, fontWeight: 'bold',
                            transform: `translateY(${(1-v) * 20}px) scale(${v})`,
                            opacity: v
                        }}>
                            {char}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// --- Pattern 6: Rotating Rings (GSAP Eases) ---
const RotatingRings: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10 }}>
            <div style={{ position: 'relative', width: 60, height: 60 }}>
                {[1, 2, 3].map(i => {
                    const ease = gsap.parseEase(i % 2 === 0 ? "power2.inOut" : "circ.out");
                    const rot = ease((frame / (60 * i)) % 1) * 360;
                    return (
                        <div key={i} style={{
                            position: 'absolute', top: 30 - i * 10, left: 30 - i * 10,
                            width: i * 20, height: i * 20,
                            border: `2px solid ${i === 2 ? '#ff00ff' : '#00ffff'}`,
                            borderRadius: '50%',
                            borderTopColor: 'transparent',
                            transform: `rotate(${rot}deg)`
                        }} />
                    );
                })}
            </div>
        </div>
    );
};

// --- Pattern 7: Particle Explosion (GSAP) ---
const ParticleExplosion: React.FC = () => {
    const frame = useCurrentFrame();
    const cycle = 90;
    const t = (frame % cycle) / cycle;
    const ease = gsap.parseEase("power4.out");
    const v = ease(t);

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10, position: 'relative' }}>
            {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                const dist = v * 35;
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `calc(50% + ${Math.cos(angle) * dist}px)`,
                        top: `calc(50% + ${Math.sin(angle) * dist}px)`,
                        width: 4, height: 4, backgroundColor: '#fff',
                        opacity: 1 - v,
                        transform: 'translate(-50%, -50%)'
                    }} />
                );
            })}
        </div>
    );
};

// --- Pattern 8: GSAP Timeline Style Sequence ---
const SequenceDots: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const total = 4 * fps;
    const progress = (frame % total) / total;

    // Simulate GSAP timeline by splitting progress
    const getSubProgress = (start: number, end: number) => {
        return Math.max(0, Math.min(1, (progress - start) / (end - start)));
    };

    const p1 = gsap.parseEase("power2.out")(getSubProgress(0, 0.3));
    const p2 = gsap.parseEase("back.out")(getSubProgress(0.3, 0.6));
    const p3 = gsap.parseEase("elastic.out")(getSubProgress(0.6, 1.0));

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10, gap: 10 }}>
            <div style={{ width: 10, height: 10, backgroundColor: '#00ffff', transform: `translateY(${p1 * -20}px)` }} />
            <div style={{ width: 10, height: 10, backgroundColor: '#ff00ff', transform: `scale(${p2 * 1.5})` }} />
            <div style={{ width: 10, height: 10, backgroundColor: '#fff', opacity: p3, transform: `translateX(${p3 * 10}px)` }} />
        </div>
    );
};

// --- Pattern 9: Magnetic Attraction (GSAP Power) ---
const MagneticPoint: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const ease = gsap.parseEase("power2.inOut") || ((v: number) => v);
    const targetX = Math.sin(frame * 0.05) * 30;
    const targetY = Math.cos(frame * 0.03) * 20;
    
    // Following logic with "smooth" ease
    const v = ease(t);

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 10, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px))`, width: 4, height: 4, backgroundColor: '#555', borderRadius: '50%' }} />
            <div style={{ 
                width: 10, height: 10, backgroundColor: '#fff', borderRadius: '50%',
                transform: `translate(${targetX * v}px, ${targetY * v}px)`,
                boxShadow: '0 0 10px #fff'
            }} />
        </div>
    );
};

// --- Pattern 10: Color Shift (GSAP Color) ---
const ColorShift: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 180) / 180;
    // We can use interpolate from remotion for colors too, but let's stick to GSAP logic
    // GSAP handles colors as strings easily in tweens, here we map progress manually.
    const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff00ff"];
    const section = Math.floor(t * 3);
    
    return (
        <div style={{ 
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
            backgroundColor: '#111', borderRadius: 20, margin: 10 
        }}>
            <div style={{ 
                width: 40, height: 40, 
                backgroundColor: colors[section], // Simple switch for demo
                filter: `hue-rotate(${t * 360}deg)`, // Using CSS for smooth transition
                borderRadius: 10,
                transform: `rotate(${frame}deg)`
            }} />
        </div>
    );
};

// --- Pattern 11: Pulse Glow (GSAP Sine) ---
const PulseGlow: React.FC = () => {
    const frame = useCurrentFrame();
    const ease = getEase("sine.inOut");
    const v = ease((frame % 60) / 60);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                width: 30 + v * 20, height: 30 + v * 20, 
                backgroundColor: '#00ffff', borderRadius: '50%',
                boxShadow: `0 0 ${20 + v * 30}px #00ffff`
            }} />
        </div>
    );
};

// --- Pattern 12: Bezier Dash (SVG + GSAP) ---
const BezierDash: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const ease = getEase("power1.inOut");
    const dashOffset = (1 - ease(t)) * 200;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="60" height="60" viewBox="0 0 100 100">
                <path d="M 10 50 C 40 10, 60 90, 90 50" fill="none" stroke="#ff00ff" strokeWidth="4" strokeDasharray="200" strokeDashoffset={dashOffset} />
            </svg>
        </div>
    );
};

// --- Pattern 13: Spiral Expansion (GSAP Stagger) ---
const SpiralExpansion: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {[...Array(10)].map((_, i) => {
                const stagger = i * 0.05;
                const localT = Math.max(0, Math.min(1, (t - stagger) / 0.5));
                const ease = getEase("back.out(1.7)");
                const r = ease(localT) * 30;
                const angle = i * 0.8 + frame * 0.05;
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `calc(50% + ${Math.cos(angle) * r}px)`,
                        top: `calc(50% + ${Math.sin(angle) * r}px)`,
                        width: 6, height: 6, backgroundColor: '#fff', borderRadius: '50%',
                        opacity: 1 - localT
                    }} />
                );
            })}
        </div>
    );
};

// --- Pattern 14: Flipping Card (3D GSAP) ---
const FlippingCard: React.FC = () => {
    const frame = useCurrentFrame();
    const ease = getEase("expo.inOut");
    const rot = ease((frame % 90) / 90) * 180;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, perspective: 500 }}>
            <div style={{ 
                width: 40, height: 50, backgroundColor: '#ff00ff', 
                transform: `rotateY(${rot}deg)`, borderRadius: 5,
                border: '2px solid #fff'
            }} />
        </div>
    );
};

// --- Pattern 15: Magnetic Grid (GSAP Power) ---
const MagneticGrid: React.FC = () => {
    const frame = useCurrentFrame();
    const targetX = Math.sin(frame * 0.05) * 20;
    const targetY = Math.cos(frame * 0.05) * 20;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[...Array(9)].map((_, i) => {
                    const ease = getEase("power3.out");
                    const v = ease(0.5 + Math.sin(frame * 0.1 + i) * 0.2);
                    return (
                        <div key={i} style={{ 
                            width: 8, height: 8, backgroundColor: '#00ffff', borderRadius: '50%',
                            transform: `translate(${targetX * v}px, ${targetY * v}px)`
                        }} />
                    );
                })}
            </div>
        </div>
    );
};

// --- Pattern 16: Bouncing Balls (GSAP Bounce) ---
const BouncingBalls: React.FC = () => {
    const frame = useCurrentFrame();
    const ease = getEase("bounce.out");
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative', overflow: 'hidden' }}>
            {[0, 1, 2].map(i => {
                const t = ((frame + i * 20) % 60) / 60;
                const y = ease(t) * 40;
                return (
                    <div key={i} style={{
                        position: 'absolute', left: 15 + i * 15, bottom: 10 + (40 - y),
                        width: 10, height: 10, backgroundColor: '#ff00ff', borderRadius: '50%'
                    }} />
                );
            })}
        </div>
    );
};

// --- Pattern 17: SVG Wave (GSAP Sine Path) ---
const SVGWave: React.FC = () => {
    const frame = useCurrentFrame();
    const points = useMemo(() => {
        let d = "M 0 30";
        for (let x = 0; x <= 60; x += 5) {
            const y = 30 + Math.sin(x * 0.1 + frame * 0.1) * 15;
            d += ` L ${x} ${y}`;
        }
        return d;
    }, [frame]);
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <path d={points} fill="none" stroke="#00ffff" strokeWidth="3" strokeLinecap="round" />
            </svg>
        </div>
    );
};

// --- Pattern 18: Staggered Bars (GSAP Power) ---
const StaggeredBars: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, gap: 4, paddingBottom: 10 }}>
            {[...Array(5)].map((_, i) => {
                const t = ((frame + i * 5) % 90) / 90;
                const ease = getEase("power2.inOut");
                const h = 10 + ease(Math.abs(Math.sin(t * Math.PI))) * 30;
                return (
                    <div key={i} style={{ width: 6, height: h, backgroundColor: '#fff', borderRadius: 3 }} />
                );
            })}
        </div>
    );
};

// --- Pattern 19: Twinkling Stars (GSAP Rough) ---
const TwinklingStars: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {[...Array(8)].map((_, i) => {
                const flicker = Math.sin(frame * 0.2 + i) > 0.8 ? 1 : 0.3;
                return (
                    <div key={i} style={{
                        position: 'absolute', left: (i * 13) % 50 + 5, top: (i * 17) % 50 + 5,
                        width: 3, height: 3, backgroundColor: '#ffff00', borderRadius: '50%',
                        opacity: flicker, boxShadow: flicker > 0.5 ? '0 0 5px #ffff00' : 'none'
                    }} />
                );
            })}
        </div>
    );
};

// --- Pattern 20: Scanning Line (GSAP Slow) ---
const ScanningLine: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const x = t * 60;
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 2, backgroundColor: '#00ffff', boxShadow: '0 0 10px #00ffff' }} />
            <div style={{ color: '#555', fontSize: 10, position: 'relative', zIndex: 1 }}>SCANNING...</div>
        </div>
    );
};

// --- Pattern 21: Hue Rotate Wheel (GSAP) ---
const HueWheel: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                width: 40, height: 40, border: '4px solid transparent', borderTopColor: '#ff00ff', borderRightColor: '#00ffff',
                borderRadius: '50%', filter: `hue-rotate(${frame * 5}deg)`,
                transform: `rotate(${frame * 2}deg)`
            }} />
        </div>
    );
};

// --- Pattern 22: Particle Vortex (GSAP Power) ---
const ParticleVortex: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, position: 'relative' }}>
            {[...Array(12)].map((_, i) => {
                const t = ((frame + i * 10) % 120) / 120;
                const ease = getEase("power2.in");
                const r = (1 - ease(t)) * 40;
                const angle = t * Math.PI * 4 + i;
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `calc(50% + ${Math.cos(angle) * r}px)`,
                        top: `calc(50% + ${Math.sin(angle) * r}px)`,
                        width: 3, height: 3, backgroundColor: '#fff', borderRadius: '50%',
                        opacity: t
                    }} />
                );
            })}
        </div>
    );
};

// --- Pattern 23: Elastic List (GSAP Elastic) ---
const ElasticList: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5, gap: 4 }}>
            {[0, 1, 2].map(i => {
                const delay = i * 5;
                const t = Math.max(0, Math.min(1, (frame % (2 * fps) - delay) / 30));
                const ease = getEase("elastic.out(1, 0.5)");
                const x = (1 - ease(t)) * 20;
                return (
                    <div key={i} style={{ width: 30, height: 6, backgroundColor: i % 2 === 0 ? '#ff00ff' : '#00ffff', transform: `translateX(${x}px)`, borderRadius: 3, opacity: t }} />
                );
            })}
        </div>
    );
};

// --- Pattern 24: Glitch Flash (GSAP Steps) ---
const GlitchFlash: React.FC = () => {
    const frame = useCurrentFrame();
    const isGlitch = (frame % 30) < 5;
    const offsetX = isGlitch ? (Math.sin(frame) * 5) : 0;
    const color = isGlitch ? '#ff0000' : '#fff';
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ 
                fontSize: 18, fontWeight: 'bold', color: color, 
                transform: `translateX(${offsetX}px) scale(${isGlitch ? 1.2 : 1})`,
                textShadow: isGlitch ? '2px 2px #00ffff' : 'none',
                fontFamily: 'monospace'
            }}>ERROR</div>
        </div>
    );
};

// --- Pattern 25: Concentric Hexagons (GSAP) ---
const ConcentricHex: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 20, margin: 5 }}>
            <div style={{ position: 'relative', width: 40, height: 40 }}>
                {[1, 2, 3].map(i => {
                    const t = ((frame + i * 15) % 120) / 120;
                    const ease = getEase("power1.inOut");
                    const s = 0.5 + ease(t) * 1;
                    return (
                        <div key={i} style={{
                            position: 'absolute', top: 0, left: 0, width: 40, height: 40,
                            border: '2px solid #fff',
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            transform: `scale(${s}) rotate(${frame * i * 0.5}deg)`,
                            opacity: 1 - t
                        }} />
                    );
                })}
            </div>
        </div>
    );
};

export const GsapEffectsCatalog: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
        backgroundColor: '#000', padding: 20, 
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', 
        gap: 10 
    }}>
      <StaggeredGrid />
      <ElasticBounce />
      <PathFollower />
      <FloatingBubbles />
      <TextReveal />
      <RotatingRings />
      <ParticleExplosion />
      <SequenceDots />
      <MagneticPoint />
      <ColorShift />
      
      <PulseGlow />
      <BezierDash />
      <SpiralExpansion />
      <FlippingCard />
      <MagneticGrid />
      <BouncingBalls />
      <SVGWave />
      <StaggeredBars />
      <TwinklingStars />
      <ScanningLine />
      <HueWheel />
      <ParticleVortex />
      <ElasticList />
      <GlitchFlash />
      <ConcentricHex />
    </AbsoluteFill>
  );
};
