// import {loadFont} from '@remotion/google-fonts/NotoSansJP';
import type React from "react";
import {
	AbsoluteFill,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

/*
 * Highlight a word in a sentence with a spring-animated wipe effect.
 */

const COLOR_HIGHLIGHT = "#A7C7E7";
const FONT_SIZE = 70;

// Temporary fix: Disable NotoSansJP specific loading to prevent 124 request warning/error.
// Falling back to system sans-serif.
// const {fontFamily} = loadFont('normal', {
// 	weights: ['900'],
//     ignoreTooManyRequestsWarning: true,
// });
const fontFamily = '"Noto Sans JP", sans-serif';

interface WordData {
	word: string;
	display?: string; // AIが生成したテロップ用テキスト
	startFrame: number;
	endFrame: number;
	segmentId?: number;
}

const Highlight: React.FC<{
	word: string;
	color: string;
	delay: number;
	durationInFrames: number;
}> = ({ word, color, delay, durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const highlightProgress = spring({
		fps,
		frame,
		config: { damping: 200 },
		delay,
		durationInFrames,
	});
	const scaleX = Math.max(0, Math.min(1, highlightProgress));

	return (
		<span style={{ position: "relative", display: "inline-block" }}>
			<span
				style={{
					position: "absolute",
					backgroundColor: color,
					borderRadius: "0.18em",
					zIndex: 0,
					width: "1.05em",
					height: scaleX === 1 ? "100%" : `${scaleX * 100}%`,
					left: "50%",
					top: 0,
					transform: "translateX(-50%)",
					transformOrigin: "center top",
				}}
			/>
			<span style={{ position: "relative", zIndex: 1 }}>{word}</span>
		</span>
	);
};

export const MyAnimation: React.FC<{
	words: WordData[];
	bgColor?: string;
	textColor?: string;
	highlightColor?: string;
	fontSize?: number;
}> = ({ words, highlightColor = COLOR_HIGHLIGHT, fontSize = FONT_SIZE }) => {
	const frame = useCurrentFrame();

	// 1. Chunks allocation: Max 16 characters total per screen
	const chunks: WordData[][] = [];
	let currentChunk: WordData[] = [];
	let currentChunkLen = 0;
	let currentSegmentId = words[0]?.segmentId;

	words.forEach((word) => {
		// 表示用テキスト（display）を優先して文字数をカウント
		const displayText = word.display || word.word;
		const wordLen = displayText.replace(/[、。]/g, "").length;
		const prevWord = currentChunk[currentChunk.length - 1];
		const hasPunctuation =
			prevWord && /[、。]/.test(prevWord.display || prevWord.word);

		if (
			currentChunkLen + wordLen > 16 ||
			hasPunctuation ||
			(word.segmentId !== currentSegmentId && currentChunk.length > 0)
		) {
			chunks.push(currentChunk);
			currentChunk = [];
			currentChunkLen = 0;
			currentSegmentId = word.segmentId;
		}
		currentChunk.push(word);
		currentChunkLen += wordLen;
	});
	if (currentChunk.length > 0) chunks.push(currentChunk);

	// 2. Find active chunk
	const activeChunk =
		chunks.find((chunk) => {
			const start = chunk[0].startFrame;
			const end = chunk[chunk.length - 1].endFrame;
			return frame >= start - 5 && frame <= end + 20;
		}) || chunks[0];

	// 3. Split active chunk into 2 lines (max 8 chars per line)
	const lines: WordData[][] = [[]];
	let lineLength = 0;
	activeChunk.forEach((word) => {
		const displayText = word.display || word.word;
		const wordLen = displayText.replace(/[、。]/g, "").length;
		if (lineLength + wordLen > 16 && lines[lines.length - 1].length > 0) {
			lines.push([]);
			lineLength = 0;
		}
		lines[lines.length - 1].push(word);
		lineLength += wordLen;
	});

	return (
		<AbsoluteFill
			style={{
				// alignItems: 'flex-end',
				// justifyContent: 'center',
				fontFamily,
				padding: "60px",
				writingMode: "vertical-lr",
				textOrientation: "upright",
			}}
		>
			<div
				style={{
					color: "white",
					fontSize: fontSize,
					fontWeight: 900,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					lineHeight: 1.1,
					textAlign: "center",
					backgroundColor: "rgba(0, 0, 0, 0.7)",
					padding: "40px 20px",
					borderRadius: "25px",
					textShadow: "3px 3px 6px rgba(0,0,0,1)",
				}}
			>
				{lines.map((line, lIdx) => (
					<div
						key={lIdx}
						style={{
							display: "flex",
							justifyContent: "center",
							whiteSpace: "nowrap",
						}}
					>
						{line.map((item, index) => {
							const duration = item.endFrame - item.startFrame;
							const displayText = item.display || item.word;
							return (
								<Highlight
									key={index}
									word={displayText}
									color={highlightColor}
									delay={item.startFrame}
									durationInFrames={duration > 0 ? duration : 1}
								/>
							);
						})}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};
