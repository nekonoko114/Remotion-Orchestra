import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { GridBridge3DScene } from './GridBridge3DScene';

type Props = {
  rank: number;
};

export const GridBridge: React.FC<Props> = ({ rank }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} linear>
        <GridBridge3DScene rank={rank} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
