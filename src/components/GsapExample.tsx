import React, { useEffect, useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { gsap } from 'gsap';
import { z } from 'zod';

export const GsapExampleSchema = z.object({
    text: z.string(),
});

type GsapExampleProps = z.infer<typeof GsapExampleSchema>;

export const GsapExample: React.FC<GsapExampleProps> = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const containerRef = useRef<HTMLDivElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    // テキストを1文字ずつのスパンに分割
    const chars = useMemo(() => text.split(""), [text]);

    useEffect(() => {
        // 1. GSAPタイムラインを「手動（paused）」で初期化
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });
            
            // 2. 文字ごとのアニメーションを定義
            tl.from(".gsap-char", {
                duration: 1,
                y: 50,
                opacity: 0,
                scale: 0.5,
                rotationX: 90,
                stagger: {
                    amount: 2, // 全体で2秒かけて順に表示
                    from: "start"
                },
                ease: "back.out(1.7)"
            });

            // 3. 輝くような光の演出
            tl.to(".gsap-char", {
                duration: 0.5,
                color: "#ff00ff",
                textShadow: "0 0 20px #ff00ff",
                stagger: 0.05,
                repeat: -1,
                yoyo: true
            }, "-=1");

            timeline.current = tl;
        }, containerRef); // 範囲を限定してメモリリークを防止

        return () => ctx.revert(); // クリーンアップ
    }, [text]);

    // 4. 重要！RemotionのフレームとGSAPのシークを完全に同期
    useEffect(() => {
        if (timeline.current) {
            // 現在のフレーム(frame) / FPS = 現在の秒数
            timeline.current.seek(frame / fps);
        }
    }, [frame, fps]);

    return (
        <div 
            ref={containerRef}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                perspective: '1000px',
                fontSize: '80px',
                fontWeight: 'bold',
                fontFamily: 'Inter, sans-serif',
                color: 'white',
                textAlign: 'center'
            }}
        >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {chars.map((char: string, i: number) => (
                    <span 
                        key={i} 
                        className="gsap-char" 
                        style={{ display: 'inline-block', margin: '0 5px' }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </div>
        </div>
    );
};
