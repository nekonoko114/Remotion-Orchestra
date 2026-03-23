import { Composition } from 'remotion';

import {
  ENDING_SEC,
  GRID_BRIDGE_SEC,
  GROUP_SEC,
  LAST_TRANSITION_FRAMES,
  OPENING_SEC,
  RankingVideo,
  TOP_RANK_SEC,
  TRANSITION_FRAMES,
} from './compositions/VideoFactory/RankingVideo';
import {
  RankingTime,
  OPENING_SEC as OPENING_SEC_TIME,
  GROUP_SEC as GROUP_SEC_TIME,
  TOP_RANK_SEC as TOP_RANK_SEC_TIME,
  ENDING_SEC as ENDING_SEC_TIME,
  TRANSITION_FRAMES as TRANSITION_FRAMES_TIME,
  GRID_BRIDGE_SEC as GRID_BRIDGE_SEC_TIME,
} from './compositions/VideoFactory/RankingTime';
import { BattleKawaii } from './compositions/VideoFactory/BattleKawaii';
import {
  PastelDreamShowcase,
  pastelDreamSchema,
} from './compositions/VideoFactory/PastelDreamShowcase';
import { NarandaMamadeMV } from './compositions/NarandaMamade';
import { SoregayasashisaMV } from './compositions/Soregayasashisa';
import narandaMamadeMusicAnalysis from './compositions/NarandaMamade/music_analysis.json';
import { NovaShowMV } from './components/NovaShowMV';
import { KimitonaraComposition } from './compositions/Kimitonara';
import { StitchOverlay } from './compositions/Stitch';
import { RookieRanking } from './compositions/VideoFactory/RookieRanking';
import { JolBattleSpiritRed } from './compositions/VideoFactory/JolBattleSpiritRed';
import { JolBattleSpiritBlue } from './compositions/VideoFactory/JolBattleSpiritBlue';
import {
  JolBattleSpiritOrange,
  JOL_ORANGE_DURATION,
} from './compositions/VideoFactory/JolBattleSpiritOrange';
import {
  JolBattleSpiritGreen,
  greenTheme,
  JOL_GREEN_DURATION,
} from './compositions/VideoFactory/JolBattleSpiritGreen';
import {
  JolBattleSpiritMagic,
  magicTheme,
  JOL_MAGIC_DURATION,
} from './compositions/VideoFactory/JolBattleSpiritMagic';
import {
  JolBattleSpeedOrange,
  speedOrangeTheme,
  JOL_SPEED_ORANGE_DURATION,
} from './compositions/VideoFactory/JolBattleSpeedOrange';
import {
  JolBattleWhiteSnow,
  JOL_WHITE_DURATION,
} from './compositions/VideoFactory/JolBattleWhiteSnow';
import {
  JolBattleSpringSakura,
  JOL_SAKURA_DURATION,
} from './compositions/VideoFactory/JolBattleSpringSakura';
import { JolBattlePattern6 } from './compositions/VideoFactory/JolBattlePattern6';
import { JolBattleReservation, ReservationBattleSchema } from './compositions/VideoFactory/JolBattleReservation';
import {
  ShowcaseBackgrounds, SHOWCASE_BG_DURATION,
  ShowcaseEffects, SHOWCASE_FX_DURATION,
  ShowcaseTransitions, SHOWCASE_TRANS_DURATION,
  ShowcaseTextLayouts, SHOWCASE_TEXT_DURATION,
} from './compositions/VideoFactory/ReusableComponentsShowcase';
import {
  TransitionsCatalogShowcase,
  TRANSITION_SHOWCASE_DURATION,
} from './compositions/VideoFactory/TransitionsCatalogShowcase';
import {
  EffectCatalogShowcase,
  EFFECT_SHOWCASE_DURATION,
} from './compositions/VideoFactory/EffectCatalogShowcase';
import { EffectCatalog } from './compositions/VideoFactory/components/EffectCatalog/effect-catalog';
import { MagicCircleShowcase } from './compositions/VideoFactory/MagicCircleShowcase';
import { AdvancedMagicCircleShowcase } from './compositions/VideoFactory/AdvancedMagicCircleShowcase';
import { TextAnimationCatalog } from './compositions/VideoFactory/TextAnimationCatalog';
import { TextEffectCatalog } from './compositions/VideoFactory/TextEffectCatalog';
import { BattleSpiritThemeSchema } from './compositions/VideoFactory/components/BattleShared/types';
import { AssetPanel } from './components/AssetPanel';
import './index.css';
import React from 'react';

