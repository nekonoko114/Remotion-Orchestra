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
import { Confetti } from "../../components/effects/Confetti";
import { ParticleBurst } from "../../components/effects/ParticleBurst";
import { Explosion } from "../../components/effects/Explosion";
import { LightningBolt } from "../../components/effects/LightningBolt";

import { SmokeEffect } from "../../components/effects/SmokeEffect";
import { ImpactEffect } from "./ImpactEffect";
// Podium3D removed as per user request (wanted space background, not pedestal)
import { CinematicBorder } from "./CinematicBorder";
import { TextShine } from "./TextShine";
import { AdjustmentLayer } from "./AdjustmentLayer";
import { useBeatValue } from "./utils/beat-sync";
import type { Liver } from "./types";

const BPM = 152;

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankReveal: React.FC<Props> = ({ rank, liver, title }) => {
	// Podium3D component removed as it was not needed.
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();

	// Ken Burns Effect for Background
	const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// 1. Sequence Timings (Higher stiffness for more "snap")
	const rankEntrance = spring({
		frame,
		fps,
		config: { damping: 10, stiffness: 160 }, // Increased stiffness
	});

	const imageEntrance = spring({
		frame: frame - Math.floor(fps * 0.9), // 0.9秒後に登場
		fps,
		config: { damping: 12, stiffness: 140 },
	});

	const nameEntrance = spring({
		frame: frame - Math.floor(fps * 1.2), // 1.2秒後に名前が登場
		fps,
		config: { damping: 15, stiffness: 120 },
	});

	// --------------------------------------------------------
	// Reveal Animations (Rank-Specific logic)
	// --------------------------------------------------------
	
	const rankScale = interpolate(rankEntrance, [0, 1], [10, 1], { easing: Easing.out(Easing.back(2)) });
	const rankOpacity = interpolate(rankEntrance, [0, 0.3], [0, 1]);
	
	// ベースの「弾けるような登場」は全順位共通で残す（これが「ドカン！」の正体）
	let imageScale = interpolate(imageEntrance, [0, 1], [2, 1], { easing: Easing.out(Easing.exp) });
	let imageRotate = interpolate(imageEntrance, [0, 1], [-45, 0]);
	let imageOpacity = interpolate(imageEntrance, [0, 1], [0, 1]);
	let imageY = 0; // 追加のY軸移動用

	// 更に順位ごとにトランジションを「上乗せ」する
	if (rank === 3) {
		// 3位: ③ インパクト・グローフラッシュ (シンプルなScale + ガツンとOpacityをより強調)
		imageScale = interpolate(imageEntrance, [0, 1], [0.1, 1], { easing: Easing.out(Easing.back(3)) }); // より小さくから弾ける
		// Rotateはなし（ストレートにドン！）
		imageRotate = 0; 
	} else if (rank === 2) {
		// 2位: ② アッパー・スライド (Translate Y)
		imageY = interpolate(imageEntrance, [0, 1], [800, 0], { easing: Easing.out(Easing.back(1.5)) });
		// 突き上げ感を出すためにScaleは少し抑えめにする
		imageScale = interpolate(imageEntrance, [0, 1], [0.5, 1], { easing: Easing.out(Easing.exp) });
		imageRotate = 0;
	} else if (rank === 1) {
		// 1位: ① スパイラル・ズームイン (Scale + Rotate)
		imageScale = interpolate(imageEntrance, [0, 1], [0, 1], { easing: Easing.out(Easing.back(2)) });
		imageRotate = interpolate(imageEntrance, [0, 1], [-1080, 0], { easing: Easing.out(Easing.exp) }); // 3回転！
	}

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
				<Img
					src={staticFile(
						`assets/backgrounds/rank_${rank}_bg_new.png`
					)}
					style={{ 
						width: "100%", 
						height: "100%", 
						objectFit: "cover",
						objectPosition: "center",
						transform: `scale(${bgScale})`
					}}
				/>
				<AbsoluteFill style={{ backgroundColor: rank === 1 ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.0)" }} /> {/* 2位3位は暗くないように */}
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
								fontSize: rank === 1 ? 380 : 300, 
								margin: 0, 
								color: rank === 1 ? "#FFD700" : "#FFFFFF", 
								textShadow: rank === 1 
									? `0 0 40px ${primary}, 0 0 80px ${primary}, 0 10px 20px rgba(0,0,0,0.8)` 
									: `0 0 20px ${primary}, 0 0 40px ${primary}`,
								fontWeight: 900,
								fontStyle: "italic", 
								lineHeight: 0.8,
								position: "relative",
								zIndex: 2,
							}}>
								{title}
							</h1>
						</TextShine>
						{rank === 1 && (
							<div style={{
								position: "absolute",
								top: -230,
								left: "50%",
								transform: "translateX(-50%) rotate(-5deg)",
								fontSize: 180,
								textShadow: `0 0 30px ${primary}, 0 0 60px ${primary}, 0 10px 20px rgba(0,0,0,0.8)`,
								zIndex: 10,
							}}>
								👑
							</div>
						)}
					</div>

					<div style={{
						width: rank === 1 ? 1000 : 896, // 1位は少し大きく
						height: rank === 1 ? 1000 : 896,
						borderRadius: "50%",
						overflow: "hidden",
						border: rank === 1 ? "15px solid #FFD700" : "10px solid #FFFFFF", // 1位は金枠
						boxShadow: rank === 1 
							? `0 0 0 15px ${primary}, 0 0 80px ${glow}, 0 20px 60px rgba(0,0,0,0.9)`
							: `0 0 0 8px ${primary}, 0 0 40px ${glow}, 0 20px 40px rgba(0,0,0,0.8)`,
						position: "relative",
						backgroundColor: "#000",
						zIndex: 5,
						marginTop: 10,
						transform: `scale(${imageScale}) rotate(${imageRotate}deg) translateY(${imageY}px)`,
						opacity: imageOpacity,
					}}>
						{liver.saved_to ? (
							<Img
								src={staticFile(liver.saved_to)}
								style={{ 
									width: "100%", 
									height: "100%", 
									objectFit: "cover",
									transform: rank === 1 ? "rotate(-90deg)" : "none"
								}}
							/>
						) : (
							<Img
								src={liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url)}
								style={{ 
									width: "100%", 
									height: "100%", 
									objectFit: "cover",
									transform: rank === 1 ? "rotate(-90deg)" : "none"
								}}
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
			

			<AdjustmentLayer rank={rank} />

			{rank === 1 && (
				<>
					<AbsoluteFill style={{ zIndex: 120, pointerEvents: "none" }}>
						<LightningBolt color={primary} thickness={20} />
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
					background: rank === 1 
						? "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.2) 100%)"
						: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.05) 100%)",
					pointerEvents: "none",
					zIndex: 200,
				}}
			/>
		</AbsoluteFill>
	);
};
