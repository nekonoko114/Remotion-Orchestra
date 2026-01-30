import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig, Img, staticFile, Easing, Audio, random } from "remotion";
import { WaterBattleBackground } from "./WaterBattleBackground";
import { useBeatValue } from "./utils/beat-sync";
import { ImpactShockwave } from "../../components/effects/ImpactShockwave";
import { ThunderGodStrike } from "../../components/effects/UltraText";
import { LensFlare } from "../../components/effects/LensFlare";
import { ZoomBlurTransition } from "../../components/transitions/ZoomBlurTransition";
import { HolographicHUD } from "../../components/effects/HolographicHUD";

// --- BEAT SYNC SETTINGS ---
const BPM = 132; 
const BEATS_PER_MEASURE = 4;

// --- Types ---
interface BattlePlayer {
	name: string;
	id: string;
	image: string;
	color: string;
	glowColor: string;
}

const MOCK_JOL_PLAYER: BattlePlayer = {
	name: "J.O.L Creator",
	id: "jol_creator_01",
	image: staticFile("video-factory/images/logo/logo.png"), 
	color: "#00E5FF", // Cyan Water
	glowColor: "#00B0FF",
};

const MOCK_OPPONENT: BattlePlayer = {
	name: "Ocean Queen",
	id: "ocean_queen_77",
	image: staticFile("video-factory/images/logo/logo.png"),
	color: "#1DE9B6", // Turquoise
	glowColor: "#00BFA5",
};

// --- Sub-Components ---

const BubbleAura: React.FC<{ color: string; pulse: number }> = ({ color, pulse }) => {
	const scale = 1 + pulse * 0.3;
	const opacity = 0.4 + pulse * 0.3;
	return (
		<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 0 }}>
			{/* Water Ripple Layer */}
			<div style={{
				width: 550,
				height: 550,
				borderRadius: "50%",
				border: `4px solid ${color}`,
				transform: `scale(${scale})`,
				opacity: opacity * 0.5,
				filter: "blur(4px)",
				boxShadow: `0 0 30px ${color}`,
			}} />
			{/* Expanding Ring */}
			<div style={{
				width: 600,
				height: 600,
				borderRadius: "50%",
				border: `2px solid white`,
				transform: `scale(${1 + pulse * 0.6})`,
				opacity: pulse * 0.4,
				filter: "blur(2px)",
			}} />
		</AbsoluteFill>
	);
};

const UnderwaterHazeOverlay: React.FC = () => {
	return (
		<AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
			{/* Blue Haze / Depth Fog */}
			<div style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				background: "radial-gradient(circle, transparent 20%, rgba(0, 100, 255, 0.15) 100%)",
				mixBlendMode: "overlay"
			}} />
			{/* Floating Particles (Dust/Plankton) */}
			<div style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				backgroundImage: `url("https://www.transparenttextures.com/patterns/p5.png")`,
				opacity: 0.1,
				filter: "brightness(2) contrast(1.5)",
				mixBlendMode: "screen",
				transform: `translateY(${Math.sin(useCurrentFrame() / 30) * 20}px)`
			}} />
			{/* Water Distortion Layer (Gooey effect) */}
			<svg style={{ position: "absolute", width: 0, height: 0 }}>
				<filter id="liquid-distortion">
					<feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="3" seed={Math.floor(useCurrentFrame() / 2)}>
						<animate attributeName="baseFrequency" values="0.01 0.02;0.015 0.025;0.01 0.02" dur="5s" repeatCount="indefinite" />
					</feTurbulence>
					<feDisplacementMap in="SourceGraphic" scale="20" />
				</filter>
			</svg>
		</AbsoluteFill>
	);
};

