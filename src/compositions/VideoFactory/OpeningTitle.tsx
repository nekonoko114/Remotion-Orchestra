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
import { Easing } from "remotion";

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

	// 2. Cinematic Focus & Glow Effect (Blur to Sharp)
	const getFocusStyle = (delay: number) => {
		const relativeFrame = frame - delay;
		if (relativeFrame < 0) return { opacity: 0, filter: "blur(20px)", transform: "scale(1.1)" };
		
		const blur = interpolate(relativeFrame, [0, 15], [20, 0], {
			easing: Easing.out(Easing.quad),
			extrapolateRight: "clamp",
		});
		const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
			extrapolateRight: "clamp",
		});
		const scale = interpolate(relativeFrame, [0, 15], [1.1, 1], {
			easing: Easing.out(Easing.back(1)),
			extrapolateRight: "clamp",
		});

		return {
			opacity,
			filter: `blur(${blur}px)`,
			transform: `scale(${scale})`,
		};
	};

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
					<ImpactEffect delay={0} intensity="soft">
						<div style={getFocusStyle(5)}>
							<NeonGlowText 
								text="J.O.L" 
								fontSize={230} 
								color="#FF0000"
								glowColor="#CC0000"
								delay={5}
							/>
						</div>
					</ImpactEffect>

					<ImpactEffect delay={15} intensity="soft">
						<div style={getFocusStyle(20)}>
							<NeonGlowText 
								text="ダイヤモンド" 
								fontSize={120} 
								color="#00f2ff"
								glowColor="#0088ff"
								delay={20}
							/>
						</div>
					</ImpactEffect>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "40px",
						}}
					>
						<ImpactEffect delay={30} intensity="soft">
							<div style={getFocusStyle(35)}>
								<NeonGlowText 
									text="RANKING" 
									fontSize={160} 
									color="#FFD700"
									glowColor="#FF8C00"
									delay={35}
								/>
							</div>
						</ImpactEffect>
					</div>

					<div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
						<ImpactEffect delay={45} intensity="soft">
							<div style={getFocusStyle(50)}>
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
							</div>
						</ImpactEffect>

						<ImpactEffect delay={60} intensity="soft">
							<div style={getFocusStyle(65)}>
								<NeonGlowText 
									text="結果発表" 
									fontSize={180} 
									color="#FFD700"
									glowColor="#FF8C00"
									delay={65}
								/>
							</div>
						</ImpactEffect>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
