import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(MorphSVGPlugin);
}

// --- Utility for safe GSAP ease ---
export const getEase = (name: string) => gsap.parseEase(name) || ((v: number) => v);

const LYRIC_STYLE: React.CSSProperties = {
    color: '#fff',
    fontSize: 160,
    fontWeight: 900,
    fontFamily: 'Mochiy Pop One, sans-serif',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255,255,255,0.8)',
};

const CharSplitter: React.FC<{
    text: string;
    renderChar: (char: string, index: number) => React.ReactNode;
}> = ({ text, renderChar }) => (
    <div style={{ display: 'flex', whiteSpace: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
        {text.split('').map((char, i) => (
            <div key={i} style={{ display: 'inline-block' }}>
                {char === ' ' ? '\u00A0' : renderChar(char, i)}
            </div>
        ))}
    </div>
);

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
            <div style={{ ...LYRIC_STYLE, transformOrigin: 'center center', transform: `scale(${v}) translateZ(${ (1-v) * 200 }px)`, opacity: v }}>歌</div>
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
                transformOrigin: 'bottom center',
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
                <div style={{ ...LYRIC_STYLE, opacity: v, transform: `scale(${v})` }}>結</div>
            </div>
        </Wrapper>
    );
};

// --- 16. MvMorphShape (MorphSVG) ---
const MvMorphShape: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const pathA = "M 50,50 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0";
    const pathB = "M 50,10 L 61,35 L 88,35 L 66,52 L 75,79 L 50,62 L 25,79 L 34,52 L 12,35 L 39,35 Z";
    
    return (
        <Wrapper>
            <svg viewBox="0 0 100 100" style={{ width: '80%', height: '80%' }}>
                <path 
                    d={t < 0.5 ? pathA : pathB} 
                    fill="#fff"
                    style={{ 
                        transformOrigin: 'center',
                        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }} 
                />
            </svg>
            <div style={{ ...LYRIC_STYLE, position: 'absolute', fontSize: 60, opacity: t > 0.6 ? 1 : 0 }}>形</div>
        </Wrapper>
    );
};

// --- 17. MvShatterFragment ---
const MvShatter: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const count = 16;
    return (
        <Wrapper>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
                {[...Array(count)].map((_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    const v = getEase("power4.out")(t);
                    return (
                        <div key={i} style={{ 
                            position: 'absolute', left: col * 40, top: row * 40, width: 40, height: 40,
                            overflow: 'hidden', opacity: v,
                            transform: `translate(${(col-1.5)*100*(1-v)}px, ${(row-1.5)*100*(1-v)}px)`
                        }}>
                            <div style={{ ...LYRIC_STYLE, position: 'absolute', left: -col * 40, top: -row * 40, width: 160 }}>砕</div>
                        </div>
                    );
                })}
            </div>
        </Wrapper>
    );
};

// --- 18. MvMotionBlurFlip ---
const MvMotionBlurFlip: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("power2.inOut")(t);
    return (
        <Wrapper>
            {[0, 1, 2].map(i => (
                <div key={i} style={{ 
                    ...LYRIC_STYLE, position: 'absolute',
                    transform: `rotateY(${v * 360 + i * 5}deg)`,
                    opacity: (1 - i * 0.3) * (1 - Math.abs(t-0.5)*2)
                }}>瞬</div>
            ))}
        </Wrapper>
    );
};

// --- 19. MvElasticGrid ---
const MvElasticGrid: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <Wrapper>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '80%', height: '80%' }}>
                {["快", "楽", "速", "撃"].map((char, i) => {
                    const t = Math.max(0, Math.min(1, ((frame + i * 5) % 60) / 30));
                    const v = getEase("elastic.out(1, 0.5)")(t);
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ ...LYRIC_STYLE, fontSize: 60, transform: `scale(${v})` }}>{char}</span>
                        </div>
                    );
                })}
            </div>
        </Wrapper>
    );
};

// --- 20. MvLiquidDistortion (SVG Filter) ---
const MvLiquid: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <Wrapper>
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="liquid-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" seed={frame}>
                        <animate attributeName="baseFrequency" dur="10s" values="0.01 0.05;0.05 0.01;0.01 0.05" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="30" />
                </filter>
            </svg>
            <div style={{ ...LYRIC_STYLE, filter: 'url(#liquid-filter)', color: '#00ffff' }}>液</div>
        </Wrapper>
    );
};

// --- 21. MvSwiftSwapBuild ---
const MvSwiftSwap: React.FC = () => {
    const frame = useCurrentFrame();
    const chars = "あいうえおかきくけこさしすせそ";
    const text = frame % 30 < 22 ? chars[Math.floor(Math.random() * chars.length)] : "終";
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, color: frame % 30 < 22 ? '#555' : '#fff' }}>{text}</div>
        </Wrapper>
    );
};

