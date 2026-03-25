import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

// --- Comprehensive SVG Filters Component (14 Types) ---
const SharedFilters = () => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {/* 1. Neon Pink */}
        <filter id="glow-neon-pink" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
          <feMerge><feMergeNode in="blur2" /><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* 2. Gold Luxury */}
        <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feSpecularLighting surfaceScale="5" specularConstant="1" specularExponent="20" lightingColor="#ffd700" in="blur" result="spec">
            <fePointLight x={-500 + Math.sin(frame * 0.1) * 200} y="-500" z="500" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="in" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="spec" /></feMerge>
        </filter>

        {/* 3. Animated Glitch */}
        <filter id="filter-glitch">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feOffset in="red" dx={Math.sin(frame * 0.8) * 15 * (frame % 10 < 2 ? 1 : 0)} dy="0" result="redP" />
            <feOffset in="blue" dx={Math.cos(frame * 0.8) * 15 * (frame % 10 < 2 ? 1 : 0)} dy="0" result="blueP" />
            <feMerge><feMergeNode in="redP" /><feMergeNode in="green" /><feMergeNode in="blueP" /></feMerge>
        </filter>

        {/* 4. Liquid Wave */}
        <filter id="filter-liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" result="noise" seed={Math.floor(frame / 5)} />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* 5. Inner Glow Cyan */}
        <filter id="inner-glow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="out" result="glow" />
          <feFlood floodColor="#00ffff" floodOpacity="0.9" result="color" />
          <feComposite in="color" in2="glow" operator="in" result="innerGlow" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="innerGlow" /></feMerge>
        </filter>

        {/* 6. Posterize Art */}
        <filter id="filter-posterize">
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0.33 0.66 1" />
            <feFuncG type="discrete" tableValues="0 0.33 0.66 1" />
            <feFuncB type="discrete" tableValues="0 0.33 0.66 1" />
          </feComponentTransfer>
        </filter>

        {/* 7. Edge Highlight */}
        <filter id="filter-edge">
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feComposite in="SourceGraphic" in2="SourceGraphic" operator="arithmetic" k1="0" k2="0.5" k3="1" k4="0" />
        </filter>

        {/* 8. Mosaic Pixelate */}
        <filter id="filter-mosaic">
            <feMorphology operator="dilate" radius="4" in="SourceGraphic" result="morphed" />
            <feComponentTransfer in="morphed">
                <feFuncR type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
                <feFuncG type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
                <feFuncB type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
            </feComponentTransfer>
        </filter>

        {/* 9. Emboss 3D */}
        <filter id="filter-emboss">
            <feConvolveMatrix order="3" kernelMatrix="1 1 1 1 -7 1 1 1 1" />
        </filter>

        {/* 10. Heat Haze */}
        <filter id="filter-heat">
            <feTurbulence type="turbulence" baseFrequency="0.05 0.2" numOctaves="2" result="noise" seed={frame % 100} />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>

        {/* 11. Duo-Tone (Cyberpunk) */}
        <filter id="filter-duotone">
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="grey" />
            <feComponentTransfer in="grey">
                <feFuncR type="table" tableValues="0 0 1" />
                <feFuncG type="table" tableValues="0 1 0" />
                <feFuncB type="table" tableValues="1 0 0" />
            </feComponentTransfer>
        </filter>

        {/* 12. Frosted Glass */}
        <filter id="filter-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feComposite in="blur" in2="noise" operator="arithmetic" k1="0" k2="1" k3="0.2" k4="0" />
        </filter>

        {/* 13. Motion Blur (Horizontal) */}
        <filter id="filter-motion">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15 0" />
        </filter>

        {/* 14. Shadow Bloom */}
        <filter id="filter-shadow-bloom">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ff00ff" floodOpacity="1" />
            <feGaussianBlur stdDeviation="30" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
};

// --- Catalog Layout Components ---
const CatalogItem: React.FC<{ 
  title: string, 
  filterId: string, 
  color?: string,
  fontSize?: number
}> = ({ title, filterId, color = "#fff", fontSize = 60 }) => {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.1)',
      margin: 10, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.02)',
      padding: 20, overflow: 'hidden'
    }}>
      <div style={{ color: '#555', fontSize: 14, marginBottom: 10, fontWeight: 'bold' }}>{title}</div>
      <div style={{ 
        fontSize: fontSize, fontWeight: 900, color: color,
        filter: `url(#${filterId})`,
        textAlign: 'center'
      }}>
        SVG
      </div>
      <code style={{ fontSize: 10, color: '#333', marginTop: 15 }}>url(#{filterId})</code>
    </div>
  );
};

export const SvgEffectsCatalog: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', color: '#fff', padding: 40, fontFamily: 'monospace' }}>
      <SharedFilters />
      
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 40, margin: 0, color: '#fff' }}>SVG FILTERS COMPANION</h1>
        <p style={{ color: '#444', fontSize: 16 }}>14 Native High-End Effects for Remotion</p>
      </div>

      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gridTemplateRows: 'repeat(4, 1fr)', 
          height: height * 0.75,
          width: width * 0.9,
          margin: '0 auto',
          gap: 10
      }}>
        <CatalogItem title="01. PINK NEON" filterId="glow-neon-pink" color="#ff7eb9" />
        <CatalogItem title="02. GOLD LUXURY" filterId="glow-gold" color="#ffd700" />
        <CatalogItem title="03. ACTIVE GLITCH" filterId="filter-glitch" color="#fff" />
        <CatalogItem title="04. LIQUID WAVE" filterId="filter-liquid" color="#00ffff" />
        <CatalogItem title="05. INNER GLOW" filterId="inner-glow" color="#fff" />
        <CatalogItem title="06. POSTERIZE" filterId="filter-posterize" color="#facade" />
        <CatalogItem title="07. EDGE DETECT" filterId="filter-edge" color="#fff" />
        <CatalogItem title="08. MOSAIC" filterId="filter-mosaic" color="#ff00ff" />
        <CatalogItem title="09. EMBOSS" filterId="filter-emboss" color="#888" />
        <CatalogItem title="10. HEAT HAZE" filterId="filter-heat" color="#ffaa00" />
        <CatalogItem title="11. DUO-TONE" filterId="filter-duotone" color="#fff" />
        <CatalogItem title="12. FROSTED" filterId="filter-glass" color="#fff" />
        <CatalogItem title="13. MOTION BLUR" filterId="filter-motion" color="#fff" />
        <CatalogItem title="14. SHADOW BLOOM" filterId="filter-shadow-bloom" color="#fff" />
        
        {/* Placeholder for expansion */}
        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', border: '1px dashed #222', borderRadius: 15 }}>
          ADD YOUR OWN...
        </div>
      </div>

      <footer style={{ position: 'absolute', bottom: 30, width: '100%', textAlign: 'center', color: '#222', fontSize: 12 }}>
        REMOTION × NATIVE SVG TECHNOLOGY
      </footer>
    </AbsoluteFill>
  );
};
