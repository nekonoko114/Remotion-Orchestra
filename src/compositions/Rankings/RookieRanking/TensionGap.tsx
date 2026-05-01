import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GlitchOverlay, BeatShake } from './BeatSync';

export const TensionGap: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        {/* Removed SpeedLines to keep it premium */}
      </BeatShake>
    </AbsoluteFill>
  );
};
