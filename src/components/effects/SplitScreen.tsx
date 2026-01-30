import type React from "react";
import { AbsoluteFill } from "remotion";

interface SplitScreenProps {
	left: React.ReactNode;
	right: React.ReactNode;
	dividerColor?: string;
	dividerWidth?: number;
}

/**
 * 画面を左右に分割して配置するレイアウトコンポーネント
 */
export const SplitScreen: React.FC<SplitScreenProps> = ({
	left,
	right,
	dividerColor = "#fff",
	dividerWidth = 4,
}) => {
	return (
		<AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
			{/* 左側 */}
			<div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
				<div style={{ width: "100%", height: "100%" }}>{left}</div>
			</div>

			{/* 分割線 */}
			<div
				style={{
					width: dividerWidth,
					backgroundColor: dividerColor,
					boxShadow: `0 0 10px ${dividerColor}`,
					zIndex: 10,
				}}
			/>

			{/* 右側 */}
			<div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
				<div style={{ width: "100%", height: "100%" }}>{right}</div>
			</div>
		</AbsoluteFill>
	);
};
