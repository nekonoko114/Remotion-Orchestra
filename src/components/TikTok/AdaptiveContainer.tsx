import type React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

export const AdaptiveContainer: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { width, height } = useVideoConfig();
	const isPortrait = height > width;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#000",
				fontFamily: "Noto Sans JP, sans-serif",
			}}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					position: "relative",
					overflow: "hidden",
					display: "flex",
					flexDirection: isPortrait ? "column" : "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};
