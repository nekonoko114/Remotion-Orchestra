import type React from 'react';
import { useMemo } from 'react';
import {
  AbsoluteFill,
  Series,
  Video,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { MyAnimation as WordHighlightAnimation } from './skills/remotion/rules/assets/text-animations-word-highlight';
import subtitles from './subtitles.json';
import { calculateCuts } from './utils/calculate-cuts';

const FPS = 30;

export const JumpCutComposition: React.FC = () => {
  // 1. Calculate cuts and prepare flat timeline data
  const { clipsWithGlobal, flattenedWords } = useMemo(() => {
    // Prepare words
    const rawWords = subtitles.words.map((w: any) => {
      const segment = subtitles.segments.find(
        (s: any) =>
          (w.start >= s.start && w.start < s.end) ||
          (w.end > s.start && w.end <= s.end),
      );
      return {
        ...w,
        segmentId: segment ? segment.id : -1,
      };
    });

    // Get Cuts (Clips of valid Duration)
    const rawClips = calculateCuts(rawWords);

    // Map to Global Timeline
    let currentGlobalTime = 0;
    const processedClips: typeof rawClips & { globalStart: number }[] = [];
    const processedWords: any[] = [];

    rawClips.forEach((clip) => {
      // Keep track of where this clip starts on the NEW timeline
      const globalStart = currentGlobalTime;

      processedClips.push({
        ...clip,
        globalStart,
      });

      // Map words in this clip to the NEW timeline
      clip.words.forEach((w) => {
        const offset = globalStart - clip.start;

        processedWords.push({
          word: w.word,
          display: (w as any).display, // AIが生成したテロップ用テキスト
          startFrame: Math.floor((w.start + offset) * FPS),
          endFrame: Math.floor((w.end + offset) * FPS),
          segmentId: w.segmentId,
        });
      });

      currentGlobalTime += clip.duration;
    });

    return { clipsWithGlobal: processedClips, flattenedWords: processedWords };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Series>
        {clipsWithGlobal.map((clip, i) => (
          <Series.Sequence
            key={i}
            durationInFrames={Math.floor(clip.duration * FPS)}
            premountFor={12} // 1秒(30)は重すぎた可能性があるため、0.4秒(12)に短縮
          >
            <Video
              src={staticFile('liver-formatter/video/test-video.MOV')}
              startFrom={Math.floor(clip.start * FPS)}
              style={{ width: '100%', height: '100%' }}
            />
          </Series.Sequence>
        ))}
      </Series>
      <WordHighlightAnimation words={flattenedWords} />
    </AbsoluteFill>
  );
};
