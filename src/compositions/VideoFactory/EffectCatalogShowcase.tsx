import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { EffectCatalog } from './components/EffectCatalog/effect-catalog';
import { VideoEffectBuilder } from './components/EffectCatalog/VideoEffectBuilder';

// Each effect gets 90 frames (3 seconds)
export const EFFECT_SHOWCASE_DURATION = 90;

export const EffectCatalogShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#111', overflow: 'hidden' }}>
      {/* Title that stays on top permanently */}
      <h1 style={{ 
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        color: '#fff', 
        fontSize: 40, 
        fontFamily: 'system-ui, sans-serif', 
        textAlign: 'center',
        margin: 0,
        textShadow: '0 0 20px rgba(255,255,255,0.5)',
        zIndex: 100,
      }}>
        Video Effect Catalog Showcase
      </h1>

      {/* Sequentially play each effect layout */}
      {EffectCatalog.map((recipe, index) => {
        const startFrame = index * EFFECT_SHOWCASE_DURATION;
        
        return (
          <Sequence key={recipe.id} from={startFrame} durationInFrames={EFFECT_SHOWCASE_DURATION}>
            {/* Dark background for the slide */}
            <AbsoluteFill style={{ backgroundColor: '#000' }}>
              
              {/* The Effect Itself */}
              <VideoEffectBuilder recipe={recipe} />
              
              {/* Info Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '30px 60px',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: 20,
                color: '#fff',
                fontFamily: 'system-ui, sans-serif',
                zIndex: 10,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, fontWeight: 'bold' }}>{recipe.name}</div>
                <div style={{ fontSize: 24, color: '#aaa', marginTop: 10 }}>
                  <span style={{ color: '#0f0' }}>mode:</span> {recipe.blendMode || 'normal'} /  
                  {recipe.hueRotate ? ` hue: ${recipe.hueRotate}°` : ''}
                  {recipe.blur ? ` blur: ${recipe.blur}px` : ''}
                  {recipe.noiseIntensity ? ` noise: ${recipe.noiseIntensity}` : ''}
                </div>
              </div>

              {/* Counter / Progress */}
              <div style={{
                position: 'absolute',
                top: 40,
                left: 40,
                background: 'rgba(255,255,255,0.2)',
                padding: '10px 20px',
                borderRadius: 30,
                color: 'white',
                fontSize: 24,
                fontFamily: 'system-ui',
                zIndex: 100
              }}>
                {index + 1} / {EffectCatalog.length}
              </div>

            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
