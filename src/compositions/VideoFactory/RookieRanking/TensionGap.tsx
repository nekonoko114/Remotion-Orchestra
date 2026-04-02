import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { HalftoneBackground, SpeedLines } from './AmecomiElements';
import { useBeat, GlitchOverlay, BeatShake } from './BeatSync';

const commonGLSL = `
#define PI 3.1415926535897932384626433832795
#define TWO_PI 6.2831853071795864769252867665590

float hash12(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 0.1031);
    p3 += vec3(dot(p3, p3.yzx + 33.33));
    return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
`;

const vertexShader = `
${commonGLSL}
uniform float uTime;
uniform float uParabolStrength;
uniform float uParabolOffset;
uniform float uParabolAmplitude;
uniform float uTwistFactor;

varying vec2 vUv;

void main() {
    vUv = uv;
    float elevation = position.y;
    float angle = atan(position.z, position.x);
    float twistedAngle = angle + elevation * uTwistFactor;
    float radius = uParabolStrength * pow(elevation - uParabolOffset, 2.0) + uParabolAmplitude;
    radius += sin(elevation * 6.0 - uTime * 10.0 + angle * 2.0) * 0.06;

    vec3 twistedPosition = vec3(
        cos(twistedAngle) * radius,
        elevation,
        sin(twistedAngle) * radius
    );

    gl_Position = projectionMatrix * modelViewMatrix * vec4(twistedPosition, 1.0);
}
`;

const TornadoVortex: React.FC<{ bpm: number }> = ({ bpm }) => {
  const frame = useCurrentFrame();
  const { kickStrength } = useBeat(bpm);
  const timeScale = 0.5;
  const scaledTime = (frame * 0.05) * timeScale;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uKick: { value: 0 },
    uParabolStrength: { value: 2.8 },
    uParabolOffset: { value: 0.12 },
    uParabolAmplitude: { value: 0.65 },
    uTwistFactor: { value: 2.5 }
  }), []);

  uniforms.uTime.value = scaledTime;
  uniforms.uKick.value = kickStrength;

  const matEmissive = useMemo(() => new THREE.ShaderMaterial({
    vertexShader, 
    fragmentShader: `
      ${commonGLSL}
      uniform float uTime;
      uniform float uKick;
      varying vec2 vUv;
      void main() {
        vec2 flowUv = vUv * vec2(4.0, 1.0) + vec2(uTime * 0.3, -uTime * 1.0);
        float n = fbm(flowUv * 3.5);
        float effect = pow(n, 3.0);
        float fade = min(smoothstep(0.0, 0.2, vUv.y), smoothstep(0.0, 0.5, 1.0 - vUv.y));
        effect *= fade;
        vec3 colorDark = vec3(0.7, 0.07, 0.0);
        vec3 colorMid  = vec3(1.0, 0.4, 0.0);
        vec3 colorHigh = vec3(1.0, 0.9, 0.3);
        vec3 finalColor = mix(colorDark, colorMid, smoothstep(0.1, 0.5, effect));
        finalColor = mix(finalColor, colorHigh, smoothstep(0.5, 0.9, effect));
        gl_FragColor = vec4(finalColor * (2.5 + uKick * 5.0), smoothstep(0.02, 0.25, effect));
      }
    `, 
    uniforms, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false
  }), [uniforms]);

  const matDark = useMemo(() => new THREE.ShaderMaterial({
    vertexShader, 
    fragmentShader: `
      ${commonGLSL}
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec2 flowUv = vUv * vec2(3.0, 1.5) + vec2(-uTime * 0.4, -uTime * 0.8);
        float n = fbm(flowUv * 3.0);
        float strands = pow(n, 2.2);
        float fade = min(smoothstep(0.0, 0.2, vUv.y), smoothstep(0.0, 0.45, 1.0 - vUv.y));
        gl_FragColor = vec4(vec3(0.0), strands * fade * 0.9);
      }
    `, 
    uniforms, transparent: true, side: THREE.DoubleSide, depthWrite: false
  }), [uniforms]);

  const matFloor = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      ${commonGLSL}
      uniform float uTime;
      uniform float uKick;
      varying vec2 vUv;
      void main() {
        vec2 centeredUv = vUv - 0.5;
        float d = length(centeredUv);
        float angle = atan(centeredUv.y, centeredUv.x);
        vec2 swirlUv = vec2(angle / TWO_PI + d * 0.6 - uTime * 0.25, d - uTime * 0.2);
        float n = fbm(swirlUv * 12.0);
        float mask = min(smoothstep(0.5, 0.65, 1.0 - d), smoothstep(0.0, 0.1, d));
        float effect = pow(n, 2.8) * mask;
        vec3 colorDark = vec3(0.7, 0.07, 0.0);
        vec3 colorMid  = vec3(1.0, 0.4, 0.0);
        vec3 colorHigh = vec3(1.0, 0.9, 0.3);
        vec3 col = mix(colorDark, colorMid, smoothstep(0.1, 0.6, effect));
        col = mix(col, colorHigh, smoothstep(0.6, 1.0, effect));
        gl_FragColor = vec4(col * (3.5 + uKick * 6.0), smoothstep(0.0, 0.15, effect));
      }
    `, 
    uniforms, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false
  }), [uniforms]);

  const cylinderGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1, 1, 1, 64, 64, true);
    geo.translate(0, 0.5, 0);
    return geo;
  }, []);

  const zPos = interpolate(frame, [0, 360], [0, 60], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 360], [15, 22], { extrapolateRight: 'clamp' });

  return (
    <group position={[0, -10, zPos]} scale={scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={matFloor}>
        <planeGeometry args={[5, 5]} />
      </mesh>
      <mesh geometry={cylinderGeo} material={matEmissive} scale={[1, 5, 1]} rotation={[0, scaledTime * 0.4, 0]} />
      <mesh geometry={cylinderGeo} material={matDark} scale={[1.05, 5.02, 1.05]} rotation={[0, -scaledTime * 0.7, 0]} />
      <mesh geometry={cylinderGeo} material={matEmissive} scale={[0.5, 4.5, 0.5]} rotation={[0, scaledTime * 1.5, 0]} />
    </group>
  );
};

export const TensionGap: React.FC<{ bpm?: number }> = ({ bpm = 160 }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        <HalftoneBackground color="rgba(5, 5, 16, 0.5)" />
        <SpeedLines />

        <AbsoluteFill style={{ zIndex: 10 }}>
          <ThreeCanvas 
            width={width} 
            height={height} 
            camera={{ position: [0, 15, 120], fov: 40 }}
          >
            <TornadoVortex bpm={bpm} />
          </ThreeCanvas>
        </AbsoluteFill>
      </BeatShake>
    </AbsoluteFill>
  );
};
