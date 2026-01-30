import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * 画面全体を白く発光させるシンプルなエフェクト
 */
export const FlashTransition: React.FC<{
	duration?: number;
}> = ({ duration = 10 }) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 2, duration], [0, 0.8, 0], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "white",
				opacity,
				pointerEvents: "none",
				willChange: "opacity",
			}}
		/>
	);
};
