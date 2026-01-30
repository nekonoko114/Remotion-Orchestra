import type React from "react";
import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
} from "remotion";

export interface WipeProps {
	children: React.ReactNode;
	direction?: "left" | "right" | "up" | "down";
	duration?: number;
	type?: "in" | "out";
}

/**
 * 直線的なワイプエフェクト
 */
export const Wipe: React.FC<WipeProps> = ({
	children,
	direction = "left",
	duration = 30,
	type = "in",
}) => {
	const frame = useCurrentFrame();

	const progress = interpolate(frame, [0, duration], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
	});

	const getClipPath = () => {
		// Invert progress for 'out'
		const p = type === "in" ? progress : 1 - progress;
		const inv = 100 - p * 100;

		switch (direction) {
			case "left":
				return `inset(0 0 0 ${inv}%)`;
			case "right":
				return `inset(0 ${inv}% 0 0)`;
			case "up":
				return `inset(${inv}% 0 0 0)`;
			case "down":
				return `inset(0 0 ${inv}% 0)`;
			default:
				return `inset(0 0 0 ${inv}%)`;
		}
	};

	return (
		<AbsoluteFill
			style={{
				clipPath: getClipPath(),
				willChange: "clip-path",
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
