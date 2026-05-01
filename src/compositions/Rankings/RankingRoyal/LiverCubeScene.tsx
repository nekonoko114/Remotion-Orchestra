import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { useFrame } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

type Props = {
  imageUrl: string;
  rank: number;
};

export const LiverCubeScene: React.FC<Props> = ({ imageUrl, rank }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sourceTexture = useTexture(imageUrl);

  const mappedTexture = useMemo(() => {
    const t = sourceTexture.clone();
    
    if (t.image) {
      const img = t.image as any;
      const w = img?.naturalWidth || img?.width || 1;
      const h = img?.naturalHeight || img?.height || 1;
      const aspect = w / h;

      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;

      if (aspect > 1) {
        const repeatX = 1 / aspect;
        t.repeat.set(repeatX, 1);
        t.offset.set((1 - repeatX) / 2, 0);
      } else {
        const repeatY = aspect;
        t.repeat.set(1, repeatY);
        t.offset.set(0, (1 - repeatY) / 2);
      }
      
      t.needsUpdate = true;
    }
    return t;
  }, [sourceTexture]);

  const entrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 60 },
  });

  const scale = interpolate(entrance, [0, 1], [0, 1.4]);

  const rotationProgress = interpolate(frame, [0, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => {
      return t < 0.4 ? 1.5 * t : 0.6 + 0.4 * (1 - Math.pow(1 - (t - 0.4) / 0.6, 3));
    }
  });

  const autoRotateY = rotationProgress * Math.PI * 8;
  const autoRotateX = Math.sin(rotationProgress * Math.PI) * 0.15;

  useFrame((state) => {
    state.camera.position.z = 16;
    state.camera.lookAt(0, 0, 0);
    // 1位以外はトーンマッピングを無効化して、テクスチャの色をそのまま正確に表示
    if (!isRank1) {
      state.gl.toneMapping = THREE.NoToneMapping;
      state.gl.toneMappingExposure = 1.0;
    } else {
      state.gl.toneMapping = THREE.ACESFilmicToneMapping;
      state.gl.toneMappingExposure = 1.0;
    }
  });

  const isRank1 = rank === 1;

  const subCubes = useMemo(() => {
    if (!isRank1) return [];
    const cubes = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          cubes.push({ x, y, z });
        }
      }
    }
    return cubes;
  }, [isRank1]);
  const emissiveIntensity = isRank1 ? interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 2.0]) : 0;

  const goldMaterialProps = {
    color: '#FFF2C8',
    roughness: 0.1,
    metalness: 1.0,
    clearcoat: 1.0,
    emissive: isRank1 ? '#FFD700' : '#000000',
    emissiveIntensity: emissiveIntensity,
  };

  const baseMaterials = useMemo(() => {
    return Array(6).fill(
      new THREE.MeshStandardMaterial({
        map: mappedTexture,
        roughness: 1.0,
        metalness: 0.0,
        envMapIntensity: 0.1, // 環境マップの反射を大幅に抑え、白飛びを防止
      })
    );
  }, [mappedTexture]);

  return (
    <React.Suspense fallback={null}>
      {/* 1位のみ豪華なHDR環境マップを使用。それ以外は環境マップの影響を排除 */}
      {isRank1 ? (
        <Environment preset="night" />
      ) : (
        <Environment preset="night" environmentIntensity={0.01} />
      )}
      <ambientLight intensity={isRank1 ? 3.3 : 1.2} />
      <directionalLight position={[10, 10, 10]} intensity={isRank1 ? 0.8 : 0.3} color="#aaaaaaff" />
      <pointLight position={[-10, 10, 10]} intensity={isRank1 ? 30 : 3.0} color="#c4c4c4ff" />
      <spotLight position={[0, 50, 100]} intensity={isRank1 ? 25 : 2.0} angle={0.5} penumbra={1} />
      
      {isRank1 && (
        <pointLight 
          position={[0, 0, 0]} 
          intensity={80} 
          color="#FFD700" 
          distance={-10}
        />
      )}

      <group scale={scale} rotation={[autoRotateX, autoRotateY, 0]}>
        {isRank1 ? (
          subCubes.map((pos, i) => (
            <SubCube 
              key={i}
              x={pos.x} y={pos.y} z={pos.z}
              texture={mappedTexture}
              goldMaterialProps={goldMaterialProps}
            />
          ))
        ) : (
          <mesh material={baseMaterials}>
            <boxGeometry args={[10, 10, 10]} />
          </mesh>
        )}
      </group>
    </React.Suspense>
  );
};

