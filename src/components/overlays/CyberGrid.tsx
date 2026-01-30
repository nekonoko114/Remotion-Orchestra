import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const CyberGrid: React.FC<{ color?: string }> = ({ color = "#00f0ff" }) => {
	const frame = useCurrentFrame();
	const speed = (frame * 5) % 160;

	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				overflow: "hidden",
				backgroundColor: "#000",
			}}
		>
			{/* 0. Giant Retro Sun */}
			<div
				style={{
					position: "absolute",
					top: "15%",
					left: "50%",
					transform: "translateX(-50%)",
					width: "400px",
					height: "400px",
					borderRadius: "50%",
					background:
						"linear-gradient(to bottom, #f1c40f 0%, #e67e22 50%, #e74c3c 100%)",
					boxShadow: "0 0 100px #e67e22",
					zIndex: 1,
					WebkitMaskImage:
						"repeating-linear-gradient(0deg, black, black 15px, transparent 15px, transparent 25px)",
				}}
			/>

			{/* 1. Deep Background Glow */}
			<div
				style={{
					position: "absolute",
					top: "10%",
					left: "50%",
					transform: "translateX(-50%)",
					width: "100%",
					height: "50%",
					background:
						"radial-gradient(circle, rgba(236, 0, 140, 0.4) 0%, transparent 80%)",
					filter: "blur(80px)",
				}}
			/>

			{/* 2. Vector Horizon Line */}
			<div
				style={{
					position: "absolute",
					top: "50%",
					width: "100%",
					height: "6px",
					backgroundColor: color,
					boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
					zIndex: 5,
				}}
			/>

			{/* 3. The 3D Floor */}
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "-25%",
					width: "150%",
					height: "100%",
					perspective: "1000px",
					perspectiveOrigin: "50% 0%",
				}}
			>
				<div
					style={{
						width: "100%",
						height: "100%",
						transform: "rotateX(80deg)",
						transformOrigin: "top center",
						backgroundImage: `
                        linear-gradient(to right, ${color} 2px, transparent 2px),
                        linear-gradient(to bottom, ${color} 2px, transparent 2px)
                    `,
						backgroundSize: "80px 80px",
						backgroundPosition: `0px ${speed}px`,
						boxShadow: `inset 0 0 150px ${color}66`,
						maskImage:
							"linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
					}}
				/>

				<div
					style={{
						position: "absolute",
						top: 0,
						width: "100%",
						height: "100%",
						transformOrigin: "top center",
						transform: "rotateX(80deg)",
						backgroundImage: `
                        linear-gradient(to bottom, rgba(255, 255, 255, ${0.1 + Math.sin(frame / 5) * 0.1}) 4px, transparent 2px)
                    `,
						backgroundSize: "100% 160px",
						backgroundPosition: `0px ${speed * 1.5}px`,
					}}
				/>
			</div>

			{/* 4. Scanning Line Overlay */}
			<div
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					background:
						"repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)",
					backgroundSize: "100% 4px",
					pointerEvents: "none",
					zIndex: 10,
				}}
			/>

			{/* 5. Vignette */}
			<AbsoluteFill
				style={{
					boxShadow: "inset 0 0 200px rgba(0,0,0,0.8)",
					background:
						"radial-gradient(circle, transparent 40%, rgba(255,0,255,0.05) 100%)",
					zIndex: 20,
				}}
			/>
		</AbsoluteFill>
	);
};
