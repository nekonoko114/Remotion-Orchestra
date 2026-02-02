
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

const BPM = 128;

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankRevealTime: React.FC<Props> = ({ rank, liver, title }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: { damping: 25, stiffness: 60 },
	});

	// Entrance Animations
	const titleScale = interpolate(entrance, [0, 1], [3, 1], { easing: Easing.out(Easing.back(1.5)) });
	const imgEntrance = spring({
		frame: frame - 15, // Increased delay from 5 to 15 frames for a more intentional reveal
		fps,
		config: { damping: 25, stiffness: 60 },
	});
	const imgScale = interpolate(imgEntrance, [0, 1], [0, 1], { easing: Easing.out(Easing.exp) });
	const imgRotate = interpolate(imgEntrance, [0, 1], [-15, 0]);
	const imgY = interpolate(imgEntrance, [0, 1], [100, 0]);
	
	const opacity = interpolate(entrance, [0, 0.5], [0, 1]);
	
	// Entrance Flash
	const flashOpacity = interpolate(frame, [0, 5, 20], [0, 0.8, 0], { extrapolateRight: "clamp" });
	
	const { pulse } = useBeatValue(BPM);
	const pulseScale = 1 + pulse * 0.03;
	
	// Add beat-synced shake for orchestration feel
	const shakeX = pulse > 0.5 ? (Math.random() - 0.5) * pulse * 20 : 0;
	const shakeY = pulse > 0.5 ? (Math.random() - 0.5) * pulse * 20 : 0;

	const getRankColors = (r: number) => {
		if (r === 1) return { primary: "#00f0ff", glow: "rgba(0, 240, 255, 0.8)" };
		if (r === 2) return { primary: "#ff00ff", glow: "rgba(255, 0, 255, 0.8)" };
		if (r === 3) return { primary: "#7000ff", glow: "rgba(112, 0, 255, 0.8)" };
		return { primary: "#fff", glow: "transparent" };
	};

	const { primary, glow } = getRankColors(rank);

	if (!liver) return null;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			<TimeBackground overlayColor={primary + "33"} />
			<AdjustmentLayer rank={rank} beatPulse={pulse} />
			
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					fontFamily: '"Impact", sans-serif',
					color: "white",
				}}
			>
				<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
					<ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
				</AbsoluteFill>

				<div style={{ 
					transform: `translate(${shakeX}px, ${shakeY}px)`, 
					opacity, 
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
						fontStyle: "italic", 
						lineHeight: 0.8,
						transform: `scale(${titleScale * pulseScale})`,
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
						transform: `scale(${imgScale}) rotate(${imgRotate}deg) translateY(${imgY}px) rotateX(20deg)`,
					}}>
						<Img
							src={
								liver.saved_to 
									? staticFile(`video-factory/images/icons/${liver.saved_to.split("/").pop()}`)
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
						opacity: imgEntrance,
						transform: `translateY(${interpolate(imgEntrance, [0, 1], [20, 0])}px)`,
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
