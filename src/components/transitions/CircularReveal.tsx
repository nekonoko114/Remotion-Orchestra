import type React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import type { TransitionProps } from '../../types/transitions';

/**
 * 光の輪を伴ったダイナミックな円形トランジション
 */
export const CircularReveal: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 35,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    durationInFrames,
    config: {
      stiffness: 80,
      damping: 15,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 前面（From）は常に表示し、clip-pathで削る */}
      <AbsoluteFill
        style={{
          zIndex: 1,
          clipPath: `circle(${100 - progress * 100}% at center)`,
        }}
      >
        {from}
      </AbsoluteFill>

      {/* 背面（To） */}
      <AbsoluteFill style={{ zIndex: 0 }}>{to}</AbsoluteFill>

      {/* 境界線の光の輪 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${100 - progress * 100}vw`,
          height: `${100 - progress * 100}vw`,
          border: '10px solid #fff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 50px #fff, inset 0 0 50px #fff',
          opacity: interpolate(progress, [0, 0.9, 1], [1, 1, 0]),
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </AbsoluteFill>
  );
};
