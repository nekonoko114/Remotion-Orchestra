import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';
import { getEase } from './MvLyricTypographyCatalog';

// --- Types ---
/**
 * 3枚画像アニメーション・パーツの共通インターフェース
 */
export interface TripleImageProps {
    /** 1枚目の画像パス */
    imgA: string;
    /** 2枚目の画像パス */
    imgB: string;
    /** 3枚目の画像パス */
    imgC: string;
}

// --- Defaults for Catalog ---
const DEFAULT_IMG_A = staticFile("assets/images-01/karaindaisuki.png");
const DEFAULT_IMG_B = staticFile("assets/images-01/tsuregumi1228.jpg");
const DEFAULT_IMG_C = staticFile("assets/images-01/l5332541-02.png");

const EFFECT_STYLE: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

// --- Helpers ---
/**
 * 演出のラッパー（枠線とラベルを表示）
 */
export const Wrapper: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', border: '1px solid #444', position: 'relative', overflow: 'hidden' }}>
        {children}
        <div style={{ position: 'absolute', bottom: 5, right: 5, fontSize: 10, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1px 3px', pointerEvents: 'none', zIndex: 100 }}>
            {label}
        </div>
    </div>
);

/**
 * Canvas演出用の画像ロードフック
 */
export const useImg = (src: string) => {
    const [img, setImg] = React.useState<HTMLImageElement | null>(null);
    React.useEffect(() => {
        const i = new Image();
        i.src = src;
        i.onload = () => setImg(i);
    }, [src]);
    return img;
};

/**
 * SVGフィルター定義（演出で使用）
 */
export const CatalogFilters: React.FC = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
            <filter id="glitch-heavy">
                <feTurbulence type="fractalNoise" baseFrequency="0.9 0.1" numOctaves="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="liquid-deep">
                <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="3" result="wave" />
                <feDisplacementMap in="SourceGraphic" in2="wave" scale="60" />
            </filter>
        </defs>
    </svg>
);

// --- Effect Components (1-30) ---

// 1. Triple Flash
export const MvTripleFlash: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const cycle = Math.floor(frame / 5) % 3;
    const imgs = [imgA, imgB, imgC];
    return <Wrapper label="Triple Flash"><Img src={imgs[cycle]} style={EFFECT_STYLE} /></Wrapper>;
};

// 2. Slide Orchestra
export const MvSlideOrchestra: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const vB = getEase("power4.out")(Math.max(0, Math.min(1, (t - 0.1) / 0.4)));
    const vC = getEase("power4.out")(Math.max(0, Math.min(1, (t - 0.3) / 0.4)));
    return (
        <Wrapper label="Slide Orchestra">
            <Img src={imgA} style={EFFECT_STYLE} />
            <Img src={imgB} style={{ ...EFFECT_STYLE, position: 'absolute', transform: `translateX(${(1 - vB) * -100}%)`, boxShadow: '10px 0 30px rgba(0,0,0,0.5)' }} />
            <Img src={imgC} style={{ ...EFFECT_STYLE, position: 'absolute', transform: `translateX(${(1 - vC) * 100}%)`, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }} />
        </Wrapper>
    );
};

// 3. Crossfade Dream
export const MvCrossfadeDream: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const opA = interpolate(t, [0, 0.3, 0.6], [1, 0, 0], { extrapolateRight: 'clamp' });
    const opB = interpolate(t, [0, 0.3, 0.6, 0.9], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
    const opC = interpolate(t, [0.6, 0.9, 1], [0, 1, 1], { extrapolateRight: 'clamp' });
    return (
        <Wrapper label="Crossfade Dream">
            <Img src={imgA} style={{ ...EFFECT_STYLE, opacity: opA, transform: `scale(${1 + t * 0.1})` }} />
            <Img src={imgB} style={{ ...EFFECT_STYLE, position: 'absolute', opacity: opB, transform: `scale(${1.1 - t * 0.1})` }} />
            <Img src={imgC} style={{ ...EFFECT_STYLE, position: 'absolute', opacity: opC, transform: `scale(${1 + (t-0.6) * 0.2})` }} />
        </Wrapper>
    );
};

