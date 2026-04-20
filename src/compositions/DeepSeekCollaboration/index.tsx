import React from 'react';
import { Series } from 'remotion';
import { Opening } from './components/Opening';
import { Scene1 } from './components/Scene1';
import { Scene2 } from './components/Scene2';
import { Ending } from './components/Ending';

export const SCENE_DURATION = 150; // 2.5 seconds at 60fps

export const DeepSeekCollaboration: React.FC = () => {
	return (
		<div style={{ flex: 1, backgroundColor: 'black' }}>
			<Series>
				<Series.Sequence durationInFrames={SCENE_DURATION}>
					<Opening />
				</Series.Sequence>
				<Series.Sequence durationInFrames={SCENE_DURATION}>
					<Scene1 />
				</Series.Sequence>
				<Series.Sequence durationInFrames={SCENE_DURATION}>
					<Scene2 />
				</Series.Sequence>
				<Series.Sequence durationInFrames={SCENE_DURATION}>
					<Ending />
				</Series.Sequence>
			</Series>
		</div>
	);
};
