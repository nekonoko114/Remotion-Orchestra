import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Video } from "remotion";

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
				<Video
					src={staticFile("assets/backgrounds/daiamond-month.mp4")}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						objectPosition: "center",
						filter: "brightness(0.5) contrast(1.2)", // オープニングより少し暗め
					}}
					startFrom={0}
					playbackRate={1.5}
					muted
					loop
				/>
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
						width: 1080,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Img
						src={staticFile("jol-logo-800.png")}
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
