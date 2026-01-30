import type React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";

export const GlitchOverlay: React.FC = () => {
	const frame = useCurrentFrame();

	// Random glitch triggers
	const glitchIntensity = interpolate(
		Math.sin(frame / 5) + random(frame),
		[-2, 2],
		[0, 1],
	);

	const shouldGlitch = glitchIntensity > 0.6; // More frequent glitches

	if (!shouldGlitch) return null;

	const clipPathBase = random(frame) * 100;

	return (
		<div
			className="absolute inset-0 z-50 pointer-events-none mix-blend-color-dodge" // Changed blend mode
			style={{
				clipPath: `inset(${clipPathBase}% 0 ${100 - clipPathBase - 5}% 0)`, // Thinner slice
				transform: `translateX(${random(frame + 1) * 40 - 20}px)`, // More shake
				backgroundColor:
					frame % 2 === 0 ? "rgba(0, 255, 255, 0.2)" : "rgba(255, 0, 255, 0.2)",
				willChange: "transform, clip-path",
			}}
		/>
	);
};
