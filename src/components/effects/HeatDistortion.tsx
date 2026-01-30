import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const HeatDistortion: React.FC<{
	children?: React.ReactNode;
	intensity?: number; // Distortion scale (default 20)
	frequency?: number; // Noise frequency (default 0.02)
}> = ({ children, intensity = 20, frequency = 0.02 }) => {
	const frame = useCurrentFrame();

	// Create a unique ID for the filter to avoid conflicts
	const filterId = useMemo(
		() => `heatWave-${Math.random().toString(36).substr(2, 9)}`,
		[],
	);

	return (
		<AbsoluteFill>
			{/* Define SVG Filter */}
			<svg
				width="0"
				height="0"
				style={{ position: "absolute", pointerEvents: "none" }}
				aria-label="Heat distortion filter definition"
			>
				<title>Heat Distortion Filter</title>
				<defs>
					<filter id={filterId}>
						{/* Turbulence creates the noisy pattern. 
                            baseFrequency y component is higher to simulate rising heat waves.
                        */}
						<feTurbulence
							type="turbulence"
							baseFrequency={`${frequency} ${frequency * 3}`}
							numOctaves="2"
							seed={Math.floor(frame / 5)} // Animate seed for jerky heat or use <animate>
						>
							{/* Smooth animation of turbulence is tricky in SVG alone without SMIL or JS frame update.
                                 Updating seed per frame is noisy (white noise). 
                                 A better way for smooth flow is animating baseFrequency or moving the element.
                                 Here we just keep it static or slowly shifting.
                             */}
						</feTurbulence>
						<feDisplacementMap in="SourceGraphic" scale={intensity} />
					</filter>
				</defs>
			</svg>

			{/* Apply Filter to Children */}
			<AbsoluteFill
				style={{
					filter: `url(#${filterId})`,
					overflow: "hidden", // Contain the distortion
					willChange: "filter",
				}}
			>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
