import React from 'react';
import { AbsoluteFill } from 'remotion';

// Sequence 4: Interlude (1:24 - 1:45)
// Theme: Warmth, Flashback
export const InterludeSequence: React.FC<{ beat?: number }> = ({
  beat = 0,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#302010' }}>
      {/* Warm light and flashbacks */}
      <div style={{ color: 'orange' }}>Sequence 4: Interlude</div>
    </AbsoluteFill>
  );
};
