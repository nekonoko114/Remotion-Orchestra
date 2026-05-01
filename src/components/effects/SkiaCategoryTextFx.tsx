import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion';
import { Group, Fill, Text, Paint, Blur, vec, LinearGradient, Rect } from '@shopify/react-native-skia';
import { useSkiaFont } from './SkiaCategoryTypography';

// Helper to split text and get character positions
const splitText = (text: string, font: any) => {
    if (!font) return [];
    let currentX = 0;
    return text.split('').map((char) => {
        const width = font.getTextWidth(char);
        const pos = currentX;
        currentX += width;
        return { char, pos, width };
    });
};

// --- 1. Spring Bounce Stagger ---
const SpringBounceStagger: React.FC = () => {
    const frame = useCurrentFrame() % 180;
    const { width, height, fps } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 120);
    const text = "SPRING BOUNCE";
    const chars = useMemo(() => splitText(text, font), [text, font]);
    const totalWidth = chars.length > 0 ? chars[chars.length - 1].pos + chars[chars.length - 1].width : 0;

    if (!font) return null;

    return (
        <Group>
            <Fill color="#0d0221" />
            <Group transform={[{ translate: [width / 2 - totalWidth / 2, height / 2] }]}>
                {chars.map((c, i) => {
                    const spr = spring({
                        frame: frame - i * 2,
                        fps,
                        config: { stiffness: 100, damping: 10, mass: 1 },
                    });
                    const translateY = interpolate(spr, [0, 1], [-height / 2, 0]);
                    const scale = interpolate(spr, [0, 0.8, 1], [0.5, 1.2, 1]);
                    return (
                        <Group key={i} transform={[{ translate: [c.pos, translateY] }, { scale }]}>
                            <Text font={font} text={c.char} x={0} y={40} color="#00d4ff" />
                        </Group>
                    );
                })}
            </Group>
        </Group>
    );
};

// --- 2. Speed Blur Snap ---
const SpeedBlurSnap: React.FC = () => {
    const frame = useCurrentFrame() % 180;
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 150);
    const text = "SPEED SNAP";
    const chars = useMemo(() => splitText(text, font), [text, font]);
    const totalWidth = chars.length > 0 ? chars[chars.length - 1].pos + chars[chars.length - 1].width : 0;

    if (!font) return null;

    return (
        <Group>
            <Fill color="#000" />
            <Group transform={[{ translate: [width / 2 - totalWidth / 2, height / 2] }]}>
                {chars.map((c, i) => {
                    const progress = interpolate(frame - i * 1.5, [0, 20], [0, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                        easing: Easing.out(Easing.exp),
                    });
                    const translateX = interpolate(progress, [0, 1], [width, 0]);
                    const velocity = Math.abs(interpolate(progress, [0, 0.9, 1], [50, 5, 0]));
                    return (
                        <Group key={i} transform={[{ translate: [c.pos + translateX, 50] }]}>{velocity > 1 && (
                                <Text font={font} text={c.char} x={0} y={0} color="rgba(0, 255, 255, 0.3)">
                                    <Paint><Blur blur={velocity} /></Paint>
                                </Text>
                             )}<Text font={font} text={c.char} x={0} y={0} color="#00ffff" /></Group>
                    );
                })}
            </Group>
        </Group>
    );
};

// --- 3. 3D Flip Reveal ---
const ThreeDFlipReveal: React.FC = () => {
    const frame = useCurrentFrame() % 180;
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 180);
    const text = "FLIP 3D";
    const chars = useMemo(() => splitText(text, font), [text, font]);
    const totalWidth = chars.length > 0 ? chars[chars.length - 1].pos + chars[chars.length - 1].width : 0;

    if (!font) return null;

    return (
        <Group>
            <Fill color="#1a001a" />
            <Group transform={[{ translate: [width / 2 - totalWidth / 2, height / 2] }]}>
                {chars.map((c, i) => {
                    const progress = interpolate(frame - i * 3, [0, 25], [0, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                        easing: Easing.elastic(1),
                    });
                    const scaleY = progress;
                    const opacity = interpolate(progress, [0, 0.3], [0, 1]);
                    const rotateX = interpolate(progress, [0, 1], [1.5, 0]);

                    return (
                        <Group key={i} opacity={opacity} transform={[{ translate: [c.pos, 60] }, { scaleY }, { skewY: rotateX }]}>
                            <Text font={font} text={c.char} x={0} y={0} color="#ff00ff" />
                        </Group>
                    );
                })}
            </Group>
        </Group>
    );
};

