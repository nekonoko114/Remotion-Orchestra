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
	const nameFontSize = 70; // Reduced to 70 for optimal balance

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
						fontSize: 140,
						fontFamily: "Impact, sans-serif",
						fontWeight: "bold",
						textAlign: "center",
						margin: 0,
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
								key={liver.unique_id}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 40, // More gap between elements
									backgroundColor: "rgba(0,0,0,0.6)",
									padding: itemPadding,
									borderRadius: 100,
									border: "4px solid #FFD700",
									transform: `translateX(${interpolate(liverEntrance, [0, 1], [1000, 0])}px)`,
									opacity: interpolate(liverEntrance, [0, 0.4], [0, 1]),
									position: "relative", // Needed for absolute background
									overflow: "hidden", // Clip the blur
								}}
							>
								{/* Blurred Background */}
								<AbsoluteFill style={{ zIndex: -1, opacity: 0.4 }}>
									{liver.saved_to ? (
										<Img
											src={staticFile(liver.saved_to)}
											style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px)" }}
										/>
									) : (
										<Img
											src={liver.image_url}
											style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px)" }}
										/>
									)}
								</AbsoluteFill>

								{/* Dark overlay for readability */}
								<AbsoluteFill style={{ zIndex: -1, backgroundColor: "rgba(0,0,0,0.3)" }} />

								{/* Left Unit: Rank (Top) + Icon (Bottom) */}
								<div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: rankWidth, gap: 10, position: "relative", zIndex: 1 }}>
									{/* Rank Number */}
									<div style={{ fontSize: rankFontSize, fontWeight: 900, color: "#FFD700", textAlign: 'center', lineHeight: 1 }}>
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
										{liver.saved_to ? (
											<Img
												src={staticFile(liver.saved_to)}
												style={{ width: "100%", height: "100%", objectFit: "cover" }}
											/>
										) : (
											<Img
												src={liver.image_url}
												style={{ width: "100%", height: "100%", objectFit: "cover" }}
											/>
										)}
									</div>
								</div>

								{/* Name Area - Larger and Wider */}
								<div style={{ 
									fontSize: nameFontSize, 
									color: "white", 
									fontWeight: "bold", 
									flex: 1, 
									marginLeft: 20, 
									position: "relative", 
									zIndex: 1, 
									lineHeight: 1.1,
									textShadow: "0 4px 10px rgba(0,0,0,0.5)"
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
