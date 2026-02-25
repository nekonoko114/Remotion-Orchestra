import { AbsoluteFill, Video, staticFile } from "remotion";
import { LensFlare } from "../../components/effects/LensFlare";

export const OpeningBackground: React.FC = () => {
	return (
		<AbsoluteFill style={{ zIndex: -1 }}>
			<Video
				src={staticFile("assets/backgrounds/red_loop.mp4")}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
					objectPosition: "center",
					transform: "scale(1.5)",
				}}
				muted
				loop
			/>

			{/* Effect 1: Cinematic Lens Flare (Warm tones to match red) */}
			<LensFlare 
				color="#e6ffaaff" 
				opacity={0.4} 
				intensity={0.6} 
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

			{/* Vignette for depth */}
			<AbsoluteFill
				style={{
					background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%)",
					pointerEvents: "none",
					zIndex: 2,
				}}
			/>
		</AbsoluteFill>
	);
};
