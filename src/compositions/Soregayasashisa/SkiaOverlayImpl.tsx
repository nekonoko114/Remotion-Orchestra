import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { vec, BlurMask, Circle, Paint } from "@shopify/react-native-skia";
import { SkiaCanvas } from "@remotion/skia";

interface SkiaOverlayProps {
    audioPower: number;
}

export const SkiaOverlay: React.FC<SkiaOverlayProps> = ({ audioPower }) => {
    const { width, height } = useVideoConfig();
    const center = useMemo(() => vec(width / 2, height / 2), [width, height]);

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50 }}>
            <SkiaCanvas width={width} height={height} style={{ width, height }}>
                {/* 
                  Example: Neon "Aura" Ring that pulses with audio 
                  (Visible on beat kicks)
                */}
                <Circle 
                    cx={center.x} 
                    cy={center.y} 
                    r={width * 0.35 + (audioPower * 30)} 
                    style="stroke"
                    strokeWidth={4}
                    opacity={0.15} 
                >
                    <Paint color="#A2D2FF" style="stroke" strokeWidth={2} />
                    <BlurMask blur={50} style="normal" />
                </Circle>
                
                {/* 2nd Ring: Pastel Green */}
                 <Circle 
                    cx={center.x} 
                    cy={center.y} 
                    r={width * 0.32}
                    opacity={0.12}
                    style="stroke"
                    strokeWidth={1}
                    color="#B9E4C9"
                >
                     <BlurMask blur={20} style="normal" />
                </Circle>
            </SkiaCanvas>
        </AbsoluteFill>
    );
};
