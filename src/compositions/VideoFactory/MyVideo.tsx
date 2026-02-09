import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const MyVideo = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const scale = spring({
		frame,
		fps,
		config: {
			damping: 12,
		},
	});

	const yOffset = Math.sin(frame / 20) * 20; // 20フレーム周期で20px上下する

	const opacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateRight: "clamp",
	});

	const logoPath = staticFile("video-factory/images/logo/logo.webp");

	const audioPath = staticFile("video-factory/audio/Over_Speed.mp3");

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "white",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Audio src={audioPath} />
			<div
				style={{
					transform: `translateY(${yOffset}px)`, // ここでふわふわさせる
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Img
					src={logoPath}
					style={{
						width: 500,
						transform: `scale(${scale})`,
						opacity: opacity,
					}}
				/>

				<h1
					style={{
						fontFamily: "Helvetica, Arial, sans-serif",
						marginTop: 30,
						opacity,
						background: "linear-gradient(90deg, #FF0080, #7928CA)", // グラデーション文字
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					JOL Project
				</h1>
			</div>
		</AbsoluteFill>
	);
};
