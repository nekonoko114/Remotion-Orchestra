import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, Easing } from 'remotion';
import { TransitionPresentationComponentProps, TransitionPresentation } from '@remotion/transitions';

export type StaggeredWipeProps = {
    direction?: 'from-left' | 'from-right';
};

const StaggeredWipeComponent: React.FC<
    TransitionPresentationComponentProps<StaggeredWipeProps>
> = ({ children, presentationProgress, passedProps }) => {
    const direction = passedProps?.direction ?? 'from-left';
    
    // 次のシーン (children) をメモ化して無駄な再レンダリングを抑える（効果は限定的だが念のため）
    const content = useMemo(() => children, [children]);

    const renderSection = (index: number) => {
        // スタッガー（時間差）の設定
        const staggerStart = index * 0.12; 
        const staggerEnd = staggerStart + 0.7;
        
        // 動きをよりエレガントにするイージング
        const easedProgress = Easing.bezier(0.33, 1, 0.68, 1)(presentationProgress);
        
        const progress = interpolate(
            easedProgress, 
            [staggerStart, staggerEnd], 
            [0, 1], 
            {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
            }
        );
        
        // 左右からスライドしてくる距離
        const translateX = direction === 'from-left' 
            ? (1 - progress) * -100 
            : (1 - progress) * 100;

        return (
            <div
                key={index}
                style={{
                    position: 'absolute',
                    top: `${(index * 100) / 3}%`,
                    left: 0,
                    width: '100%',
                    height: `${100 / 3 + 0.2}%`, // セクション間の隙間（黒い線）を防ぐための微小なオーバーラップ
                    overflow: 'hidden',
                    transform: `translateX(${translateX}%)`,
                    backgroundColor: 'transparent',
                }}
            >
                {/* 
                   重要: 内部の div をスリットの高さの3倍 (300%) にし、
                   top をずらすことで、children (次のシーン) を正しいアスペクト比で表示します。
                */}
                <div style={{
                    position: 'absolute',
                    top: `-${index * 100}%`, 
                    left: 0,
                    width: '100%',
                    height: '300%', 
                    backgroundColor: 'transparent',
                }}>
                    {content}
                </div>
            </div>
        );
    };

    return (
        <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'transparent' }}>
            {/* 3枚の「動く窓」を重ねる。窓がない部分は背後のシーンが透けて見えます */}
            {renderSection(0)}
            {renderSection(1)}
            {renderSection(2)}
        </AbsoluteFill>
    );
};

export const staggeredWipe = (props?: StaggeredWipeProps): TransitionPresentation<StaggeredWipeProps> => {
    return {
        component: StaggeredWipeComponent,
        props: props ?? {},
    };
};
