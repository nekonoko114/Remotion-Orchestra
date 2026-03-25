import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { gsap } from 'gsap';

// --- Utility for safe GSAP ease ---
const getEase = (name: string) => gsap.parseEase(name) || ((v: number) => v);

const LYRIC_STYLE: React.CSSProperties = {
    color: '#fff',
    fontSize: 160,
    fontWeight: 900,
    fontFamily: 'Mochiy Pop One, sans-serif',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.8)',
};

const Wrapper: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = '#000' }) => (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: bg, border: '1px solid #333', position: 'relative', overflow: 'hidden' }}>
        {children}
    </div>
);

// --- 1. 3D Pop-in ---
const MvPopIn3D: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("back.out(3)")(t);
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `scale(${v}) translateZ(${ (1-v) * 200 }px)`, opacity: v, perspective: 1000 }}>歌</div>
        </Wrapper>
    );
};

// --- 2. Slide & Skew ---
const MvSlideSkew: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("expo.out")(t);
    const x = (1 - v) * 500;
    const skew = (1 - v) * 45;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `translateX(${x}px) skewX(${-skew}deg)`, opacity: v }}>詞</div>
        </Wrapper>
    );
};

// --- 3. Hinge Drop ---
const MvHingeDrop: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("bounce.out")(t);
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transformOrigin: 'top center', transform: `rotateX(${(1-v) * -90}deg)`, opacity: v }}>音</div>
        </Wrapper>
    );
};

// --- 4. Glitch Flash ---
const MvGlitchFlash: React.FC = () => {
    const frame = useCurrentFrame();
    const f = frame % 45;
    const isGlitch = f < 5;
    const offsetX = isGlitch ? (Math.random() - 0.5) * 40 : 0;
    return (
        <Wrapper>
            {isGlitch && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.2)', zIndex: 1 }} />}
            <div style={{ 
                ...LYRIC_STYLE, 
                transform: `translateX(${offsetX}px)`,
                textShadow: isGlitch ? '4px 0 #ff00ff, -4px 0 #00ffff' : '0 0 20px rgba(255,255,255,0.8)',
                opacity: f < 30 ? 1 : 0
            }}>光</div>
        </Wrapper>
    );
};

// --- 5. Soft Expansion ---
const MvSoftExp: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("power4.out")(t);
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `scale(${0.5 + v * 0.5})`, filter: `blur(${(1-v) * 40}px)`, opacity: v }}>夢</div>
        </Wrapper>
    );
};

// --- 6. Double Vision Pop ---
const MvDoubleVision: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("expo.out")(t);
    const dist = (1 - v) * 100;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, color: '#ff00ff', transform: `translateX(${-dist}px)`, opacity: v * 0.5, mixBlendMode: 'screen' }}>魂</div>
            <div style={{ ...LYRIC_STYLE, color: '#00ffff', transform: `translateX(${dist}px)`, opacity: v * 0.5, mixBlendMode: 'screen', position: 'absolute' }}>魂</div>
            <div style={{ ...LYRIC_STYLE, position: 'absolute', opacity: v }}>魂</div>
        </Wrapper>
    );
};

// --- 7. Clockwise Flip ---
const MvClockFlip: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("back.out(1.5)")(t);
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `rotateY(${v * 360}deg)`, opacity: v }}>巡</div>
        </Wrapper>
    );
};

// --- 8. Rainbow Pulse ---
const MvRainbowPulse: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("power2.out")(t);
    return (
        <Wrapper>
            <div style={{ 
                ...LYRIC_STYLE, 
                color: `hsl(${frame * 10}, 80%, 70%)`,
                transform: `scale(${v})`,
                opacity: v,
                filter: `brightness(${1 + (1-v) * 2})`
            }}>彩</div>
        </Wrapper>
    );
};

// --- 9. Vibrate Settle ---
const MvVibrateSettle: React.FC = () => {
    const frame = useCurrentFrame();
    const f = frame % 60;
    const isVibrate = f < 20;
    const x = isVibrate ? (Math.random() - 0.5) * 20 : 0;
    const y = isVibrate ? (Math.random() - 0.5) * 20 : 0;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `translate(${x}px, ${y}px)`, opacity: f < 40 ? 1 : 0 }}>震</div>
        </Wrapper>
    );
};

