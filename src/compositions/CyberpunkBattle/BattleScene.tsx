import { Float, Image, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
	AbsoluteFill,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";
import * as THREE from "three";
import { GlitchOverlay } from "../../components/UI/GlitchOverlay";
import { NeonParticles } from "./NeonParticles";

export const BattleScene = () => {
	const frame = useCurrentFrame();

	const rotateGroup = interpolate(frame, [0, 900], [0, 0.2]); // Subtle rotation

	return (
		<AbsoluteFill style={{ backgroundColor: "#050510" }}>
			<Canvas
				gl={{
					toneMapping: THREE.ACESFilmicToneMapping,
					outputColorSpace: THREE.SRGBColorSpace,
				}}
			>
				<PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

				<ambientLight intensity={1.5} />
				<directionalLight
					position={[10, 10, 5]}
					intensity={2}
					color="#00ffff"
				/>
				<directionalLight
					position={[-10, -10, 5]}
					intensity={2}
					color="#ff00ff"
				/>

				<group rotation={[0, rotateGroup, 0]}>
					{/* Background Grid - Massive Scale to fill horizon */}
					<Image
						url={staticFile("images/generated/neon_grid.webp")}
						scale={[60, 35]}
						position={[0, 5, -15]}
						transparent
						opacity={1}
					/>

					{/* Character A - Samurai (Left) - Dominant foregound */}
					<Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
						<Image
							url={staticFile("images/generated/cyberpunk_samurai.webp")}
							scale={[12, 12]}
							position={[-4.5, -2, 2]}
							transparent
						/>
					</Float>

					{/* Character B - Mecha (Right) - Dominant foreground */}
					<Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
						<Image
							url={staticFile("images/generated/mecha_robot.webp")}
							scale={[13, 13]}
							position={[4.5, -2, 3]}
							transparent
						/>
					</Float>

					{/* Atmosphere */}
					<NeonParticles />
					<Stars
						radius={100}
						depth={50}
						count={5000}
						factor={4}
						saturation={0}
						fade
						speed={1}
					/>
				</group>
			</Canvas>
			<GlitchOverlay />
		</AbsoluteFill>
	);
};
