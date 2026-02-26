import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Video,
} from "remotion";
import { TimeBackground } from "./TimeBackground";

export const EndingLogoTime: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames, width } = useVideoConfig();

	// Removed unused opacity interpolate

	const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
		extrapolateRight: "clamp",
	});

	// Rotation for God Rays
	const rayRotate = frame * 0.2;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000", zIndex: 5000 }}>
			{/* 1. BACKGROUND LAYER (No opacity fade) */}
			<AbsoluteFill style={{ zIndex: 1 }}>
				<TimeBackground hideBaseVideo />
				
				{/* Purple Loop Background */}
				<AbsoluteFill>
					<Video 
						src={staticFile("assets/backgrounds/purple_loop.mp4")}
						loop
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							opacity: 0.8,
						}}
					/>
				</AbsoluteFill>

				{/* Brightening Gradient Overlay (Blue/Cyan) */}
				<AbsoluteFill 
					style={{
						background: "radial-gradient(circle at center, rgba(0, 240, 255, 0.2) 0%, transparent 80%)",
					}}
				/>
			</AbsoluteFill>

			{/* 2. GOD RAYS LAYER */}
			<div
				style={{
					position: "absolute",
					width: width * 2,
					height: width * 2,
					background:
						`conic-gradient(from ${rayRotate}deg, 
                            transparent 0deg, 
                            rgba(0, 240, 255, 0.3) 20deg, 
                            transparent 40deg, 
                            rgba(0, 100, 255, 0.3) 60deg, 
                            transparent 80deg, 
                            rgba(0, 240, 255, 0.3) 100deg, 
                            transparent 120deg, 
                            rgba(0, 100, 255, 0.3) 140deg, 
                            transparent 160deg
                        )`,
					zIndex: 1,
					top: "50%",
					left: "50%",
					transform: `translate(-50%, -50%) scale(${scale})`,
					filter: "blur(80px)",
					mixBlendMode: "screen",
					opacity: 0.8,
				}}
			/>

			{/* 3. CONTENT LAYER (Logo & Glow - Absolute Vanguard) */}
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					opacity: 1, // Visible immediately for transition
					zIndex: 9000,
				}}
			>
				{/* CENTRAL NEON GLOW */}
				<div
					style={{
						position: "absolute",
						width: 1200,
						height: 1200,
						background:
							"radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, rgba(0, 50, 255, 0.1) 40%, transparent 70%)",
						top: "50%",
						left: "50%",
						transform: `translate(-50%, -50%) scale(${scale})`,
						mixBlendMode: "screen",
						filter: "blur(60px)",
					}}
				/>

				{/* PREMIUM LOGO CONTAINER */}
				<div
					style={{
						position: "relative",
						width: 800,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						transform: `scale(${scale})`,
						filter: "drop-shadow(0px 20px 60px rgba(0, 0, 0, 1)) drop-shadow(0px 0px 30px rgba(0, 240, 255, 0.2))",
						zIndex: 9001,
					}}
				>
					<Img
						src={staticFile("jol-logo-800.png")}
						style={{
							width: "100%",
							height: "auto",
							objectFit: "contain",
						}}
					/>
				</div>
			</AbsoluteFill>

		</AbsoluteFill>
	);
};
