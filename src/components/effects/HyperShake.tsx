import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

interface HyperShakeProps {
	children: React.ReactNode;
	intensity?: number; // 0 to 10
	frequency?: number; // 1 to 5
}

export const HyperShake: React.FC<HyperShakeProps> = ({
	children,
	intensity = 5,
	frequency = 2,
}) => {
	const frame = useCurrentFrame();

	// If frequency is high, limit the updates to reduce re-paints
	const seedBase = Math.floor(frame / frequency);

	const shakeX = (random(`hx-${seedBase}`) - 0.5) * intensity * 20;
	const shakeY = (random(`hy-${seedBase}`) - 0.5) * intensity * 20;

	// Perspective tilt for "Extreme" feel
	const rotateX = (random(`rx-${seedBase}`) - 0.5) * intensity * 2;
	const rotateY = (random(`ry-${seedBase}`) - 0.5) * intensity * 2;
	const rotateZ = (random(`rz-${seedBase}`) - 0.5) * intensity * 5;

	// Constant filter ID to avoid redundant filter re-definitions
	const filterId = "hyper-shake-rgb-filter";

	return (
		<AbsoluteFill
			style={{
				perspective: "1000px",
				backgroundColor: "black",
			}}
		>
			<svg
				style={{ position: "absolute", width: 0, height: 0 }}
				aria-hidden="true"
			>
				<defs>
					<filter id={filterId}>
						{/* RGBSplit logic simplified to 1 movement instead of two if possible, 
						    but keeping two for quality as it's already one SVG pass */}
						<feColorMatrix
							in="SourceGraphic"
							type="matrix"
							values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
							result="red"
						/>
						<feOffset in="red" dx={intensity} dy="0" result="redOffset" />

						<feColorMatrix
							in="SourceGraphic"
							type="matrix"
							values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
							result="blue"
						/>
						<feOffset in="blue" dx={-intensity} dy="0" result="blueOffset" />

						<feBlend
							in="redOffset"
							in2="blueOffset"
							mode="screen"
							result="rb"
						/>
						<feBlend in="rb" in2="SourceGraphic" mode="screen" />
					</filter>
				</defs>
			</svg>

			<div
				style={{
					width: "100%",
					height: "100%",
					transform: `translate3d(${shakeX}px, ${shakeY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${1 + intensity * 0.01})`,
					position: "relative",
					filter: intensity > 0 ? `url(#${filterId})` : "none",
					willChange: "transform",
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};
