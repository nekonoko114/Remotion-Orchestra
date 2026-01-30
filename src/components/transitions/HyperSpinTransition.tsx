import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

/**
 * 激しい回転とスケール変化を伴うアニメーションエフェクト
 */
export const HyperSpinTransition: React.FC<{
	children: React.ReactNode;
	type: "in" | "out";
	duration?: number;
}> = ({ children, type, duration = 20 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const spr = spring({
		frame: type === "in" ? frame : duration - frame,
		fps,
		durationInFrames: duration,
		config: {
			damping: 15,
			stiffness: 150,
			mass: 0.8,
		},
	});

	// Violent spin: 0.5 to 1 rotation
	const rotation =
		type === "in"
			? interpolate(spr, [0, 1], [360, 0])
			: interpolate(spr, [0, 1], [-180, 0]);

	// Scale bounce
	const scale =
		type === "in"
			? interpolate(spr, [0, 0.5, 1], [0, 1.3, 1])
			: interpolate(spr, [0, 1], [2, 1]);

	// Simulated Radial Blur
	const blur = interpolate(spr, [0, 1], [40, 0]);
	const opacity = interpolate(spr, [0, 0.3], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				transform: `rotate(${rotation}deg) scale(${scale}) translate3d(0, 0, 0)`,
				filter: `blur(${blur}px)`,
				opacity,
				transformOrigin: "50% 50%",
				willChange: "transform, filter, opacity",
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
