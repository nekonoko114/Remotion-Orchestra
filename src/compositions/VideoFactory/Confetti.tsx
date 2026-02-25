import React, { useMemo } from "react";
import {
	AbsoluteFill,
	interpolate,
	random,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

type Particle = {
	x: number;
	y: number;
	size: number;
	color: string;
	rotation: number;
	speedX: number;
	speedY: number;
	spin: number;
};

export const Confetti: React.FC<{ count?: number; colors?: string[] }> = ({
	count = 100,
	colors = ["#d000ff", "#a200ff", "#ffffff", "#ffd700"],
}) => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	const particles = useMemo(() => {
		return [...new Array(count)].map((_, i) => {
			const seed = `confetti-${i}`;
			return {
				x: random(seed + "x") * width,
				y: random(seed + "y") * height - height, // Start above the screen
				size: 10 + random(seed + "size") * 15,
				color: colors[Math.floor(random(seed + "color") * colors.length)],
				rotation: random(seed + "rot") * 360,
				speedX: (random(seed + "sx") - 0.5) * 4,
				speedY: 2 + random(seed + "sy") * 5,
				spin: (random(seed + "spin") - 0.5) * 10,
			};
		});
	}, [count, colors, width, height]);

	return (
		<AbsoluteFill style={{ pointerEvents: "none" }}>
			{particles.map((p, i) => {
				const drop = frame * p.speedY;
				const drift = Math.sin(frame / 20 + p.x) * 50;
				const yPos = (p.y + drop) % (height + 100);
				const opacity = interpolate(yPos, [height - 100, height], [1, 0], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});

				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: p.x + drift,
							top: yPos,
							width: p.size,
							height: p.size * 0.6,
							backgroundColor: p.color,
							transform: `rotate(${p.rotation + frame * p.spin}deg)`,
							opacity,
							boxShadow: `0 0 10px ${p.color}aa`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
