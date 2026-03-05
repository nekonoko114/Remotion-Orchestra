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
 * 3Dカードフリップトランジション
 */
export const FlipTransition: React.FC<TransitionProps> = ({
  from,
  to,
  durationInFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    durationInFrames,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const rotation = interpolate(progress, [0, 1], [0, 180]);
  const scale = interpolate(progress, [0, 0.5, 1], [1, 0.8, 1]);

  return (
    <AbsoluteFill style={{ perspective: 2000 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg) scale(${scale})`,
        }}
      >
        {/* 表面（From） */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            zIndex: progress < 0.5 ? 2 : 1,
          }}
        >
          {from}
        </div>

        {/* 裏面（To） */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            zIndex: progress >= 0.5 ? 2 : 1,
          }}
        >
          {to}
        </div>
      </div>

      {/* 回転時のドラマチックな影 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          opacity: interpolate(progress, [0, 0.5, 1], [0, 0.4, 0]),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
