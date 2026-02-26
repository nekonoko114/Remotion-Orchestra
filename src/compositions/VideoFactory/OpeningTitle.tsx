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
					playbackRate={2.7}
					muted
				/>
				{/* OVERLAY VIGNETTE */}
				<AbsoluteFill 
					style={{
						background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 100%)",
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
						gap: "10px",
					}}
				>
					<ImpactEffect delay={0}>
						<NeonGlowText 
							text="J.O.L" 
							fontSize={230} 
							color="#FF0000"
							glowColor="#CC0000"
							delay={5}
						/>
					</ImpactEffect>

					<ImpactEffect delay={15}>
						<NeonGlowText 
							text="ダイヤモンド" 
							fontSize={120} 
							color="#00f2ff"
							glowColor="#0088ff"
							delay={20}
						/>
					</ImpactEffect>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "40px",
						}}
					>
						<ImpactEffect delay={30}>
							<NeonGlowText 
								text="RANKING" 
								fontSize={160} 
								color="#FFD700"
								glowColor="#FF8C00"
								delay={35}
							/>
						</ImpactEffect>
					</div>

					<div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
						<ImpactEffect delay={45}>
							<h2
								style={{
									color: "#FFF",
									fontSize: "100px",
									fontWeight: "900",
									margin: 0,
									letterSpacing: "0.5em",
									textShadow: "0 5px 15px rgba(0,0,0,1)",
									opacity: 0.8,
								}}
							>
								2026年2月
							</h2>
						</ImpactEffect>

						<ImpactEffect delay={60}>
							<NeonGlowText 
								text="結果発表" 
								fontSize={180} 
								color="#FFD700"
								glowColor="#FF8C00"
								delay={65}
							/>
						</ImpactEffect>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
