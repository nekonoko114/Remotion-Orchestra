import type React from "react";
import { AbsoluteFill } from "remotion";

export const TikTokContainer: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
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
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};
