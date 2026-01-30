import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface NeonGlowTextProps {
	text: string;
	color?: string;
	fontSize?: number;
	flicker?: boolean;
	style?: React.CSSProperties;
}

export const NeonGlowText: React.FC<NeonGlowTextProps> = ({
	text,
	color = "#00f2ff", // シアン（ネオンの定番色）
	fontSize = 80,
	flicker = true,
	style,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// ネオンの点滅をシミュレートする不透明度の計算
	// ランダムなノイズを加えて、時々「チカッ」とさせる
	const opacity = flicker
		? interpolate(
				Math.sin(frame * 0.5) * Math.random(),
				[-1, 0.8, 1],
				[0.9, 0.95, 1], // 基本は明るく、たまに少し暗くなる
				{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
			)
		: 1;

	// 稀に起こる大きな瞬き
	const bigFlicker = flicker && Math.random() > 0.98 ? 0.3 : 1;

	const finalColor = color;

	// 重厚なネオン感を出すための多層シャドウ
	const textShadow = `
        0 0 5px #fff,
        0 0 10px #fff,
        0 0 20px ${finalColor},
        0 0 40px ${finalColor},
        0 0 80px ${finalColor},
        0 0 90px ${finalColor},
        0 0 100px ${finalColor},
        0 0 150px ${finalColor}
    `;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				height: "100%",
			}}
		>
			<h1
				style={{
					color: "#fff",
					fontSize,
					fontFamily: "Arial, sans-serif", // 必要に応じてフォントを変更
					fontWeight: 900,
					textAlign: "center",
					textTransform: "uppercase",
					textShadow,
					opacity: opacity * bigFlicker,
					transition: "all 0.1s ease-in-out",
					...style,
				}}
			>
				{text}
			</h1>
		</div>
	);
};
