import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";

export const Scene5_Home: React.FC = () => {
	const frame = useCurrentFrame();
	const blackout = interpolate(frame, [90, 120], [0, 1]);

	return (
		<AbsoluteFill style={{ backgroundColor: "black" }}>
			<Img
				src={staticFile("images/generated/CatsAdventure/scene_5.png")}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
			<AbsoluteFill style={{ backgroundColor: "#000", opacity: blackout }} />
			<div
				style={{
					position: "absolute",
					top: "40%",
					width: "100%",
					textAlign: "center",
					fontSize: "80px",
					color: "white",
					fontWeight: "bold",
					textShadow: "0 0 20px rgba(0,0,0,0.8)",
				}}
			>
				Home Sweet Home
			</div>
		</AbsoluteFill>
	);
};