// 4. Tile Parallax
export const MvTileParallax: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const offA = (t - 0.5) * 50;
    const offB = (t - 0.5) * 150;
    const offC = (t - 0.5) * 300;
    return (
        <Wrapper label="Tile Parallax">
            <Img src={imgA} style={{ ...EFFECT_STYLE, transform: `scale(1.3) translate(${offA}px, 0)` }} />
            <AbsoluteFill style={{ overflow: 'hidden' }}>
                 <Img src={imgB} style={{ ...EFFECT_STYLE, width: '70%', height: '70%', left: '15%', top: '15%', position: 'absolute', transform: `translate(${offB}px, 10px)`, border: '2px solid #fff', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }} />
            </AbsoluteFill>
            <Img src={imgC} style={{ position: 'absolute', width: '50%', height: '50%', right: 20, bottom: 20, transform: `translate(${offC}px, 0)`, border: '4px solid #fff', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }} />
        </Wrapper>
    );
};

// 5. Particle Assembly
export const MvParticleAssembly: React.FC<TripleImageProps> = ({ imgA, imgB }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    return (
        <Wrapper label="Particle Assembly">
            <Img src={t < 0.5 ? imgA : imgB} style={{ ...EFFECT_STYLE, filter: `blur(${Math.sin(t * Math.PI) * 40}px) contrast(${1 + Math.sin(t * Math.PI) * 5})` }} />
        </Wrapper>
    );
};

// 6. Bounce Reaction
export const MvBounceReaction: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const vA = getEase("back.out(3)")(Math.max(0, Math.min(1, t * 2.5)));
    const vB = getEase("back.out(3)")(Math.max(0, Math.min(1, (t - 0.15) * 2.5)));
    const vC = getEase("back.out(3)")(Math.max(0, Math.min(1, (t - 0.3) * 2.5)));
    return (
        <Wrapper label="Bounce Reaction">
            <div style={{ display: 'flex', width: '100%', height: '100%', gap: 4 }}>
                <Img src={imgA} style={{ ...EFFECT_STYLE, width: '33.3%', transform: `scale(${vA})` }} />
                <Img src={imgB} style={{ ...EFFECT_STYLE, width: '33.3%', transform: `scale(${vB})` }} />
                <Img src={imgC} style={{ ...EFFECT_STYLE, width: '33.3%', transform: `scale(${vC})` }} />
            </div>
        </Wrapper>
    );
};

// 7. Spin Carousel
export const MvSpinCarousel: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const angle = t * 360;
    return (
        <Wrapper label="Spin Carousel">
            <div style={{ perspective: 1200, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 600, height: 800, transformStyle: 'preserve-3d', transform: `rotateY(${angle}deg) rotateX(10deg)` }}>
                    <Img src={imgA} style={{ position: 'absolute', width: '100%', height: '100%', transform: `translateZ(500px)`, objectFit: 'cover', border: '1px solid #fff' }} />
                    <Img src={imgB} style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotateY(120deg) translateZ(500px)`, objectFit: 'cover', border: '1px solid #fff' }} />
                    <Img src={imgC} style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotateY(240deg) translateZ(500px)`, objectFit: 'cover', border: '1px solid #fff' }} />
                </div>
            </div>
        </Wrapper>
    );
};

// 8. Zoom Future
export const MvZoomFuture: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const zoom = interpolate(t, [0, 0.45, 0.55, 1], [1, 4, 0.2, 1], { extrapolateRight: 'clamp' });
    const imgIndex = Math.floor(t * 3) % 3;
    const imgs = [imgA, imgB, imgC];
    return <Wrapper label="Zoom Future"><Img src={imgs[imgIndex]} style={{ ...EFFECT_STYLE, transform: `scale(${zoom})` }} /></Wrapper>;
};

