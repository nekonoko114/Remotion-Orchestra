import React, { useState, useEffect, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from 'remotion';
import { Group, Fill, Text, TextPath, Skia, Paint, Blur, LinearGradient, vec, Mask, Rect } from '@shopify/react-native-skia';

// Hook to load font from URL
export const useSkiaFont = (url: string, size: number) => {
    const [font, setFont] = useState<any>(null);
    useEffect(() => {
        const handle = delayRender();
        fetch(url).then(res => res.arrayBuffer()).then(ab => {
            const data = Skia.Data.fromBytes(new Uint8Array(ab));
            const tf = Skia.Typeface.MakeFreeTypeFaceFromData(data);
            if (tf) setFont(Skia.Font(tf, size));
            continueRender(handle);
        }).catch(() => continueRender(handle));
    }, [url, size]);
    return font;
};

// --- 1. Text Path Follow ---
const TextPathFollow: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 100);

    const path = useMemo(() => {
        const p = Skia.Path.Make();
        p.moveTo(0, height/2);
        for(let x=0; x<=width; x+=50){
            p.lineTo(x, height/2 + Math.sin(x*0.01 + frame*0.05)*150);
        }
        return p;
    }, [frame, width, height]);

    if (!font) return null;

    return (
        <Group>
            <Fill color="#001525" />
            <TextPath font={font} path={path} text="   SKIA KINETIC TYPOGRAPHY IS AWESOME   " initialOffset={(frame * 5) % width}>
                <Paint>
                    <LinearGradient start={vec(0,0)} end={vec(width, height)} colors={['#00ffff', '#ff00ff']} />
                </Paint>
            </TextPath>
        </Group>
    );
};

// --- 2. Variable Stroke Title ---
const VariableStrokeTitle: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 200);

    if (!font) return null;
    const text = "STROKE";
    const textWidth = font.getTextWidth(text);
    const x = width/2 - textWidth/2;
    const y = height/2 + 70;
    const strokeW = 4 + Math.sin(frame*0.1)*20;

    return (
        <Group>
            <Fill color="#100500" />
            <Text font={font} text={text} x={x} y={y} color="rgba(255, 255, 255, 0.1)" />
            <Text font={font} text={text} x={x} y={y} style="stroke" strokeWidth={strokeW} color="#ffaa00" />
        </Group>
    );
};

// --- 3. Glowing Outline Text ---
const GlowingOutlineText: React.FC = () => {
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 250);

    if (!font) return null;
    const text = "NEON";
    const textWidth = font.getTextWidth(text);
    const x = width/2 - textWidth/2;
    const y = height/2 + 80;

    return (
        <Group>
            <Fill color="#050010" />
            {/* Multiple blur layers for realistic glow */}
            <Text font={font} text={text} x={x} y={y} style="stroke" strokeWidth={15} color="#ff00ff">
                <Paint><Blur blur={100} /></Paint>
            </Text>
            <Text font={font} text={text} x={x} y={y} style="stroke" strokeWidth={5} color="#ff00ff">
                <Paint><Blur blur={30} /></Paint>
            </Text>
            <Text font={font} text={text} x={x} y={y} style="stroke" strokeWidth={2} color="#ffffff">
                <Paint><Blur blur={5} /></Paint>
            </Text>
            <Text font={font} text={text} x={x} y={y} style="stroke" strokeWidth={1} color="#ffffff" />
        </Group>
    );
};

// --- 4. Shattered Text (Mask Clipping) ---
const ShatteredText: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 300);

    if (!font) return null;
    const text = "BREAK";
    const textWidth = font.getTextWidth(text);

    return (
        <Group>
            <Fill color="#1a1a1a" />
            {[...Array(5)].map((_, i) => {
                // Slicing the text using rect masks
                const sliceH = 60;
                const progress = Math.max(0, frame*2 - i*10); // cascading animation
                const offsetX = (i % 2 === 0 ? 1 : -1) * progress;
                const maskRect = (
                   <Group>
                       <Rect x={0} y={height/2 - 150 + i*sliceH} width={width} height={sliceH} color="black" />
                   </Group>
                );

                return (
                    <Mask key={i} mode="luminance" mask={maskRect}>
                        <Group transform={[{translateX: offsetX}]}>
                            <Text font={font} text={text} x={width/2 - textWidth/2} y={height/2 + 100} color="#00ffff" />
                        </Group>
                    </Mask>
                );
            })}
        </Group>
    );
};

// --- 5. Liquid Text ---
const LiquidText: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 200);

    if (!font) return null;
    const text = "LIQUID";
    const textWidth = font.getTextWidth(text);

    return (
        <Group>
            <Fill color="#000" />
            {/* Simulate water waving using multiple offset texts with blend modes */}
            <Group blendMode="screen">
                <Text font={font} text={text} x={width/2 - textWidth/2 + Math.sin(frame*0.1)*15} y={height/2 + 70 + Math.cos(frame*0.12)*10} color="#0000ff">
                     <Paint><Blur blur={8} /></Paint>
                </Text>
                <Text font={font} text={text} x={width/2 - textWidth/2 + Math.sin(frame*0.15 + 1)*10} y={height/2 + 70 + Math.cos(frame*0.08 + 1)*15} color="#00ffff">
                     <Paint><Blur blur={10} /></Paint>
                </Text>
                <Text font={font} text={text} x={width/2 - textWidth/2} y={height/2 + 70} color="#ffffff">
                     <Paint><Blur blur={2} /></Paint>
                </Text>
            </Group>
        </Group>
    );
};

export const TYPOGRAPHY_EFFECTS = [
    { name: 'TEXT PATH', comp: TextPathFollow, accent: '#00ffff' },
    { name: 'VARIABLE STROKE', comp: VariableStrokeTitle, accent: '#ffaa00' },
    { name: 'NEON OUTLINE', comp: GlowingOutlineText, accent: '#ff00ff' },
    { name: 'SHATTERED TEXT', comp: ShatteredText, accent: '#00ffff' },
    { name: 'LIQUID TEXT', comp: LiquidText, accent: '#0088ff' },
];
