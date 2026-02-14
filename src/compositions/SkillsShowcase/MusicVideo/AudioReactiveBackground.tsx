import React from 'react';
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { TunnelVariant } from './Tunnel3D';

export const AudioReactiveBackground: React.FC<{ beat: number; variant?: TunnelVariant }> = ({ beat, variant = 'cyberpunk' }) => {
    return (
        <WithSkiaWeb
            getComponent={() => import('./AudioReactiveBackgroundImpl').then((mod) => ({ default: mod.AudioReactiveBackgroundImpl })) as any}
            componentProps={{ beat, variant }}
            fallback={null}
        />
    );
};
