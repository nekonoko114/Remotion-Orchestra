import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Circle, Paint, Group, SweepGradient, vec, Fill } from "@shopify/react-native-skia";
import { SkiaCanvas } from "@remotion/skia";

export const SkiaShowcaseImpl: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height, durationInFrames } = useVideoConfig();

    const center = useMemo(() => vec(width / 2, height / 2), [width, height]);
    const rotation = (frame / durationInFrames) * 360;

    return (
        <SkiaCanvas width={width} height={height}>
            <Fill color="black" />
            <Group origin={center} transform={[{ rotate: rotation / 180 * Math.PI }]}>
                <Circle cx={center.x} cy={center.y} r={300}>
                    <Paint>
                        <SweepGradient
                            c={center}
                            colors={["cyan", "magenta", "yellow", "cyan"]}
                        />
                    </Paint>
                </Circle>
            </Group>
            <Circle cx={center.x} cy={center.y} r={200} color="black" />
        </SkiaCanvas>
    );
};
