import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

interface TextOverlayProps {
	primary?: string;
	secondary?: string;
	theme?: string;
}

const THEMES: Record<string, { primary: string; secondary: string; glow: string }> = {
	neon_blue: { primary: "#00f0ff", secondary: "#70ffff", glow: "rgba(0, 240, 255, 0.6)" },
	vibrant_magenta: { primary: "#ff00ff", secondary: "#ff70ff", glow: "rgba(255, 0, 255, 0.6)" },
	fire_and_ice: { primary: "#ff4d00", secondary: "#00ccff", glow: "rgba(255, 77, 0, 0.6)" },
	electric_gold: { primary: "#ffcc00", secondary: "#ffffff", glow: "rgba(255, 204, 0, 0.6)" },
	monochrome_highlight: { primary: "#ffffff", secondary: "#aaaaaa", glow: "rgba(255, 255, 255, 0.4)" },
};

export const TextOverlay: React.FC<TextOverlayProps> = ({ primary, secondary, theme = "neon_blue" }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentTheme = THEMES[theme] || THEMES.neon_blue;

	const entrance = spring({
		frame,
		fps,
		config: { damping: 12 },
	});

	const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
	const translateY = interpolate(entrance, [0, 1], [50, 0]);

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
				padding: "0 10%",
				textAlign: "center",
				pointerEvents: "none",
			}}
		>
			<div style={{ opacity, transform: `translateY(${translateY}px)` }}>
				{primary && (
					<h1
						style={{
							fontFamily: "Inter, Noto Sans JP, sans-serif",
							fontSize: 100,
							fontWeight: 900,
							color: "#fff",
							margin: 0,
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							textShadow: `0 0 20px ${currentTheme.glow}, 0 0 40px ${currentTheme.glow}`,
							WebkitTextStroke: `2px ${currentTheme.primary}`,
						}}
					>
						{primary}
					</h1>
				)}
				{secondary && (
					<div
						style={{
							fontFamily: "Inter, Noto Sans JP, sans-serif",
							fontSize: 40,
							color: currentTheme.secondary,
							marginTop: 20,
							fontWeight: 500,
							letterSpacing: "0.2em",
							textTransform: "uppercase",
							background: `rgba(0, 0, 0, 0.5)`,
							padding: "10px 30px",
							borderRadius: "4px",
							display: "inline-block",
							backdropFilter: "blur(10px)",
							borderLeft: `5px solid ${currentTheme.primary}`,
						}}
					>
						{secondary}
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};
