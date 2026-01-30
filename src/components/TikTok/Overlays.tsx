import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

// 1. Live Badge Component
export const LiveBadge: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(Math.sin(frame / 10), [-1, 1], [0.4, 1]); // Pulsing effect

	return (
		<div
			style={{
				position: "absolute",
				top: "40px",
				left: "40px",
				backgroundColor: "#ff2d55",
				color: "#fff",
				padding: "4px 16px",
				borderRadius: "4px",
				fontSize: "24px",
				fontWeight: "bold",
				display: "flex",
				alignItems: "center",
				gap: "8px",
				boxShadow: "0 0 10px rgba(255,45,85,0.5)",
				opacity,
				willChange: "opacity",
			}}
		>
			<div
				style={{
					width: "12px",
					height: "12px",
					backgroundColor: "#fff",
					borderRadius: "50%",
				}}
			/>
			LIVE
		</div>
	);
};

// 2. Floating Heart Particle
const Heart = ({ delay, index }: { delay: number; index: number }) => {
	const frame = useCurrentFrame();
	const { height } = useVideoConfig();
	const spr = spring({
		frame: frame - delay,
		fps: 30,
		config: { damping: 100 },
	});

	const y = interpolate(spr, [0, 1], [height + 100, 100]);
	const xOffset = Math.sin(frame / 20 + index) * 50;
	const opacity = interpolate(spr, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
	const scale = interpolate(spr, [0, 0.2], [0.5, 1.2]);

	return (
		<div
			style={{
				position: "absolute",
				left: `calc(85% + ${xOffset}px)`,
				top: `${y}px`,
				fontSize: "40px",
				opacity,
				transform: `scale(${scale})`,
				filter: "drop-shadow(0 0 5px rgba(255,45,85,0.5))",
				willChange: "transform, top, opacity",
			}}
		>
			❤️
		</div>
	);
};

export const FloatingHearts: React.FC = () => {
	const hearts = new Array(15).fill(0).map((_, i) => ({
		delay: random(i) * 300,
	}));

	return (
		<AbsoluteFill style={{ pointerEvents: "none" }}>
			{hearts.map((h, i) => {
				const key = `heart-${i}-${h.delay}`;
				return <Heart key={key} index={i} delay={h.delay} />;
			})}
		</AbsoluteFill>
	);
};
