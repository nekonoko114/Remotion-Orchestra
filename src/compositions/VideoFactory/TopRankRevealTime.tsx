
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from "remotion";
import { ParticleBurst } from "../../components/effects/ParticleBurst";
import { ImpactEffectTime as ImpactEffect } from "./ImpactEffectTime";
import { TimeBackground } from "./TimeBackground";
import { CinematicBorder } from "./CinematicBorder";
import { AdjustmentLayerTime as AdjustmentLayer } from "./AdjustmentLayerTime";
import { useBeatValue } from "./utils/beat-sync";
import type { Liver } from "./types";

// Verified build status

const BPM = 180;

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankRevealTime: React.FC<Props> = ({ rank, liver, title }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const { pulse } = useBeatValue(BPM);
	
	// 4. Time Snap Effect
	const snapReduction = pulse * 0.4;
	const localFrame = frame - snapReduction;
	
	// 1. Staggered Entrance Timings (Sequential Reveal with higher "snap")
	const rankEntrance = spring({
		frame: localFrame,
		fps,
		config: { damping: 10, stiffness: 180 }, // Much faster snap for sequence start
	});

	const imageEntrance = spring({
		frame: localFrame - 10, // Faster interval
		fps,
		config: { damping: 12, stiffness: 150 },
	});

	const nameEntrance = spring({
		frame: localFrame - 22,
		fps,
		config: { damping: 14, stiffness: 120 },
	});

	// Reveal Animations Logic (Larger ranges for more velocity)
	const rankScale = interpolate(rankEntrance, [0, 1], [8, 1], { easing: Easing.out(Easing.back(2)) });
	const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);
	
	const imageScale = interpolate(imageEntrance, [0, 1], [3, 1], { easing: Easing.out(Easing.exp) });
	const imageRotate = interpolate(imageEntrance, [0, 1], [-60, 0]);
	const imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);
	
	const nameY = interpolate(nameEntrance, [0, 1], [150, 0]);
	const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);
	
	// Entrance Flash (Neon Leak style)
	const flashOpacity = interpolate(frame, [0, 5, 20], [0, 0.8, 0], { extrapolateRight: "clamp" });
	
	const pulseScale = 1 + pulse * 0.04; 
	
	// Rhythmic Drift
	const driftX = Math.sin(frame / 10) * pulse * 15;
	const driftY = Math.cos(frame / 12) * pulse * 10;

	const getRankColors = (r: number) => {
		if (r === 1) return { primary: "#ff0000", glow: "rgba(255, 0, 0, 0.8)" };
		if (r === 2) return { primary: "#ff4400", glow: "rgba(255, 68, 0, 0.8)" };
		if (r === 3) return { primary: "#cc0000", glow: "rgba(204, 0, 0, 0.8)" };
		return { primary: "#fff", glow: "transparent" };
	};

	const { primary, glow } = getRankColors(rank);

	if (!liver) return null;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			<AbsoluteFill>
				<AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />
			</AbsoluteFill>

			<TimeBackground overlayColor={primary + "33"} hideBackground hideBaseVideo />
			<AdjustmentLayer rank={rank} beatPulse={pulse} />
			
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					fontFamily: '"Mochiy Pop One", sans-serif',
					color: "white",
				}}
			>
				<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
					<ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
				</AbsoluteFill>

				<div style={{ 
					transform: `translate(${driftX}px, ${driftY}px)`, 
					zIndex: 120, 
					display: "flex", 
					flexDirection: "column", 
					alignItems: "center" 
				}}>
					{/* Rank Title Animation */}
					<h1 style={{ 
						fontSize: 250, 
						margin: 0, 
						color: "#FFFFFF", 
						textShadow: `0 0 30px ${primary}, 0 0 60px ${primary}`, 
						fontWeight: 900,
						fontStyle: "normal", 
						lineHeight: 1,
						transform: `scale(${rankScale * pulseScale})`,
						opacity: rankOpacity,
						fontFamily: '"Mochiy Pop One", sans-serif',
					}}>
						{title}
					</h1>

					{/* Liver Image Animation */}
					<div style={{
						width: 700,
						height: 700,
						borderRadius: "50%",
						overflow: "hidden",
						border: `5px solid ${primary}`, 
						boxShadow: `0 0 80px ${glow}`, 
						position: "relative",
						backgroundColor: "#000",
						marginTop: 40,
						transform: `scale(${imageScale}) rotate(${imageRotate}deg) rotateX(20deg)`,
						opacity: imageOpacity
					}}>
						<Img
							src={
								liver.saved_to 
									? staticFile(liver.saved_to)
									: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
							}
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
						
						{/* Subtle Inner Glow Overlay */}
						<AbsoluteFill style={{ 
							background: `radial-gradient(circle, transparent 40%, ${primary}44 100%)`,
							mixBlendMode: "screen"
						}} />
					</div>

					{/* Nickname Entrance */}
					<h2 style={{ 
						fontSize: 80, 
						marginTop: 20, 
						textShadow: `0 0 20px ${glow}`, 
						fontWeight: 900,
						color: "#fff",
						opacity: nameOpacity,
						transform: `translateY(${nameY}px)`,
					}}>
						{liver.nickname}
					</h2>
				</div>

				{/* Global Flash Effect on Entrance */}
				<AbsoluteFill style={{ 
					backgroundColor: "white", 
					opacity: flashOpacity, 
					pointerEvents: "none",
					zIndex: 1000,
					mixBlendMode: "overlay"
				}} />
			</AbsoluteFill>

			<CinematicBorder color={primary} glowColor={glow} />

			<AbsoluteFill style={{ zIndex: 110, pointerEvents: "none" }}>
				<ParticleBurst 
					count={30} 
					colors={[primary, "#fff"]} 
					x={540} 
					y={960}
					speed={5}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
