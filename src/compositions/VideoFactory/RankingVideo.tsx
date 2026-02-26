import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useVideoConfig, Audio, staticFile, useCurrentFrame, interpolate, interpolateColors } from "remotion";
import { useMemo } from "react";
import RANKING_DATA_JSON from "./data.json";
import type { Liver } from "./types";

const RANKING_DATA = RANKING_DATA_JSON as Liver[];
import { EndingLogo } from "./EndingLogo";
import { OpeningTitle } from "./OpeningTitle";
import { RankingGroup } from "./RankingGroup";
import { TopRankReveal } from "./TopRankReveal";
import { GridBridge } from "./GridBridge";
import { useBeatValue } from "./utils/beat-sync";

const BPM = 152;

// Export duration constants for Root.tsx
export const OPENING_SEC = 7;
export const GROUP_SEC = 5;
export const TOP_RANK_SEC = 5.6; // ~12 beats exactly
export const GRID_BRIDGE_SEC = 8; // 8 seconds bridge
export const ENDING_SEC = 5;
export const TRANSITION_FRAMES = 14; // Exactly half a beat (28/2)
export const LAST_TRANSITION_FRAMES = 10;

const BGM_START_FROM = 0; // 秒単位で指定。

export const RankingVideo = () => {
	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();

	const borderColor = useMemo(() => {
		if (frame >= 720) {
			return "#FF0000"; // 720fr以降はずっと赤
		}

		// 720未満：BPM/6 の速度で回転
		let h = 0;
		for (let i = 0; i < frame; i++) {
			h += ((BPM / 6) / 60 / fps) * 360;
		}
		const normalColor = `hsl(${h % 360}, 100%, 50%)`;
		
		// 720に向けた赤への滑らかな遷移（690fr〜720fr）
		if (frame > 690) {
			const progress = interpolate(frame, [690, 720], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
			return interpolateColors(progress, [0, 1], [normalColor, "#FF0000"]);
		}
		
		return normalColor;
	}, [frame, fps]);

	const boxShadowColor = borderColor;

	// Duration Logic (Frames)
	const OPENING_DURATION = OPENING_SEC * fps;
	const GROUP_DURATION = GROUP_SEC * fps;
	const TOP_RANK_DURATION = TOP_RANK_SEC * fps;
	const GRID_BRIDGE_DURATION = GRID_BRIDGE_SEC * fps;
	const ENDING_DURATION = ENDING_SEC * fps;
	const TRANSITION_DURATION = TRANSITION_FRAMES;
	const LAST_TRANSITION_DURATION = LAST_TRANSITION_FRAMES;

	// Define the transition (3D Flip)
	const transition = flip({
		direction: "from-bottom", // Flips up like a fresh card
		perspective: 1000,
	});

	// Define the timing
	const timing = linearTiming({ durationInFrames: TRANSITION_DURATION });

	const { pulse } = useBeatValue(BPM);
	const beatScale = 1 + pulse * 0.015; // わずかな振動

	return (
		<AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
			<Audio
				src={staticFile("assets/audio/music/Break_the_Shell.mp3")}
				loop
				startFrom={Math.floor(BGM_START_FROM * fps)}
			/>
			
			<AbsoluteFill style={{ transform: `scale(${beatScale})` }}>
				{/* Sequenced Content: Opening -> Ranking with TRANSITIONS */}
				<TransitionSeries>
					{/* 1. Opening Title */}
				<TransitionSeries.Sequence durationInFrames={OPENING_DURATION}>
					<OpeningTitle />
				</TransitionSeries.Sequence>

				{/* Transition 1: Opening -> Top 10-7 */}
				<TransitionSeries.Transition
					presentation={transition}
					timing={timing}
				/>

				{/* 2. Group: 10位〜7位 */}
				<TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
					<RankingGroup
						title={"TOP\n10~7"}
						livers={RANKING_DATA.filter((d) => d.rank >= 7 && d.rank <= 10)}
					/>
				</TransitionSeries.Sequence>

				{/* Transition 2: Group 1 -> Group 2 */}
				<TransitionSeries.Transition
					presentation={transition}
					timing={timing}
				/>

				{/* 3. Group: 6位〜4位 */}
				<TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
					<RankingGroup
						title={"TOP\n6~4"}
						livers={RANKING_DATA.filter((d) => d.rank >= 4 && d.rank <= 6)}
					/>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={transition}
					timing={timing}
				/>

				{/* NEW: Grid Bridge (3x3 Grid Reveal) */}
				<TransitionSeries.Sequence durationInFrames={GRID_BRIDGE_DURATION}>
					<GridBridge />
				</TransitionSeries.Sequence>

				{/* Transition from Bridge to 3rd Place */}
				<TransitionSeries.Transition
					presentation={transition}
					timing={timing}
				/>

				{/* 4. Top 3 (Reveal) */}
				<TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
					<TopRankReveal
						rank={3}
						title="3位"
						liver={RANKING_DATA.find((d) => d.rank === 3)!}
					/>
				</TransitionSeries.Sequence>

				{/* Transition 4: 3rd -> 2nd */}
				<TransitionSeries.Transition
					presentation={transition}
					timing={timing}
				/>

				{/* 5. Top 2 (Reveal) */}
				<TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
					<TopRankReveal
						rank={2}
						title="2位"
						liver={RANKING_DATA.find((d) => d.rank === 2)!}
					/>
				</TransitionSeries.Sequence>

				{/* Transition 5: 2nd -> Champion */}
				<TransitionSeries.Transition
					presentation={transition}
					timing={timing}
				/>

				{/* 6. Top 1 (Reveal) */}
				<TransitionSeries.Sequence durationInFrames={TOP_RANK_DURATION}>
					<TopRankReveal
						rank={1}
						title="1位"
						liver={RANKING_DATA.find((d) => d.rank === 1)!}
					/>
				</TransitionSeries.Sequence>

				{/* Transition 6: Champion -> Logo (SHARP TRANSITION) */}
				<TransitionSeries.Transition
					presentation={slide({ direction: "from-right" })}
					timing={linearTiming({ durationInFrames: LAST_TRANSITION_DURATION })} // Fast frames
				/>

				{/* 7. Ending Logo */}
				<TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
					<EndingLogo />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			</AbsoluteFill>

			{/* RGB GLOWING BORDER synchronized at 60% of BPM */}
			<AbsoluteFill
				style={{
					pointerEvents: "none",
					border: `15px solid ${borderColor}`,
					boxShadow: `inset 0 0 50px ${boxShadowColor}, 0 0 50px ${boxShadowColor}`,
					zIndex: 9999, // Ensure it sits on top of everything
				}}
			/>
		</AbsoluteFill>
	);
};
