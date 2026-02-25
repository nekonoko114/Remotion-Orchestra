import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile, // Added
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import type { Liver } from "./types";
import { OpeningBackground } from "./OpeningBackground";

type Props = {
	title: string;
	livers: Liver[];
};

export const RankingGroup: React.FC<Props> = ({ title, livers }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 100 },
	});

	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	const scale = interpolate(entrance, [0, 1], [0.95, 1]);

	const is3Group = livers.length === 3;
	const gap = is3Group ? 80 : 60;
	const itemPadding = is3Group ? "30px 40px" : "30px 50px";
	const rankFontSize = is3Group ? 90 : 70; // Adjusted for stacking
	const rankWidth = is3Group ? 200 : 160; // Widened for icon + rank stack
	const iconSize = is3Group ? 200 : 150; // Slightly smaller to fit stack
	const nameFontSize = 50; // Reduced to 50 for optimal balance as per user's preference

	return (
		<AbsoluteFill>
			{/* Replaced per user request: "Same background as Opening for 10-4" */}
			<OpeningBackground />
			
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					opacity,
					transform: `scale(${scale})`,
				}}
			>
				{/* Title */}
				<h1
					className="metallic-gold"
					style={{
						position: "absolute",
						top: 120,
						fontSize: 120, // Adjusted from 140 to 120
						// Dark knight style for typography
						fontFamily: "'Segoe UI', Roboto, sans-serif",
						fontWeight: "900",
						textAlign: "center",
						margin: 0,
						textShadow: "0 5px 15px rgba(255,0,0,0.8)", // 赤のオーラ
					}}
				>
					{title}
				</h1>

				{/* List Area */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap,
						width: "90%", // Increased width
						marginTop: 250,
					}}
				>
					{livers.map((liver, index) => {
						const liverEntrance = spring({
							frame: frame - (index * 5) - 10,
							fps,
							config: { damping: 12, stiffness: 120 },
						});

						return (
							<div
								key={liver.rank}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 40, // More gap between elements
									borderRadius: 100,
									border: "4px solid #8B0000", // Dark Red border
									boxShadow: "0 0 20px rgba(255, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8)", // 赤の光と黒のシャドウ
									backgroundColor: "rgba(0,0,0,0.7)", // 背景を黒透過に
									transform: `translateY(${interpolate(liverEntrance, [0, 1], [-1000, 0])}px)`,
									opacity: interpolate(liverEntrance, [0, 0.4], [0, 1]),
									position: "relative", // Needed for absolute background
									overflow: "hidden", // Clip the blur
								}}
							>
								{/* Blurred Background */}
								<AbsoluteFill style={{ opacity: 0.9 }}>
									{liver.saved_to ? (
										<Img
											src={staticFile(liver.saved_to)}
											style={{ 
												width: "100%", 
												height: "100%", 
												objectFit: "cover", 
												objectPosition: liver.rank === 6 ? "center 15%" : "center",
											}}
										/>
									) : (
										<Img
											src={liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url)}
											style={{ width: "100%", height: "100%", objectFit: "cover" }}
										/>
									)}
								</AbsoluteFill>

								{/* Dark overlay for readability */}
								<AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />

								{/* Left Unit: Rank (Top) + Icon (Bottom) */}
								<div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: rankWidth, gap: 10, position: "relative", zIndex: 1 }}>
									{/* Rank Number */}
									<div style={{ 
										fontSize: rankFontSize, 
										fontWeight: 900, 
										color: "#FFD700", // Gold
										textAlign: 'center', 
										lineHeight: 1,
										textShadow: "0 2px 10px rgba(255,0,0,0.8)" // Red shadow to pop out
									}}>
										{liver.rank}th
									</div>
									
									{/* Icon */}
									<div
										style={{
											width: iconSize,
											height: iconSize,
											borderRadius: "50%",
											overflow: "hidden",
											border: "4px solid white",
											backgroundColor: "#333",
										}}
									>
										<Img
											src={
												liver.saved_to 
													? staticFile(liver.saved_to) 
													: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
											}
											style={{ 
												width: "100%", 
												height: "100%", 
												objectFit: "cover",
												// Focus on face for Rank 6
												objectPosition: liver.rank === 6 ? "center 15%" : "center",
												transform: liver.rank === 6 ? "scale(1.1)" : "none"
											}}
										/>
									</div>
								</div>

								{/* Name Area - Adaptive font size to prevent cut-off */}
								<div style={{ 
									fontSize: liver.nickname.length > 8 ? nameFontSize * 0.8 : nameFontSize, 
									color: "white", 
									fontWeight: "bold", 
									flex: 1, 
									marginLeft: 20, 
									marginRight: 60, // Stronger margin to prevent border clipping
									position: "relative", 
									zIndex: 1, 
									lineHeight: 1.1,
									textAlign: "center",
									textShadow: "0 4px 10px rgba(0,0,0,0.5)",
									whiteSpace: "nowrap",
									overflow: "visible", 
								}}>
									{liver.nickname}
								</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
