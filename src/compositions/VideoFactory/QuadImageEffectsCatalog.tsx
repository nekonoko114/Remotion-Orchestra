import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';
import { getEase } from './MvLyricTypographyCatalog';

// --- Types ---
export interface QuadImageProps {
    imgA: string;
    imgB: string;
    imgC: string;
    imgD: string;
}

// --- Defaults for Catalog ---
const DEFAULT_IMG_A = staticFile("assets/images-01/karaindaisuki.png");
const DEFAULT_IMG_B = staticFile("assets/images-01/tsuregumi1228.jpg");
const DEFAULT_IMG_C = staticFile("assets/images-01/l5332541-02.png");
const DEFAULT_IMG_D = staticFile("assets/images-01/haaaachan0927.jpeg");

const EFFECT_STYLE: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

// --- Helpers ---
export const Wrapper: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', border: '1px solid #444', position: 'relative', overflow: 'hidden' }}>
        {children}
        <div style={{ position: 'absolute', bottom: 5, right: 5, fontSize: 10, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '1px 3px', pointerEvents: 'none', zIndex: 100 }}>
            {label}
        </div>
    </div>
);

export const useImg = (src: string) => {
    const [img, setImg] = React.useState<HTMLImageElement | null>(null);
    React.useEffect(() => {
        const i = new Image();
        i.src = src;
        i.onload = () => setImg(i);
    }, [src]);
    return img;
};

// --- Effect Components (1-10) ---

// 1. Quad Flash
export const MvQuadFlash: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const cycle = Math.floor(frame / 5) % 4;
    const imgs = [imgA, imgB, imgC, imgD];
    return <Wrapper label="Quad Flash"><Img src={imgs[cycle]} style={EFFECT_STYLE} /></Wrapper>;
};

// 2. Grid 2x2 Reveal
export const MvGrid2x2Reveal: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.out")(t);
    return (
        <Wrapper label="Grid 2x2 Reveal">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '100%', height: '100%' }}>
                <div style={{ overflow: 'hidden', transform: `translate(${(1-v)*-100}%, ${(1-v)*-100}%)` }}><Img src={imgA} style={EFFECT_STYLE} /></div>
                <div style={{ overflow: 'hidden', transform: `translate(${(1-v)*100}%, ${(1-v)*-100}%)` }}><Img src={imgB} style={EFFECT_STYLE} /></div>
                <div style={{ overflow: 'hidden', transform: `translate(${(1-v)*-100}%, ${(1-v)*100}%)` }}><Img src={imgC} style={EFFECT_STYLE} /></div>
                <div style={{ overflow: 'hidden', transform: `translate(${(1-v)*100}%, ${(1-v)*100}%)` }}><Img src={imgD} style={EFFECT_STYLE} /></div>
            </div>
        </Wrapper>
    );
};

// 3. Quad Cube Rotate 3D
export const MvQuadCubeRotate: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const angle = t * 360;
    
    return (
        <Wrapper label="Quad Cube 3D">
            <div style={{ perspective: 1000, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 800, height: 800, transformStyle: 'preserve-3d', transform: `rotateY(${angle}deg) rotateX(15deg)` }}>
                    <div style={{ position: 'absolute', width: 800, height: 800, transform: 'translateZ(400px)', border: '1px solid #fff' }}><Img src={imgA} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 800, height: 800, transform: 'rotateY(90deg) translateZ(400px)', border: '1px solid #fff' }}><Img src={imgB} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 800, height: 800, transform: 'rotateY(180deg) translateZ(400px)', border: '1px solid #fff' }}><Img src={imgC} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', width: 800, height: 800, transform: 'rotateY(-90deg) translateZ(400px)', border: '1px solid #fff' }}><Img src={imgD} style={EFFECT_STYLE} /></div>
                </div>
            </div>
        </Wrapper>
    );
};

