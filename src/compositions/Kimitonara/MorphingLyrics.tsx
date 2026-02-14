import React, { useMemo, useEffect, useState } from 'react';
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig, staticFile, AbsoluteFill, Easing } from 'remotion';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import * as opentype from 'opentype.js';

gsap.registerPlugin(MorphSVGPlugin);

interface MorphingLyricsProps {
    text: string;
    startTime: number;
    endTime: number;
    syncOffset: number;
}

// フォントのキャッシュ
let cachedFont: opentype.Font | null = null;

export const MorphingLyrics: React.FC<MorphingLyricsProps> = ({ text, startTime, endTime, syncOffset }) => {
    const frame = useCurrentFrame();
    const { width, height, fps } = useVideoConfig();
    const [font, setFont] = useState<opentype.Font | null>(cachedFont);
    const [error, setError] = useState<string | null>(null);


    // フォントの非同期読み込み
    useEffect(() => {
        if (cachedFont) return;
        // フォントファイルのURL (publicフォルダに配置)
        const FONT_URL = '/fonts/851MkPOP_101.ttf';
        const fontPath = staticFile(FONT_URL);
        opentype.load(fontPath, (err, loadedFont) => {
            if (err) {
                console.error('Font could not be loaded:', err);
                setError(err.toString());
            } else if (loadedFont) {
                cachedFont = loadedFont;
                setFont(loadedFont);
            }
        });
    }, []);

    // Sequence内なので frame は 0 からスタートする相対時間
    // durationFrames は props から計算 (endTime - startTime)
    const durationFrames = Math.round((endTime - startTime) * fps);
    
    // 念のため範囲チェック (Sequenceで制御されているが、安全のため)
    if (frame < 0 || frame > durationFrames) {
        return null;
    }

    const currentRelativeFrame = frame;

    // パスデータの生成 (文字ごとに分割 & 複数行対応)
    const paths = useMemo(() => {
        if (!font || !text) return null;

        // 行ごとに分割
        const lines = text.split('\n');
        
        // タイポグラフィ設定
        const baseFontSize = width * 0.1; 
        
        // 全文サイズ調整 (行数が増えるので少し小さめに調整)
        // 1行あたりの最大文字数で計算
        const maxCharsPerLine = Math.max(...lines.map(line => line.length));
        const fullFontSize = Math.min(width * 0.1, (width * 0.7) / (maxCharsPerLine * 1.0)); 

        // 行間
        const lineHeight = fullFontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = height / 2 - totalHeight / 2 + lineHeight / 2; // 最初の行のベースライン基準

        // Start Path (Source Char - Centered)
        // Find the first non-space/non-empty character to use as the starting morph source
        let firstNonEmptyChar = lines[0][0];
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
                firstNonEmptyChar = trimmed[0];
                break;
            }
        }

        const startPathObj = font.getPath(firstNonEmptyChar || " ", 0, 0, baseFontSize, {});
        const startBounds = startPathObj.getBoundingBox();
        const startWidth = startBounds.x2 - startBounds.x1;
        const startHeightRes = startBounds.y2 - startBounds.y1;
        
        // Start Path Data (Centered locally)
        const startPathData = startPathObj.toPathData(2);
        const startCenterOffsetX = width / 2 - startWidth / 2;
        const startCenterOffsetY = height / 2 + startHeightRes / 4;

        // すべての文字のパスと配置を計算
        const allChars: Array<{
            endPath: string;
            endOffset: { x: number, y: number };
        }> = [];

        lines.forEach((lineText, lineIndex) => {
            const endPathObjs = font.getPaths(lineText, 0, 0, fullFontSize, {});
            
            // 行の幅を計算してセンタリング
            let minX = Infinity, maxX = -Infinity;
            endPathObjs.forEach(p => {
                const b = p.getBoundingBox();
                if (b.x1 < minX) minX = b.x1;
                if (b.x2 > maxX) maxX = b.x2;
            });
            const lineWidth = maxX - minX;
            // 行の垂直位置
            const currentLineY = startY + lineIndex * lineHeight; 
            const endCenterOffsetX = width / 2 - lineWidth / 2;

            endPathObjs.forEach(p => {
                 const pData = p.toPathData(2);
                 // Filter out empty paths (like spaces) to avoid GSAP SyntaxError
                 if (pData && pData.trim().length > 0) {
                     allChars.push({
                        endPath: pData,
                        endOffset: { x: endCenterOffsetX, y: currentLineY } 
                     });
                 }
            });
        });

        return {
            start: startPathData,
            startOffset: { x: startCenterOffsetX, y: startCenterOffsetY },
            allChars: allChars
        };
    }, [font, text, width, height]);

    if (error) return null;
    if (!paths || durationFrames <= 0) return null;

    // Render each character
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{ 
                    filter: `drop-shadow(0 0 10px rgba(59, 222, 255, 0.8))`
                }}
            >
                {paths.allChars.map((charData, index) => (
                    <MorphingChar 
                        key={index}
                        index={index}
                        totalChars={paths.allChars.length}
                        startPath={paths.start}
                        endPath={charData.endPath}
                        startOffset={paths.startOffset}
                        endOffset={charData.endOffset}
                        currentRelativeFrame={currentRelativeFrame}
                        durationFrames={durationFrames}
                        width={width}
                    />
                ))}
            </svg>
        </AbsoluteFill>
    );
};

