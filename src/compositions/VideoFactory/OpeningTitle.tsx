import {
	AbsoluteFill,
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

	const getShake = (delay: number) => {
		// 常時揺れるように、持続時間を長く設定
		const shakeDuration = 60; // 約2秒
		if (frame < delay || frame > delay + shakeDuration) return 0;
		const progress = (frame - delay) / shakeDuration;
		// 強度を大幅にアップ (40 -> 80)
		return (random(`shake-${delay}-${frame}`) - 0.5) * 80 * (1 - progress);
	};

	// 7秒の尺に合わせてさらにポイントを追加
	const totalShakeX = getShake(0) + getShake(15) + getShake(30) + getShake(45) + getShake(60) + getShake(80) + getShake(100) + getShake(120) + getShake(140) + getShake(160);
	const totalShakeY = getShake(1) + getShake(16) + getShake(31) + getShake(46) + getShake(61) + getShake(81) + getShake(101) + getShake(121) + getShake(141) + getShake(161);

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
					playbackRate={1.5}
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
								text="MONTHLY" 
								fontSize={140} 
								color="#FFD700"
								glowColor="#FF8C00"
								delay={15}
							/>
						</ImpactEffect>
						
						<div 
							style={{
								width: "120px",
								height: "120px",
								backgroundColor: "#FFD700",
								borderRadius: "50%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								boxShadow: "0 0 40px rgba(255, 215, 0, 0.6)",
								transform: `rotate(${frame * 2}deg)`,
							}}
						>
							<LightningBolt color="#000" size={80} />
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
