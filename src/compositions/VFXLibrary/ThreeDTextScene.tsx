import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { BurningText } from "../../components/effects/BurningText";
import { ParticleText } from "../../components/effects/ParticleText";
import { RealisticFireText } from "../../components/effects/RealisticFireText";
import { ThreeDText } from "../../components/effects/ThreeDText";

export const ThreeDTextScene: React.FC = () => {
	const { width, height } = useVideoConfig();

	return (
		<AbsoluteFill style={{ backgroundColor: "#030303ff" }}>
			{/* Force override R3F inline styles */}
			<style>
				{`
                    #three-canvas-container canvas {
                        width: 100% !important;
                        height: 100% !important;
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                    }
                `}
			</style>

			<div
				id="three-canvas-container"
				style={{ width, height, position: "relative" }}
			>
				<Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
					{/* Lighting */}
					<ambientLight intensity={0.5} />
					<pointLight position={[10, 10, 10]} intensity={1} />
					<spotLight
						position={[-10, 10, 10]}
						angle={0.3}
						penumbra={1}
						intensity={2}
						color="#00ffff"
					/>

					{/* 3D Text Components */}
					<group position={[0, 2.5, 0]}>
						<ParticleText
							text="PARTICLES"
							size={2.5}
							startFrame={60}
							durationInFrames={60}
						/>
					</group>

					{/* The New Realistic Fire (Default Orange) */}
					<group position={[0, 0.8, 0]}>
						<RealisticFireText
							text="REAL FIRE"
							size={1.0}
							distortionStrength={2.0}
						/>
					</group>

					{/* Blue Magic Fire */}
					<group position={[0, -0.5, 0]}>
						<RealisticFireText
							text="BLUE FLAME"
							size={0.8}
							distortionStrength={1.5}
							fireColorCore="rgba(100, 200, 158, 1)"
							fireColorBody="rgba(229, 207, 204, 0.8)"
							fireColorEdge="rgba(12, 240, 123, 0.26)"
							magmaColor="rgb(0, 0, 250)"
							carbonColor="rgb(50, 250, 50)"
						/>
					</group>

					<group position={[0, -1.5, 0]}>
						<BurningText
							text="MAGIC FLAME"
							size={0.8}
							color="#46a5e8"
							height={0.5}
							durationInFrames={120}
							distortionStrength={1.5}
						/>
					</group>

					{/* Background */}
					<Stars
						radius={100}
						depth={50}
						count={8000}
						factor={6}
						saturation={0}
						fade
						speed={1}
					/>
				</Canvas>
			</div>
		</AbsoluteFill>
	);
};
