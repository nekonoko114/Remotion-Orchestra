
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

export const TextMorphExample: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const svgRef = useRef<SVGSVGElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    // テキストをパス化したデータ (例としての簡略化パス)
    // 本来はOpenType.js等でフォントから抽出するか、Illustrator等から書き出したデータを使います
    const paths = {
        nova: "M100 200 L150 100 L200 200 L180 200 L150 140 L120 200 Z M250 100 L300 100 L300 200 L250 200 Z", // 「N」っぽい形
        gemini: "M100 100 C150 100 200 150 200 200 C200 250 150 300 100 300 Z", // 「G」っぽい形
        future: "M100 100 L300 100 L300 120 L120 120 L120 200 L280 200 L280 220 L120 220 L120 300 Z"  // 「F」っぽい形
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            // テキストパスのモーフィング
            tl.to("#text-path", {
                duration: 2,
                morphSVG: paths.gemini,
                fill: "#4285F4", // Gemini Blue
                ease: "expo.inOut"
            })
            .to("#text-path", {
                duration: 2,
                morphSVG: paths.future,
                fill: "#34A853", // Future Green
                ease: "expo.inOut"
            })
            .to("#text-path", {
                duration: 2,
                morphSVG: paths.nova,
                fill: "#9333ea", // Nova Purple
                ease: "expo.inOut"
            });

            timeline.current = tl;
        }, svgRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (timeline.current) {
            timeline.current.seek((frame / fps) % 6); // 6秒のループ
        }
    }, [frame, fps]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: '#000',
            flexDirection: 'column'
        }}>
            <svg 
                ref={svgRef}
                viewBox="0 0 500 500" 
                style={{ width: '800px', height: '400px' }}
            >
                <path
                    id="text-path"
                    d={paths.nova}
                    fill="#9333ea"
                    stroke="white"
                    strokeWidth="2"
                />
            </svg>
            
            <div style={{
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '20px',
                marginTop: '20px',
                opacity: 0.5
            }}>
                MorphSVG handles text as paths
            </div>
        </div>
    );
};
