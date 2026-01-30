import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	random,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { HeatDistortion } from "../../components/effects/HeatDistortion";
import { FireBackground } from "./FireBackground";
import { ImpactEffect } from "./ImpactEffect";

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

	return (
		<div
			style={{
				transform: `scale(${scale})`,
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
					filter: "blur(40px)",
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
					// Add even more contrast to colors
					filter: "brightness(1.5) contrast(1.2)",
				}}
			>
				{text}
			</h1>
		</div>
	);
};

import { OpeningBackground } from "./OpeningBackground";

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
			{/* BACKGROUND LAYER - Replaced with Shared Component */}
			<OpeningBackground />

			{/* Impact Flash (Enhanced Brightness) */}
			<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>

				{frame > 5 && frame < 15 && (
					<ImpactEffect color="#fff" intensity="high" />
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
				<ShinyText
					text="J.O.L"
					fontSize={230}
					className="metallic-white"
					delay={5}
					glowColor="rgba(200,220,255,0.6)"
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 0,
						alignItems: "center",
					}}
				>
					<ShinyText
						text="2026年1月度"
						fontSize={100}
						className="metallic-diamond"
						delay={15}
						glowColor="rgba(0,255,255,0.3)"
					/>
					<ShinyText
						text="月間ダイヤモンド"
						fontSize={110}
						className="metallic-diamond"
						delay={25}
						glowColor="rgba(0,255,255,0.3)"
					/>
				</div>

				<ShinyText
					text="ランキング"
					fontSize={160}
					className="metallic-white"
					delay={35}
					glowColor="rgba(255,255,255,0.4)"
				/>
				<ShinyText
					text="結果発表！"
					fontSize={190}
					className="metallic-white"
					delay={50}
					glowColor="rgba(255,215,0,0.5)"
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
