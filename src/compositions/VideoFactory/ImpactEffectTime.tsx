import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
} from "remotion";

type Props = {
	color?: string;
	intensity?: "normal" | "high";
	beatPulse?: number;
};

export const ImpactEffectTime: React.FC<Props> = ({
	color = "#ff0000",
	intensity = "normal",
	beatPulse = 0,
}) => {
	const frame = useCurrentFrame();

	// 1. Digital Flash (Sharp)
	const flashOpacity = interpolate(frame, [0, 3, 15], [0.6, 1, 0], {
		extrapolateRight: "clamp",
	}) /* + beatPulse * 0.2 */; // Removed beat sync

	// 2. Neon Hexagons or Squares
	const rings = intensity === "high" ? [0, 4] : [0];

	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{/* Scanline Flash */}
			<AbsoluteFill
				style={{
					backgroundColor: color,
					opacity: flashOpacity * 0.2,
					mixBlendMode: "screen",
				}}
			/>

			{/* Geometric Neon Rings (Square) */}
			{rings.map((delay, i) => {
				const ringFrame = frame - delay;
				if (ringFrame < 0) return null;

				const ringScale = interpolate(ringFrame, [0, 15], [0.2, 2], {
					easing: Easing.out(Easing.exp),
					extrapolateRight: "clamp",
				});
				const ringOpacity = interpolate(ringFrame, [0, 8, 15], [1, 0.5, 0], {
					extrapolateRight: "clamp",
				});

				return (
					<div
						key={i}
						style={{
							width: 800,
							height: 800,
							border: `${10}px solid ${color}`,
							transform: `scale(${ringScale}) rotate(${frame * 2}deg)`,
							opacity: ringOpacity,
							boxShadow: `0 0 30px ${color}, inset 0 0 30px ${color}`,
							position: "absolute",
						}}
					/>
				);
			})}

		</AbsoluteFill>
	);
};
