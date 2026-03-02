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
import RANKING_DATA_JSON from "./data-time.json";
import FETCHED_USERS_JSON from "../../../jol-liver.json";
import type { Liver } from "./types";

const RANKING_DATA = RANKING_DATA_JSON as Liver[];

// Define type for fetched users
type FetchedUser = {
	id: string;
	nickname: string;
	avatar: string;
	localAvatar: string;
};

const FETCHED_USERS = FETCHED_USERS_JSON as FetchedUser[];

const BPM = 160;

export const GridBridgeTime: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width } = useVideoConfig();

	// 1. Timing setup based on BPM 160
	const beatFrames = (60 / BPM) * fps; // 11.25 frames per beat
	
	// Ensure TOP 10 data is prioritized and formatted
	const top10Items = RANKING_DATA.map(liver => {
		// Try to find the downloaded avatar
		const fetchedMatch = FETCHED_USERS.find(fu => fu.id === liver.username);
		
		// Priority: localAvatar (if valid) -> saved_to (from data.json) -> image_url
		let avatarPath = liver.saved_to;
		if (fetchedMatch && fetchedMatch.localAvatar) {
			avatarPath = fetchedMatch.localAvatar;
		} else if (!liver.saved_to) {
			avatarPath = liver.image_url;
		}

		return {
			id: liver.username,
			avatarPath,
			liver,
			rank: liver.rank,
			isTop10: true,
			nickname: liver.nickname,
		};
	});

	// Get successfully downloaded other users, excluding top 10 to avoid duplicates
	const top10Usernames = top10Items.map(item => item.id);
	const otherUsers = FETCHED_USERS
		.filter(u => u.localAvatar && u.localAvatar !== "") // Only users with images
		.filter(u => !top10Usernames.includes(u.id)) // Exclude top 10
		.map(u => ({
			id: u.id,
			avatarPath: u.localAvatar,
			liver: null,
			rank: 99, // Lower rank priority
			isTop10: false,
			nickname: u.nickname === "Not Found" ? u.id : u.nickname,
		}));

	// Combine them. To make the grid look mixed, we can interleave them or just append.
	// 均一にするため、3の倍数に切り捨てます
	const combinedItemsRaw = [...top10Items, ...otherUsers];
	const uniformCount = Math.floor(combinedItemsRaw.length / 3) * 3;
	const combinedItems = combinedItemsRaw.slice(0, uniformCount);

	// Split into 3 columns instead of rows
	const columns: any[][] = [[], [], []];
	combinedItems.forEach((item, index) => {
		const colIndex = index % 3;
		columns[colIndex].push(item);
	});

	// Overall tilt
	const rotation = -6;
	
	// "Gathering" logic for Top 3 (Ranks 1, 2, 3)
	const getGatherOffset = (colIndex: number, rank: number) => {
		if (rank > 3) return { x: 0, y: 0 };
		
        // Grid animation total duration is about 8 seconds (240 frames)
        // Gathering starts around beat 12 (135 frames) and ends at beat 18 (202 frames)
		const gatherProgress = interpolate(frame, [beatFrames * 12, beatFrames * 18], [0, 1], {
			easing: Easing.out(Easing.back(2)),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		// Move towards middle column (colIndex 1)
		let offsetX = 0;
		if (colIndex === 0) offsetX = gatherProgress * 300 * (width / 1080);
		if (colIndex === 2) offsetX = -gatherProgress * 300 * (width / 1080);
		
		return { x: offsetX, y: 0 };
	};

	const columnWidth = width / 3; 
	const itemHeight = 500 * (width / 1080); 
	const gap = 20 * (width / 1080);

	return (
		<AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
			<AbsoluteFill
				style={{
					transform: `rotate(${rotation}deg) scale(1.4)`, // 元のスケールに戻す
					display: "flex",
					flexDirection: "row", // Horizontal layout for the columns
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{columns.map((columnItems, colIndex) => {
					// 画像をループさせるため配列を繰り返す (約20枚/列を2周させる)
					const columnLong = [...columnItems, ...columnItems]; 
					const totalColumnHeight = columnItems.length * (itemHeight + gap); // 1セットの長さを全体の高さとする
					
					// 列ごとのスピードと方向
					// スピードを数値（現在は16と20）で調整できます。数値を大きくすると速くなります。
					const speed = colIndex % 2 === 0 ? 20 : 24; 
					const direction = colIndex % 2 === 0 ? -1 : 1;
					
					// 継続的な移動
					const baseOffset = (frame * speed * direction) % totalColumnHeight;

					return (
						<div
							key={colIndex}
							style={{
								display: "flex",
								flexDirection: "column", // Vertical layout for items in a column
								width: columnWidth,
								transform: `translateY(${baseOffset - totalColumnHeight/2}px)`,
								gap: gap,
								marginRight: 20,
								whiteSpace: "nowrap",
							}}
						>
							{columnLong.map((item, rowIndex) => {
								const { x: ox } = getGatherOffset(colIndex, item.rank);
								const isTop3 = item.rank <= 3;
								
								// Dim non-top-3 images after gathering
								const opacity = isTop3 ? 1 : interpolate(frame, [beatFrames * 16, beatFrames * 20], [1, 0.75], { 
									extrapolateLeft: "clamp",
									extrapolateRight: "clamp" 
								});

								// Remove leading slash if present to make staticFile path relative to public/
								// localAvatar is usually "/assets/avatars/..." so we make it "assets/avatars/..."
								let imageSourcePath = item.avatarPath;
								if (imageSourcePath && imageSourcePath.startsWith('/')) {
									imageSourcePath = imageSourcePath.substring(1);
								}

								// For HTTP urls (fallback), just pass as string.
								let imageSource = imageSourcePath;
								if (imageSourcePath && !imageSourcePath.startsWith('http')) {
									imageSource = staticFile(imageSourcePath);
								}

								return (
									<div
										key={rowIndex}
										style={{
											width: columnWidth - 40 * (width / 1080),
											height: itemHeight,
											position: "relative",
											transform: `translate(${ox}px, 0)`,
											opacity,
											borderRadius: 20 * (width / 1080),
											flexShrink: 0, 
											overflow: "hidden",
											border: isTop3 ? `${12 * (width / 1080)}px solid #FFD700` : `${4 * (width / 1080)}px solid #444`,
											boxShadow: isTop3 ? `0 0 ${50 * (width / 1080)}px rgba(255, 215, 0, 0.8)` : "none",
											backgroundColor: "#111", // Placeholder for when image takes time to load
										}}
									>
										{imageSource && (
											<Img
												src={imageSource}
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
										)}
										{/* Add nickname overlay for non-top 3 to make it look active */}
										{!isTop3 && (
											<AbsoluteFill style={{
												background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)",
												pointerEvents: "none"
											}} />
										)}
										{!isTop3 && (
											<div style={{
												position: "absolute",
												bottom: 15 * (width / 1080),
												left: 15 * (width / 1080),
												right: 15 * (width / 1080),
												color: "white",
												fontSize: 30 * (width / 1080),
												fontWeight: "bold",
												textShadow: `0 ${2 * (width / 1080)}px ${5 * (width / 1080)}px rgba(0,0,0,1)`,
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}>
												{item.nickname}
											</div>
										)}
										{isTop3 && (
											<div style={{
												position: "absolute",
												bottom: 20 * (width / 1080),
												left: 0,
												right: 0,
												textAlign: "center",
												backgroundColor: "rgba(0,0,0,0.7)",
												color: "#FFD700",
												fontSize: 60 * (width / 1080),
												fontWeight: "bold",
												padding: `${10 * (width / 1080)}px 0`
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
				opacity: interpolate(frame, [beatFrames * 18, beatFrames * 21], [0, 1], { extrapolateLeft: "clamp" }),
				pointerEvents: "none"
			}} />
		</AbsoluteFill>
	);
};
