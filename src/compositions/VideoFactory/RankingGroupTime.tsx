import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ImpactEffectTime as ImpactEffect } from "./ImpactEffectTime";
import { useBeatValue } from "./utils/beat-sync";
import type { Liver } from "./types";

type Props = {
	title: string;
	livers: Liver[];
	isHighlight?: boolean; // 上位3名の特別演出用
	hideRank?: boolean; // ランクバッジを非表示にする（TopRankReveal用）
};

const BPM = 128;

export const RankingGroupTime: React.FC<Props> = ({
	title,
	livers,
	isHighlight,
	hideRank,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const { pulse } = useBeatValue(BPM);

	const titleSpr = spring({
		frame,
		fps,
		config: { damping: 10, stiffness: 200, mass: 0.6 },
	});

	// Power Slam Scale: Start massive and slam down
	const titleScale = interpolate(titleSpr, [0, 1], [4, 1]);
	const titleOpacity = interpolate(titleSpr, [0, 0.4], [0, 1]);
	// Vertical slide is less important than the slam, but keep it subtle
	const titleY = interpolate(titleSpr, [0, 1], [100, 0]);

	// Impact Shake: Just at the moment of landing (around frame 5-15)
	const shakePower = interpolate(frame, [5, 15], [30, 0], { extrapolateRight: 'clamp' });
	const shakeX = (random(`shake-${frame}`) - 0.5) * shakePower;

	// Glow Burst intensity
	const glowOpacity = interpolate(frame, [5, 20], [0.8, 0], { extrapolateRight: 'clamp' });

	// Calculate per-liver staggered animation
	const STAGGER_DELAY = 18; // 0.3s at 60fps

	return (
		<AbsoluteFill style={{ 
			justifyContent: "center", 
			alignItems: "center",
			transform: `translateX(${shakeX}px) scale(${1 + pulse * 0.01})`
		}}>
			{/* Impact Glow Burst Overlay */}
			{glowOpacity > 0 && (
				<AbsoluteFill
					style={{
						background: "radial-gradient(circle, white 0%, transparent 70%)",
						opacity: glowOpacity,
						zIndex: 10,
						pointerEvents: "none",
					}}
				/>
			)}
			{/* タイトル */}
			<h1
				className="metallic-gold"
				style={{
					position: "absolute",
					top: 100,
					fontSize: isHighlight ? 100 : 160,
					fontFamily: "Impact, sans-serif",
					fontWeight: "bold",
					letterSpacing: "0.1em",
					textAlign: "center",
					whiteSpace: "pre-line",
					lineHeight: 1.0,
					transform: `scale(${titleScale}) translateY(${titleY}px)`,
					opacity: titleOpacity,
				}}
			>
				{title}
			</h1>

			{/* ライバーリストを表示するエリア */}
			<div
				style={{
					display: "flex",
					flexDirection: isHighlight ? "column" : "column", // Highlight is basically single item anyway
					gap: isHighlight ? 40 : 60, // Increase gap for highlight
					width: isHighlight ? "100%" : "90%",
					top: "50%",
					left: "50%", // Correctly center horizontally
					position: "absolute",
					transform: "translate(-50%, -35%)", // Shift back by 50% of width and 35% of height
				}}
			>
				{livers.map((liver, index) => {
					// Staggered Spring Logic: Reverse order (10 -> 7)
					// Delay is based on reverse index
					const reverseIndex = livers.length - 1 - index;
					const liverSpr = spring({
						frame: frame - STAGGER_DELAY * reverseIndex - 10, // Start after title slam
						fps,
						config: { damping: 15, stiffness: 100 },
					});

					const liverX = interpolate(liverSpr, [0, 1], [200, 0]);
					const liverOpacity = interpolate(liverSpr, [0, 1], [0, 1]);
					const liverScale = interpolate(liverSpr, [0, 1], [0.95, 1]);

					// Highlight Sizing
					const iconSize = isHighlight ? 450 : 150; // iconSize reduced for stack
					const fontSize = isHighlight ? 100 : 90; // fontSize increased for space
					const rankWidth = 180;

					// ゆらゆら揺れるアニメーション (Y軸回転)
					const wobble = Math.sin((frame + index * 10) / 15) * 15; 

					return (
						<div
							key={index}
							style={{
								display: "flex",
								flexDirection: isHighlight ? "column" : "row",
								alignItems: "center",
								backgroundColor: "rgba(0, 0, 0, 0.6)",
								width: "100%",
								padding: isHighlight ? "60px 40px" : "20px 30px",
								borderRadius: 20,
								// Entrance + Wobble Animation
								transform: `translateX(${liverX}px) scale(${liverScale}) rotateY(${Math.sin(frame / 60) * 5}deg)`,
								opacity: liverOpacity,
								boxShadow: isHighlight
									? "0 0 50px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)"
									: "0 4px 15px rgba(0,0,0,0.5)",
								border: isHighlight
									? "3px solid rgba(255, 215, 0, 0.5)"
									: "1px solid rgba(255,255,255,0.1)",
								position: "relative", // Needed for absolute background
								overflow: "hidden", // Clip the blur
							}}
						>
							{/* Blurred Background */}
							<AbsoluteFill style={{ zIndex: -1, opacity: 0.4 }}>
								<Img
									src={
										liver.saved_to 
											? staticFile(liver.saved_to)
											: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
									}
									style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px)" }}
								/>
							</AbsoluteFill>

							{/* Dark overlay for readability */}
							<AbsoluteFill style={{ zIndex: -1, backgroundColor: "rgba(0,0,0,0.3)" }} />
								{/* Row content */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										width: "100%",
										justifyContent: isHighlight ? "center" : "flex-start",
										position: "relative",
										zIndex: 1,
									}}
								>
									{/* Vertical Stack for Rank and Icon */}
									{!isHighlight && (
										<div style={{ 
											display: "flex", 
											flexDirection: "column", 
											alignItems: "center", 
											width: rankWidth, 
											gap: 10,
											marginRight: 30
										}}>
											{/* Rank Number */}
											<div
												className="metallic-silver" // Always silver for 10-4
												style={{
													fontSize: 70,
													fontWeight: "bold",
													textAlign: "center",
													transform: `rotateY(${wobble}deg)`,
													transformStyle: "preserve-3d",
													fontFamily: "Impact, sans-serif",
													lineHeight: 1
												}}
											>
												{liver.rank}位
											</div>

											{/* Icon image */}
											<div
												style={{
													width: iconSize,
													height: iconSize,
													borderRadius: "50%",
													overflow: "hidden",
													border: "4px solid white",
													boxShadow: "0 0 20px rgba(0,0,0,0.5)",
													flexShrink: 0,
													backgroundColor: "#ccc",
												}}
											>
												<Img
													src={
														liver.saved_to 
															? staticFile(liver.saved_to)
															: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
													}
													style={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
													}}
												/>
											</div>
										</div>
									)}

									{/* Original Highlight Logic (Special Handling for top 3) */}
									{isHighlight && (
										<>
											{/* 順位バッジ */}
											{!hideRank && (
												<div
													className="metallic-gold"
													style={{
														fontSize: 120,
														fontWeight: "bold",
														marginBottom: 30,
														textAlign: "center",
														transform: `rotateY(${wobble}deg)`,
														transformStyle: "preserve-3d",
														fontFamily: "Impact, sans-serif",
													}}
												>
													{liver.rank}位
												</div>
											)}

											{/* アイコン画像 */}
											<div
												style={{
													width: iconSize,
													height: iconSize,
													borderRadius: "50%",
													overflow: "hidden",
													marginBottom: 30,
													border: "8px solid white",
													boxShadow: "0 0 20px rgba(0,0,0,0.5)",
													flexShrink: 0,
													backgroundColor: "#ccc",
												}}
											>
												<Img
													src={
														liver.saved_to 
															? staticFile(liver.saved_to)
															: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
													}
													style={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
													}}
												/>
											</div>
										</>
									)}

									{/* Name Area */}
									{!isHighlight && (
										<div
											className="metallic-silver"
											style={{
												fontSize: fontSize,
												fontWeight: "bold",
												color: "white",
												flex: 1,
												textShadow: "0 2px 4px rgba(0,0,0,0.8)",
												fontFamily: "Inter, sans-serif",
												lineHeight: 1.1,
											}}
										>
											{liver.nickname}
										</div>
									)}
								</div>

							{/* Highlight Name is BELOW icon */}
							{isHighlight && (
								<div
									className="metallic-gold"
									style={{
										fontSize: fontSize,
										fontWeight: "bold",
										color: "white",
										width: "100%",
										textAlign: "center",
										marginTop: 20,
										textShadow: "0 4px 10px rgba(0,0,0,0.8)",
										fontFamily: "Inter, sans-serif",
										lineHeight: 1.1,
										position: "relative",
										zIndex: 1,
									}}
								>
									{liver.nickname}
								</div>
							)}

							{/* ポイント (Optionally hidden) */}
							{/* 
            <div style={{
              fontSize: 40,
              fontWeight: 'bold',
              color: '#FFD700',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'Roboto Mono, monospace' // 数字等幅
            }}>
              {liver.points.toLocaleString()} pt
            </div>
             */}
						</div>
					);
				})}
			</div>
			<ImpactEffect beatPulse={pulse} />
		</AbsoluteFill>
	);
};
