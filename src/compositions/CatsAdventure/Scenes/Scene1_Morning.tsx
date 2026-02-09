import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";

export const Scene1_Morning: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 30], [0, 1]);
	const scale = interpolate(frame, [0, 120], [1, 1.1]);

	return (
		<AbsoluteFill style={{ backgroundColor: "black" }}>
			<AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
				<Img
					src={staticFile("images/generated/CatsAdventure/scene_1.webp")}
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</AbsoluteFill>
			<div
				style={{
					position: "absolute",
					top: "10%",
					left: "10%",
					fontSize: "80px",
					filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
				}}
			>
				☀️
			</div>
		</AbsoluteFill>
	);
};
