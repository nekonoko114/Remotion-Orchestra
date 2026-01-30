import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

export const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{ pointerEvents: "none", opacity: 0.05, willChange: "filter" }}
		>
			<svg width="100%" height="100%" aria-label="Film grain overlay">
				<title>Film Grain</title>
				<filter id="grain">
					<feTurbulence
						type="fractalNoise"
						baseFrequency={random(frame) * 0.5 + 0.5}
						numOctaves="1"
						stitchTiles="stitch"
					/>
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};
