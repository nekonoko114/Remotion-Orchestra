import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

export const SpeedLines: React.FC<{
	count?: number;
	color?: string;
}> = ({ count = 40, color = "rgba(255, 255, 255, 0.4)" }) => {
	const frame = useCurrentFrame();

	const lines = new Array(count).fill(0).map((_, i) => {
		const angle = (i / count) * 360;
		const length = random(`len-${i}-${Math.floor(frame / 2)}`) * 400 + 400;
		const thickness = random(`thick-${i}`) * 4 + 1;
		const opacity = random(`op-${i}-${frame}`) > 0.5 ? 1 : 0;

		return (
			<div
				key={i}
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: `${length}px`,
					height: `${thickness}px`,
					backgroundColor: color,
					transform: `rotate(${angle}deg) translateX(300px)`,
					transformOrigin: "left center",
					opacity,
				}}
			/>
		);
	});

	return (
		<AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
			{lines}
		</AbsoluteFill>
	);
};
