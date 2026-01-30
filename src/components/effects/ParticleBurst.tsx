import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

type Props = {
	count?: number;
	colors?: string[]; // Array of colors to pick from
    x?: number; // Center X (percent or pixels, let's assume pixel for absolute control or % if AbsoluteFill)
    y?: number; // Center Y
    speed?: number;
};

// "3,2,1 particles fly in random directions"
// This component spawns particles at center and shoots them 360 degrees.
export const ParticleBurst: React.FC<Props> = ({ 
    count = 50, 
    colors = ["#FFF", "#FFD700"],
    x = 500,
    y = 500,
    speed = 1
}) => {
	const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

	const particles = useMemo(() => {
		return Array.from({ length: count }).map((_, i) => {
            const seed = `burst-${i}`;
			const angle = random(`${seed}-angle`) * Math.PI * 2; // Random 360 direction
            const velocity = (random(`${seed}-vel`) * 15 + 5) * speed;
            const size = random(`${seed}-size`) * 15 + 5;
            const color = colors[Math.floor(random(`${seed}-col`) * colors.length)];
            const rotation = random(`${seed}-rot`) * 360;
            const spinSpeed = (random(`${seed}-spin`) - 0.5) * 20;

			return { angle, velocity, size, color, rotation, spinSpeed };
		});
	}, [count, colors, speed]);

	return (
		<AbsoluteFill style={{ pointerEvents: "none" }}>
			{particles.map((p, i) => {
                // Physics: Text Burst
                // x = speed * cos(angle)
                // y = speed * sin(angle)
                // Add some gravity? User said "fly in random directions", implication is explosion. 
                // Let's add slight gravity for realism but mostly radial.
                
                const distance = p.velocity * frame;
                const pX = x + Math.cos(p.angle) * distance;
                const pY = y + Math.sin(p.angle) * distance + (frame * frame * 0.5); // Gravity

                const opacity = interpolate(frame, [0, 20, 40], [1, 1, 0]);

                if (frame > 50) return null; // Optimization

				return (
					<div
						key={`burst-p-${i}`}
						style={{
							position: "absolute",
							left: pX,
							top: pY,
							width: p.size,
							height: p.size,
							backgroundColor: p.color,
                            boxShadow: `0 0 10px ${p.color}`,
							transform: `translate(-50%, -50%) rotate(${p.rotation + frame * p.spinSpeed}deg)`,
                            borderRadius: i % 2 === 0 ? "50%" : "0%", // Mix shapes
                            opacity,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