// 小キューブコンポーネント
const SubCube: React.FC<{
  x: number; y: number; z: number;
  texture: THREE.Texture;
  goldMaterialProps: any;
}> = ({ x, y, z, texture, goldMaterialProps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 各キューブごとの遅延をフレーム数として計算（0〜24フレームの遅延）
  const delayFrames = (x + y + z + 3) * 4;

  // 2. キューブごとに独立したスプリングアニメーションを定義
  // これにより、遅延があっても必ず t が 1.0（完成）まで到達します
  const t = spring({
    frame: frame - 20 - delayFrames,
    fps,
    config: { damping: 15, stiffness: 60 },
  });
  
  const rotationX = t >= 1 ? 0 : (1 - t) * Math.PI * 2 * (y === 1 ? 1 : y === -1 ? -1 : 0.5);
  const rotationY = t >= 1 ? 0 : (1 - t) * Math.PI * 2 * (x === 1 ? 1 : x === -1 ? -1 : -0.5);
  const rotationZ = t >= 1 ? 0 : (1 - t) * Math.PI * (z === 0 ? 2 : 0);
  
  // 3.333 (10/3) に設定することで、隙間なくピッタリ隣り合います
  const unitSize = 10 / 3;
  const posScale = t >= 1 ? 1 : interpolate(t, [0, 0.8, 1], [1.8, 1.05, 1], { extrapolateRight: 'clamp' });
  const posX = x * unitSize * posScale;
  const posY = y * unitSize * posScale;
  const posZ = z * unitSize * posScale;

  // extrapolateRightを追加して、スプリングの揺れで値がマイナス等におかしくなるのを防ぎます
  const flash = interpolate(t, [0.85, 0.95, 1], [0, 5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // 3. テクスチャの分割処理だけを useMemo で切り出し（アニメーションと分離して軽くする）
  const faceTexture = useMemo(() => {
    if (z !== 1) return null; // 正面のレイヤー以外は計算不要

    const tex = texture.clone();
    const subRepeatX = texture.repeat.x / 3;
    const subRepeatY = texture.repeat.y / 3;
    tex.repeat.set(subRepeatX, subRepeatY);
    
    tex.offset.x = texture.offset.x + (x + 1) * subRepeatX;
    tex.offset.y = texture.offset.y + (y + 1) * subRepeatY;
    tex.needsUpdate = true;

    return tex;
  }, [texture, x, y, z]);

  return (
    <mesh position={[posX, posY, posZ]} rotation={[rotationX, rotationY, rotationZ]}>
      <boxGeometry args={[unitSize, unitSize, unitSize]} />
      
      {/* 4. マテリアルをJSXで宣言的に記述し、毎フレームの Material インスタンス再生成を防止 */}
      {Array(6).fill(0).map((_, i) => {
        const isIconFace = (i === 4 && z === 1); // 4 は BoxGeometry の前面(+Z)
        
        if (isIconFace && faceTexture) {
          return (
            <meshStandardMaterial
              key={`front-${i}`}
              attach={`material-${i}`} // 配列マテリアルの指定方法
              map={faceTexture}
              roughness={0.1}
              metalness={0.3}
              emissive="#FFD700"
              emissiveIntensity={flash}
            />
          );
        }

        return (
          <meshPhysicalMaterial
            key={`gold-${i}`}
            attach={`material-${i}`}
            {...goldMaterialProps}
            roughness={0.2}
          />
        );
      })}
    </mesh>
  );
};