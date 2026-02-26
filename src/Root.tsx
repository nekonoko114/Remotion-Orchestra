import { Composition } from "remotion";
import { CatsAdventure } from "./compositions/CatsAdventure";
import { EffectsCatalog } from "./compositions/VFXLibrary/EffectsCatalog";
import { JsonDrivenVideo } from "./compositions/VFXLibrary/JsonDrivenVideo";
import { ThreeDTextScene } from "./compositions/VFXLibrary/ThreeDTextScene";
import { VFXShowreel } from "./compositions/VFXLibrary/VFXShowreel";


import { MyVideo } from "./compositions/VideoFactory/MyVideo";
import {
  ENDING_SEC,
  GRID_BRIDGE_SEC,
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
import { BattleWater } from "./compositions/VideoFactory/BattleWater";
import { BattleKawaii } from "./compositions/VideoFactory/BattleKawaii";
import { AssetCatalog } from "./compositions/VideoFactory/Assets/Catalog";
import { NarandaMamadeMV } from "./compositions/NarandaMamade";
import { SoregayasashisaMV } from "./compositions/Soregayasashisa";
import narandaMamadeMusicAnalysis from "./compositions/NarandaMamade/music_analysis.json";
import { GsapExample, GsapExampleSchema } from "./components/GsapExample";
import { MorphExample } from "./components/MorphExample";
import { TextMorphExample } from "./components/TextMorphExample";
import { KaleidaMorph } from "./components/KaleidaMorph";
import { NovaShowMV } from "./components/NovaShowMV";
import { AdoStyleLyric } from "./components/AdoStyleLyric";
import { NovaLyricMaster } from "./components/NovaLyricMaster";
import { KimitonaraComposition } from "./compositions/Kimitonara";
import { SkillsShowcase } from "./compositions/SkillsShowcase";
import "./index.css";
import React from "react";

const JOL_RANKING_FPS = 30;

// Calculate Vertical Duration
const JOL_RANKING_DURATION_VERTICAL =
  (OPENING_SEC + GROUP_SEC * 2 + GRID_BRIDGE_SEC + TOP_RANK_SEC * 3 + ENDING_SEC) *
    JOL_RANKING_FPS -
  (6 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

// Calculate Time Duration (Correctly using its own 7s opening)
const JOL_RANKING_DURATION_TIME =
  (OPENING_SEC_TIME +
    GROUP_SEC_TIME * 2 +
    TOP_RANK_SEC_TIME * 3 +
    ENDING_SEC_TIME) *
    JOL_RANKING_FPS -
  6 * TRANSITION_FRAMES_TIME;

export const RemotionRoot: React.FC = () => {


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
      <Composition
        id="GeminiScenarioVideo"
        component={JsonDrivenVideo}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
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
      <Composition
        id="soregayasashisa"
        component={SoregayasashisaMV}
        durationInFrames={6800} // ~226 seconds
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GSAP-Showcase"
        component={GsapExample}
        schema={GsapExampleSchema}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          text: "NOVA x GSAP x GEMINI"
        }}
      />
      <Composition
        id="MORPH-Showcase"
        component={MorphExample}
        durationInFrames={120} // 4秒
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TEXT-MORPH-Showcase"
        component={TextMorphExample}
        durationInFrames={180} // 6秒
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KALEIDA-MORPH-Showcase"
        component={KaleidaMorph}
        durationInFrames={180} // 6秒
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NOVA-SHOW-MV"
        component={NovaShowMV}
        durationInFrames={15 * 8} // 歌詞8セット分
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ADO-LYRIC-Showcase"
        component={AdoStyleLyric}
        durationInFrames={30 * 4} // 歌詞4種類分
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NOVA-LYRIC-MASTER"
        component={NovaLyricMaster}
        durationInFrames={45 * 4} // 4つの歌詞セクション
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Kimitonara"
        component={KimitonaraComposition}
        durationInFrames={30 * 222} // 3分42秒
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SkillsShowcase"
        component={SkillsShowcase}
        durationInFrames={2695} // 1795 + 900 (MV)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