// --- 4. Wobbly Wave ---
const WobblyWave: React.FC = () => {
    const frame = useCurrentFrame() % 180;
    const { width, height } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 130);
    const text = "WOBBLY WAVE";
    const chars = useMemo(() => splitText(text, font), [text, font]);
    const totalWidth = chars.length > 0 ? chars[chars.length - 1].pos + chars[chars.length - 1].width : 0;

    if (!font) return null;

    return (
        <Group>
            <Fill color="#001510" />
            <Group transform={[{ translate: [width / 2 - totalWidth / 2, height / 2] }]}>
                {chars.map((c, i) => {
                    const offsetY = Math.sin(frame * 0.1 + i * 0.5) * 40;
                    const offsetX = Math.cos(frame * 0.08 + i * 0.4) * 20;
                    const rotate = Math.sin(frame * 0.05 + i * 0.3) * 0.2;
                    return (
                        <Group key={i} transform={[{ translate: [c.pos + offsetX, 40 + offsetY] }, { rotate }]}>
                            <Text font={font} text={c.char} x={0} y={0} color="#00ff88">
                                <Paint>
                                    <LinearGradient start={vec(0, -50)} end={vec(0, 50)} colors={['#ffffff', '#00ff88']} />
                                </Paint>
                            </Text>
                        </Group>
                    );
                })}
            </Group>
        </Group>
    );
};

// --- 5. Impact Zoom Explosive ---
const ImpactZoomExplosive: React.FC = () => {
    const frame = useCurrentFrame() % 180;
    const { width, height, fps } = useVideoConfig();
    const font = useSkiaFont('/fonts/ZenMaruGothic-Black.ttf', 160);
    const text = "IMPACT!";
    const chars = useMemo(() => splitText(text, font), [text, font]);
    const totalWidth = chars.length > 0 ? chars[chars.length - 1].pos + chars[chars.length - 1].width : 0;

    if (!font) return null;

    return (
        <Group>
            <Fill color="#000" />
            <Group transform={[{ translate: [width / 2 - totalWidth / 2, height / 2] }]}>
                {chars.map((c, i) => {
                    const spr = spring({
                        frame: frame - i * 4,
                        fps,
                        config: { stiffness: 200, damping: 20, mass: 0.5 },
                    });
                    const scale = interpolate(spr, [0, 1], [15, 1]);
                    const opacity = interpolate(spr, [0, 0.2, 1], [0, 1, 1]);
                    const flash = interpolate(spr, [0.95, 1, 1.1], [0, 1, 0], { extrapolateRight: 'clamp' });

                    return (
                        <Group key={i} opacity={opacity} transform={[{ translate: [c.pos, 55] }, { scale }]}>{flash > 0 && (
                                <Text font={font} text={c.char} x={0} y={0} color="white" opacity={flash}>
                                    <Paint><Blur blur={40} /></Paint>
                                </Text>
                             )}<Text font={font} text={c.char} x={0} y={0} color={flash > 0.5 ? "white" : "#ffaa00"} /></Group>
                    );
                })}
            </Group><Rect x={0} y={0} width={width} height={height} color="white" opacity={Math.max(0, Math.sin(frame*0.5)*0.05)} />
        </Group>
    );
};

export const ADVANCED_TEXT_EFFECTS = [
    { name: 'SPRING BOUNCE', comp: SpringBounceStagger, accent: '#00d4ff' },
    { name: 'SPEED SNAP', comp: SpeedBlurSnap, accent: '#00ffff' },
    { name: '3D FLIP', comp: ThreeDFlipReveal, accent: '#ff00ff' },
    { name: 'WOBBLY WAVE', comp: WobblyWave, accent: '#00ff88' },
    { name: 'IMPACT ZOOM', comp: ImpactZoomExplosive, accent: '#ffaa00' },
];
