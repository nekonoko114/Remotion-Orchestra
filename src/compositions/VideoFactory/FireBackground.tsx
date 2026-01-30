import { useEffect, useMemo, useRef } from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	random,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

const PARTICLE_COUNT = 600; // Increase count for better depth effect

interface Particle3D {
	x: number;
	y: number;
	z: number; // Depth
	speedZ: number; // Speed towards camera
	size: number;
	color: string;
	glowColor: string;
}

export const FireBackground: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { width, height } = useVideoConfig();
	const frame = useCurrentFrame();

	// Initialize particles in 3D space
	const particles = useMemo(() => {
		const p: Particle3D[] = [];
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const hue = random(`hue-${i}`) * 30 + 10; // Red to Orange range
			const isGold = random(`color-${i}`) < 0.3;

			p.push({
				x: (random(`x-${i}`) - 0.5) * width * 2, // Spread wider than screen
				y: (random(`y-${i}`) - 0.5) * height * 2,
				z: random(`z-${i}`) * 2000, // Initial depth (0 to 2000)
				speedZ: random(`sz-${i}`) * 15 + 10, // Speed of flying towards camera
				size: random(`sz-${i}`) * 5 + 2,
				color: isGold ? "hsl(45, 100%, 75%)" : `hsl(${hue}, 100%, 60%)`,
				glowColor: isGold
					? "hsla(45, 100%, 50%, 0.3)"
					: `hsla(${hue}, 100%, 50%, 0.3)`,
			});
		}
		return p;
	}, [width, height]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, width, height);

		const centerX = width / 2;
		const centerY = height / 2;
		const fov = 800; // Field of view

		ctx.globalCompositeOperation = "lighter";

		particles.forEach((p) => {
			// Calculate current depth with wrapping
			let currZ = (p.z - frame * p.speedZ) % 2000;
			if (currZ < 0) currZ += 2000;

			// Perspective Projection
			const scale = fov / (fov + currZ);

			// X and Y expand from center as they get closer
			const screenX = centerX + p.x * scale;
			const screenY = centerY + p.y * scale;

			// Size increases as it approaches
			const drawnSize = p.size * scale * 2;

			// Fade particles very close or very far
			const alpha = interpolate(currZ, [0, 200, 1500, 2000], [0, 0.8, 0.8, 0]);

			if (alpha <= 0) return;

			// DRAW METHOD: Optimized Glow
			ctx.globalAlpha = alpha;

			// 1. Outer Glow
			ctx.beginPath();
			ctx.arc(screenX, screenY, drawnSize * 2, 0, Math.PI * 2);
			ctx.fillStyle = p.glowColor;
			ctx.fill();

			// 2. Inner Core
			ctx.beginPath();
			ctx.arc(screenX, screenY, drawnSize, 0, Math.PI * 2);
			ctx.fillStyle = p.color;
			ctx.fill();
		});
	}, [frame, width, height, particles]);

	const bgScale = interpolate(frame, [0, 150], [1.1, 1.05]);

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			<AbsoluteFill style={{ overflow: "hidden" }}>
				<Img
					src={staticFile(
						"video-factory/images/generated/opening_luxury_fire.png",
					)}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						filter: "brightness(0.6) contrast(1.2)",
						transform: `scale(${bgScale})`,
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill style={{ mixBlendMode: "screen" }}>
				<canvas
					ref={canvasRef}
					width={width}
					height={height}
					style={{ width: "100%", height: "100%" }}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle, transparent 20%, rgba(0,0,0,0.7) 100%)",
					pointerEvents: "none",
				}}
			/>
		</AbsoluteFill>
	);
};
