import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

export const LightningBolt: React.FC<{
	color?: string;
	intensity?: number;
	thickness?: number;
}> = ({ color = "#b0e0ff", intensity = 1, thickness = 3 }) => {
	const frame = useCurrentFrame();

	// Reduce strike frequency slightly - don't strike EVERY frame even at high intensity
	const isStrike = random(frame) > 0.85 / Math.min(intensity, 2);

	// Reduce segments significantly (10 -> 4) for much faster SVG path calculation and rendering
	const segments = 4;

	// 稲妻のパス生成
	const points = useMemo(() => {
		if (!isStrike) return "";

		let path = "";
		const startX = random(frame + 1) * 100;
		let currentX = startX;
		let currentY = 0;
		const stepY = 100 / segments;

		path += `${currentX},${currentY} `;

		for (let i = 0; i < segments; i++) {
			currentY += stepY;
			// Use deterministic but "lightning-like" movement
			const drift = (random(frame + i + 10) - 0.5) * 30;
			currentX += drift;
			path += `${currentX},${currentY} `;
		}

		return path;
	}, [frame, isStrike]);

	// Simplify sub-bolt logic even further (reduce segments 5 -> 2, lower probability)
	const subPoints = useMemo(() => {
		if (!isStrike || random(frame + 99) > 0.3) return "";
		let path = "";
		const startX = random(frame + 10) * 100;
		let currentX = startX;
		let currentY = 0;
		const subSegments = 2;
		const stepY = 100 / subSegments;
		path += `${currentX},${currentY} `;
		for (let i = 0; i < subSegments; i++) {
			currentY += stepY;
			currentX += (random(frame + i + 200) - 0.5) * 40;
			path += `${currentX},${currentY} `;
		}
		return path;
	}, [frame, isStrike]);

	if (!isStrike) {
		return null;
	}

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "transparent",
				overflow: "hidden",
				willChange: "opacity",
			}}
		>
			{/* Flash - Simplest possible div */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: color,
					opacity: 0.05, // Lowered opacity for performance/visual comfort
					mixBlendMode: "screen",
				}}
			/>

			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				aria-label="Lightning bolt"
				style={{ willChange: "opacity" }}
			>
				<title>Lightning Bolt</title>
				<defs>
					{/* Use a very simple blur for glow or skip it if possible */}
					<filter id="lightningGlowSimple">
						<feGaussianBlur stdDeviation="0.4" />
					</filter>
				</defs>

				{/* 
					Draw multiple polylines with different widths/opacities 
					instead of heavy filters to simulate glow if SVG filters are too slow.
					Here we keep one simple filter but reduce its radius.
				*/}
				<polyline
					points={points}
					fill="none"
					stroke={color}
					strokeWidth={thickness / 10}
					strokeLinecap="round"
					strokeLinejoin="round"
					filter="url(#lightningGlowSimple)"
				/>

				{subPoints && (
					<polyline
						points={subPoints}
						fill="none"
						stroke={color}
						strokeWidth={(thickness / 10) * 0.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						opacity={0.5}
						filter="url(#lightningGlowSimple)"
					/>
				)}
			</svg>
		</AbsoluteFill>
	);
};