// 9. Mirror Dimension
export const MvMirrorDimension: React.FC<TripleImageProps> = ({ imgA }) => (
    <Wrapper label="Mirror Dimension">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '100%', height: '100%' }}>
            <Img src={imgA} style={{ ...EFFECT_STYLE, transform: 'scaleX(-1)' }} />
            <Img src={imgA} style={EFFECT_STYLE} />
            <Img src={imgA} style={{ ...EFFECT_STYLE, transform: 'scale(-1)' }} />
            <Img src={imgA} style={{ ...EFFECT_STYLE, transform: 'scaleY(-1)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,170,255,0.2)', mixBlendMode: 'overlay' }} />
    </Wrapper>
);

// 10. Masking Reveal
export const MvMaskingReveal: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("expo.inOut")(t);
    return (
        <Wrapper label="Masking Reveal">
            <Img src={imgA} style={EFFECT_STYLE} />
            <div style={{ position: 'absolute', inset: 0, clipPath: `circle(${v * 100}% at 50% 50%)`, zIndex: 2 }}><Img src={imgB} style={EFFECT_STYLE} /></div>
            <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(0 0, ${v * 100}% 0, ${v * 100}% 100%, 0 100%)`, zIndex: 3, opacity: v > 0.5 ? 1 : 0 }}><Img src={imgC} style={EFFECT_STYLE} /></div>
        </Wrapper>
    );
};

// 11. Prism Slice 3D
export const MvPrismSlice: React.FC<TripleImageProps> = ({ imgA, imgB }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.inOut")(t);
    return (
        <Wrapper label="Prism Slice 3D">
            <div style={{ display: 'flex', width: '100%', height: '100%', perspective: 1000 }}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ 
                        flex: 1, overflow: 'hidden', position: 'relative',
                        transform: `translateZ(${Math.sin(t * Math.PI + i) * 100}px) translateY(${i % 2 === 0 ? (1-v)*120 : (v-1)*120}%) rotateY(${(1-v)*20}deg)`,
                        opacity: v, borderLeft: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <Img src={imgB} style={{ ...EFFECT_STYLE, width: '800%', left: `-${i * 100}%`, position: 'absolute' }} />
                    </div>
                ))}
            </div>
            <AbsoluteFill style={{ opacity: 1 - v }}><Img src={imgA} style={EFFECT_STYLE} /></AbsoluteFill>
        </Wrapper>
    );
};

// 12. Pulse Scanner RGB
export const MvPulseScanner: React.FC<TripleImageProps> = ({ imgA, imgB }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const scanX = t * 100;
    return (
        <Wrapper label="Pulse Scanner RGB">
            <Img src={imgA} style={EFFECT_STYLE} />
            <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - scanX}% 0 0)` }}>
                <Img src={imgB} style={{ ...EFFECT_STYLE, filter: `contrast(1.2)` }} />
                <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', transform: 'translateX(3px)', opacity: 0.5 }}><Img src={imgB} style={{ ...EFFECT_STYLE, filter: 'hue-rotate(90deg)' }} /></div>
            </div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${scanX}%`, width: 10, backgroundColor: '#fff', boxShadow: '0 0 30px #0ff, 0 0 10px #fff', zIndex: 10 }} />
        </Wrapper>
    );
};

// 13. Tornado Fragments
export const MvTornadoSwirl: React.FC<TripleImageProps> = ({ imgA, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const v = getEase("expo.inOut")(t);
    return (
        <Wrapper label="Tornado Fragments">
            <Img src={imgA} style={{ ...EFFECT_STYLE, transform: `scale(${1 - v}) rotate(${v * 720}deg)`, opacity: 1 - v, filter: `blur(${v * 20}px)` }} />
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)' }}>
                {[...Array(16)].map((_, i) => (
                    <div key={i} style={{ 
                        position: 'relative', overflow: 'hidden', 
                        transform: `scale(${v}) rotate(${v * -360 + i * 20}deg) translateZ(${v * 200}px)`,
                        opacity: v
                    }}>
                        <Img src={imgC} style={{ ...EFFECT_STYLE, width: '400%', height: '400%', left: `-${(i%4)*100}%`, top: `-${Math.floor(i/4)*100}%`, position: 'absolute' }} />
                    </div>
                ))}
            </div>
        </Wrapper>
    );
};

// 14. Card Flip Deep 3D
export const MvCardFlip3D: React.FC<TripleImageProps> = ({ imgA, imgB }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const rot = interpolate(t, [0, 0.45, 0.55, 1], [0, 180, 180, 360], { extrapolateRight: 'clamp' });
    return (
        <Wrapper label="Card Flip Deep 3D">
            <div style={{ perspective: 1500, width: '100%', height: '100%' }}>
                <div style={{ width: '100%', height: '100%', transform: `rotateY(${rot}deg)`, transformStyle: 'preserve-3d', transition: 'none' }}>
                    <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}><Img src={imgA} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                        <Img src={imgB} style={EFFECT_STYLE} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)' }} />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

// 15. 3D Stripe Blind
export const MvStripeReveal: React.FC<TripleImageProps> = ({ imgA, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.inOut")(t);
    return (
        <Wrapper label="3D Stripe Blind">
            <Img src={imgA} style={EFFECT_STYLE} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', perspective: 1000 }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} style={{ 
                        flex: 1, height: '100%', overflow: 'hidden', position: 'relative',
                        transform: `rotateX(${v * 180}deg) translateZ(${v * 50}px)`,
                        transformOrigin: 'center', opacity: v, transition: 'none'
                    }}>
                        <Img src={imgC} style={{ ...EFFECT_STYLE, width: '1200%', left: `-${i * 100}%`, position: 'absolute' }} />
                    </div>
                ))}
            </div>
        </Wrapper>
    );
};

// 16. Ripple Radial Wave
export const MvRadialExpansion: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    return (
        <Wrapper label="Ripple Radial Wave">
            <Img src={imgA} style={EFFECT_STYLE} />
            {[...Array(3)].map((_, i) => {
                const v = getEase("power2.out")(Math.max(0, Math.min(1, t * 1.5 - i * 0.2)));
                return (
                    <div key={i} style={{ 
                        position: 'absolute', inset: 0, 
                        clipPath: `circle(${v * 120}% at 50% 50%)`,
                        zIndex: 10 - i, opacity: 1 - i * 0.3
                    }}>
                        <Img src={i === 2 ? imgB : imgC} style={{ ...EFFECT_STYLE, filter: `brightness(${1 + i * 0.5})` }} />
                    </div>
                );
            })}
        </Wrapper>
    );
};

// 17. Displacement Glitch Heavy
export const MvGlitchTransition: React.FC<TripleImageProps> = ({ imgA, imgB }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const intensity = Math.sin(t * Math.PI) * 50;
    return (
        <Wrapper label="Displacement Glitch">
            <CatalogFilters />
            <div style={{ width: '100%', height: '100%', filter: `url(#glitch-heavy)` }}>
                <Img src={t < 0.5 ? imgA : imgB} style={{ ...EFFECT_STYLE, transform: `translateX(${(Math.random()-0.5)*intensity}px)` }} />
            </div>
            {t > 0.4 && t < 0.6 && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#fff', opacity: 0.3, mixBlendMode: 'overlay' }} />}
        </Wrapper>
    );
};

