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

	// 登場時のアニメーション (scale)
	const spr = spring({
		frame: frame - delay,
		fps,
		config: { damping: 12, stiffness: 100 },
	});

	const scale = interpolate(spr, [0, 1], [4, 1]);
	const entranceOpacity = interpolate(spr, [0, 0.3], [0, 1]);

	// ネオンの点滅をシミュレートする不透明度の計算
	const flickerOpacity = flicker
		? interpolate(
				Math.sin(frame * 0.5) * Math.random(),
				[-1, 0.8, 1],
				[0.9, 0.95, 1], 
				{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
			)
		: 1;

	const bigFlicker = flicker && Math.random() > 0.98 ? 0.3 : 1;

	const finalGlowColor = glowColor || color;

	// 重厚なネオン感を出すための多層シャドウ
	const textShadow = `
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px ${finalGlowColor},
        0 0 40px ${finalGlowColor},
        0 0 80px ${finalGlowColor},
        0 0 90px ${finalGlowColor},
        0 0 100px ${finalGlowColor},
        0 0 150px ${finalGlowColor}
    `;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				opacity: entranceOpacity * flickerOpacity * bigFlicker,
				transform: `scale(${scale})`,
				...style,
			}}
		>
			<h1
				style={{
					color: color,
					fontSize,
					fontFamily: "Arial, sans-serif",
					fontWeight: 900,
					textAlign: "center",
					textTransform: "uppercase",
					textShadow,
					margin: 0,
					lineHeight: 1.1,
				}}
			>
				{text}
			</h1>
		</div>
	);
};
