import React from 'react';
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

interface SkiaOverlayProps {
    audioPower: number;
}

export const SkiaOverlay: React.FC<SkiaOverlayProps> = (props) => {
    return (
        <WithSkiaWeb
            getComponent={() => import('./SkiaOverlayImpl').then((mod) => ({ default: mod.SkiaOverlay }))}
            fallback={null}
            componentProps={props}
        />
    );
};
