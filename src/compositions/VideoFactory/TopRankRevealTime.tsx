import React, { useMemo } from "react";
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	random,
	useCurrentFrame,
	staticFile,
	useVideoConfig,
} from "remotion";
import { ImpactEffectTime as ImpactEffect } from "./ImpactEffectTime";
import { TimeBackground } from "./TimeBackground";
import { CinematicBorder } from "./CinematicBorder";
import { MorphingTitle } from "./MorphingTitle";
import { Confetti } from "./Confetti";
import { useBeatValue } from "./utils/beat-sync";
import type { Liver } from "./types";

const BPM = 160;

// 魔法陣アセットのリスト
const MAGIC_CIRCLES = [
	"magic-circle-blue.png",
	"magic-circle-green.png",
	"magic-circle-orange.png",
	"magic-circle-red.png",
	"magic-circle-yellow.png",
];

type Props = {
	rank: number;
	liver: Liver;
	title: string;
};

export const TopRankRevealTime: React.FC<Props> = ({ rank, liver, title }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const { pulse } = useBeatValue(BPM);
	
	const snapReduction = pulse * 0.05;
	const localFrame = frame - snapReduction;
	

	const nameEntrance = spring({
		frame: localFrame - 25,
		fps,
		config: { damping: 14, stiffness: 120 },
	});

	// タイプライター演出
	const nameLength = liver.nickname.length;
	const charsVisible = Math.floor(interpolate(localFrame - 25, [0, 20], [0, nameLength], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
	const displayedName = liver.nickname.slice(0, charsVisible);

	// Dynamics based on music
	const imageScale = interpolate(frame, [0, 20], [0.7, 1.05], {
		extrapolateRight: "clamp",
	}) * (1 + pulse * 0.005);
	const imageOpacity = interpolate(frame, [0, 15], [0, 1]);
	
	const nameY = interpolate(nameEntrance, [0, 1], [50, 0]);
	const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);
	
	const flashOpacity = interpolate(frame, [0, 5, 25], [0, 0.9, 0], { extrapolateRight: "clamp" });
	
	const pulseScale = 1 + pulse * 0.002;

	// 魔法陣のランダム配置データを作成 (重なりすぎを防ぐため個数を3個に調整)
	const magicCirclesData = useMemo(() => {
		return [...new Array(3)].map((_, i) => {
			const seed = `magic-${rank}-${i}`;
			const size = 600 + random(seed + "size") * 400; // 少し大きく
			// 配置範囲を分散させる
			const angle = (i / 3) * Math.PI * 2 + random(seed + "ang") * 0.5;
			const radius = 300 + random(seed + "rad") * 200;
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			
			const rotationDir = random(seed + "dir") > 0.5 ? 1 : -1;
			const rotationSpeed = 0.2 + random(seed + "speed") * 2.5; // 0.3+0.7 -> 0.2+2.5 に拡大
			const asset = MAGIC_CIRCLES[Math.floor(random(seed + "asset") * MAGIC_CIRCLES.length)];
			const opacity = 0.4 + random(seed + "opacity") * 0.3;
			const blur = 1 + random(seed + "blur") * 4;
			return { size, x, y, rotationDir, rotationSpeed, asset, opacity, blur };
		});
	}, [rank]);

	const getRankColors = (r: number) => {
		if (r === 1) return { primary: "#d000ff", glow: "rgba(208, 0, 255, 0.8)" };
		return { primary: "#a200ff", glow: "rgba(162, 0, 255, 0.8)" };
	};

	const { primary, glow } = getRankColors(rank);

	if (!liver) return null;

	return (
		<AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
			<TimeBackground overlayColor={primary + "33"} hideBackground hideBaseVideo />
			
			<AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
				<ImpactEffect color={primary} intensity="high" beatPulse={pulse} />
			</AbsoluteFill>

			{/* 魔法陣演出エリア (背景) */}
			<AbsoluteFill style={{ zIndex: 10, overflow: "hidden" }}>
				{magicCirclesData.map((m, i) => {
					// 0.3秒ずつのスタッガーディレイを計算
					const delayFrames = i * 0.3 * fps;
					const circleEntrance = spring({
						frame: localFrame - delayFrames,
						fps,
						config: { damping: 12, stiffness: 100 },
					});

					return (
						<React.Fragment key={i}>
							{/* 魔法陣本体 */}
							<div
								style={{
									position: "absolute",
									left: "50%",
									top: "50%",
									width: m.size,
									height: m.size,
									marginLeft: -m.size / 2 + m.x,
									marginTop: -m.size / 2 + m.y,
									transform: `rotate(${frame * m.rotationSpeed * m.rotationDir}deg) scale(${circleEntrance})`,
									opacity: m.opacity * circleEntrance,
									filter: `blur(${m.blur}px) brightness(1.5)`,
									zIndex: 2,
								}}
							>
								<Img 
									src={staticFile(`assets/magic/${m.asset}`)} 
									style={{ width: "100%", height: "100%", objectFit: "contain" }}
								/>
							</div>

							{/* 魔法陣から放たれる輝光 (Light Burst/Rays) */}
							<div
								style={{
									position: "absolute",
									left: "50%",
									top: "50%",
									width: m.size * 2,
									height: m.size * 2,
									marginLeft: -m.size + m.x,
									marginTop: -m.size + m.y,
									background: `radial-gradient(circle, ${primary}66 0%, transparent 70%)`,
									transform: `scale(${circleEntrance * (1 + pulse * 0.1)})`,
									opacity: m.opacity * 0.4 * circleEntrance * (0.8 + Math.sin(frame / 5) * 0.2),
									filter: "blur(40px)",
									zIndex: 1,
								}}
							/>
							
							{/* 放射状の光の筋 (Rays) */}
							{[...new Array(12)].map((_, j) => (
								<div
									key={`ray-${i}-${j}`}
									style={{
										position: "absolute",
										left: "50%",
										top: "50%",
										width: 4,
										height: m.size * 1.5,
										marginLeft: -2 + m.x,
										marginTop: -m.size * 0.75 + m.y,
										backgroundColor: primary,
										boxShadow: `0 0 20px ${primary}`,
										transform: `rotate(${j * 30 + frame * 0.2 * m.rotationDir}deg) scaleY(${circleEntrance})`,
										opacity: m.opacity * 0.3 * circleEntrance,
										filter: "blur(2px)",
										zIndex: 0,
									}}
								/>
							))}
						</React.Fragment>
					);
				})}
			</AbsoluteFill>

			{/* 紙吹雪演出 */}
			<AbsoluteFill style={{ zIndex: 110 }}>
				<Confetti count={150} colors={[primary, "#ffffff", "#ffd700", "#ff0080"]} />
			</AbsoluteFill>

			{/* メインコンテンツエリア */}
			<AbsoluteFill
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					fontFamily: '"Mochiy Pop One", sans-serif',
					color: "white",
					zIndex: 120,
				}}
			>
				{/* カウントアップ数字 (タイトル) - 画面上部に配置 */}
				<div style={{ marginTop: 80, transform: `scale(${pulseScale})` }}>
					<MorphingTitle
						text={title}
						fontSize={220}
						style={{
							textShadow: `0 0 30px ${primary}, 0 0 60px ${primary}`,
						}}
					/>
				</div>

				{/* ライバー画像 - もっと大きく、フレームを豪華に */}
				<div style={{
					position: "relative",
					width: 850,
					height: 850,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginTop: 10,
					transform: `scale(${imageScale}) rotateX(10deg)`,
					opacity: imageOpacity
				}}>
					{/* 外側の装飾フレーム (回転する豪華な枠) */}
					{[...new Array(4)].map((_, i) => (
						<div 
							key={i}
							style={{
								position: "absolute",
								width: 780 + i * 35,
								height: 780 + i * 35,
								borderRadius: i % 2 === 0 ? "20%" : "50%",
								border: `${3 - i * 0.5}px solid ${primary}`,
								boxShadow: `0 0 40px ${glow}, inset 0 0 20px ${glow}`,
								opacity: 0.8 - i * 0.15,
								transform: `rotate(${frame * (i % 2 === 0 ? 0.3 : -0.2) * (i + 1)}deg)`,
							}} 
						/>
					))}
					
					{/* 強い後光レイヤー */}
					<div style={{
						position: "absolute",
						width: 900,
						height: 900,
						background: `radial-gradient(circle, ${primary}99 0%, transparent 70%)`,
						opacity: 0.4 + pulse * 0.2,
						filter: "blur(60px)",
					}} />

					<div style={{
						width: 750,
						height: 750,
						borderRadius: "50%",
						overflow: "hidden",
						border: `8px solid white`, 
						boxShadow: `0 0 120px ${primary}, 0 0 40px white`, 
						position: "relative",
						backgroundColor: "#000",
						zIndex: 5,
					}}>
						<Img
							src={
								liver.saved_to 
									? staticFile(liver.saved_to)
									: (liver.image_url.startsWith('http') ? liver.image_url : staticFile(liver.image_url))
							}
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
						<AbsoluteFill style={{ 
							background: `radial-gradient(circle, transparent 20%, ${primary}66 100%)`,
							mixBlendMode: "screen"
						}} />
					</div>
				</div>

				{/* ニックネーム - タイプライター */}
				<h2 style={{ 
					fontSize: 100, 
					marginTop: 30, 
					textShadow: `0 0 30px ${glow}, 0 0 60px ${glow}, 0 0 100px ${primary}`, 
					fontWeight: 900,
					color: "#fff",
					opacity: nameOpacity,
					transform: `translateY(${nameY}px)`,
					letterSpacing: "4px",
					minHeight: "120px",
				}}>
					{displayedName}
				</h2>
			</AbsoluteFill>

			{/* 全体のフラッシュ演出 */}
			<AbsoluteFill style={{ 
				backgroundColor: "white", 
				opacity: flashOpacity, 
				pointerEvents: "none",
				zIndex: 1000,
				mixBlendMode: "overlay"
			}} />

			<CinematicBorder color={primary} glowColor={glow} />
		</AbsoluteFill>
	);
};
