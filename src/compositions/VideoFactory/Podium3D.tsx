import { ThreeCanvas } from '@remotion/three';
import { useRef } from 'react';
import { random, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';

// Floating Particles Component
const Particles: React.FC<{ count: number }> = ({ count }) => {
  const particles = new Array(count).fill(0).map((_, i) => {
    const seed = `particle-${i}`;
    const x = (random(`${seed}x`) - 0.5) * 20;
    const y = (random(`${seed}y`) - 0.5) * 20;
    const z = -5 + random(`${seed}z`) * 10;
    const scale = 0.05 + random(`${seed}scale`) * 0.1;
    const frame = useCurrentFrame();

    // Float upward
    const yPos = y + ((frame * 0.02) % 10);

    return (
      <mesh key={i} position={[x, yPos, z]} scale={[scale, scale, scale]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    );
  });
  return <group>{particles}</group>;
};

const PodiumMesh: React.FC = () => {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Top Platform - Shiny Marble-like */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[4.5, 4.5, 0.5, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.05} // Very shiny
          metalness={0.9}
        />
      </mesh>
      {/* Base - dark gloss */}
      <mesh position={[0, -1.25, 0]} receiveShadow>
        <cylinderGeometry args={[5.5, 5.5, 2.5, 64]} />
        <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Gold Ring Trim - Top */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[4.55, 4.55, 0.05, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={1}
          roughness={0.05}
          emissive="#FFD700"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Gold Ring Trim - Bottom */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[5.55, 5.55, 0.1, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={1}
          roughness={0.05}
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Volumetric Cone (Fake) for Spotlight beam */}
      <mesh position={[0, 5, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[4, 15, 32, 1, true]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export const Podium3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Subtle camera drift
  const cameraX = Math.sin(frame * 0.005) * 0.8;
  const cameraY = 4 + Math.cos(frame * 0.005) * 0.5;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ backgroundColor: 'transparent' }}
      camera={{ position: [cameraX, cameraY, 12], fov: 40 }}
    >
      {/* Atmospheric Lighting */}
      <ambientLight intensity={0.2} />

      {/* Main Spotlight shining down */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow
      />
      {/* Gold Fill Light */}
      <spotLight
        position={[-8, 5, 8]}
        angle={0.6}
        penumbra={1}
        intensity={1.5}
        color="#FFC125" // Golden hue
      />
      {/* Rim Light for edges */}
      <pointLight position={[5, 2, -5]} intensity={2} color="#44aadd" />

      <PodiumMesh />
      <Particles count={50} />
    </ThreeCanvas>
  );
};
