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
import {
  RankingTime,
  OPENING_SEC as OPENING_SEC_TIME,
  GROUP_SEC as GROUP_SEC_TIME,
  TOP_RANK_SEC as TOP_RANK_SEC_TIME,
  ENDING_SEC as ENDING_SEC_TIME,
  TRANSITION_FRAMES as TRANSITION_FRAMES_TIME,
} from "./compositions/VideoFactory/RankingTime";
import { BattleCrystal } from "./compositions/VideoFactory/BattleCrystal";
import { BattleInferno } from "./compositions/VideoFactory/BattleInferno";
import { BattleWater } from "./compositions/VideoFactory/BattleWater";
import { BattleKawaii } from "./compositions/VideoFactory/BattleKawaii";
import { AssetCatalog } from "./compositions/VideoFactory/Assets/Catalog";
import { LuxuryGoldLoop } from "./compositions/AssetGenerator/Gold/LuxuryGoldLoop";
import { NarandaMamadeMV } from "./compositions/NarandaMamade";
import narandaMamadeMusicAnalysis from "./compositions/NarandaMamade/music_analysis.json";
import "./index.css";
import React from "react";

const LIVER_FORMATTER_FPS = 30;
const JOL_RANKING_FPS = 30;

// Calculate Vertical Duration
const JOL_RANKING_DURATION_VERTICAL =
  (OPENING_SEC + GROUP_SEC * 2 + TOP_RANK_SEC * 3 + ENDING_SEC) *
    JOL_RANKING_FPS -
  (5 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

// Calculate Time Duration (Correctly using its own 7s opening)
const JOL_RANKING_DURATION_TIME =
  (OPENING_SEC_TIME +
    GROUP_SEC_TIME * 2 +
    TOP_RANK_SEC_TIME * 3 +
    ENDING_SEC_TIME) *
    JOL_RANKING_FPS -
  5 * TRANSITION_FRAMES_TIME;

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
        id="CatsAdventure"
        component={CatsAdventure}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
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
        id="AssetCatalog"
        component={AssetCatalog}
        durationInFrames={1500}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="NarandaMamadeMV"
        component={NarandaMamadeMV}
        durationInFrames={Math.ceil(narandaMamadeMusicAnalysis.duration * 30)}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
