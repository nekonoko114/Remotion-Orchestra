import type React from "react";
import { useMemo } from "react";
import {
	AbsoluteFill,
	interpolate,
	random,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

interface Point {
	x: number;
	y: number;
}

// Optimization: Reduce iterations from 8 to 5. Points: 2^8 (256) -> 2^5 (32)
// This significantly reduces the string join burden in SVG polyline points.
const generateBoltPath = (
	start: Point,
	end: Point,
	displacement: number,
	seed: string,
): Point[] => {
	const points: Point[] = [start, end];
	let currentDisplacement = displacement;

	for (let i = 0; i < 5; i++) {
		for (let j = points.length - 1; j > 0; j--) {
			const p1 = points[j - 1];
			const p2 = points[j];
			const mid: Point = {
				x:
					(p1.x + p2.x) / 2 +
					(random(`${seed}-${i}-${j}-x`) - 0.5) * currentDisplacement,
				y:
					(p1.y + p2.y) / 2 +
					(random(`${seed}-${i}-${j}-y`) - 0.5) * currentDisplacement,
			};
			points.splice(j, 0, mid);
		}
		currentDisplacement /= 2;
	}
	return points;
};

const LightningBolt: React.FC<{
	seed: string;
	color: string;
	strikeFrame: number;
}> = ({ seed, color, strikeFrame }) => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	const config = useMemo(() => {
		const isHorizontal = random(`horiz-${seed}`) > 0.98;
		const duration = 1 + Math.floor(random(`dur-${seed}`) * 2);
		const sw = 0.2 + random(`sw-${seed}`) * 1.5;

		let start: Point;
		let end: Point;
		if (isHorizontal) {
			const side = random(`side-${seed}`) > 0.5;
			start = { x: side ? 0 : width, y: random(`sy-${seed}`) * height };
			end = { x: side ? width : 0, y: random(`ey-${seed}`) * height };
		} else {
			start = { x: random(`sx-${seed}`) * width, y: 0 };
			end = { x: random(`ex-${seed}`) * width, y: height };
		}

		return { start, end, duration, sw };
	}, [seed, width, height]);

	const path = useMemo(() => {
		return generateBoltPath(config.start, config.end, 600, seed);
	}, [config, seed]);

	const activeFrame = frame - strikeFrame;
	// Optimization: bolt only lives for 12 frames.
	if (activeFrame < 0 || activeFrame > 12) return null;

	// Optimization: Simplify jitter. Instead of expensive per-point random,
	// we use a single translate for the whole bolt or just use the generated path.
	// 20px jitter might be too much for high FPS rendering.
	const jitterX = (random(`jx-${frame}-${seed}`) - 0.5) * 10;
	const jitterY = (random(`jy-${frame}-${seed}`) - 0.5) * 10;

	const growthProgress = Math.min(1, activeFrame / config.duration);
	const opacity =
		activeFrame < 1 ? 0.8 : activeFrame < 4 ? 1 : 1 - (activeFrame - 4) / 8;
	const visiblePoints = path.slice(
		0,
		Math.floor(path.length * growthProgress) + 1,
	);

	// Optimization: Faster string conversion
	const polyPoints = visiblePoints.map((p) => `${p.x},${p.y}`).join(" ");

	return (
		<g
			style={{
				opacity,
				transform: `translate(${jitterX}px, ${jitterY}px)`,
				willChange: "transform, opacity",
			}}
		>
			{/* Optimization: Single polyline with glow filter instead of 4 layers */}
			<polyline
				points={polyPoints}
				fill="none"
				stroke={color}
				strokeWidth={config.sw * 4}
				strokeLinecap="round"
				style={{ filter: "url(#energyGlow)" }}
			/>
			<polyline
				points={polyPoints}
				fill="none"
				stroke="white"
				strokeWidth={config.sw}
				strokeLinecap="round"
			/>
		</g>
	);
};

export const EnergyBolts: React.FC = () => {
	const frame = useCurrentFrame();

	const strikes = useMemo(() => {
		const colors = ["#00f0ff", "#ff00ff", "#ffffff", "#00ff00", "#ffff00"];
		// Optimization: Reduce max strikes from 900 to 200.
		// Higher density usually isn't visible in high-speed VFX but kills performance.
		return Array.from({ length: 200 }).map((_, i) => ({
			id: i,
			frame: Math.floor(random(`time-${i}`) * 600),
			color: colors[Math.floor(random(`color-${i}`) * colors.length)],
		}));
	}, []);

	// Optimization: Pre-filter active strikes to minimize React component overhead
	const activeStrikes = useMemo(() => {
		return strikes.filter((s) => frame >= s.frame && frame < s.frame + 12);
	}, [strikes, frame]);

	const activeStrikesCount = activeStrikes.length;
	const shakeAmount = interpolate(
		activeStrikesCount,
		[0, 5, 10], // Adjusted ranges for lower strike count
		[0, 15, 35],
		{ extrapolateRight: "clamp" },
	);
	const shakeX = (random(`shake-x-${frame}`) - 0.5) * shakeAmount;
	const shakeY = (random(`shake-y-${frame}`) - 0.5) * shakeAmount;

	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				transform: `translate3d(${shakeX}px, ${shakeY}px, 0)`,
				willChange: "transform",
			}}
		>
			<svg
				width="100%"
				height="100%"
				style={{
					overflow: "visible",
					zIndex: 1,
				}}
				aria-label="Energy bolts"
			>
				<title>Energy Bolts</title>
				<defs>
					<filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="8" result="blur" />
						<feComposite in="SourceGraphic" in2="blur" operator="over" />
					</filter>
				</defs>
				{activeStrikes.map((s) => (
					<LightningBolt
						key={s.id}
						seed={`bolt-${s.id}`}
						color={s.color}
						strikeFrame={s.frame}
					/>
				))}
			</svg>
		</AbsoluteFill>
	);
};
