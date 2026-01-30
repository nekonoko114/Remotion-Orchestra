import { AbsoluteFill, random, useCurrentFrame } from "remotion";

type Props = {
	rank: number;
	beatPulse?: number;
};

export const AdjustmentLayerTime: React.FC<Props> = ({ rank, beatPulse = 0 }) => {
	const frame = useCurrentFrame();

	const getTheme = () => {
		// Time Theme: Cyan, Magenta, Purple
		if (rank === 1) return { tint: "#00f0ff", contrast: 1.2, saturate: 1.5, brightness: 1.1 };
		if (rank === 2) return { tint: "#ff00ff", contrast: 1.1, saturate: 1.4, brightness: 1.05 };
		if (rank === 3) return { tint: "#7000ff", contrast: 1.15, saturate: 1.3, brightness: 1.05 };
		return { tint: "#ffffff", contrast: 1, saturate: 1, brightness: 1 };
	};

	const theme = getTheme();
	const isGlitching = random(frame) < 0.05; 

	// Sharp Digital Glitch Shifting
	const shiftY = isGlitching ? Math.floor(random(frame + 1) * 20) : 0;
	const glitchFilter = isGlitching ? `hue-rotate(${random(frame) * 90}deg) brightness(1.5)` : "none";

	// Subtle pulse glow
	const pulseAlpha = beatPulse * 0.15;

	return (
		<AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
			<AbsoluteFill
				style={{
					backdropFilter: `contrast(${theme.contrast + beatPulse * 0.1}) saturate(${theme.saturate}) brightness(${theme.brightness + beatPulse * 0.2}) ${glitchFilter}`,
					zIndex: 100,
					transform: `translateY(${shiftY}px)`,
				}}
			/>

			{/* Neon Overlay */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle, ${theme.tint}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
					zIndex: 101,
					mixBlendMode: "screen",
				}}
			/>

			{/* Digital Scanlines */}
			<AbsoluteFill
				style={{
					background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.05) 2px, rgba(0, 240, 255, 0.05) 4px)",
					zIndex: 102,
					opacity: 0.3,
				}}
			/>
		</AbsoluteFill>
	);
};
