import { Composition } from "remotion";
import {
	ENDING_SEC,
	GROUP_SEC,
	LAST_TRANSITION_FRAMES,
	OPENING_SEC,
	RankingVideo,
	TOP_RANK_SEC,
	TRANSITION_FRAMES,
} from "./compositions/VideoFactory/RankingVideo";
import { RankingTime } from "./compositions/VideoFactory/RankingTime";
import "./index.css";
import React from "react";

const JOL_RANKING_FPS = 30;

const BASE_DURATION =
	(OPENING_SEC +
		GROUP_SEC * 2 +
		TOP_RANK_SEC * 3 +
		ENDING_SEC) *
	JOL_RANKING_FPS;

const JOL_RANKING_DURATION_VERTICAL =
	BASE_DURATION - (5 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

const JOL_RANKING_DURATION_TIME =
	BASE_DURATION - (5 * TRANSITION_FRAMES);

export const RankingRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="JOL-Ranking-Vertical"
				component={RankingVideo}
				durationInFrames={Math.ceil(JOL_RANKING_DURATION_VERTICAL)}
				fps={JOL_RANKING_FPS}
				width={1080}
				height={1920}
			/>
			<Composition
				id="JOL-Ranking-time"
				component={RankingTime}
				durationInFrames={Math.ceil(JOL_RANKING_DURATION_TIME)}
				fps={JOL_RANKING_FPS}
				width={1080}
				height={1920}
			/>
		</>
	);
};
