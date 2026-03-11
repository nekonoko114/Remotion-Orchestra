import { useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BPMに基づいたビートシンク用の値を計算するユーティリティ
 */
export const useBeatValue = (bpm: number, offsetFrames = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1拍あたりのフレーム数
  const framesPerBeat = (60 / bpm) * fps;

  // 現在のフレームにおける拍内の位置 (0.0 ～ 1.0)
  // JavaScriptの剰余演算子(%)は負の数だと負の値を返すため、正の数になるよう補正します
  const relativeFrame = frame - offsetFrames;
  const modFrame = ((relativeFrame % framesPerBeat) + framesPerBeat) % framesPerBeat;
  const beatProgress = modFrame / framesPerBeat;

  // ビートの瞬間に 1.0 になり、滑らかに減衰・上昇する呼吸のようなカーブ (急激なジャンプを防ぐ)
  const pulse = (1 + Math.cos(beatProgress * Math.PI * 2)) / 2;

  return {
    pulse, // 1.0 (インパクト) -> 0.0
    framesPerBeat,
    beatIndex: Math.floor((frame - offsetFrames) / framesPerBeat),
  };
};
