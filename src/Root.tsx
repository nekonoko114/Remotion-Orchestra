import { Composition } from "remotion";
import scenarioData from "./ai_scenario.json";
import { CatsAdventure } from "./compositions/CatsAdventure";
import { CyberpunkBattle } from "./compositions/CyberpunkBattle";
import { JumpCutComposition } from "./compositions/LiverFormatter/JumpCutComposition";
import liverFormatterSubtitles from "./compositions/LiverFormatter/subtitles.json";
import { calculateCuts } from "./compositions/LiverFormatter/utils/calculate-cuts";
import { AutoCutComposition } from "./compositions/TikTokLiver/AutoCut/AutoCutComposition";
import { CatRabbitEnjoy } from "./compositions/TikTokLiver/Automation/CatRabbitEnjoy";
import { TikTokBattle } from "./compositions/TikTokLiver/Battle/TikTokBattle";
import { RankingComposition } from "./compositions/TikTokLiver/Ranking/RankingComposition";
import { EffectsCatalog } from "./compositions/VFXLibrary/EffectsCatalog";
import { JsonDrivenVideo } from "./compositions/VFXLibrary/JsonDrivenVideo";
import { ThreeDTextScene } from "./compositions/VFXLibrary/ThreeDTextScene";
import { VFXShowreel } from "./compositions/VFXLibrary/VFXShowreel";
import { BattleVideo } from "./compositions/VideoFactory/BattleVideo";
import { MyVideo } from "./compositions/VideoFactory/MyVideo";
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
const LIVER_FORMATTER_FPS = 30;

// JOL Ranking Settings
const JOL_RANKING_FPS = 60;
const JOL_RANKING_DURATION =
	OPENING_SEC * JOL_RANKING_FPS +
	TRANSITION_FRAMES +
	GROUP_SEC * JOL_RANKING_FPS + // Top 10-7
	TRANSITION_FRAMES +
	GROUP_SEC * JOL_RANKING_FPS + // Top 6-4
	TRANSITION_FRAMES +
	TOP_RANK_SEC * JOL_RANKING_FPS + // Rank 3
	TRANSITION_FRAMES +
	TOP_RANK_SEC * JOL_RANKING_FPS + // Rank 2
	TRANSITION_FRAMES +
	TOP_RANK_SEC * JOL_RANKING_FPS + // Rank 1
	LAST_TRANSITION_FRAMES +
	ENDING_SEC * JOL_RANKING_FPS -
	200; // Correction to match the actual content end (Timeline adjustment)

export const RemotionRoot: React.FC = () => {
	// LiverFormatter Duration Calculation
	const liverFormatterDuration = React.useMemo(() => {
		const words = liverFormatterSubtitles.words.map((w: any) => ({
			...w,
			segmentId: 0,
		}));
		const clips = calculateCuts(words);
		const totalSeconds = clips.reduce((acc, clip) => acc + clip.duration, 0);
		return Math.ceil(totalSeconds * LIVER_FORMATTER_FPS);
	}, []);

	return (
		<>
			<Composition
				id="CyberpunkBattle"
				component={CyberpunkBattle}
				durationInFrames={900}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="CatsAdventure"
				component={CatsAdventure}
				durationInFrames={600}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="TikTokRanking"
				component={RankingComposition}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="TikTokBattle"
				component={TikTokBattle}
				durationInFrames={255}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="CatRabbitEnjoy"
				component={CatRabbitEnjoy}
				durationInFrames={1200}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="JsonDrivenVideo"
				component={JsonDrivenVideo}
				durationInFrames={
					scenarioData.timeline[scenarioData.timeline.length - 1].end_frame
				}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="PCRanking"
				component={RankingComposition}
				durationInFrames={300}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="TikTokAutoCut"
				component={AutoCutComposition}
				durationInFrames={270}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="VFXShowreel"
				component={VFXShowreel}
				durationInFrames={390}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="EffectsCatalog"
				component={EffectsCatalog}
				durationInFrames={1600}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="ThreeDTextScene"
				component={ThreeDTextScene}
				durationInFrames={300}
				fps={30}
				width={1920}
				height={1080}
			/>
			{/* Imported from video-factory-v1 */}
			<Composition
				id="JOL-Ranking-Vertical"
				component={RankingVideo}
				durationInFrames={Math.ceil(JOL_RANKING_DURATION)}
				fps={JOL_RANKING_FPS}
				width={1080}
				height={1920}
			/>
			<Composition
				id="JOL-Ranking-time"
				component={RankingTime}
				durationInFrames={Math.ceil(JOL_RANKING_DURATION)}
				fps={JOL_RANKING_FPS}
				width={1080}
				height={1920}
			/>
			<Composition
				id="JOL-Video"
				component={MyVideo}
				durationInFrames={150} // 5秒 (30fps * 5)
				fps={60}
				width={1920}
				height={1080}
			/>
			<Composition
				id="JOL-Battle"
				component={BattleVideo}
				durationInFrames={1800}
				fps={30}
				width={1080}
				height={1920}
			/>

			{/* Imported from liver-formatter */}
			<Composition
				id="LiverFormatter"
				component={JumpCutComposition}
				durationInFrames={liverFormatterDuration}
				fps={LIVER_FORMATTER_FPS}
				width={1080}
				height={1920}
			/>
		</>
	);
};
