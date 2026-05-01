import { Composition } from 'remotion';

import {
  RankingVertical,
  TOTAL_DURATION_FRAMES as VERTICAL_DURATION,
} from './compositions/Rankings/RankingVertical';
import {
  RankingVerticalSchema,
  LiverSchema,
} from './compositions/Rankings/RankingVertical/schema';
import RANKING_DATA_JSON from './data/data.json';
import {
  RankingTime,
  TOTAL_DURATION_FRAMES as TIME_DURATION,
} from './compositions/Rankings/RankingTime';
import { RankingTimeSchema } from './compositions/Rankings/RankingTime/schema';
import {
  RankingEvent,
  TOTAL_DURATION_FRAMES as EVENT_DURATION,
} from './compositions/Rankings/RankingEvent';
import { RankingEventSchema } from './compositions/Rankings/RankingEvent/schema';
import { BattleKawaii } from './compositions/Battles/BattleKawaii';
import {
  PastelDreamShowcase,
  pastelDreamSchema,
} from './compositions/Showcases/PastelDreamShowcase';
import { NarandaMamadeMV } from './compositions/NarandaMamade';
import { SoregayasashisaMV } from './compositions/Soregayasashisa';
import narandaMamadeMusicAnalysis from './compositions/NarandaMamade/music_analysis.json';
import { NovaShowMV } from './components/NovaShowMV';
import { KimitonaraComposition } from './compositions/Kimitonara';
import { StitchOverlay } from './compositions/Stitch';
import { RookieRanking } from './compositions/Rankings/RookieRanking';
import { RookieRankingSchema } from './compositions/Rankings/RookieRanking/schema';
import { JolBattleSpiritRed } from './compositions/Battles/JolBattleSpiritRed';
import { JolBattleSpiritBlue } from './compositions/Battles/JolBattleSpiritBlue';
import {
  JolBattleSpiritOrange,
  JOL_ORANGE_DURATION,
} from './compositions/Battles/JolBattleSpiritOrange';
import {
  JolBattleSpiritGreen,
  greenTheme,
  JOL_GREEN_DURATION,
} from './compositions/Battles/JolBattleSpiritGreen';
import {
  JolBattleSpiritMagic,
  magicTheme,
  JOL_MAGIC_DURATION,
} from './compositions/Battles/JolBattleSpiritMagic';
import { AdvancedEffectsShowcase } from './compositions/Showcases/AdvancedEffectsShowcase';
import { SkiaEffectsShowcase } from './components/effects/SkiaEffectsShowcase';
import { CanvasEffectsCatalog } from './compositions/Showcases/CanvasEffectsCatalog';
import { SvgEffectsCatalog } from './compositions/Showcases/SvgEffectsCatalog';
import { SvgGraphicsCatalog } from './compositions/Showcases/SvgGraphicsCatalog';
import { GsapEffectsCatalog } from './compositions/Showcases/GsapEffectsCatalog';
import { KineticTypographyCatalog } from './compositions/Showcases/KineticTypographyCatalog';
import { MvLyricTypographyCatalog } from './compositions/Showcases/MvLyricTypographyCatalog';
import {
  JolBattleSpeedOrange,
  speedOrangeTheme,
  JOL_SPEED_ORANGE_DURATION,
} from './compositions/Battles/JolBattleSpeedOrange';
import {
  JolBattleWhiteSnow,
  JOL_WHITE_DURATION,
} from './compositions/Battles/JolBattleWhiteSnow';
import {
  JolBattleSpringSakura,
  JOL_SAKURA_DURATION,
} from './compositions/Battles/JolBattleSpringSakura';
import { JolBattlePattern6 } from './compositions/Battles/JolBattlePattern6';
import {
  JolBattleReservation,
  ReservationBattleSchema,
} from './compositions/Battles/JolBattleReservation';

