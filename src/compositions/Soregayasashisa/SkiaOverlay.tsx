import React from 'react';
import { SkiaOverlay as SkiaOverlayImpl } from './SkiaOverlayImpl';

interface SkiaOverlayProps {
    audioPower: number;
}

export const SkiaOverlay: React.FC<SkiaOverlayProps> = (props) => {
    return (
        <SkiaOverlayImpl {...props} />
    );
};
