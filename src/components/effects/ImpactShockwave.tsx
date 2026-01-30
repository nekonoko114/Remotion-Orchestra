import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const ImpactShockwave: React.FC<{
	delay?: number;
	duration?: number;
}> = ({ delay = 0, duration = 20 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const spr = spring({
		frame: frame - delay,
		fps,
		durationInFrames: duration,
		config: { damping: 20 },
	});

	const radius = interpolate(spr, [0, 1], [0, 100]);
	const opacity = interpolate(spr, [0, 0.1, 0.8, 1], [0, 0.6, 0.6, 0]);
	const borderWeight = interpolate(spr, [0, 1], [100, 0]);

	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					width: `${radius * 2}%`,
					height: `${radius * 2}%`,
					border: `${borderWeight}px solid rgba(255, 255, 255, ${opacity})`,
					borderRadius: "50%",
					boxShadow: `0 0 50px rgba(255, 255, 255, ${opacity})`,
					filter: "blur(10px)",
					opacity,
				}}
			/>
		</AbsoluteFill>
	);
};
