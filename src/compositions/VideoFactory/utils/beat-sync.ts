import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * BPMに基づいたビートシンク用の値を計算するユーティリティ
 */
export const useBeatValue = (bpm: number, offsetFrames = 0) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// 1拍あたりのフレーム数
	const framesPerBeat = (60 / bpm) * fps;
	
	// 現在のフレームにおける拍内の位置 (0.0 ～ 1.0)
	const beatProgress = ((frame - offsetFrames) % framesPerBeat) / framesPerBeat;

	// ビートの瞬間に 1.0 になり、指数関数的に 0.0 へ減衰するカーブ (キックのような動き)
	const pulse = Math.pow(1 - beatProgress, 3);

	return {
		pulse, // 1.0 (インパクト) -> 0.0
		framesPerBeat,
		beatIndex: Math.floor((frame - offsetFrames) / framesPerBeat),
	};
};
