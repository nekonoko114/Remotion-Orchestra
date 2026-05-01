import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, random } from 'remotion'; // randomを追加
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Environment, Sparkles } from '@react-three/drei';

type Props = {
  rank: number;
};

export const GridBridge3DScene: React.FC<Props> = ({ rank }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 序数表記を正しく修正 (1st, 2nd, 3rd, 4th...)
  const rankText = useMemo(() => {
    return rank + "th";
  }, [rank]);

  const expand = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 50 },
  });

  const cameraZ = interpolate(expand, [0, 1], [40, 15]);
  const textRotateX = interpolate(expand, [0, 1], [Math.PI / 2, 0]);

  useFrame((state) => {
    state.camera.position.z = cameraZ;
    // 1. カメラの上下揺れを停止 (固定値 0 に設定、またはここを削除)
    state.camera.position.y = 0; 
    state.camera.lookAt(0, 0, 0);
  });

  const goldMaterialProps = {
    color: '#FFF2C8',
    emissive: '#332200',
    roughness: 0.1, 
    metalness: 1.0, 
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  };

  const goldColor = "#FFF8E7";

  return (
    <>
      <color attach="background" args={['#000205']} />
      <Environment preset="city" />
      <ambientLight intensity={2.0} />
      {/* ... ライト設定は変更なし ... */}

      <group>
        {/* 背景のグリッド */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -12, 0]}>
          <planeGeometry args={[150, 150, 30, 30]} />
          <meshBasicMaterial color="#FFD700" wireframe transparent opacity={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 12, 0]}>
          <planeGeometry args={[150, 150, 30, 30]} />
          <meshBasicMaterial color="#FFD700" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      <RisingParticles count={300} color={goldColor} />
      <FloatingShards count={100} materialProps={goldMaterialProps} />
      <Sparkles count={400} scale={50} size={4.0} speed={0.4} color={goldColor} opacity={1.0} />

      <group rotation={[textRotateX, 0, 0]}>
        <Center position={[0, 4.8, 1]}>
          <mesh>
            <boxGeometry args={[16, 0.18, 0.18]} />
            <meshPhysicalMaterial {...goldMaterialProps} emissive="#FFD700" emissiveIntensity={2} />
          </mesh>
        </Center>
        
        {/* 2. <Float> を削除し、揺れを完全に停止 */}
        <Center position={[0, 0, 2]}>
          <Text3D
            font={staticFile('fonts/helvetiker_regular.typeface.json')}
            size={4.2}
            height={1.2}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.4}
            bevelSize={0.12}
            bevelOffset={0}
            bevelSegments={12}
            letterSpacing={0.15}
          >
            {rankText}
            <meshPhysicalMaterial 
              {...goldMaterialProps} 
              emissive="#FFF2C8" 
              emissiveIntensity={0.8} 
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </Text3D>
        </Center>
        
        <Center position={[0, -4.8, 1]}>
          <mesh>
            <boxGeometry args={[16, 0.18, 0.18]} />
            <meshPhysicalMaterial {...goldMaterialProps} emissive="#FFD700" emissiveIntensity={2} />
          </mesh>
        </Center>
      </group>
    </>
  );
};

const RisingParticles: React.FC<{ count: number; color: string }> = ({ count, color }) => {
  const frame = useCurrentFrame();
  
  // 2. Math.random() を Remotion の random() に置き換え
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: (random(`p-x-${i}`) - 0.5) * 80,
      y: (random(`p-y-${i}`) - 0.5) * 60,
      z: (random(`p-z-${i}`) - 0.5) * 40,
      speed: 0.15 + random(`p-s-${i}`) * 0.25, 
      size: 0.02 + random(`p-size-${i}`) * 0.04,
    }));
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => {
        const yPos = ((p.y + frame * p.speed + 40) % 80) - 40;
        return (
          <mesh key={i} position={[p.x, yPos, p.z]}>
            <sphereGeometry args={[p.size, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={1} />
          </mesh>
        );
      })}
    </group>
  );
};

const FloatingShards: React.FC<{ count: number; materialProps: any }> = ({ count, materialProps }) => {
  const frame = useCurrentFrame();
  
  // 3. Math.random() を Remotion の random() に置き換え
  const shards = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (random(`s-pos-x-${i}`) - 0.5) * 70,
        (random(`s-pos-y-${i}`) - 0.5) * 40,
        (random(`s-pos-z-${i}`) - 0.5) * 50,
      ] as [number, number, number],
      rotationSpeed: [
        random(`s-rot-x-${i}`) * 0.03,
        random(`s-rot-y-${i}`) * 0.03,
        random(`s-rot-z-${i}`) * 0.03,
      ] as [number, number, number],
      size: 0.3 + random(`s-size-${i}`) * 0.5,
    }));
  }, [count]);

  return (
    <group>
      {shards.map((s, i) => (
        <mesh 
          key={i} 
          position={s.position} 
          rotation={[
            frame * s.rotationSpeed[0],
            frame * s.rotationSpeed[1],
            frame * s.rotationSpeed[2]
          ]}
        >
          <icosahedronGeometry args={[s.size, 0]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      ))}
    </group>
  );
};