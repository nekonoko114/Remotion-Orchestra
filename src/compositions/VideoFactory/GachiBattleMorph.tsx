import React, { useMemo, useEffect, useState } from 'react';
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  AbsoluteFill,
  spring,
} from 'remotion';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import * as opentype from 'opentype.js';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(MorphSVGPlugin);
}

// フォントのキャッシュ
let cachedFont: opentype.Font | null = null;

export const GachiBattleMorph: React.FC<{
  pulse: number;
}> = ({ pulse }) => {
  const { width, height } = useVideoConfig();
  const [font, setFont] = useState<opentype.Font | null>(cachedFont);

  const text = "ガチバトル";

  useEffect(() => {
    if (cachedFont) return;
    const FONT_URL = '/fonts/851MkPOP_101.ttf';
    const fontPath = staticFile(FONT_URL);
    opentype.load(fontPath, (err, loadedFont) => {
      if (err) {
        console.error('Font could not be loaded:', err);
      } else if (loadedFont) {
        cachedFont = loadedFont;
        setFont(loadedFont);
      }
    });
  }, []);

  const paths = useMemo(() => {
    if (!font) return null;

    const fontSize = 160; 
    const glyphs = font.getPaths(text, 0, 0, fontSize);
    
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    glyphs.forEach(p => {
        const b = p.getBoundingBox();
        if (b.x1 < minX) minX = b.x1;
        if (b.x2 > maxX) maxX = b.x2;
        if (b.y1 < minY) minY = b.y1;
        if (b.y2 > maxY) maxY = b.y2;
    });

    const globalOffsetX = width / 2 - (minX + maxX) / 2;
    const globalOffsetY = height / 2 - (minY + maxY) / 2;

    return glyphs.map((p, i) => {
      const b = p.getBoundingBox();
      return {
        pathData: p.toPathData(2),
        globalX: globalOffsetX,
        globalY: globalOffsetY,
        centerX: (b.x1 + b.x2) / 2,
        centerY: (b.y1 + b.y2) / 2,
      };
    });
  }, [font, width, height]);

  if (!paths) return null;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
        </defs>
        {paths.map((p, i) => (
          <MorphChar 
            key={i} 
            index={i} 
            targetPath={p.pathData} 
            globalX={p.globalX} 
            globalY={p.globalY} 
            centerX={p.centerX}
            centerY={p.centerY}
            pulse={pulse}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const MorphChar: React.FC<{
  index: number;
  targetPath: string;
  globalX: number;
  globalY: number;
  centerX: number;
  centerY: number;
  pulse: number;
}> = ({ index, targetPath, globalX, globalY, centerX, centerY, pulse }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pathRef = React.useRef<SVGPathElement>(null);

  const delay = index * 3;
  const animFrame = frame - delay;

  useEffect(() => {
    if (!pathRef.current) return;
    
    // 最初は円（各文字の中心座標に配置）
    const startPath = `M ${centerX + 50},${centerY} C ${centerX + 50},${centerY + 27.6} ${centerX + 27.6},${centerY + 50} ${centerX},${centerY + 50} C ${centerX - 27.6},${centerY + 50} ${centerX - 50},${centerY + 27.6} ${centerX - 50},${centerY} C ${centerX - 50},${centerY - 27.6} ${centerX - 27.6},${centerY - 50} ${centerX},${centerY - 50} C ${centerX + 27.6},${centerY - 50} ${centerX + 50},${centerY - 27.6} ${centerX + 50},${centerY} Z`;
    
    gsap.set(pathRef.current, { attr: { d: startPath } });
    
    const tween = gsap.to(pathRef.current, {
      morphSVG: targetPath,
      duration: 1,
      paused: true,
      ease: "elastic.out(1, 0.5)"
    });

    const progress = interpolate(animFrame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });
    
    tween.progress(progress);

    return () => {
        tween.kill();
    };
  }, [targetPath, animFrame, centerX, centerY]);

  const opacity = interpolate(animFrame, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = spring({
    frame: animFrame,
    fps,
    config: { stiffness: 200, damping: 10 }
  }) * (1 + pulse * 0.1);

  // 各文字の中心を基準点にしてスケーリングを適用する変形行列
  const transform = `translate(${globalX}, ${globalY}) translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`;

  return (
    <g transform={transform}>
        <path
            ref={pathRef}
            fill="url(#textGrad)"
            stroke="#FF4500"
            strokeWidth="10"
            strokeLinejoin="round"
            opacity={opacity}
            filter="url(#glow)"
        />
    </g>
  );
};
