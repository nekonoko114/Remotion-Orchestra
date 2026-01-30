import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
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
						gap: 60, // Increased gap
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
									padding: "30px 50px", // Larger padding
									borderRadius: 100,
									border: "4px solid #FFD700",
									transform: `translateX(${interpolate(liverEntrance, [0, 1], [1000, 0])}px)`,
									opacity: interpolate(liverEntrance, [0, 0.4], [0, 1]),
								}}
							>
								{/* Rank Number - Larger */}
								<div style={{ fontSize: 90, fontWeight: 900, width: 110, color: "#FFD700", textAlign: 'center' }}>
									{liver.rank}
								</div>
								
								{/* Avatar - Larger */}
								<div
									style={{
										width: 160, // Increased from 100
										height: 160, // Increased from 100
										borderRadius: "50%",
										overflow: "hidden",
										border: "5px solid white",
									}}
								>
									<Img
										src={liver.image_url}
										style={{ width: "100%", height: "100%", objectFit: "cover" }}
									/>
								</div>

								{/* Name - Larger */}
								<div style={{ fontSize: 75, color: "white", fontWeight: "bold", flex: 1, marginLeft: 20 }}>
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