// --- 10. Magnetic Pull ---
const MvMagneticPull: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("power4.out")(t);
    const x = Math.cos(frame * 0.1) * (1 - v) * 400;
    const y = Math.sin(frame * 0.1) * (1-v) * 400;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `translate(${x}px, ${y}px)`, opacity: v }}>核</div>
        </Wrapper>
    );
};

// --- 11. Vertical Slat Build ---
const MvVerticalSlat: React.FC = () => {
    const frame = useCurrentFrame();
    const count = 5;
    return (
        <Wrapper>
            <div style={{ display: 'flex', width: 200, height: 200, position: 'relative' }}>
                {[...Array(count)].map((_, i) => {
                    const t = Math.max(0, Math.min(1, ((frame % 60) - i * 5) / 30));
                    const v = getEase("power3.inOut")(t);
                    return (
                        <div key={i} style={{ 
                            flex: 1, height: '100%', overflow: 'hidden', 
                            backgroundColor: '#111', position: 'relative'
                        }}>
                            <div style={{ 
                                ...LYRIC_STYLE, 
                                fontSize: 160,
                                position: 'absolute',
                                left: `-${i * (200/count)}px`,
                                transform: `translateY(${(1-v) * 100}%)`,
                                width: 200
                            }}>裂</div>
                        </div>
                    );
                })}
            </div>
        </Wrapper>
    );
};

// --- 12. Focus Pulse ---
const MvFocusPulse: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = Math.abs(Math.sin(t * Math.PI));
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `scale(${1 + v * 0.2})`, filter: `blur(${ (1-v) * 10 }px)`, opacity: 0.5 + v * 0.5 }}>脈</div>
        </Wrapper>
    );
};

// --- 13. Elastic Squeeze ---
const MvElasticSqueeze: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("elastic.out(1, 0.3)")(t);
    return (
        <Wrapper>
            <div style={{ 
                ...LYRIC_STYLE, 
                transform: `scaleX(${v > 0.1 ? 1/v : 1}) scaleY(${v}) translateY(${(1-v) * 200}px)`, 
                opacity: t < 0.1 ? 0 : 1
            }}>弾</div>
        </Wrapper>
    );
};

// --- 14. Neon Strike ---
const MvNeonStrike: React.FC = () => {
    const frame = useCurrentFrame();
    const f = frame % 60;
    const isStrike = f < 10 && f % 2 === 0;
    return (
        <Wrapper bg={isStrike ? '#111' : '#000'}>
            <div style={{ 
                ...LYRIC_STYLE, 
                color: isStrike ? '#fff' : '#00ffff',
                textShadow: isStrike ? '0 0 40px #fff' : '0 0 20px #00ffff',
                opacity: f < 40 ? 1 : 0,
                transform: `scale(${1 + (isStrike ? 0.1 : 0)})`
            }}>雷</div>
        </Wrapper>
    );
};

// --- 15. Dot Formation (Simulated) ---
const MvDotForm: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.out")(t);
    return (
        <Wrapper>
            <div style={{ position: 'relative' }}>
                {[...Array(20)].map((_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const r = (1 - v) * 200;
                    return (
                        <div key={i} style={{ 
                            position: 'absolute', width: 10, height: 10, backgroundColor: '#fff', borderRadius: '50%',
                            left: Math.cos(angle) * r,
                            top: Math.sin(angle) * r,
                            opacity: 1 - v
                        }} />
                    );
                })}
                <div style={{ ...LYRIC_STYLE, opacity: v, scale: v }}>結</div>
            </div>
        </Wrapper>
    );
};

export const MvLyricTypographyCatalog: React.FC = () => {
    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#000', padding: 20, 
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', 
            gap: 10 
        }}>
            <MvPopIn3D />
            <MvSlideSkew />
            <MvHingeDrop />
            <MvGlitchFlash />
            <MvSoftExp />
            <MvDoubleVision />
            <MvClockFlip />
            <MvRainbowPulse />
            <MvVibrateSettle />
            <MvMagneticPull />
            <MvVerticalSlat />
            <MvFocusPulse />
            <MvElasticSqueeze />
            <MvNeonStrike />
            <MvDotForm />
        </AbsoluteFill>
    );
};
