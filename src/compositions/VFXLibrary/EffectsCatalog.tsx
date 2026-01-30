import type React from "react";
import { AbsoluteFill, Series, staticFile } from "remotion";

import { ChromaticAberration } from "../../components/effects/ChromaticAberration";
import { Confetti } from "../../components/effects/Confetti";
import { Explosion } from "../../components/effects/Explosion";
// --- EFFECTS ---
import { GlitchEffect } from "../../components/effects/GlitchEffect";
import { HighlightText } from "../../components/effects/HighlightText";
import { ImpactShockwave } from "../../components/effects/ImpactShockwave";
import { KenBurns } from "../../components/effects/KenBurns";
import { KineticText } from "../../components/effects/KineticText";
import { MotionContainer } from "../../components/effects/MotionContainer";
import { NeonGlowText } from "../../components/effects/NeonGlowText";
import { NumberCounter } from "../../components/effects/NumberCounter";
import { PixelateContainer } from "../../components/effects/PixelateContainer";
import { ProgressBar } from "../../components/effects/ProgressBar";
import { Rain } from "../../components/effects/Rain";
import { RoughSketch } from "../../components/effects/RoughSketch";
import { ShootingStar } from "../../components/effects/ShootingStar";
import { SplitScreen } from "../../components/effects/SplitScreen";
import { Typewriter } from "../../components/effects/Typewriter";
import { VHSEffect } from "../../components/effects/VHSEffect";
import { WavesContainer } from "../../components/effects/WavesContainer";
import { WiggleContainer } from "../../components/effects/WiggleContainer";

import { CinematicTitle } from "../../components/effects/CinematicTitle";
// --- NEW MOTION GRAPHICS ---
import { HolographicHUD } from "../../components/effects/HolographicHUD";
import { LiquidBlob } from "../../components/effects/LiquidBlob";

// --- ULTRA TEXT ANIMATIONS ---
import {
	BioSlime,
	CyberDecode,
	InfernoBurn,
	LiquidMetal,
	NeonChaos,
	PopArt3D,
	ShatterAssembly,
	StardustGalaxy,
	ThunderGodStrike,
	VoidConsumer,
} from "../../components/effects/UltraText";

import { DigitalRain } from "../../components/effects/DigitalRain";
import { HeatDistortion } from "../../components/effects/HeatDistortion";
import { LensFlare } from "../../components/effects/LensFlare";
import { LightningBolt } from "../../components/effects/LightningBolt";
// --- ADVANCED VFX ---
import { SmokeEffect } from "../../components/effects/SmokeEffect";

import { NetworkGraph } from "../../components/effects/NetworkGraph";
// --- COMPLEX INFOGRAPHICS ---
import { RadarInterface } from "../../components/effects/RadarInterface";

import { CircularReveal } from "../../components/transitions/CircularReveal";
import { CubeTransition } from "../../components/transitions/CubeTransition";
import { FlipTransition } from "../../components/transitions/FlipTransition";
import { GlitchTransition } from "../../components/transitions/GlitchTransition";
// --- TRANSITIONS ---
import { HyperSpinTransition } from "../../components/transitions/HyperSpinTransition";
import { ZoomBlurTransition } from "../../components/transitions/ZoomBlurTransition";

// --- HARD TRANSITIONS ---
import { HardTransitions } from "../../components/transitions/HardTransitions";

// --- OVERLAYS ---
import { CyberGrid } from "../../components/overlays/CyberGrid";

const TitleCard: React.FC<{
	title: string;
	subtitle: string;
	color?: string;
}> = ({ title, subtitle, color = "#333" }) => (
	<AbsoluteFill
		style={{
			backgroundColor: color,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
		}}
	>
		<h1
			style={{
				color: "white",
				fontSize: 36,
				margin: 0,
				textAlign: "center",
				fontWeight: "900",
			}}
		>
			{title}
		</h1>
		{subtitle && (
			<h2
				style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, marginTop: 8 }}
			>
				{subtitle}
			</h2>
		)}
	</AbsoluteFill>
);