// 4. Quad Z-Stack Fly-through
export const MvQuadZStack: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const t = (frame % 120) / 120;
    const v = getEase("power2.in")(t);
    const z = interpolate(v, [0, 1], [0, -3000]);
    return (
        <Wrapper label="Quad Z-Stack">
            <div style={{ perspective: 1000, width: '100%', height: '100%', backgroundColor: '#000' }}>
                <div style={{ width: '100%', height: '100%', transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}>
                    <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(0px)' }}><Img src={imgA} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(1000px)' }}><Img src={imgB} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(2000px)' }}><Img src={imgC} style={EFFECT_STYLE} /></div>
                    <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(3000px)' }}><Img src={imgD} style={EFFECT_STYLE} /></div>
                </div>
            </div>
        </Wrapper>
    );
};

// 5. Spiral Quad Dive
export const MvSpiralQuadDive: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const t = (frame % 90) / 90;
    const v = getEase("back.in(2)")(t);
    const imgs = [imgA, imgB, imgC, imgD];
    return (
        <Wrapper label="Spiral Quad Dive">
            {imgs.map((src, i) => {
                const angle = i * 90 + v * 360;
                const scale = 1 - v;
                const op = 1 - v;
                return (
                    <Img key={i} src={src} style={{ 
                        ...EFFECT_STYLE, 
                        position: 'absolute', width: '50%', height: '50%',
                        transform: `rotate(${angle}deg) scale(${scale})`,
                        opacity: op,
                        zIndex: 10 - i
                    }} />
                );
            })}
             <Img src={imgA} style={{ ...EFFECT_STYLE, opacity: v }} />
        </Wrapper>
    );
};

export const CatalogFilters: React.FC = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
            <filter id="quad-glitch">
                <feTurbulence type="fractalNoise" baseFrequency="0.8 0.1" numOctaves="1" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
            </filter>
        </defs>
    </svg>
);

// 6. Quad Cross Mask
export const MvQuadCrossMask: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const t = (frame % 60) / 60;
    const v = getEase("power4.inOut")(t);
    return (
        <Wrapper label="Quad Cross Mask">
            <Img src={imgA} style={EFFECT_STYLE} />
            <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(0 0, ${v * 100}% 0, 0 ${v * 100}%)`, zIndex: 2 }}><Img src={imgB} style={EFFECT_STYLE} /></div>
            <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(100% 0, 100% ${v * 100}%, ${100 - v * 100}% 0)`, zIndex: 3 }}><Img src={imgC} style={EFFECT_STYLE} /></div>
            <div style={{ position: 'absolute', inset: 0, clipPath: `circle(${v * 70}% at 50% 50%)`, zIndex: 4 }}><Img src={imgD} style={EFFECT_STYLE} /></div>
        </Wrapper>
    );
};

// 7. Quad Glitch Matrix (Canvas)
export const MvQuadGlitchMatrix: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const imgs = [useImg(imgA), useImg(imgB), useImg(imgC), useImg(imgD)];
    const t = (frame % 60) / 60;

    React.useEffect(() => {
        if (!canvasRef.current || imgs.some(i => !i)) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);

        const gridSize = 4;
        const cellSizeW = width / gridSize;
        const cellSizeH = height / gridSize;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const imgIdx = (x + y + Math.floor(frame / 10)) % 4;
                const sourceImg = imgs[imgIdx] as HTMLImageElement;
                if (Math.random() > 0.9 && t > 0.4 && t < 0.6) {
                    ctx.fillStyle = `rgba(${Math.random()*255},0,0,0.5)`;
                    ctx.fillRect(x * cellSizeW, y * cellSizeH, cellSizeW, cellSizeH);
                } else {
                    ctx.drawImage(sourceImg, x * cellSizeW, y * cellSizeH, cellSizeW, cellSizeH, x * cellSizeW, y * cellSizeH, cellSizeW, cellSizeH);
                }
            }
        }
    }, [imgs, frame, t]);

    return (
        <Wrapper label="Quad Glitch Matrix">
            <CatalogFilters />
            <canvas ref={canvasRef} width={1080} height={1080} style={{ ...EFFECT_STYLE, filter: t > 0.4 && t < 0.6 ? 'url(#quad-glitch)' : 'none' }} />
        </Wrapper>
    );
};

