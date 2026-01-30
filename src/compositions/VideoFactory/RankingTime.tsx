import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useVideoConfig } from "remotion";
import RANKING_DATA_JSON from "./data.json";
import type { Liver } from "./types";

const RANKING_DATA = RANKING_DATA_JSON as Liver[];
import { EndingLogoTime as EndingLogo } from "./EndingLogoTime";
import { TimeBackground } from "./TimeBackground";
import { OpeningTitleTime as OpeningTitle } from "./OpeningTitleTime";
import { RankingGroupTime as RankingGroup } from "./RankingGroupTime";
import { TopRankRevealTime as TopRankReveal } from "./TopRankRevealTime";

// Export duration constants for Root.tsx
export const OPENING_SEC = 5;
export const GROUP_SEC = 5;
export const TOP_RANK_SEC = 5.5;
export const ENDING_SEC = 5;
export const TRANSITION_FRAMES = 15;
export const LAST_TRANSITION_FRAMES = 10;

export const RankingTime = () => {
	const { fps } = useVideoConfig();

	// Duration Logic (Frames)
	const OPENING_DURATION = OPENING_SEC * fps;
	const GROUP_DURATION = GROUP_SEC * fps;
	const TOP_RANK_DURATION = TOP_RANK_SEC * fps;
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

	return (
		<AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
			{/* Background persists throughout the entire video */}
			<TimeBackground />

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

				{/* Transition 3: Group 2 -> 3rd Place */}
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
	);
};
