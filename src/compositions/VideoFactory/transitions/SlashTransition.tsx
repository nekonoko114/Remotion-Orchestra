import React from 'react';
import { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { AbsoluteFill, interpolate } from 'remotion';

export const slashTransition = (options?: { color?: string }): TransitionPresentation<any> => {
	const color = options?.color || '#00FF7F';

	const component: React.FC<TransitionPresentationComponentProps<any>> = ({
		children,
		presentationProgress,
	}) => {
		const arr = React.Children.toArray(children);

		// Progress from 0 to 1
		// We want the "slash" line to move from left to right
		// Since it's diagonal, we need a wider range to clear the screen
		const offset = interpolate(presentationProgress, [0, 1], [-50, 150]);

		return (
			<AbsoluteFill>
				{/* Scene A (Bottom) */}
				<AbsoluteFill>{arr[0]}</AbsoluteFill>

				{/* Scene B (Top, Clipped) */}
				<AbsoluteFill
					style={{
						clipPath: `polygon(${offset}% 0%, 200% 0%, 200% 100%, ${offset - 40}% 100%)`,
					}}
				>
					{arr[1]}
				</AbsoluteFill>

				{/* The "Slash" Line (Glow effect) */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: `${offset}%`,
						width: '40px',
						height: '100%',
						backgroundColor: color,
						boxShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
						transform: 'skewX(-20deg) translateX(-50%)',
						zIndex: 10,
						opacity: interpolate(presentationProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
					}}
				/>
			</AbsoluteFill>
		);
	};

	return { component, props: {} };
};
