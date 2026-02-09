import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";

export const Scene2_Walk: React.FC = () => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [0, 120], [0, -100]);

	return (
		<AbsoluteFill style={{ backgroundColor: "black" }}>
			<AbsoluteFill style={{ transform: `translateX(${x}px) scale(1.1)` }}>
				<Img
					src={staticFile("images/generated/CatsAdventure/scene_2.webp")}
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</AbsoluteFill>
			<div
				style={{
					position: "absolute",
					top: "20%",
					right: "15%",
					fontSize: "60px",
					filter: "drop-shadow(0 0 15px white)",
				}}
			>
				🦋
			</div>
		</AbsoluteFill>
	);
};
