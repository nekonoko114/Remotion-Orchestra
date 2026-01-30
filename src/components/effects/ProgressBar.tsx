import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface ProgressBarProps {
	color?: string;
	height?: number;
	showPercentage?: boolean;
	style?: React.CSSProperties;
}

/**
 * 動画の進行状況を視覚化するプログレスバー
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
	color = "linear-gradient(90deg, #ff00cc, #3333ff)", // グラデーション
	height = 10,
	showPercentage = false,
	style,
}) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// 進行状況の計算 (0 to 1)
	const progress = frame / durationInFrames;

	return (
		<div
			style={{
				position: "absolute",
				bottom: 40,
				left: "5%",
				width: "90%",
				height,
				backgroundColor: "rgba(255, 255, 255, 0.1)",
				borderRadius: height / 2,
				overflow: "visible",
				...style,
			}}
		>
			{/* 進捗バー本体 */}
			<div
				style={{
					width: `${progress * 100}%`,
					height: "100%",
					background: color,
					borderRadius: height / 2,
					boxShadow: "0 0 15px rgba(255, 0, 204, 0.5)",
					position: "relative",
				}}
			>
				{/* 先端の光（インジケーター） */}
				<div
					style={{
						position: "absolute",
						right: -5,
						top: -5,
						width: height + 10,
						height: height + 10,
						backgroundColor: "#fff",
						borderRadius: "50%",
						boxShadow: "0 0 20px #fff",
					}}
				/>
			</div>

			{/* パーセント表示 (オプション) */}
			{showPercentage && (
				<div
					style={{
						position: "absolute",
						right: 0,
						top: -30,
						color: "white",
						fontFamily: "system-ui",
						fontWeight: "bold",
						fontSize: 20,
						textShadow: "0 0 5px #000",
					}}
				>
					{Math.round(progress * 100)}%
				</div>
			)}
		</div>
	);
};
