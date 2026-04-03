import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HalftoneBackground, SpeedLines } from './AmecomiElements';
import { GlitchOverlay, BeatShake } from './BeatSync';

export const TensionGap: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        <SpeedLines />
      </BeatShake>
    </AbsoluteFill>
  );
};