interface MorphingCharProps {
    index: number;
    totalChars: number;
    startPath: string;
    endPath: string;
    startOffset: { x: number, y: number };
    endOffset: { x: number, y: number };
    currentRelativeFrame: number;
    durationFrames: number;
    width: number;
}

const MorphingChar: React.FC<MorphingCharProps> = ({
    index, totalChars, startPath, endPath, startOffset, endOffset, currentRelativeFrame, durationFrames, width
}) => {
    const pathRef = React.useRef<SVGPathElement>(null);
    
    // Stagger delay based on index
    const staggerDelay = durationFrames * 0.05 * index;
    const charDuration = durationFrames * 0.4;
    
    // アニメーション進捗 (0 to 1) - Elastic Easingで勢いよく
    const progress = interpolate(
        currentRelativeFrame - staggerDelay,
        [0, charDuration], 
        [0, 1],
        { 
            extrapolateLeft: 'clamp', 
            extrapolateRight: 'clamp',
            easing: Easing.elastic(1.0), 
        }
    );

    // スケールアニメーション (Impact) - 変形完了時にボンッと拡大
    const scale = interpolate(
        currentRelativeFrame - staggerDelay,
        [0, charDuration, charDuration + 5, charDuration + 10], // 少し調整
        [0.0, 1.2, 0.9, 1.0], // 初期0 -> 拡大 -> 収縮 -> 正常 (Pop up effect)
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.exp)
        }
    );

    // --- Ado Style "Flashy" Logic ---

    // --- Character-Themed Color Palette ---
    const offWhite = "#F8F9FA";
    const softLavender = "#B19CD9";
    const sunsetOrange = "#FF9E7D";

    // 1. Color Interpolation
    // Fill: Always Off-white
    const finalFillColor = offWhite;

    // Stroke: Transition between Lavender and Orange
    const finalStrokeColor = interpolateColors(progress, [0, 1], [softLavender, sunsetOrange]);
    
    // Ghost colors for RGB split (Themed)
    const colorChannel1 = softLavender;
    const colorChannel2 = sunsetOrange;

    // Extra: If you want RGB color parts for the filter shadow
    const strokeR = interpolate(progress, [0, 1], [177, 255]); // 177 (Lavender R) -> 255 (Orange R)
    const strokeG = interpolate(progress, [0, 1], [156, 158]); // 156 (Lavender G) -> 158 (Orange G)
    const strokeB = interpolate(progress, [0, 1], [217, 125]); // 217 (Lavender B) -> 125 (Orange B)

    // 2. Glitch / Shake
    // Use `random` based on frame to create jitter
    // Only shake during morphing (progress < 1)
    const isMorphing = progress < 1;
    
    // Jitter amount decreases as progress -> 1
    const jitterIntensity = isMorphing ? interpolate(progress, [0, 0.8, 1], [15, 5, 0]) : 0;
    const jitterX = (Math.sin(currentRelativeFrame * 0.8 + index) * jitterIntensity);
    const jitterY = (Math.cos(currentRelativeFrame * 1.2 + index) * jitterIntensity);

    // 3. Chromatic Aberration (RGB Split)
    // We will render 3 copies of the path (Red, Green, Blue) with offsets
    const rgbOffset = interpolate(progress, [0, 0.2, 1], [0, 20, 0]); // Explosion of color -> Converge

    // Base Position
    const currentX = interpolate(progress, [0, 1], [startOffset.x, endOffset.x]) + jitterX;
    const currentY = interpolate(progress, [0, 1], [startOffset.y, endOffset.y]) + jitterY;

    // Stroke Width: Thick -> Thick (Faux Bold)
    // Initial: width * 0.03 (Very Thick) -> Final: width * 0.015 (Bold)
    // User requested "Thicker font", so we keep the stroke significant.
    const currentStrokeWidth = interpolate(progress, [0, 1], [width * 0.03, width * 0.015]);

    // Opacity for RGB channels (Ghosting effect)
    const ghostOpacity = interpolate(progress, [0, 1], [0.8, 0]);

    return (
        <g 
            style={{ 
                filter: `drop-shadow(0 0 15px rgba(${Math.round(strokeR)}, ${Math.round(strokeG)}, ${Math.round(strokeB)}, 0.8))`, // Neon Glow
                transform: `scale(${scale})`, 
                transformOrigin: `${width/2}px ${startOffset.y}px`
            }}
        >
            {/* Red Channel - Shifted Left/Top */}
            {/* This path was removed as it was not being used for morphing and was replaced by <use> tags */}
            
            {/* We use ID for reuse to sync morphing efficiently */}
            <defs>
                <path id={`morph-${index}`} d={startPath} /> 
                {/* Wait, GsapSync targets a ref. We can put the ref on the main visible element or a defs element. */}
            </defs>

            {/* Cyan/Blue Channel - Shifted Right/Bottom */}
            {/* This path was removed as it was not being used for morphing and was replaced by <use> tags */}
             
            {/* 4. Stroke Layer (Background) */}
            {/* Render this FIRST so it sits behind the fill */}
            <path
                id={`char-stroke-${index}`}
                d={startPath} // Controlled by GSAP via ref? No, we need to sync this too.
                // We'll use the main ref on the Fill path, and use <use> for the stroke?
                // OR easier: Just put the ref on the stroke path if GSAP morphs geometry?
                // GSAP morphs the `d` attribute.
                // If we use <use>, the `d` is inherited from the ID.
                // So...
                // 1. Define the geometry in <defs><path id="geom" ... ref={pathRef} /></defs> (Invisible)
                // 2. <use href="#geom" stroke="..." />
                // 3. <use href="#geom" fill="..." />
                // This guarantees perfect sync and layering!
            />
            
            <defs>
                {/* The Master Geometry - Morphed by GSAP */}
                {/* We render it invisible, just as a source for <use> */}
                <path 
                    ref={pathRef} 
                    id={`char-geom-${index}`} 
                    d={startPath} 
                />
            </defs>

            {/* 0. Ground Black Border (For Readability) */}
            <use
                href={`#char-geom-${index}`}
                transform={`translate(${currentX}, ${currentY})`}
                fill="none"
                stroke="black"
                strokeWidth={currentStrokeWidth + 10}
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* Stroke Layer (Thick Outline) */}
            <use
                href={`#char-geom-${index}`}
                transform={`translate(${currentX}, ${currentY})`}
                fill="none"
                stroke={finalStrokeColor}
                strokeWidth={currentStrokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                    filter: `drop-shadow(0 0 5px ${finalStrokeColor})`
                }}
            />

             {/* RGB Split Ghost 1 (Lavender) */}
            <use 
                href={`#char-geom-${index}`} 
                transform={`translate(${currentX - rgbOffset}, ${currentY - rgbOffset})`}
                fill="none" 
                stroke={colorChannel1} 
                strokeWidth={currentStrokeWidth * 0.5} 
                style={{ mixBlendMode: 'screen', opacity: ghostOpacity }}
            />

             {/* RGB Split Ghost 2 (Sunset Orange) */}
             <use 
                href={`#char-geom-${index}`} 
                transform={`translate(${currentX + rgbOffset}, ${currentY + rgbOffset})`}
                fill="none" 
                stroke={colorChannel2} 
                strokeWidth={currentStrokeWidth * 0.5}
                style={{ mixBlendMode: 'screen', opacity: ghostOpacity }}
            />

            {/* 5. Fill Layer (Foreground) */}
            {/* Render this LAST so it is on Top */}
            <use
                href={`#char-geom-${index}`}
                transform={`translate(${currentX}, ${currentY})`}
                fill={finalFillColor}
                stroke="none" // No stroke on the fill layer
            />

            <GsapSync 
                progress={progress} 
                startPath={startPath}
                endPath={endPath} 
                pathRef={pathRef} 
            />
        </g>
    );
};

const GsapSync: React.FC<{ 
    progress: number; 
    startPath: string;
    endPath: string; 
    pathRef: React.RefObject<SVGPathElement> 
}> = ({ 
    progress, startPath, endPath, pathRef 
}) => {
    const tweenRef = React.useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (!pathRef.current || !startPath || !endPath) return;

        gsap.set(pathRef.current, { attr: { d: startPath } });

        tweenRef.current = gsap.to(pathRef.current, {
            morphSVG: {
                shape: endPath,
                shapeIndex: "auto",
            },
            duration: 1,
            paused: true,
            immediateRender: true
        });

        return () => {
            if (tweenRef.current) {
                tweenRef.current.kill();
            }
        };
    }, [startPath, endPath, pathRef]);

    useEffect(() => {
        if (tweenRef.current) {
            tweenRef.current.progress(progress);
        }
    }, [progress]);

    return null;
};
