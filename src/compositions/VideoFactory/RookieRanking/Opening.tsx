import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { HalftoneBackground, SpeedLines, AmecomiTextStyle } from './AmecomiElements';
import { useBeat, BeatShake, GlitchOverlay } from './BeatSync';

// 3D Star Component
type StarProps = {
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  bpm: number;
};

const Star: React.FC<StarProps> = ({ color, position, rotation, bpm }) => {
  const { kickStrength } = useBeat(bpm);
  const scale = 1 + kickStrength * 0.2;

  return (
    <mesh position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2 + kickStrength * 4}
      />
    </mesh>
  );
};

// 3D Scene containing the stars
const StarsScene: React.FC<{ bpm: number }> = ({ bpm }) => {
  const frame = useCurrentFrame();
  const rotation = frame * 0.02;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Star bpm={bpm} color="#FFD700" position={[0, 1, 0]} rotation={[0, rotation, 0]} />
      <Star bpm={bpm} color="#C0C0C0" position={[-8, 4, -10]} rotation={[rotation, 0, rotation]} />
      <Star bpm={bpm} color="#CD7F32" position={[8, -5, -8]} rotation={[0, -rotation, rotation]} />
    </>
  );
};

export const Opening: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { kickStrength } = useBeat(bpm);

  // Entrance animation for text
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const baseScale = interpolate(entrance, [0, 1], [0.5, 1.2]);
  const textOpacity = interpolate(entrance, [0, 1], [0, 1]);
  
  // Beat Pulse
  const textScale = baseScale + kickStrength * 0.15;
  const glowIntensity = kickStrength * 50;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        {/* 3D Background */}
        <ThreeCanvas width={width} height={height}>
          <StarsScene bpm={bpm} />
        </ThreeCanvas>

        {/* Amecomi Effects */}
        <HalftoneBackground color="rgba(26, 26, 46, 0.4)" />
        <SpeedLines />

        {/* Main Vertical Title */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            ...AmecomiTextStyle,
            writingMode: 'vertical-rl',
            fontSize: 280,
            opacity: textOpacity,
            transform: `scale(${textScale}) rotate(-5deg)`,
            textOrientation: 'upright',
            filter: `drop-shadow(0 0 ${20 + glowIntensity}px rgba(255, 215, 0, 0.6))`,
          }}>
            新人王
          </div>
        </AbsoluteFill>

        {/* Subtext */}
        <div style={{
          position: 'absolute',
          bottom: 100,
          width: '100%',
          textAlign: 'center',
          fontSize: 60,
          color: 'white',
          fontWeight: 'bold',
          textShadow: '2px 2px 10px black',
          letterSpacing: 20,
          opacity: textOpacity,
          transform: `translateY(${kickStrength * -10}px)`,
        }}>
          J.O.L ROOKIE RANKING
        </div>
      </BeatShake>
    </AbsoluteFill>
  );
};
