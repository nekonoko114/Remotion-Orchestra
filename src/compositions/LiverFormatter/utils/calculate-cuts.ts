export interface SubtitleWord {
	word: string;
	start: number;
	end: number;
	segmentId?: number;
}

export interface Clip {
	start: number; // Absolute start time in source video (seconds)
	end: number; // Absolute end time in source video (seconds)
	duration: number; // Duration of this clip (seconds)
	words: SubtitleWord[];
}

const SILENCE_THRESHOLD = 0.5; // Seconds of silence to trigger a cut
const PADDING = 0.1; // Seconds to pad around speech
const COUNTDOWN_WORDS = [
	"5、",
	"4、",
	"3、",
	"2、",
	"1。",
	"5",
	"4",
	"3",
	"2",
	"1",
];

export const calculateCuts = (allWords: SubtitleWord[]): Clip[] => {
	// 1. Remove initial countdown
	// A simple heuristic: remove sequential numbers from the start
	let startIndex = 0;
	for (let i = 0; i < allWords.length; i++) {
		const w = allWords[i].word.trim();
		if (COUNTDOWN_WORDS.includes(w)) {
			startIndex = i + 1;
		} else {
			// Stop at the first non-countdown word
			// But wait, "ジェネシス" is the first real word.
			// If we see "5, 4, 3, 2, 1", we skip all.
			// If we see arbitrary text, we stop.
			break;
		}
	}

	const validWords = allWords.slice(startIndex);

	if (validWords.length === 0) return [];

	const clips: Clip[] = [];

	// Initialize first clip
	let currentWords: SubtitleWord[] = [validWords[0]];
	let clipStart = Math.max(0, validWords[0].start - PADDING);

	for (let i = 1; i < validWords.length; i++) {
		const prevWord = validWords[i - 1];
		const currWord = validWords[i];
		const silenceDuration = currWord.start - prevWord.end;

		if (silenceDuration > SILENCE_THRESHOLD) {
			// Finalize current clip
			const clipEnd = prevWord.end + PADDING;
			clips.push({
				start: clipStart,
				end: clipEnd,
				duration: clipEnd - clipStart,
				words: currentWords,
			});

			// Start new clip
			currentWords = [currWord];
			clipStart = Math.max(0, currWord.start - PADDING);
		} else {
			currentWords.push(currWord);
		}
	}

	// Push final clip
	if (currentWords.length > 0) {
		const lastWord = currentWords[currentWords.length - 1];
		const clipEnd = lastWord.end + PADDING;
		clips.push({
			start: clipStart,
			end: clipEnd,
			duration: clipEnd - clipStart,
			words: currentWords,
		});
	}

	return clips;
};
