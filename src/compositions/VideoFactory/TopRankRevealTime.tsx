import React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	useCurrentFrame,
	staticFile,
	useVideoConfig,
} from "remotion";
import { ImpactEffectTime as ImpactEffect } from "./ImpactEffectTime";
import { TimeBackground } from "./TimeBackground";
import { CinematicBorder } from "./CinematicBorder";
import { MorphingTitle } from "./MorphingTitle";
import { useBeatValue } from "./utils/beat-sync";
import type { Liver } from "./types";

const BPM = 180;

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankRevealTime: React.FC<Props> = ({ rank, liver, title }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const { pulse } = useBeatValue(BPM);
	
	const snapReduction = pulse * 0.05;
	const localFrame = frame - snapReduction;
	
	const nameEntrance = spring({
		frame: localFrame - 22,
		fps,
		config: { damping: 14, stiffness: 120 },
	});

	// Dynamics based on music
	const imageScale = interpolate(frame, [0, 15], [0.8, 1.0], {
		extrapolateRight: "clamp",
	}) * (1 + pulse * 0.002);
	const imageOpacity = interpolate(frame, [0, 10], [0, 1]);
	const imageRotate = 0; // Disabled rotate for top ranks
	
	const nameY = interpolate(nameEntrance, [0, 1], [150, 0]);
	const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);
	
	// Entrance Flash (Neon Leak style)
	const flashOpacity = interpolate(frame, [0, 5, 20], [0, 0.8, 0], { extrapolateRight: "clamp" });
	
	const pulseScale = 1 + pulse * 0.001;
	
	// Rhythmic Drift
	const driftX = 0;
	const driftY = 0;

	const getRankColors = (r: number) => {
		if (r === 1) return { primary: "#d000ff", glow: "rgba(208, 0, 255, 0.8)" };
		return { primary: "#a200ff", glow: "rgba(162, 0, 255, 0.8)" };
	};

	const { primary, glow } = getRankColors(rank);

	if (!liver) return null;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000" }}>
			<AbsoluteFill>
				<AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />
			</AbsoluteFill>

			<TimeBackground overlayColor={primary + "33"} hideBackground hideBaseVideo />
			
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					fontFamily: '"Mochiy Pop One", sans-serif',
					color: "white",
				}}
			>
				<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
					<ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
				</AbsoluteFill>

				<div style={{ 
					transform: `translate(${driftX}px, ${driftY}px)`, 
					zIndex: 120, 
					display: "flex", 
					flexDirection: "column", 
					alignItems: "center" 
				}}>
					{/* Rank Title Animation (Morphing) */}
					<MorphingTitle
						text={title}
						fontSize={250}
						style={{
							zIndex: 130,
							textShadow: `0 0 30px ${primary}, 0 0 60px ${primary}`,
							transform: `scale(${pulseScale})`,
						}}
					/>

					{/* Liver Image Animation with Background Frame */}
					<div style={{
						position: "relative",
						width: 800,
						height: 800,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 40,
						transform: `scale(${imageScale}) rotate(${imageRotate}deg) rotateX(20deg)`,
						opacity: imageOpacity
					}}>
						{/* Background Design Frame (High Speed Rotating Diamond) */}
						<div style={{
							position: "absolute",
							width: "90%",
							height: "90%",
							border: `12px solid ${primary}`,
							transform: `rotate(0deg)`,
							opacity: 0.3,
							boxShadow: `0 0 50px ${glow}`,
							borderRadius: "10%",
						}} />

						{/* 5-Layer Neon Rings (No pulsing) */}
						{[...new Array(5)].map((_, i) => (
							<div 
								key={i}
								style={{
									position: "absolute",
									width: 710 + i * 25,
									height: 710 + i * 25,
									borderRadius: "50%",
									border: `1.5px solid ${primary}`,
									boxShadow: `0 0 20px ${glow}`,
									opacity: 0.7 - i * 0.12,
								}} 
							/>
						))}

						{/* Main Image Container */}
						<div style={{
							width: 700,
							height: 700,
							borderRadius: "50%",
							overflow: "hidden",
							border: `5px solid ${primary}`, 
							boxShadow: `0 0 80px ${glow}`, 
							position: "relative",
							backgroundColor: "#000",
						}}>
							<Img
								src={
									liver.saved_to 
										? staticFile(liver.saved_to)
										: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
								}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
							
							<AbsoluteFill style={{ 
								background: `radial-gradient(circle, transparent 40%, ${primary}44 100%)`,
								mixBlendMode: "screen"
							}} />
						</div>
					</div>

					<h2 style={{ 
						fontSize: 80, 
						marginTop: 20, 
						textShadow: `0 0 20px ${glow}`, 
						fontWeight: 900,
						color: "#fff",
						opacity: nameOpacity,
						transform: `translateY(${nameY}px)`,
					}}>
						{liver.nickname}
					</h2>
				</div>

				<AbsoluteFill style={{ 
					backgroundColor: "white", 
					opacity: flashOpacity, 
					pointerEvents: "none",
					zIndex: 1000,
					mixBlendMode: "overlay"
				}} />
			</AbsoluteFill>

			<CinematicBorder color={primary} glowColor={glow} />
		</AbsoluteFill>
	);
};
