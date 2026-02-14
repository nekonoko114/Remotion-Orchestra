import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { LensFlare } from "../../components/effects/LensFlare";
import { ImpactEffect } from "./ImpactEffect";
import { TextShine } from "./TextShine";

// HIGH-GLOW Metallic Text Component (Cyan/Blue Theme)
const ShinyText: React.FC<{
	text: string;
	fontSize: number;
	className: string; // Kept for interface compatibility but mostly overridden
	delay: number;
	glowColor?: string;
}> = ({
	text,
	fontSize,
	className,
	delay,
	glowColor = "rgba(0, 240, 255, 0.4)", // Default to Cyan/Blue glow
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

            {/* RICH TEXT UPGRADE: TextShine + Solid White + Strong Shadow */}
            <TextShine delay={delay + 5} duration={45} color="white">
                <h1
                    style={{
                        fontSize,
                        fontWeight: 900,
                        margin: 0,
                        textAlign: "center",
                        letterSpacing: "0.1em",
                        lineHeight: 1.1,
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        color: "#FFFFFF",
                        textShadow: `0 0 20px ${glowColor}, 0 0 50px ${glowColor}`, 
                        filter: "drop-shadow(0px 5px 10px rgba(0,0,0,0.8))", // Add depth
                    }}
                >
                    {text}
                </h1>
            </TextShine>
		</div>
	);
};

export const OpeningTitleTime: React.FC = () => {
    // ... existing hook calls ...
	const frame = useCurrentFrame();
	const { width } = useVideoConfig();

	const getShake = (delay: number) => {
		if (frame < delay || frame > delay + 10) return 0;
		const progress = frame - delay;
		return (random(`shake-${delay}-${frame}`) - 0.5) * 40 * (1 - progress / 10);
	};

	const totalShakeX = getShake(10) + getShake(25) + getShake(40) + getShake(55);
	const totalShakeY = getShake(11) + getShake(26) + getShake(41) + getShake(56);

	// Rotation for God Rays
	const rayRotate = frame * 0.2;

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				background: "transparent", // Changed from #000 to transparent to let root TimeBackground show
				transform: `translate(${totalShakeX}px, ${totalShakeY}px)`,
			}}
		>
			{/* 1. BACKGROUND LAYER: Time Theme - Handled by Root TimeBackground now */
			/* Video removed to prevent double rendering */
			}
			<AbsoluteFill style={{ zIndex: 0 }}>
				{/* Global Cyan Tint Overlay */}
				<AbsoluteFill 
					style={{
						background: "radial-gradient(circle at center, rgba(0, 240, 255, 0.15) 0%, transparent 80%)",
						mixBlendMode: "screen",
					}}
				/>
			</AbsoluteFill>

			{/* 2. GOD RAYS (Cyan/Blue - "Time" Energy) */}
			<div
				style={{
					position: "absolute",
					width: width * 2,
					height: width * 2,
					background:
						`conic-gradient(from ${rayRotate}deg, 
                            transparent 0deg, 
                            rgba(0, 240, 255, 0.3) 20deg, 
                            transparent 40deg, 
                            rgba(0, 100, 255, 0.3) 60deg, 
                            transparent 80deg, 
                            rgba(0, 240, 255, 0.3) 100deg, 
                            transparent 120deg, 
                            rgba(0, 100, 255, 0.3) 140deg, 
                            transparent 160deg
                        )`,
					zIndex: 1,
					top: "50%",
					left: "50%",
					transform: `translate(-50%, -50%)`,
					filter: "blur(80px)",
					mixBlendMode: "screen",
					opacity: 0.8,
				}}
			/>

			{/* Impact Flash (Cyan/White) */}
			<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
				{frame > 5 && frame < 15 && (
					<ImpactEffect color="#00f0ff" intensity="high" />
				)}
				{frame > 50 && frame < 65 && (
					<ImpactEffect color="#ffffff" intensity="high" />
				)}
			</AbsoluteFill>

			{/* SUPER BRIGHT TEXTS (Metallic Silver/Blue) */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 15,
					alignItems: "center",
					zIndex: 10,
					marginTop: -50, // Slight offset to center the larger stack
				}}
			>
				<ShinyText
					text="J.O.L"
					fontSize={260}
					className="metallic-diamond"
					delay={10}
					glowColor="rgba(0, 220, 255, 0.7)"
				/>
				
				<ShinyText
					text="2026年1月度"
					fontSize={140}
					className="metallic-silver"
					delay={25}
					glowColor="rgba(220, 220, 255, 0.5)"
				/>

				<ShinyText
					text="月間配信時間"
					fontSize={140}
					className="metallic-silver"
					delay={35}
					glowColor="rgba(220, 220, 255, 0.5)"
				/>

				<ShinyText
					text="ランキング"
					fontSize={160}
					className="metallic-diamond"
					delay={45}
					glowColor="rgba(0, 240, 255, 0.6)"
				/>

				<ShinyText
					text="結果発表!"
					fontSize={160}
					className="metallic-diamond"
					delay={55}
					glowColor="rgba(0, 255, 255, 0.9)"
				/>
			</div>

			{/* LENS FLARE */}
			<AbsoluteFill style={{ zIndex: 20, pointerEvents: "none" }}>
				<LensFlare
					opacity={0.7}
					scale={1.5}
					color="#00f0ff"
					intensity={1.2}
				/>
			</AbsoluteFill>

			{/* Final Cinematic Bloom */}
			<AbsoluteFill
				style={{
					background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 90%)",
					zIndex: 99,
					pointerEvents: "none",
					mixBlendMode: "overlay",
				}}
			/>
		</AbsoluteFill>
	);
};
