
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { gsap } from 'gsap';

const COLORS = {
    purple: "#9333ea",
    silver: "#c0c0c0",
    white: "#ffffff",
    black: "#000000",
    accent: "#ff007f" // アクセントカラー
};

// 歌詞の「譜面」データ
const LYRIC_TIMELINE = [
    { text: "KALEIDANOVA", color: COLORS.purple, dir: "right" },
    { text: "PROJECT START", color: COLORS.silver, dir: "left" },
    { text: "BEYOND REALITY", color: COLORS.accent, dir: "top" },
    { text: "WORLD CHANGED", color: COLORS.white, dir: "bottom" },
];

export const NovaLyricMaster: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const containerRef = useRef<HTMLDivElement>(null);

    const sectionDuration = 45; // 1.5秒ごとに切り替え
    const currentIdx = Math.floor(frame / sectionDuration) % LYRIC_TIMELINE.length;
    const sectionFrame = frame % sectionDuration;
    const lyric = LYRIC_TIMELINE[currentIdx];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // 1. 入場アニメーション（一文字ずつ）
            tl.fromTo(".char", {
                opacity: 0,
                y: lyric.dir === "top" ? -100 : lyric.dir === "bottom" ? 100 : 0,
                x: lyric.dir === "left" ? -200 : lyric.dir === "right" ? 200 : 0,
                scale: 0.5,
                rotationX: 90,
            }, {
                duration: 0.5,
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                rotationX: 0,
                ease: "expo.out",
                stagger: 0.05,
            });

            // 2. 中盤の「脈動（Pulse）」演出
            gsap.to(".char", {
                filter: `drop-shadow(0 0 20px ${lyric.color})`,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // 3. 退場アニメーション（高速にのく）
            if (sectionFrame > sectionDuration - 10) {
                gsap.to(".char", {
                    x: -1500, // 左へ高速スライドアウト
                    skewX: 30, // 速度感のための歪み
                    duration: 0.4,
                    ease: "power4.in",
                    stagger: 0.02
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [currentIdx, sectionFrame > sectionDuration - 10]);

    return (
        <div ref={containerRef} style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#050505',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            perspective: '1500px'
        }}>
            {/* 背景のグリッド（奥行き演出） */}
            <div style={{
                position: 'absolute',
                width: '200%',
                height: '200%',
                backgroundImage: `radial-gradient(circle at center, ${lyric.color}22 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                transform: `rotateX(60deg) translateY(${(frame * 2) % 50}px)`,
                opacity: 0.5
            }} />

            {/* メイン歌詞（夢の仕様） */}
            <div style={{
                display: 'flex',
                fontSize: '140px',
                fontWeight: 900,
                fontFamily: 'Montserrat, Impact, sans-serif',
                color: COLORS.white, // 塗りは白
                WebkitTextStroke: `6px ${lyric.color}`, // アウトラインはテーマ色
                paintOrder: 'stroke fill',
                zIndex: 10
            }}>
                {lyric.text.split('').map((char, i) => (
                    <span 
                        key={`${currentIdx}-${i}`} 
                        className="char"
                        style={{ 
                            display: 'inline-block',
                            margin: char === ' ' ? '0 30px' : '0 2px',
                            textShadow: `0 0 20px ${lyric.color}88`,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>

            {/* 映画のようなレンズフレアの破片 */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at ${50 + Math.sin(frame/20)*20}% ${50 + Math.cos(frame/20)*20}%, ${lyric.color}11 0%, transparent 40%)`,
                pointerEvents: 'none'
            }} />
        </div>
    );
};
