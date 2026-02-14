import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const FloatingParticles: React.FC<{ beat: number }> = ({ beat }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 500;
    
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            pos[i*3] = (Math.random() - 0.5) * 20; // x
            pos[i*3+1] = (Math.random() - 0.5) * 20; // y
            pos[i*3+2] = (Math.random() - 0.5) * 50; // z
        }
        return pos;
    }, []);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (pointsRef.current) {
             // Rotate entire field
            pointsRef.current.rotation.z = time * 0.05;
            pointsRef.current.rotation.y = time * 0.02;
            
            // Pulse size with beat
            const scale = 1 + beat * 0.5;
            pointsRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export const ParticleField: React.FC<{ beat: number }> = ({ beat }) => {
    const { width, height } = useVideoConfig();
    return (
        <ThreeCanvas width={width} height={height} style={{ backgroundColor: 'transparent' }}>
             <ambientLight intensity={0.5} />
             <FloatingParticles beat={beat} />
        </ThreeCanvas>
    );
};
