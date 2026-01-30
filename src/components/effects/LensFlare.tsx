import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const LensFlare: React.FC<{
	color?: string;
	intensity?: number;
	scale?: number;
	opacity?: number;
	cx?: number; // Center X %
	cy?: number; // Center Y %
}> = ({ color = "#ffffff", intensity = 1, scale = 1, opacity = 1, cx, cy }) => {
	const frame = useCurrentFrame();

	const loopDuration = 120; // 2 seconds loop at 60fps
	const t = frame % loopDuration;

	// Move from left (-20%) to right (120%)
	// If cx/cy are provided, use them. Otherwise animate.
	const lightX = cx !== undefined ? cx : interpolate(t, [0, loopDuration], [-20, 120]);
	const lightY = cy !== undefined ? cy : interpolate(t, [0, loopDuration], [20, 80]);

	// Fade in/out at edges
	const loopOpacity = interpolate(
		t,
		[0, 20, loopDuration - 20, loopDuration],
		[0, 1, 1, 0],
	);

	// フレアの要素（ゴースト）を生成して配置する関数
	// lightPos (0~1) と center (0.5) を結ぶ線上に配置
	const renderFlare = (
		distance: number,
		size: number,
		op: number,
		hueShift = 0,
	) => {
		// 画面中心
		const cx = 50;
		const cy = 50;

		// distance: -1(光源側) ~ 1(対角側)
		// 実際は光源位置(L)と中心(C)から計算: P = C + (C - L) * distance

		const deltaX = cx - lightX;
		const deltaY = cy - lightY;

		const posX = cx + deltaX * distance;
		const posY = cy + deltaY * distance;

		return (
			<div
				style={{
					position: "absolute",
					left: `${posX}%`,
					top: `${posY}%`,
					width: size * scale,
					height: size * scale,
					borderRadius: "50%",
					background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
					opacity: op * 0.6 * opacity * loopOpacity, // 全体の強さを調整
					mixBlendMode: "screen",
					transform: "translate(-50%, -50%)",
					filter: `hue-rotate(${hueShift}deg) blur(${size * 0.1}px)`,
					pointerEvents: "none",
				}}
			/>
		);
	};

	return (
		<AbsoluteFill style={{ overflow: "hidden" }}>
			{/* メインの光源 */}
			<div
				style={{
					position: "absolute",
					left: `${lightX}%`,
					top: `${lightY}%`,
					width: 300 * scale,
					height: 300 * scale,
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
					transform: "translate(-50%, -50%)",
					mixBlendMode: "screen",
					opacity: intensity * opacity * loopOpacity,
				}}
			/>
			{/* 水平の光条（アナモルフィックレンズ風） */}
			<div
				style={{
					position: "absolute",
					left: `${lightX}%`,
					top: `${lightY}%`,
					width: "120%",
					height: 4,
					background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
					transform: "translate(-50%, -50%)",
					mixBlendMode: "screen",
					opacity: 0.7 * intensity * opacity * loopOpacity,
					filter: "blur(4px)",
				}}
			/>

			{/* ゴーストフレア (光の反射) */}
			{renderFlare(0.5, 60, 0.4, 30)}
			{renderFlare(1.0, 100, 0.2, 180)}
			{renderFlare(1.5, 40, 0.3, -40)}
			{renderFlare(2.2, 150, 0.1, 90)}
			{renderFlare(0.2, 30, 0.5, 60)}
		</AbsoluteFill>
	);
};
