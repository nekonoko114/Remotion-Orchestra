import { Center, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type React from 'react';
import { useMemo, useRef } from 'react';
import { random, staticFile } from 'remotion';
import * as THREE from 'three';

// --- 1. Procedural Fire Texture Generator ---
function generateFireTexture(core: string, body: string, edge: string) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Draw a fuzzy, flame-like blob
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, core);
  gradient.addColorStop(0.2, body);
  gradient.addColorStop(0.5, edge);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// --- 2. Charcoal "Fuel" Shader (The Text Mesh) ---
// Shared Noise Functions
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

const CharcoalShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorCarbon: { value: new THREE.Color('#000000') },
    uColorEmissive: { value: new THREE.Color('#ff3300') },
    uDistortionStrength: { value: 1.0 }, // New uniform
  },
  vertexShader: `
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uDistortionStrength;
        ${NoiseChunk}

        void main() {
            vPosition = position;
            
            // "Boiling" effect: Displace vertices along normal
            float noise = snoise(vec3(position.x * 2.0 + uTime, position.y * 2.0, position.z * 2.0));
            // Only bubble out, not in (heat expansion)
            // Multiply by configurable strength
            float displacement = noise * 0.08 * uDistortionStrength; 
            
            vec3 newPos = position + normal * displacement;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
    `,
  fragmentShader: `
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColorCarbon;
        uniform vec3 uColorEmissive;
        ${NoiseChunk}

        void main() {
            // Noise based on position and slow time (burning slowly)
            float n = snoise(vec3(vPosition.x * 3.0, vPosition.y * 3.0 - uTime * 0.5, vPosition.z * 3.0));
            
            // Cracks appear where noise is high
            // Animated threshold for flickering
            float threshold = 0.4 + sin(uTime * 5.0) * 0.02; 
            float crack = smoothstep(threshold, threshold + 0.1, n);
            
            vec3 color = mix(uColorCarbon, uColorEmissive, crack);
            gl_FragColor = vec4(color, 1.0);
        }
    `,
};

// --- 3. Flame Particle Shader ---
const FlameSpriteShader = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null },
  },
  vertexShader: `
        uniform float uTime;
        varying float vLife;
        varying float vRotation;
        
        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
            float id = float(gl_VertexID);
            
            // Loop lifecycle 0.0 -> 1.0
            float lifeSpeed = 0.5 + hash(id) * 0.5;
            float t = mod(uTime * lifeSpeed + hash(id * 10.0), 1.0);
            vLife = t;
            vRotation = hash(id * 20.0) * 6.28 + t; // Rotate as it rises

            vec3 pos = position; // Origin on text surface
            
            // Rise up
            pos.y += t * 1.5; 
            // Drift slightly
            pos.x += sin(t * 3.0 + hash(id)) * 0.2;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Scale based on life (grow then shrink)
            float scale = 4.0 * sin(t * 3.14159);
            gl_PointSize = (150.0 / -mvPosition.z) * scale;
            
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
  fragmentShader: `
        uniform sampler2D uTexture;
        varying float vLife;
        varying float vRotation;
        
        void main() {
            
            vec2 uv = gl_PointCoord - 0.5;
            
            // Rotate UV
            float s = sin(vRotation);
            float c = cos(vRotation);
            mat2 rot = mat2(c, -s, s, c);
            uv = rot * uv;
            uv += 0.5;

            vec4 tex = texture2D(uTexture, uv);
            
            // Color grading over life: White -> Orange -> Red -> Smoke
            vec3 color = tex.rgb;
            
            // REMOVED hardcoded white add, assume texture has correct colors
            // if (vLife < 0.2) color += vec3(0.5, 0.5, 0.5); // Initial Spark
            
            if (vLife > 0.8) color *= 0.5; // Fade to smoke
            
            gl_FragColor = vec4(color, tex.a * (1.0 - vLife));
        }
    `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
};

interface RealisticFireTextProps {
  text: string;
  size?: number;
  height?: number;
  fontUrl?: string;
  distortionStrength?: number;
  // Color Config
  fireColorCore?: string;
  fireColorBody?: string;
  fireColorEdge?: string;
  magmaColor?: string;
  carbonColor?: string;
}

export const RealisticFireText: React.FC<RealisticFireTextProps> = ({
  text,
  size = 1,
  height = 0.3,
  fontUrl = 'fonts/helvetiker_regular.typeface.json',
  distortionStrength = 1.0,
  fireColorCore = 'rgba(255, 200, 100, 1)',
  fireColorBody = 'rgba(255, 100, 0, 0.8)',
  fireColorEdge = 'rgba(100, 0, 0, 0.2)',
  magmaColor = '#ff3300',
  carbonColor = '#000000',
}) => {
  const charcoalRef = useRef<THREE.ShaderMaterial>(null);
  const flameRef = useRef<THREE.ShaderMaterial>(null);

  // 1. Create the Fire Texture with custom colors
  const fireTexture = useMemo(() => {
    return generateFireTexture(fireColorCore, fireColorBody, fireColorEdge);
  }, [fireColorCore, fireColorBody, fireColorEdge]);

  // 2. Generate particle origins...
  const count = 1500;
  const [particleOrigins] = useMemo(() => {
    const origins = new Float32Array(count * 3);
    const seed = text + size;
    for (let i = 0; i < count; i++) {
      origins[i * 3] =
        (random(`${seed}-x-${i}`) - 0.5) * (text.length * size * 0.7);
      origins[i * 3 + 1] = (random(`${seed}-y-${i}`) - 0.5) * size;
      origins[i * 3 + 2] = (random(`${seed}-z-${i}`) - 0.5) * height;
    }
    return [origins];
  }, [text, size, height]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (charcoalRef.current) {
      charcoalRef.current.uniforms.uTime.value = t;
      charcoalRef.current.uniforms.uDistortionStrength.value =
        distortionStrength;
      // Update dynamic colors
      charcoalRef.current.uniforms.uColorEmissive.value.set(magmaColor);
      charcoalRef.current.uniforms.uColorCarbon.value.set(carbonColor);
    }
    if (flameRef.current) flameRef.current.uniforms.uTime.value = t;
  });

  const charcoalShader = useMemo(
    () => new THREE.ShaderMaterial(CharcoalShader),
    [],
  );
  const flameShader = useMemo(() => {
    const mat = new THREE.ShaderMaterial(FlameSpriteShader);
    if (fireTexture) mat.uniforms.uTexture.value = fireTexture;
    return mat;
  }, [fireTexture]);

  return (
    <group>
      {/* The Charcoal Text */}
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
            object={charcoalShader}
            ref={charcoalRef}
            attach="material"
          />
        </Text3D>
      </Center>

      {/* The Flames */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particleOrigins}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={flameShader} ref={flameRef} attach="material" />
      </points>
    </group>
  );
};
