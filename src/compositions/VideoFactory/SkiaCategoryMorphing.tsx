import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Group, Fill, Circle, Path, Paint, Blur, ColorMatrix, Skia, vec } from '@shopify/react-native-skia';

// --- 1. Liquid Blob Morph (Meta-balls) ---
const LiquidBlobMorph: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    
    // ColorMatrix for alpha thresholding (creates the meta-ball sticky effect)
    const thresholdMatrix = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 60, -30,
    ];

    return (
        <Group>
            <Fill color="#05001a" />
            <Group layer={
                <Paint>
                    <Blur blur={25} />
                    <ColorMatrix matrix={thresholdMatrix} />
                </Paint>
            }>
                <Circle cx={width/2} cy={height/2} r={120} color="#ff0088" />
                {[...Array(5)].map((_, i) => {
                    const angle = (frame * 0.05) + (i * Math.PI * 2 / 5);
                    const r = 100 + Math.sin(frame * 0.1 + i) * 60;
                    const cx = width/2 + Math.cos(angle) * r;
                    const cy = height/2 + Math.sin(angle) * r;
                    return <Circle key={i} cx={cx} cy={cy} r={60 + Math.sin(frame*0.05)*20} color="#00ffff" />;
                })}
            </Group>
        </Group>
    );
};

// --- 2. Geometric Transition ---
const GeometricTransition: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    
    const path = useMemo(() => {
        const sides = 3 + Math.floor((frame / 30) % 6);
        const nextSides = 3 + Math.floor(((frame + 30) / 30) % 6);
        const progress = (frame % 30) / 30; // 0 to 1
        
        const p = Skia.Path.Make();
        const r = 300;
        const center = vec(width/2, height/2);
        
        // Simulating morphing by drawing points that smoothly transition
        const maxPoints = 24; 
        for(let i=0; i<maxPoints; i++) {
            const t = i / maxPoints;
            const angle1 = Math.floor(t * sides) * (Math.PI*2/sides) - Math.PI/2;
            const angle2 = Math.floor(t * nextSides) * (Math.PI*2/nextSides) - Math.PI/2;
            
            const a = angle1 * (1-progress) + angle2 * progress;
            const dist = r + Math.sin(frame*0.1 + i)*20;
            const x = center.x + Math.cos(a)*dist;
            const y = center.y + Math.sin(a)*dist;
            
            if(i === 0) p.moveTo(x,y);
            else p.lineTo(x,y);
        }
        p.close();
        return p;
    }, [frame, width, height]);

    return (
        <Group>
            <Fill color="#000" />
            <Path path={path} style="stroke" strokeWidth={15} color="#00ff88">
                <Paint><Blur blur={20} /></Paint>
            </Path>
            <Path path={path} style="stroke" strokeWidth={3} color="#ffffff" />
        </Group>
    );
};

// --- 3. Audio Waveform (Simulated) ---
const AudioWaveform: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const path = useMemo(() => {
        const p = Skia.Path.Make();
        const segments = 100;
        for(let i=0; i<=segments; i++){
            const x = (i/segments) * width;
            // Add multiple sine waves to simulate complex audio
            let yOffset = Math.sin(i*0.1 + frame*0.2) * 50;
            yOffset += Math.sin(i*0.3 - frame*0.5) * 30;
            yOffset += Math.sin(i*0.5 + frame*0.8) * 15;
            // Taper edges
            const taper = Math.sin((i/segments) * Math.PI);
            
            const y = height/2 + yOffset * taper * 3;
            if(i === 0) p.moveTo(x,y);
            else p.lineTo(x,y);
        }
        return p;
    }, [frame, width, height]);

    return (
        <Group>
            <Fill color="#100520" />
            <Path path={path} style="stroke" strokeWidth={20} color="#ff00ff">
                <Paint><Blur blur={30} /></Paint>
            </Path>
            <Path path={path} style="stroke" strokeWidth={4} color="#00ffff" />
            <Path path={path} style="stroke" strokeWidth={1} color="#ffffff" />
        </Group>
    );
};

// --- 4. Organic Tentacles ---
const OrganicTentacles: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#001510" />
            {[...Array(8)].map((_, i) => {
                const p = Skia.Path.Make();
                const startX = width/2;
                const startY = height;
                p.moveTo(startX, startY);
                let currentX = startX;
                let currentY = startY;
                for(let j=0; j<10; j++) {
                    currentY -= height/10;
                    currentX += Math.sin(frame*0.02 + i*0.5 + j*0.3) * 60 * (j/10);
                    p.lineTo(currentX, currentY);
                }
                return (
                    <Group key={i}>
                        <Path path={p} style="stroke" strokeWidth={25 - i*2} color={`hsla(${(120 + i*15 + frame)%360}, 100%, 50%, 0.6)`}>
                            <Paint><Blur blur={15} /></Paint>
                        </Path>
                        <Path path={p} style="stroke" strokeWidth={4} color="#ffffff" opacity={0.8} />
                    </Group>
                );
            })}
        </Group>
    );
};

// --- 5. Elastic Bands ---
const ElasticBands: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#1a0500" />
            {[...Array(12)].map((_, i) => {
                const y = (height/12) * i + height/24;
                const progress = (Math.sin(frame*0.05 + i*0.2) + 1) / 2;
                // Elastic easing simulation
                const pullX = width/2 + Math.sin(progress * Math.PI * 4) * 300 * Math.exp(-progress * 3);
                
                const p = Skia.Path.Make();
                p.moveTo(0, y);
                p.quadTo(pullX, y + Math.sin(frame*0.1)*50, width, y);
                
                return (
                    <Path key={i} path={p} style="stroke" strokeWidth={8} color="#ff5500">
                        <Paint><Blur blur={progress * 10} /></Paint>
                    </Path>
                );
            })}
        </Group>
    );
};

export const MORPHING_EFFECTS = [
    { name: 'LIQUID BLOB', comp: LiquidBlobMorph, accent: '#00ffff' },
    { name: 'GEOMETRIC TRANS', comp: GeometricTransition, accent: '#00ff88' },
    { name: 'AUDIO WAVEFORM', comp: AudioWaveform, accent: '#ff00ff' },
    { name: 'ORGANIC TENTACLE', comp: OrganicTentacles, accent: '#aaff00' },
    { name: 'ELASTIC BANDS', comp: ElasticBands, accent: '#ff5500' },
];