const JOL_RANKING_FPS = 30;

// Calculate Vertical Duration
// Updated to 3 groups (10-8, 7-6, 5-4)
const JOL_RANKING_DURATION_VERTICAL =
  (OPENING_SEC +
    GROUP_SEC * 3 +
    GRID_BRIDGE_SEC +
    TOP_RANK_SEC * 3 +
    ENDING_SEC) *
    JOL_RANKING_FPS -
  (7 * TRANSITION_FRAMES + LAST_TRANSITION_FRAMES);

// Calculate Time Duration (Correctly using its own 7s opening)
// Updated to 3 groups (10-8, 7-6, 5-4)
const JOL_RANKING_DURATION_TIME =
  (OPENING_SEC_TIME +
    GROUP_SEC_TIME * 3 +
    GRID_BRIDGE_SEC_TIME +
    TOP_RANK_SEC_TIME * 3 +
    ENDING_SEC_TIME) *
    JOL_RANKING_FPS -
  8 * TRANSITION_FRAMES_TIME;

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
        width={2160}
        height={3840}
      />
      <Composition
        id="JOL-Battle-Kawaii"
        component={BattleKawaii}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-PastelDream"
        component={PastelDreamShowcase}
        durationInFrames={840} // 31秒から3秒減らして28秒 (840フレーム)
        fps={30}
        width={1080}
        height={1920}
        schema={pastelDreamSchema}
        defaultProps={{
          player1: {
            name: '🌸さくら🌸',
            image: 'assets/images-01/l5332541.jpeg',
            color: '#FFB6C1',
          },
          player2: {
            name: '🌸さくら🌸',
            image: 'assets/images-01/l5332541-01.png',
            color: '#FFB6C1',
          },
          player3: {
            name: '🌸さくら🌸',
            image: 'assets/images-01/l5332541-02.png',
            color: '#FFB6C1',
          },
          tatan: {
            name: 'たー𝕥𝕒𝕟🏡☀️',
            image: 'assets/images-01/ta-tan.png',
            color: '#87CEEB',
          },
          musicStartSec: 36.4,
        }}
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
        id="NOVA-SHOW-MV"
        component={NovaShowMV}
        durationInFrames={15 * 8} // 歌詞8セット分
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
      {/* エフェクトカタログ (Effect Factory) */}
      <Composition
        id="EffectCatalogShowcase"
        component={EffectCatalogShowcase}
        durationInFrames={EffectCatalog.length * EFFECT_SHOWCASE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Stitch-Gaming-Overlay"
        component={StitchOverlay}
        durationInFrames={300} // 10 seconds
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-Rookie-Ranking"
        component={RookieRanking}
        durationInFrames={1260} // 42 seconds total
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-RED"
        component={JolBattleSpiritRed}
        durationInFrames={1005} // 1065 - 60 (SceneLiver shortened)
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: '#ff2200',
          glowColor: 'rgba(255, 60, 0, 0.8)',
          particleColor1: '#cc0000',
          particleColor2: '#ff4400',
          music: {
            src: 'assets/audio/music/Breathing-Lighter.mp3',
            volume: 0.6,
            startFrom: 1440,
          },
          opponent: {
            name: '限界突破まみ🎽',
            image: 'assets/images-01/mrm0115-01.png',
            borderColor: '#fff',
            glowColor: 'red',
          },
          liver: {
            name: '🔆≒ユージン≒🔆',
            image: 'assets/images-01/t.o.p_u_jin_.jpeg',
            borderColor: '#ff0000',
            glowColor: '#FF6600',
          },
          endingText: '配信再開の<br/>３月<br/>有終の美を<br/>飾りたい！！',
          features: {
            useGlitch: true,
            useMirror: true,
            useDoublingGrid: false,
          },
          liverIntroDuration: 120,
          reverseVsOrder: true,
          customBackground: 'assets/images-01/red-energy-bg.png',
          sceneLiverEffect: {
            src: 'assets/pixabay/videos/fire-flower01.mp4',
            blendMode: 'plus-lighter',
            zIndex: 10,
            muted: true,
            opacity: 0,
          },
          sceneVsEffect: {
            src: 'assets/pixabay/videos/fire-explotion.mp4',
            opacity: 0,
            blendMode: 'screen',
            zIndex: 600,
            muted: true,
          },
        }}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-GREEN"
        component={JolBattleSpiritGreen}
        durationInFrames={JOL_GREEN_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={greenTheme}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-MAGIC"
        component={JolBattleSpiritMagic}
        durationInFrames={JOL_MAGIC_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={magicTheme}
      />
      <Composition
        id="JOL-BATTLE-SPEED-ORANGE"
        component={JolBattleSpeedOrange}
        durationInFrames={JOL_SPEED_ORANGE_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={speedOrangeTheme}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-BLUE"
        component={JolBattleSpiritBlue}
        durationInFrames={1065}
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: '#0066ff',
          glowColor: 'rgba(0, 100, 255, 0.8)',
          particleColor1: '#0000cc',
          particleColor2: '#0088ff',
          music: {
            src: 'assets/audio/music/Breathing-Lighter.mp3',
            startFrom: 126 * 30,
            volume: 0.6,
          },
          opponent: {
            name: '❤️‍🔥しおぴ❤️‍🔥',
            image: 'assets/images-01/shiori_portrait.webp',
            borderColor: '#fff',
            glowColor: '#00ffff',
          },
          liver: {
            name: '限界突破まみ🎽',
            image: 'assets/images-01/mrm0115-01.png',
            borderColor: '#FFF',
            glowColor: '#0066ff',
          },
          endingText: 'この戦いは<br/>絶対に負けられない',
          features: {
            useGlitch: true,
            useMirror: true,
            useDoublingGrid: false,
          },
        }}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-ORENGE"
        component={JolBattleSpiritOrange}
        durationInFrames={JOL_ORANGE_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: 'orange',
          glowColor: 'rgba(255, 140, 0, 0.8)',
          particleColor1: '#cc5500',
          particleColor2: '#ffbb00',
          music: {
            src: 'assets/audio/music/冷蔵庫のメモ.mp3',
            startFrom: 4717,
            volume: 0.6,
          },
          opponent: {
            name: '🔆≒ユージン≒🔆',
            image: 'assets/images-01/t.o.p_u_jin_.jpeg',
            borderColor: '#fff',
            glowColor: '#ff4400',
          },
          liver: {
            name: '限界突破まみ🎽',
            image: 'assets/images-01/mrm0115-01.png',
            gridImage: 'assets/images-01/mrm0115.jpeg',
            borderColor: '#FFE4B5',
            glowColor: 'orange',
          },
          endingText: 'この戦いは<br/>絶対に<br/>負けられない',
          features: {
            useGlitch: false,
            useMirror: false,
            useDoublingGrid: false,
            useGridConvergence: true,
          },
          lightLeakColor: '#ff8800',
          reverseVsOrder: true,
          fontFamily: '"Mochiy Pop One", sans-serif',
        }}
      />
      <Composition
        id="Magic-Circle-Showcase"
        component={MagicCircleShowcase}
        durationInFrames={180 * 2} // 180 frames per sequence * 2 standard modes (+1 tracing mode if needed)
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AdvancedMagicCircleShowcase"
        component={AdvancedMagicCircleShowcase}
        durationInFrames={450} // 150 frames * 3 colors
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Text-Animation-Catalog"
        component={TextAnimationCatalog}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Text-Effect-Catalog"
        component={TextEffectCatalog}
        durationInFrames={2070}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-BATTLE-WHITE-SNOW"
        component={JolBattleWhiteSnow}
        durationInFrames={JOL_WHITE_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: '#e0f7fa',
          glowColor: '#0277bd',
          textStroke: '3px #01579b',
          textAnimation: 'fade',
          particleColor1: '#ffffff',
          particleColor2: '#b3e5fc',
          music: {
            src: 'assets/audio/music/その先へ.mp3',
            startFrom: 48 * 30,
            volume: 0.6,
            bpm: 144,
          },
          customDurations: {
            opening: 180,
            date: 150,
            liverIntro: 210,
            msg: 0,
            opponent: 105,
            vs: 90,
            rule: 120,
            ending: 120,
            logo: 90,
          },
          openingText: ['予約バトル', '決まりました！', 'みんな<br/>応援してね❤️'],
          dateText: ['2026年<br/>3月28日', 'SATURDAY', '22時30分', 'START!'],
          rulesText: ['【ルール】','グローブ2', 'アイテム他なし', '一本勝負'],
          endingText: '初予約バトルー！<br/>いつもの<br/>なるりれらしく',
          reverseVsOrder: true,
          opponent: {
            name: '🐄モゥーミルク🍼🐃',
            image: 'assets/images-01/user1817765055425.jpeg',
            borderColor: '#aed581', 
            glowColor: '#7cb342',
          },
          liver: {
            name: 'なるりれ🦥🍉',
            image: 'assets/images-01/karaindaisuki.png',
            borderColor: '#ffffff',
            glowColor: '#81d4fa',
          },
          features: {
            useGlitch: false,
            useMirror: false,
            useDoublingGrid: false,
            useGridConvergence: false,
            useSnowEffect: true,
            useKaleidoscope: false,
            useSpinIntro: true,
            useCircleLiver: true,
          },
          customBackground: 'assets/pixabay/videos/pixabay_christmas_tree_snowy_landscape_snow_winter_christm_323093.mp4',
          opponentBackground: 'assets/images-01/meadow_animals_bg.png',
        }}
      />
      <Composition
        id="JOL-BATTLE-PATTERN6"
        component={JolBattlePattern6}
        durationInFrames={915}
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: '#ff0055',
          glowColor: '#ffaa00',
          textStroke: '3px #880000',
          textAnimation: 'kinetic',
          particleColor1: '#ffffff',
          particleColor2: '#ffdd00',
          music: {
            src: 'assets/audio/music/Blastwave.mp3',
            startFrom: 0,
            volume: 0.6,
            bpm: 120,
          },
          features: {
            useGlitch: true,
            useMirror: false,
            useDoublingGrid: false,
            useGridConvergence: false,
            useSpinIntro: false,
            useMetallicVs: true,
            hideVsFocusLines: true,
            colorizeVsVideo: true,
          },
          customVsVideo: 'assets/pixabay/videos/pixabay_fire_burning_explosion_big_bang_abstract_backgroun_12910.mp4',
          liver: {
            name: "限界突破まみ🎽",
            image: "assets/images-01/ooo93o.jpeg",
            borderColor: '#ffaa00',
            glowColor: '#ff2200',
          },
          opponent: {
            name: "🔆≒ユージン≒🔆",
            image: "assets/images-01/l5332541.jpeg",
            borderColor: '#00ccff',
            glowColor: '#0055ff',
          },
          endingText: "Thank you for watching!",
        } as any}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-SPRING"
        component={JolBattleSpringSakura}
        durationInFrames={JOL_SAKURA_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={{
          themeColor: '#fce4ec',
          glowColor: '#f06292',
          textStroke: '3px #c2185b',
          textAnimation: 'fade',
          particleColor1: '#ffffff',
          particleColor2: '#f8bbd0',
          music: {
            src: 'assets/audio/music/その先へ.mp3',
            startFrom: 48 * 30,
            volume: 0.6,
            bpm: 144,
          },
          customDurations: {
            opening: 180,
            date: 150,
            liverIntro: 210,
            msg: 0,
            opponent: 105,
            vs: 90,
            rule: 120,
            ending: 120,
            logo: 90,
          },
          openingText: ['予約バトル', '決まりました！', 'みんな<br/>応援してね❤️'],
          dateText: ['2026年<br/>3月28日', 'SATURDAY', '22時30分', 'START!'],
          rulesText: ['【ルール】','グローブ2', 'アイテム他なし', '一本勝負'],
          endingText: '初予約バトルー！<br/>いつもの<br/>なるりれらしく',
          reverseVsOrder: true,
          opponent: {
            name: '🐄モゥーミルク🍼🐃',
            image: 'assets/images-01/user1817765055425.jpeg',
            borderColor: '#aed581', 
            glowColor: '#7cb342',
          },
          liver: {
            name: 'なるりれ🦥🍉',
            image: 'assets/images-01/karaindaisuki.png',
            altImage: 'assets/images-01/karaindaisuki-photo.jpg',
            altImageStartFrame: 420,
            altImageEndFrame: 469,
            borderColor: '#ffffff',
            glowColor: '#ff80ab',
          },
          features: {
            useGlitch: false,
            useMirror: false,
            useDoublingGrid: false,
            useGridConvergence: false,
            useSnowEffect: false,
            useSakuraEffect: true,
            useKaleidoscope: false,
            useSpinIntro: true,
            useCircleLiver: true,
            hideDefaultParticles: true,
          },
          customBackground: 'assets/pixabay/videos/pixabay_sakura_peach_flowers_starry_sky_reflection_pond_re_156769.mp4',
          opponentBackground: 'assets/images-01/meadow_animals_bg.png',
          fontFamily: '"Mochiy Pop One", sans-serif',
        }}
      />
      
      {/* Jol Battle Reservation Composition */}
      <Composition
        id="JOL-RESERVATION-BATTLE"
        component={JolBattleReservation}
        durationInFrames={860}
        fps={30}
        width={1080}
        height={1920}
        schema={ReservationBattleSchema}
        defaultProps={{
          themeColor: '#ff2200',
          music: 'assets/audio/music/Velocity-Shift.mp3',
          livers: [
            { name: '🍦taka🍦', image: 'assets/images-01/taka19427.png', borderColor: '#ffaa00' },
            { name: '🌸さくら🌸', image: 'assets/images-01/l5332541.jpeg', borderColor: '#00ccff' },
            { name: '🌹夢一輪🌹', image: 'assets/images-01/zzz5557zzz.png', borderColor: '#ff00ff' },
            { name: 'つれトラ🍭💟', image: 'assets/images-01/tsuregumi1228.jpg', borderColor: '#00ffaa' },
          ],
          dateInfo: {
            year: '2026年',
            date: '4月1日',
            time: '22:00'
          },
          rules: [
            'ルール1：アイテム無し',
            'ルール2：1発勝負',
          ],
          finalMessage: '人気No.1の座を勝ち取るぞ✊'
        }}
      />

      <Composition id="Catalog-Backgrounds" component={ShowcaseBackgrounds} durationInFrames={SHOWCASE_BG_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="Catalog-Effects-Ultimate-42" component={ShowcaseEffects} durationInFrames={SHOWCASE_FX_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="Catalog-Transitions" component={ShowcaseTransitions} durationInFrames={SHOWCASE_TRANS_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="Catalog-TextAndLayouts" component={ShowcaseTextLayouts} durationInFrames={SHOWCASE_TEXT_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="Catalog-Transitions-Ultimate-60" component={TransitionsCatalogShowcase} durationInFrames={TRANSITION_SHOWCASE_DURATION} fps={30} width={1080} height={1920} />
      <AssetPanel />
    </>
  );
};
