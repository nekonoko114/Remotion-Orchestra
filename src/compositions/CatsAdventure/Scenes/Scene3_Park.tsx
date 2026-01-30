import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";

export const Scene3_Park: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 20], [0, 1]);

	return (
		<AbsoluteFill style={{ backgroundColor: "black", opacity }}>
			<Img
				src={staticFile("images/generated/CatsAdventure/scene_3.png")}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
			<div
				style={{
					position: "absolute",
					top: "5%",
					width: "100%",
					textAlign: "center",
					fontSize: "40px",
					color: "white",
					textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
					fontWeight: "bold",
				}}
			>
				穏やかな公園の時間
			</div>
		</AbsoluteFill>
	);
};
