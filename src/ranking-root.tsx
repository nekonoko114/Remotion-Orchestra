import { Composition } from "remotion";
import {
	ENDING_SEC,
	GROUP_SEC,
	LAST_TRANSITION_FRAMES,
	OPENING_SEC,
	RankingVideo,
	TOP_RANK_SEC,
	TRANSITION_FRAMES,
	GRID_BRIDGE_SEC,
} from "./compositions/VideoFactory/RankingVideo";
import {
	RankingTime,
	ENDING_SEC as ENDING_SEC_TIME,
	GROUP_SEC as GROUP_SEC_TIME,
	OPENING_SEC as OPENING_SEC_TIME,
	TOP_RANK_SEC as TOP_RANK_SEC_TIME,
	TRANSITION_FRAMES as TRANSITION_FRAMES_TIME,
	GRID_BRIDGE_SEC as GRID_BRIDGE_SEC_TIME,
} from "./compositions/VideoFactory/RankingTime";
import "./index.css";
import React from "react";

const JOL_RANKING_FPS = 30;

const BASE_DURATION =
	(OPENING_SEC +
		GROUP_SEC * 2 +
		GRID_BRIDGE_SEC +
		TOP_RANK_SEC * 3 +
		ENDING_SEC) *
	JOL_RANKING_FPS;

const BASE_DURATION_TIME =
	(OPENING_SEC_TIME +
		GROUP_SEC_TIME * 2 +
		GRID_BRIDGE_SEC_TIME +
		TOP_RANK_SEC_TIME * 3 +
		ENDING_SEC_TIME) *
	JOL_RANKING_FPS;

const JOL_RANKING_DURATION_VERTICAL =
	BASE_DURATION - (6 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

const JOL_RANKING_DURATION_TIME =
	BASE_DURATION_TIME - (7 * TRANSITION_FRAMES_TIME);

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
