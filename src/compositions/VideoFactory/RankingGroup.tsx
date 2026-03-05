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

type Props = {
	title: string;
	livers: Liver[];
};

const getAvatarPosition = (rank: number) => {
	// Diamond Ranking specific adjustments
	if (rank === 10) return "center 20%"; // だぁ～み (より上に)
	if (rank === 8) return "center 25%";  // やらかしタロー
	if (rank === 7) return "center 20%";  // yukiんこ
	if (rank === 6) return "center 50%";   // ユージン (より上に)
	if (rank === 5) return "center 50%";   // 一条美月 (アイコンとの重なりを避ける)
	if (rank === 4) return "center 15%";  // 限界突破まみ
	return "center";
};

const getBackgroundPosition = (rank: number) => {
	if (rank === 5) return "0% 50%"; // 背景画像の左端を合わせることで、被写体を右へ押し出す
	return getAvatarPosition(rank);
};

const getBackgroundTransform = (rank: number) => {
	if (rank === 5) return "scale(1.2) translateX(10%)"; // さらに右へ押し出す
	return "none";
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
	const is2Group = livers.length === 2;
	const gap = is2Group ? 120 : (is3Group ? 80 : 60);
	const rankFontSize = is2Group ? 120 : (is3Group ? 90 : 70); 
	const rankWidth = is2Group ? 250 : (is3Group ? 200 : 160); 
	const iconSize = is2Group ? 300 : (is3Group ? 200 : 150); 
	const nameFontSize = is2Group ? 80 : 50; 

	return (
		<AbsoluteFill>
			{/* Replaced per user request: "Temple/Shrine of Dark Knights for 10-4" */}
			<AbsoluteFill style={{ backgroundColor: "#000" }}>
				<Img 
					src={staticFile(
						title.includes("10") 
							? "assets/backgrounds/dark_temple_bg_top10.png"
							: "assets/backgrounds/dark_temple_bg_top6.png"
					)}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						opacity: 0.8, // 文字を目立たせつつ明るさを維持
					}}
				/>
				{/* 漆黒感を維持しつつ暗すぎないグラデーション */}
				<AbsoluteFill
					style={{
						background: "radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
						pointerEvents: "none",
					}}
				/>
			</AbsoluteFill>
			
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
									alignItems: "end",
									gap: is2Group ? 60 : 40, 
									borderRadius: 40, // More rounded for larger icons
									border: "4px solid #8B0000", 
									boxShadow: "0 0 20px 10px rgba(255, 0, 0, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8)", 
									backgroundColor: "rgba(0,0,0,0.4)", 
									transform: `translateY(${interpolate(liverEntrance, [0, 1], [-1000, 0])}px)`,
									opacity: interpolate(liverEntrance, [0, 0.4], [0, 1]),
									position: "relative", 
									overflow: "hidden", 
									padding: is2Group ? "60px 40px" : (is3Group ? "40px 30px" : "20px 30px"),
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
												objectPosition: getBackgroundPosition(liver.rank),
												transform: getBackgroundTransform(liver.rank),
											}}
										/>
									) : (
										<Img
											src={liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url)}
											style={{ 
												width: "100%", 
												height: "100%", 
												objectFit: "cover",
												objectPosition: getBackgroundPosition(liver.rank),
												transform: getBackgroundTransform(liver.rank),
											}}
										/>
									)}
								</AbsoluteFill>

								{/* Dark overlay for readability */}
								<AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.2)" }} />

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
												objectPosition: getAvatarPosition(liver.rank),
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
