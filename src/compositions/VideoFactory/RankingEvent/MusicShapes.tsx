import React from 'react';
import { AbsoluteFill, useVideoConfig, interpolate, random, spring } from 'remotion';
import { useBeatValue } from '../utils/beat-sync';

const BPM = 95;

const BRIDGE_START = 1123;

const PUZZLE_PIECES = [
  // Piece A: Right Tab, Bottom Tab
  (color: string) => (
    <svg width="150" height="150" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 20px ${color})` }}>
      <path d="M20 20 H40 Q50 10 60 20 H80 V40 Q90 50 80 60 V80 H60 Q50 90 40 80 H20 V60 Q10 50 20 40 Z" fill={color} />
    </svg>
  ),
  // Piece B: Top Tab, Left Tab
  (color: string) => (
    <svg width="150" height="150" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 20px ${color})` }}>
      <path d="M20 20 Q30 10 40 20 H80 V40 Q70 50 80 60 V80 H40 Q30 90 20 80 V60 Q30 50 20 40 Z" fill={color} />
    </svg>
  ),
  // Piece C: All Tabs
  (color: string) => (
    <svg width="150" height="150" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 20px ${color})` }}>
      <path d="M20 20 Q30 10 40 20 H60 Q70 10 80 20 V40 Q90 50 80 60 V80 H60 Q50 90 40 80 H20 V60 Q10 50 20 40 Z" fill={color} />
    </svg>
  ),
];

const Shape: React.FC<{
  seed: number;
  color: string;
  pieceIndex: number;
  index: number;
  absoluteFrame: number;
}> = ({ seed, color, pieceIndex, index, absoluteFrame }) => {
  const { fps } = useVideoConfig();
  const { pulse, framesPerBeat } = useBeatValue(BPM);

  const frame = absoluteFrame;
  const localFrame = frame - BRIDGE_START;
  const startBeatIndex = index * 0.3; // Staggered every 0.3 beats
  const startFrame = startBeatIndex * framesPerBeat;

  if (localFrame < startFrame) return null;

  const x = random(`${seed}-x`) * 100;
  const y = random(`${seed}-y`) * 100;
  const initialScale = random(`${seed}-scale`) * 0.4 + 0.8;
  const rotation = random(`${seed}-rot`) * 360 + frame * (random(`${seed}-rot-speed`) - 0.5) * 2;

  // Pop animation specifically when first appearing
  const pop = spring({
    frame: localFrame - startFrame,
    fps,
    config: { stiffness: 220, damping: 8 },
  });

  // Continuous pulse after appearing
  const scale = initialScale * (1 + pop * 0.3 + pulse * 0.1);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        opacity,
      }}
    >
      {PUZZLE_PIECES[pieceIndex % PUZZLE_PIECES.length](color)}
    </div>
  );
};

export const MusicShapes: React.FC<{ absoluteFrame: number }> = ({ absoluteFrame }) => {
  const colors = ['#00FF7F', '#FFDC2F', '#FF00FF', '#00FFFF', '#FF4500'];

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0)' }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Shape
          key={i}
          index={i}
          absoluteFrame={absoluteFrame}
          seed={i + 500}
          color={colors[i % colors.length]}
          pieceIndex={i}
        />
      ))}
    </AbsoluteFill>
  );
};