// 18. Organic Liquid Wave
export const MvLiquidDistortion: React.FC<TripleImageProps> = ({ imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    return (
        <Wrapper label="Organic Liquid">
            <CatalogFilters />
            <div style={{ width: '100%', height: '100%', filter: `url(#liquid-deep)` }}>
                <Img src={t < 0.5 ? imgB : imgC} style={{ ...EFFECT_STYLE, transform: `scale(${1 + Math.sin(t * Math.PI) * 0.1})` }} />
            </div>
        </Wrapper>
    );
};

// 19. 3D Dynamic Photo Cube
export const MvFloatingCubes: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    return (
        <Wrapper label="3D Photo Cube">
            <Img src={imgA} style={{ ...EFFECT_STYLE, filter: 'blur(5px) brightness(0.5)' }} />
            <div style={{ perspective: 1000, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ 
                    width: 600, height: 600, transformStyle: 'preserve-3d', 
                    transform: `rotateX(${t * 360}deg) rotateY(${t * 720}deg) translateZ(${Math.sin(t * Math.PI * 2) * 100}px)`
                }}>
                    <div style={{ position: 'absolute', width: 600, height: 600, transform: 'translateZ(300px)', border: '1px solid #fff' }}><Img src={imgA} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 600, height: 600, transform: 'rotateY(90deg) translateZ(300px)', border: '1px solid #fff' }}><Img src={imgB} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 600, height: 600, transform: 'rotateY(180deg) translateZ(300px)', border: '1px solid #fff' }}><Img src={imgC} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 600, height: 600, transform: 'rotateY(-90deg) translateZ(300px)', border: '1px solid #fff' }}><Img src={imgA} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 600, height: 600, transform: 'rotateX(90deg) translateZ(300px)', border: '1px solid #fff' }}><Img src={imgB} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 600, height: 600, transform: 'rotateX(-90deg) translateZ(300px)', border: '1px solid #fff' }}><Img src={imgC} style={EFFECT_STYLE} /></div>
                </div>
            </div>
        </Wrapper>
    );
};