const WaterSplashShards: React.FC<{ frame: number }> = ({ frame }) => {
	const shards = Array.from({ length: 15 }).map((_, i) => {
		const seed = `water-shard-${i}`;
		const angle = random(`${seed}-angle`) * Math.PI * 2;
		const distance = interpolate(frame, [0, 20], [0, 700], { easing: Easing.out(Easing.cubic) });
		const x = Math.cos(angle) * distance;
		const y = Math.sin(angle) * distance;
		const rotation = interpolate(frame, [0, 20], [0, 180]);
		const opacity = interpolate(frame, [15, 20], [0.8, 0]);
		const scale = random(`${seed}-scale`) * 0.8 + 0.2;

		return (
			<div
				key={i}
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: 30,
					height: 30,
					backgroundColor: "rgba(255, 255, 255, 0.7)",
					borderRadius: "50%",
					boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
					transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
					opacity,
					filter: "blur(2px)",
					border: "1px solid rgba(255, 255, 255, 0.9)"
				}}
			/>
		);
	});

	return <AbsoluteFill style={{ pointerEvents: "none" }}>{shards}</AbsoluteFill>;
};

const WaterCard: React.FC<{
	player: BattlePlayer;
	frame: number;
	direction: "left" | "right";
	pulse?: number;
}> = ({ player, frame, direction, pulse = 0 }) => {
	const { fps } = useVideoConfig();
	
	// Stage 1: The "Surface" Spring (Main Entry)
	const entrySpr = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 60 },
	});

	// Stage 2: Liquid Bounce (Scale)
	const bounceSpr = spring({
		frame: frame - 5,
		fps,
		config: { damping: 10, stiffness: 100 },
	});

	// Visual Parameters
	const scale = interpolate(bounceSpr, [0, 1], [0.4, 1], { easing: Easing.out(Easing.back(1.5)) });
	const zIndex = interpolate(entrySpr, [0, 1], [-500, 0]); // Simulate depth
	const blur = interpolate(entrySpr, [0, 0.8, 1], [20, 5, 0]);
	const brightness = interpolate(entrySpr, [0, 1], [0.3, 1]);
	const opacity = interpolate(entrySpr, [0, 0.3], [0, 1]);
	
	// Movement
	const floatY = Math.sin(frame / 30 + (direction === "left" ? 0 : Math.PI)) * 25;
	const orbitalX = Math.cos(frame / 40) * 15;
	const rotation = interpolate(entrySpr, [0, 1], [direction === "left" ? -15 : 15, 0]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				transform: `perspective(1000px) translateZ(${zIndex}px) translateY(${floatY}px) translateX(${orbitalX}px) rotateY(${rotation}deg) scale(${scale})`,
				opacity,
				filter: `blur(${blur}px) brightness(${brightness})`,
				position: "relative"
			}}
		>
			<BubbleAura color={player.color} pulse={pulse} />
			
			<div
				style={{
					width: 500, 
					height: 500,
					borderRadius: "50%",
					border: `10px solid white`,
					boxShadow: `0 0 60px ${player.color}aa, inset 0 0 30px white`,
					overflow: "hidden",
					backgroundColor: "#002a4d",
					position: "relative",
					zIndex: 1
				}}
			>
				<AbsoluteFill style={{ scale: "1.3", opacity: 0.3 }}>
					<HolographicHUD color={player.color} />
				</AbsoluteFill>
				<Img
					src={player.image}
					style={{ 
						width: "100%", 
						height: "100%", 
						objectFit: "cover", 
						zIndex: 1, 
					}}
				/>
				{/* Caustics Light Overlay */}
				<AbsoluteFill
					style={{
						background: `radial-gradient(circle at ${50 + Math.sin(frame/20)*20}% ${50 + Math.cos(frame/20)*20}%, rgba(255,255,255,0.4), transparent 70%)`,
						mixBlendMode: "overlay",
						zIndex: 2
					}}
				/>
				<AbsoluteFill
					style={{
						background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent 50%, rgba(0,0,0,0.3) 100%)",
						zIndex: 3
					}}
				/>
			</div>
			<div style={{ 
				marginTop: 20, 
				textAlign: "center",
				padding: "10px 50px",
				background: "rgba(255,255,255,0.2)",
				borderRadius: 50,
				backdropFilter: "blur(15px)",
				border: "2px solid white",
				width: 550,
				zIndex: 2,
				boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
			}}>
				<h2 style={{
					fontSize: 50,
					margin: 0,
					color: "white",
					fontFamily: "Impact",
					letterSpacing: 3,
					textShadow: `0 0 10px ${player.glowColor}`,
				}}>
					{player.name}
				</h2>
			</div>
		</div>
	);
};

