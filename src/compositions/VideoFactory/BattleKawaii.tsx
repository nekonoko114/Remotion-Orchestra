import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	Audio,
	staticFile,
	spring,
	Img,
	random,
} from "remotion";
import { KawaiiBackground } from "./KawaiiBackground";
import { useBeatValue } from "./utils/beat-sync";
// @ts-ignore
// import { loadFont } from "@remotion/google-fonts/ZenMaruGothic";

const fontFamily = '"Zen Maru Gothic", sans-serif';

const ShimmerOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{ pointerEvents: "none", zIndex: 10 }}>
			{new Array(30).fill(0).map((_, i) => {
				const seed = i * 444;
				const x = random(seed) * 100;
				const y = random(seed + 1) * 100;
				const size = random(seed + 2) * 20 + 10;
				const opacity = interpolate(Math.sin(frame / 10 + seed), [-1, 1], [0.1, 0.4]);
				return (
					<div key={i} style={{
						position: "absolute",
						left: `${x}%`,
						top: `${y}%`,
						width: size,
						height: size,
						backgroundColor: "white",
						borderRadius: "50%",
						opacity,
						boxShadow: "0 0 10px white",
						transform: `scale(${interpolate(Math.sin(frame / 5 + seed), [-1, 1], [0.5, 1.5])})`
					}} />
				);
			})}
		</AbsoluteFill>
	);
};

// --- Types ---
interface PlayerData {
	name: string;
	image: string;
	color: string;
	glowColor: string;
}

const MOCK_JOL_PLAYER: PlayerData = {
	name: "kawamii12",
	image: "video-factory/images/icons/kawamii12.jpeg",
	color: "#FF69B4",
	glowColor: "#FF1493",
};

const MOCK_OPPONENT: PlayerData = {
	name: "ama13918",
	image: "video-factory/images/icons/ama13918.jpeg",
	color: "#00CED1",
	glowColor: "#40E0D0",
};

const BPM = 130; 
const START_OFFSET_FRAMES = -183; 
const FINE_TUNE_OFFSET = 0; 

// --- Sub-components ---

const StageLight: React.FC<{ color: string; side: "left" | "right" }> = ({ color, side }) => {
	const frame = useCurrentFrame();
	const angle = side === "left" ? -20 : 20;
	return (
		<AbsoluteFill style={{ pointerEvents: "none" }}>
			<div style={{
				position: "absolute",
				top: -200,
				[side]: 100,
				width: 800,
				height: 2000,
				background: `linear-gradient(to bottom, ${color}66, transparent)`,
				filter: "blur(100px)",
				transform: `rotate(${angle + Math.sin(frame / 20) * 5}deg)`,
				opacity: 0.6,
			}} />
		</AbsoluteFill>
	);
};

