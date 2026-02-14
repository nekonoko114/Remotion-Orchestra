import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig, Img, staticFile, Easing, Audio, random } from "remotion";
import { FireBackground } from "./FireBackground";
import { useBeatValue } from "./utils/beat-sync";
import { ImpactShockwave } from "../../components/effects/ImpactShockwave";
import { ThunderGodStrike } from "../../components/effects/UltraText";
import { LensFlare } from "../../components/effects/LensFlare";
import { CyberGrid } from "../../components/overlays/CyberGrid";
import { ZoomBlurTransition } from "../../components/transitions/ZoomBlurTransition";
import { HolographicHUD } from "../../components/effects/HolographicHUD";
import { LightningBolt } from "../../components/effects/LightningBolt";

// --- BEAT SYNC SETTINGS ---
const BPM = 124; 
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
	color: "#ff2000",
	glowColor: "#ff0000",
};

const MOCK_OPPONENT: BattlePlayer = {
	name: "Inferno Lord",
	id: "inferno_lord_666",
	image: staticFile("video-factory/images/logo/logo.png"),
	color: "#ffaa00",
	glowColor: "#ff5500",
};

// --- Sub-Components ---

const FireAura: React.FC<{ color: string; pulse: number }> = ({ color, pulse }) => {
	const scale = 1 + pulse * 0.5;
	const opacity = 0.4 + pulse * 0.5;
	return (
		<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 0 }}>
			<div style={{
				width: 550,
				height: 550,
				borderRadius: "50%",
				background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
				transform: `scale(${scale})`,
				opacity,
				filter: "blur(30px) contrast(1.5)",
				mixBlendMode: "screen"
			}} />
			<div style={{
				width: 600,
				height: 600,
				borderRadius: "50%",
				border: `4px solid ${color}`,
				transform: `scale(${1 + pulse * 0.3}) rotate(${pulse * 10}deg)`,
				opacity: pulse * 0.6,
				filter: "blur(8px)",
			}} />
		</AbsoluteFill>
	);
};

const HeatHazeOverlay: React.FC = () => {
	return (
		<AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
			{/* Scanlines / Noise */}
			<div style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				background: "linear-gradient(rgba(18, 10, 10, 0) 50%, rgba(20, 0, 0, 0.2) 50%)",
				backgroundSize: "100% 6px",
				opacity: 0.2
			}} />
			{/* Thermal Grain */}
			<div style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.webp")`,
				opacity: 0.1,
				filter: "sepia(1) saturate(5) hue-rotate(-30deg)",
				mixBlendMode: "overlay"
			}} />
		</AbsoluteFill>
	);
};

const FlyingShards: React.FC<{ frame: number }> = ({ frame }) => {
	const shards = Array.from({ length: 12 }).map((_, i) => {
		const seed = `shard-inferno-${i}`;
		const angle = random(`${seed}-angle`) * Math.PI * 2;
		const distance = interpolate(frame, [0, 15], [20, 1000], { easing: Easing.out(Easing.quad) });
		const x = Math.cos(angle) * distance;
		const y = Math.sin(angle) * distance;
		const rotation = interpolate(frame, [0, 15], [0, 720]);
		const opacity = interpolate(frame, [10, 15], [1, 0]);
		const scale = random(`${seed}-scale`) * 0.7 + 0.3;

		return (
			<div
				key={i}
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: 50,
					height: 30,
					backgroundColor: i % 2 === 0 ? "#ffaa00" : "#ff4400",
					clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
					transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
					opacity,
					filter: "blur(2px) drop-shadow(0 0 10px #ff0000)",
					border: "1px solid rgba(255, 255, 255, 0.4)"
				}}
			/>
		);
	});

	return <AbsoluteFill style={{ pointerEvents: "none" }}>{shards}</AbsoluteFill>;
};

