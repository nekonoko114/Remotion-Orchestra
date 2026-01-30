import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig } from "remotion";
import RANKING_DATA_JSON from "./data.json";
import type { Liver } from "./types";
import {
  wipeTransition,
  slideTransition,
  spinTransition,
  zoomTransition,
} from "./CustomTransitions";

const RANKING_DATA = RANKING_DATA_JSON as Liver[];
import { EndingLogoTime as EndingLogo } from "./EndingLogoTime";
import { TimeBackground } from "./TimeBackground";
import { OpeningTitleTime as OpeningTitle } from "./OpeningTitleTime";
import { RankingGroupTime as RankingGroup } from "./RankingGroupTime";
import { TopRankReveal } from "./TopRankReveal";

// Export duration constants for Root.tsx
export const OPENING_SEC = 5;
export const GROUP_SEC = 5;
export const TOP_RANK_SEC = 5.5;
export const ENDING_SEC = 5;
export const TRANSITION_FRAMES = 15;


export const RankingTime = () => {
	const { fps } = useVideoConfig();

	// Duration Logic (Frames)
	const OPENING_DURATION = OPENING_SEC * fps;
	const GROUP_DURATION = GROUP_SEC * fps;
	const TOP_RANK_DURATION = TOP_RANK_SEC * fps;
	const ENDING_DURATION = ENDING_SEC * fps;
	const TRANSITION_DURATION = TRANSITION_FRAMES;


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

				{/* Transition 1: Opening -> Top 10-7 (WIPE from Left) */}
				<TransitionSeries.Transition
					presentation={wipeTransition({ direction: "from-left" })}
					timing={timing}
				/>

				{/* 2. Group: 10位〜7位 */}
				<TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
					<RankingGroup
						title={"TOP\n10~7"}
						livers={RANKING_DATA.filter((d) => d.rank >= 7 && d.rank <= 10)}
					/>
				</TransitionSeries.Sequence>

				{/* Transition 2: Group 1 -> Group 2 (SLIDE / Whip Pan from Right) */}
				<TransitionSeries.Transition
					presentation={slideTransition({ direction: "from-right" })}
					timing={timing}
				/>

				{/* 3. Group: 6位〜4位 */}
				<TransitionSeries.Sequence durationInFrames={GROUP_DURATION}>
					<RankingGroup
						title={"TOP\n6~4"}
						livers={RANKING_DATA.filter((d) => d.rank >= 4 && d.rank <= 6)}
					/>
				</TransitionSeries.Sequence>

				{/* Transition 3: Group 2 -> 3rd Place (WIPE from Top) */}
				<TransitionSeries.Transition
					presentation={wipeTransition({ direction: "from-top" })}
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

				{/* Transition 4: 3rd -> 2nd (SPIN) */}
				<TransitionSeries.Transition
					presentation={spinTransition()}
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

				{/* Transition 5: 2nd -> Champion (ZOOM) */}
				<TransitionSeries.Transition
					presentation={zoomTransition({ direction: "in" })}
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

				{/* 7. Ending Logo (Hard Cut for Visibility) */}
				<TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
					<EndingLogo />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
