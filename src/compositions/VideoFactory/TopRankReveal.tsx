import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Confetti } from "../../components/effects/Confetti";
import { ParticleBurst } from "../../components/effects/ParticleBurst";
import { Explosion } from "../../components/effects/Explosion";
import { LightningBolt } from "../../components/effects/LightningBolt";
import { LensFlare as GlobalLensFlare } from "../../components/effects/LensFlare";
import { SmokeEffect } from "../../components/effects/SmokeEffect";
import { ImpactEffect } from "./ImpactEffect";
import { LuxuryGoldBackground } from "./LuxuryGoldBackground";
// Podium3D removed as per user request (wanted space background, not pedestal)
import { CinematicBorder } from "./CinematicBorder";
import { TextShine } from "./TextShine";
import { AdjustmentLayer } from "./AdjustmentLayer";
import type { Liver } from "./types";

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankReveal: React.FC<Props> = ({ rank, liver, title }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 100 },
	});

	// Reveal Animations
	const scale = interpolate(entrance, [0, 1], [2.5, 1]);
	const opacity = interpolate(entrance, [0, 1], [0, 1]);
	
	// Ultra Pulse for Text
	const pulse = 1 + Math.sin(frame / 8) * 0.05;

	// Rank specific styles
	const getRankColors = (r: number) => {
		// Reference Image Match: Primary colors for Glow/Border, but Text is WHITE.
		if (r === 1) return { primary: "#FFD700", secondary: "#DAA520", glow: "rgba(255,215,0,0.8)" };
		if (r === 2) return { primary: "#C0C0C0", secondary: "#708090", glow: "rgba(192,192,192,0.8)" };
		if (r === 3) return { primary: "#CD7F32", secondary: "#8B4513", glow: "rgba(205,127,50,0.8)" };
		return { primary: "#fff", secondary: "#ccc", glow: "transparent" };
	};

	const { primary, secondary, glow } = getRankColors(rank);

	if (!liver) return null;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			<LuxuryGoldBackground color={primary} secondaryColor={secondary} />
			
			{/* Blurred Character Background Overlay */}
			<AbsoluteFill style={{ zIndex: 1, opacity: 0.15, pointerEvents: "none" }}>
				{liver.saved_to ? (
					<Img
						src={staticFile(`video-factory/images/icons/${liver.saved_to.split("/").pop()}`)}
						style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px)" }}
					/>
				) : (
					<Img
						src={liver.image_url}
						style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px)" }}
					/>
				)}
			</AbsoluteFill>
			
			<AbsoluteFill style={{ opacity: 0.4, pointerEvents: "none", zIndex: 110 }}>
				<SmokeEffect color={primary} density={0.015} velocity={0.2} />
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					fontFamily: '"Inter", "Noto Sans JP", sans-serif',
					color: "white",
				}}
			>
				<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
					{frame < 12 && <ImpactEffect color={primary} intensity="high" />}
					<Explosion delay={4} color={primary} secondaryColor={secondary} />
				</AbsoluteFill>

				<div style={{ transform: `scale(${scale})`, opacity, zIndex: 120, display: "flex", flexDirection: "column", alignItems: "center" }}>
					<div style={{ transform: `scale(${pulse})`, marginBottom: 30, position: "relative" }}>
						<div style={{ 
							position: "absolute", 
							top: "50%", 
							left: "50%", 
							transform: "translate(-50%, -50%)", 
							width: 500, 
							height: 500, 
							background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, 
							opacity: 0.8,
							zIndex: -1
						}} />
						
						<TextShine color="rgba(255, 255, 255, 0.9)" delay={15} duration={45}>
							<h1 style={{ 
								fontSize: 300, 
								margin: 0, 
								color: "#FFFFFF", 
								textShadow: `0 0 40px ${primary}, 0 0 80px ${primary}`, 
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
						boxShadow: `0 0 0 8px ${primary}, 0 0 100px ${glow}, 0 50px 100px rgba(0,0,0,0.9)`, 
						position: "relative",
						backgroundColor: "#000",
						zIndex: 5,
						marginTop: 10
					}}>
						{liver.saved_to ? (
							<Img
								src={staticFile(`video-factory/images/icons/${liver.saved_to.split("/").pop()}`)}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						) : (
							<Img
								src={liver.image_url}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						)}
					</div>

					<h2 style={{ 
						fontSize: 100, 
						marginTop: 50, 
						textShadow: `0 0 30px ${glow}, 0 4px 10px black`, 
						fontWeight: 900,
						fontFamily: '"Inter", sans-serif',
						color: "#fff",
						opacity: interpolate(frame, [0, 20], [0, 1])
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
							width: 2000, height: 2000,
							background: "conic-gradient(from 0deg, transparent 0deg, rgba(255, 215, 0, 0.1) 20deg, transparent 40deg)",
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
					background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)",
					pointerEvents: "none",
					zIndex: 200,
				}}
			/>
		</AbsoluteFill>
	);
};