const KawaiiCard: React.FC<{ 
	player: PlayerData; 
	frame: number; 
	direction: "left" | "right";
	pulse: number;
}> = ({ player, frame, direction, pulse }) => {
	const { fps } = useVideoConfig();
	
	const entry = spring({
		frame,
		fps,
		config: { stiffness: 100, damping: 15 }
	});

	// Brightness flash on entry
	const flash = interpolate(frame, [0, 15], [2, 1], { extrapolateRight: "clamp" });
	// Floating & Beat Bounce (Restored!)
	const floatY = Math.sin(frame / 10) * 20;
	const beatScale = 1 + pulse * 0.05;
	const glowPulse = interpolate(pulse, [0, 1], [0.8, 1.5]);

	const color = player.name === "kawamii12" ? "#FF69B4" : "#00CED1";

	return (
		<div style={{
			transform: `translateX(${(direction === "left" ? -500 : 500) * (1 - entry)}px) scale(${1.12 + 0.28 * entry * beatScale}) translateY(${floatY}px) `,
			opacity: entry,
			position: "relative",
			filter: `brightness(${flash})`,
		}}>
			{/* Stage Spotlight */}
			<StageLight color={color} side={direction} />

			{/* Glowing Halo */}
			<div style={{
				position: "absolute",
				top: -30,
				left: -30,
				right: -30,
				bottom: -30,
				background: color,
				borderRadius: 40,
				filter: "blur(40px)",
				opacity: 0.4 * glowPulse,
				zIndex: -1
			}} />

			<div style={{
				width: 450 * 1.4, // Increased size
				height: 550 * 1.4, // Increased size
				background: "rgba(255, 255, 255, 0.9)",
				borderRadius: 40,
				border: `12px solid ${color}`,
				boxShadow: `0 0 50px ${color}66, inset 0 0 30px white`,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}>
				{/* Image Container with Pop Styling */}
				<div style={{
					width: "100%",
					height: "100%",
					position: "relative",
					overflow: "hidden",
				}}>
					{/* Ribbon Corner Decorations */}
					<div style={{
						position: "absolute",
						top: -20,
						left: -20,
						width: 100,
						height: 100,
						background: color,
						transform: "rotate(-45deg)",
						zIndex: 5,
						border: "4px solid white"
					}} />
					<div style={{
						position: "absolute",
						top: -20,
						right: -20,
						width: 100,
						height: 100,
						background: color,
						transform: "rotate(45deg)",
						zIndex: 5,
						border: "4px solid white"
					}} />

					{/* Inner Sparkles */}
					<AbsoluteFill style={{ opacity: 0.3 }}>
						<div style={{ position: "absolute", top: "10%", left: "10%", fontSize: 40 }}>✨</div>
						<div style={{ position: "absolute", top: "70%", right: "15%", fontSize: 30 }}>💖</div>
					</AbsoluteFill>

					<img 
						src={staticFile(player.image)} 
						style={{ width: "100%", height: "100%", objectFit: "cover" }} 
						alt={player.name}
					/>
				</div>

				{/* Name Tag */}
				<div style={{ 
					position: "absolute",
					bottom: 20,
					background: color,
					padding: "10px 40px",
					borderRadius: 50,
					color: "white",
					fontSize: 40,
					fontFamily,
					fontWeight: "bold",
					boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
					border: "5px solid white",
					zIndex: 10,
					transform: `rotate(${Math.sin(frame/5)*2}deg)`
				}}>
					{player.name}
				</div>
			</div>
		</div>
	);
};

const VsImpact: React.FC<{ frame: number }> = ({ frame }) => {
	const progress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
	const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
	const scale = interpolate(progress, [0, 1], [0.5, 4]);

	return (
		<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
			<div style={{
				width: 400,
				height: 400,
				borderRadius: "50%",
				background: "radial-gradient(circle, #FFF 0%, #FF69B4 70%, transparent 100%)",
				transform: `scale(${scale})`,
				opacity,
				filter: "blur(30px)"
			}} />
			{/* Heart Particles */}
			{new Array(12).fill(0).map((_, i) => (
				<div key={i} style={{
					position: "absolute",
					fontSize: 60,
					transform: `rotate(${i * 30}deg) translateY(${interpolate(progress, [0, 1], [0, -500])}px) scale(${1-progress})`,
					opacity: interpolate(progress, [0, 0.2], [0, 1])
				}}>
					💖
				</div>
			))}
		</AbsoluteFill>
	);
};

const DecoEmoji: React.FC<{ seed: number; frame: number }> = ({ seed, frame }) => {
	const emojis = ["🍬", "🍭", "✨", "🎀", "🌈", "🍦", "🌸", "🧸", "🐱", "🐰"];
	const emoji = emojis[Math.floor(random(seed) * emojis.length)];
	const spr = spring({
		frame: frame - random(seed + 1) * 30,
		fps: 30,
		config: { damping: 12 }
	});

	const x = random(seed + 2) * 1080;
	const y = random(seed + 3) * 1920;
	const beatScale = 1 + (random(seed + 4) > 0.5 ? 1 : 0) * (Math.sin(frame / 5) * 0.2);
	const scale = interpolate(spr, [0, 1], [0, 1]) * (0.8 + Math.sin(frame / 10 + seed) * 0.2) * beatScale;

	return (
		<div style={{
			position: "absolute",
			left: x,
			top: y,
			fontSize: 100,
			transform: `translate(-50%, -50%) scale(${scale}) rotate(${Math.sin(frame/15 + seed)*30}deg)`,
			filter: "drop-shadow(0 0 15px rgba(255,255,255,1))",
			pointerEvents: "none"
		}}>
			{emoji}
		</div>
	);
};

const SubtleBackgroundPlayer: React.FC<{ image: string; opacity?: number }> = ({ image, opacity = 0.15 }) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
			<Img 
				src={staticFile(image)} 
				style={{ 
					width: "150%", 
					height: "150%", 
					objectFit: "cover", 
					position: "absolute",
					top: "-25%",
					left: "-25%",
					opacity,
					filter: "blur(20px) saturate(1.5)",
					transform: `scale(${1.1 + Math.sin(frame / 50) * 0.1})`,
				}} 
			/>
		</AbsoluteFill>
	);
};

