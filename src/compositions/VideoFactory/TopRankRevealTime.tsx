import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Confetti } from "../../components/effects/Confetti";
import { LensFlare } from "../../components/effects/LensFlare";
import { LightningBolt } from "../../components/effects/LightningBolt";
import { ImpactEffect } from "./ImpactEffect"; // Re-added
import { TimeBackground } from "./TimeBackground";
import type { Liver } from "./types";

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankRevealTime: React.FC<Props> = ({ rank, liver, title }) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// --- 1. "Time Warp" Entrance Animation ---
	// Camera flies IN from huge scale (10x) to 1x
	// Also rotates slightly for a disorienting "warp" feel
	const entrance = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 100, mass: 1 },
	});
	
	const scale = interpolate(entrance, [0, 1], [10, 1]);
	const warpRotate = interpolate(entrance, [0, 1], [-45, 0]);
	const contentOpacity = interpolate(entrance, [0, 0.5], [0, 1]);

	// --- 2. Color & Texture Logic (Gold, Silver, Bronze) ---
	const getRankColors = (r: number) => {
		if (r === 1) return { primary: "#FFD700", secondary: "#DAA520", overlay: "#ffd700", textClass: "metallic-gold" };
		if (r === 2) return { primary: "#C0C0C0", secondary: "#708090", overlay: "#a9a9a9", textClass: "metallic-silver" };
		if (r === 3) return { primary: "#CD7F32", secondary: "#8B4513", overlay: "#8b4513", textClass: "metallic-bronze" };
		return { primary: "#fff", secondary: "#ccc", overlay: "#fff", textClass: "" };
	};

	const { primary, secondary, overlay, textClass } = getRankColors(rank);

	// God Rays rotation
	const rayRotate = frame * 0.5;

	return (
		<AbsoluteFill
			style={{
				justifyContent: "center",
				alignItems: "center",
				fontFamily: '"Impact", "Helvetica Neue", Arial, sans-serif',
				color: "white",
				backgroundColor: "#000", // Start with black, but TimeBackground covers it
				overflow: "hidden",
			}}
		>
			{/* --- 3. UNIFIED BACKGROUND (TimeBackground with Tint) --- */}
			<AbsoluteFill style={{ zIndex: 0 }}>
				{/* The overlayColor prop creates the Gold/Silver/Bronze tint while keeping the Blue theme */}
				<TimeBackground overlayColor={overlay} />
			</AbsoluteFill>

			{/* --- 4. GOD RAYS (Rotating Pillars of Light) --- */}
			<AbsoluteFill style={{ 
				zIndex: 1, 
				mixBlendMode: "screen",
				opacity: 0.6,
				transform: `scale(${interpolate(entrance, [0, 1], [0, 1])})`, // Grow with entrance
			}}>
				<div
					style={{
						position: 'absolute',
						top: -height,
						left: -width,
						width: width * 3,
						height: height * 3,
						background: `conic-gradient(from ${rayRotate}deg, 
							transparent 0deg, 
							${primary}40 15deg, 
							transparent 30deg, 
							${primary}40 45deg, 
							transparent 60deg, 
							${primary}40 75deg, 
							transparent 90deg, 
							${primary}40 105deg,
							transparent 120deg,
							${primary}40 135deg,
							transparent 150deg
						)`,
						filter: 'blur(100px)',
					}}
				/>
			</AbsoluteFill>

			{/* Huge Background Number (Subtle) */}
			<div
				style={{
					position: "absolute",
					fontSize: 800,
					fontWeight: 900,
					opacity: 0.1,
					color: primary,
					zIndex: 2,
					transform: `translateZ(-500px)`,
					mixBlendMode: "overlay",
				}}
			>
				{rank}
			</div>

			{/* --- 5. MAIN CONTENT (Flying In) --- */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					zIndex: 10,
					transform: `scale(${scale}) rotate(${warpRotate}deg)`,
					opacity: contentOpacity,
					transformOrigin: "center center",
				}}
			>
				{/* RANK TITLE (1位, 2位, 3位) - Metallic Texture */}
				<div style={{ position: "relative", marginBottom: 40 }}>
					{/* Intense Glow behind text */}
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: "120%",
							height: "120%",
							background: `radial-gradient(circle, ${primary}cc 0%, transparent 70%)`,
							filter: "blur(40px)",
							zIndex: -1,
						}}
					/>
					<h2
						className={textClass} // Uses CSS metallic sheen
						style={{
							fontSize: 350,
							margin: 0,
							lineHeight: 0.8,
							textShadow: `0 10px 50px ${primary}`, // Extra glow
							transform: "scale(1.2)", 
						}}
					>
						{title}
					</h2>
				</div>

				{/* LIVER ICON with "Time Ring" Border */}
				<div
					style={{
						position: "relative",
						width: 600,
						height: 600,
						marginBottom: 50,
					}}
				>
					{/* Outer Ring (Rotating) */}
					<div style={{
						position: "absolute",
						inset: -30,
						borderRadius: "50%",
						border: `4px dashed ${primary}`,
						transform: `rotate(${frame * 0.5}deg)`,
						boxShadow: `0 0 30px ${primary}`,
						opacity: 0.8,
					}} />
					
					{/* Inner Ring (Counter-Rotating) */}
					<div style={{
						position: "absolute",
						inset: -15,
						borderRadius: "50%",
						border: `2px solid ${secondary}`,
						transform: `rotate(${-frame * 0.8}deg)`,
						opacity: 0.6,
					}} />

					{/* Icon Container */}
					<div
						style={{
							width: "100%",
							height: "100%",
							borderRadius: "50%",
							border: `10px solid white`,
							overflow: "hidden",
							boxShadow: `0 0 60px ${primary}, inset 0 0 40px rgba(0,0,0,0.5)`,
							backgroundColor: "#000",
						}}
					>
						{liver.saved_to && (
							<Img
								src={staticFile(
									`video-factory/images/icons/${liver.saved_to.split("/").pop()}`,
								)}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						)}
					</div>
				</div>

				{/* LIVER NAME */}
				<h1
					className={textClass}
					style={{
						fontSize: 100,
						fontWeight: 900,
						color: "white",
						margin: 0,
						textShadow: "0 5px 15px rgba(0,0,0,0.8)",
						fontFamily: '"Inter", sans-serif',
						letterSpacing: "0.05em",
					}}
				>
					{liver.nickname}
				</h1>
			</div>

			{/* --- 6. FRONT FOREGROUND EFFECTS --- */}
			
			{/* Rank 1: Lightning & Sparks */}
			{rank === 1 && (
				<AbsoluteFill style={{ zIndex: 20, mixBlendMode: "screen", opacity: 0.8 }}>
					<LightningBolt color="#FFD700" thickness={4} />
				</AbsoluteFill>
			)}

			{/* Confetti Explosion & Impact on Entry */}
			{/* Impact Effect helps sell the "slam" when the warp ends (around frame 15-20 approx, depending on spring) */}
			<AbsoluteFill style={{ zIndex: 100, pointerEvents: "none" }}>
				<ImpactEffect 
					color={primary} 
					intensity={rank === 1 ? "high" : "normal"} 
				/>
			</AbsoluteFill>

			<AbsoluteFill style={{ zIndex: 15, pointerEvents: "none" }}>
				<Confetti
					colors={[primary, "#FFFFFF", secondary]}
					count={rank === 1 ? 300 : 150}
				/>
			</AbsoluteFill>

			{/* Global Flash on Entry (Frame 0-5) */}
			<AbsoluteFill
				style={{
					backgroundColor: "white",
					opacity: interpolate(frame, [0, 5], [1, 0]),
					zIndex: 100,
					mixBlendMode: "overlay",
				}}
			/>

			{/* Lens Flare Overlay - removed invalid position prop */}
			<AbsoluteFill style={{ zIndex: 30, pointerEvents: "none" }}>
				<LensFlare
					opacity={0.8}
					scale={rank === 1 ? 2.0 : 1.5}
					color={primary}
					intensity={1.5}
				/>
			</AbsoluteFill>

		</AbsoluteFill>
	);
};
