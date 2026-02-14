import React from 'react';
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

export const SkiaShowcase: React.FC = () => {
    return (
        <WithSkiaWeb
            getComponent={() => import('./SkiaShowcaseImpl').then((mod) => ({ default: mod.SkiaShowcaseImpl })) as any}
            fallback={<div>Loading Skia...</div>}
        />
    );
};
