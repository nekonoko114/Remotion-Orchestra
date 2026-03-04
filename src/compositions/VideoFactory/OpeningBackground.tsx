import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { LensFlare } from "../../components/effects/LensFlare";

export const OpeningBackground: React.FC = () => {
	return (
		<AbsoluteFill style={{ zIndex: -1 }}>
			<OffthreadVideo
				src={staticFile("assets/backgrounds/red_loop.mp4")}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
					objectPosition: "center",
					transform: "scale(1.5)",
				}}
				muted
			/>

			{/* Effect 1: Cinematic Lens Flare (Gold tones for dark knight theme) */}
			<LensFlare 
				color="#FFD700" 
				opacity={0.5} 
				intensity={0.8} 
				scale={1.5}
			/>

			{/* Effect 3: Cyber Scanlines Overlay */}
			<AbsoluteFill
				style={{
					background: "linear-gradient(to bottom, rgba(255,255,255,0.03) 50%, transparent 50%)",
					backgroundSize: "100% 4px",
					pointerEvents: "none",
					zIndex: 1,
				}}
			/>

			{/* Vignette for depth (Pitch Black for Dark Knight theme) */}
			<AbsoluteFill
				style={{
					background: "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.95) 100%)",
					pointerEvents: "none",
					zIndex: 2,
				}}
			/>
		</AbsoluteFill>
	);
};