import {
  JolPopularityBattle3vs1,
  PopularityBattle3vs1Schema,
} from './compositions/Battles/JolPopularityBattle3vs1';
import {
  JolPopularityBattleSakura3vs1,
  PopularityBattleSakura3vs1Schema,
} from './compositions/Battles/JolPopularityBattleSakura3vs1';
import {
  ShowcaseBackgrounds,
  SHOWCASE_BG_DURATION,
  ShowcaseEffects,
  SHOWCASE_FX_DURATION,
  ShowcaseTransitions,
  SHOWCASE_TRANS_DURATION,
  ShowcaseTextLayouts,
  SHOWCASE_TEXT_DURATION,
} from './compositions/Showcases/ReusableComponentsShowcase';
import {
  TransitionsCatalogShowcase,
  TRANSITION_SHOWCASE_DURATION,
} from './compositions/Showcases/TransitionsCatalogShowcase';
import {
  EffectCatalogShowcase,
  EFFECT_SHOWCASE_DURATION,
} from './compositions/Showcases/EffectCatalogShowcase';
import { EffectCatalog } from './compositions/Showcases/components/EffectCatalog/effect-catalog';
import { MagicCircleShowcase } from './compositions/Showcases/MagicCircleShowcase';
import { AdvancedMagicCircleShowcase } from './compositions/Showcases/AdvancedMagicCircleShowcase';
import { TextAnimationCatalog } from './compositions/Showcases/TextAnimationCatalog';
import { TextEffectCatalog } from './compositions/Showcases/TextEffectCatalog';
import { TripleImageEffectsCatalog } from './compositions/Showcases/TripleImageEffectsCatalog';
import { QuadImageEffectsCatalog } from './compositions/Showcases/QuadImageEffectsCatalog';
import { BattleSpiritThemeSchema } from './compositions/Battles/shared/types';
import { ArigatoMV, ArigatoSchema } from './compositions/Arigato';
import { getArigatoImages } from './compositions/Arigato/image-loader';
import { ARIGATO_TEXT_EVENTS } from './compositions/Arigato/text-events';
import { BookFlipSample } from './compositions/Showcases/BookFlipSample';
import {
  RankingRoyal,
  TOTAL_DURATION_FRAMES as ROYAL_DURATION,
} from './compositions/Rankings/RankingRoyal';
import { RankingRoyalSchema } from './compositions/Rankings/RankingRoyal/schema';
import { AssetPanel } from './components/AssetPanel';
import {
  MinibaUniverse,
  MINIBA_UNIVERSE_TOTAL_FRAMES,
} from './compositions/MinibaUniverse';
import { DeepSeekCollaboration } from './compositions/DeepSeekCollaboration';
import './index.css';
import React from 'react';

const JOL_RANKING_FPS = 60;



