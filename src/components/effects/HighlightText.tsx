import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface HighlightTextProps {
	text: string;
	color?: string;
	height?: string;
	delay?: number;
	style?: React.CSSProperties;
}

/**
 * テキストの背後に動的な蛍光ペンによるハイライトを追加する
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
	text,
	color = "#f1c40f", // 黄色（ハイライトの定番）
	height = "40%", // 文字の高さに対するマーカーの太さ
	delay = 10, // 文字が出てから線を引き始めるまでの遅延
	style,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// マーカーの伸びるアニメーション（springで気持ちよく）
	const progress = spring({
		frame: frame - delay,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	return (
		<span
			style={{
				position: "relative",
				display: "inline-block",
				fontWeight: "bold",
				...style,
			}}
		>
			{/* テキスト本体 */}
			<span style={{ position: "relative", zIndex: 1 }}>{text}</span>

			{/* ハイライトバー */}
			<span
				style={{
					position: "absolute",
					bottom: "10%",
					left: "-2%",
					width: `${progress * 104}%`, // 少し左右に余裕を持たせる
					height,
					backgroundColor: color,
					zIndex: 0,
					opacity: 0.7,
					borderRadius: "5px",
					transformOrigin: "left center",
					// 手書き風に少し傾ける
					transform: `skewX(-5deg) scaleY(${interpolate(progress, [0, 1], [0.8, 1])})`,
				}}
			/>
		</span>
	);
};
