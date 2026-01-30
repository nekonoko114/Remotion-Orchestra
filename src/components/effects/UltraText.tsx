import type React from "react";
import { Easing, interpolate, random, spring, useCurrentFrame } from "remotion";
import { LightningBolt } from "./LightningBolt";

// --- 1. INFERNO BURN (業火) ---
export const InfernoBurn: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 100,
}) => {
	const frame = useCurrentFrame();

	const burnHeight = interpolate(frame, [0, 60], [100, 0], {
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				position: "relative",
				display: "inline-block",
				fontSize,
				fontWeight: 900,
				color: "#000",
			}}
		>
			<svg
				style={{ position: "absolute", width: 0, height: 0 }}
				aria-label="Inferno filter definition"
			>
				<title>Inferno Filter</title>
				<filter id="inferno">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.05"
						numOctaves="4"
						seed={frame}
					>
						<animate
							attributeName="baseFrequency"
							values="0.05;0.06;0.05"
							dur="0.2s"
							repeatCount="indefinite"
						/>
					</feTurbulence>
					<feDisplacementMap in="SourceGraphic" scale="15" />
					<feGaussianBlur stdDeviation="3" />
					<feColorMatrix
						type="matrix"
						values="
                        0 0 0 0   1
                        0 0 0 0   0.8
                        0 0 0 0   0
                        0 0 0 1.5 -0.5
                    "
					/>
				</filter>
			</svg>

			{/* 炎のレイヤー */}
			<div
				style={{
					position: "absolute",
					top: -10,
					left: 0,
					width: "100%",
					height: "100%",
					color: "#ff4d00",
					filter: "url(#inferno)",
					opacity: 0.8,
				}}
			>
				{text}
			</div>
			<div
				style={{
					position: "absolute",
					top: -20,
					left: 0,
					width: "100%",
					height: "100%",
					color: "#ffaa00",
					filter: "blur(10px)",
					mixBlendMode: "screen",
				}}
			>
				{text}
			</div>

			{/* 本体の出現 */}
			<div
				style={{
					position: "relative",
					color: "#fff",
					background: "linear-gradient(to top, #ffff00, #ff0000)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					clipPath: `inset(0 0 ${burnHeight}% 0)`,
				}}
			>
				{text}
			</div>
		</div>
	);
};

// --- 2. CYBER DECODE (解読) ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
export const CyberDecode: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 80,
}) => {
	const frame = useCurrentFrame();

	const revealedText = text
		.split("")
		.map((char, i) => {
			const startFrame = i * 2;
			const endFrame = startFrame + 20;

			if (frame < startFrame) return "";
			if (frame >= endFrame) return char;

			return CHARS[Math.floor(random(frame * i + 123) * CHARS.length)];
		})
		.join("");

	return (
		<div
			style={{
				fontSize,
				fontFamily: "monospace",
				fontWeight: "bold",
				color: "#0f0",
				textShadow: "0 0 10px #0f0",
				letterSpacing: interpolate(frame, [0, 50], [20, 5], {
					extrapolateRight: "clamp",
				}),
			}}
		>
			{revealedText}
			{frame % 10 < 5 && (
				<span style={{ backgroundColor: "#0f0", color: "#000" }}>_</span>
			)}
		</div>
	);
};

// --- 3. LIQUID METAL (液体金属) ---
export const LiquidMetal: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 100,
}) => {
	const frame = useCurrentFrame();

	const blur = interpolate(frame, [0, 40], [30, 0], {
		extrapolateRight: "clamp",
	});
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: "clamp",
	});
	const separation = interpolate(frame, [0, 40], [50, 0], {
		extrapolateRight: "clamp",
	});

	return (
		<div style={{ position: "relative" }}>
			<svg
				style={{ position: "absolute", width: 0, height: 0 }}
				aria-label="Liquid metal filter definition"
			>
				<title>Liquid Metal Filter</title>
				<filter id="liquidMetal">
					<feGaussianBlur in="SourceGraphic" stdDeviation={blur} />
					<feColorMatrix
						mode="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10"
					/>
				</filter>
			</svg>

			<div
				style={{
					fontSize,
					fontWeight: 900,
					color: "#c0c0c0",
					filter: "url(#liquidMetal) drop-shadow(0 5px 5px rgba(0,0,0,0.5))",
					opacity,
					letterSpacing: `${separation}px`,
					background: "linear-gradient(45deg, #999, #fff, #999)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				}}
			>
				{text}
			</div>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background:
						"linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
					backgroundSize: "200% 100%",
					backgroundPosition: `${frame * 2}% 0`,
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					pointerEvents: "none",
					opacity: frame > 40 ? 1 : 0,
				}}
			>
				{text}
			</div>
		</div>
	);
};

