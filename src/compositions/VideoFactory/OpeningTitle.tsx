import {
	AbsoluteFill,
	interpolate,
	random,
	useCurrentFrame,
	OffthreadVideo,
	staticFile,
} from "remotion";
import { NeonGlowText } from "../../components/effects/NeonGlowText";


export const OpeningTitle: React.FC = () => {
	const frame = useCurrentFrame();

	// 1. Softer Shake Intensity (Glitch-like)
	const intensity = interpolate(
		frame,
		[0, 50, 110, 145, 165], // Adjusted to fit 165f (5.5s @ 30fps)
		[0.5, 0.8, 1.2, 1.8, 2.0],
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
				<OffthreadVideo
					src={staticFile("assets/backgrounds/fire-ulf.mp4")}
					style={{ 
						width: "100%", 
						height: "100%", 
						objectFit: "cover",
						objectPosition: "center",
						filter: "brightness(0.7) contrast(1.2)",
						transform: "scale(1.15)", // VEOのウォーターマークを枠外に隠すため拡大
					}}
					startFrom={0}
					playbackRate={1}
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
						<NeonGlowText 
							text="J.O.L" 
							fontSize={230} 
							color="#FF0000"
							glowColor="#CC0000"
							delay={5}
						/>

					<NeonGlowText 
						text="ダイヤモンド" 
						fontSize={120} 
						color="#00f2ff"
						glowColor="#0088ff"
						delay={20}
					/>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "40px",
						}}
					>
						<NeonGlowText 
							text="RANKING" 
							fontSize={160} 
							color="#FFD700"
							glowColor="#FF8C00"
							delay={35}
						/>
					</div>

					<div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
						<div style={{ transform: "scale(0.8)" }}>
							<NeonGlowText 
								text="2026年2月" 
								fontSize={120} 
								color="#FFFFFF"
								glowColor="rgba(255,255,255,0.5)"
								delay={50}
							/>
						</div>

						<NeonGlowText 
							text="結果発表" 
							fontSize={180} 
							color="#FFD700"
							glowColor="#FF8C00"
							delay={65}
						/>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
