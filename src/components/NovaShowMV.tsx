
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { gsap } from 'gsap';

const COLORS = {
    pink: "#ff007f",
    blue: "#00f2ff",
    yellow: "#fff200",
    purple: "#9333ea",
    black: "#050505"
};

// 歌詞とその出現方向を定義した「譜面」データ
const LYRIC_DATA = [
    { text: "READY", dir: "left" },
    { text: "FOR",   dir: "right" },
    { text: "MY",    dir: "top" },
    { text: "SHOW",  dir: "bottom" },
    { text: "NOVA",  dir: "left" },
    { text: "GEN",   dir: "right" },
    { text: "SUPER", dir: "top" },
    { text: "STAGE", dir: "bottom" },
];

export const NovaShowMV: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const containerRef = useRef<HTMLDivElement>(null);

    // 15フレームごとのビート
    const beatIndex = Math.floor(frame / 15) % LYRIC_DATA.length;
    const currentLyric = LYRIC_DATA[beatIndex];
    const beatProgress = (frame % 15) / 15; // 0.0 -> 1.0

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 文字が切り替わる瞬間（ビートの頭）に走るアニメーション
            const direction = currentLyric.dir;
            const fromVars = {
                opacity: 0,
                scale: 2,
                x: 0,
                y: 0,
                rotation: 45
            };

            // 方角によって初期位置を変える
            if (direction === "left")   fromVars.x = -800;
            if (direction === "right")  fromVars.x = 800;
            if (direction === "top")    fromVars.y = -600;
            if (direction === "bottom") fromVars.y = 600;

            gsap.fromTo(".dynamic-lyric", fromVars, {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "expo.out"
            });

            // 画面の揺れ（シェイク）
            gsap.fromTo("#kaleida-morph-root", { x: 50 }, {
                x: 0,
                duration: 0.1,
                ease: "elastic.out(1, 0.3)"
            });
        }, containerRef);

        return () => ctx.revert();
    }, [beatIndex]); // ビート（歌詞）が変わるたびに実行

    return (
        <div ref={containerRef} id="kaleida-morph-root" style={{
            width: '100%',
            height: '100%',
            backgroundColor: beatIndex % 2 === 0 ? COLORS.black : "#0a0015",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            fontFamily: 'Impact, sans-serif'
        }}>
            {/* 背景のグリッド */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(${COLORS.purple}33 1px, transparent 1px), linear-gradient(90deg, ${COLORS.purple}33 1px, transparent 1px)`,
                backgroundSize: '100px 100px',
                opacity: 0.3,
                transform: `perspective(500px) rotateX(60deg) translateY(${(frame * 5) % 100}px)`
            }} />

            {/* 歌詞タイポグラフィ（動的エントリー） */}
            <div className="dynamic-lyric" style={{
                fontSize: '250px',
                color: 'white',
                fontWeight: 'bold',
                letterSpacing: '-5px',
                fontStyle: 'italic',
                WebkitTextStroke: `6px ${beatIndex % 2 === 0 ? COLORS.pink : COLORS.blue}`,
                textShadow: `0 0 30px ${beatIndex % 2 === 0 ? COLORS.pink : COLORS.blue}`,
                zIndex: 100,
                filter: `hue-rotate(${frame % 360}deg)` // 色が常に少しずつ変化
            }}>
                {currentLyric.text}
            </div>

            {/* 警告ライン */}
            <div style={{
                position: 'absolute',
                top: 50,
                width: '100%',
                height: '40px',
                backgroundColor: COLORS.yellow,
                display: 'flex',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            }}>
                {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ color: 'black', fontSize: '20px', fontWeight: 'bold', padding: '0 50px', transform: `translateX(${(frame * -10) % 300}px)` }}>
                        CRITICAL SYSTEM ERROR - NOVAE GENERATION - 
                    </div>
                ))}
            </div>

            {/* スキャンライン */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                backgroundSize: '100% 4px',
                zIndex: 200,
                pointerEvents: 'none',
                opacity: 0.5
            }} />
        </div>
    );
};
