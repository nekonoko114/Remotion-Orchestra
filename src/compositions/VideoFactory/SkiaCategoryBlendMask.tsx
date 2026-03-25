import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Group, Fill, Circle, Paint, Blur, Rect, SweepGradient, Mask, LinearGradient, vec } from '@shopify/react-native-skia';

// --- 1. Luma Brush Reveal ---
const LumaBrushReveal: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    
    // Mask: A glowing circle that grows and moves to reveal the background
    const MaskComponent = (
        <Group>
            <Circle cx={width/2 + Math.sin(frame*0.05)*300} cy={height/2 + Math.cos(frame*0.03)*400} r={100 + frame*5} color="black">
                <Paint><Blur blur={50} /></Paint>
            </Circle>
            <Circle cx={width/2 - Math.sin(frame*0.04)*200} cy={height/2 - Math.cos(frame*0.06)*300} r={50 + frame*8} color="black">
                <Paint><Blur blur={30} /></Paint>
            </Circle>
        </Group>
    );

    return (
        <Group>
            {/* Background Layer (Hidden initially) */}
            <Fill color="#000" />
            
            <Mask mode="luminance" mask={MaskComponent}>
                <Rect x={0} y={0} width={width} height={height}>
                    <Paint>
                        <SweepGradient c={vec(width/2, height/2)} colors={['#ff0055', '#aaff00', '#00ffff', '#ff0055']} transform={[{rotate: frame*0.02}]} />
                    </Paint>
                </Rect>
                {/* Scratches/Patterns on revealed area */}
                {[...Array(20)].map((_, i) => (
                    <Rect key={i} x={0} y={(i*100 + frame*5) % height} width={width} height={5} color="rgba(255,255,255,0.5)" />
                ))}
            </Mask>
            
            {/* Overlay on top of mask */}
            <Rect x={width/2 - 150} y={height/2 - 50} width={300} height={100} color="rgba(255,255,255,0.1)" style="stroke" strokeWidth={2} />
        </Group>
    );
};

// --- 2. Multiply Color Burn ---
const MultiplyColorBurn: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    return (
        <Group>
            <Fill color="#ffffff" />
            <Group blendMode="multiply">
                <Circle cx={width/2 + Math.sin(frame*0.02)*200} cy={height/2 - 100} r={400} color="#00ffff" />
                <Circle cx={width/2 - Math.cos(frame*0.03)*200} cy={height/2 + 100} r={400} color="#ff00ff" />
                <Circle cx={width/2} cy={height/2 + Math.sin(frame*0.04)*200} r={400} color="#ffff00" />
            </Group>
            <Group blendMode="colorBurn">
                <Rect x={0} y={0} width={width} height={height}>
                     <Paint>
                         <LinearGradient start={vec(0,0)} end={vec(width, height)} colors={['#ff0000', '#0000ff']} />
                     </Paint>
                </Rect>
            </Group>
        </Group>
    );
};

// --- 3. Invert Scanner ---
const InvertScanner: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    const scanY = (frame * 15) % height;
    
    const Scene = () => (
        <Group>
            {[...Array(50)].map((_, i) => (
                <Circle key={i} cx={Math.random()*width} cy={Math.random()*height} r={Math.random()*50} color={`hsla(${i*15}, 100%, 50%, 0.8)`} />
            ))}
            <Rect x={100} y={200} width={800} height={400} color="#ff00ff" />
        </Group>
    );

    return (
        <Group>
            <Fill color="#000" />
            <Scene />
            {/* Invert blend mode flips colors underneath */}
            <Group blendMode="exclusion">
                <Rect x={0} y={scanY - 100} width={width} height={200} color="white">
                     <Paint><Blur blur={20} /></Paint>
                </Rect>
                <Rect x={0} y={scanY - 5} width={width} height={10} color="white" />
            </Group>
        </Group>
    );
};

// --- 4. Soft Masked Glow ---
const SoftMaskedGlow: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    
    // Hard shape as mask
    const MaskShape = (
        <Group>
            <Rect x={width/2 - 300} y={height/2 - 400} width={600} height={800} color="black" />
            <Circle cx={width/2} cy={height/2} r={250} color="black" /> {/* Combine */}
        </Group>
    );

    return (
        <Group>
            <Fill color="#101010" />
            <Rect x={width/2 - 300} y={height/2 - 400} width={600} height={800} color="transparent" style="stroke" strokeWidth={2} />
            <Circle cx={width/2} cy={height/2} r={250} color="transparent" style="stroke" strokeWidth={2} />
            
            {/* Glow restricted inside the mask */}
            <Mask mode="luminance" mask={MaskShape}>
                <Circle cx={width/2 + Math.sin(frame*0.05)*300} cy={height/2 + Math.cos(frame*0.06)*400} r={200} color="#00ffff">
                    <Paint><Blur blur={50} /></Paint>
                </Circle>
                <Circle cx={width/2 - Math.cos(frame*0.04)*300} cy={height/2 - Math.sin(frame*0.03)*400} r={250} color="#ff00ff">
                    <Paint><Blur blur={80} /></Paint>
                </Circle>
            </Mask>
        </Group>
    );
};

// --- 5. Double Exposure ---
const DoubleExposure: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();
    
    const Silhouette = (
        <Group>
             <Circle cx={width/2} cy={height/2} r={350} color="black" />
             <Rect x={width/2 - 150} y={height/2 + 200} width={300} height={500} color="black" />
        </Group>
    );

    return (
        <Group>
            <Fill color="#ffffff" />
            
            <Mask mode="luminance" mask={Silhouette}>
                {/* Moving Cosmic Background inside the silhouette */}
                <Fill color="#000" />
                {[...Array(100)].map((_, i) => (
                    <Circle 
                        key={i} 
                        cx={(i * 123 + frame * 2) % width} 
                        cy={(i * 321 + frame * 3) % height} 
                        r={Math.random()*4+1} 
                        color="white" 
                    />
                ))}
                <Circle cx={width/2} cy={height/2 + Math.sin(frame*0.02)*100} r={200} color="#ff0055">
                     <Paint><Blur blur={100} /></Paint>
                </Circle>
            </Mask>
            
            {/* Soft blend over everything */}
            <Group blendMode="screen" opacity={0.3}>
                 <Rect x={0} y={0} width={width} height={height} color="#0088ff" />
            </Group>
        </Group>
    );
};

export const BLEND_MASK_EFFECTS = [
    { name: 'LUMA REVEAL', comp: LumaBrushReveal, accent: '#ff0055' },
    { name: 'MULTIPLY BURN', comp: MultiplyColorBurn, accent: '#ff00ff' },
    { name: 'INVERT SCANNER', comp: InvertScanner, accent: '#ffffff' },
    { name: 'SOFT MASK GLOW', comp: SoftMaskedGlow, accent: '#00ffff' },
    { name: 'DOUBLE EXPOSURE', comp: DoubleExposure, accent: '#000000' },
];
