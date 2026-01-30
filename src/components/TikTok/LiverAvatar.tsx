import type React from "react";
import {
	Img,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

interface LiverAvatarProps {
	name: string;
	imageUrl: string;
	rank: number;
	score: string;
	delay?: number;
}

export const LiverAvatar: React.FC<LiverAvatarProps> = ({
	name,
	imageUrl,
	rank,
	score,
	delay = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();
	const isPortrait = height > width;

	const spr = spring({
		frame: frame - delay,
		fps,
		config: { stiffness: 100 },
	});

	const opacity = interpolate(spr, [0, 1], [0, 1]);
	const scale = interpolate(spr, [0, 1], [0.5, 1]);
	const translateX = interpolate(spr, [0, 1], [-50, 0]);

	const getRankColor = (r: number) => {
		if (r === 1) return "#FFD700";
		if (r === 2) return "#C0C0C0";
		if (r === 3) return "#CD7F32";
		return "#FFFFFF";
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: isPortrait ? "20px" : "30px",
				padding: isPortrait ? "20px 30px" : "25px 40px",
				backgroundColor: "rgba(255, 255, 255, 0.1)",
				backdropFilter: "blur(10px)",
				borderRadius: isPortrait ? "100px" : "20px",
				border: `2px solid ${getRankColor(rank)}`,
				width: isPortrait ? "85%" : "450px",
				opacity,
				transform: `scale(${scale}) translateX(${translateX}px)`,
				boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
				willChange: "transform, opacity",
			}}
		>
			<div
				style={{
					width: "60px",
					height: "60px",
					backgroundColor: getRankColor(rank),
					borderRadius: "50%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#000",
					fontSize: "28px",
					fontWeight: "bold",
				}}
			>
				{rank}
			</div>
			<div
				style={{
					width: "80px",
					height: "80px",
					borderRadius: "50%",
					overflow: "hidden",
					border: "3px solid #fff",
				}}
			>
				<Img
					src={imageUrl}
					alt={name}
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</div>
			<div style={{ flex: 1 }}>
				<div
					style={{
						color: "#fff",
						fontSize: isPortrait ? "32px" : "28px",
						fontWeight: "bold",
					}}
				>
					{name}
				</div>
				<div
					style={{
						color: getRankColor(rank),
						fontSize: isPortrait ? "24px" : "22px",
						fontWeight: "600",
					}}
				>
					{score} pts
				</div>
			</div>
		</div>
	);
};
