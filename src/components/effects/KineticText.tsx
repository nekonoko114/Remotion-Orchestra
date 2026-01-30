import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

interface KineticTextProps {
	text: string;
	style?: React.CSSProperties;
}

export const KineticText: React.FC<KineticTextProps> = ({ text, style }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// 文字を配列に分解
	const chars = text.split("");

	return (
		<AbsoluteFill
			style={{
				...style,
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{chars.map((char, index) => {
				// 文字ごとに少しずつ開始時間を遅らせる
				const delay = index * 2;

				const spr = spring({
					frame: frame - delay,
					fps,
					config: { damping: 12, stiffness: 200 },
				});

				const translateY = interpolate(spr, [0, 1], [100, 0]);
				const opacity = interpolate(spr, [0, 1], [0, 1]);
				const rotate = interpolate(spr, [0, 1], [90, 0]);

				return (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: Visual character stagger, static text
						key={index}
						style={{
							display: "inline-block",
							transform: `translate3d(0, ${translateY}px, 0) rotateX(${rotate}deg)`,
							opacity,
							marginRight: "0.05em", // 文字間隔
							willChange: "transform, opacity",
						}}
					>
						{char}
					</span>
				);
			})}
		</AbsoluteFill>
	);
};
