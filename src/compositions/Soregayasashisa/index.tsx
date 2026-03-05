import React from 'react';
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { flip } from '@remotion/transitions/flip';
import { iris } from '@remotion/transitions/iris';
import { SkiaOverlay } from './SkiaOverlay';
import { SubtitleOverlay } from './SubtitleOverlay';
import { LYRIC_GROUPS, LYRICS } from './lyrics';
import { Scene } from '../NarandaMamade/Scene';
import { GlobalEffects } from '../NarandaMamade/GlobalEffects'; // Reusing GlobalEffects

const ASSET_PREFIX = process.env.REMOTION_LAMBDA ? 'public/' : '';
const MUSIC = staticFile(`${ASSET_PREFIX}assets/audio/music/それが優しさ.mp3`);

// Helper to get character image
const getCharacterImage = (charName: string, index: number) => {
  // 現在、soregayasashisa フォルダには scene_0 〜 scene_40 までの画像があります。
  // それ以上のインデックスが要求された場合に 404 になるのを防ぐため、ループさせます。
  const safeIndex = index % 41;
  return staticFile(`assets/generated/soregayasashisa/scene_${safeIndex}.png`);
};

export const SoregayasashisaMV: React.FC = () => {
  const { durationInFrames: totalDuration, width, height } = useVideoConfig();

  // Audio Reactivity (Disabled for elegant stillness)

  // Configurable transition duration
  const TRANSITION_DURATION = 30; // 1 second overlap

  // Calculate transitions (frames where scenes change) with safety check
  const transitionFrames: number[] = LYRIC_GROUPS.map((g) => {
    const firstLine = LYRICS[g.lines[0]];
    return firstLine ? firstLine.startFrame : null;
  }).filter((f): f is number => f !== null);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f0f1f' }}>
      {/* 0. 3D Background Layer - Removed StarDust for performance and clarity */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        {/* 
                <ThreeCanvas 
                    width={width} 
                    height={height}
                    camera={{ position: [0, 0, 10], fov: 75 }}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <StarDust audioPower={0} />
                </ThreeCanvas>
                */}
      </AbsoluteFill>

      {/* 1. Global Effects (Transition Triggered) */}
      <GlobalEffects transitionFrames={transitionFrames} audioPower={0} />

      {/* 2. Skia Neon Overlay (Stillness) */}
      <SkiaOverlay audioPower={0} />

      <Audio src={MUSIC} />

      <AbsoluteFill style={{ zIndex: 10 }}>
        <TransitionSeries>
          {/* イントロ・待機シーン (scene_0) */}
          <TransitionSeries.Sequence
            durationInFrames={LYRICS[0].startFrame + TRANSITION_DURATION}
          >
            <Scene
              imageSrc={getCharacterImage(LYRIC_GROUPS[0].char, 0)}
              characterName={LYRIC_GROUPS[0].char}
              color="#9b5de5"
              duration={LYRICS[0].startFrame + TRANSITION_DURATION}
              index={-1} // イントロ専用インデックス
              isChorus={false}
              additionalImages={[]}
              transparentBackground={true}
              disableFadeOut={true} // TransitionSeries がフェードを担当するため
              disableFadeIn={false}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* 歌詞シーン (scene_1, scene_2, ...) */}
          {LYRIC_GROUPS.map((group, index) => {
            const firstLineIdx = group.lines[0];
            if (firstLineIdx >= LYRICS.length) return null;

            const startFrame = LYRICS[firstLineIdx].startFrame;
            const imageIndex = index + 1; // 10秒(歌い出し)からscene_1を表示

            let baseDuration;
            const isLast = index === LYRIC_GROUPS.length - 1;

            if (isLast) {
              baseDuration = totalDuration - startFrame;
            } else {
              const nextGroup = LYRIC_GROUPS[index + 1];
              const nextFirstLineIdx = nextGroup.lines[0];
              if (nextFirstLineIdx < LYRICS.length) {
                const nextStart = LYRICS[nextFirstLineIdx].startFrame;
                baseDuration = nextStart - startFrame;
              } else {
                baseDuration = totalDuration - startFrame;
              }
            }

            if (baseDuration <= 0) return null;

            const sequenceDuration = isLast
              ? baseDuration
              : baseDuration + TRANSITION_DURATION;

            return (
              <React.Fragment key={index}>
                <TransitionSeries.Sequence durationInFrames={sequenceDuration}>
                  <Scene
                    imageSrc={getCharacterImage(group.char, imageIndex)}
                    characterName={group.char}
                    color="#9b5de5"
                    duration={sequenceDuration}
                    index={imageIndex}
                    isChorus={false}
                    additionalImages={[]}
                    transparentBackground={true}
                    disableFadeOut={true}
                    disableFadeIn={true} // シーンの切り替わりは TransitionSeries に任せる
                  />
                </TransitionSeries.Sequence>

                {!isLast && (
                  <TransitionSeries.Transition
                    presentation={
                      (() => {
                        const type = index % 8;
                        if (type === 0)
                          return slide({ direction: 'from-right' });
                        if (type === 1)
                          return wipe({ direction: 'from-bottom' });
                        if (type === 2) return clockWipe({ width, height });
                        if (type === 3) return flip({ direction: 'from-top' });
                        if (type === 4)
                          return slide({ direction: 'from-left' });
                        if (type === 5) return iris({ width, height });
                        if (type === 6) return wipe({ direction: 'from-top' });
                        return fade();
                      })() as any
                    }
                    timing={linearTiming({
                      durationInFrames: TRANSITION_DURATION,
                    })}
                  />
                )}
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </AbsoluteFill>

      <SubtitleOverlay />
    </AbsoluteFill>
  );
};