// 20. 3D Hexagon Folding Grid
export const MvHexagonExpanding: React.FC<TripleImageProps> = ({ imgA, imgB }) => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    return (
        <Wrapper label="3D Hexagon Fold">
            <Img src={imgA} style={EFFECT_STYLE} />
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 5, padding: 10, perspective: 1000 }}>
                {[...Array(12)].map((_, i) => {
                    const delay = (i % 4) * 0.1 + Math.floor(i / 4) * 0.1;
                    const v = getEase("back.out(1.7)")(Math.max(0, Math.min(1, (t - delay) * 2)));
                    return (
                        <div key={i} style={{ 
                            position: 'relative', overflow: 'hidden', 
                            transform: `rotateY(${v * 180}deg) scale(${v})`, transformStyle: 'preserve-3d',
                            opacity: v
                        }}>
                             <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                                <Img src={imgB} style={{ ...EFFECT_STYLE, width: '400%', height: '300%', left: `-${(i%4)*100}%`, top: `-${Math.floor(i/4)*100}%`, position: 'absolute' }} />
                             </div>
                        </div>
                    );
                })}
            </div>
        </Wrapper>
    );
};

// 21. Sonic Boom
export const MvSonicBoom: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const cycle = frame % 3;
    const imgs = [imgA, imgB, imgC];
    const isFlash = frame % 10 === 0;
    return (
        <Wrapper label="Sonic Boom">
            <Img src={imgs[cycle]} style={{ ...EFFECT_STYLE, filter: isFlash ? 'brightness(3) contrast(1.5)' : 'none' }} />
            {isFlash && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#fff', opacity: 0.4 }} />}
        </Wrapper>
    );
};

// 22. Kaleidoscope Infinity
export const MvKaleidoscopeInfinity: React.FC<TripleImageProps> = ({ imgB }) => {
    const frame = useCurrentFrame();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const img = useImg(imgB);
    const t = (frame % 180) / 180;
    const zoom = 1 + t * 4;

    React.useEffect(() => {
        if (!canvasRef.current || !img) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        for (let i = 0; i < 12; i++) {
            ctx.rotate((Math.PI * 2) / 12);
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.restore();
        }
        ctx.restore();
    }, [img, zoom]);

    return (
        <Wrapper label="Kaleidoscope Infinity">
            <canvas ref={canvasRef} width={1080} height={1080} style={EFFECT_STYLE} />
        </Wrapper>
    );
};

