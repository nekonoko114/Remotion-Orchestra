import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, useVideoConfig, Audio, staticFile } from "remotion";
import RANKING_DATA_TIME_JSON from "./data-time.json";
import type { Liver } from "./types";
import {
  wipeTransition,
  spinTransition,
  zoomTransition,
} from "./CustomTransitions";
import { EndingLogoTime as EndingLogo } from "./EndingLogoTime";
import { OpeningTitleTime as OpeningTitle } from "./OpeningTitleTime";
import { RankingGroupTime as RankingGroup } from "./RankingGroupTime";
import { TopRankRevealTime as TopRankReveal } from "./TopRankRevealTime";
import { useBeatValue } from "./utils/beat-sync";
import { TimeBackground } from "./TimeBackground";

const BPM = 180;
const BGM_SOURCE = staticFile("assets/audio/music/Breathe-Loud.mp3");
const BGM_START_FROM = 0.0; // Seconds

// Export duration constants for Root.tsx
// 180 BPM, 30fps -> 1 beat = 10 frames.
// 8.0s = 240 frames = 24 beats (6 measures)
export const OPENING_SEC = 8.0;
// 5.333...s = 160 frames = 16 beats (4 measures)
export const GROUP_SEC = 160 / 30;
export const TOP_RANK_SEC = 160 / 30;
export const ENDING_SEC = 160 / 30;
export const TRANSITION_FRAMES = 10; // Exactly 1 beat


import { CinematicBorder } from "./CinematicBorder";

export const RankingTime = (props: { data?: Liver[] }) => {
	const { fps } = useVideoConfig();

	// Use data from props if available, otherwise fallback to local JSON
	const RANKING_DATA = props.data || (RANKING_DATA_TIME_JSON as Liver[]);

	// Duration Logic (Frames)
	const OPENING_DURATION = OPENING_SEC * fps;
	const GROUP_DURATION = GROUP_SEC * fps;
	const TOP_RANK_DURATION = TOP_RANK_SEC * fps;
	const ENDING_DURATION = ENDING_SEC * fps;
	const TRANSITION_DURATION = TRANSITION_FRAMES;


	// Define the timing
	const timing = linearTiming({ durationInFrames: TRANSITION_DURATION });

	const { pulse } = useBeatValue(BPM);
	const beatScale = 1 + pulse * 0.008;

	return (
		<AbsoluteFill>
			<TimeBackground />
			<Audio src={BGM_SOURCE} loop startFrom={BGM_START_FROM * fps} />
            
            {/* PERSISTENT BORDER OVERLAY */}
            <CinematicBorder 
                color="#ff0000" 
                glowColor="rgba(255, 0, 0, 0.6)" 
            />

			<AbsoluteFill style={{ transform: `scale(${beatScale})` }}>
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
					presentation={wipeTransition({ direction: "from-right" })}
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
						liver={RANKING_DATA.find((d) => d.rank === 3) || RANKING_DATA[0]}
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
						liver={RANKING_DATA.find((d) => d.rank === 2) || RANKING_DATA[1]}
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
						liver={RANKING_DATA.find((d) => d.rank === 1) || RANKING_DATA[2]}
					/>
				</TransitionSeries.Sequence>

				{/* 7. Ending Logo (Glitch Transition for high energy end) */}
				<TransitionSeries.Transition
					presentation={wipeTransition({ direction: "from-right" })}
					timing={timing}
				/>

				<TransitionSeries.Sequence durationInFrames={ENDING_DURATION}>
					<EndingLogo />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