// --- Water Ripple Transition Component ---
const WaterWaveTransition: React.FC<{ frame: number; children: React.ReactNode }> = ({ frame, children }) => {
	const progress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
	
	// Create a wave distortion effect using SVG displacement
	// We'll use a expanding circle that distorts what's behind it
	const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
	const scale = interpolate(progress, [0, 1], [0.5, 2]);
	const blur = interpolate(progress, [0, 0.5, 1], [0, 10, 0]);

	return (
		<AbsoluteFill>
			<div style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				filter: `blur(${blur}px)`,
				opacity: interpolate(progress, [0, 0.2], [0, 1]),
			}}>
				{children}
			</div>
			{/* The Wave Overly */}
			<AbsoluteFill style={{ 
				justifyContent: "center", 
				alignItems: "center",
				pointerEvents: "none",
				zIndex: 100
			}}>
				<div style={{
					width: 800,
					height: 800,
					borderRadius: "50%",
					border: `${interpolate(progress, [0, 1], [100, 0])}px solid rgba(255, 255, 255, 0.4)`,
					transform: `scale(${scale})`,
					opacity,
					filter: "blur(20px)",
					boxShadow: "inset 0 0 50px rgba(0, 229, 255, 0.5)",
				}} />
				{/* Flash of brilliance on peak */}
				<AbsoluteFill style={{
					backgroundColor: "white",
					opacity: interpolate(progress, [0, 0.2, 0.5], [0, 0.4, 0]),
					mixBlendMode: "screen"
				}} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const VsClashAura: React.FC<{ pulse: number; frame: number }> = ({ pulse, frame }) => {
	const intensity = 0.5 + pulse * 0.4;
	return (
		<AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
			{/* Left Side: Deep Purple Energy */}
			<div style={{
				position: "absolute",
				left: "-15%",
				width: "75%",
				height: "100%",
				background: `radial-gradient(ellipse at 30% 50%, rgba(147, 51, 234, ${intensity}) 0%, transparent 85%)`,
				mixBlendMode: "screen",
				filter: "blur(90px)",
				opacity: 0.8
			}} />
			{/* Right Side: Emerald Green Energy */}
			<div style={{
				position: "absolute",
				right: "-15%",
				width: "75%",
				height: "100%",
				background: `radial-gradient(ellipse at 70% 50%, rgba(0, 255, 127, ${intensity}) 0%, transparent 85%)`,
				mixBlendMode: "screen",
				filter: "blur(90px)",
				opacity: 0.8
			}} />

			{/* Center Beam Overlay */}
			<div style={{
				position: "absolute",
				left: "45%",
				width: "10%",
				height: "100%",
				background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
				filter: "blur(20px)",
				opacity: pulse * 0.5,
				mixBlendMode: "overlay"
			}} />
		</AbsoluteFill>
	);
};

// --- Main Composition ---

