import {
	AbsoluteFill,
	Easing,
	interpolate,
	random,
	useCurrentFrame,
} from "remotion";

type Props = {
	color?: string; // Optional color tint (e.g. Gold)
	intensity?: "normal" | "high"; // "high" for top ranks
};

export const ImpactEffect: React.FC<Props> = ({
	color = "white",
	intensity = "normal",
}) => {
	const frame = useCurrentFrame();

	// 1. Flash Effect
	const flashOpacity = interpolate(frame, [0, 5, 20], [0.8, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// 2. Shockwave Rings
	// Multiple rings for high intensity
	const rings = intensity === "high" ? [0, 5, 10] : [0];

	// 3. Rays / Sunburst (Rotating)
	// Only for high intensity or colored
	const showRays = intensity === "high";
	const rayRotation = interpolate(frame, [0, 30], [0, 45]);
	const rayOpacity = interpolate(frame, [0, 10, 25], [0, 1, 0], {
		extrapolateRight: "clamp",
	});
	const rayScale = interpolate(frame, [0, 20], [0.5, 1.5], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{/* Background Flash Color Tint */}
			{intensity === "high" && (
				<AbsoluteFill
					style={{
						backgroundColor: color,
						opacity: flashOpacity * 0.5, // Subtle tint
						mixBlendMode: "screen",
					}}
				/>
			)}

			{/* White Flash Overlay (Sharpness) */}
			<AbsoluteFill
				style={{
					backgroundColor: "white",
					opacity: flashOpacity,
					mixBlendMode: "overlay",
				}}
			/>

			{/* Rotating Rays (God Rays) for High Intensity */}
			{showRays && (
				<div
					style={{
						position: "absolute",
						width: "200%",
						height: "200%",
						background: `repeating-conic-gradient(
                  from 0deg,
                  ${color} 0deg 10deg,
                  transparent 10deg 20deg
              )`,
						opacity: rayOpacity,
						transform: `scale(${rayScale}) rotate(${rayRotation}deg)`,
						maskImage:
							"radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
						WebkitMaskImage:
							"radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
					}}
				/>
			)}

			{/* Expanding Rings */}
			{rings.map((delay, i) => {
				const ringFrame = frame - delay;
				if (ringFrame < 0) return null;

				const ringScale = interpolate(ringFrame, [0, 20], [0, 2.5], {
					easing: Easing.out(Easing.ease),
					extrapolateRight: "clamp",
				});
				const ringOpacity = interpolate(ringFrame, [0, 10, 20], [1, 0.5, 0], {
					extrapolateRight: "clamp",
				});

				return (
					<div
						key={i}
						style={{
							width: 1000,
							height: 1000,
							borderRadius: "50%",
							border: `50px solid ${i === 0 ? "white" : color}`, // Inner ring white, outer colored
							transform: `scale(${ringScale})`,
							opacity: ringOpacity,
							boxShadow: `0 0 50px ${color}, inset 0 0 50px ${color}`,
							position: "absolute",
						}}
					/>
				);
			})}

			{/* Particles (Simple Dust) - Adds chaotic energy */}
			{intensity === "high" &&
				new Array(12).fill(0).map((_, i) => {
					const seed = i * 123;
					const angle = random(seed) * 360;
					const speed = random(seed + 1) * 10 + 10;

					const distance = interpolate(frame, [0, 20], [0, speed * 20], {
						easing: Easing.out(Easing.quad),
					});
					const particleOpacity = interpolate(frame, [0, 10, 25], [1, 1, 0]);
					const particleSize = random(seed + 2) * 20 + 10;

					return (
						<div
							key={i}
							style={{
								position: "absolute",
								width: particleSize,
								height: particleSize,
								borderRadius: "50%",
								background: color,
								opacity: particleOpacity,
								transform: `rotate(${angle}deg) translateX(${distance}px)`,
								boxShadow: `0 0 10px ${color}`,
							}}
						/>
					);
				})}
		</AbsoluteFill>
	);
};
