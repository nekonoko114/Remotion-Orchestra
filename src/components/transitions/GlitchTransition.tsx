import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

import type { TransitionProps } from "../../types/transitions";

/**
 * デジタルノイズとRGBスプリットを用いた強烈なグリッチトランジション
 */
export const GlitchTransition: React.FC<TransitionProps> = ({
	from,
	to,
	durationInFrames = 20,
}) => {
	const frame = useCurrentFrame();

	// 進行度 0 -> 1
	const progress = Math.min(1, frame / durationInFrames);

	if (progress >= 1) return <AbsoluteFill>{to}</AbsoluteFill>;

	// スライスの生成
	const slices = 10;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			{/* 背景に次のシーンを薄く配置 */}
			<AbsoluteFill style={{ opacity: progress }}>{to}</AbsoluteFill>

			{/* スライスされた「前のシーン」 */}
			{Array.from({ length: slices }).map((_, i) => {
				const seed = i + progress;
				const offset = (random(`glitch-${seed}`) - 0.5) * 100 * (1 - progress);
				const rOffset = (random(`r-${seed}`) - 0.5) * 20;

				return (
					<div
						key={i}
						style={{
							position: "absolute",
							top: `${(i / slices) * 100}%`,
							width: "100%",
							height: `${100 / slices}%`,
							overflow: "hidden",
							transform: `translate3d(${offset}px, 0, 0)`,
							opacity: 1 - progress,
							willChange: "transform, opacity",
						}}
					>
						<div
							style={{
								marginTop: `-${(i / slices) * 100}vh`,
								filter: `contrast(1.5) hue-rotate(${progress * 90}deg)`,
								transform: `translate3d(${rOffset}px, 0, 0)`,
								willChange: "filter, transform",
							}}
						>
							{from}
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
