import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, random } from 'remotion';

export const COLORS = {
	opening: '#00FFCC', // ネオン青
	scene1: '#FF006E',  // ネオンピンク
	scene2: '#FFD700',  // ネオンゴールド
	ending: '#00FF95',   // ネオングリーン
};

export const Glitch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const frame = useCurrentFrame();
	const glitch = random(frame) > 0.95;
	const offsetX = glitch ? (random(frame + 1) - 0.5) * 20 : 0;
	
	return (
		<div style={{ transform: `translateX(${offsetX}px)`, filter: glitch ? 'hue-rotate(90deg)' : 'none' }}>
			{children}
		</div>
	);
};

export const Background: React.FC<{ color: string }> = ({ color }) => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();
	
	const opacity = interpolate(frame, [0, 15], [0, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: '#050505',
				width,
				height,
				opacity,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				overflow: 'hidden',
			}}
		>
			{/* Neon grid or lines */}
			<div
				style={{
					position: 'absolute',
					width: '200%',
					height: '200%',
					backgroundImage: `linear-gradient(${color}22 1px, transparent 1px), linear-gradient(90deg, ${color}22 1px, transparent 1px)`,
					backgroundSize: '100px 100px',
					transform: `perspective(500px) rotateX(60deg) translateY(${frame % 100}px)`,
				}}
			/>
			
			{/* Center glow */}
			<div
				style={{
					position: 'absolute',
					width: '800px',
					height: '800px',
					background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
					filter: 'blur(40px)',
				}}
			/>
		</div>
	);
};

export const TitleStyle: React.CSSProperties = {
	fontFamily: '"Mochiy Pop One", "Outfit", sans-serif',
	fontSize: '100px',
	fontWeight: 900,
	color: 'white',
	textAlign: 'center',
	textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px currentColor',
	margin: '0 40px',
	letterSpacing: '4px',
};

export const SubtitleTextStyle: React.CSSProperties = {
	fontFamily: '"Inter", sans-serif',
	fontSize: '44px',
	fontWeight: 500,
	color: 'white',
	textAlign: 'center',
	marginTop: '30px',
	lineHeight: 1.4,
	maxWidth: '90%',
	textShadow: '0 0 10px rgba(255,255,255,0.5)',
};
