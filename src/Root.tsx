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
import { BattleCrystal } from "./compositions/VideoFactory/BattleCrystal";
import { BattleInferno } from "./compositions/VideoFactory/BattleInferno";
import { BattleWater } from "./compositions/VideoFactory/BattleWater";
import { BattleKawaii } from "./compositions/VideoFactory/BattleKawaii";
import { AssetCatalog } from "./compositions/VideoFactory/Assets/Catalog";
import "./index.css";
import React from "react";

const LIVER_FORMATTER_FPS = 30;
const JOL_RANKING_FPS = 60;

// Calculate Base Duration (Same for both)
const BASE_DURATION =
	(OPENING_SEC +
		GROUP_SEC * 2 +
		TOP_RANK_SEC * 3 +
		ENDING_SEC) *
	JOL_RANKING_FPS;

// Calculate Vertical Duration (With 5 standard transitions + 1 last transition)
const JOL_RANKING_DURATION_VERTICAL =
	BASE_DURATION - (5 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

// Calculate Time Duration (With 5 standard transitions + 0 last transition/hard cut)
const JOL_RANKING_DURATION_TIME =
	BASE_DURATION - (5 * TRANSITION_FRAMES);

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
				component={BattleCrystal}
				durationInFrames={844} // Trimmed version: 13 measures + 3s ending
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="JOL-Battle-Inferno"
				component={BattleInferno}
				durationInFrames={844}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="JOL-Battle-Water"
				component={BattleWater}
				durationInFrames={652}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="JOL-Battle-Crystal"
				component={BattleCrystal}
				durationInFrames={652}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="JOL-Battle-Kawaii"
				component={BattleKawaii}
				durationInFrames={684}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="LiverFormatter"
				component={JumpCutComposition}
				durationInFrames={liverFormatterDuration}
				fps={LIVER_FORMATTER_FPS}
				width={1080}
				height={1920}
			/>
			<Composition
				id="AssetCatalog"
				component={AssetCatalog}
				durationInFrames={1500}
				fps={60}
				width={1080}
				height={1920}
			/>
		</>
	);
};
