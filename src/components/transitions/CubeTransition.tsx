import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

import type { TransitionProps } from "../../types/transitions";

/**
 * 強化版：3D立方体回転トランジション
 * ズームアウト効果とモーションブラーの擬似再現を追加
 */
export const CubeTransition: React.FC<TransitionProps> = ({
	from,
	to,
	durationInFrames = 40, // 少しゆったりさせて質感を見せる
}) => {
	const frame = useCurrentFrame();
	const { width, fps } = useVideoConfig();

	const progress = spring({
		frame,
		fps,
		durationInFrames,
		config: {
			damping: 15,
			stiffness: 120,
			mass: 1.2,
		},
	});

	// 強烈なズームアウト効果 (1.0 -> 0.7 -> 1.0)
	const scale = interpolate(progress, [0, 0.5, 1], [1, 0.65, 1]);

	// 回転角度
	const rotation = interpolate(progress, [0, 1], [0, -90]);

	// 回転中の速度に応じてブラーをかける
	const blur = interpolate(Math.sin(progress * Math.PI), [0, 1], [0, 8]);

	return (
		<AbsoluteFill
			style={{
				perspective: 2500,
				backgroundColor: "#000",
			}}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					position: "relative",
					transformStyle: "preserve-3d",
					transform: `translateZ(${-width / 2}px) rotateY(${rotation}deg) scale(${scale})`,
					filter: `blur(${blur}px)`,
				}}
			>
				{/* 前面 */}
				<div
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						transform: `rotateY(0deg) translateZ(${width / 2}px)`,
						backfaceVisibility: "hidden",
						boxShadow: progress < 0.5 ? "0 0 50px rgba(0,0,0,0.5)" : "none",
					}}
				>
					{from}
				</div>

				{/* 右側面 */}
				<div
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						transform: `rotateY(90deg) translateZ(${width / 2}px)`,
						backfaceVisibility: "hidden",
						boxShadow: progress > 0.5 ? "0 0 50px rgba(0,0,0,0.5)" : "none",
					}}
				>
					{to}
				</div>
			</div>
		</AbsoluteFill>
	);
};
