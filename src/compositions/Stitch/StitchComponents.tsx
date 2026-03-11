import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';

// @ts-ignore
export const { fontFamily } = loadFont('normal', {
	weights: ['300', '400', '700'],
	subsets: ['latin'],
	ignoreTooManyRequestsWarning: true,
});

export const HUDCorners: React.FC = () => {
	return (
		<AbsoluteFill className="pointer-events-none p-8">
			<div className="relative w-full h-full border border-[#f20d80]/10">
				<div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#f20d80]" />
				<div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#f20d80]" />
				<div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#f20d80]" />
				<div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#f20d80]" />
			</div>
		</AbsoluteFill>
	);
};

export const GlassCard: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({ children, className = '' }) => {
	return (
		<div
			className={`
        bg-[#221019]/60 backdrop-blur-xl border border-[#f20d80]/30 
        rounded-xl shadow-lg border-l-4 border-l-[#f20d80]
        ${className}
      `}
		>
			{children}
		</div>
	);
};

export const Scanlines: React.FC = () => {
	return (
		<AbsoluteFill
			className="pointer-events-none opacity-30"
			style={{
				background: `linear-gradient(to bottom, transparent 50%, rgba(242, 13, 128, 0.05) 50%)`,
				backgroundSize: '100% 4px',
			}}
		/>
	);
};
