import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

const PARTICLE_COUNT = 50; // Fewer but larger bokeh
const CUBE_COUNT = 15; // Geometric shapes

type Props = {
	color?: string; // Primary theme color (Gold, Silver, Bronze)
	secondaryColor?: string; // Secondary/Shadow color
};

export const LuxuryGoldBackground: React.FC<Props> = ({ 
	color = "#FFD700", 
	secondaryColor = "#553300" 
}) => {
	const frame = useCurrentFrame();

	const particles = useMemo(() => {
		return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
			x: random(`x-${i}`) * 100,
			y: random(`y-${i}`) * 100,
			size: random(`s-${i}`) * 100 + 50, // Massive Bokeh (50-150px)
			opacity: random(`o-${i}`) * 0.3 + 0.1,
			speed: random(`sp-${i}`) * 0.2 + 0.05,
			delay: random(`d-${i}`) * 100,
		}));
	}, []);

	const cubes = useMemo(() => {
		return Array.from({ length: CUBE_COUNT }).map((_, i) => ({
			x: random(`cx-${i}`) * 100,
			y: random(`cy-${i}`) * 100,
			size: random(`cs-${i}`) * 150 + 50, // Large squares
			rotationSpeed: (random(`cr-${i}`) - 0.5) * 2,
			opacity: random(`co-${i}`) * 0.2 + 0.05,
			depth: random(`cd-${i}`) * 0.5 + 0.5, // Parallax depth
		}));
	}, []);

	return (
		<AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
			
			{/* 1. GRADIENT BASE (Themed) */}
			{/* Uses secondary color for depth */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: `radial-gradient(circle at 50% 30%, ${secondaryColor} 0%, #1a1a1a 60%, #000000 100%)`,
					zIndex: 0,
				}}
			/>

			{/* 2. FLOATING GEOMETRIC CUBES/SQUARES */}
			{/* The "Effect" part: Translucent squares floating in space */}
			{cubes.map((c, i) => (
				<div
					key={`cube-${i}`}
					style={{
						position: "absolute",
						left: `${c.x}%`,
						top: `${c.y}%`,
						width: c.size,
						height: c.size,
						backgroundColor: `${color}1A`, // 10% opacity using hex if possible, or rgba. Let's assume hex input. If hex, appending 1A works if 6 digits.
						// Safer to use style override or assume input is valid color string. simpler to use box-shadow or border color
						border: `1px solid ${color}`,
						transform: `
							translateY(${Math.sin(frame * 0.02 * c.rotationSpeed) * 20}px) 
							rotate(${frame * 0.5 * c.rotationSpeed}deg)
							scale(${c.depth})
						`,
						opacity: c.opacity, // Low opacity
						zIndex: 1,
						// Glassmorphism feel
						boxShadow: `inset 0 0 20px ${color}33`, // 20% opacity
						backdropFilter: "blur(2px)",
					}}
				/>
			))}

			{/* 3. BOKEH PARTICLES (Soft Orbs) */}
			{particles.map((p, i) => {
				const yPos = (p.y - frame * p.speed) % 120;
				return (
					<div
						key={`p-${i}`}
						style={{
							position: "absolute",
							left: `${p.x}%`,
							top: `${yPos < -20 ? 120 : yPos}%`,
							width: p.size,
							height: p.size,
							background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
							borderRadius: "50%",
							opacity: p.opacity,
							zIndex: 2,
							transform: `scale(${1 + Math.sin(frame * 0.05 + p.delay) * 0.2})`, // Pulse
							filter: "blur(10px)", // Softness
							mixBlendMode: "screen",
						}}
					/>
				);
			})}

			{/* 4. LENS FLARE / LIGHT SOURCE */}
			{/* Strong light on the left/center */}
			<div
				style={{
					position: "absolute",
					top: "30%",
					left: "10%",
					width: 800,
					height: 800,
					background: `radial-gradient(circle, ${color}66 0%, ${secondaryColor}33 40%, transparent 70%)`,
					filter: "blur(80px)",
					mixBlendMode: "screen",
					zIndex: 3,
					opacity: 0.8 + Math.sin(frame * 0.05) * 0.2, // Breathing light
					transform: "translate(-50%, -50%)",
				}}
			/>

			{/* 5. VIGNETTE */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,1) 120%)",
					zIndex: 4,
					pointerEvents: "none",
				}}
			/>
		</AbsoluteFill>
	);
};
