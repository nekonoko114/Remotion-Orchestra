import React, { Suspense } from 'react';
import { AbsoluteFill } from 'remotion';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web/LoadSkiaWeb';

// CanvasKit (Wasm) が完全に初期化された後にのみ SkiaEffectsInner を読み込む
// React.lazy の async 関数内で LoadSkiaWeb を await することで、
// モジュールが評価・実行されるタイミングを Wasm 読み込み完了後に保証する
const SkiaInner = React.lazy(async () => {
    await LoadSkiaWeb({ locateFile: (file: string) => `/${file}` });
    return import('./SkiaEffectsInner');
});

export const SkiaEffectsShowcase: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <Suspense
                fallback={
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{
                            color: '#00ffff',
                            fontSize: 28,
                            fontWeight: 'bold',
                            letterSpacing: 6,
                            fontFamily: 'sans-serif',
                            textShadow: '0 0 20px #00ffff',
                        }}>
                            LOADING SKIA ENGINE...
                        </div>
                    </AbsoluteFill>
                }
            >
                <SkiaInner />
            </Suspense>
        </AbsoluteFill>
    );
};
