import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";

export const Scene4_Sunset: React.FC = () => {
	const frame = useCurrentFrame();
	const brightness = interpolate(frame, [0, 120], [1, 0.7]);

	return (
		<AbsoluteFill
			style={{ backgroundColor: "black", filter: `brightness(${brightness})` }}
		>
			<Img
				src={staticFile("images/generated/CatsAdventure/scene_4.webp")}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
			<div
				style={{
					position: "absolute",
					top: "15%",
					right: "20%",
					fontSize: "100px",
					filter: "drop-shadow(0 0 20px orange)",
				}}
			>
				🌅
			</div>
		</AbsoluteFill>
	);
};
