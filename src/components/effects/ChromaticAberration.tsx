import type React from "react";

interface ChromaticAberrationProps {
	children: React.ReactNode;
	offset?: number; // ズレの量 (px)
	intensity?: number; // 0-1, アニメーションで変化させる用
	style?: React.CSSProperties;
}

/**
 * 映像のRGBをずらして色収差を発生させるフィルター
 */
export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
	children,
	offset = 2,
	intensity = 1,
	style,
}) => {
	const finalOffset = offset * intensity;

	return (
		<div style={{ position: "relative", overflow: "visible", ...style }}>
			{/* 赤（Red）レイヤー */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: -finalOffset,
					width: "100%",
					height: "100%",
					mixBlendMode: "screen",
					filter: "drop-shadow(0 0 0 red)", // 色を付けるためのテクニック
					color: "red",
					zIndex: 2,
					pointerEvents: "none",
				}}
			>
				{children}
			</div>

			{/* 青（Blue）レイヤー */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: finalOffset,
					width: "100%",
					height: "100%",
					mixBlendMode: "screen",
					filter: "drop-shadow(0 0 0 blue)",
					color: "blue",
					zIndex: 1,
					pointerEvents: "none",
				}}
			>
				{children}
			</div>

			{/* ベースレイヤー（緑を想定して合成） */}
			<div style={{ position: "relative", zIndex: 0 }}>{children}</div>
		</div>
	);
};
