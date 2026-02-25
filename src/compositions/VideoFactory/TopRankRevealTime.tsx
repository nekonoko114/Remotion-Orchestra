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

const BPM = 180;

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
	const { fps, width, height } = useVideoConfig();

	const { pulse } = useBeatValue(BPM);
	
	const snapReduction = pulse * 0.05;
	const localFrame = frame - snapReduction;
	
	const entrance = spring({
		frame: localFrame,
		fps,
		config: { damping: 12, stiffness: 100 },
	});

	const nameEntrance = spring({
		frame: localFrame - 22,
		fps,
		config: { damping: 14, stiffness: 120 },
	});

	// Dynamics based on music
	const imageScale = interpolate(frame, [0, 15], [0.8, 1.0], {
		extrapolateRight: "clamp",
	}) * (1 + pulse * 0.002);
	const imageOpacity = interpolate(frame, [0, 10], [0, 1]);
	
	const nameY = interpolate(nameEntrance, [0, 1], [100, 0]);
	const nameOpacity = interpolate(nameEntrance, [0, 1], [0, 1]);
	
	const flashOpacity = interpolate(frame, [0, 5, 20], [0, 0.8, 0], { extrapolateRight: "clamp" });
	
	const pulseScale = 1 + pulse * 0.001;

	// 魔法陣のランダム配置データを作成
	const magicCirclesData = useMemo(() => {
		return [...new Array(5)].map((_, i) => {
			const seed = `magic-${rank}-${i}`;
			const size = 400 + random(seed + "size") * 600;
			const x = (random(seed + "x") - 0.5) * width * 0.8;
			const y = (random(seed + "y") - 0.5) * height * 0.6;
			const rotationDir = random(seed + "dir") > 0.5 ? 1 : -1;
			const rotationSpeed = 0.5 + random(seed + "speed") * 1.5;
			const asset = MAGIC_CIRCLES[Math.floor(random(seed + "asset") * MAGIC_CIRCLES.length)];
			const opacity = 0.3 + random(seed + "opacity") * 0.4;
			const blur = 2 + random(seed + "blur") * 8;
			return { size, x, y, rotationDir, rotationSpeed, asset, opacity, blur };
		});
	}, [rank, width, height]);

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
				{magicCirclesData.map((m, i) => (
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
								transform: `rotate(${frame * m.rotationSpeed * m.rotationDir}deg) scale(${entrance})`,
								opacity: m.opacity * entrance,
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
								transform: `scale(${entrance * (1 + pulse * 0.1)})`,
								opacity: m.opacity * 0.4 * entrance * (0.8 + Math.sin(frame / 5) * 0.2),
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
									transform: `rotate(${j * 30 + frame * 0.2 * m.rotationDir}deg) scaleY(${entrance})`,
									opacity: m.opacity * 0.3 * entrance,
									filter: "blur(2px)",
									zIndex: 0,
								}}
							/>
						))}
					</React.Fragment>
				))}
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

				{/* ライバー画像 */}
				<div style={{
					position: "relative",
					width: 700,
					height: 700,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginTop: 30,
					transform: `scale(${imageScale}) rotateX(15deg)`,
					opacity: imageOpacity
				}}>
					{/* 背面のネオンリング */}
					{[...new Array(3)].map((_, i) => (
						<div 
							key={i}
							style={{
								position: "absolute",
								width: 650 + i * 40,
								height: 650 + i * 40,
								borderRadius: "50%",
								border: `2px solid ${primary}`,
								boxShadow: `0 0 30px ${glow}`,
								opacity: 0.6 - i * 0.2,
								transform: `rotate(${frame * (i + 1) * 0.5}deg)`,
							}} 
						/>
					))}

					<div style={{
						width: 600,
						height: 600,
						borderRadius: "50%",
						overflow: "hidden",
						border: `6px solid ${primary}`, 
						boxShadow: `0 0 100px ${glow}`, 
						position: "relative",
						backgroundColor: "#000",
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
							background: `radial-gradient(circle, transparent 30%, ${primary}55 100%)`,
							mixBlendMode: "screen"
						}} />
					</div>
				</div>

				{/* ニックネーム */}
				<h2 style={{ 
					fontSize: 90, 
					marginTop: 40, 
					textShadow: `0 0 30px ${glow}, 0 0 60px ${glow}`, 
					fontWeight: 900,
					color: "#fff",
					opacity: nameOpacity,
					transform: `translateY(${nameY}px)`,
				}}>
					{liver.nickname}
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
