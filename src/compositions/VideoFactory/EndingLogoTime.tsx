import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { LensFlare } from "../../components/effects/LensFlare"; // Import LensFlare
import { TimeBackground } from "./TimeBackground";

export const EndingLogoTime: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames, width } = useVideoConfig();

	const opacity = interpolate(
		frame,
		[0, 20, durationInFrames - 20, durationInFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
		extrapolateRight: "clamp",
	});

	// Rotation for God Rays
	const rayRotate = frame * 0.2;

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
				opacity,
				background: "#000", // Base black
			}}
		>
			{/* 1. BACKGROUND: Unified Time Theme */}
			<AbsoluteFill style={{ zIndex: 0 }}>
				{/* 
                    Use the same TimeBackground as Opening/Ranking.
                */}
				<TimeBackground />
				
				{/* Brightening Gradient Overlay (Blue/Cyan) */}
				<AbsoluteFill 
					style={{
						background: "radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, transparent 80%)",
						mixBlendMode: "screen",
					}}
				/>
			</AbsoluteFill>

			{/* 2. GOD RAYS (Cyan/Blue - "Time" Energy) */}
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

			{/* 3. CENTRAL GLOW (Behind Logo) */}
			<div
				style={{
					position: "absolute",
					width: 1000,
					height: 1000,
					background:
						"radial-gradient(circle, rgba(0, 240, 255, 0.5) 0%, rgba(0, 50, 150, 0.3) 50%, transparent 80%)",
					zIndex: 2,
					top: "50%",
					left: "50%",
					transform: `translate(-50%, -50%) scale(${scale})`,
					mixBlendMode: "screen",
					filter: "blur(40px)",
				}}
			/>

			{/* 4. LOGO CONTAINER */}
			<div
				style={{
					position: "relative",
					width: "70%",
					maxWidth: 900,
					zIndex: 10,
					transform: `scale(${scale})`,
					// A subtle blue drop shadow instead of black
					filter: "drop-shadow(0px 0px 30px rgba(0, 240, 255, 0.3))",
				}}
			>
				{/* Logo Image */}
				<Img
					src={staticFile("video-factory/images/logo/logo.png")}
					style={{
						width: "100%",
						objectFit: "contain",
						mixBlendMode: "screen", // Assumes black bg in logo image
						filter: "contrast(1.2) brightness(1.1)", 
					}}
				/>

				{/* Shine Sweep Effect (Cyan Tinted) */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(120deg, transparent 30%, rgba(200, 255, 255, 0.9) 50%, transparent 70%)",
						backgroundSize: "200% 100%",
						backgroundPosition: `${interpolate(frame, [30, 90], [150, -50])}%`,
						mixBlendMode: "overlay",
						opacity: interpolate(frame, [30, 60, 90], [0, 1, 0]),
						WebkitMaskImage: `url(${staticFile("video-factory/images/logo/logo.png")})`,
						WebkitMaskSize: "contain",
						WebkitMaskRepeat: "no-repeat",
						WebkitMaskPosition: "center",
					}}
				/>
			</div>

			{/* 5. LENS FLARE (Cinematic Polish) */}
			<AbsoluteFill style={{ zIndex: 20, pointerEvents: "none" }}>
				<LensFlare
					opacity={0.6}
					scale={1.2}
					color="#00f0ff" // Cyan flare
					intensity={1.0}
				/>
			</AbsoluteFill>

			{/* 6. FINAL BRIGHTNESS BLOOM (Global) */}
			<AbsoluteFill
				style={{
					background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 90%)",
					zIndex: 100,
					pointerEvents: "none",
					mixBlendMode: "overlay",
				}}
			/>
		</AbsoluteFill>
	);
};
