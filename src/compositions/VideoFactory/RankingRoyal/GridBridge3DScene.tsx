import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile } from 'remotion';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Environment, Sparkles } from '@react-three/drei';

type Props = {
  rank: number;
};

export const GridBridge3DScene: React.FC<Props> = ({ rank }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ブリッジ用のテキストを順位から生成
  let rankText = "TOP 3";
  if (rank === 3) rankText = "3RD";
  if (rank === 2) rankText = "2ND";
  if (rank === 1) rankText = "1ST";

  const expand = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15, stiffness: 50 },
  });

  // カメラワーク：全体が手前に迫ってくる動き
  const cameraZ = interpolate(expand, [0, 1], [40, 15]);
  
  // 文字の回転：下から起き上がる（シネマティックアプローチ）
  const textRotateX = interpolate(expand, [0, 1], [Math.PI / 2, 0]);

  // Three.js の毎フレーム処理でカメラ位置を動かす
  useFrame((state) => {
    state.camera.position.z = cameraZ;
    // 微小な揺らぎ（手持ちカメラのような呼吸）をZとYに
    state.camera.position.y = Math.sin(frame * 0.05) * 0.5;
    state.camera.lookAt(0, 0, 0);
  });

  // ゴールドマテリアル（リアリティ重視のPBR）
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
      {/* ほぼ黒に近い、非常に深い紺色の背景 */}
      <color attach="background" args={['#000205']} />
      
      {/* 環境光 (IBL) */}
      <Environment preset="city" />
      
      {/* ベースの環境光 */}
      <ambientLight intensity={2.0} />
      
      {/* メインのドラマチックライト - かなり強力に */}
      <directionalLight position={[10, 20, 10]} intensity={30} color="#FFF8E7" />
      
      {/* 画面端から差し込む鮮やかな光 */}
      <pointLight position={[-30, 30, 10]} intensity={5000} color="#00A8FF" distance={100} />
      <pointLight position={[30, -30, 10]} intensity={6000} color="#FFD700" distance={100} />
      
      {/* 上下からグリッドとシャードを照らす */}
      <spotLight position={[0, 40, 0]} intensity={8000} angle={1.2} penumbra={1} color="#FFF2C8" />
      <spotLight position={[0, -40, 0]} intensity={8000} angle={1.2} penumbra={1} color="#FFF2C8" />

      {/* 1. 光るグリッド（地面と天井） */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -12, 0]}>
          <planeGeometry args={[150, 150, 30, 30]} />
          <meshBasicMaterial color="#FFD700" wireframe transparent opacity={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 12, 0]}>
          <planeGeometry args={[150, 150, 30, 30]} />
          <meshBasicMaterial color="#FFD700" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      {/* 2. 浮き上がる黄金の粒子 */}
      <RisingParticles count={300} color={goldColor} />

      {/* 3. 浮遊するゴールド・シャード */}
      <FloatingShards count={100} materialProps={goldMaterialProps} />

      {/* 静止・ランダムに光るスパークル（さらに迫力を出しつつ上品に調整） */}
      <Sparkles count={400} scale={50} size={4.0} speed={0.4} color={goldColor} opacity={1.0} />

      {/* 順位テキストのグループ */}
      <group rotation={[textRotateX, 0, 0]}>
        {/* 装飾バー */}
        <Center position={[0, 4.8, 1]}>
          <mesh>
            <boxGeometry args={[16, 0.18, 0.18]} />
            <meshPhysicalMaterial {...goldMaterialProps} emissive="#FFD700" emissiveIntensity={2} />
          </mesh>
        </Center>
        
        {/* テキスト */}
        <Float speed={8} rotationIntensity={0.1} floatIntensity={0.3}>
          <Center position={[0, 0, 2]}>
            <Text3D
              font={staticFile('fonts/helvetiker_regular.typeface.json')}
              size={3.8}
              height={1.0}
              curveSegments={32}
              bevelEnabled
              bevelThickness={0.25}
              bevelSize={0.08}
              bevelSegments={10}
              letterSpacing={0.1}
            >
              {rankText}
              <meshPhysicalMaterial 
                {...goldMaterialProps} 
                emissive="#FFF2C8" 
                emissiveIntensity={0.5} 
                clearcoat={1} 
              />
            </Text3D>
          </Center>
        </Float>
        
        {/* 装飾バー */}
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

/**
 * 下から上へ浮き上がる粒子のコンポーネント (確実に視認できるように強化)
 */
const RisingParticles: React.FC<{ count: number; color: string }> = ({ count, color }) => {
  const frame = useCurrentFrame();
  
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 60,
      z: (Math.random() - 0.5) * 40,
      speed: 0.15 + Math.random() * 0.25, 
      size: 0.02 + Math.random() * 0.04, // 1/10以下のサイズにし、光の粒に見えるように
    }));
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => {
        // Y座標をフレームに合わせて上昇させ、ループさせる
        const yPos = ((p.y + frame * p.speed + 40) % 80) - 40;
        return (
          <mesh key={i} position={[p.x, yPos, p.z]}>
            <sphereGeometry args={[p.size, 16, 16]} />
            {/* メッシュ自体を強く発光させ、物質的な丸みを感じさせないようにする */}
            <meshBasicMaterial color="#FFFFFF" transparent opacity={1} />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * 空間を浮遊するゴールドの破片
 */
const FloatingShards: React.FC<{ count: number; materialProps: any }> = ({ count, materialProps }) => {
  const frame = useCurrentFrame();
  
  const shards = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 50,
      ] as [number, number, number],
      rotationSpeed: [
        Math.random() * 0.03,
        Math.random() * 0.03,
        Math.random() * 0.03,
      ] as [number, number, number],
      size: 0.3 + Math.random() * 0.5,
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
