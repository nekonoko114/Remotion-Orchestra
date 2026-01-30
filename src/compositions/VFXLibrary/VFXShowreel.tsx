import type React from "react";
import { AbsoluteFill, Series } from "remotion";
import { KineticText } from "../../components/effects/KineticText";
import { FilmGrain } from "../../components/overlays/FilmGrain";
import { LightLeak } from "../../components/overlays/LightLeak";
import { SpeedLines } from "../../components/overlays/SpeedLines";
import { FlashTransition } from "../../components/transitions/FlashTransition";
import { ZoomBlurTransition } from "../../components/transitions/ZoomBlurTransition";

// Hyper Components
import { HyperShake } from "../../components/effects/HyperShake";
import { ImpactShockwave } from "../../components/effects/ImpactShockwave";
import { CyberGrid } from "../../components/overlays/CyberGrid";
import { EnergyBolts } from "../../components/overlays/EnergyBolts";
import { HyperSpinTransition } from "../../components/transitions/HyperSpinTransition";

const Scene = ({ color, text }: { color: string; text: string }) => (
	<AbsoluteFill
		style={{
			backgroundColor: color,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		<h1
			style={{
				color: "white",
				fontSize: "80px",
				fontWeight: "bold",
				textAlign: "center",
			}}
		>
			{text}
		</h1>
	</AbsoluteFill>
);

export const VFXShowreel: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: "black" }}>
			<Series>
				{/* --- STANDARD MODE --- */}
				<Series.Sequence durationInFrames={60}>
					<ZoomBlurTransition type="in">
						<Scene color="#ff2d55" text="STANDARD: ZOOM IN" />
					</ZoomBlurTransition>
				</Series.Sequence>

				<Series.Sequence durationInFrames={60}>
					<ZoomBlurTransition type="out">
						<Scene color="#5856d6" text="STANDARD: ZOOM OUT" />
					</ZoomBlurTransition>
				</Series.Sequence>

				{/* --- HYPER MODE (EXTREME) --- */}

				<Series.Sequence durationInFrames={60}>
					<HyperSpinTransition type="in">
						<Scene color="#000" text="HYPER: SPIN IN" />
						<CyberGrid />
					</HyperSpinTransition>
				</Series.Sequence>

				<Series.Sequence durationInFrames={90}>
					<HyperShake intensity={8}>
						<Scene color="#111" text="HYPER SHAKE + BOLTS" />
						<EnergyBolts />
						<ImpactShockwave delay={10} />
						<ImpactShockwave delay={30} />
					</HyperShake>
				</Series.Sequence>

				<Series.Sequence durationInFrames={60}>
					<HyperSpinTransition type="out">
						<Scene color="#ff2d55" text="HYPER: SPIN OUT" />
						<SpeedLines count={100} color="cyan" />
					</HyperSpinTransition>
				</Series.Sequence>

				{/* FINALE */}
				<Series.Sequence durationInFrames={90}>
					<HyperShake intensity={10}>
						<AbsoluteFill style={{ backgroundColor: "#000" }}>
							<KineticText
								text="ENERGY OVERLOAD"
								style={{
									fontSize: "100px",
									fontWeight: "950",
									color: "#00ffff",
								}}
							/>
							<EnergyBolts />
							<FilmGrain />
							<LightLeak />
						</AbsoluteFill>
					</HyperShake>
					<FlashTransition duration={30} />
				</Series.Sequence>
			</Series>

			{/* Global HUD */}
			<div
				style={{
					position: "absolute",
					top: 50,
					left: 50,
					color: "rgba(255,255,255,0.6)",
					fontSize: "24px",
					fontWeight: "bold",
					letterSpacing: "2px",
					textShadow: "0 0 10px cyan",
				}}
			>
				HYPER-VFX EXTREME v2.0
			</div>
		</AbsoluteFill>
	);
};
