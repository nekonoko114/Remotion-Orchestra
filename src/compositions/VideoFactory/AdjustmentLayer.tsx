import { AbsoluteFill, random, useCurrentFrame } from "remotion";

type Props = {
	rank: number;
	beatPulse?: number;
};

export const AdjustmentLayer: React.FC<Props> = ({ rank, beatPulse = 0 }) => {
	const frame = useCurrentFrame();

	// Theme configuration based on rank - WEAKENED INTENSITY
	const getTheme = () => {
		if (rank === 1)
			return {
				tint: "#FFD700",
				contrast: 1.3,
				saturate: 1.4,
				brightness: 1.1,
			};
		if (rank === 2)
			return {
				tint: "#A0C0FF",
				contrast: 1.15,
				saturate: 1.25,
				brightness: 1.05,
			};
		if (rank === 3)
			return {
				tint: "#FF8C00",
				contrast: 1.2,
				saturate: 1.3,
				brightness: 1.05,
			};
		return { tint: "#ffffff", contrast: 1, saturate: 1, brightness: 1 };
	};

	const theme = getTheme();

	// Glitch Logic - FURTHER WEAKENED
	// Trigger glitches every ~2-3 seconds, or randomly
	// Probability of glitch on any given frame
	const isGlitching = random(frame) < 0.02; // 2% chance per frame (very subtle)

	// Glitch Transform (Shift X/Y)
	const shiftX = isGlitching ? (random(frame + 10) - 0.5) * 10 : 0; // Reduced from 40 to 10
	const shiftY = isGlitching ? (random(frame + 20) - 0.5) * 5 : 0; // Reduced from 10 to 5

	// Glitch Color Shift (Falsely separated channels)
	const redShift = isGlitching ? random(frame + 30) * 4 : 0;
	const blueShift = isGlitching ? random(frame + 40) * -4 : 0;

	// Blur is also reduced
	const glitchFilter = isGlitching
		? `hue-rotate(${random(frame) * 20}deg) blur(1px)`
		: "none";

	// theme boost based on beat
	const beatBrightness = theme.brightness + (beatPulse || 0) * 0.3;
	const beatContrast = theme.contrast + (beatPulse || 0) * 0.2;

	// Screen Shake Logic (Impactful!)
	const shakeX = (beatPulse || 0) * (random(frame + 100) - 0.5) * 40;
	const shakeY = (beatPulse || 0) * (random(frame + 200) - 0.5) * 40;

	return (
		<AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
			{/* 1. Backdrop Filter (Global Color Grading) - WEAKENED */}
			{/* Added Glitch Twist: Hue Rotate or Invert occasionally? */}
			<AbsoluteFill
				style={{
					backdropFilter: `contrast(${beatContrast}) saturate(${theme.saturate}) brightness(${beatBrightness}) ${glitchFilter}`,
					zIndex: 100,
					transform: `translate(${shiftX + shakeX}px, ${shiftY + shakeY}px) scale(${1 + (beatPulse || 0) * 0.02})`,
				}}
			/>

			{/* Glitch RGB Split Simulation (Only visible during glitch) */}
			{isGlitching && (
				<>
					<AbsoluteFill
						style={{
							background: "rgba(255, 0, 0, 0.1)", // Reduced opacity
							transform: `translate(${shiftX + redShift}px, ${shiftY}px)`,
							mixBlendMode: "screen",
							zIndex: 105,
						}}
					/>
					<AbsoluteFill
						style={{
							background: "rgba(0, 255, 255, 0.1)", // Reduced opacity
							transform: `translate(${shiftX + blueShift}px, ${shiftY}px)`,
							mixBlendMode: "screen",
							zIndex: 105,
						}}
					/>
				</>
			)}

			{/* 2. Vignette (Dark borders) - Kept same */}
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%)",
					zIndex: 101,
					mixBlendMode: "multiply",
				}}
			/>

			{/* 3. Color Tint (Atmosphere) - WEAKENED Opacity */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(to bottom, ${theme.tint}00, ${theme.tint}1a)`, // max 10% opacity (hex 1a)
					zIndex: 102,
					mixBlendMode: "overlay",
				}}
			/>

			{/* 4. Soft Glow (Center Bloom) - WEAKENED */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle, ${theme.tint}33 0%, transparent 60%)`,
					zIndex: 103,
					mixBlendMode: "screen",
					filter: "blur(40px)",
				}}
			/>
		</AbsoluteFill>
	);
};
