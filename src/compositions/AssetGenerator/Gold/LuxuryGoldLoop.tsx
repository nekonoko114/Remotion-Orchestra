import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// "Asset Generator" version: No performance limits.
// Render this once to ProRes/High-Bitrate MP4.

type Props = {
	color?: string;
	secondaryColor?: string;
};

export const LuxuryGoldLoop: React.FC<Props> = ({ 
	color = "#FFD700", 
	secondaryColor = "#553300" 
}) => {
	const frame = useCurrentFrame();

	// 1. MASSIVE Particle Count (vs 80 in optimized version)
	// User set to 400 manually, which is good balance.
	const particles = useMemo(() => {
		return Array.from({ length: 3000 }).map((_, i) => ({
			x: random(`x-${i}`) * 100,
			y: random(`y-${i}`) * 100,
			size: random(`s-${i}`) * 150 + 20, 
			opacity: random(`o-${i}`) * 0.6 + 0.2, 
			speed: random(`sp-${i}`) * 0.3 + 0.1,
			delay: random(`d-${i}`) * 100,
			blur: random(`b-${i}`) * 10, // Per-particle blur
		}));
	}, []);


	return (
		<AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000000" }}>
			
			{/* LAYER 1: Removed Greenish Gradient per feedback */}

			{/* LAYER 1.5: Rotating "God Rays" (Volumetric Light) */}
			{/* Changed blend mode to 'screen' so it's visible on black */}
			<AbsoluteFill style={{
				background: `conic-gradient(from ${frame * 0.5}deg at 50% 50%, transparent 0deg, ${color}33 20deg, transparent 40deg, transparent 100deg, ${color}33 140deg, transparent 180deg)`,
				mixBlendMode: "screen", 
				filter: "blur(50px)",
				zIndex: 1,
				opacity: 0.5,
			}} />

			{/* LAYER 3: Luxury Spiral Gold Dust */}
			{particles.map((p, i) => {
				// Spiral Logic: Front to Back
				const depthCycle = 2000; 
				const currentZ = (frame * p.speed * 50 + p.delay * 20) % depthCycle;
				const progress = currentZ / depthCycle; // 0 (near) to 1 (far)

				// Perspective & DoF (Depth of Field)
				const scale = 1 / (0.2 + progress * 4); 
				const opacity = Math.min(1, (1 - progress) * 1.5) * p.opacity; 
				
				// Blur based on depth (Blurry at back, Sharp at front)
				const blurAmount = progress * 6; 

				// Spiral Motion
				const initialAngle = p.x * 0.1;
				const twist = progress * Math.PI * 4;
				const rotation = frame * 0.005;
				const angle = initialAngle + twist + rotation;

				const radiusBase = 60 + (p.y % 40); 
				const radius = radiusBase * scale;

				const x = 50 + Math.cos(angle) * radius;
				const y = 50 + Math.sin(angle) * radius * (1080 / 1920);

				if (scale < 0.1 || opacity <= 0.05) return null;

				// Twinkle Logic: Sharp flashes instead of smooth pulse
				// Math.pow(sin, 10) creates sharp spikes of value 0->1
				const twinkle = Math.pow((Math.sin(frame * 0.1 + p.delay) + 1) / 2, 8); 
				const extraBloom = twinkle * 1.5; // Flash up to 150% bigger

				return (
					<div
						key={`p-${i}`}
						style={{
							position: "absolute",
							left: `${x}%`,
							top: `${y}%`,
							width: p.size * 0.2 * scale * (1 + extraBloom), // Bloom size
							height: p.size * 0.2 * scale * (1 + extraBloom),
							background: color,
							borderRadius: "50%",
							opacity: opacity * (0.5 + twinkle * 0.5), // Flash opacity
							zIndex: Math.floor((1 - progress) * 100),
							transform: `translate(-50%, -50%)`,
							boxShadow: `0 0 ${p.size * scale * (0.5 + twinkle)}px ${color}`, // Dynamic Glow
							mixBlendMode: "screen",
							filter: `blur(${blurAmount}px)`, 
						}}
					/>
				);
			})}

			{/* LAYER 5: Animated Noise (Film Grain) */}
            <AbsoluteFill style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                opacity: 0.08,
                mixBlendMode: "overlay",
				transform: `translate(${Math.random() * 10}px, ${Math.random() * 10}px)` // Jitter
            }}/>

			{/* LAYER 6: Vignette */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: "radial-gradient(circle at center, transparent 40%, #000000CC 120%)", // Darker vignette
					zIndex: 10,
				}}
			/>
		</AbsoluteFill>
	);
};
