import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { HeatDistortion } from "../../components/effects/HeatDistortion";
import { FireBackground } from "./FireBackground";

export const EndingLogo: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	const opacity = interpolate(
		frame,
		[0, 20, durationInFrames - 20, durationInFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			<AbsoluteFill>
				<HeatDistortion intensity={10} frequency={0.005}>
					<FireBackground />
				</HeatDistortion>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					opacity,
				}}
			>
				<div
					style={{
						transform: `scale(${scale})`,
						width: "70%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Img
						src={staticFile("video-factory/images/logo/logo.png")}
						style={{
							width: "100%",
							objectFit: "contain",
							filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.8))",
						}}
					/>
				</div>
			</AbsoluteFill>

			{/* Cinematic Vignette */}
			<AbsoluteFill
				style={{
					background: "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)",
					pointerEvents: "none",
				}}
			/>
		</AbsoluteFill>
	);
};