export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Imported from video-factory-v1 */}
      <Composition
        id="JOL-Ranking-Vertical"
        component={RankingVertical}
        durationInFrames={Math.ceil(VERTICAL_DURATION)}
        fps={JOL_RANKING_FPS}
        width={1080}
        height={1920}
        schema={RankingVerticalSchema}
        defaultProps={{
          bpm: 152,
          bgmFile: 'assets/audio/music/doragonSrayer.mp3',
          bgmStartFrom: 25,
          openingVideo: 'backgrounds/diamond-ranking-opening.mp4',
          rankingVideo:
            'assets/pixabay/videos/pixabay_fire_flame_beautiful_wallpaper_burn_hot_smoke_feve_200715.mp4',
          openingTitle1: 'J.O.L',
          openingTitle2: '2026年3月\nダイヤモンド獲得',
          openingTitle3: 'ランキング',
          openingSubtitle: '結果発表',
          useGlitch: true,
          glitchIntensity: 10,
          top3Video:
            'assets/pixabay/videos/pixabay_dimension_space_psychedelic_abstract_portal_time_w_31183.mp4',
          openingDate: '',
          livers: (RANKING_DATA_JSON as unknown[]).map((l) =>
            LiverSchema.parse(l),
          ),
        }}
      />
      <Composition
        id="JOL-Ranking-time"
        component={RankingTime}
        durationInFrames={Math.ceil(TIME_DURATION)}
        fps={JOL_RANKING_FPS}
        width={1080}
        height={1920}
        schema={RankingTimeSchema}
        defaultProps={{
          openingTitle2: '配信時間',
          openingTitle3: 'ランキング',
          themeColor: '#d000ff',
          glowColor: 'rgba(208, 0, 255, 0.6)',
        }}
      />
      <Composition
        id="JOL-Ranking-Event"
        component={RankingEvent}
        durationInFrames={Math.ceil(EVENT_DURATION)}
        fps={JOL_RANKING_FPS}
        width={1080}
        height={1920}
        schema={RankingEventSchema}
        defaultProps={{
          bgmStartFrom: 10,
          openingTitle1: 'J.O.L',
          openingTitle2: 'ダイヤモンド',
          openingTitle3: 'ランキング',
          openingSubtitle: '結果発表',
          openingDate: '2026.04',
        }}
      />
      <Composition
        id="JOL-Battle-Kawaii"
        component={BattleKawaii}
        durationInFrames={780}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-PastelDream"
        component={PastelDreamShowcase}
        durationInFrames={840} // 31秒から3秒減らして28秒 (840フレーム)
        fps={60}
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
        durationInFrames={60 * 222} // 3分42秒
        fps={30}
        width={1920}
        height={1080}
      />
      {/* エフェクトカタログ (Effect Factory) */}
      <Composition
        id="EffectCatalogShowcase"
        component={EffectCatalogShowcase}
        durationInFrames={EffectCatalog.length * EFFECT_SHOWCASE_DURATION}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="Stitch-Gaming-Overlay"
        component={StitchOverlay}
        durationInFrames={600} // 10 seconds
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-Rookie-Ranking"
        component={RookieRanking}
        durationInFrames={1320}
        fps={60}
        width={1080}
        height={1920}
        schema={RookieRankingSchema}
        defaultProps={{
          bpm: 135,
          bgmFile: 'assets/audio/music/Gold_Medal_Rush.mp3',
        }}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-RED"
        component={JolBattleSpiritRed}
        durationInFrames={1005} // 1065 - 60 (SceneLiver shortened)
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={
          {
            themeColor: '#ff2200',
            glowColor: 'rgba(255, 60, 0, 0.8)',
            particleColor1: '#cc0000',
            particleColor2: '#ff4400',
            music: {
              src: 'assets/audio/music/Breathing-Lighter.mp3',
              volume: 0.6,
              startFrom: 1440,
              bpm: 120,
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
              altImage: '',
              altImageStartFrame: 0,
              altImageEndFrame: 0,
              gridImage: '',
              borderColor: '#ff0000',
              glowColor: '#FF6600',
            },
            endingText: '配信再開の<br/>３月<br/>有終の美を<br/>飾りたい！！',
            features: {
              useGlitch: true,
              useMirror: true,
              useDoublingGrid: false,
              useGridConvergence: false,
              useSnowEffect: false,
              useKaleidoscope: false,
              useSpinIntro: false,
              useCircleLiver: false,
              useMetallicVs: false,
              hideVsFocusLines: false,
              colorizeVsVideo: false,
              useSakuraEffect: false,
              hideDefaultParticles: false,
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
          } as any
        }
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-GREEN"
        component={JolBattleSpiritGreen}
        durationInFrames={JOL_GREEN_DURATION}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={greenTheme}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-MAGIC"
        component={JolBattleSpiritMagic}
        durationInFrames={JOL_MAGIC_DURATION}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={magicTheme}
      />
      <Composition
        id="JOL-BATTLE-SPEED-ORANGE"
        component={JolBattleSpeedOrange}
        durationInFrames={JOL_SPEED_ORANGE_DURATION}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={speedOrangeTheme}
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-BLUE"
        component={JolBattleSpiritBlue}
        durationInFrames={1065}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={
          {
            themeColor: '#0066ff',
            glowColor: 'rgba(0, 100, 255, 0.8)',
            particleColor1: '#0000cc',
            particleColor2: '#0088ff',
            music: {
              src: 'assets/audio/music/Breathing-Lighter.mp3',
              startFrom: 126 * 60,
              volume: 0.6,
              bpm: 120,
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
              altImage: '',
              altImageStartFrame: 0,
              altImageEndFrame: 0,
              gridImage: '',
              borderColor: '#FFF',
              glowColor: '#0066ff',
            },
            endingText: 'この戦いは<br/>絶対に負けられない',
            features: {
              useGlitch: true,
              useMirror: true,
              useDoublingGrid: false,
              useGridConvergence: false,
              useSnowEffect: false,
              useKaleidoscope: false,
              useSpinIntro: false,
              useCircleLiver: false,
              useMetallicVs: false,
              hideVsFocusLines: false,
              colorizeVsVideo: false,
              useSakuraEffect: false,
              hideDefaultParticles: false,
            },
          } as any
        }
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-ORANGE"
        component={JolBattleSpiritOrange}
        durationInFrames={JOL_ORANGE_DURATION}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={
          {
            ...speedOrangeTheme,
            features: {
              useGlitch: false,
              useMirror: false,
              useDoublingGrid: false,
              useGridConvergence: true,
              useSnowEffect: false,
              useKaleidoscope: false,
              useSpinIntro: false,
              useCircleLiver: false,
              useMetallicVs: false,
              hideVsFocusLines: false,
              colorizeVsVideo: false,
              useSakuraEffect: false,
              hideDefaultParticles: false,
            },
            lightLeakColor: '#ff8800',
            reverseVsOrder: true,
            fontFamily: '"Mochiy Pop One", sans-serif',
          } as any
        }
      />
      <Composition
        id="Magic-Circle-Showcase"
        component={MagicCircleShowcase}
        durationInFrames={180 * 2} // 180 frames per sequence * 2 standard modes (+1 tracing mode if needed)
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="AdvancedMagicCircleShowcase"
        component={AdvancedMagicCircleShowcase}
        durationInFrames={450} // 150 frames * 3 colors
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="Text-Animation-Catalog"
        component={TextAnimationCatalog}
        durationInFrames={900}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="Text-Effect-Catalog"
        component={TextEffectCatalog}
        durationInFrames={2070}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="JOL-BATTLE-WHITE-SNOW"
        component={JolBattleWhiteSnow}
        durationInFrames={JOL_WHITE_DURATION}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={
          {
            themeColor: '#e0f7fa',
            glowColor: '#0277bd',
            textStroke: '3px #01579b',
            textAnimation: 'fade',
            particleColor1: '#ffffff',
            particleColor2: '#b3e5fc',
            music: {
              src: 'assets/audio/music/その先へ.mp3',
              startFrom: 48 * 60,
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
            openingText: [
              '予約バトル',
              '決まりました！',
              'みんな<br/>応援してね❤️',
            ],
            dateText: ['2026年<br/>3月28日', 'SATURDAY', '22時30分', 'START!'],
            rulesText: [
              '【ルール】',
              'グローブ2',
              'アイテム他なし',
              '一本勝負',
            ],
            endingText: '初予約バトルー！<br/>いつもの<br/>なるりれらしく',
            reverseVsOrder: true,
            opponent: {
              name: '🐄モゥーミルク🍼🐃',
              image: 'assets/images-01/user1817765055425.jpeg',
              borderColor: '#aed581',
              glowColor: '#7cb342',
            },
            liver: {
              name: 'なるりれ🦚🍉',
              image: 'assets/images-01/karaindaisuki.png',
              altImage: '',
              altImageStartFrame: 0,
              altImageEndFrame: 0,
              gridImage: '',
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
              useMetallicVs: false,
              hideVsFocusLines: false,
              colorizeVsVideo: false,
              useSakuraEffect: false,
              hideDefaultParticles: false,
            },
            customBackground:
              'assets/pixabay/videos/pixabay_christmas_tree_snowy_landscape_snow_winter_christm_323093.mp4',
            opponentBackground: 'assets/images-01/meadow_animals_bg.png',
          } as any
        }
      />
      <Composition
        id="JOL-BATTLE-PATTERN6"
        component={JolBattlePattern6}
        durationInFrames={915}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={
          {
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
            customVsVideo:
              'assets/pixabay/videos/pixabay_fire_burning_explosion_big_bang_abstract_backgroun_12910.mp4',
            liver: {
              name: '限界突破まみ🎽',
              image: 'assets/images-01/ooo93o.jpeg',
              borderColor: '#ffaa00',
              glowColor: '#ff2200',
            },
            opponent: {
              name: '🔆≒ユージン≒🔆',
              image: 'assets/images-01/l5332541.jpeg',
              borderColor: '#00ccff',
              glowColor: '#0055ff',
            },
            endingText: 'Thank you for watching!',
          } as any
        }
      />
      <Composition
        id="JOL-BATTLE-SPIRIT-SPRING"
        component={JolBattleSpringSakura}
        durationInFrames={JOL_SAKURA_DURATION}
        fps={60}
        width={1080}
        height={1920}
        schema={BattleSpiritThemeSchema}
        defaultProps={
          {
            themeColor: '#fce4ec',
            glowColor: '#f06292',
            textStroke: '3px #c2185b',
            textAnimation: 'fade',
            particleColor1: '#ffffff',
            particleColor2: '#f8bbd0',
            music: {
              src: 'assets/audio/music/その先へ.mp3',
              startFrom: 48 * 60,
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
            openingText: [
              '予約バトル',
              '決まりました！',
              'みんな<br/>応援してね❤️',
            ],
            dateText: ['2026年<br/>3月28日', 'SATURDAY', '22時30分', 'START!'],
            rulesText: [
              '【ルール】',
              'グローブ2',
              'アイテム他なし',
              '一本勝負',
            ],
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
              gridImage: '',
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
              useMetallicVs: false,
              hideVsFocusLines: false,
              colorizeVsVideo: false,
            } as any,
            customBackground:
              'assets/pixabay/videos/pixabay_sakura_peach_flowers_starry_sky_reflection_pond_re_156769.mp4',
            opponentBackground: 'assets/images-01/meadow_animals_bg.png',
            fontFamily: '"Mochiy Pop One", sans-serif',
          } as any
        }
      />
      <Composition
        id="JOL-RESERVATION-BATTLE"
        component={JolBattleReservation}
        durationInFrames={860}
        fps={60}
        width={1080}
        height={1920}
        schema={ReservationBattleSchema}
        defaultProps={{
          themeColor: '#ff2200',
          music: 'assets/audio/music/Velocity-Shift.mp3',
          livers: [
            {
              id: '1',
              name: '🍦taka🍦',
              image: 'assets/images-01/taka19427.png',
              borderColor: '#ffaa00',
            },
            {
              id: '2',
              name: '🌸さくら🌸',
              image: 'assets/images-01/l5332541.jpeg',
              borderColor: '#00ccff',
            },
            {
              id: '3',
              name: '🌹夢一輪🌹',
              image: 'assets/images-01/zzz5557zzz.png',
              borderColor: '#ff00ff',
            },
            {
              id: '4',
              name: 'つれぐみ🍭💟',
              image: 'assets/images-01/tsuregumi1228.jpg',
              borderColor: '#00ffaa',
            },
          ],
          dateInfo: {
            year: '2026年',
            date: '4月1日',
            time: '22:00',
          },
          rules: ['ルール1：アイテム無し', 'ルール2：1発勝負'],
          finalMessage: '人気No.1の座を勝ち取るぞ✊',
        }}
      />
      {/* 人気アップバトル 3 VS 1 */}
      <Composition
        id="JOL-POPULARITY-BATTLE-3vs1"
        component={JolPopularityBattle3vs1}
        durationInFrames={1370}
        fps={60}
        width={1080}
        height={1920}
        schema={PopularityBattle3vs1Schema}
        defaultProps={{
          themeColor: '#00ccff',
          customBackground:
            'assets/pixabay/videos/pixabay_butterfly_crystal_ball_mystery_fantasy_169817.mp4',
          music: 'assets/audio/music/やさしい愛.mp3',
          livers: [
            {
              id: '1',
              name: '🍦taka🍦',
              image: 'assets/images-01/taka19427.png',
              borderColor: '#00ccff',
            },
            {
              id: '2',
              name: '🌸さくら🌸',
              image: 'assets/images-01/l5332541.jpeg',
              borderColor: '#ffb3c6',
            },
            {
              id: '3',
              name: '🌹夢一輪🌹',
              image: 'assets/images-01/zzz5557zzz.png',
              borderColor: '#00ccff',
            },
            {
              id: '4',
              name: 'つれぐみ🍭💟',
              image: 'assets/images-01/tsuregumi1228.jpg',
              borderColor: '#ff00ff',
            },
          ],
          sakuraImages: [
            'assets/images-01/l5332541.jpeg',
            'assets/images-01/l5332541-02.png',
            'assets/images-01/l5332541-01.png',
          ],
          dateInfo: { year: '2026.04.01', date: '2026.04.01', time: '22:00' },
          rules: ['ルール1：アイテム無し', 'ルール2：1発勝負'],
          finalMessage: 'さくら組が人気1番の\n実力を見せつけようね',
        }}
      />
      {/* タイムラインを再編成した新コンポジション */}
      <Composition
        id="JOL-POPULARITY-BATTLE-SAKURA-3vs1"
        component={JolPopularityBattleSakura3vs1}
        durationInFrames={975}
        fps={60}
        width={1080}
        height={1920}
        schema={PopularityBattleSakura3vs1Schema}
        defaultProps={{
          themeColor: '#00ccff',
          customBackground:
            'assets/pixabay/videos/pixabay_butterfly_crystal_ball_mystery_fantasy_169817.mp4',
          music: 'assets/audio/music/Super_Star.mp3',
          livers: [
            {
              id: '1',
              name: '🍦taka🍦',
              image: 'assets/images-01/taka19427.png',
              borderColor: '#00ccff',
            },
            {
              id: '2',
              name: '🌸さくら🌸',
              image: 'assets/images-01/l5332541.jpeg',
              borderColor: '#ffb3c6',
            },
            {
              id: '3',
              name: '🌹夢一輪🌹',
              image: 'assets/images-01/zzz5557zzz.png',
              borderColor: '#00ccff',
            },
            {
              id: '4',
              name: 'つれぐみ🍭💟',
              image: 'assets/images-01/tsuregumi1228.jpg',
              borderColor: '#ff00ff',
            },
          ],
          sakuraImages: [
            'assets/images-01/l5332541.jpeg',
            'assets/images-01/l5332541-02.png',
            'assets/images-01/l5332541-01.png',
          ],
          dateInfo: { year: '2026.04.01', date: '2026.04.01', time: '22:00' },
          rules: ['ルール1：アイテム無し', 'ルール2：1発勝負'],
          finalMessage: 'さくら組が人気1番の\n実力を見せつけようね',
        }}
      />
      <Composition
        id="Catalog-Backgrounds"
        component={ShowcaseBackgrounds}
        durationInFrames={SHOWCASE_BG_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="Catalog-Effects-Ultimate-42"
        component={ShowcaseEffects}
        durationInFrames={SHOWCASE_FX_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="Catalog-Transitions"
        component={ShowcaseTransitions}
        durationInFrames={SHOWCASE_TRANS_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="Catalog-TextAndLayouts"
        component={ShowcaseTextLayouts}
        durationInFrames={SHOWCASE_TEXT_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="Catalog-Transitions-Ultimate-60"
        component={TransitionsCatalogShowcase}
        durationInFrames={TRANSITION_SHOWCASE_DURATION}
        fps={60}
        width={1080}
        height={1920}
      />
      <AssetPanel />
      <Composition
        id="ADVANCED-EFFECTS-SHOWCASE"
        component={AdvancedEffectsShowcase}
        durationInFrames={990}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="SVG-EFFECTS-CATALOG"
        component={SvgEffectsCatalog}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="CANVAS-EFFECTS-CATALOG"
        component={CanvasEffectsCatalog}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="SVG-GRAPHICS-CATALOG"
        component={SvgGraphicsCatalog}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="GSAP-EFFECTS-CATALOG"
        component={GsapEffectsCatalog}
        durationInFrames={600}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="KINETIC-TYPO-CATALOG"
        component={KineticTypographyCatalog}
        durationInFrames={900}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="MV-LYRIC-TYPO-CATALOG"
        component={MvLyricTypographyCatalog}
        durationInFrames={2400} // 40 effects * 60 frames
        fps={60}
        width={1080}
        height={1080}
      />
      <Composition
        id="SKIA-EFFECTS-SHOWCASE"
        component={SkiaEffectsShowcase}
        durationInFrames={9900}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="TRIPLE-IMAGE-EFFECTS-CATALOG"
        component={TripleImageEffectsCatalog}
        durationInFrames={1800} // 30 effects * 60 frames
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="QUAD-IMAGE-EFFECTS-CATALOG"
        component={QuadImageEffectsCatalog}
        durationInFrames={600}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="Arigato-MV"
        component={ArigatoMV}
        durationInFrames={10800}
        fps={30}
        width={1920}
        height={1080}
        schema={ArigatoSchema}
        defaultProps={{
          images: getArigatoImages(),
          music: 'assets/audio/music/25-ありがとう.mp3',
          title: 'レンレン',
          message: '約9年間ありがとう',
          fps: 30,
          additionalTexts: ARIGATO_TEXT_EVENTS,
        }}
      />
      {/* 🎉 なるりれ マイイベント告知動画 */}
      <Composition
        id="JOL-MINIBA-UNIVERSE"
        component={MinibaUniverse}
        durationInFrames={MINIBA_UNIVERSE_TOTAL_FRAMES}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="DeepSeek-Collaboration"
        component={DeepSeekCollaboration}
        durationInFrames={600}
        fps={60}
        width={1080}
        height={1920}
      />
      <Composition
        id="BookFlipSample"
        component={BookFlipSample}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RankingRoyal"
        component={RankingRoyal}
        durationInFrames={Math.floor(ROYAL_DURATION)}
        fps={JOL_RANKING_FPS}
        width={1080}
        height={1920}
        schema={RankingRoyalSchema}
        defaultProps={{
          bpm: 150,
          bgmFile: 'assets/audio/music/The_Gilded_Siege.mp3',
          bgmStartFrom: 47.5,
          rankingVideo:
            'assets/pixabay/videos/pixabay_diamonds_jewels_rain_falling_wealth_value_money_cr_3125.mp4',
          openingTitle1: 'J.O.L',
          openingTitle2: '団結力No.1を',
          openingTitle3: '掴み取れ',
          openingDate: '2026年4月',
          openingTitle4: 'ランキング',
          openingSubtitle: '結果発表',
          useGlitch: false,
          glitchIntensity: 0,
          top3Video: '',
          livers: [
            {
              rank: 1,
              id: 'l5332541',
              nickname: '🌸さくら🌸',
              image_url: 'assets/avatars/l5332541.jpg',
              saved_to: '',
              score: 1500000,
            },
            {
              rank: 2,
              id: 'mizuki2525214',
              nickname: '💋一条美月-Mizuki-💋',
              image_url: 'assets/avatars/mizuki2525214.jpg',
              saved_to: '',
              score: 1400000,
            },
            {
              rank: 3,
              id: 't.o.p_u_jin_',
              nickname: '🔆≒ユージン≒🔆',
              image_url: 'assets/avatars/t.o.p_u_jin_.jpg',
              saved_to: '',
              score: 1300000,
            },
            {
              rank: 4,
              id: 'kawamii12',
              nickname: '小悪魔💋🪽',
              image_url: 'assets/avatars/koakumachiyan_new.png',
              saved_to: '',
              score: 1200000,
            },
            {
              rank: 5,
              id: 'ooo93o',
              nickname: 'あむら🧸🖤',
              image_url: 'assets/avatars/ooo93o.jpg',
              saved_to: '',
              score: 1100000,
            },
            {
              rank: 6,
              id: 'mrm0115',
              nickname: '限界突破まみ🎽',
              image_url: 'assets/avatars/mrm0115.jpg',
              saved_to: '',
              score: 1000000,
            },
            {
              rank: 7,
              id: 'ria.kangoshi',
              nickname: 'りあ🐰🍀',
              image_url: 'assets/avatars/ria.kangoshi.jpg',
              saved_to: '',
              score: 900000,
            },
            {
              rank: 8,
              id: 'donbeikun9999',
              nickname: '☠️やらかしタロー☠️',
              image_url: 'assets/avatars/donbeikun9999.png',
              saved_to: '',
              score: 800000,
            },
            {
              rank: 9,
              id: 'user58402831659341',
              nickname: '🐭ぼく天然ミッキー🐭',
              image_url: 'assets/avatars/user58402831659341.jpg',
              saved_to: '',
              score: 700000,
            },
            {
              rank: 10,
              id: 'karaindaisuki',
              nickname: 'なるりれ🦥🍉',
              image_url: 'assets/avatars/karaindaisuki.jpg',
              saved_to: '',
              score: 600000,
            },
            {
              rank: 11,
              id: 'ritu_1115',
              nickname: 'ジンヤ',
              image_url: 'assets/avatars/ritu_1115.jpg',
              saved_to: '',
              score: 500000,
            },
            {
              rank: 12,
              id: '2161646824',
              nickname: 'まゆみ♥️💗💛',
              image_url: 'assets/avatars/2161646824.jpg',
              saved_to: '',
              score: 400000,
            },
            {
              rank: 13,
              id: 'yyuukkii0402',
              nickname: 'yukiんこ😈',
              image_url: 'assets/avatars/yyuukkii0402.jpg',
              saved_to: '',
              score: 300000,
            },
            {
              rank: 14,
              id: 'ceo1014',
              nickname: '🦁CEO🦁',
              image_url: 'assets/avatars/ceo1014.jpg',
              saved_to: '',
              score: 200000,
            },
            {
              rank: 15,
              id: 'taka19427',
              nickname: 'taka0526_0901',
              image_url: 'assets/avatars/taka19427.jpg',
              saved_to: '',
              score: 100000,
            },
          ],
        }}
      />
    </>
  );
};
