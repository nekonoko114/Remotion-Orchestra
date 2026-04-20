import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Background, COLORS, TitleStyle, SubtitleTextStyle, Glitch } from './Common';

export const Ending: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: { damping: 10 },
	});

	const scanlinePos = interpolate(frame % 20, [0, 20], [0, 100]);

	return (
		<div style={{ flex: 1, position: 'relative' }}>
			<Background color={COLORS.ending} />
			
			{/* Cyberpunk scanline effect */}
			<div
				style={{
					position: 'absolute',
					top: `${scanlinePos}%`,
					left: 0,
					right: 0,
					height: '2px',
					background: COLORS.ending,
					opacity: 0.3,
					zIndex: 10,
				}}
			/>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					zIndex: 1,
					opacity: entrance,
				}}
			>
				<Glitch>
					<h1 style={{ ...TitleStyle, color: COLORS.ending, fontSize: '110px' }}>新たなる時代へ</h1>
				</Glitch>
				<p style={SubtitleTextStyle}>
					DeepSeekとAntigravityが<br/>開かれし未来へ
				</p>
				
				<div
					style={{
						marginTop: '50px',
						padding: '10px 30px',
						border: `2px solid ${COLORS.ending}`,
						color: COLORS.ending,
						fontSize: '24px',
						fontFamily: 'monospace',
						boxShadow: `0 0 15px ${COLORS.ending}`,
					}}
				>
					SYSTEM STATUS: EVOLVED
				</div>
			</div>
		</div>
	);
};