const InfernoCard: React.FC<{
	player: BattlePlayer;
	frame: number;
	direction: "left" | "right";
	pulse?: number;
}> = ({ player, frame, direction, pulse = 0 }) => {
	const { fps } = useVideoConfig();
	const spr = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 120 },
	});

	const scale = interpolate(spr, [0, 1], [0.4, 1], { easing: Easing.out(Easing.back(1.5)) });
	const slide = interpolate(spr, [0, 1], [direction === "left" ? -600 : 600, 0]);
	const opacity = interpolate(spr, [0, 0.4], [0, 1]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				transform: `translateX(${slide}px) scale(${scale})`,
				opacity,
				position: "relative"
			}}
		>
			<FireAura color={player.color} pulse={pulse} />
			
			<div
				style={{
					width: 500, 
					height: 500,
					borderRadius: "50%",
					border: `12px solid ${player.color}`,
					boxShadow: `0 0 80px ${player.glowColor}aa, inset 0 0 40px ${player.glowColor}`,
					overflow: "hidden",
					backgroundColor: "#110000",
					position: "relative",
					zIndex: 1
				}}
			>
				<AbsoluteFill style={{ transform: "scale(1.5) rotate(45deg)", opacity: 0.5 }}>
					<CyberGrid color={player.color} />
				</AbsoluteFill>
				<Img
					src={player.image}
					style={{ 
						width: "100%", 
						height: "100%", 
						objectFit: "cover", 
						zIndex: 1, 
						filter: "contrast(1.2) saturate(1.2)" 
					}}
				/>
				<AbsoluteFill
					style={{
						background: `radial-gradient(circle, transparent 30%, ${player.color}44 100%)`,
						mixBlendMode: "overlay",
						zIndex: 2
					}}
				/>
			</div>
			<div style={{ 
				marginTop: 20, 
				textAlign: "center",
				padding: "15px 40px",
				background: "linear-gradient(45deg, #300, #900, #300)",
				borderRadius: 8,
				border: `2px solid ${player.color}`,
				width: 550,
				zIndex: 2,
				boxShadow: `0 10px 30px rgba(0,0,0,0.5)`
			}}>
				<h2 style={{
					fontSize: 60,
					margin: 0,
					color: "white",
					fontFamily: "Impact",
					textTransform: "uppercase",
					letterSpacing: 2,
					textShadow: `0 0 20px ${player.glowColor}, 0 0 40px ${player.glowColor}`,
				}}>
					{player.name}
				</h2>
			</div>
		</div>
	);
};

// --- Main Composition ---

