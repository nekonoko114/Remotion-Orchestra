import React from 'react';
import { AbsoluteFill, useCurrentFrame, Sequence } from 'remotion';
import { AdvancedMagicCircle } from '../Battles/shared/AdvancedMagicCircle';

export const AdvancedMagicCircleShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#050510', color: 'white' }}>
      <h1 style={{ 
        position: 'absolute', 
        top: 40, 
        left: 40, 
        fontFamily: 'system-ui',
        fontSize: 48,
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(255,255,255,0.5)',
        zIndex: 100
      }}>
        Advanced Magic Circle Showcase
      </h1>

      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', bottom: 40, left: 40, fontSize: 32, fontFamily: 'system-ui', color: '#00f3ff' }}>
            Elemental Blue (Default)
          </div>
          <AdvancedMagicCircle frame={frame} color="#00f3ff" size={800} startDelay={10} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={150} durationInFrames={150}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', bottom: 40, left: 40, fontSize: 32, fontFamily: 'system-ui', color: '#ff3366' }}>
            Demonic Crimson
          </div>
          <AdvancedMagicCircle frame={frame - 150} color="#ff3366" size={800} startDelay={10} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={300} durationInFrames={150}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', bottom: 40, left: 40, fontSize: 32, fontFamily: 'system-ui', color: '#ffd700' }}>
            Holy Golden Radiance
          </div>
          <AdvancedMagicCircle frame={frame - 300} color="#ffd700" size={1000} startDelay={10} tiltAngle={80} />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
