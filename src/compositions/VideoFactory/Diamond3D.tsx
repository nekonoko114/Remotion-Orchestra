import { ThreeCanvas } from "@remotion/three";
import { random, useCurrentFrame, useVideoConfig } from "remotion";

// Diamond Geometry Helper
const DiamondMesh: React.FC<{
	color: string;
	scale?: number;
	rotationSpeed?: number;
	position?: [number, number, number];
}> = ({ color, scale = 1, rotationSpeed = 0.1, position = [0, 0, 0] }) => {
	const frame = useCurrentFrame();

	// Rotate constantly based on frame
	const rotationY = frame * rotationSpeed;
	const rotationX = frame * (rotationSpeed * 0.5);

	return (
		<mesh
			position={position}
			rotation={[rotationX, rotationY, 0]}
			scale={[scale, scale, scale]}
		>
			{/* Octahedron is a good approximation of a uncut diamond shape */}
			<octahedronGeometry args={[1, 0]} />
			<meshStandardMaterial
				color={color}
				metalness={0.9}
				roughness={0.1}
				emissive={color}
				emissiveIntensity={0.2}
			/>
		</mesh>
	);
};

export const Diamond3D: React.FC<{
	rank?: number;
}> = ({ rank = 1 }) => {
	const { width, height } = useVideoConfig();

	// Color based on rank
	const color =
		rank === 1
			? "#FFD700"
			: // Gold
				rank === 2
				? "#C0C0C0"
				: // Silver
					rank === 3
					? "#CD7F32"
					: // Bronze
						"#00FFFF"; // Cyan (Diamond) defaults

	// If rank is unspecified (e.g. general decoration), use Cyan Diamond
	const displayColor = rank > 3 ? "#E0FFFF" : color;

	// Generate 30 random diamonds
	const diamonds = new Array(30).fill(0).map((_, i) => {
		const seed = `diamond-${i}`;
		// Random position spread (x: -10 to 10, y: -10 to 10, z: -10 to -2)
		const x = (random(`${seed}x`) - 0.5) * 25;
		const y = (random(`${seed}y`) - 0.5) * 25;
		const z = -2 - random(`${seed}z`) * 10; // Background depth

		// Random scale (0.2 to 0.6)
		const scale = 0.2 + random(`${seed}scale`) * 0.9;

		// Random rotation speed
		const speed = 0.01 + random(`${seed}speed`) * 0.04;

		return (
			<DiamondMesh
				key={i}
				color={displayColor}
				scale={scale}
				position={[x, y, z]}
				rotationSpeed={speed}
			/>
		);
	});

	return (
		<ThreeCanvas
			width={width}
			height={height}
			style={{ backgroundColor: "transparent" }}
		>
			<ambientLight intensity={0.5} />
			<pointLight position={[10, 10, 10]} intensity={1.5} />
			<spotLight position={[-10, -10, -10]} angle={0.3} intensity={1} />

			{/* Main Diamond (Centerpiece) - Kept small */}
			<DiamondMesh color={displayColor} scale={1.2} />

			{/* 30 Scattered Background Diamonds */}
			{diamonds}
		</ThreeCanvas>
	);
};
