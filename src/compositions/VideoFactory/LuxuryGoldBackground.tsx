import { AbsoluteFill, staticFile, Video, Loop } from "remotion";
import React, { useMemo } from "react";

type Props = {
	color?: string;
	secondaryColor?: string;
};

// Map hex colors to video filenames
// We use a helper to detect the "intent" of the color prop
const getColorVideo = (color: string) => {
	const c = color.toLowerCase();
	if (c.includes("4444") || c.includes("ruby") || c.includes("f00")) return "red_loop.mp4";
	if (c.includes("44ff") || c.includes("emerald") || c.includes("0f0")) return "green_loop.mp4";
	if (c.includes("4488") || c.includes("sapphire") || c.includes("00f")) return "blue_loop.mp4";
	if (c.includes("bb44") || c.includes("amethyst") || c.includes("800080")) return "purple_loop.mp4";
	return "gold_loop.mp4"; // Default
};

export const LuxuryGoldBackground: React.FC<Props> = ({
	color = "#FFD700",
	secondaryColor = "#553300"
}) => {
	const videoFile = useMemo(() => getColorVideo(color), [color]);

	return (
		<AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>

			{/* 1. GRADIENT BASE (Themed) */}
			{/* We keep the CSS gradient because the video is transparent ProRes */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: `radial-gradient(circle at 50% 30%, ${secondaryColor} 0%, #1a1a1a 60%, #000000 100%)`,
					zIndex: 0,
				}}
			/>

			{/* 2. PRE-RENDERED LUXURY ASSET (Particles & God Rays) */}
			{/* This single video layer replaces 3000+ calculated particles */}
			<Loop durationInFrames={300}>
				<Video
					src={staticFile(`assets/backgrounds/${videoFile}`)}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						zIndex: 1,
					}}
					muted
				/>
			</Loop>
			
			{/* 3. VIGNETTE (Overlay to tie it all together) */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 120%)",
					zIndex: 2,
					pointerEvents: "none",
				}}
			/>
		</AbsoluteFill>
	);
};