export const BattleWater: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width } = useVideoConfig();

	// --- OTOHAME LOGIC ---
	const { pulse, framesPerBeat } = useBeatValue(BPM);
	const measureFrames = framesPerBeat * BEATS_PER_MEASURE;

	const OP_DURATION = 2 * measureFrames;      
	const JOL_INTRO_DURATION = 3 * fps; // Exactly 3 seconds
	const OPPONENT_INTRO_DURATION = 3 * fps; // Exactly 3 seconds
	const MATCHUP_DURATION = 3 * measureFrames;
	const VS_RULES_DURATION = 2 * measureFrames; 
	const END_DURATION = 3 * fps; 

	const startJol = OP_DURATION;
	const startOpponent = startJol + JOL_INTRO_DURATION;
	const startMatchup = startOpponent + OPPONENT_INTRO_DURATION;
	const startVs = startMatchup + MATCHUP_DURATION;
	const startEnd = startVs + VS_RULES_DURATION;

	// Visual Beats FX
	// pulse is at 132 BPM. For mystical feel, let's use a smoother curve
	const softPulse = Math.pow(pulse, 2); // Sharper but shorter peak
	const halfPulse = (frame % (framesPerBeat * 2)) / (framesPerBeat * 2); // 2-beat cycle for slower motion
	
	const flashOpacity = interpolate(softPulse, [0, 1], [0, 0.1]); 
	const screenBeatScale = 1; // Keep fixed per user request
	const beatBrightness = 1 + softPulse * 0.05; // More subtle pulse

	return (
		<AbsoluteFill style={{ 
			backgroundColor: "#001a33",
			transform: `scale(${screenBeatScale})`,
			filter: `brightness(${beatBrightness})`, 
		}}>
			<UnderwaterHazeOverlay />

			{/* BACKGROUND LAYER */}
			<WaterBattleBackground />

			<Audio
				src={staticFile("assets/audio/music/タクティカルエンカウンター.mp3")} 
				volume={0.6}
				loop
			/>

			{/* 1. OPENING */}
			<Sequence durationInFrames={OP_DURATION}>
				<ZoomBlurTransition type="in" duration={20}>
					<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
						<h1 style={{
							fontSize: 200,
							color: "white",
							fontFamily: "Impact",
							letterSpacing: 15,
							textShadow: "0 0 30px #00E5FF, 0 10px 50px rgba(0,0,0,0.5)",
							textAlign: "center",
							margin: 0,
							lineHeight: 1.1,
							filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
							transform: `translateY(${Math.sin(frame / 15) * 10}px)`
						}}>
							DEEP BLUE<br />BATTLE
						</h1>
					</AbsoluteFill>
				</ZoomBlurTransition>
			</Sequence>

			{/* 2. JOL REVEAL */}
			<Sequence from={startJol} durationInFrames={JOL_INTRO_DURATION}>
				<ZoomBlurTransition type="in" duration={20}>
					<WaterWaveTransition frame={frame - startJol}>
						<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
							<WaterCard player={MOCK_JOL_PLAYER} frame={frame - startJol} direction="left" pulse={halfPulse} />
						</AbsoluteFill>
					</WaterWaveTransition>
				</ZoomBlurTransition>
			</Sequence>

			{/* 3. OPPONENT REVEAL */}
			<Sequence from={startOpponent} durationInFrames={OPPONENT_INTRO_DURATION}>
				<ZoomBlurTransition type="in" duration={20}>
					<WaterWaveTransition frame={frame - startOpponent}>
						<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
							<WaterCard player={MOCK_OPPONENT} frame={frame - startOpponent} direction="right" pulse={halfPulse} />
						</AbsoluteFill>
					</WaterWaveTransition>
				</ZoomBlurTransition>
			</Sequence>

			{/* 4. MATCH-UP (VS Scene) */}
			<Sequence from={startMatchup} durationInFrames={MATCHUP_DURATION}>
				<AbsoluteFill>
					<VsClashAura pulse={pulse} frame={frame} />
					
					{/* Water Splash on VS impact */}
					{frame - startMatchup >= 10 && frame - startMatchup < 35 && (
						<WaterSplashShards frame={frame - startMatchup - 10} />
					)}

					<AbsoluteFill style={{
						transform: frame - startMatchup >= 10 && frame - startMatchup < 20 
							? `scale(${1.05 + Math.sin(frame) * 0.02}) rotate(${Math.sin(frame / 2) * 1}deg)`
							: "scale(1)"
					}}>
						{/* TOP: JOL */}
						<div style={{ 
							position: "absolute", 
							top: "8%", 
							left: 0, 
							right: 0, 
							display: "flex", 
							justifyContent: "center",
							transform: "scale(0.6)"
						}}>
							<WaterCard player={MOCK_JOL_PLAYER} frame={frame - startMatchup} direction="left" pulse={softPulse} />
							{frame - startMatchup === 5 && <ImpactShockwave color="#00E5FF" />}
						</div>

						{/* CENTER: VS */}
						<AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
							<Sequence from={10} layout="none">
								<ThunderGodStrike text="VS" fontSize={260} color="#00E5FF" glowColor="#00B0FF" />
							</Sequence>
						</AbsoluteFill>

						{/* BOTTOM: OPPONENT */}
						<div style={{ 
							position: "absolute", 
							bottom: "8%", 
							left: 0, 
							right: 0, 
							display: "flex", 
							justifyContent: "center",
							transform: "scale(0.6)"
						}}>
							<WaterCard player={MOCK_OPPONENT} frame={frame - startMatchup} direction="right" pulse={softPulse} />
							{frame - startMatchup === 15 && <ImpactShockwave color="#1DE9B6" />}
						</div>
					</AbsoluteFill>
				</AbsoluteFill>
			</Sequence>

			{/* 5. RULES */}
			<Sequence from={startVs} durationInFrames={VS_RULES_DURATION}>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<div style={{
						position: "absolute",
						top: "15%",
						textAlign: "center",
						width: "100%",
						opacity: interpolate(frame - startVs, [0, 15], [0, 1]),
					}}>
						<h3 style={{ fontSize: 90, color: "#ffffff", fontFamily: "Impact", margin: 0 }}>EVENT RULES</h3>
						<h2 style={{ fontSize: 110, color: "#00E5FF", fontFamily: "Impact", margin: "10px 0 0 0" }}>AQUARIUM MODE</h2>
					</div>

					<div style={{ 
						position: "absolute", 
						top: "42%", 
						width: "100%", 
						display: "flex", 
						flexDirection: "column", 
						alignItems: "center", 
						gap: 30 
					}}>
						{["NO BUBBLES", "DEEP DIVE", "PEARL HUNT", "TIDAL WAVE"].map((rule, i) => {
							const ruleFrame = frame - startVs - (i * 8);
							const ruleSpr = spring({ frame: ruleFrame, fps, config: { damping: 15, stiffness: 100 } });
							if (ruleFrame < 0) return null;
							return (
								<div key={rule} style={{
									background: "rgba(255, 255, 255, 0.15)",
									padding: "20px 80px", borderRadius: 100, border: "2px solid white", width: 750, textAlign: "center",
									transform: `translateX(${interpolate(ruleSpr, [0, 1], [width, 0])}px) translateY(${Math.sin(frame/10 + i)*10}px)`,
									boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)",
									backdropFilter: "blur(10px)"
								}}>
									<span style={{ color: "white", fontSize: 50, fontWeight: 900, fontFamily: "Impact" }}>
										🫧 {rule}
									</span>
								</div>
							);
						})}
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* 6. ENDING */}
			<Sequence from={startEnd} durationInFrames={END_DURATION}>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<AbsoluteFill style={{ zIndex: -1, opacity: 0.5 }}>
						<LensFlare />
					</AbsoluteFill>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
						<div style={{ opacity: interpolate(frame - startEnd, [0, 10], [0, 1]) }}>
							<p style={{ fontSize: 75, color: "#00E5FF", fontFamily: "Impact", letterSpacing: 5, margin: 0 }}>
								SINK OR SWIM
							</p>
						</div>
						<div style={{ 
							opacity: interpolate(frame - startEnd, [5, 25], [0, 1]), 
							transform: `scale(${interpolate(frame - startEnd, [5, 25], [0.5, 1], { easing: Easing.out(Easing.back(1.5)) })})`,
							margin: "40px 0"
						}}>
							<Img src={staticFile("video-factory/images/logo/logo.png")} style={{ width: 600, filter: "drop-shadow(0 0 30px #00E5FF)" }} />
						</div>
						<div style={{ opacity: interpolate(frame - startEnd, [15, 35], [0, 1]) }}>
							<h2 style={{ fontSize: 60, color: "white", fontWeight: 900 }}>海の底で待っている</h2>
						</div>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* OVERLAY FLASH (Blue-ish) */}
			<AbsoluteFill 
				style={{ 
					backgroundColor: "#00E5FF", 
					opacity: flashOpacity, 
					mixBlendMode: "overlay", 
					pointerEvents: "none" 
				}} 
			/>
		</AbsoluteFill>
	);
};