const SectionHeader: React.FC<{ title: string; color: string }> = ({
	title,
	color,
}) => (
	<div
		style={{
			position: "absolute",
			top: 30,
			left: 30,
			zIndex: 100,
			backgroundColor: "rgba(0,0,0,0.8)",
			padding: "6px 16px",
			borderRadius: 25,
			color,
			fontSize: 22,
			fontWeight: "bold",
			border: `2px solid ${color}`,
			textTransform: "uppercase",
			letterSpacing: "1px",
		}}
	>
		{title}
	</div>
);

export const EffectsCatalog: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: "#0a0a0a", padding: 25 }}>
			<Series>
				{/* --- SECTOR 1: PREMIUM TYPOGRAPHY --- */}
				<Series.Sequence durationInFrames={150}>
					<SectionHeader title="1. Premium Typography" color="#00f2ff" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<NeonGlowText text="NEON GLOW" fontSize={50} />
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#fff",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<h2 style={{ color: "#333", fontSize: 40 }}>
									This is <HighlightText text="SMART" />
								</h2>
							</AbsoluteFill>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<KineticText
									text="KINETIC"
									style={{ fontSize: 60, color: "#f1c40f" }}
								/>
							</AbsoluteFill>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#111",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Typewriter
									text="Typewriting style..."
									style={{
										color: "#0f0",
										fontSize: 35,
										fontFamily: "monospace",
									}}
								/>
							</AbsoluteFill>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 2: ULTRA TEXT ANIMATIONS (New!) --- */}
				<Series.Sequence durationInFrames={300}>
					<SectionHeader title="2. ULTRA TEXT ANIMATIONS" color="#ff00ff" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gridTemplateRows: "1fr 1fr 1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						{/* 1. Inferno */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#110000",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<InfernoBurn text="INFERNO" fontSize={60} />
							</AbsoluteFill>
						</div>
						{/* 2. Cyber Decode */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#001100",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<CyberDecode text="ACCESS GRANTED" fontSize={35} />
							</AbsoluteFill>
						</div>
						{/* 3. Liquid Metal */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#222",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<LiquidMetal text="T-1000" fontSize={60} />
							</AbsoluteFill>
						</div>
						{/* 4. Shatter */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<ShatterAssembly text="IMPACT" fontSize={60} />
							</AbsoluteFill>
						</div>
						{/* 5. Neon Chaos */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#111",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<NeonChaos text="BROKEN" fontSize={60} />
							</AbsoluteFill>
						</div>
						{/* 6. Void */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<VoidConsumer text="THE VOID" fontSize={60} />
							</AbsoluteFill>
						</div>
						{/* 7. Pop Art */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#fff",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									overflow: "hidden",
								}}
							>
								<PopArt3D text="KABOOM!" fontSize={70} />
							</AbsoluteFill>
						</div>
						{/* 8. Bio Slime */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#112200",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<BioSlime text="TOXIC" fontSize={60} />
							</AbsoluteFill>
						</div>
						{/* 9. Stardust */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000022",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<StardustGalaxy text="GALAXY" fontSize={60} />
							</AbsoluteFill>
						</div>
						{/* 10. Thunder */}
						<div
							style={{
								position: "relative",
								border: "2px solid #444",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<ThunderGodStrike text="GODSPEED" fontSize={50} />
							</AbsoluteFill>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 3: VFX & DISTORTION --- */}
				<Series.Sequence durationInFrames={150}>
					<SectionHeader title="3. VFX & Distortion" color="#e74c3c" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<VHSEffect>
								<ChromaticAberration offset={10}>
									<TitleCard
										title="VHS + Glitch"
										subtitle="Retro Distort"
										color="#000"
									/>
								</ChromaticAberration>
							</VHSEffect>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<PixelateContainer pixelSize={15} animate>
								<TitleCard
									title="Pixelation"
									subtitle="Mosaic Reveal"
									color="#2c3e50"
								/>
							</PixelateContainer>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<WavesContainer intensity={30}>
								<TitleCard
									title="Turbulence"
									subtitle="Liquid Waves"
									color="#2980b9"
								/>
							</WavesContainer>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<GlitchEffect intensity={10}>
								<TitleCard
									title="Hard Glitch"
									subtitle="Matrix Error"
									color="#000"
								/>
							</GlitchEffect>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 4: ATMOSPHERE & PARTICLES --- */}
				<Series.Sequence durationInFrames={150}>
					<SectionHeader title="4. Atmosphere & Particles" color="#3498db" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#050510",
							}}
						>
							<Rain count={200} />
							<TitleCard
								title="Heavy Rain"
								subtitle="Environmental"
								color="transparent"
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<Explosion delay={20} color="#ff4d00" />
							<TitleCard
								title="Explosion"
								subtitle="Impact Particle"
								color="transparent"
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<Confetti count={100} />
							<TitleCard
								title="Confetti"
								subtitle="Celebration"
								color="transparent"
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#050510",
							}}
						>
							<ShootingStar triggerFrame={0} speed={60} />
							<TitleCard
								title="Shooting Star"
								subtitle="Cinematic"
								color="transparent"
							/>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 5: UI & VISUALIZATION --- */}
				<Series.Sequence durationInFrames={150}>
					<SectionHeader title="5. UI & Visualization" color="#f1c40f" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#1a1a1a",
							}}
						>
							<AbsoluteFill
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexDirection: "column",
								}}
							>
								<NumberCounter
									endValue={1000000}
									durationInFrames={100}
									prefix="$"
									style={{ fontSize: 60, color: "#f1c40f", fontWeight: "bold" }}
								/>
								<ProgressBar
									showPercentage
									style={{ bottom: 30, width: "80%", left: "10%" }}
								/>
							</AbsoluteFill>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<SplitScreen
								left={
									<div style={{ backgroundColor: "#e67e22", height: "100%" }} />
								}
								right={
									<div style={{ backgroundColor: "#2ecc71", height: "100%" }} />
								}
							/>
							<div
								style={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									color: "white",
									fontWeight: 900,
									fontSize: 35,
									textShadow: "0 0 10px rgba(0,0,0,0.5)",
								}}
							>
								VS
							</div>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<CyberGrid />
							<TitleCard
								title="Cyber Grid"
								subtitle="Digital Overlay"
								color="transparent"
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<WiggleContainer>
								<TitleCard
									title="Wiggle UI"
									subtitle="Dynamic Layout"
									color="#34495e"
								/>
							</WiggleContainer>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 6: NEW MOTION GRAPHICS --- */}
				<Series.Sequence durationInFrames={200}>
					<SectionHeader title="6. New Motion Graphics" color="#00ff55" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HolographicHUD />
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#fff",
							}}
						>
							<LiquidBlob />
						</div>
						<div
							style={{
								position: "relative",
								gridColumn: "span 2",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<CinematicTitle
								title="THE ORCHESTRA"
								subtitle="A Visual Experience"
							/>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 7: ADVANCED VFX --- */}
				<Series.Sequence durationInFrames={200}>
					<SectionHeader title="7. Advanced VFX" color="#bdc3c7" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								gridColumn: "span 1",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#111",
							}}
						>
							<SmokeEffect color="#aaddff" />
							<TitleCard
								title="Smoke"
								subtitle="Atmospheric"
								color="transparent"
							/>
						</div>
						<div
							style={{
								position: "relative",
								gridColumn: "span 1",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<LightningBolt />
							<TitleCard
								title="Lightning"
								subtitle="Weather"
								color="transparent"
							/>
						</div>
						<div
							style={{
								position: "relative",
								gridColumn: "span 1",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<LensFlare />
							<TitleCard
								title="Lens Flare"
								subtitle="Optical"
								color="transparent"
							/>
						</div>
						<div
							style={{
								position: "relative",
								gridColumn: "span 2",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HeatDistortion />
							{/* HeatDistortion内部でテキストを持っているのでTitleCardなし */}
						</div>
						<div
							style={{
								position: "relative",
								gridColumn: "span 1",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<DigitalRain />
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 8: COMPLEX INFOGRAPHICS --- */}
				<Series.Sequence durationInFrames={200}>
					<SectionHeader title="8. Complex Infographics" color="#00ffcc" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<RadarInterface />
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#001133",
							}}
						>
							<NetworkGraph />
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 9: MISC & UTILITY --- */}
				<Series.Sequence durationInFrames={150}>
					<SectionHeader title="9. Misc & Utility" color="#9b59b6" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<KenBurns
								src={staticFile("images/generated/cyberpunk_samurai.png")}
								direction="zoomIn"
							>
								<TitleCard
									title="Ken Burns"
									subtitle="Image Pan/Zoom"
									color="transparent"
								/>
							</KenBurns>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<RoughSketch>
								<TitleCard
									title="Rough Sketch"
									subtitle="Hand-drawn Look"
									color="#2c3e50"
								/>
							</RoughSketch>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<MotionContainer type="rotate">
								<TitleCard
									title="Motion: Rotate"
									subtitle="Basic Transform"
									color="#16a085"
								/>
							</MotionContainer>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #222",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<ImpactShockwave delay={30} />
							<TitleCard
								title="Shockwave"
								subtitle="Radial Impact"
								color="transparent"
							/>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 10: DYNAMIC TRANSITIONS --- */}
				<Series.Sequence durationInFrames={180}>
					<SectionHeader title="10. Dynamic Transitions" color="#e67e22" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "2px solid #333",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<CubeTransition
								from={
									<TitleCard
										title="Cube"
										subtitle="Zoom & Blur"
										color="#c0392b"
									/>
								}
								to={
									<TitleCard
										title="Next Scene"
										subtitle="Enhanced V2"
										color="#2980b9"
									/>
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #333",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<GlitchTransition
								from={
									<TitleCard
										title="Digital"
										subtitle="RGB Slice"
										color="#2ecc71"
									/>
								}
								to={
									<TitleCard
										title="Glitch"
										subtitle="New Transition"
										color="#000"
									/>
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #333",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<FlipTransition
								from={
									<TitleCard
										title="3D Flip"
										subtitle="Card Style"
										color="#f39c12"
									/>
								}
								to={
									<TitleCard
										title="Next Card"
										subtitle="Shadows"
										color="#e74c3c"
									/>
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #333",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<CircularReveal
								from={
									<TitleCard
										title="Circle"
										subtitle="Glow Ring"
										color="#34495e"
									/>
								}
								to={
									<TitleCard
										title="Reveal"
										subtitle="Expander"
										color="#1abc9c"
									/>
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #333",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<HyperSpinTransition type="in">
								<TitleCard
									title="Hyper Spin"
									subtitle="Elastic"
									color="#8e44ad"
								/>
							</HyperSpinTransition>
						</div>
						<div
							style={{
								position: "relative",
								border: "2px solid #333",
								borderRadius: 15,
								overflow: "hidden",
							}}
						>
							<ZoomBlurTransition type="in">
								<TitleCard
									title="Zoom Blur"
									subtitle="Action"
									color="#27ae60"
								/>
							</ZoomBlurTransition>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 11: HARDCORE TRANSITIONS I --- */}
				<Series.Sequence durationInFrames={200}>
					<SectionHeader title="11. ULTRA HARDCORE: IMPACT" color="#FF0000" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "4px solid #FF0000",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.SeismicImpactSlam
								from={
									<TitleCard
										title="SEISMIC"
										subtitle="IMPACT SLAM"
										color="#550000"
									/>
								}
								to={
									<TitleCard
										title="DESTROYED"
										subtitle="AFTERMATH"
										color="#000"
									/>
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #FF0000",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.HyperdriveSingularity
								from={
									<TitleCard
										title="HYPERDRIVE"
										subtitle="SINGULARITY"
										color="#000055"
									/>
								}
								to={<TitleCard title="WARP" subtitle="COMPLETE" color="#000" />}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #FF0000",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.NeuralGlitchOverload
								from={
									<TitleCard title="NEURAL" subtitle="GLITCH" color="#005500" />
								}
								to={
									<TitleCard title="SYSTEM" subtitle="FAILURE" color="#000" />
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #FF0000",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.VortexShredder
								from={
									<TitleCard
										title="VORTEX"
										subtitle="SHREDDER"
										color="#550055"
									/>
								}
								to={<TitleCard title="DIMENSION" subtitle="X" color="#222" />}
							/>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 12: ULTRA HARDCORE: COSMIC --- */}
				<Series.Sequence durationInFrames={200}>
					<SectionHeader title="12. ULTRA HARDCORE: COSMIC" color="#9C27B0" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "4px solid #9C27B0",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.SolarProminenceBurst
								from={
									<TitleCard
										title="SOLAR"
										subtitle="PROMINENCE"
										color="#ff6600"
									/>
								}
								to={
									<TitleCard
										title="BURST"
										subtitle="COMPLETE"
										color="#220000"
									/>
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #9C27B0",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.AbyssGravityFall
								from={
									<TitleCard
										title="ABYSS"
										subtitle="GRAVITY FALL"
										color="#1a1a2e"
									/>
								}
								to={
									<TitleCard title="DEPTHS" subtitle="UNKNOWN" color="#000" />
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #9C27B0",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.DimensionalRiftTear
								from={
									<TitleCard
										title="DIMENSION"
										subtitle="RIFT TEAR"
										color="#2c3e50"
									/>
								}
								to={
									<TitleCard
										title="ALTERNATE"
										subtitle="REALITY"
										color="#8e44ad"
									/>
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #9C27B0",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.CyberPuncture
								from={
									<TitleCard
										title="CYBER"
										subtitle="PUNCTURE"
										color="#004d40"
									/>
								}
								to={<TitleCard title="HACK" subtitle="SUCCESS" color="#000" />}
							/>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 13: DESTRUCTIVE PHYSICS & CHAOS --- */}
				<Series.Sequence durationInFrames={200}>
					<SectionHeader title="13. DESTRUCTIVE PHYSICS" color="#FFD700" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gridTemplateRows: "1fr 1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "4px solid #FFD700",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.KineticCrashBounce
								from={
									<TitleCard
										title="KINETIC"
										subtitle="CRASH BOUNCE"
										color="#B8860B"
									/>
								}
								to={
									<TitleCard title="IMPACT" subtitle="REACTION" color="#000" />
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #FFD700",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.TectonicPlateShift
								from={
									<TitleCard
										title="TECTONIC"
										subtitle="PLATE SHIFT"
										color="#5D4037"
									/>
								}
								to={
									<TitleCard title="EARTH" subtitle="QUAKE" color="#3E2723" />
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #FFD700",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.PrismShatterBlast
								from={
									<TitleCard title="PRISM" subtitle="SHATTER" color="#00BCD4" />
								}
								to={
									<TitleCard title="GLASS" subtitle="BREAK" color="#006064" />
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #FFD700",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.MagmaticMeltdown
								from={
									<TitleCard
										title="MAGMATIC"
										subtitle="MELTDOWN"
										color="#D32F2F"
									/>
								}
								to={
									<TitleCard title="CORE" subtitle="BREACH" color="#B71C1C" />
								}
							/>
						</div>
					</div>
				</Series.Sequence>

				{/* --- SECTOR 14: ESOTERIC PHENOMENA --- */}
				<Series.Sequence durationInFrames={200}>
					<SectionHeader title="14. ESOTERIC PHENOMENA" color="#00FF00" />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gridTemplateRows: "1fr",
							gap: 20,
							width: "100%",
							height: "100%",
						}}
					>
						<div
							style={{
								position: "relative",
								border: "4px solid #00FF00",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.QuantumPhaseDisruption
								from={
									<TitleCard title="QUANTUM" subtitle="PHASE" color="#7B1FA2" />
								}
								to={
									<TitleCard title="REALITY" subtitle="SHIFT" color="#4A148C" />
								}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #00FF00",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.DataVoidInferno
								from={
									<TitleCard title="DATA" subtitle="VOID" color="#212121" />
								}
								to={<TitleCard title="NULL" subtitle="POINTER" color="#000" />}
							/>
						</div>
						<div
							style={{
								position: "relative",
								border: "4px solid #00FF00",
								borderRadius: 15,
								overflow: "hidden",
								backgroundColor: "#000",
							}}
						>
							<HardTransitions.GhostEchoTrail
								from={
									<TitleCard title="GHOST" subtitle="ECHO" color="#607D8B" />
								}
								to={<TitleCard title="TIME" subtitle="LAG" color="#37474F" />}
							/>
						</div>
					</div>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};
