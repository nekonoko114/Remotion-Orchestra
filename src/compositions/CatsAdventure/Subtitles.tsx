import type React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

interface SubtitleItem {
	startFrame: number;
	endFrame: number;
	text: string;
}

const Character = ({
	char,
	index,
	startFrame,
}: { char: string; index: number; startFrame: number }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Offset start for each character (e.g. 2 frames delay per char)
	const spr = spring({
		frame: frame - startFrame - index * 2,
		fps,
		config: {
			stiffness: 100,
		},
	});

	const opacity = interpolate(spr, [0, 1], [0, 1]);
	const scale = interpolate(spr, [0, 1], [0.8, 1]);
	const translateY = interpolate(spr, [0, 1], [5, 0]);

	return (
		<span
			style={{
				display: "inline-block",
				opacity,
				transform: `scale(${scale}) translateY(${translateY}px)`,
				whiteSpace: "pre",
			}}
		>
			{char}
		</span>
	);
};

export const Subtitles: React.FC<{ items: SubtitleItem[] }> = ({ items }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const currentItem = items.find(
		(item) => frame >= item.startFrame && frame < item.endFrame,
	);

	if (!currentItem) return null;

	// Animation for the container box
	const boxSpr = spring({
		frame: frame - currentItem.startFrame,
		fps,
		config: {
			stiffness: 100,
		},
	});

	const boxOpacity = interpolate(boxSpr, [0, 0.5], [0, 1]);

	return (
		<AbsoluteFill
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				alignItems: "center",
				paddingBottom: "50px",
				pointerEvents: "none",
				fontFamily: 'Noto Sans JP, "Hiragino Kaku Gothic ProN", sans-serif',
			}}
		>
			<div
				style={{
					backgroundColor: "rgba(0, 0, 0, 0.7)",
					padding: "12px 32px",
					borderRadius: "20px",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					opacity: boxOpacity,
					backdropFilter: "blur(8px)",
					boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
				}}
			>
				<div
					style={{
						color: "white",
						fontSize: "42px",
						fontWeight: "bold",
						letterSpacing: "0.05em",
						textShadow: "0 2px 4px rgba(0,0,0,0.5)",
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{currentItem.text.split("").map((char, i) => (
						<Character
							key={`${currentItem.startFrame}-${i}`}
							char={char}
							index={i}
							startFrame={currentItem.startFrame}
						/>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
