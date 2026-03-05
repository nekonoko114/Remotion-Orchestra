import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { random } from 'remotion';
import * as THREE from 'three';

export const NeonParticles = () => {
  const count = 500;
  const mesh = useRef<THREE.Points>(null!);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread particles across a wide area appropriate for the scene
      positions[i * 3] = (random(i) - 0.5) * 20;
      positions[i * 3 + 1] = (random(i + 1) - 0.5) * 20;
      positions[i * 3 + 2] = (random(i + 2) - 0.5) * 10; // Depth
    }
    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    // Rotate the entire particle system slowly
    mesh.current.rotation.y = clock.getElapsedTime() * 0.05;
    // Pulse scale slightly for a "breathing" effect
    const scale = 1 + Math.sin(clock.getElapsedTime()) * 0.05;
    mesh.current.scale.set(scale, scale, scale);
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00ffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
};
