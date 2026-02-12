
import React, { useEffect, useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { gsap } from 'gsap';

const COLORS = {
    pink: "#ff007f",
    blue: "#00f2ff",
    yellow: "#fff200",
    purple: "#9333ea",
    white: "#ffffff",
    black: "#000000"
};

// 歌詞のデータ構造
const LYRICS = [
    { text: "NA-NA-NA-NA-NA", color: COLORS.pink },
    { text: "READY FOR THE SHOW", color: COLORS.blue },
    { text: "KALEIDANOVA", color: COLORS.purple },
    { text: "WELCOME TO DARKNESS", color: COLORS.yellow },
];

export const AdoStyleLyric: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const containerRef = useRef<HTMLDivElement>(null);

    // 1セクション30フレーム（1秒）のサイクル
    const sectionDuration = 30;
    const currentSection = Math.floor(frame / sectionDuration) % LYRICS.length;
    const sectionFrame = frame % sectionDuration;
    const lyric = LYRICS[currentSection];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 文字が切り替わる瞬間
            const tl = gsap.timeline();

            // 1. 各文字（char）を一文字ずつ出現させる
            tl.fromTo(".char", {
                opacity: 0,
                scale: 0,
                x: -100,
                rotation: -20,
            }, {
                duration: 0.4,
                opacity: 1,
                scale: 1,
                x: 0,
                rotation: 0,
                ease: "back.out(1.7)",
                stagger: 0.05, // ここで一文字ずつの時間差を作る
            });

            // 2. 表示中の微振動（グリッチ感）
            gsap.to(".char", {
                x: "random(-2, 2)",
                y: "random(-2, 2)",
                duration: 0.05,
                repeat: -1,
                yoyo: true,
            });

            // 3. セクションの終わりで横にハイスピードで逃げる（スライドアウト）
            if (sectionFrame > sectionDuration - 5) {
                gsap.to(".char", {
                    x: 1000,
                    skewX: -20,
                    duration: 0.3,
                    ease: "power4.in",
                    stagger: 0.02,
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [currentSection, sectionFrame > sectionDuration - 5]);

    return (
        <div ref={containerRef} style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        }}>
            {/* 背景の演出: 歌詞が流れる背景 */}
            <div style={{
                position: 'absolute',
                fontSize: '400px',
                fontWeight: 900,
                color: lyric.color,
                opacity: 0.05,
                whiteSpace: 'nowrap',
                transform: `translateX(${1000 - frame * 10}px)`
            }}>
                {lyric.text}
            </div>

            {/* メイン歌詞 */}
            <div style={{
                display: 'flex',
                fontSize: '120px',
                fontWeight: 900,
                fontFamily: 'Impact, sans-serif',
                color: COLORS.white,
                WebkitTextStroke: `8px ${lyric.color}`,
                paintOrder: 'stroke fill',
                zIndex: 10,
            }}>
                {lyric.text.split('').map((char, i) => (
                    <span 
                        key={`${currentSection}-${i}`} 
                        className="char"
                        style={{ 
                            display: 'inline-block',
                            margin: char === ' ' ? '0 20px' : '0 2px',
                            // 動的に色を少しだけ変化させる
                            filter: `drop-shadow(0 0 10px ${lyric.color})`,
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>

            {/* 画面全体のハイスピード感（スキャンスライン） */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
                zIndex: 100,
                pointerEvents: 'none'
            }} />
        </div>
    );
};
