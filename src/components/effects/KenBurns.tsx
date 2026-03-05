import type React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface KenBurnsProps {
  src: string;
  intensity?: number; // 0 to 10 scale? or simpler multiplier. Default 1 (10% movement)
  direction?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'random';
  durationInFrames?: number; // Optional override, otherwise inherits config
  scale?: number; // Base scale, default 1.1 to avoid edges if panning
  children?: React.ReactNode;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  intensity = 1,
  direction = 'zoomIn',
  scale = 1.25, // Start slightly zoomed in so we have room to move
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // intensity 1 = 10% movement typical
  // map intensity to scale delta
  const movement = 0.1 * intensity;

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Calculate transform based on direction
  const getTransform = () => {
    switch (direction) {
      case 'zoomIn':
        return `scale(${interpolate(progress, [0, 1], [1, 1 + movement])})`;
      case 'zoomOut':
        return `scale(${interpolate(progress, [0, 1], [scale, scale - movement])})`;
      case 'panLeft':
        return `scale(${scale}) translateX(${interpolate(progress, [0, 1], [0, -5 * intensity])}%)`;
      case 'panRight':
        return `scale(${scale}) translateX(${interpolate(progress, [0, 1], [0, 5 * intensity])}%)`;
      default:
        // Simple Zoom In fallback
        return `scale(${interpolate(progress, [0, 1], [1, 1 + movement])})`;
    }
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: getTransform(),
          transformOrigin: 'center center',
          position: 'absolute',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
