import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export const CinematicTitle: React.FC<{
	title: string;
	subtitle?: string;
	color?: string;
}> = ({ title, subtitle, color = "#fff" }) => {
	const frame = useCurrentFrame();

	// フェードイン + ブラー解除 + 文字間隔拡大
	const opacity = interpolate(frame, [0, 60], [0, 1]);
	const blur = interpolate(frame, [0, 50], [20, 0]);
	const spacing = interpolate(frame, [0, 150], [0, 20], {
		easing: Easing.out(Easing.ease),
	});
	const scale = interpolate(frame, [0, 300], [0.9, 1.1]);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#000",
				alignItems: "center",
				justifyContent: "center",
				color: color,
				textTransform: "uppercase",
			}}
		>
			<div
				style={{
					opacity,
					transform: `scale(${scale})`,
					textAlign: "center",
				}}
			>
				{/* Main Title */}
				<h1
					style={{
						fontSize: 80,
						fontWeight: 300,
						letterSpacing: `${spacing}px`,
						filter: `blur(${blur}px)`,
						margin: "0 0 20px 0",
						fontFamily: "serif", // シネマティックな雰囲気
					}}
				>
					{title}
				</h1>

				{/* Subtitle (Delayed) */}
				{subtitle && (
					<div
						style={{
							marginTop: 20,
							fontSize: 20,
							letterSpacing: 8,
							opacity: interpolate(frame, [30, 80], [0, 0.7]),
							transform: `translateY(${interpolate(frame, [30, 80], [20, 0])}px)`,
							fontWeight: "lighter",
						}}
					>
						{subtitle}
					</div>
				)}
			</div>

			{/* Cinematic Letterbox (黒帯) */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "10%",
					background: "#000",
					zIndex: 10,
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					width: "100%",
					height: "10%",
					background: "#000",
					zIndex: 10,
				}}
			/>

			{/* Subtle Texture/Grain Overlay */}
			<AbsoluteFill
				style={{
					background:
						'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+")',
					opacity: 0.15,
					pointerEvents: "none",
				}}
			/>
		</AbsoluteFill>
	);
};
