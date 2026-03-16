import React from 'react';
import { useVideoConfig, spring, random, Img } from 'remotion';

export interface DoublingGridEffectProps {
  imageSrc: string;
  frame: number;
  themeColor: string;
  seedName?: string;
}

export const DoublingGridEffect: React.FC<DoublingGridEffectProps> = ({
  imageSrc,
  frame,
  themeColor,
  seedName = 'doubling-effect',
}) => {
  const { fps } = useVideoConfig();

  const sequence = [16, 9, 4, 2, 1];
  const fpb = 30 / (174 / 30);
  const beatInterval = 6;
  const exponent = Math.floor(frame / (fpb * beatInterval));
  const count = sequence[Math.min(exponent, sequence.length - 1)];
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {count === 1 ? (
        <div 
          style={{ 
            width: 800, 
            height: 800, 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '15px solid #fff', 
            boxShadow: `0 0 100px ${themeColor}, 0 0 50px ${themeColor}`, 
            transform: `scale(${spring({ frame: frame % (fpb * beatInterval), fps, config: { stiffness: 200, damping: 20 } })})` 
          }}
        >
          <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${cols}, 1fr)`, 
            gridTemplateRows: `repeat(${rows}, 1fr)`, 
            gap: `${Math.max(2, 5 - exponent * 2)}px`, 
            padding: '10px 0', 
            width: '100%', 
            height: '100%', 
            boxSizing: 'border-box' 
          }}
        >
          {new Array(count).fill(0).map((_, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'relative', 
                width: '100%', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: `${Math.max(1, 4 - exponent * 0.5)}px solid ${themeColor}`, 
                transform: `scale(${spring({ frame: frame % 30, fps, config: { stiffness: 1000, damping: 50, mass: 0.5 } })}) rotate(${(random(i + seedName + exponent) - 0.5) * 5}deg)`, 
                boxShadow: `0 0 ${Math.max(5, 20 - exponent * 3)}px rgba(255,165,0,0.5)`, 
                margin: 'auto' 
              }}
            >
              <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