// --- 4. SHATTER ASSEMBLY (破片結合) ---
export const ShatterAssembly: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 100,
}) => {
	const frame = useCurrentFrame();

	return (
		<div
			style={{
				display: "flex",
				fontSize,
				fontWeight: 900,
				color: "#fff",
				overflow: "visible",
			}}
		>
			{text.split("").map((char, i) => {
				const delay = i * 2;
				const prog = spring({
					frame: frame - delay,
					fps: 30,
					config: { damping: 12 },
				});

				const startX = (random(i) - 0.5) * 500;
				const startY = (random(i + 10) - 0.5) * 500;
				const startRotate = (random(i + 20) - 0.5) * 360;

				const x = interpolate(prog, [0, 1], [startX, 0]);
				const y = interpolate(prog, [0, 1], [startY, 0]);
				const r = interpolate(prog, [0, 1], [startRotate, 0]);
				const s = interpolate(prog, [0, 1], [0, 1]);

				const key = `char-${i}`;

				return (
					<span
						key={key}
						style={{
							display: "inline-block",
							transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`,
							opacity: prog,
						}}
					>
						{char}
					</span>
				);
			})}
		</div>
	);
};

// --- 5. NEON CHAOS (故障ネオン) ---
export const NeonChaos: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 100,
}) => {
	const frame = useCurrentFrame();

	const seed = Math.floor(frame / 2);
	const intensity = random(seed);
	const isOn = intensity > 0.3;
	const flicker = isOn ? 1 : 0.1;

	const color = "#ff00de";

	const shiftX = (random(seed + 10) - 0.5) * (intensity > 0.9 ? 10 : 0);
	const skew = (random(seed + 20) - 0.5) * (intensity > 0.9 ? 20 : 0);

	return (
		<div style={{ position: "relative", fontSize, fontWeight: "bold" }}>
			<div
				style={{
					color: isOn ? "#fff" : "#444",
					textShadow: isOn
						? `
                    0 0 5px #fff,
                    0 0 10px #fff,
                    0 0 20px ${color},
                    0 0 40px ${color},
                    0 0 80px ${color}
                `
						: "none",
					opacity: flicker,
					transform: `translate(${shiftX}px, 0) skewX(${skew}deg)`,
					transition: "all 0.05s",
				}}
			>
				{text}
			</div>

			{intensity > 0.95 && (
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						width: "120%",
						height: 2,
						background: "#fff",
						transform: `translate(-50%, -50%) rotate(${random(frame) * 360}deg)`,
						boxShadow: "0 0 10px #fff",
					}}
				/>
			)}
		</div>
	);
};

// --- 6. VOID CONSUMER (虚無) ---
export const VoidConsumer: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 100,
}) => {
	const frame = useCurrentFrame();

	const progress = interpolate(frame, [0, 50], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const scale = interpolate(progress, [0, 1], [5, 1]);
	const rotate = interpolate(progress, [0, 1], [180, 0]);
	const blur = interpolate(progress, [0, 1], [50, 0]);
	const tracking = interpolate(progress, [0, 1], [100, 0]);

	return (
		<div style={{ position: "relative" }}>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: 600,
					height: 600,
					background: "radial-gradient(circle, #000 0%, transparent 70%)",
					transform: `translate(-50%, -50%) scale(${1 - progress})`,
					opacity: 1 - progress,
				}}
			/>

			<div
				style={{
					fontSize,
					fontWeight: 900,
					color: "#fff",
					transform: `scale(${scale}) rotate(${rotate}deg)`,
					filter: `blur(${blur}px)`,
					letterSpacing: `${tracking}px`,
					textShadow: "0 0 30px #8000ff",
				}}
			>
				{text}
			</div>
		</div>
	);
};

// --- 7. POP-ART 3D (アメコミ) ---
export const PopArt3D: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 120,
}) => {
	const frame = useCurrentFrame();

	const bounce = spring({
		frame,
		fps: 30,
		config: { damping: 15, stiffness: 200 },
	});

	return (
		<div
			style={{
				fontSize,
				fontWeight: 900,
				fontStyle: "italic",
				color: "#ffee00",
				transform: `scale(${bounce}) rotate(-5deg)`,
				textShadow: `
                4px 4px 0px #000,
                8px 8px 0px #ff0055,
                12px 12px 0px #000
            `,
				WebkitTextStroke: "3px black",
			}}
		>
			{text}
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: "200%",
					height: "200%",
					background:
						"repeating-conic-gradient(from 0deg, white 0deg 10deg, #00ccff 10deg 20deg)",
					zIndex: -1,
					transform: `translate(-50%, -50%) rotate(${frame}deg)`,
					opacity: 0.3,
				}}
			/>
		</div>
	);
};

// --- 8. BIO-HAZARD SLIME (粘液) ---
export const BioSlime: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 100,
}) => {
	const frame = useCurrentFrame();

	return (
		<div style={{ position: "relative" }}>
			<svg
				style={{ position: "absolute", width: 0, height: 0 }}
				aria-label="Bio slime filter definition"
			>
				<title>Bio Slime Filter</title>
				<filter id="slime">
					<feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" />
					<feDisplacementMap in="SourceGraphic" scale="10" />
					<feGaussianBlur stdDeviation="3" />
					<feColorMatrix
						mode="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
					/>
				</filter>
			</svg>

			<div
				style={{
					fontSize,
					fontWeight: "bold",
					color: "#ccff00",
					filter: "url(#slime)",
					textShadow: "0 5px 10px rgba(0,0,0,0.5)",
					willChange: "filter",
				}}
			>
				{text}
			</div>
			{text.split("").map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: Visual drip effect, order is static
					key={`drip-${i}`}
					style={{
						position: "absolute",
						left: `${(i + 0.5) * (fontSize * 0.6)}px`,
						top: "60%",
						width: 10,
						height: interpolate(frame, [0, 100], [0, 100]),
						background: "#ccff00",
						borderRadius: "0 0 10px 10px",
						filter: "url(#slime)",
						willChange: "height",
					}}
				/>
			))}
		</div>
	);
};

// --- 9. STARDUST GALAXY (星屑) ---
export const StardustGalaxy: React.FC<{ text: string; fontSize?: number }> = ({
	text,
	fontSize = 100,
}) => {
	const frame = useCurrentFrame();
	const particles = 50;

	return (
		<div
			style={{
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					fontSize,
					fontWeight: "100",
					color: "#fff",
					opacity: interpolate(frame, [30, 60], [0, 1]),
					filter: "drop-shadow(0 0 10px #fff)",
					willChange: "opacity",
				}}
			>
				{text}
			</div>

			{Array.from({ length: particles }).map((_, i) => {
				const progress = interpolate(frame, [0, 50], [1, 0], {
					extrapolateRight: "clamp",
				});
				const angle = (i / particles) * Math.PI * 2 + frame * 0.1;
				const radius = 200 * progress + random(i) * 50;

				if (progress <= 0) return null;

				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Visual particle effect, stable count
						key={`star-${i}`}
						style={{
							position: "absolute",
							left: "50%",
							top: "50%",
							width: 4,
							height: 4,
							background: "#fff",
							borderRadius: "50%",
							transform: `translate(
                            calc(-50% + ${Math.cos(angle) * radius}px), 
                            calc(-50% + ${Math.sin(angle) * radius}px)
                        )`,
							opacity: progress,
							boxShadow: "0 0 5px #fff",
							willChange: "transform, opacity",
						}}
					/>
				);
			})}
		</div>
	);
};

// --- 10. THUNDER GOD STRIKE (雷神) ---
export const ThunderGodStrike: React.FC<{
	text: string;
	fontSize?: number;
	color?: string;
	glowColor?: string;
}> = ({ text, fontSize = 100, color = "#00ffff", glowColor = "#0099ff" }) => {
	const frame = useCurrentFrame();

	const strike = frame > 10;
	const flash = frame > 10 && frame < 15 ? 1 : 0;

	return (
		<div style={{ position: "relative" }}>
			{frame < 20 && (
				<div
					style={{
						position: "absolute",
						top: -100,
						left: "50%",
						width: 200,
						height: 400,
						transform: "translateX(-50%)",
					}}
				>
					<LightningBolt color={color} intensity={2} thickness={5} />
				</div>
			)}

			{flash > 0 && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "1000%",
						height: "1000%",
						background: "#fff",
						opacity: 0.8,
						pointerEvents: "none",
					}}
				/>
			)}

			<div
				style={{
					fontSize,
					fontWeight: 900,
					color: "#fff",
					opacity: strike ? 1 : 0,
					transform: `scale(${strike ? 1 : 1.5})`,
					filter: `drop-shadow(0 0 ${random(frame) * 20}px ${color})`,
					textShadow: `0 0 10px ${glowColor}`,
					willChange: "transform, filter",
				}}
			>
				{text}
			</div>

			{strike &&
				Array.from({ length: 5 }).map((_, i) => {
					const key = `spark-${i}`;
					return (
						<div
							key={key}
							style={{
								position: "absolute",
								left: `${random(frame + i) * 100}%`,
								top: `${random(frame + i + 10) * 100}%`,
								width: 10,
								height: 1,
								background: color,
								transform: `rotate(${random(i) * 360}deg)`,
								opacity: random(frame + i) > 0.8 ? 1 : 0,
							}}
						/>
					);
				})}
		</div>
	);
};
