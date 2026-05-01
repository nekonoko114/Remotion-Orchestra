import { Center, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type React from 'react';
import { useMemo, useRef } from 'react';
import { interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import * as THREE from 'three';

const EmberShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 1.0 },
    uColor: { value: new THREE.Color('#ffaa00') },
  },
  vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        varying float vOpacity;
        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
            vec3 pos = position;
            float id = float(gl_InstanceID);
            float t = mod(uTime * 0.5 + hash(id), 1.0);
            pos.y += t * 3.0;
            pos.x += sin(t * 10.0 + hash(id * 1.1)) * 0.2;
            pos.z += cos(t * 10.0 + hash(id * 1.2)) * 0.2;
            vOpacity = (1.0 - t) * smoothstep(0.0, 0.2, t) * uProgress;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (10.0 / -mvPosition.z) * (1.0 + hash(id) * 2.0);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
  fragmentShader: `
        uniform vec3 uColor;
        varying float vOpacity;
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float strength = 1.0 - (dist * 2.0);
            gl_FragColor = vec4(uColor, vOpacity * strength);
        }
    `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
};

// Shared Noise Functions (Same as RealisticFireText for consistency)
const NoiseChunk = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
`;

const AdvancedFireShader = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 1.0 },
    uColorCore: { value: new THREE.Color('#ffffff') },
    uColorHeat: { value: new THREE.Color('#ffaa00') },
    uColorFlame: { value: new THREE.Color('#ff0000') },
    uTargetColor: { value: new THREE.Color('#ff5500') },
    uDistortionStrength: { value: 1.0 }, // New uniform
  },
  vertexShader: `
        varying vec3 vPosition;
        varying float vNoise;
        uniform float uTime;
        uniform float uProgress;
        uniform float uDistortionStrength;
        ${NoiseChunk}

        void main() {
            vPosition = position;
            vec3 pos = position;

            // Large organic noise movement (Magma-like)
            float n = snoise(vec3(pos.x * 2.0 + uTime, pos.y * 2.0 - uTime * 0.5, pos.z * 2.0));
            vNoise = n;
            
            // "Boiling" displacement
            // Displacement fades out as uProgress goes to 0 (solidify)
            // Multiply by configurable strength
            float displacement = n * 0.15 * uProgress * uDistortionStrength; 
            
            vec3 newPos = pos + normal * displacement;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
    `,
  fragmentShader: `
        varying vec3 vPosition;
        varying float vNoise;
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uColorCore;
        uniform vec3 uColorHeat;
        uniform vec3 uColorFlame;
        uniform vec3 uTargetColor;

        void main() {
            // Dissolve/Burn Threshold
            // As uProgress -> 0, the dissolve effect disappears
            float threshold = 0.8 + vNoise * 0.4 * uProgress;
            if (vPosition.y > threshold) discard;

            float heat = smoothstep(-0.5, 0.5, vPosition.y + vNoise * 0.5);
            vec3 fireColor = mix(uColorCore, uColorHeat, heat);
            fireColor = mix(fireColor, uColorFlame, heat * 1.5);
            
            // Add pulse to color
            fireColor *= (0.8 + vNoise * 0.4);

            // Final transition: mix between fire and target solid color
            vec3 finalColor = mix(uTargetColor, fireColor, uProgress);

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
};

import { z } from 'zod';

export const BurningTextSchema = z.object({
  text: z.string(),
  size: z.number().optional().default(1),
  height: z.number().optional().default(0.2),
  color: z.string().optional().default('#ffaa00'),
  durationInFrames: z.number().optional().default(90),
  startFrame: z.number().optional().default(0),
  fontUrl: z.string().optional().default('fonts/helvetiker_regular.typeface.json'),
  distortionStrength: z.number().optional().default(1.0),
});

type BurningTextProps = z.infer<typeof BurningTextSchema>;

export const BurningText: React.FC<BurningTextProps> = ({
  text,
  size = 1,
  height = 0.2,
  color = '#ffaa00',
  durationInFrames = 90,
  startFrame = 0,
  fontUrl = 'fonts/helvetiker_regular.typeface.json',
  distortionStrength = 1.0,
}) => {
  const frame = useCurrentFrame();
  const fireMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const emberMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // Fade intensity from 1.0 (burning) to 0.0 (solid)
  const intensity = interpolate(
    frame - startFrame,
    [0, durationInFrames],
    [1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
  );

  const [particlePositions] = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const seed = text + size + height;
    for (let i = 0; i < count; i++) {
      positions[i * 3] =
        (random(`${seed}-x-${i}`) - 0.5) * (text.length * size * 0.8);
      positions[i * 3 + 1] = (random(`${seed}-y-${i}`) - 0.5) * size;
      positions[i * 3 + 2] = (random(`${seed}-z-${i}`) - 0.5) * height;
    }
    return [positions];
  }, [text, size, height]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fireMaterialRef.current) {
      fireMaterialRef.current.uniforms.uTime.value = t;
      fireMaterialRef.current.uniforms.uProgress.value = intensity;
      fireMaterialRef.current.uniforms.uDistortionStrength.value =
        distortionStrength;
    }
    if (emberMaterialRef.current) {
      emberMaterialRef.current.uniforms.uTime.value = t;
      emberMaterialRef.current.uniforms.uProgress.value = intensity;
    }
  });

  const fireShader = useMemo(() => {
    const mat = new THREE.ShaderMaterial(AdvancedFireShader);
    mat.uniforms.uTargetColor.value = new THREE.Color(color);
    return mat;
  }, [color]);
  const emberShader = useMemo(
    () => new THREE.ShaderMaterial(EmberShaderMaterial),
    [],
  );

  return (
    <group>
      <Center>
        <Text3D
          font={staticFile(fontUrl)}
          size={size}
          height={height}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
        >
          {text}
          <primitive
            object={fireShader}
            ref={fireMaterialRef}
            attach="material"
          />
        </Text3D>
      </Center>

      {intensity > 0.01 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlePositions.length / 3}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <primitive
            object={emberShader}
            ref={emberMaterialRef}
            attach="material"
          />
        </points>
      )}
    </group>
  );
};
