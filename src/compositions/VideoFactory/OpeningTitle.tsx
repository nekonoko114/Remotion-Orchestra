import {
	AbsoluteFill,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Video,
	staticFile,
} from "remotion";
import { ImpactEffect } from "./ImpactEffect";
import { NeonGlowText } from "../../components/effects/NeonGlowText";
import { LightningBolt } from "../../components/effects/LightningBolt";

// HIGH-GLOW Metallic Text Component
const ShinyText: React.FC<{
	text: string;
	fontSize: number;
	className: string;
	delay: number;
	glowColor?: string;
}> = ({
	text,
	fontSize,
	className,
	delay,
	glowColor = "rgba(255,255,255,0.4)",
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const spr = spring({
		frame: frame - delay,
		fps,
		config: { damping: 12, stiffness: 100, mass: 0.8 },
	});

	const scale = interpolate(spr, [0, 1], [4, 1]);
	const opacity = interpolate(spr, [0, 0.3], [0, 1], {
		extrapolateRight: "clamp",
	});

	// JITTER & Chromatic Aberration for "Radon" energy
	const jitterX = (random(`jitter-x-${frame}`) - 0.5) * 4;
	const jitterY = (random(`jitter-y-${frame}`) - 0.5) * 4;
	
	// Chromatic Aberration offset
	const chromDist = 3 + Math.sin(frame * 0.1) * 2;

	return (
		<div
			style={{
				transform: `scale(${scale}) translate(${jitterX}px, ${jitterY}px)`,
				opacity,
				position: "relative",
			}}
		>
			{/* PHYSICAL GLOW LAYER (Hidden behind text but creates massive bloom) */}
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "120%",
					height: "100%",
					background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
					zIndex: -1,
					opacity: interpolate(spr, [0.5, 1], [0, 1]),
				}}
			/>

			<h1
				className={className}
				style={{
					fontSize,
					fontWeight: 900,
					margin: 0,
					textAlign: "center",
					letterSpacing: "0.1em",
					lineHeight: 1.1,
					fontFamily: "system-ui, -apple-system, sans-serif",
					// Add even more contrast to colors for dark theme
					filter: "brightness(1.5) contrast(1.5)",
					// CHROMATIC ABERRATION TEXT SHADOW - Dark Knight style (Red & Gold)
					textShadow: `
						${chromDist}px 0 rgba(255, 0, 0, 0.6), 
						-${chromDist}px 0 rgba(255, 215, 0, 0.4),
						0 10px 20px rgba(0, 0, 0, 0.8)
					`
				}}
			>
				{text}
			</h1>
		</div>
	);
};

// ... (existing imports)

export const OpeningTitle: React.FC = () => {
	const frame = useCurrentFrame();

	const getShake = (delay: number) => {
		if (frame < delay || frame > delay + 10) return 0;
		const progress = frame - delay;
		return (random(`shake-${delay}-${frame}`) - 0.5) * 40 * (1 - progress / 10);
	};

	const totalShakeX = getShake(10) + getShake(25) + getShake(40) + getShake(55);
	const totalShakeY = getShake(11) + getShake(26) + getShake(41) + getShake(56);

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
			{/* BACKGROUND LAYER - Direct Radon Video */}
			<AbsoluteFill style={{ zIndex: -1 }}>
				<Video
					src={staticFile("assets/backgrounds/radon.mp4")}
					style={{ 
						width: "100%", 
						height: "100%", 
						objectFit: "cover",
						objectPosition: "center",
						transform: "scale(1.3)"
					}}
					loop
					muted
				/>
			</AbsoluteFill>

			{/* Impact Flash (Enhanced Brightness) & Lightning */}
			<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
				{/* 黒い雷を下敷きにして、少しだけ細い赤い雷を重ねることで「赤黒い雷」を表現 */}
				<LightningBolt color="#000000" intensity={3} thickness={20} />
				<LightningBolt color="#FF0000" intensity={3} thickness={10} />
				
				{frame > 5 && frame < 15 && (
					<ImpactEffect color="#FF0000" intensity="high" />
				)}
				{frame > 50 && frame < 65 && (
					<ImpactEffect color="#FFD700" intensity="high" />
				)}
			</AbsoluteFill>

			{/* SUPER BRIGHT TEXTS */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 30,
					alignItems: "center",
				}}
			>
				<NeonGlowText
					text="J.O.L"
					fontSize={230}
					color="#FF0000"
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 0,
						alignItems: "center",
					}}
				>
					<NeonGlowText
						text="2026年1月度"
						fontSize={100}
						color="#FF0000"
					/>
					<NeonGlowText
						text="月間ダイヤモンド"
						fontSize={110}
						color="#FFD700"
					/>
				</div>

				<NeonGlowText
					text="ランキング"
					fontSize={160}
					color="#FF0000"
				/>
				<NeonGlowText
					text="結果発表！"
					fontSize={190}
					color="#FFD700"
				/>
			</div>

			{/* Cinematic Vignette */}
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle, transparent 20%, rgba(0,0,0,0.9) 100%)",
					pointerEvents: "none",
					zIndex: 150,
				}}
			/>
		</AbsoluteFill>
	);
};
