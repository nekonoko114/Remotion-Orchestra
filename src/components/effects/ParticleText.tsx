import { Center, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type React from 'react';
import { useMemo, useRef } from 'react';
import { interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import * as THREE from 'three';

const ParticleMorphShader = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color('#00ffff') },
  },
  vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        attribute vec3 targetPosition;
        varying float vRandom;
        
        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
            float id = float(gl_VertexID);
            vRandom = hash(id);
            
            vec3 scatterPos = position * 5.0; 
            
            // Randomized progress for each particle so they don't arrive all at once
            // Some arrive faster, some slower.
            float localProgress = smoothstep(0.0, 1.0, (uProgress - vRandom * 0.2) / 0.8);
            
            // Cubic ease-out for snapping effect
            float t = 1.0 - pow(1.0 - localProgress, 3.0);
            
            // Spiral motion logic
            // Mix from scatter to target
            vec3 pos = mix(scatterPos, targetPosition, t);
            
            // Add a spiral/curl offset that disappears as t -> 1.0
            float angle = uTime * 2.0 + vRandom * 6.28;
            float radius = (1.0 - t) * 2.0; // Radius shrinks as they arrive
            
            pos.x += cos(angle) * radius;
            pos.y += sin(angle) * radius;
            pos.z += sin(angle * 2.0) * radius; // 3D swirl
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (25.0 / -mvPosition.z) * (0.5 + vRandom);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
  fragmentShader: `
        uniform vec3 uColor;
        uniform float uProgress;
        varying float vRandom;
        
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float strength = 1.0 - (dist * 2.0);
            
            // Fade particles out slightly as mesh fades in
            float alpha = 1.0;
            if (uProgress > 0.8) {
                alpha = 1.0 - (uProgress - 0.8) / 0.2;
            }
            
            gl_FragColor = vec4(uColor, strength * alpha);
        }
    `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
};

interface ParticleTextProps {
  text: string;
  size?: number;
  height?: number;
  color?: string;
  fontUrl?: string;
  durationInFrames?: number;
  startFrame?: number;
}

export const ParticleText: React.FC<ParticleTextProps> = ({
  text,
  size = 2,
  height = 0.4,
  color = '#00ffff',
  fontUrl = 'fonts/helvetiker_regular.typeface.json',
  durationInFrames = 60,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const progress = interpolate(
    frame - startFrame,
    [0, durationInFrames],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
  );

  // Cross-fade for the solid mesh - delayed to wait for spiral to finish
  const meshOpacity = interpolate(progress, [0.85, 1.0], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const count = 3000;

  const [scatterPositions, targetPositions] = useMemo(() => {
    const scatter = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      scatter[i * 3] = (random(`sa-${i}`) - 0.5) * 20;
      scatter[i * 3 + 1] = (random(`sb-${i}`) - 0.5) * 20;
      scatter[i * 3 + 2] = (random(`sc-${i}`) - 0.5) * 10;

      target[i * 3] = (random(`ta-${i}`) - 0.5) * (text.length * size * 0.7);
      target[i * 3 + 1] = (random(`tb-${i}`) - 0.5) * size;
      target[i * 3 + 2] = (random(`tc-${i}`) - 0.5) * height;
    }
    return [scatter, target];
  }, [text, size, height]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uProgress.value = progress;
    }
  });

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial(ParticleMorphShader);
    mat.uniforms.uColor.value = new THREE.Color(color);
    return mat;
  }, [color]);

  return (
    <group>
      {/* 1. The Morphing Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={scatterPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-targetPosition"
            count={count}
            array={targetPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={material} ref={materialRef} attach="material" />
      </points>

      {/* 2. The Solid Result Mesh (Fades in) */}
      {meshOpacity > 0 && (
        <Center>
          <Text3D
            font={staticFile(fontUrl)}
            size={size}
            height={height}
            curveSegments={12}
          >
            {text}
            <meshStandardMaterial
              color={color}
              transparent
              opacity={meshOpacity}
              metalness={0.5}
              roughness={0.5}
            />
          </Text3D>
        </Center>
      )}
    </group>
  );
};
