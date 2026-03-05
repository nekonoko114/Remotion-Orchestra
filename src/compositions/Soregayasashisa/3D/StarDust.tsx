import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';

interface StarDustProps {
  audioPower?: number;
}

export const StarDust: React.FC<StarDustProps> = ({ audioPower = 0 }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  // Create random positions and colors once
  const count = 3000;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Random position in a sphere/cloud
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Random colors (Purple/Pink/Blue theme)
      // HSL: 260-320 (Purple-Pink), S: 80%, L: 60%
      color.setHSL(MathUtils.randFloat(0.7, 0.9), 0.8, 0.6);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  // Use ref to keep track of audio power for useFrame without re-binding
  const powerRef = useRef(audioPower);
  useEffect(() => {
    powerRef.current = audioPower;
  }, [audioPower]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    // 極限まで回転を遅くし、雄大な宇宙の動きを表現 (0.05 -> 0.015)
    pointsRef.current.rotation.y = time * 0.015;
    pointsRef.current.rotation.x = time * 0.005;

    // パルス（呼吸）をより深く、ゆっくりにする
    const breath = Math.sin(time * 0.4) * 0.04;

    // 音楽への反応を「キック」から「滲むような揺らぎ」に変更 (0.5 -> 0.12)
    const kick = powerRef.current * 0.12;
    const scale = 1 + breath + kick;

    pointsRef.current.scale.set(scale, scale, scale);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1} // Increased size slightly
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
