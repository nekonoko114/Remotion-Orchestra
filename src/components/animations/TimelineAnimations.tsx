import type React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const PanAnimation: React.FC<{
  from: number;
  to: number;
  duration: number;
  children: React.ReactNode;
}> = ({ from, to, duration, children }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, duration], [from, to], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{ transform: `translateX(${x}%)`, width: '100%', height: '100%' }}
    >
      {children}
    </div>
  );
};

export const SpringAnimation: React.FC<{
  stiffness: number;
  damping: number;
  children: React.ReactNode;
}> = ({ stiffness, damping, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { stiffness, damping },
  });

  return (
    <div
      style={{
        transform: `scale(${spr})`,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
};
