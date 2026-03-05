import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { Scene } from './Scene';
import { KanoIntro } from './KanoIntro';
import { SubtitleOverlay } from './SubtitleOverlay';
import { GoldenBokehOverlay } from './GoldenBokehOverlay';
import { GlobalEffects } from './GlobalEffects';
import { EndCreditSlide } from './EndCreditSlide';
import { LyricLine, LYRICS } from './lyrics';

const ASSET_PREFIX = process.env.REMOTION_LAMBDA ? 'public/' : '';

const MUSIC = staticFile(`${ASSET_PREFIX}assets/audio/music/並んだままで.mp3`);

// Group lyrics into 2-phrase units (approx. 18 units)
const LYRIC_GROUPS: LyricLine[][] = [];
for (let i = 0; i < LYRICS.length; i += 2) {
  LYRIC_GROUPS.push(LYRICS.slice(i, i + 2).filter(Boolean));
}

// Verified Nova Images only (Prioritizing the high-quality 16:9 master versions)
const VERIFIED_NOVA_IMAGES = [
  staticFile(
    `${ASSET_PREFIX}assets/generated/nanobana/nova_scene_01_waking_up.webp`,
  ),
  staticFile(
    `${ASSET_PREFIX}assets/generated/nanobana/nova_scene_02_morning_coffee.webp`,
  ),
  staticFile(
    `${ASSET_PREFIX}assets/generated/nanobana/nova_scene_03_breakfast_toast.webp`,
  ),
  staticFile(
    `${ASSET_PREFIX}assets/generated/nanobana/nova_scene_04_reading_sofa.webp`,
  ),
  staticFile(
    `${ASSET_PREFIX}assets/generated/nanobana/nova_scene_05_balcony_plants.webp`,
  ),
  staticFile(
    `${ASSET_PREFIX}assets/generated/nanobana/nova_scene_06_getting_ready.webp`,
  ),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_07.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_08.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_09.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_10.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_11.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_12.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_13.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_14.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_15.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_16.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_17.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_18.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_19.webp`),
  staticFile(`${ASSET_PREFIX}assets/generated/nanobana/scene_20.webp`),
];

// Duo and generic placeholders
const DUO_PLACEHOLDER = staticFile(
  `${ASSET_PREFIX}assets/characters/nova-shige.webp`,
);

const SCENE_IMAGES = VERIFIED_NOVA_IMAGES;

// Smart Image Selection
const GET_IMAGE_FOR_PHRASE = (index: number) => {
  // Priority 1: The very last scene always shows Shige and Nova together
  if (index === LYRIC_GROUPS.length - 1) {
    return DUO_PLACEHOLDER;
  }

  // Priority 2: High quality 16:9 Nova for the first few phrases
  if (index < 4) {
    return VERIFIED_NOVA_IMAGES[index];
  }

  // Priority 3: Loop through everything else
  const availableTotal = VERIFIED_NOVA_IMAGES.length;
  return VERIFIED_NOVA_IMAGES[index % availableTotal];
};

export const NarandaMamadeMV: React.FC = () => {
  const { durationInFrames: totalDuration } = useVideoConfig();
  const transitionFrames = LYRIC_GROUPS.map((group) => group[0].startFrame);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Global Effects Layer (Vignette, Grading, Border, Chromatic Aberration, Transitions) */}
      <GlobalEffects transitionFrames={transitionFrames} />

      <Audio src={MUSIC} />

      <AbsoluteFill>
        {/* Intro Sequence (90 frames) */}
        <Sequence durationInFrames={90}>
          <KanoIntro />
        </Sequence>

        {/* Lyrics-Matched Scenes */}
        {LYRIC_GROUPS.map((group, index) => {
          if (group.length === 0) return null;
          const startFrame = group[0].startFrame;

          // Start scenes from frame 90 (after intro)
          const from = Math.max(90, startFrame);
          // Calculate duration based on the NEXT group's start to fill gaps
          let duration;
          const isLast = index === LYRIC_GROUPS.length - 1;

          if (isLast) {
            duration = totalDuration - from;
          } else {
            // Find the start of the next group
            // The next group starts at group index + 1
            const nextGroup = LYRIC_GROUPS[index + 1];
            if (nextGroup && nextGroup.length > 0) {
              const nextStart = Math.max(90, nextGroup[0].startFrame);
              // Add +15 to overlap with the fade-in of the next scene
              duration = nextStart - from + 15;
            } else {
              // Fallback if next group is weird (shouldn't happen with current data)
              duration = group[group.length - 1].endFrame - from + 15;
            }
          }

          // Chorus Detection (Sabi)
          // Based on lyric structure in lyrics.ts
          const isChorus = group.some((line) => {
            const lineIdx = LYRICS.indexOf(line);
            // Sabi 1: Lines 20-23
            // Sabi 2: Lines 30-33
            // Last Sabi: Lines 38-46
            return (
              (lineIdx >= 20 && lineIdx <= 23) ||
              (lineIdx >= 30 && lineIdx <= 33) ||
              lineIdx >= 38
            );
          });

          // Prepare additional images for slideshow (only for Chorus)
          // We need at least 6 for the new album effect
          const extraImages = isChorus
            ? [
                ...SCENE_IMAGES,
                ...SCENE_IMAGES, // Double up to ensure we have at least 6
              ].slice(0, 6)
            : [];

          return (
            <Sequence
              key={index}
              from={from}
              durationInFrames={duration}
              name={
                index === LYRIC_GROUPS.length - 1
                  ? 'Epilogue (Memories & Duo)'
                  : `Scene ${index + 1}: ${group[0].text.substring(0, 10)}...`
              }
            >
              {index === LYRIC_GROUPS.length - 1 ? (
                <AbsoluteFill>
                  <EndCreditSlide images={VERIFIED_NOVA_IMAGES} />
                  <Scene
                    imageSrc={GET_IMAGE_FOR_PHRASE(index)}
                    characterName="NOVA & SHIGE"
                    color="#9b5de5"
                    duration={duration}
                    index={index}
                    isChorus={false}
                    isEpilogue={true} // Add this
                    additionalImages={[]}
                  />
                </AbsoluteFill>
              ) : (
                <Scene
                  imageSrc={GET_IMAGE_FOR_PHRASE(index)}
                  characterName="NOVA"
                  color="#9b5de5"
                  duration={duration}
                  index={index}
                  isChorus={isChorus}
                  additionalImages={extraImages}
                />
              )}
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {/* Final Climax Effects (Golden Bokeh & Mystical Atmosphere) */}
      <GoldenBokehOverlay startFrame={Math.round(93.2 * 30)} />

      {/* Subtitles Overlay always on top */}
      <SubtitleOverlay />
    </AbsoluteFill>
  );
};