// --- 22. MvGravityBounce ---
const MvGravityDrop: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("bounce.out")(t);
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `translateY(${-200 + v * 200}px)` }}>墜</div>
        </Wrapper>
    );
};

// --- 23. MvTunnelSlide ---
const MvTunnel: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.in")(t);
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `scale(${1 + v * 15})`, opacity: 1 - v }}>奥</div>
        </Wrapper>
    );
};

// --- 24. MvStrobeAnimate ---
const MvStrobe: React.FC = () => {
    const frame = useCurrentFrame();
    const active = frame % 2 === 0;
    return (
        <Wrapper bg={active ? '#fff' : '#000'}>
            <div style={{ ...LYRIC_STYLE, color: active ? '#000' : '#fff' }}>閃</div>
        </Wrapper>
    );
};

// --- 25. MvOutlineDraw ---
const MvOutlineDraw: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power2.inOut")(t);
    return (
        <Wrapper>
            <div style={{ 
                ...LYRIC_STYLE, 
                color: 'transparent', 
                WebkitTextStroke: `2px rgba(255,255,255,${1})`,
                position: 'relative'
            }}>
                描
                <div style={{ 
                    ...LYRIC_STYLE, position: 'absolute', top: 0, left: 0, color: '#fff', 
                    clipPath: `inset(0 ${100-v*100}% 0 0)`,
                    transition: 'clip-path 0.1s linear'
                }}>描</div>
            </div>
        </Wrapper>
    );
};

// --- 26. MvVerticalSlice ---
const MvSlice: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <Wrapper>
            {[...Array(6)].map((_, i) => {
                const t = Math.max(0, Math.min(1, ((frame % 60) - i * 3) / 30));
                const v = getEase("expo.out")(t);
                return (
                    <div key={i} style={{ 
                        position: 'absolute', width: '100%', height: '16.6%', top: `${i * 16.6}%`,
                        overflow: 'hidden', opacity: v
                    }}>
                        <div style={{ ...LYRIC_STYLE, transform: `translateY(${(1-v) * 100}%)`, position: 'absolute', top: `-${i * 16.6}%`, width: '100%' }}>切</div>
                    </div>
                );
            })}
        </Wrapper>
    );
};

// --- 27. MvWhirlpool ---
const MvWhirl: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.out")(t);
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `rotate(${ (1-v) * 720 }deg) scale(${v})`, filter: `blur(${(1-v) * 20}px)`, opacity: v }}>渦</div>
        </Wrapper>
    );
};

// --- 28. MvHologram ---
const MvHologram: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = 0.5 + Math.sin(frame * 0.5) * 0.5;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, color: '#00ffff', opacity, position: 'relative' }}>
                幻
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,255,255,0.2) 50%)', backgroundSize: '100% 4px', zIndex: 1 }} />
            </div>
        </Wrapper>
    );
};

// --- 29. MvBezierFlow ---
const MvBezier: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const x = Math.sin(t * Math.PI) * 200;
    const y = Math.cos(t * Math.PI * 2) * 100;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `translate(${x}px, ${y}px)`, opacity: Math.sin(t * Math.PI) }}>流</div>
        </Wrapper>
    );
};

// --- 30. MvDepthOfField ---
const MvDepth: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const blur = (1 - getEase("power2.inOut")(t)) * 40;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, filter: `blur(${blur}px)`, transform: `scale(${2 - t})`, opacity: t }}>芯</div>
        </Wrapper>
    );
};

// --- 31. Explosive Scatter ---
const MvExplosiveScatter: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("elastic.out(1, 0.3)")(t);
    return (
        <Wrapper>
            <CharSplitter text="爆" renderChar={(char, i) => {
                const angle = i * 0.5;
                const dist = (1 - v) * 300;
                return (
                    <div style={{ 
                        ...LYRIC_STYLE, 
                        transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(${v})`,
                        opacity: v 
                    }}>{char}</div>
                );
            }} />
        </Wrapper>
    );
};

// --- 32. 3D Cylinder Roll ---
const MvCylinderRoll: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power3.inOut")(t);
    return (
        <Wrapper>
            <div style={{ perspective: 1000 }}>
                <div style={{ 
                    ...LYRIC_STYLE, 
                    transform: `rotateX(${v * 360}deg) translateZ(50px)`,
                    transformStyle: 'preserve-3d'
                }}>輪</div>
            </div>
        </Wrapper>
    );
};

// --- 33. Advanced Glitch Disp ---
const MvGlitchDisp: React.FC = () => {
    const frame = useCurrentFrame();
    const f = frame % 60;
    const isGlitch = f < 10 || (f > 30 && f < 35);
    return (
        <Wrapper>
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="adv-glitch">
                    <feTurbulence type="fractalNoise" baseFrequency={isGlitch ? "0.5 0.01" : "0.001"} numOctaves="1" seed={frame}>
                        <animate attributeName="baseFrequency" dur="0.1s" values="0.5 0.01; 0.01 0.5; 0.5 0.01" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale={isGlitch ? "50" : "0"} />
                </filter>
            </svg>
            <div style={{ 
                ...LYRIC_STYLE, 
                filter: 'url(#adv-glitch)',
                color: isGlitch ? '#ff00ff' : '#00ffff'
            }}>乱</div>
        </Wrapper>
    );
};

// --- 34. Neon Path Draw ---
const MvNeonPath: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power2.inOut")(t);
    return (
        <Wrapper>
            <div style={{ 
                ...LYRIC_STYLE, 
                color: 'transparent',
                WebkitTextStroke: `4px #fff`,
                filter: `drop-shadow(0 0 ${v * 20}px #fff)`,
                clipPath: `inset(0 ${100 - v * 100}% 0 0)`
            }}>軌</div>
        </Wrapper>
    );
};

// --- 35. Magnetic Converge ---
const MvMagneticText: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.out")(t);
    const scatter = (1 - v) * 400;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `translate(${(Math.random() - 0.5) * scatter}px, ${(Math.random() - 0.5) * scatter}px)`, opacity: v }}>集</div>
        </Wrapper>
    );
};

