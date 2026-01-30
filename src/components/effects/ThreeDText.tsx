import { Center, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type React from "react";
import { useRef } from "react";
import { staticFile } from "remotion";
import type * as THREE from "three";

interface ThreeDTextProps {
	text: string;
	size?: number;
	height?: number; // Depth
	color?: string;
	fontUrl?: string;
	animate?: boolean;
}

export const ThreeDText: React.FC<ThreeDTextProps> = ({
	text,
	size = 1,
	height = 0.2, // Depth
	color = "#ffffff",
	fontUrl = "fonts/helvetiker_regular.typeface.json",
	animate = true,
}) => {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame(({ clock }) => {
		if (animate && meshRef.current) {
			// Gentle floating and rotation
			meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
			meshRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.3) * 0.1;
		}
	});

	return (
		<Center>
			<Text3D
				ref={meshRef}
				font={staticFile(fontUrl)}
				size={size}
				height={height}
				curveSegments={12}
				bevelEnabled
				bevelThickness={0.02}
				bevelSize={0.02}
				bevelOffset={0}
				bevelSegments={5}
			>
				{text}
				<meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
			</Text3D>
		</Center>
	);
};
