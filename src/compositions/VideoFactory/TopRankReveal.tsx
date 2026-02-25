import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Video,
	Easing,
} from "remotion";
import { Confetti } from "../../components/effects/Confetti";
import { ParticleBurst } from "../../components/effects/ParticleBurst";
import { Explosion } from "../../components/effects/Explosion";
import { LightningBolt } from "../../components/effects/LightningBolt";
import { LensFlare as GlobalLensFlare } from "../../components/effects/LensFlare";
import { SmokeEffect } from "../../components/effects/SmokeEffect";
import { ImpactEffect } from "./ImpactEffect";
// Podium3D removed as per user request (wanted space background, not pedestal)
import { CinematicBorder } from "./CinematicBorder";
import { TextShine } from "./TextShine";
import { AdjustmentLayer } from "./AdjustmentLayer";
import { useBeatValue } from "./utils/beat-sync";
import type { Liver } from "./types";

const BPM = 160;

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankReveal: React.FC<Props> = ({ rank, liver, title }) => {
	// Podium3D component removed as it was not needed.
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// 1. Sequence Timings (Higher stiffness for more "snap")
	const rankEntrance = spring({
		frame,
		fps,
		config: { damping: 10, stiffness: 160 }, // Increased stiffness
	});

	const imageEntrance = spring({
		frame: frame - 12, // Slightly tighter timing
		fps,
		config: { damping: 12, stiffness: 140 },
	});

	const nameEntrance = spring({
		frame: frame - 25,
		fps,
		config: { damping: 15, stiffness: 120 },
	});

	// Reveal Animations (Larger initial values for "impact")
	const rankScale = interpolate(rankEntrance, [0, 1], [10, 1], { easing: Easing.out(Easing.back(2)) });
	const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);
	
	const imageScale = interpolate(imageEntrance, [0, 1], [2, 1], { easing: Easing.out(Easing.exp) });
	const imageRotate = interpolate(imageEntrance, [0, 1], [-45, 0]);
	const imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);
	
	const nameY = interpolate(nameEntrance, [0, 1], [100, 0]);
	const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);

	const { pulse } = useBeatValue(BPM);
	
	// Ultra Pulse for Text
	const pulseScale = (1 + Math.sin(frame / 8) * 0.05) * (1 + pulse * 0.05);

	// Rank specific styles
	const getRankColors = (r: number) => {
		// Dark Knight Theme: Primary Red, Secondary Gold, Glow Deep Red/Gold
		if (r === 1) return { primary: "#FF0000", secondary: "#FFD700", glow: "rgba(255,0,0,0.8)" }; // 1位: 真紅×黄金
		if (r === 2) return { primary: "#8B0000", secondary: "#C0C0C0", glow: "rgba(139,0,0,0.8)" }; // 2位: 暗赤×銀
		if (r === 3) return { primary: "#A52A2A", secondary: "#CD7F32", glow: "rgba(165,42,42,0.8)" }; // 3位: 鈍い赤×銅
		return { primary: "#8B0000", secondary: "#ccc", glow: "transparent" };
	};

	const { primary, secondary, glow } = getRankColors(rank);

	if (!liver) return null;

	return (
		<AbsoluteFill>
			{/* <LuxuryGoldBackground color={primary} secondaryColor={secondary} /> */}
			{/* Rank-specific Generated Video Background */}
			<AbsoluteFill>
				<Video
					src={staticFile(
						`assets/backgrounds/rank_${rank}_bg.mp4`
					)}
					style={{ 
						width: "100%", 
						height: "100%", 
						objectFit: "cover",
						objectPosition: "center",
						transform: "none"
					}}
					muted
					loop
				/>
				<AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.6)" }} /> {/* 背景をより暗く（暗黒ベース） */}
			</AbsoluteFill>

			<AdjustmentLayer rank={rank} beatPulse={pulse} />
			
			<AbsoluteFill style={{ opacity: 0.4, pointerEvents: "none", zIndex: 110 }}>
				<SmokeEffect color={primary} density={0.015} velocity={0.2} />
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
					color: "white",
				}}
			>
				<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
					{frame < 12 && <ImpactEffect color={primary} intensity="high" />}
					<Explosion delay={4} color={primary} secondaryColor={secondary} />
					{/* Recurring Beat Impact */}
					<ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
				</AbsoluteFill>

				<div style={{ zIndex: 120, display: "flex", flexDirection: "column", alignItems: "center" }}>
					<div style={{ 
						transform: `scale(${rankScale * pulseScale})`, 
						opacity: rankOpacity,
						marginBottom: 30, 
						position: "relative" 
					}}>
						<div style={{ 
							position: "absolute", 
							top: "50%", 
							left: "50%", 
							transform: "translate(-50%, -50%)", 
							width: 500, 
							height: 500, 
							background: `radial-gradient(circle, ${glow} 0%, transparent 60%)`, 
							opacity: 0.8,
							zIndex: -1
						}} />
						
						<TextShine color="rgba(255, 255, 255, 0.9)" delay={15} duration={45}>
							<h1 style={{ 
								fontSize: 300, 
								margin: 0, 
								color: "#FFFFFF", 
								textShadow: `0 0 20px ${primary}, 0 0 40px ${primary}`,
								fontWeight: 900,
								fontStyle: "italic", 
								lineHeight: 0.8,
								position: "relative",
								zIndex: 2,
							}}>
								{title}
							</h1>
						</TextShine>
					</div>

					<div style={{
						width: 640,
						height: 640,
						borderRadius: "50%",
						overflow: "hidden",
						border: "10px solid #FFFFFF", 
						boxShadow: `0 0 0 8px ${primary}, 0 0 40px ${glow}, 0 20px 40px rgba(0,0,0,0.8)`,
						position: "relative",
						backgroundColor: "#000",
						zIndex: 5,
						marginTop: 10,
						transform: `scale(${imageScale}) rotate(${imageRotate}deg)`,
						opacity: imageOpacity
					}}>
						{liver.saved_to ? (
							<Img
								src={staticFile(liver.saved_to)}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						) : (
							<Img
								src={liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url)}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						)}
					</div>

					<h2 style={{ 
						fontSize: 100, 
						marginTop: 50, 
						textShadow: `0 0 20px ${glow}, 0 4px 10px black`,
						fontWeight: 900,
						fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
						color: "#fff",
						transform: `translateY(${nameY}px)`,
						opacity: nameOpacity
					}}>
						{liver.nickname}
					</h2>
				</div>
			</AbsoluteFill>

			<CinematicBorder color={primary} glowColor={glow} />
			
			<AbsoluteFill style={{ pointerEvents: "none", zIndex: 200, mixBlendMode: "screen" }}>
				<GlobalLensFlare 
					color={primary} 
					intensity={1.5}
					scale={1.5}
					opacity={1}
				/>
			</AbsoluteFill>

			<AdjustmentLayer rank={rank} />

			{rank === 1 && (
				<>
					<AbsoluteFill style={{ zIndex: 120, pointerEvents: "none" }}>
						<LightningBolt color={primary} thickness={6} />
					</AbsoluteFill>
					<AbsoluteFill style={{ zIndex: 8, pointerEvents: "none", mixBlendMode: "screen" }}>
						<div style={{
							position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) rotate(${frame}deg)`,
							width: 1500, height: 1500,
							// Optimized: Use radial gradient strip or simple border instead of heavy conic gradient
							background: "radial-gradient(circle, rgba(255,215,0,0) 40%, rgba(255,215,0,0.1) 50%, rgba(255,215,0,0) 60%)",
							border: "2px dashed rgba(255,215,0,0.3)",
							borderRadius: "50%",
						}} />
						{/* Add another light ring for effect */}
						<div style={{
							position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) rotate(-${frame * 0.5}deg)`,
							width: 1200, height: 1200,
							border: "1px solid rgba(255,215,0,0.1)",
							borderRadius: "50%",
						}} />
					</AbsoluteFill>
				</>
			)}

			<AbsoluteFill style={{ zIndex: 110, pointerEvents: "none" }}>
				<Confetti count={rank === 1 ? 200 : 100} colors={[primary, "#fff", secondary]} />
				<ParticleBurst 
					count={50} 
					colors={[primary, "#fff", secondary]} 
					x={540} 
					y={960}
					speed={3}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.5) 100%)",
					pointerEvents: "none",
					zIndex: 200,
				}}
			/>
		</AbsoluteFill>
	);
};