// 8. Quad Radial Wave
export const MvQuadRadialWave: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const t = (frame % 80) / 80;
    const imgs = [imgA, imgB, imgC, imgD];
    return (
        <Wrapper label="Quad Radial Wave">
            <Img src={imgA} style={EFFECT_STYLE} />
            {imgs.map((src, i) => {
                const v = getEase("power2.out")(Math.max(0, Math.min(1, t * 2 - i * 0.25)));
                return (
                    <div key={i} style={{ 
                        position: 'absolute', inset: 0, 
                        clipPath: `circle(${v * 150}% at 50% 50%)`,
                        zIndex: i + 2, opacity: 1
                    }}>
                        <Img src={src} style={EFFECT_STYLE} />
                    </div>
                );
            })}
        </Wrapper>
    );
};

// 9. Quad Mirror Kaleido (Canvas)
export const MvQuadMirrorKaleido: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const imgs = [useImg(imgA), useImg(imgB), useImg(imgC), useImg(imgD)];
    const t = (frame % 120) / 120;

    React.useEffect(() => {
        if (!canvasRef.current || imgs.some(i => !i)) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(t * Math.PI * 2);
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(imgs[i] as HTMLImageElement, -width / 2, -height / 2, width / 2, height / 2);
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(imgs[i] as HTMLImageElement, -width / 2, -height / 2, width / 2, height / 2);
            ctx.restore();
        }
        ctx.restore();
    }, [imgs, t]);

    return (
        <Wrapper label="Quad Mirror Kaleido">
            <canvas ref={canvasRef} width={1080} height={1080} style={EFFECT_STYLE} />
        </Wrapper>
    );
};

// 10. Quad Heartbeat Sync
export const MvQuadHeartbeatSync: React.FC<QuadImageProps> = ({ imgA, imgB, imgC, imgD }) => {
    const frame = useCurrentFrame();
    const t = (frame % 40) / 40;
    const beat = Math.pow(Math.sin(t * Math.PI), 10);
    const scale = 1 + beat * 0.4;
    const imgIdx = Math.floor(frame / 40) % 4;
    const imgs = [imgA, imgB, imgC, imgD];
    return (
        <Wrapper label="Quad Heartbeat Sync">
            <Img src={imgs[imgIdx]} style={{ ...EFFECT_STYLE, transform: `scale(${scale})`, filter: `brightness(${1 + beat}) contrast(${1 + beat})` }} />
            <div style={{ position: 'absolute', inset: 0, border: `${beat * 50}px solid rgba(255,255,255,0.4)`, pointerEvents: 'none' }} />
        </Wrapper>
    );
};

// --- Catalog Component ---
export const QuadImageEffectsCatalog: React.FC = () => {
    const props: QuadImageProps = {
        imgA: DEFAULT_IMG_A,
        imgB: DEFAULT_IMG_B,
        imgC: DEFAULT_IMG_C,
        imgD: DEFAULT_IMG_D,
    };

    const effects = [
        { component: MvQuadFlash, name: "MvQuadFlash" },
        { component: MvGrid2x2Reveal, name: "MvGrid2x2Reveal" },
        { component: MvQuadCubeRotate, name: "MvQuadCubeRotate" },
        { component: MvQuadZStack, name: "MvQuadZStack" },
        { component: MvSpiralQuadDive, name: "MvSpiralQuadDive" },
        { component: MvQuadCrossMask, name: "MvQuadCrossMask" },
        { component: MvQuadGlitchMatrix, name: "MvQuadGlitchMatrix" },
        { component: MvQuadRadialWave, name: "MvQuadRadialWave" },
        { component: MvQuadMirrorKaleido, name: "MvQuadMirrorKaleido" },
        { component: MvQuadHeartbeatSync, name: "MvQuadHeartbeatSync" },
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
