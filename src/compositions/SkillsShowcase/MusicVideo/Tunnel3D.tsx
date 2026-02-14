import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';

export type TunnelVariant = 'cyberpunk' | 'wireframe' | 'warp' | 'ethereal' | 'fire' | 'lightning' | 'split-fire' | 'gold' | 'kaleido';

const NoiseFunction = `
  // Simplex 3D Noise 
  // by Ian McEwan, Ashima Arts
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0.0 + 0.0 * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

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

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }
`;

const TunnelMesh: React.FC<{ beat: number; variant: TunnelVariant }> = ({ beat, variant }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uBeat.value = beat;
    }
    
    // Rotation logic
    if (meshRef.current) {
        meshRef.current.rotation.z = time * 0.1 + beat * 0.1;
    }
    if (pointsRef.current) {
        pointsRef.current.rotation.z = time * 0.05;
        // Warp speed effect for points
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
        
        for(let i=0; i<positions.length; i+=3) {
            positions[i+2] += (10 + beat * 50); // Move heavily on Z
            if(positions[i+2] > 50) {
                positions[i+2] = -200; // Reset further back
            }
            
            // Dynamic color shift based on Z and beat
            if (variant === 'warp') {
               const z = positions[i+2];
               // Shift from Blue to Purple/White as it gets closer
               const t = (z + 200) / 250;
               colors[i] = 0.5 + t * 0.5 + beat; // R
               colors[i+1] = 0.5 + t * 0.5; // G
               colors[i+2] = 1.0; // B
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  // Shader configurations
  const shaderConfig = useMemo(() => {
    let vertexShader = `
      varying vec2 vUv;
      varying vec3 vPos;
      void main() {
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    // Base uniforms
    let uniforms: any = {
      uTime: { value: 0 },
      uBeat: { value: 0 },
    };

    let fragmentShader = '';

    switch (variant) {
      case 'cyberpunk':
        uniforms.uColor1 = { value: new THREE.Color('#00ffff') }; // Cyan
        uniforms.uColor2 = { value: new THREE.Color('#ff00ff') }; // Magenta
        fragmentShader = `
          uniform float uTime;
          uniform float uBeat;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec2 vUv;

          void main() {
            // Hexagonal Grid or Tech Grid
            float scale = 20.0;
            vec2 uv = vUv * scale;
            
            // Movement
            uv.y += uTime * 2.0;

            float gridWidth = 0.05 + uBeat * 0.05;
            float gridX = step(1.0 - gridWidth, fract(uv.x));
            float gridY = step(1.0 - gridWidth, fract(uv.y));
            float grid = max(gridX, gridY);

            // Pulse
            float glow = sin(vUv.y * 10.0 - uTime * 5.0) * 0.5 + 0.5;
            
            vec3 color = mix(uColor1, uColor2, sin(uTime + vUv.x * 3.14) * 0.5 + 0.5);
            color = color * grid;
            
            // Add "data stream" packets
            float packet = step(0.95, fract(vUv.y * 5.0 + uTime * 3.0)) * step(0.1, fract(vUv.x * 10.0)); 
            color += vec3(1.0) * packet * (1.0 + uBeat);

            float alpha = (grid + packet) * (vUv.y * vUv.y); // Fade in distance (assuming y goes 0-1 depth?)
            // Actually vUv.y is usually U or V along cylinder. 
            // In cylinder geometry, usually U is around, V is length.
            // Let's fade out at edges if needed.

            gl_FragColor = vec4(color, alpha * 0.8 + glow * 0.2);
          }
        `;
        break;

      case 'wireframe':
        uniforms.uColor = { value: new THREE.Color('#00ff00') };
        fragmentShader = `
          uniform float uTime;
          uniform float uBeat;
          uniform vec3 uColor;
          varying vec2 vUv;

          void main() {
            // Complex Wireframe
            vec2 uv = vUv;
            uv.y += uTime * 0.5;
            
            float smallGrid = step(0.95, fract(uv.x * 50.0)) + step(0.95, fract(uv.y * 50.0));
            float largeGrid = step(0.98, fract(uv.x * 10.0)) + step(0.98, fract(uv.y * 10.0));
            
            vec3 color = uColor * (smallGrid * 0.3 + largeGrid * 0.8);
            
            // Beat reaction: Flash whole grid
            color += uColor * uBeat * 0.5 * largeGrid;
            
            float alpha = clamp(smallGrid + largeGrid, 0.0, 1.0);
            gl_FragColor = vec4(color, alpha); 
          }
        `;
        break;
      
      case 'ethereal':
         uniforms.uColor1 = { value: new THREE.Color('#e0c3fc') };
         uniforms.uColor2 = { value: new THREE.Color('#8ec5fc') };
         fragmentShader = `
            uniform float uTime;
            uniform float uBeat;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            varying vec2 vUv;
            varying vec3 vPos;
            ${NoiseFunction}

            void main() {
                // Cloud noise
                float scale = 3.0;
                float t = uTime * 0.3;
                float n = snoise(vec3(vUv.x * scale, vUv.y * scale + t, t));
                float n2 = snoise(vec3(vUv.x * scale * 2.0, vUv.y * scale * 2.0 - t, t));
                
                float cloud = n * 0.5 + n2 * 0.25 + 0.5;
                
                vec3 color = mix(uColor1, uColor2, cloud);
                
                // Beat adds "light" from within
                color += vec3(0.2) * uBeat * cloud;
                
                float alpha = smoothstep(0.4, 0.8, cloud);
                gl_FragColor = vec4(color, alpha * 0.5);
            }
         `;
         break;

       case 'fire':
         uniforms.uColor1 = { value: new THREE.Color('#ff2a00') }; // Red-Orange
         uniforms.uColor2 = { value: new THREE.Color('#ffae00') }; // Yellow-Orange
         fragmentShader = `
            uniform float uTime;
            uniform float uBeat;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            varying vec2 vUv;
            ${NoiseFunction}

            void main() {
                // Turbulent Fire
                float t = uTime * 2.0;
                // Distort UVs
                vec2 uv = vUv;
                uv.y += t;
                
                float n = snoise(vec3(uv.x * 5.0, uv.y * 2.0, t * 0.5));
                float n2 = snoise(vec3(uv.x * 10.0, uv.y * 5.0 + t, t));
                
                float fire = n * 0.6 + n2 * 0.4;
                fire = smoothstep(0.0, 1.0, fire + 0.2); // Contrast
                
                vec3 color = mix(uColor1, uColor2, fire);
                
                // Hot spots
                color += vec3(1.0, 1.0, 0.5) * step(0.7, fire) * (1.0 + uBeat);
                
                float alpha = smoothstep(0.2, 0.9, fire);
                gl_FragColor = vec4(color, alpha);
            }
         `;
         break;

       case 'lightning':
         uniforms.uColor = { value: new THREE.Color('#aaaaff') };
         fragmentShader = `
            uniform float uTime;
            uniform float uBeat;
            uniform vec3 uColor;
            varying vec2 vUv;
            ${NoiseFunction}

            void main() {
                // Fractal Lightning
                float t = uTime * 3.0;
                
                // Main bolt
                float bolt = 0.0;
                float noiseVal = snoise(vec3(vUv.y * 5.0 + t, t, 0.0));
                float line = abs(vUv.x * 2.0 - 1.0 - noiseVal * 0.5); // Center line distorted
                bolt += 0.05 / line;
                
                // Second bolt (offset)
                float noiseVal2 = snoise(vec3(vUv.y * 8.0 + t, t + 10.0, 0.0));
                float line2 = abs(fract(vUv.x * 2.0) - 0.5 - noiseVal2 * 0.3);
                bolt += 0.02 / line2;
                
                // Flash on beat
                bolt *= (1.0 + uBeat * 5.0); 
                
                // Clamp
                bolt = clamp(bolt, 0.0, 1.0);
                
                vec3 color = uColor * bolt;
                // Blue core
                color += vec3(0.5, 0.5, 1.0) * smoothstep(0.8, 1.0, bolt);
                
                gl_FragColor = vec4(color, bolt);
            }
         `;
         break;

        case 'split-fire':
          uniforms.uColor1 = { value: new THREE.Color('#ff0000') }; // Red
          uniforms.uColor2 = { value: new THREE.Color('#00ff00') }; // Green
          fragmentShader = `
                uniform float uTime;
                uniform float uBeat;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                varying vec2 vUv;
                ${NoiseFunction}

                void main() {
                    float t = uTime * 2.0;
                    vec2 uv = vUv;
                    uv.y += t;
                    
                    float n = snoise(vec3(uv.x * 5.0, uv.y * 2.0, t * 0.5));
                    
                    vec3 baseColor;
                    // Split vertically
                    if (vUv.x < 0.5) {
                         baseColor = uColor1;
                    } else {
                         baseColor = uColor2;
                    }
                    
                    // Add noise pattern
                    float intensity = smoothstep(0.2, 0.8, n + 0.3);
                    vec3 color = baseColor * intensity;
                    
                    // Beat pulse
                    color *= (1.0 + uBeat * 0.5);
                    
                    gl_FragColor = vec4(color, intensity);
                }
            `;
            break;

      case 'gold':
        uniforms.uColor = { value: new THREE.Color('#FFD700') }; // Gold
        fragmentShader = `
          uniform float uTime;
          uniform float uBeat;
          uniform vec3 uColor;
          varying vec2 vUv;

          void main() {
            // Elegant Gold Grid
            vec2 uv = vUv;
            uv.y += uTime * 0.5;
            
            float smallGrid = step(0.95, fract(uv.x * 30.0)) + step(0.95, fract(uv.y * 30.0));
            float largeGrid = step(0.98, fract(uv.x * 6.0)) + step(0.98, fract(uv.y * 6.0));
            
            vec3 color = uColor * (smallGrid * 0.2 + largeGrid * 0.6);
            
            // Shimmer / Sparkle
            float sparkle = step(0.99, fract(sin(dot(uv.xy + uTime, vec2(12.9898,78.233))) * 43758.5453));
            color += uColor * sparkle * (1.0 + uBeat);

            // Beat reaction
            color += uColor * uBeat * 0.3 * largeGrid;
            
            float alpha = clamp(smallGrid + largeGrid + sparkle, 0.0, 1.0);
            gl_FragColor = vec4(color, alpha); 
          }
        `;
        break;

      case 'kaleido':
        fragmentShader = `
          uniform float uTime;
          uniform float uBeat;
          varying vec2 vUv;

          vec3 hsv2rgb(vec3 c) {
              vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
              vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
              return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
          }

          void main() {
             vec2 uv = vUv;
             uv.y += uTime * 2.0;

             // Rainbow Grid
             float grid = step(0.9, fract(uv.x * 10.0)) + step(0.9, fract(uv.y * 10.0));
             
             // Color shifting based on position and time
             float hue = fract(uv.y * 0.1 + uTime * 0.2); 
             vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));
             
             // Apply grid
             color *= grid;
             
             // Beat flash
             color += vec3(1.0) * uBeat * grid * 0.5;

             float alpha = grid;
             gl_FragColor = vec4(color, alpha);
          }
        `;
        break;
    }

    return { uniforms, vertexShader, fragmentShader };
  }, [variant]); // Re-compute on variant change

  if (variant === 'warp') {
      // Warp uses Points, not a shader mesh on a cylinder
      const particleCount = 2000;
      const positions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
      const colors = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
      
      useMemo(() => {
          for(let i=0; i<particleCount; i++) {
              positions[i*3] = (Math.random() - 0.5) * 50;
              positions[i*3+1] = (Math.random() - 0.5) * 50;
              positions[i*3+2] = (Math.random() - 0.5) * 200; // Deep Z
              
              colors[i*3] = 1.0;
              colors[i*3+1] = 1.0;
              colors[i*3+2] = 1.0;
          }
      }, [particleCount]);

      return (
          <points ref={pointsRef}>
              <bufferGeometry>
                  <bufferAttribute 
                      attach="attributes-position" 
                      count={particleCount} 
                      array={positions} 
                      itemSize={3} 
                  />
                  <bufferAttribute
                      attach="attributes-color"
                      count={particleCount}
                      array={colors}
                      itemSize={3}
                  />
              </bufferGeometry>
              <pointsMaterial 
                  size={0.5} 
                  transparent 
                  opacity={0.8} 
                  vertexColors={true}
                  blending={THREE.AdditiveBlending}
               />
          </points>
      )
  }

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[10, 10, 100, 32, 1, true]} />
      <shaderMaterial 
        ref={materialRef} 
        uniforms={shaderConfig.uniforms}
        vertexShader={shaderConfig.vertexShader}
        fragmentShader={shaderConfig.fragmentShader}
        transparent={true}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export const Tunnel3D: React.FC<{ beat: number; variant?: TunnelVariant }> = ({ beat, variant = 'cyberpunk' }) => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas width={width} height={height} style={{ backgroundColor: 'transparent' }}>
      <ambientLight intensity={0.5} />
      <TunnelMesh beat={beat} variant={variant} />
    </ThreeCanvas>
  );
};
