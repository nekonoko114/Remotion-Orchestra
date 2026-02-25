import React, { useEffect, useMemo, useRef } from "react";
import {
	AbsoluteFill,
	interpolate,
	random,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { useBeatValue } from "./utils/beat-sync";

// Verified build status

const TRAIL_COUNT = 20;
const MUSIC_SYMBOL_COUNT = 10; // Reduced count because icons are larger now
const SPRITE_ROWS = 3;
const SPRITE_COLS = 3;
const BPM = 160;

interface LightTrail {
	x: number;
	y: number;
	z: number;
	speedZ: number;
	length: number;
	color: string;
	width: number;
}

interface MusicParticle {
	x: number;
	y: number;
	rotation: number;
	rotationSpeed: number;
	scale: number;
	seed: number; 
	floatOffset: number; 
}

interface Props {
	particleCount?: number;
	overlayColor?: string; // Optional tint for Top 3 (Gold/Silver/Bronze)
	hideBackground?: boolean; // New: Skip the solid gradient background
	hideBaseVideo?: boolean; // New: Skip the underlying video (byakko) for performance or custom bg
}

export const TimeBackground: React.FC<Props> = ({ particleCount = 20, overlayColor, hideBackground, hideBaseVideo = false }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);
	const { width, height } = useVideoConfig();
	const frame = useCurrentFrame();

	// Load the 3x3 grid music icons image
	useEffect(() => {
		const img = new Image();
		img.src = staticFile("video-factory/images/neon_instruments_grid.png");
		img.onload = () => {
			imageRef.current = img;
		};
	}, []);

	const trails = useMemo(() => {
		const t: LightTrail[] = [];
		for (let i = 0; i < TRAIL_COUNT; i++) {
			const isRed = random(`color-${i}`) < 0.7;
			t.push({
				x: (random(`x-${i}`) - 0.5) * width * 4,
				y: (random(`y-${i}`) - 0.5) * height * 4,
				z: random(`z-${i}`) * 5000,
				speedZ: random(`sz-${i}`) * 60 + 40,
				length: random(`len-${i}`) * 1200 + 800,
				color: isRed ? "#d000ff" : "#a200ff",
				width: random(`w-${i}`) * 3 + 1,
			});
		}
		return t;
	}, [width, height]);

	const musicParticles = useMemo(() => {
		const p: MusicParticle[] = [];
		for (let i = 0; i < MUSIC_SYMBOL_COUNT; i++) {
			p.push({
				x: random(`mx-${i}`) * width,
				y: random(`my-${i}`) * height,
				rotation: random(`rot-${i}`) * Math.PI * 2,
				rotationSpeed: (random(`rs-${i}`) - 0.5) * 0.01,
				scale: random(`sc-${i}`) * 0.5 + 0.5, 
				seed: i,
				floatOffset: random(`float-${i}`) * Math.PI * 2,
			});
		}
		return p;
	}, [width, height]);

	const { pulse } = useBeatValue(BPM);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, width, height);
		const fov = 1000;
		const centerX = width / 2;
		const centerY = height / 2;

		// 1. Draw Light Trails
		ctx.globalCompositeOperation = "screen";
		trails.forEach((t) => {
			// Pulse speed on beats - highly moderated
			const beatSpeed = t.speedZ * (1 + pulse * 0.01);
			let currZ = (t.z - frame * beatSpeed) % 5000;
			if (currZ < 0) currZ += 5000;

			const alpha = interpolate(currZ, [0, 800, 4000, 5000], [0, 0.3, 0.3, 0]);
			if (alpha <= 0) return;

			// Pulse width on beats - highly moderated
			ctx.lineWidth = t.width * (1 + pulse * 0.01);
			ctx.strokeStyle = t.color;
			ctx.globalAlpha = alpha;

			ctx.beginPath();
			for (let j = 0; j < 4; j++) {
				const segmentZ = currZ + j * (t.length / 4);
				const scaleFactor = fov / (fov + segmentZ);
				ctx.lineTo(centerX + t.x * scaleFactor, centerY + t.y * scaleFactor);
			}
			ctx.stroke();
		});

		// 2. Draw Music Icons with Floating "Neon Card" Style
		const icons = imageRef.current;
		if (icons) {
			const spriteW = icons.width / SPRITE_COLS;
			const spriteH = icons.height / SPRITE_ROWS;

			musicParticles.forEach((p) => {
				// Pure 2D Drifting and Floating
				const driftX = Math.sin(frame * 0.00005 + p.floatOffset) * 50;
				const driftY = Math.cos(frame * 0.0005 + p.floatOffset) * 30;
				const bobY = Math.sin(frame * 0.0002 + p.floatOffset) * 40;
				
				const screenX = p.x + driftX;
				const screenY = p.y + driftY + bobY;
				
				// Larger size for visibility, pulse on beat - minimal
				const size = 180 * p.scale * (1 + pulse * 0.005); 

				// Morph/Glitch Selection - faster on beats
				const glitchSpeed = Math.max(5, 45 * (1 - pulse)); 
				const timeSeed = Math.floor((frame + p.seed * 10) / glitchSpeed);
				const symbolIndex = Math.floor(random(`morph-${timeSeed}-${p.seed}`) * (SPRITE_ROWS * SPRITE_COLS));
				
				const col = symbolIndex % SPRITE_COLS;
				const row = Math.floor(symbolIndex / SPRITE_COLS);

				ctx.save();
				// Pulse alpha on beat - minimal
				ctx.globalAlpha = (0.55 + Math.sin(frame * 0.03 + p.floatOffset) * 0.1) * (1 + pulse * 0.01);
				ctx.translate(screenX, screenY);
				ctx.rotate(p.rotation + frame * p.rotationSpeed);
				
				// a. Elegant Dark Card Background (No Border)
				ctx.globalCompositeOperation = "source-over";
				ctx.fillStyle = "rgba(5, 10, 25, 0.5)"; 
				ctx.fillRect(-size / 2, -size / 2, size, size);

						// filter: `contrast(1.1) brightness(${1.1 + pulse * 0.2}) saturate(${1.1 + pulse * 0.2})`, // Canvas filter removed
						// globalCompositeOperation: "screen" // Removed
						ctx.globalCompositeOperation = "source-over"; // Explicitly standard
						ctx.drawImage(
							icons,
							col * spriteW, row * spriteH, spriteW, spriteH,
							-size / 2, -size / 2, size, size
						);
						
						ctx.restore();
					});
				}
		
			}, [frame, width, height, trails, musicParticles, pulse]);
		
			const formatDigits = (val: number) => val.toString().padStart(2, "0");
			const hours = formatDigits(Math.floor(frame / 3600) % 24);
			const mins = formatDigits(Math.floor(frame / 60) % 60);
			const secs = formatDigits(frame % 60);
			const ms = formatDigits(Math.floor((frame % 30) * 3.33));
		
			const timerPulse = 0.1 + pulse * 0.05;
		
			return (
				<AbsoluteFill>
					{!hideBackground && (
						<AbsoluteFill style={{ 
							background: "black" 
						}} />
					)}
					{/* CENTRAL GLOW - Pulses with music */}
					<AbsoluteFill
						style={{
							background: `radial-gradient(circle, rgba(208, 0, 255, ${0.2 + pulse * 0.1}) 0%, transparent 70%)`,
							pointerEvents: "none",
						}}
					/>
		
					{/* Large Timer Background */}
					<AbsoluteFill
						style={{
							justifyContent: "center",
							alignItems: "center",
							opacity: timerPulse,
							pointerEvents: "none",
						}}
					>
						<div
							style={{
								fontSize: 500,
								fontWeight: 900,
								fontFamily: "Impact, sans-serif",
								color: "#d000ff",
								// filter: `blur(${3 - pulse * 1}px) drop-shadow(0 0 ${30 + pulse * 30}px #00f0ff)`, // REMOVED
								letterSpacing: "-0.05em",
								transform: `scale(${1.3 + pulse * 0.005}) skewX(-10deg)`,
								whiteSpace: "nowrap",
							}}
						>
							{hours}:{mins}:{secs}:{ms}
						</div>
					</AbsoluteFill>
		
					<canvas
						ref={canvasRef}
						width={width}
						height={height}
						style={{ width: "100%", height: "100%" }}
					/>
		
					{/* Audio Visualizer Style Lines (Bottom) - Driven by pulse */}
			<AbsoluteFill style={{ top: "auto", height: 300, bottom: 50, opacity: 0.6 }}> {/* Increased opacity */}
				<div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: "100%", padding: "0 100px" }}>
					{Array.from({ length: 40 }).map((_, i) => {
						const h = interpolate(Math.sin(frame * 0.1 + i), [-1, 1], [15, 100]) * (1 + pulse * 0.02);
						return (
							<div key={i} style={{ 
								flex: 1, 
								height: h, 
								background: `linear-gradient(to top, #d000ff, transparent)`,
								// Efficient simple box shadow on container or use simple border
								borderTop: "2px solid rgba(208, 0, 255, 0.5)", 
								borderRadius: "10px 10px 0 0",
                                transition: "height 0.1s ease-out"
							}} />
						);
					})}
				</div>
			</AbsoluteFill>

			{/* ADDED: Global Neon Overlay - Efficient "Glow" for everything */}
			<AbsoluteFill style={{
				background: `radial-gradient(circle at 50% 50%, rgba(208, 0, 255, 0.15) 0%, transparent 70%)`,
				mixBlendMode: "screen", // Global blend is okay, per-particle is bad
				pointerEvents: "none",
				zIndex: 5,
			}} />
			
			{/* ADDED: Scanline effect for "Cyber" feel (very lightweight) */}
			<AbsoluteFill style={{
				background: "linear-gradient(to bottom, rgba(208,0,255,0.03) 50%, transparent 50%)",
				backgroundSize: "100% 4px",
				pointerEvents: "none",
				zIndex: 6,
			}} />

			<AbsoluteFill
				style={{
					background: "radial-gradient(circle, transparent 20%, rgba(0,0,0,0.7) 100%)",
					pointerEvents: "none",
				}}
			/>

			{/* Optional Tint Overlay for Ranks */}
			{overlayColor && (
				<AbsoluteFill
					style={{
						backgroundColor: overlayColor,
						opacity: 0.3,
					}}
				/>
			)}
		</AbsoluteFill>
	);
};
