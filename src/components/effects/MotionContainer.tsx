import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export type MotionType =
	| "fade"
	| "slideLeft"
	| "slideRight"
	| "slideUp"
	| "slideDown"
	| "zoomIn"
	| "zoomOut"
	| "rotate";

interface MotionContainerProps {
	children: React.ReactNode;
	type: MotionType;
	delay?: number;
	duration?: number; // アニメーションにかけるフレーム数目安
}

export const MotionContainer: React.FC<MotionContainerProps> = ({
	children,
	type,
	delay = 0,
	duration = 30,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// 汎用スプリングアニメーション
	const progress = spring({
		frame: frame - delay,
		fps,
		config: { damping: 200, mass: 1, stiffness: 100 },
		durationInFrames: duration,
	});

	const getStyle = (): React.CSSProperties => {
		switch (type) {
			case "fade":
				return { opacity: interpolate(progress, [0, 1], [0, 1]) };
			case "slideLeft":
				return {
					transform: `translateX(${interpolate(progress, [0, 1], [-width, 0])}px)`,
				};
			case "slideRight":
				return {
					transform: `translateX(${interpolate(progress, [0, 1], [width, 0])}px)`,
				};
			case "slideUp":
				return {
					transform: `translateY(${interpolate(progress, [0, 1], [height, 0])}px)`,
				};
			case "slideDown":
				return {
					transform: `translateY(${interpolate(progress, [0, 1], [-height, 0])}px)`,
				};
			case "zoomIn":
				return {
					transform: `scale(${interpolate(progress, [0, 1], [0, 1])})`,
					opacity: progress,
				};
			case "zoomOut":
				return {
					transform: `scale(${interpolate(progress, [0, 1], [2, 1])})`,
					opacity: progress,
				};
			case "rotate":
				return {
					transform: `rotate(${interpolate(progress, [0, 1], [-180, 0])}deg) scale(${progress})`,
				};
			default:
				return {};
		}
	};

	return <AbsoluteFill style={getStyle()}>{children}</AbsoluteFill>;
};
