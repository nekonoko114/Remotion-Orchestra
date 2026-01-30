import type React from "react";
import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { AdaptiveContainer } from "../../../components/TikTok/AdaptiveContainer";
import { LiverAvatar } from "../../../components/TikTok/LiverAvatar";
import { FloatingHearts, LiveBadge } from "../../../components/TikTok/Overlays";
import { KineticText } from "../../../components/effects/KineticText";
import { FilmGrain } from "../../../components/overlays/FilmGrain";
import { LightLeak } from "../../../components/overlays/LightLeak";
import { SpeedLines } from "../../../components/overlays/SpeedLines";
import { FlashTransition } from "../../../components/transitions/FlashTransition";
import { ZoomBlurTransition } from "../../../components/transitions/ZoomBlurTransition";
import { RANKING_DATA } from "../mockData";

export const RankingComposition: React.FC = () => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();
	const isPortrait = height > width;

	return (
		<AdaptiveContainer>
			<AbsoluteFill
				style={{
					background: "linear-gradient(180deg, #0a0a14 0%, #16213e 100%)",
					display: "flex",
					flexDirection: isPortrait ? "column" : "column",
					alignItems: "center",
					paddingTop: isPortrait ? "100px" : "60px",
				}}
			>
				<FilmGrain />
				<LightLeak />

				<LiveBadge />
				<div
					style={{
						transform: isPortrait ? "none" : "scale(1.5)",
						transformOrigin: "right bottom",
					}}
				>
					<FloatingHearts />
				</div>

				<Sequence durationInFrames={100}>
					<ZoomBlurTransition type="in" duration={20}>
						<div
							style={{
								marginBottom: isPortrait ? "60px" : "30px",
								textAlign: "center",
								height: "100px",
								width: "100%",
							}}
						>
							<KineticText
								text="WEEKLY RANKING"
								style={{
									fontSize: isPortrait ? "72px" : "90px",
									fontWeight: "950",
									color: "#fff",
									textShadow: "0 0 20px rgba(255,45,85,0.8)",
								}}
							/>
						</div>
					</ZoomBlurTransition>
				</Sequence>

				<div
					style={{
						display: "flex",
						flexDirection: isPortrait ? "column" : "row",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						gap: isPortrait ? "15px" : "30px",
						zIndex: 10,
						flexWrap: isPortrait ? "nowrap" : "wrap",
						padding: "0 40px",
					}}
				>
					{RANKING_DATA.map((liver, index) => {
						const rank = index + 1;
						const delay = index * 15 + 40;

						return (
							<Sequence
								key={liver.id}
								from={delay}
								durationInFrames={300 - delay}
							>
								{rank === 1 && frame > delay && (
									<SpeedLines count={80} color="rgba(255, 215, 0, 0.4)" />
								)}

								<LiverAvatar
									name={liver.name}
									score={liver.score}
									imageUrl={liver.imageUrl}
									rank={rank}
									delay={0}
								/>

								{frame === delay && <FlashTransition duration={10} />}
							</Sequence>
						);
					})}
				</div>

				<Sequence from={180}>
					<AbsoluteFill
						style={{
							justifyContent: "flex-end",
							paddingBottom: isPortrait ? "120px" : "60px",
							alignItems: "center",
							pointerEvents: "none",
						}}
					>
						<ZoomBlurTransition type="in" duration={15}>
							<div
								style={{
									backgroundColor: "#ff2d55",
									color: "#fff",
									padding: isPortrait ? "24px 80px" : "20px 60px",
									borderRadius: "60px",
									fontSize: isPortrait ? "36px" : "32px",
									fontWeight: "900",
									boxShadow: "0 0 30px rgba(255,45,85,0.6)",
									letterSpacing: "2px",
								}}
							>
								FOLLOW TOP LIVERS!
							</div>
						</ZoomBlurTransition>
						{frame === 180 && <FlashTransition duration={20} />}
					</AbsoluteFill>
				</Sequence>
			</AbsoluteFill>
		</AdaptiveContainer>
	);
};