// 23. Spiral Dive
export const MvSpiralDive: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const v = getEase("back.inOut(1.5)")(t);
    return (
        <Wrapper label="Spiral Dive">
            <Img src={imgA} style={{ ...EFFECT_STYLE, transform: `scale(${1 + t * 0.2})` }} />
            <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Img src={imgB} style={{ 
                    position: 'absolute', width: '70%', height: '70%',
                    transform: `rotate(${v * 1080}deg) scale(${t < 0.5 ? v * 2 : 0}) translateZ(${v * 200}px)`,
                    opacity: t < 0.5 ? 1 : 0, border: '4px solid #fff', boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                }} />
                <Img src={imgC} style={{ 
                    position: 'absolute', width: '70%', height: '70%',
                    transform: `rotate(${v * -1080}deg) scale(${t > 0.5 ? (v-0.5)*2 : 0}) translateZ(${(1-v) * 200}px)`,
                    opacity: t > 0.5 ? 1 : 0, border: '4px solid #fff', boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                }} />
            </AbsoluteFill>
        </Wrapper>
    );
};

// 24. Pixel Cascade
export const MvPixelCascade: React.FC<TripleImageProps> = ({ imgA, imgB }) => {
    const frame = useCurrentFrame();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const imgDataA = useImg(imgA);
    const imgDataB = useImg(imgB);
    const t = (frame % 120) / 120;

    React.useEffect(() => {
        if (!canvasRef.current || !imgDataA || !imgDataB) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);
        
        if (t < 0.5) {
            const v = t * 2;
            ctx.drawImage(imgDataA, 0, 0, width, height);
            ctx.fillStyle = '#000';
            for (let i = 0; i < 20; i++) {
                const h = (v * height) + Math.sin(i * 0.5 + frame * 0.1) * 30;
                ctx.fillRect(i * (width/20), 0, width/20, h);
            }
        } else {
            const v = (t - 0.5) * 2;
            ctx.drawImage(imgDataB, 0, 0, width, height);
            ctx.fillStyle = '#000';
            for (let i = 0; i < 20; i++) {
                const h = ((1-v) * height) + Math.cos(i * 0.5 + frame * 0.1) * 30;
                ctx.fillRect(i * (width/20), h, width/20, height - h);
            }
        }
    }, [imgDataA, imgDataB, t, frame]);

    return (
        <Wrapper label="Pixel Cascade">
            <canvas ref={canvasRef} width={1080} height={1080} style={EFFECT_STYLE} />
        </Wrapper>
    );
};

