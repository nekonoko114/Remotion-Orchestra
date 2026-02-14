import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig, useCurrentFrame } from 'remotion';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import React from 'react';

const RotatingCube: React.FC = () => {
    const meshRef = useRef<Mesh>(null);
    const frame = useCurrentFrame();

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x = frame * 0.02;
            meshRef.current.rotation.y = frame * 0.03;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshStandardMaterial color="#6a0dad" roughness={0.3} metalness={0.8} />
        </mesh>
    );
};

export const ThreeDShowcase: React.FC = () => {
    const { width, height } = useVideoConfig();

    return (
        <div style={{ flex: 1, backgroundColor: '#111' }}>
             <div style={{
                position: 'absolute',
                top: 50,
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
                fontSize: 40,
                zIndex: 10
            }}>
                3D Skill: @remotion/three + R3F
            </div>
            <ThreeCanvas width={width} height={height}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <RotatingCube />
            </ThreeCanvas>
        </div>
    );
};
