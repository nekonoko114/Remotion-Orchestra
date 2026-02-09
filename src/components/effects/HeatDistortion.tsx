import type React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const HeatDistortion: React.FC<{
	children?: React.ReactNode;
	intensity?: number; 
	frequency?: number;
}> = ({ children }) => {
	const frame = useCurrentFrame();

	// Optimized: Use a simple CSS-based distortion instead of heavy SVG feTurbulence
	// This uses a slight scaling and swaying to mimic heat without per-pixel displacement
	const scale = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.02]);
	const skewX = interpolate(Math.sin(frame * 0.05), [-1, 1], [-1, 1]);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					transform: `scale(${scale}) skewX(${skewX}deg)`,
					filter: "blur(2px)", // Very light blur for heat effect
					willChange: "transform",
				}}
			>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
