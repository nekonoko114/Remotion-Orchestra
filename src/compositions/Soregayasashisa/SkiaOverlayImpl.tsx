import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';

interface SkiaOverlayProps {
    audioPower: number;
}

export const SkiaOverlay: React.FC<SkiaOverlayProps> = ({ audioPower }) => {
    const { width, height } = useVideoConfig();
    
    // 中心座標
    const cx = width / 2;
    const cy = height / 2;
    
    // リング1 (A2D2FF) の半径
    const r1 = width * 0.35 + (audioPower * 30);
    // リング2 (B9E4C9) の半径
    const r2 = width * 0.32;

    return (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
            {/* 1st Ring: Neon "Aura" Ring that pulses with audio */}
            <div style={{
                position: 'absolute',
                left: cx - r1,
                top: cy - r1,
                width: r1 * 2,
                height: r1 * 2,
                borderRadius: '50%',
                border: '4px solid #A2D2FF',
                boxShadow: '0 0 50px 10px rgba(162, 210, 255, 0.5), inset 0 0 50px 10px rgba(162, 210, 255, 0.5)',
                opacity: 0.15,
                boxSizing: 'border-box',
            }} />
            
            {/* 2nd Ring: Pastel Green */}
            <div style={{
                position: 'absolute',
                left: cx - r2,
                top: cy - r2,
                width: r2 * 2,
                height: r2 * 2,
                borderRadius: '50%',
                border: '1px solid #B9E4C9',
                boxShadow: '0 0 20px 5px rgba(185, 228, 201, 0.5), inset 0 0 20px 5px rgba(185, 228, 201, 0.5)',
                opacity: 0.12,
                boxSizing: 'border-box',
            }} />
        </AbsoluteFill>
    );
};
