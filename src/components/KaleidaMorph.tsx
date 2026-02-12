
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// KALEIDANOVA の各文字を高精度パスで再現
const LETTER_PATHS = [
    "M10,0 L30,0 L30,40 L70,0 L100,0 L50,50 L100,100 L70,100 L30,60 L30,100 L10,100 Z", // K
    "M10,100 L40,0 L60,0 L90,100 L70,100 L62,75 L38,75 L30,100 Z M50,25 L43,55 L57,55 Z", // A
    "M10,0 L30,0 L30,80 L80,80 L80,100 L10,100 Z",                                     // L
    "M10,0 L90,0 L90,20 L30,20 L30,40 L80,40 L80,60 L30,60 L30,80 L90,80 L90,100 L10,100 Z", // E
    "M10,0 L90,0 L90,20 L60,20 L60,80 L90,80 L90,100 L10,100 L10,80 L40,80 L40,20 L10,20 Z", // I
    "M10,0 L50,0 C85,0 85,100 50,100 L10,100 Z M30,20 L30,80 L50,80 C70,80 70,20 50,20 Z", // D
    "M10,100 L40,0 L60,0 L90,100 L70,100 L62,75 L38,75 L30,100 Z M50,25 L43,55 L57,55 Z", // A
    "M10,100 L10,0 L35,0 L70,60 L70,0 L90,0 L90,100 L65,100 L30,40 L30,100 Z",            // N
    "M50,0 C10,0 10,100 50,100 C90,100 90,0 50,0 Z M50,20 C35,20 35,80 50,80 C65,80 65,20 50,20 Z", // O
    "M0,0 L25,0 L50,70 L75,0 L100,0 L60,100 L40,100 Z",                                  // V
    "M10,100 L40,0 L60,0 L90,100 L70,100 L62,75 L38,75 L30,100 Z M50,25 L43,55 L57,55 Z"  // A
];

const CIRCLE_PATH = "M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10";

export const KaleidaMorph: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const containerRef = useRef<HTMLDivElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            // 1. 全体のズーム感
            tl.fromTo(".svg-master-group", {
                scale: 0.85,
            }, {
                scale: 1.15,
                duration: 6,
                ease: "none"
            }, 0);

            // 2. モーフィングアニメーション（メインとシマーをまとめて制御）
            for(let i = 0; i < LETTER_PATHS.length; i++) {
                const targetX = 150 + i * 160;
                const charColor = i % 2 === 0 ? "#9333ea" : "#e5e5e5";
                
                // 各文字のグループに対してアニメーション
                tl.to(`.char-group-${i} .target-path`, {
                    duration: 1.8,
                    x: targetX,
                    y: 400,
                    morphSVG: LETTER_PATHS[i],
                    ease: "expo.inOut",
                    opacity: 1,
                    fill: (j, target) => {
                        // クラス名で色を分ける
                        return target.classList.contains('main-fill') ? charColor : "url(#shimmer-gradient)";
                    }
                }, i * 0.15); // Staggerを手動で設定
            }

            // 3. シマー（光の走り）の無限ループ
            tl.fromTo("#shimmer-gradient", {
                attr: { x1: "-100%", x2: "0%" }
            }, {
                attr: { x1: "100%", x2: "200%" },
                duration: 2.5,
                ease: "none",
                repeat: -1
            }, 0);

            // 4. 文字が現れる瞬間のエネルギーバースト
            tl.to(".main-fill", {
                duration: 0.4,
                filter: "drop-shadow(0 0 30px rgba(147, 51, 234, 1)) brightness(1.8)",
                stagger: 0.15,
                repeat: 1,
                yoyo: true,
                ease: "sine.inOut"
            }, 0.8);

            // 5. 全表示後の3D回転演出 (New!)
            tl.to(".char-group", {
                duration: 1.5,
                rotationY: 360, // Y軸を中心に1回転
                ease: "expo.inOut",
                stagger: {
                    each: 0.1,
                    from: "center" // 中央から外側へ順に回転
                }
            }, 3.5); // モーフィングがほぼ終わるタイミングで開始

            // 6. 最後にふわりと浮き沈みさせる（浮遊感）
            tl.to(".svg-master-group", {
                duration: 2,
                y: "-=20",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }, 5);

            timeline.current = tl;
        }, containerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (timeline.current) {
            timeline.current.seek((frame / fps) % 6);
        }
    }, [frame, fps]);

    return (
        <div ref={containerRef} id="kaleida-morph-root" style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            perspective: '1000px'
        }}>
            {/* ビネット（周辺暗化） */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.9) 100%)',
                zIndex: 10,
                pointerEvents: 'none'
            }} />

            {/* アンビエント・ライト */}
            <div className="ambient-glow" style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 60%)',
                filter: 'blur(80px)',
            }} />

            <svg viewBox="0 0 2000 1000" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <linearGradient id="shimmer-gradient" x1="-100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                <g className="svg-master-group">
                    {LETTER_PATHS.map((_, i) => (
                        <g key={i} className={`char-group char-group-${i}`}>
                            {/* 文字本体 */}
                            <path
                                className="target-path main-fill"
                                d={CIRCLE_PATH}
                                fillRule="evenodd"
                                style={{ transform: 'translate(950px, 400px)' }}
                                opacity={0}
                            />
                            {/* シマー（光のオーバーレイ） */}
                            <path
                                className="target-path shimmer-overlay"
                                d={CIRCLE_PATH}
                                fill="url(#shimmer-gradient)"
                                fillRule="evenodd"
                                style={{ 
                                    transform: 'translate(950px, 400px)',
                                    mixBlendMode: 'overlay',
                                    pointerEvents: 'none'
                                }}
                                opacity={0}
                            />
                        </g>
                    ))}
                </g>
            </svg>
            
            <div style={{
                position: 'absolute',
                bottom: '12%',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                letterSpacing: '20px',
                textTransform: 'uppercase',
                opacity: interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' }),
                fontWeight: 200,
                transform: `scale(${interpolate(frame, [0, 180], [1, 1.1])})`
            }}>
                P R E S E N T S
            </div>
        </div>
    );
};
