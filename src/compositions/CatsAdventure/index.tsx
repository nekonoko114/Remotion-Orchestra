import { AbsoluteFill, Audio, Sequence, Series, staticFile } from "remotion";
import { Scene1_Morning } from "./Scenes/Scene1_Morning";
import { Scene2_Walk } from "./Scenes/Scene2_Walk";
import { Scene3_Park } from "./Scenes/Scene3_Park";
import { Scene4_Sunset } from "./Scenes/Scene4_Sunset";
import { Scene5_Home } from "./Scenes/Scene5_Home";
import { Subtitles } from "./Subtitles";

import { FilmGrain } from "../../components/overlays/FilmGrain";
import { LightLeak } from "../../components/overlays/LightLeak";
// Rich Effects
import { ZoomBlurTransition } from "../../components/transitions/ZoomBlurTransition";

const SUBTITLE_DATA = [
	{
		startFrame: 0,
		endFrame: 120,
		text: "ある晴れた日の朝、猫の冒険が始まります。",
	},
	{
		startFrame: 120,
		endFrame: 240,
		text: "街角で出会った素敵な蝶々さん。待って〜！",
	},
	{
		startFrame: 240,
		endFrame: 360,
		text: "公園ではみんながのんびりと、穏やかな時間。",
	},
	{
		startFrame: 360,
		endFrame: 480,
		text: "空が茜色に染まる頃、そろそろお家に帰る時間です。",
	},
	{ startFrame: 480, endFrame: 600, text: "やっぱり、お家がいちばん。" },
];

export const CatsAdventure = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: "black" }}>
			<Audio src={staticFile("audio/bgm.mp3")} volume={0.5} />

			<Series>
				<Series.Sequence durationInFrames={120}>
					<ZoomBlurTransition type="in">
						<Scene1_Morning />
					</ZoomBlurTransition>
				</Series.Sequence>

				<Series.Sequence durationInFrames={120}>
					<ZoomBlurTransition type="out">
						<Scene2_Walk />
					</ZoomBlurTransition>
				</Series.Sequence>

				<Series.Sequence durationInFrames={120}>
					<ZoomBlurTransition type="in">
						<Scene3_Park />
					</ZoomBlurTransition>
				</Series.Sequence>

				<Series.Sequence durationInFrames={120}>
					<ZoomBlurTransition type="out">
						<Scene4_Sunset />
					</ZoomBlurTransition>
				</Series.Sequence>

				<Series.Sequence durationInFrames={120}>
					<Scene5_Home />
				</Series.Sequence>
			</Series>

			{/* Overlays */}
			<LightLeak />
			<FilmGrain />

			<Subtitles items={SUBTITLE_DATA} />
		</AbsoluteFill>
	);
};
