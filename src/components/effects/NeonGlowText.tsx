import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

interface NeonGlowTextProps {
	text: string;
	color?: string;
	fontSize?: number;
	flicker?: boolean;
	style?: React.CSSProperties;
	glowColor?: string;
	delay?: number;
}

export const NeonGlowText: React.FC<NeonGlowTextProps> = ({
	text,
	color = "#00f2ff", // シアン（ネオンの定番色）
	fontSize = 80,
	flicker = true,
	style,
	glowColor,
	delay = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const characters = text.split("");
	const finalGlowColor = glowColor || color;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexWrap: "nowrap",
				...style,
			}}
		>
			{characters.map((char, i) => {
				const charDelay = delay + i * 2; // 2 frames stagger
				const relativeFrame = frame - charDelay;

				// 登場時のアニメーション (spring)
				const spr = spring({
					frame: relativeFrame,
					fps,
					config: { damping: 12, stiffness: 100 },
				});

				const scale = interpolate(spr, [0, 1], [3, 1]);
				const entranceOpacity = interpolate(spr, [0, 0.4], [0, 1]);

				// RGB Split / Chromatic Aberration Effect (Entrance Glitch)
				const glitchOffset = interpolate(relativeFrame, [0, 10], [10, 0], {
					extrapolateRight: "clamp",
				});
				const glitchOpacity = interpolate(relativeFrame, [0, 5, 10], [0.8, 1, 0], {
					extrapolateRight: "clamp",
				});

				// ネオンの点滅
				const flickerOpacity = flicker
					? interpolate(
							Math.sin(frame * 0.5 + i) * Math.random(),
							[-1, 0.8, 1],
							[0.9, 0.95, 1], 
							{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
						)
					: 1;

				const bigFlicker = flicker && Math.random() > 0.98 ? 0.3 : 1;

				// 重厚なネオン感を出すための多層シャドウ
				const baseShadow = `
					0 0 5px #fff,
					0 0 10px #fff,
					0 0 20px ${finalGlowColor},
					0 0 40px ${finalGlowColor},
					0 0 80px ${finalGlowColor}
				`;

				return (
					<div
						key={i}
						style={{
							position: "relative",
							display: "inline-block",
							opacity: entranceOpacity * flickerOpacity * bigFlicker,
							transform: `scale(${scale})`,
							margin: i === 0 ? 0 : "0 2px",
						}}
					>
						{/* RGB Split Layers (Experimental Glitch) */}
						{relativeFrame >= 0 && relativeFrame < 10 && (
							<>
								<div style={{
									position: "absolute",
									top: 0,
									left: -glitchOffset,
									color: "#ff0000",
									opacity: glitchOpacity * 0.5,
									zIndex: -1,
									fontSize,
									fontWeight: 900,
									fontFamily: "Arial, sans-serif",
								}}>{char}</div>
								<div style={{
									position: "absolute",
									top: 0,
									left: glitchOffset,
									color: "#0000ff",
									opacity: glitchOpacity * 0.5,
									zIndex: -1,
									fontSize,
									fontWeight: 900,
									fontFamily: "Arial, sans-serif",
								}}>{char}</div>
							</>
						)}

						<h1
							style={{
								color: color,
								fontSize,
								fontFamily: "Arial, sans-serif",
								fontWeight: 900,
								textAlign: "center",
								textTransform: "uppercase",
								textShadow: baseShadow,
								margin: 0,
								lineHeight: 1.1,
								whiteSpace: "pre",
							}}
						>
							{char === " " ? "\u00A0" : char}
						</h1>
					</div>
				);
			})}
		</div>
	);
};
