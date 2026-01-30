import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export interface ZoomBlurTransitionProps {
	children: React.ReactNode;
	type: "in" | "out";
	duration?: number;
}

/**
 * ズームとブラーを組み合わせたスムーズなエフェクト
 * 入場（in）と退場（out）の両方に対応
 */
export const ZoomBlurTransition: React.FC<ZoomBlurTransitionProps> = ({
	children,
	type,
	duration = 15,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const spr = spring({
		frame: type === "in" ? frame : duration - frame,
		fps,
		durationInFrames: duration,
		config: { damping: 20 },
	});

	const scale =
		type === "in"
			? interpolate(spr, [0, 1], [1.5, 1])
			: interpolate(spr, [0, 1], [0.8, 1]);

	const blur = interpolate(spr, [0, 1], [20, 0]);
	const opacity = interpolate(spr, [0, 0.5], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				transform: `scale(${scale}) translate3d(0, 0, 0)`,
				filter: `blur(${blur}px)`,
				opacity,
				willChange: "transform, filter, opacity",
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