// 25. Triple Mirror Reflection
export const MvTripleMirrorReflection: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const shakeA = Math.sin(frame * 0.8) * 10;
    const shakeB = Math.cos(frame * 1.2) * 15;
    const shakeC = Math.sin(frame * 0.5) * 20;
    const scale = 1 + Math.sin(t * Math.PI) * 0.1;
    return (
        <Wrapper label="Triple Mirror Reflection">
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <div style={{ flex: 1, overflow: 'hidden', transform: `translateY(${shakeB}px) scale(${scale})` }}>
                    <Img src={imgB} style={{ ...EFFECT_STYLE, width: '300%', left: '-100%', position: 'relative' }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden', borderLeft: '2px solid #fff', borderRight: '2px solid #fff', transform: `translateY(${shakeA}px) scale(${scale * 1.1})` }}>
                    <Img src={imgA} style={{ ...EFFECT_STYLE, width: '300%', left: '-100%', position: 'relative' }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden', transform: `translateY(${shakeC}px) scale(${scale})` }}>
                    <Img src={imgC} style={{ ...EFFECT_STYLE, width: '300%', left: '-100%', position: 'relative' }} />
                </div>
            </div>
        </Wrapper>
    );
};

// 26. Rhythmic Shakedown
export const MvRhythmicShakedown: React.FC<TripleImageProps> = ({ imgA }) => {
    const frame = useCurrentFrame();
    const peak = Math.sin(frame * 0.4) > 0.7;
    const dx = peak ? (Math.random() - 0.5) * 60 : 0;
    const dy = peak ? (Math.random() - 0.5) * 60 : 0;
    const blur = peak ? 15 : 0;
    return (
        <Wrapper label="Rhythmic Shakedown">
            <Img src={imgA} style={{ ...EFFECT_STYLE, transform: `translate(${dx}px, ${dy}px) scale(${peak ? 1.2 : 1})`, filter: `blur(${blur}px) contrast(${peak ? 1.5 : 1})` }} />
            {peak && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.2)', mixBlendMode: 'overlay' }} />}
        </Wrapper>
    );
};

// 27. Time Slip Warp
export const MvTimeSlipWarp: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const v = getEase("power4.inOut")(t);
    const z = interpolate(v, [0, 0.5, 1], [0, -1000, -2000]);
    return (
        <Wrapper label="Time Slip Warp">
            <div style={{ perspective: 1000, width: '100%', height: '100%' }}>
                <div style={{ width: '100%', height: '100%', transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', transform: 'translateZ(0px)' }}>
                         <Img src={imgA} style={EFFECT_STYLE} />
                    </div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', transform: 'translateZ(1000px)' }}>
                         <Img src={imgB} style={EFFECT_STYLE} />
                    </div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', transform: 'translateZ(2000px)' }}>
                         <Img src={imgC} style={EFFECT_STYLE} />
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none' }} />
        </Wrapper>
    );
};

// 28. Fractal Unfolding
export const MvFractalUnfold: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const v1 = getEase("expo.out")(Math.max(0, Math.min(1, t * 2.5)));
    const v2 = getEase("expo.out")(Math.max(0, Math.min(1, (t - 0.4) * 2.5)));
    return (
        <Wrapper label="Fractal Unfold">
            <Img src={imgA} style={EFFECT_STYLE} />
            <div style={{ position: 'absolute', inset: 0, clipPath: `circle(${v1 * 120}% at 50% 50%)` }}>
                <Img src={imgB} style={EFFECT_STYLE} />
                <div style={{ position: 'absolute', inset: 0, clipPath: `circle(${v2 * 120}% at 50% 50%)` }}>
                    <Img src={imgC} style={EFFECT_STYLE} />
                </div>
            </div>
        </Wrapper>
    );
};

// 29. Graphic Glitch Trio
export const MvGraphicGlitchTrio: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const imgPath = frame % 90 < 30 ? imgA : frame % 90 < 60 ? imgB : imgC;
    const imgData = useImg(imgPath);

    React.useEffect(() => {
        if (!canvasRef.current || !imgData) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);
        
        ctx.save();
        if (Math.random() > 0.8) {
            ctx.translate((Math.random() - 0.5) * 40, 0);
            ctx.scale(1.1, 1);
        }
        ctx.drawImage(imgData, 0, 0, width, height);
        
        // Scanlines
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < height; i += 4) {
             ctx.fillRect(0, i + (frame % 4), width, 1);
        }

        // Color blocks
        if (Math.random() > 0.9) {
            ctx.fillStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.3)`;
            ctx.fillRect(Math.random()*width, Math.random()*height, 100, 20);
        }
        ctx.restore();
    }, [imgData, frame]);

    return (
        <Wrapper label="Graphic Glitch Trio">
            <canvas ref={canvasRef} width={1080} height={1080} style={EFFECT_STYLE} />
        </Wrapper>
    );
};

// 30. Heartbeat Sync
export const MvHeartbeatSync: React.FC<TripleImageProps> = ({ imgA, imgB, imgC }) => {
    const frame = useCurrentFrame();
    const t = (frame % 40) / 40;
    const beat = Math.pow(Math.sin(t * Math.PI), 8);
    const scale = 1 + beat * 0.3;
    const img = Math.floor(frame / 40) % 3 === 0 ? imgA : Math.floor(frame / 40) % 3 === 1 ? imgB : imgC;
    return (
        <Wrapper label="Heartbeat Sync">
            <Img src={img} style={{ ...EFFECT_STYLE, transform: `scale(${scale})`, filter: `saturate(${1 + beat * 5}) hue-rotate(${beat * 20}deg)` }} />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,0,0,0.1)', opacity: beat, pointerEvents: 'none' }} />
        </Wrapper>
    );
};

// --- Catalog Main ---

export const TripleImageEffectsCatalog: React.FC = () => {
    const props: TripleImageProps = {
        imgA: DEFAULT_IMG_A,
        imgB: DEFAULT_IMG_B,
        imgC: DEFAULT_IMG_C,
    };

    const effects = [
        { component: MvTripleFlash, name: "MvTripleFlash" },
        { component: MvSlideOrchestra, name: "MvSlideOrchestra" },
        { component: MvCrossfadeDream, name: "MvCrossfadeDream" },
        { component: MvTileParallax, name: "MvTileParallax" },
        { component: MvParticleAssembly, name: "MvParticleAssembly" },
        { component: MvBounceReaction, name: "MvBounceReaction" },
        { component: MvSpinCarousel, name: "MvSpinCarousel" },
        { component: MvZoomFuture, name: "MvZoomFuture" },
        { component: MvMirrorDimension, name: "MvMirrorDimension" },
        { component: MvMaskingReveal, name: "MvMaskingReveal" },
        { component: MvPrismSlice, name: "MvPrismSlice" },
        { component: MvPulseScanner, name: "MvPulseScanner" },
        { component: MvTornadoSwirl, name: "MvTornadoSwirl" },
        { component: MvCardFlip3D, name: "MvCardFlip3D" },
        { component: MvStripeReveal, name: "MvStripeReveal" },
        { component: MvRadialExpansion, name: "MvRadialExpansion" },
        { component: MvGlitchTransition, name: "MvGlitchTransition" },
        { component: MvLiquidDistortion, name: "MvLiquidDistortion" },
        { component: MvFloatingCubes, name: "MvFloatingCubes" },
        { component: MvHexagonExpanding, name: "MvHexagonExpanding" },
        { component: MvSonicBoom, name: "MvSonicBoom" },
        { component: MvKaleidoscopeInfinity, name: "MvKaleidoscopeInfinity" },
        { component: MvSpiralDive, name: "MvSpiralDive" },
        { component: MvPixelCascade, name: "MvPixelCascade" },
        { component: MvTripleMirrorReflection, name: "MvTripleMirrorReflection" },
        { component: MvRhythmicShakedown, name: "MvRhythmicShakedown" },
        { component: MvTimeSlipWarp, name: "MvTimeSlipWarp" },
        { component: MvFractalUnfold, name: "MvFractalUnfold" },
        { component: MvGraphicGlitchTrio, name: "MvGraphicGlitchTrio" },
        { component: MvHeartbeatSync, name: "MvHeartbeatSync" },
    ];

    const DURATION_PER_EFFECT = 60;
    const frame = useCurrentFrame();
    const effectIndex = Math.floor(frame / DURATION_PER_EFFECT) % effects.length;
    const currentEffect = effects[effectIndex];

    return (
        <AbsoluteFill style={{ 
            backgroundColor: '#000', padding: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ width: 1080, height: 1080 }}>
                <currentEffect.component {...props} />
            </div>
        </AbsoluteFill>
    );
};
