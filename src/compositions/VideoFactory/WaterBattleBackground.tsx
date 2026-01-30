import type React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

const Sparkle: React.FC<{ seed: number; frame: number }> = ({
	seed,
	frame,
}) => {
	const x = random(seed + 100) * 100;
	const y = random(seed + 200) * 100;
	const size = random(seed + 300) * 15 + 5;
	const opacity = interpolate(
		Math.sin(frame / 10 + seed * 10),
		[-1, 1],
		[0.1, 0.8],
	);
	const rotation = (frame + seed * 100) % 360;

	return (
		<div
			style={{
				position: "absolute",
				left: `${x}%`,
				top: `${y}%`,
				width: size,
				height: size,
				backgroundColor: "white",
				clipPath:
					"polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
				opacity,
				transform: `rotate(${rotation}deg) scale(${opacity})`,
				filter: "drop-shadow(0 0 10px white)",
				pointerEvents: "none",
			}}
		/>
	);
};

const Bubble: React.FC<{ seed: number; frame: number }> = ({ seed, frame }) => {
	const x = random(seed) * 100;
	const size = random(seed + 1) * 40 + 10;
	const speed = random(seed + 2) * 3 + 1;
	const y = 110 - ((frame * speed) % 120);
	const wobble = Math.sin(frame / 15 + seed) * 20;

	return (
		<div
			style={{
				position: "absolute",
				left: `calc(${x}% + ${wobble}px)`,
				top: `${y}%`,
				width: size,
				height: size,
				borderRadius: "50%",
				background:
					"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.1))",
				boxShadow: "0 0 15px rgba(255,255,255,0.5)",
				border: "1.5px solid rgba(255,255,255,0.6)",
				opacity: interpolate(y, [-10, 20, 80, 110], [0, 1, 1, 0]),
				transform: `scale(${interpolate(Math.sin(frame / 20 + seed), [-1, 1], [0.8, 1.2])})`,
				pointerEvents: "none",
			}}
		/>
	);
};

export const WaterBattleBackground: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{ overflow: "hidden" }}>
			{/* 1. Deep Ocean Gradient (Vibrant) */}
			<div
				style={{
					width: "100%",
					height: "100%",
					background:
						"linear-gradient(135deg, #00E5FF 0%, #00B0FF 50%, #0091EA 100%)",
				}}
			/>

			{/* 2. Dynamic Light Rays (Caustics simulation) */}
			<div
				style={{
					position: "absolute",
					top: -500,
					left: -500,
					width: "200%",
					height: "200%",
					background:
						"conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.2) 20deg, transparent 40deg, rgba(255,255,255,0.2) 60deg, transparent 80deg, rgba(255,255,255,0.2) 100deg, transparent 360deg)",
					transform: `rotate(${frame / 5}deg)`,
					filter: "blur(40px)",
					opacity: 0.7,
					mixBlendMode: "overlay",
				}}
			/>

			{/* 3. Rising Bubbles (Increased count) */}
			{new Array(45).fill(0).map((_, i) => (
				<Bubble key={`b-${i}`} seed={i} frame={frame} />
			))}

			{/* 4. Twinkling Sparkles (Fun Factor!) */}
			{new Array(20).fill(0).map((_, i) => (
				<Sparkle key={`s-${i}`} seed={i * 7.7} frame={frame} />
			))}

			{/* 5. Surface Shimmer (Extra Bright) */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "500px",
					background:
						"linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, transparent 100%)",
					filter: "blur(30px)",
					opacity: 0.6,
				}}
			/>
		</AbsoluteFill>
	);
};
