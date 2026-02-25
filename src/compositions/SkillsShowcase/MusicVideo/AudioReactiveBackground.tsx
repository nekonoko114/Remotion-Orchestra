import React from 'react';
import { AudioReactiveBackgroundImpl } from './AudioReactiveBackgroundImpl';
import { TunnelVariant } from './Tunnel3D';

export const AudioReactiveBackground: React.FC<{ beat: number; variant?: TunnelVariant }> = ({ beat, variant = 'cyberpunk' }) => {
    return <AudioReactiveBackgroundImpl beat={beat} variant={variant} />;
};
