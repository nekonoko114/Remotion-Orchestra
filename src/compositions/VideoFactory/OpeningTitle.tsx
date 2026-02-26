import {
	AbsoluteFill,
	interpolate,
	random,
	useCurrentFrame,
	Video,
	staticFile,
} from "remotion";
import { ImpactEffect } from "./ImpactEffect";
import { NeonGlowText } from "../../components/effects/NeonGlowText";
import { LightningBolt } from "../../components/effects/LightningBolt";

// HIGH-GLOW Metallic Text Component
// ... (existing imports)

export const OpeningTitle: React.FC = () => {
	const frame = useCurrentFrame();

	// フレームに応じて強度を動的に計算 (ユーザー指定: 65f:1.8, 150f:3.8, 190f:5.0)
	const intensity = interpolate(
		frame,
		[0, 65, 150, 190, 210],
		[1.0, 1.8, 3.8, 5.0, 5.5],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);

	const totalShakeX = (random(`shake-x-${frame}`) - 0.5) * intensity;
	const totalShakeY = (random(`shake-y-${frame}`) - 0.5) * intensity;

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				backgroundColor: "#000",
				transform: `translate(${totalShakeX}px, ${totalShakeY}px)`,
			}}
		>
			{/* BACKGROUND LAYER - Diamond Month Video */}
			<AbsoluteFill style={{ zIndex: -1 }}>
				<Video
					src={staticFile("assets/backgrounds/daiamond-month.mp4")}
					style={{ 
						width: "100%", 
						height: "100%", 
						objectFit: "cover",
						objectPosition: "center",
						filter: "brightness(0.7) contrast(1.2)",
					}}
					startFrom={0}
					playbackRate={1.8}
					muted
				/>
				{/* OVERLAY VIGNETTE */}
				<AbsoluteFill 
					style={{
						background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)",
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{/* TOP LOGO/TEXT AREA */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "20px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "40px",
						}}
					>
						<ImpactEffect delay={10}>
							<NeonGlowText 
								text="TOP" 
								fontSize={160} 
								color="#FFD700"
								glowColor="#FF8C00"
								delay={15}
							/>
						</ImpactEffect>
						
						<div 
							style={{
								width: "120px",
								height: "120px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								transform: `rotate(${frame * 2}deg)`,
							}}
						>
							<LightningBolt color="#FFD700" size={100} />
						</div>

						<ImpactEffect delay={20}>
							<NeonGlowText 
								text="RANKING" 
								fontSize={140} 
								color="#FFD700"
								glowColor="#FF8C00"
								delay={25}
							/>
						</ImpactEffect>
					</div>

					<div style={{ marginTop: "10px" }}>
						<ImpactEffect delay={40}>
							<h2
								style={{
									color: "#FFF",
									fontSize: "60px",
									fontWeight: "900",
									margin: 0,
									letterSpacing: "0.5em",
									textShadow: "0 5px 15px rgba(0,0,0,1)",
									opacity: 0.8,
								}}
							>
								FEBRUARY 2026
							</h2>
						</ImpactEffect>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
