import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Background, COLORS, TitleStyle, SubtitleTextStyle, Glitch } from './Common';

export const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: { damping: 10 },
	});

	const skew = interpolate(frame, [0, 150], [0, 10]);

	return (
		<div style={{ flex: 1, position: 'relative' }}>
			<Background color={COLORS.scene2} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					zIndex: 1,
					opacity: entrance,
					transform: `skewX(${skew}deg)`,
				}}
			>
				<Glitch>
					<h1 style={{ ...TitleStyle, color: COLORS.scene2 }}>デジタルフュージョン</h1>
				</Glitch>
				<p
					style={{
						...SubtitleTextStyle,
						textTransform: 'uppercase',
						letterSpacing: '2px',
					}}
				>
					ハードとソフトが融合する瞬間
				</p>
			</div>
		</div>
	);
};
