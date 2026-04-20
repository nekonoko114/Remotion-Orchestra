import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Background, COLORS, TitleStyle, SubtitleTextStyle, Glitch } from './Common';

export const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: { damping: 10 },
	});

	const rotate = interpolate(frame, [0, 150], [-2, 2]);

	return (
		<div style={{ flex: 1, position: 'relative' }}>
			<Background color={COLORS.scene1} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					zIndex: 1,
					opacity: entrance,
					transform: `rotate(${rotate}deg)`,
				}}
			>
				<Glitch>
					<h1 style={{ ...TitleStyle, color: COLORS.scene1, fontSize: '110px' }}>サイバーランドの輝き</h1>
				</Glitch>
				<p
					style={{
						...SubtitleTextStyle,
						backgroundColor: 'rgba(0,0,0,0.5)',
						padding: '20px 40px',
						borderLeft: `8px solid ${COLORS.scene1}`,
					}}
				>
					光と影が交錯する<br/>サイバーパンクの街
				</p>
			</div>
		</div>
	);
};
