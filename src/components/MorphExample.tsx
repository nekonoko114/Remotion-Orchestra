
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// プラグインを登録
gsap.registerPlugin(MorphSVGPlugin);

export const MorphExample: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const svgRef = useRef<SVGSVGElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    // モーフィング用のSVGパスデータ
    // 1. シンプルな円
    const pathA = "M 500,500 m -200,0 a 200,200 0 1,0 400,0 a 200,200 0 1,0 -400,0";
    // 2. 複雑な星型（または宝石のような形）
    const pathB = "M 500,250 L 580,420 L 750,450 L 630,580 L 660,750 L 500,670 L 340,750 L 370,580 L 250,450 L 420,420 Z";

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            // モーフィングアニメーション
            tl.to("#morph-path", {
                duration: 2,
                morphSVG: pathB, // パスBへ変形
                fill: "#9333ea", // 紫色へ
                ease: "power2.inOut"
            })
            .to("#morph-path", {
                duration: 2,
                morphSVG: pathA, // 元の形へ
                fill: "#e5e5e5", // 銀色（ライトグレー）へ
                ease: "power2.inOut"
            });

            timeline.current = tl;
        }, svgRef);

        return () => ctx.revert();
    }, []);

    // Remotionのフレームと同期
    useEffect(() => {
        if (timeline.current) {
            timeline.current.seek((frame / fps) % 4); // 4秒のループ
        }
    }, [frame, fps]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: '#000'
        }}>
            <svg 
                ref={svgRef}
                viewBox="0 0 1000 1000" 
                style={{ width: '600px', height: '600px' }}
            >
                {/* フィルターで輝きを追加 */}
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <path
                    id="morph-path"
                    d={pathA}
                    fill="#e5e5e5"
                    filter="url(#glow)"
                />
            </svg>
            
            <div style={{
                position: 'absolute',
                bottom: '100px',
                color: 'white',
                fontFamily: 'sans-serif',
                fontSize: '24px',
                letterSpacing: '10px'
            }}>
                MORPHING REALITY
            </div>
        </div>
    );
};
