import type React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

export const LightLeak: React.FC = () => {
	const frame = useCurrentFrame();

	const opacity = interpolate(Math.sin(frame / 20), [-1, 1], [0.1, 0.4]);
	const posX = interpolate(random(Math.floor(frame / 60)), [0, 1], [-20, 20]);

	return (
		<AbsoluteFill style={{ pointerEvents: "none" }}>
			<div
				style={{
					position: "absolute",
					top: "-50%",
					left: `${posX}%`,
					width: "150%",
					height: "200%",
					background:
						"radial-gradient(circle, rgba(255,150,50,0.8) 0%, rgba(255,50,150,0) 70%)",
					filter: "blur(100px)",
					opacity,
					mixBlendMode: "screen",
					transform: "translate3d(0, 0, 0)",
					willChange: "transform, opacity",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "-50%",
					right: `${-posX}%`,
					width: "150%",
					height: "200%",
					background:
						"radial-gradient(circle, rgba(50,150,255,0.6) 0%, rgba(50,50,255,0) 70%)",
					filter: "blur(120px)",
					opacity: opacity * 0.8,
					mixBlendMode: "screen",
					transform: "translate3d(0, 0, 0)",
					willChange: "transform, opacity",
				}}
			/>
		</AbsoluteFill>
	);
};