// --- 36. Shatter Gravity Fall ---
const MvShatterFall: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.in")(t);
    const count = 4;
    return (
        <Wrapper>
            <div style={{ position: 'relative', width: 160, height: 160 }}>
                {[...Array(count * count)].map((_, i) => {
                    const row = Math.floor(i / count);
                    const col = i % count;
                    const rotate = v * (Math.random() * 360);
                    return (
                        <div key={i} style={{ 
                            position: 'absolute', left: col * 40, top: row * 40, width: 40, height: 40,
                            overflow: 'hidden',
                            transform: `translate(${(col-1.5)*50*v}px, ${v * 500}px) rotate(${rotate}deg)`,
                            opacity: 1 - v
                        }}>
                            <div style={{ ...LYRIC_STYLE, position: 'absolute', left: -col * 40, top: -row * 40, width: 160 }}>落</div>
                        </div>
                    );
                })}
            </div>
        </Wrapper>
    );
};

// --- 37. Echo Blur Trail ---
const MvEchoBlur: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const v = getEase("power2.out")(t);
    return (
        <Wrapper>
            {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ 
                    ...LYRIC_STYLE, position: 'absolute',
                    transform: `translate(${ (t - i * 0.1) * 200 }px, 0)`,
                    filter: `blur(${i * 10}px)`,
                    opacity: 1 - i * 0.25 - (1-v)
                }}>影</div>
            ))}
        </Wrapper>
    );
};

// --- 38. Scale Wave Ripple ---
const MvScaleWave: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <Wrapper>
            <CharSplitter text="波動" renderChar={(char, i) => {
                const localT = Math.max(0, Math.min(1, ((frame % 60) - i * 10) / 30));
                const localV = getEase("elastic.out(1, 0.5)")(localT);
                return <span style={{ ...LYRIC_STYLE, fontSize: 100, transform: `scale(${localV})`, opacity: localV }}>{char}</span>;
            }} />
        </Wrapper>
    );
};

// --- 39. Skew Velocity Motion ---
const MvSkewVelocity: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 45) / 45;
    const vel = Math.sin(t * Math.PI) * 45;
    return (
        <Wrapper>
            <div style={{ ...LYRIC_STYLE, transform: `skewX(${vel}deg) translateX(${Math.sin(t * Math.PI) * 200}px)` }}>疾</div>
        </Wrapper>
    );
};

// --- 40. 3D Flippy Snap ---
const Mv3DFlippy: React.FC = () => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("back.out(2)")(t);
    return (
        <Wrapper>
            <div style={{ 
                ...LYRIC_STYLE, 
                transform: `perspective(800px) rotateX(${(1-v)*720}deg) rotateY(${(1-v)*360}deg) scale(${v})`,
                opacity: v
            }}>極</div>
        </Wrapper>
    );
};

export const MvLyricTypographyCatalog: React.FC = () => {
    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#000', padding: 20, 
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', 
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

            <MvMorphShape />
            <MvShatter />
            <MvMotionBlurFlip />
            <MvElasticGrid />
            <MvLiquid />
            <MvSwiftSwap />
            <MvGravityDrop />
            <MvTunnel />
            <MvStrobe />
            <MvOutlineDraw />
            <MvSlice />
            <MvWhirl />
            <MvHologram />
            <MvBezier />
            <MvDepth />

            <MvExplosiveScatter />
            <MvCylinderRoll />
            <MvGlitchDisp />
            <MvNeonPath />
            <MvMagneticText />
            <MvShatterFall />
            <MvEchoBlur />
            <MvScaleWave />
            <MvSkewVelocity />
            <Mv3DFlippy />
        </AbsoluteFill>
    );
};
