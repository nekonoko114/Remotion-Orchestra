import type React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, Img, staticFile } from "remotion";

const Sparkle: React.FC<{ seed: number; frame: number }> = ({
	seed,
	frame,
}) => {
	const x = random(seed + 100) * 100;
	const y = random(seed + 200) * 100;
	const size = random(seed + 300) * 8 + 2;
	const opacity = interpolate(
		Math.sin(frame / 20 + seed * 10),
		[-1, 1],
		[0.1, 1],
	);
	const rotation = (frame / 2 + seed * 100) % 360;

	return (
		<div
			style={{
				position: "absolute",
				left: `${x}%`,
				top: `${y}%`,
				width: size,
				height: size,
				backgroundColor: "#B2FFFC",
				clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
				opacity,
				transform: `rotate(${rotation}deg) scale(${opacity})`,
				filter: `blur(1px) drop-shadow(0 0 ${10 * opacity}px #00E5FF)`,
				pointerEvents: "none",
			}}
		/>
	);
};

const Plankton: React.FC<{ seed: number; frame: number }> = ({ seed, frame }) => {
	const startX = random(seed) * 100;
	const startY = random(seed + 1) * 100;
	const driftX = Math.sin(frame / 50 + seed) * 30;
	const driftY = Math.cos(frame / 40 + seed) * 30;
	const size = random(seed + 2) * 4 + 2;
	const opacity = interpolate(Math.sin(frame / 30 + seed), [-1, 1], [0.2, 0.7]);

	return (
		<div style={{
			position: "absolute",
			left: `calc(${startX}% + ${driftX}px)`,
			top: `calc(${startY}% + ${driftY}px)`,
			width: size,
			height: size,
			borderRadius: "50%",
			backgroundColor: "#00FFD1",
			filter: "blur(2px) drop-shadow(0 0 8px #00FFD1)",
			opacity,
			pointerEvents: "none",
		}} />
	);
}

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

const CausticsOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
			{[1, 2].map((i) => (
				<AbsoluteFill
					key={i}
					style={{
						background: `none`,
						backgroundImage: `radial-gradient(circle at ${50 + Math.sin(frame / (20 * i)) * 10}% ${50 + Math.cos(frame / (25 * i)) * 10}%, rgba(0, 229, 255, 0.15) 0%, transparent 60%)`,
						mixBlendMode: "screen",
						filter: "blur(30px)",
						transform: `scale(${1 + Math.sin(frame / 50) * 0.1})`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};

export const WaterBattleBackground: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000b1a" }}>
			{/* 1. Deep Ocean Cinematic Background (Static + Breathing) */}
			<AbsoluteFill style={{ overflow: "hidden" }}>
				<Img 
					src={staticFile("video-factory/images/backgrounds/water/mermaid_bg_02.webp")} 
					style={{
						width: "120%",
						height: "120%",
						objectFit: "cover",
						left: "-10%",
						top: "-10%",
						transform: `scale(${1.1 + Math.sin(frame / 200) * 0.05}) translate(${Math.sin(frame / 150) * 20}px, ${Math.cos(frame / 180) * 15}px)`,
						filter: "brightness(0.55) contrast(1.1) saturate(1.2) blue(5px)", // Subtle initial depth
					}} 
				/>
				{/* Deep gradient overlay to blend */}
				<AbsoluteFill style={{
					background: "radial-gradient(circle at 50% 50%, transparent 30%, #000b1a 100%)",
					mixBlendMode: "multiply",
					opacity: 0.7
				}} />
			</AbsoluteFill>

			<CausticsOverlay />

			{/* 2. Layered God Rays */}
			{[1, 2, 3].map((layer) => (
				<div
					key={layer}
					style={{
						position: "absolute",
						top: "-50%",
						left: "-50%",
						width: "200%",
						height: "200%",
						background: `conic-gradient(from 0deg at 50% 50%, 
							transparent 0deg, 
							rgba(0, 229, 255, ${0.1 / layer}) 15deg, 
							transparent 30deg, 
							rgba(0, 255, 209, ${0.08 / layer}) 45deg, 
							transparent 60deg)`,
						transform: `rotate(${frame / (10 * layer)}deg) scale(${1 + layer * 0.1})`,
						filter: `blur(${20 * layer}px)`,
						opacity: 0.8,
						mixBlendMode: "screen",
					}}
				/>
			))}

			{/* 3. Subtle Sea Creature Silhouette */}
			<div style={{
				position: "absolute",
				bottom: "10%",
				left: interpolate(frame, [0, 900], [-20, 120]),
				width: 800,
				height: 300,
				background: "rgba(0,0,0,0.15)",
				filter: "blur(60px)",
				borderRadius: "50% 50% 60% 40%",
				transform: `scale(${1 + Math.sin(frame/100)*0.05})`,
				pointerEvents: "none",
			}} />

			{/* 4. Rising Bubbles */}
			{new Array(35).fill(0).map((_, i) => (
				<Bubble key={`b-${i}`} seed={i} frame={frame} />
			))}

			{/* 5. Bioluminescent Plankton */}
			{new Array(40).fill(0).map((_, i) => (
				<Plankton key={`p-${i}`} seed={i * 13.3} frame={frame} />
			))}

			{/* 6. Twinkling Sparkles */}
			{new Array(15).fill(0).map((_, i) => (
				<Sparkle key={`s-${i}`} seed={i * 9.9} frame={frame} />
			))}

			{/* 7. Surface Shimmer */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "linear-gradient(to bottom, rgba(0,229,255,0.3) 0%, transparent 40%)",
					filter: "blur(50px)",
					opacity: 0.5,
					mixBlendMode: "screen",
				}}
			/>
		</AbsoluteFill>
	);
};
