import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Background, COLORS, TitleStyle, SubtitleTextStyle, Glitch } from './Common';

export const Opening: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: { damping: 10, stiffness: 100 },
	});

	const scale = interpolate(entrance, [0, 1], [4, 1]);

	return (
		<div style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}>
			<Background color={COLORS.opening} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					zIndex: 1,
					transform: `scale(${scale})`,
					opacity: entrance,
				}}
			>
				<Glitch>
					<h1 style={{ ...TitleStyle, color: COLORS.opening }}>未来の邂逅</h1>
				</Glitch>
				<p
					style={{
						...SubtitleTextStyle,
						transform: `translateY(${interpolate(entrance, [0, 1], [50, 0])}px)`,
					}}
				>
					DeepSeekとAntigravityが<br/>未来を切り拓く瞬間
				</p>
			</div>
		</div>
	);
};
