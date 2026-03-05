import React, { useRef } from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  Easing,
  Sequence,
  spring,
} from 'remotion';
import { z } from 'zod';
import { ChorusBackground } from './ChorusBackground';

// 歌詞データのスキーマ
export const LyricSchema = z.object({
  text: z.string(),
  start: z.number(), // timestamp (seconds)
  end: z.number(), // timestamp (seconds)
});

export type Lyric = z.infer<typeof LyricSchema>;

interface LyricsProps {
  subtitles: Lyric[];
  layer: 'background' | 'foreground';
}

// サビの時間範囲定義 (ここに含まれる行は特殊演出)
// サビの時間範囲定義 (ここに含まれる行は特殊演出)
export const CHORUS_RANGES = [
  { start: 52.72, end: 75.6 },
  { start: 105.1, end: 127.36 },
  { start: 168.32, end: 190.34 },
];

export const isChorusTime = (time: number) => {
  // 厳密な判定: 範囲内かどうか
  return CHORUS_RANGES.some(
    (range) => time >= range.start && time <= range.end,
  );
};

// --- タイミング微調整用 (音より歌詞が遅い場合はマイナス、早い場合はプラス) ---
const SYNC_OFFSET = 0.15;

export const Lyrics: React.FC<LyricsProps> = ({ subtitles, layer }) => {
  const { fps } = useVideoConfig(); // width, height 取得不要なら削除
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement>(null);

  // 背景表示判定用: 現在のフレームがいずれかの歌詞の表示期間に含まれ、かつその歌詞がサビ判定なら背景ON
  const currentSubtitle = subtitles.find((sub) => {
    const startFrame = (sub.start + SYNC_OFFSET) * fps;
    const endFrame = (sub.end + SYNC_OFFSET) * fps;
    // マージンを少し持たせるか、厳密にするか
    return frame >= startFrame && frame < endFrame;
  });
  const isCurrentChorus = currentSubtitle
    ? isChorusTime(currentSubtitle.start)
    : false;

  // また、歌詞がない区間でもサビの範囲内なら背景を出したい場合は以下のようにする
  // const currentTime = frame / fps;
  // const isInChorusRange = isChorusTime(currentTime);
  // 今回は「サビの歌詞が出ているとき」に合わせる実装とするが、
  // インストゥルメンタル部分でも背景を出したいなら isInChorusRange を使う。

  // 暗転マスクの不透明度計算
  const dimAlpha = interpolate(currentSubtitle ? 1 : 0, [0, 1], [0, 0.4], {
    easing: Easing.out(Easing.exp),
  });

  return (
    <AbsoluteFill ref={containerRef} style={{ pointerEvents: 'none' }}>
      {/* 背景のディミングマスク (歌詞がある時だけ少し暗くする) */}
      <AbsoluteFill
        style={{
          backgroundColor: 'black',
          opacity: dimAlpha,
          pointerEvents: 'none',
          zIndex: -2,
        }}
      />

      {/* サビ背景 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isCurrentChorus ? 1 : 0,
          transition: 'opacity 0.2s steps(1)', // 切り替え
          zIndex: -1,
        }}
      >
        <ChorusBackground />
      </div>

      {subtitles.map((sub, index) => {
        // 生の時間でサビ判定
        const isChorus = isChorusTime(sub.start);

        // レイヤー判定
        // サビは常に手前 (foreground) でインパクト重視
        // それ以外は index が偶数なら背景、奇数なら前景
        const subLayer = isChorus
          ? 'foreground'
          : index % 2 === 0
            ? 'background'
            : 'foreground';
        if (subLayer !== layer) return null;

        const startTime = sub.start + SYNC_OFFSET;
        const endTime = sub.end + SYNC_OFFSET;
        const duration = endTime - startTime;

        // Sequenceのfrom/durationInFramesは整数である必要がある
        const startFrame = Math.round(startTime * fps);
        const durationFrames = Math.round(duration * fps);

        if (isChorus) return null; // Chorus is handled by ChorusLyrics.tsx now

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationFrames}
            layout="none" // AbsoluteFillを自動追加しない
          >
            <NonChorusLyric
              text={sub.text}
              durationFrames={durationFrames}
              fps={fps}
              index={index}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// 決定的な疑似乱数生成 (indexをシードにする)
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 通常歌詞用のサブコンポーネント (Updated for Variety)
const NonChorusLyric: React.FC<{
  text: string;
  durationFrames: number;
  fps: number;
  index: number;
}> = ({ text, durationFrames, fps, index }) => {
  const frame = useCurrentFrame();
  const chars = text.split('');
  const staggerFrames = 3;

  // Animation Type Determination (0: Pop/Scatter, 1: Slide In, 2: Pass Through)
  const animType = Math.floor(pseudoRandom(index * 999) * 3);

  // --- Common Random Values ---
  const randomX = (pseudoRandom(index * 123.4) - 0.5) * 40; // -20% ~ 20%
  const randomY = (pseudoRandom(index * 567.8) - 0.5) * 40; // -20% ~ 20%
  const randomRotation = (pseudoRandom(index * 910.1) - 0.5) * 15; // -7.5deg ~ 7.5deg
  const glowColor =
    pseudoRandom(index * 111.1) > 0.5
      ? 'rgba(177, 156, 217, 0.8)'
      : 'rgba(255, 158, 125, 0.8)';

  // --- Type Specific Logic ---
  let containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    zIndex: 5,
    transform: `translate(${randomX}%, ${randomY}%) rotate(${randomRotation}deg)`,
  };

  if (animType === 1) {
    // Slide In
    const slideDirection = pseudoRandom(index * 222) > 0.5 ? 1 : -1; // Left or Right
    const slideDist = 300 * slideDirection;
    const slideProgress = spring({ frame, fps, config: { damping: 15 } });
    const currentX = interpolate(slideProgress, [0, 1], [slideDist, 0]);

    containerStyle.transform = `translate(calc(${randomX}% + ${currentX}px), ${randomY}%) rotate(${randomRotation}deg)`;
  } else if (animType === 2) {
    // Pass Through / Drift
    const driftDir = pseudoRandom(index * 333) > 0.5 ? 1 : -1;
    const driftStart = -50 * driftDir;
    const driftEnd = 50 * driftDir;
    const driftX = interpolate(
      frame,
      [0, durationFrames],
      [driftStart, driftEnd],
    );

    containerStyle.transform = `translate(calc(${randomX}% + ${driftX}px), ${randomY}%) rotate(${randomRotation}deg)`;
  }

  return (
    <div className={`lyric-row-${index}`} style={containerStyle}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '90%',
        }}
      >
        {chars.map((char, charIndex) => {
          const charDelay = charIndex * staggerFrames;
          const charFrame = frame - charDelay;

          // 1. Entrance
          let opacity = 1;
          let scale = 1;
          let blur = 0;
          let charTransY = 0;

          if (animType === 0) {
            // Pop / Scatter (Original)
            opacity = interpolate(charFrame, [0, 5], [0, 1], {
              extrapolateRight: 'clamp',
            });
            scale = interpolate(charFrame, [0, 10], [3.0, 1], {
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.exp),
            });
            blur = interpolate(charFrame, [0, 5], [20, 0], {
              extrapolateRight: 'clamp',
            });
          } else if (animType === 1) {
            // Slide In (Letters match container)
            opacity = interpolate(charFrame, [0, 5], [0, 1], {
              extrapolateRight: 'clamp',
            });
            // Subtle individual float
            charTransY = Math.sin((frame + charIndex) / 10) * 5;
          } else if (animType === 2) {
            // Pass Through (Fade smoothly)
            opacity = interpolate(charFrame, [0, 10], [0, 1], {
              extrapolateRight: 'clamp',
            });
          }

          // 2. Exit (Common)
          const exitOpacity = interpolate(
            frame,
            [durationFrames - 8, durationFrames],
            [1, 0],
            { extrapolateRight: 'clamp' },
          );

          return (
            <span
              key={charIndex}
              className="lyric-char"
              style={{
                display: 'inline-block',
                fontSize: `110px`,
                fontWeight: 900,
                fontFamily: '"Alumni Sans", sans-serif',
                fontStyle: 'italic',
                color: '#FFFFFF',
                textShadow: `
                                    0 0 15px ${glowColor},
                                    4px 4px 0 #000,
                                    -4px -4px 0 #000,
                                    4px -4px 0 #000,
                                    -4px 4px 0 #000,
                                    0px 4px 0 #000,
                                    0px -4px 0 #000,
                                    4px 0px 0 #000,
                                    -4px 0px 0 #000
                                `,
                whiteSpace: 'pre',
                lineHeight: '1',
                margin: '0 1px',
                opacity: opacity * exitOpacity,
                transform: `scale(${scale}) translateY(${charTransY}px)`,
                filter: `blur(${blur}px)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};
