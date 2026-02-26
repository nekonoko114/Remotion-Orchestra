import type React from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from "remotion";
import RANKING_DATA_JSON from "./data.json";
import IMAGE_MANIFEST from "./image-manifest.json";
import type { Liver } from "./types";

const RANKING_DATA = RANKING_DATA_JSON as Liver[];
const BPM = 152;

export const GridBridge: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// 1. Timing setup based on BPM 152
	const beatFrames = (60 / BPM) * fps;
	

	// Prepare dynamic grid data using manifest
	// Map filenames to ranking data if available
	const gridItems = IMAGE_MANIFEST.map((fileName) => {
		const baseName = fileName.split(".")[0];
		
		// Special mapping for Jinya (Rank 2)
		let searchName = baseName;
		if (fileName === "jinya_original.jpeg") {
			searchName = "ritu_1115";
		}

		const liver = RANKING_DATA.find((l) => l.username === searchName);
		return {
			fileName,
			liver,
			rank: liver?.rank || 99,
		};
	});

	// Split into 3 rows
	const rows: any[][] = [[], [], []];
	gridItems.forEach((item, index) => {
		const rowIndex = index % 3;
		rows[rowIndex].push(item);
	});

	// Overall tilt
	const rotation = -6;
	

	// "Gathering" logic for Top 3 (Ranks 1, 2, 3)
	const getGatherOffset = (rowIndex: number, rank: number) => {
		if (rank > 3) return { x: 0, y: 0 };
		
		const gatherProgress = interpolate(frame, [beatFrames * 6, beatFrames * 14], [0, 1], {
			easing: Easing.out(Easing.back(2)),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		// Move towards middle row (rowIndex 1)
		let offsetY = 0;
		if (rowIndex === 0) offsetY = gatherProgress * 200;
		if (rowIndex === 2) offsetY = -gatherProgress * 200;
		
		return { x: 0, y: offsetY };
	};

	const rowHeight = 1900 / 3; 
	const itemWidth = 500; // 320 -> 500 に戻す
	const gap = 20;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
			<AbsoluteFill
				style={{
					transform: `rotate(${rotation}deg) scale(1.4)`, // 元のスケールに戻す
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{rows.map((rowItems, rowIndex) => {
					// 画像が少ないため、5倍に増やしておおまかな密度を保つ
					const rowLong = [...rowItems, ...rowItems, ...rowItems, ...rowItems, ...rowItems]; 
					const itemsInRow = rowLong.length;
					const totalRowWidth = itemsInRow * (itemWidth + gap);
					
					// 行ごとのスピードと方向
					const speed = rowIndex % 2 === 0 ? 8 : 10; 
					const direction = rowIndex % 2 === 0 ? -1 : 1;
					
					// 継続的な移動
					const baseOffset = (frame * speed * direction) % totalRowWidth;

					return (
						<div
							key={rowIndex}
							style={{
								display: "flex",
								height: rowHeight,
								transform: `translateX(${baseOffset - totalRowWidth/2}px)`,
								gap: gap,
								marginBottom: 20,
								whiteSpace: "nowrap",
							}}
						>
							{rowLong.map((item, colIndex) => {
								const { y: oy } = getGatherOffset(rowIndex, item.rank);
								const isTop3 = item.rank <= 3;
								
								const opacity = isTop3 ? 1 : interpolate(frame, [beatFrames * 15, beatFrames * 18], [1, 0.75], { 
									extrapolateLeft: "clamp",
									extrapolateRight: "clamp" 
								});

								const imageSource = staticFile(`assets/images-01/${item.fileName}`);

								return (
									<div
										key={colIndex}
										style={{
											width: itemWidth,
											height: rowHeight - 40,
											position: "relative",
											transform: `translate(0, ${oy}px)`,
											opacity,
											borderRadius: 20,
											flexShrink: 0, 
											overflow: "hidden",
											border: isTop3 ? "12px solid #FFD700" : "4px solid #444",
											boxShadow: isTop3 ? "0 0 50px rgba(255, 215, 0, 0.8)" : "none",
										}}
									>
										<Img
											src={imageSource}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
										{isTop3 && (
											<div style={{
												position: "absolute",
												bottom: 20,
												left: 0,
												right: 0,
												textAlign: "center",
												backgroundColor: "rgba(0,0,0,0.7)",
												color: "#FFD700",
												fontSize: 60,
												fontWeight: "bold",
												padding: "10px 0"
											}}>
												{item.rank}位
											</div>
										)}
									</div>
								);
							})}
						</div>
					);
				})}
			</AbsoluteFill>
			
			<AbsoluteFill style={{
				backgroundColor: "#fff",
				opacity: interpolate(frame, [beatFrames * 18, beatFrames * 20], [0, 1], { extrapolateLeft: "clamp" }),
				pointerEvents: "none"
			}} />
		</AbsoluteFill>
	);
};


