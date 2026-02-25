import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ImpactEffectTime as ImpactEffect } from "./ImpactEffectTime";
import { MorphingTitle } from "./MorphingTitle";
import { useBeatValue } from "./utils/beat-sync";
import type { Liver } from "./types";

type Props = {
	title: string;
	livers: Liver[];
	isHighlight?: boolean; // 上位3名の特別演出用
	hideRank?: boolean; // ランクバッジを非表示にする（TopRankReveal用）
};

const BPM = 160;

export const RankingGroupTime: React.FC<Props> = ({
	title,
	livers,
	isHighlight,
	hideRank,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const { pulse } = useBeatValue(BPM);

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
			transform: `translateX(${shakeX}px) scale(${1 + pulse * 0.005})`,
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
			{/* タイトル (モーフィング演出) */}
			<MorphingTitle
				text={title}
				fontSize={isHighlight ? 120 : 180}
				className="metallic-purple"
				style={{
					position: "absolute",
					top: 200,
					zIndex: 20,
				}}
			/>

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
					// Staggered Spring Logic: Reverse order (10 -> 7)
					const reverseIndex = livers.length - 1 - index;
					const liverSpr = spring({
						frame: frame - STAGGER_DELAY * reverseIndex - 10, // Start after title slam
						fps,
						config: { damping: 15, stiffness: 100 },
					});

					const liverY = interpolate(liverSpr, [0, 1], [-100, 0]);
					const liverOpacity = interpolate(liverSpr, [0, 1], [0, 1]);
					const liverScale = interpolate(liverSpr, [0, 1], [0.8, 1]); // Slightly smaller for better drop feel

					// Highlight Sizing
					const iconSize = isHighlight ? 450 : 150; // iconSize reduced for stack
					const fontSize = isHighlight ? 100 : 50; // Reduced to 50 for optimal balance
					const rankWidth = 180;

					// ゆらゆら揺れるアニメーション (Y軸回転)
					const wobble = Math.sin((frame + index * 10) / 15) * 15; 

					return (
						<div
							key={liver.rank}
							style={{
								display: "flex",
								flexDirection: isHighlight ? "column" : "row",
								alignItems: "center",
								backgroundColor: "rgba(0, 0, 0, 0.6)",
								width: "100%",
								padding: isHighlight ? "60px 40px" : "20px 30px",
								borderRadius: 20,
								// Entrance (Dropdown) + Wobble Animation
								transform: `translateY(${liverY}px) scale(${liverScale}) ${liver.rank <= 3 ? "" : `rotateY(${Math.sin(frame / 60) * 5}deg)`}`,
								opacity: liverOpacity,
								boxShadow: isHighlight
									? "0 0 50px rgba(208, 0, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)"
									: "0 4px 15px rgba(0,0,0,0.5)",
								border: isHighlight
									? "3px solid rgba(208, 0, 255, 0.5)"
									: "1px solid rgba(255,255,255,0.1)",
								position: "relative", // Needed for absolute background
								overflow: "hidden", // Clip the blur
							}}
						>
							{/* Blurred Background */}
							<AbsoluteFill style={{ zIndex: -1, opacity: 0.9 }}>
								<Img
									src={
										liver.saved_to 
											? staticFile(liver.saved_to)
											: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
									}
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
							</AbsoluteFill>

							{/* Dark overlay for readability */}
							<AbsoluteFill style={{ zIndex: -1, backgroundColor: "rgba(0,0,0,0.15)" ,border: "10px solid rgba(208, 0, 255, 0.5)", filter: "blur(4px)"}} />
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
												{liver.rank}th
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
														border: "4px solid white",
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
													className="metallic-purple"
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
												fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
												lineHeight: 1.1,
												textAlign: "center",
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
										fontFamily: '"Zen Maru Gothic", "Inter", sans-serif',
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
