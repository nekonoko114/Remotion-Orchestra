import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, random } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { SpeedLines, AmecomiTextStyle } from './AmecomiElements';
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
  const scale = 1;

  // 5角星のジオメトリ
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerR = 1.4;
    const innerR = 0.55;
    const points = 5;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05 });
  }, []);

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2 + kickStrength * 0.4}
        metalness={0.4}
        roughness={0.6}
      />
    </mesh>
  );
};

// 3D Scene containing the stars
const StarsScene: React.FC<{ bpm: number }> = ({ bpm }) => {
  const frame = useCurrentFrame();
  
  // Generate random stars once (Seeded)
  const stars = useMemo(() => {
    const colors = ["#00B0FF", "#00E676", "#FF1744"]; // Vivid Blue, Vivid Green, Vivid Pink
    return Array.from({ length: 20 }).map((_, i) => ({
      color: colors[i % colors.length],
      position: [
        (random(`x-${i}`) - 0.5) * 20, // X: -10 to 10
        (random(`y-${i}`) - 0.5) * 15, // Y: -7.5 to 7.5
        (random(`z-${i}`) - 0.5) * 15 - 5, // Z: -12.5 to 2.5
      ] as [number, number, number],
      rotationOffset: random(`r-${i}`) * Math.PI * 2,
      rotationSpeed: (random(`s-${i}`) - 0.5) * 0.05,
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      {stars.map((star, i) => (
        <Star 
          key={i}
          bpm={bpm} 
          color={star.color} 
          position={star.position} 
          rotation={[
            star.rotationOffset + frame * star.rotationSpeed, 
            star.rotationOffset + frame * 0.02, 
            0
          ]} 
        />
      ))}
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
  const textScale = baseScale;
  const glowIntensity = kickStrength * 50;

  // Master Image Animation
  const masterRotate = frame * 0.2;
  const masterScale = baseScale * 0.8;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        {/* 3D Background */}
        <ThreeCanvas width={width} height={height}>
          <StarsScene bpm={bpm} />
        </ThreeCanvas>

        {/* Master Image Decor (Nanobanana) */}
        <AbsoluteFill style={{ 
          justifyContent: 'center', 
          alignItems: 'center',
          opacity: textOpacity * 0.7,
        }}>
          <div style={{
            width: 1200,
            height: 1200,
            transform: `scale(${masterScale}) rotate(${masterRotate}deg)`,
            filter: `blur(20px) brightness(${1 + kickStrength * 0.5})`,
          }}>
            <Img 
              src={staticFile("assets/titles/rookie_ranking_master.png")} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
        </AbsoluteFill>

        {/* Amecomi Effects */}
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
      </BeatShake>
    </AbsoluteFill>
  );
};