// --- Main Composition ---

export const BattleKawaii: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const { pulse } = useBeatValue(BPM, FINE_TUNE_OFFSET);

	const OP_DURATION = 4 * fps;      
	const JOL_INTRO_DURATION = 4 * fps; // Exactly 4 seconds
	const OPPONENT_INTRO_DURATION = 4 * fps; // Exactly 4 seconds
	const MATCHUP_DURATION = 3 * fps; // Exactly 3 seconds
	const VS_RULES_DURATION = 4 * fps; // Exactly 4 seconds
	const END_DURATION = 3 * fps; // Exactly 3 seconds

	const startJol = OP_DURATION;
	const startOpponent = startJol + JOL_INTRO_DURATION;
	const startMatchup = startOpponent + OPPONENT_INTRO_DURATION;
	const startVs = startMatchup + MATCHUP_DURATION;
	const startEnd = startVs + VS_RULES_DURATION;

	const flashOpacity = interpolate(pulse, [0, 1], [0, 0.15]);

	return (
		<AbsoluteFill style={{ backgroundColor: "#FFF0F5" }}>
			<KawaiiBackground />
			<ShimmerOverlay />

			<Audio
				src={staticFile("assets/audio/music/Please_me,_my_honey.mp3")} 
				volume={0.6}
				loop
				startFrom={START_OFFSET_FRAMES > 0 ? 0 : -START_OFFSET_FRAMES}
			/>

			{/* BEAT FLASH FOR SYNC CHECK */}
			<AbsoluteFill style={{
				backgroundColor: "white",
				opacity: pulse * 0.05,
				pointerEvents: "none",
				zIndex: 1000
			}} />

			{/* 1. OPENING TITLE */}
			<Sequence durationInFrames={OP_DURATION}>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					{/* Scattered Deco Items */}
					{new Array(15).fill(0).map((_, i) => (
						<DecoEmoji key={i} seed={i * 99} frame={frame} />
					))}

					<div style={{
						textAlign: "center",
						transform: `scale(${spring({ frame, fps: 30, config: { stiffness: 100 } })}) rotate(${Math.sin(frame / 10) * 2}deg)`,
						background: "rgba(255, 255, 255, 0.4)",
						padding: "60px 40px",
						borderRadius: "50%",
						backdropFilter: "blur(10px)",
						boxShadow: "0 0 50px rgba(255, 105, 180, 0.3)",
					}}>
						<h1 style={{ 
							fontSize: 160, 
							color: "#FF1493", 
							fontFamily, 
							textShadow: "4px 4px 0px white, -4px -4px 0px white, 4px -4px 0px white, -4px 4px 0px white, 0 0 30px #FF69B4",
							margin: 0,
							lineHeight: 0.9,
						}}>
							SWEET<br/>
							<span style={{ color: "#FFD700", textShadow: "4px 4px 0px white, -4px -4px 0px white, 4px -4px 0px white, -4px 4px 0px white, 0 0 30px #FFD700" }}>BATTLE</span>
						</h1>
						<div style={{ 
							marginTop: 30,
							display: "inline-block",
							background: "#00CED1", 
							color: "white",
							padding: "5px 30px",
							borderRadius: 30,
							fontSize: 40, 
							fontWeight: "bold", 
							fontFamily,
							boxShadow: "0 5px 15px rgba(0,206,209,0.4)"
						}}>
							Kawaii Showcase Vol.1
						</div>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* 2. JOL INTRO */}
			<Sequence from={startJol} durationInFrames={JOL_INTRO_DURATION}>
				<SubtleBackgroundPlayer image={MOCK_JOL_PLAYER.image} />
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<KawaiiCard player={MOCK_JOL_PLAYER} frame={frame - startJol} direction="left" pulse={pulse} />
				</AbsoluteFill>
			</Sequence>

			{/* 3. OPPONENT INTRO */}
			<Sequence from={startOpponent} durationInFrames={OPPONENT_INTRO_DURATION}>
				<SubtleBackgroundPlayer image={MOCK_OPPONENT.image} />
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<KawaiiCard player={MOCK_OPPONENT} frame={frame - startOpponent} direction="right" pulse={pulse} />
				</AbsoluteFill>
			</Sequence>

			{/* 4. MATCH-UP (VS Scene) */}
			<Sequence from={startMatchup} durationInFrames={MATCHUP_DURATION}>
				<AbsoluteFill>
					<div style={{ position: "absolute", width: "100%", height: "50%", top: 0, overflow: "hidden" }}>
						<SubtleBackgroundPlayer image={MOCK_JOL_PLAYER.image} opacity={0.1} />
					</div>
					<div style={{ position: "absolute", width: "100%", height: "50%", bottom: 0, overflow: "hidden" }}>
						<SubtleBackgroundPlayer image={MOCK_OPPONENT.image} opacity={0.1} />
					</div>

					{frame - startMatchup === 10 && <VsImpact frame={0} />}
					
					<div style={{ position: "absolute", top: "5%", left: 0, right: 0, display: "flex", justifyContent: "center", transform: "scale(0.65)" }}>
						<KawaiiCard player={MOCK_JOL_PLAYER} frame={frame - startMatchup} direction="left" pulse={pulse} />
					</div>

					<AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<div style={{
							fontSize: 250,
							fontFamily,
							fontWeight: "bold",
							background: "linear-gradient(180deg, #FF69B4, #FFD700, #00CED1)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							filter: "drop-shadow(0 0 20px rgba(255,255,255,0.8)) drop-shadow(0 0 40px #FF69B4)",
							transform: `scale(${1 + pulse * 0.3}) rotate(${Math.sin(frame/3)*10}deg)`,
						}}>
							VS
						</div>
					</AbsoluteFill>

					<div style={{ position: "absolute", bottom: "5%", left: 0, right: 0, display: "flex", justifyContent: "center", transform: "scale(0.65)" }}>
						<KawaiiCard player={MOCK_OPPONENT} frame={frame - startMatchup} direction="right" pulse={pulse} />
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* 5. RULES */}
			<Sequence from={startVs} durationInFrames={VS_RULES_DURATION}>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<div style={{
						background: "rgba(255,255,255,0.7)",
						backdropFilter: "blur(10px)",
						padding: "60px",
						borderRadius: 60,
						border: "10px solid #FF69B4",
						textAlign: "center",
						width: 800,
						transform: `scale(${spring({ frame: frame - startVs, fps, config: { damping: 10 } })})`
					}}>
						<h2 style={{ color: "#FF1493", fontSize: 70, margin: 0 }}>GAME RULES</h2>
						<div style={{ marginTop: 40, fontSize: 45, color: "#555", fontWeight: "bold", textAlign: "left" }}>
							<p>💖 Smile Attack</p>
							<p>🍭 Candy Rain Mode</p>
							<p>✨ Sparkle Judgment</p>
						</div>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* 6. ENDING */}
			<Sequence from={startEnd} durationInFrames={END_DURATION}>
				<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
					<div style={{ textAlign: "center", opacity: interpolate(frame - startEnd, [0, 20], [0, 1]) }}>
						<h2 style={{ fontSize: 80, color: "#FF69B4" }}>COMING SOON</h2>
						<Img src={staticFile("video-factory/images/logo/logo.png")} style={{ width: 500, marginTop: 40 }} />
					</div>
				</AbsoluteFill>
			</Sequence>

			<AbsoluteFill 
				style={{ 
					backgroundColor: "#FF69B4", 
					opacity: flashOpacity, 
					mixBlendMode: "soft-light", 
					pointerEvents: "none" 
				}} 
			/>
		</AbsoluteFill>
	);
};