export const BattleInferno: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width } = useVideoConfig();

	// --- OTOHAME LOGIC ---
	const { pulse, framesPerBeat } = useBeatValue(BPM);
	const measureFrames = framesPerBeat * BEATS_PER_MEASURE;

	const OP_DURATION = 2 * measureFrames;      
	const JOL_INTRO_DURATION = 3 * measureFrames; 
	const OPPONENT_INTRO_DURATION = 3 * measureFrames; 
	const MATCHUP_DURATION = 3 * measureFrames;
	const VS_RULES_DURATION = 2 * measureFrames; 
	const END_DURATION = 3 * fps; 

	const startJol = OP_DURATION;
	const startOpponent = startJol + JOL_INTRO_DURATION;
	const startMatchup = startOpponent + OPPONENT_INTRO_DURATION;
	const startVs = startMatchup + MATCHUP_DURATION;
	const startEnd = startVs + VS_RULES_DURATION;

	// --- Visual Beats FX ---
	const flashOpacity = interpolate(pulse, [0, 1], [0, 0.3]); 
	const screenBeatScale = 1 + pulse * 0.015;
	const beatRotation = interpolate(pulse, [0, 1], [0, (random(frame) - 0.5) * 3]);
	const invertAmount = interpolate(pulse, [0.85, 1], [0, 0.5], { extrapolateLeft: "clamp" });

	const glitchIntensity = pulse * 15;
	const gx = (random(`x-${frame}`) - 0.5) * glitchIntensity;
	const gy = (random(`y-${frame}`) - 0.5) * glitchIntensity;

	return (
		<AbsoluteFill style={{ 
			backgroundColor: "#100",
			transform: `scale(${screenBeatScale}) translate(${gx}px, ${gy}px) rotate(${beatRotation}deg)`,
			filter: `invert(${invertAmount}) brightness(${1 + pulse * 0.2}) contrast(${1 + pulse * 0.1})`
		}}>
			<HeatHazeOverlay />

			{/* BACKGROUND LAYER */}
			<FireBackground />

			<Audio
				src={staticFile("assets/audio/music/炎の挑戦.mp3")} 
				volume={0.7}
				loop
			/>

			{/* 1. OPENING */}
			<Sequence durationInFrames={OP_DURATION}>
				<ZoomBlurTransition type="in" duration={20}>
					<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
						<h1 style={{
							fontSize: 220,
							color: "#ffaa00",
							fontFamily: "Impact",
							letterSpacing: 10,
							textShadow: "0 0 50px #ff0000, 0 0 100px #ff0000",
							textAlign: "center",
							margin: 0,
							lineHeight: 1.1,
							transform: `scale(${1 + pulse * 0.1})`
						}}>
							INFERNO<br />BATTLE
						</h1>
					</AbsoluteFill>
				</ZoomBlurTransition>
			</Sequence>

			{/* 2. JOL REVEAL */}
			<Sequence from={startJol} durationInFrames={JOL_INTRO_DURATION}>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<InfernoCard player={MOCK_JOL_PLAYER} frame={frame - startJol} direction="left" pulse={pulse} />
				</AbsoluteFill>
			</Sequence>

			{/* 3. OPPONENT REVEAL */}
			<Sequence from={startOpponent} durationInFrames={OPPONENT_INTRO_DURATION}>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<InfernoCard player={MOCK_OPPONENT} frame={frame - startOpponent} direction="right" pulse={pulse} />
				</AbsoluteFill>
			</Sequence>

			{/* 4. MATCH-UP (VS Scene) */}
			<Sequence from={startMatchup} durationInFrames={MATCHUP_DURATION}>
				<AbsoluteFill>
					<AbsoluteFill style={{ opacity: pulse * 0.8 }}>
						<LightningBolt color="#ffaa00" intensity={2.0} />
					</AbsoluteFill>
					
					{/* Screen Crack & Shards */}
					{frame - startMatchup >= 10 && frame - startMatchup < 25 && (
						<>
							<FlyingShards frame={frame - startMatchup - 10} />
							<AbsoluteFill style={{ 
								mixBlendMode: "screen", 
								zIndex: 500,
								opacity: interpolate(frame - startMatchup - 10, [0, 2, 12], [0, 1, 0]) 
							}}>
								<Img src={staticFile("video-factory/images/vfx/screen_crack.png")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "invert(0.2) sepia(1) saturate(5) hue-rotate(-20deg)" }} />
							</AbsoluteFill>
						</>
					)}

					<AbsoluteFill style={{
						transform: frame - startMatchup >= 10 && frame - startMatchup < 18 
							? `scale(${1.1 + random(frame) * 0.1}) rotate(${(random(frame) - 0.5) * 5}deg)`
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
							<InfernoCard player={MOCK_JOL_PLAYER} frame={frame - startMatchup} direction="left" pulse={pulse} />
							{frame - startMatchup === 5 && <ImpactShockwave color="#ff0000" />}
						</div>

						{/* CENTER: VS */}
						<AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
							<Sequence from={10} layout="none">
								<ThunderGodStrike text="VS" fontSize={280} color="#ffaa00" glowColor="#ff0000" />
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
							<InfernoCard player={MOCK_OPPONENT} frame={frame - startMatchup} direction="right" pulse={pulse} />
							{frame - startMatchup === 15 && <ImpactShockwave color="#ffaa00" />}
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
						<h2 style={{ fontSize: 110, color: "#ffaa00", fontFamily: "Impact", margin: "10px 0 0 0" }}>HELL MODE ENABLED</h2>
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
						{["SURVIVAL", "NO MERCY", "HEAT LIMIT", "FINAL IMPACT"].map((rule, i) => {
							const ruleFrame = frame - startVs - (i * 8);
							const ruleSpr = spring({ frame: ruleFrame, fps, config: { damping: 15, stiffness: 200 } });
							if (ruleFrame < 0) return null;
							return (
								<div key={rule} style={{
									background: "linear-gradient(90deg, rgba(255,0,0,0.1), rgba(255,100,0,0.3), rgba(255,0,0,0.1))",
									padding: "20px 80px", borderRadius: 4, border: "2px solid #ff4400", width: 750, textAlign: "center",
									transform: `translateX(${interpolate(ruleSpr, [0, 1], [width, 0])}px)`,
									boxShadow: "0 0 30px rgba(255, 68, 0, 0.2)"
								}}>
									<span style={{ color: "white", fontSize: 60, fontWeight: 900, fontFamily: "Impact" }}>
										🔥 {rule}
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
					<AbsoluteFill style={{ zIndex: -1, opacity: 0.8, filter: "hue-rotate(-120deg)" }}>
						<LensFlare />
					</AbsoluteFill>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
						<div style={{ opacity: interpolate(frame - startEnd, [0, 10], [0, 1]) }}>
							<p style={{ fontSize: 75, color: "#ffaa00", fontFamily: "Impact", letterSpacing: 2, margin: 0, textShadow: "0 0 20px #ff0000" }}>
								COMMING SOON...
							</p>
						</div>
						<div style={{ 
							opacity: interpolate(frame - startEnd, [5, 25], [0, 1]), 
							transform: `scale(${interpolate(frame - startEnd, [5, 25], [0.5, 1], { easing: Easing.out(Easing.back(1.5)) })})`,
							margin: "40px 0"
						}}>
							<Img src={staticFile("video-factory/images/logo/logo.png")} style={{ width: 600, filter: "drop-shadow(0 0 50px #ff0000) sepia(1) saturate(10) hue-rotate(-30deg)" }} />
						</div>
						<div style={{ opacity: interpolate(frame - startEnd, [15, 35], [0, 1]) }}>
							<h2 style={{ fontSize: 65, color: "white", fontWeight: 900, textShadow: "0 5px 15px rgba(0,0,0,1)" }}>地獄の戦いを見届けよ</h2>
						</div>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* OVERLAY FLASH (Orange) */}
			<AbsoluteFill 
				style={{ 
					backgroundColor: "#ffaa00", 
					opacity: flashOpacity, 
					mixBlendMode: "overlay", 
					pointerEvents: "none" 
				}} 
			/>
		</AbsoluteFill>
	);
};
