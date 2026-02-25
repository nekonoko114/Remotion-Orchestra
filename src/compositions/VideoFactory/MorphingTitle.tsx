import React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

interface MorphingTitleProps {
	text: string;
	fontSize?: number;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * まる（円）からテキストへとモーフィングして現れるコンポーネント
 * SVGの goo/liquid フィルタを使用して「溶けて繋がる」質感を演出
 */
export const MorphingTitle: React.FC<MorphingTitleProps> = ({
	text,
	fontSize = 150,
	className,
	style,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// 登場のアニメーション
	const spr = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 120, mass: 0.8 },
	});

	// モーフィングの進捗 (0 = まる, 1 = テキスト)
	const morphProgress = interpolate(spr, [0, 0.8], [0, 1], {
		extrapolateRight: "clamp",
	});

	// 円のサイズと位置
	const circleScale = interpolate(spr, [0, 0.4], [0, 2.5], {
		extrapolateRight: "clamp",
	});
	const circleOpacity = interpolate(spr, [0.7, 1], [1, 0], {
		extrapolateRight: "clamp",
	});

	// テキストのぼかし (最初は強くぼかして円と一体化させる)
	const textBlur = interpolate(morphProgress, [0, 0.6, 1], [20, 10, 0]);
	const textOpacity = interpolate(morphProgress, [0.2, 0.8], [0, 1]);
	const textScale = interpolate(spr, [0, 1], [0.8, 1]);

	return (
		<div
			style={{
				position: "relative",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				...style,
			}}
		>
			<svg
				style={{ position: "absolute", width: 0, height: 0 }}
				aria-hidden="true"
			>
				<defs>
					<filter id="goo">
						<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
						<feColorMatrix
							in="blur"
							mode="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
							result="goo"
						/>
						<feComposite in="SourceGraphic" in2="goo" operator="atop" />
					</filter>
				</defs>
			</svg>

			{/* フィルタを適用するコンテナ */}
			<div
				style={{
					filter: "url(#goo)",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					position: "relative",
				}}
			>
				{/* モーフィング元：まる */}
				{circleOpacity > 0 && (
					<div
						style={{
							position: "absolute",
							width: fontSize * 0.8,
							height: fontSize * 0.8,
							backgroundColor: "white",
							borderRadius: "50%",
							transform: `scale(${circleScale * (1 - morphProgress * 0.8)})`,
							opacity: circleOpacity,
							zIndex: 1,
							boxShadow: "0 0 30px white",
						}}
					/>
				)}

				{/* モーフィング先：テキスト */}
				<div
					className={className}
					style={{
						fontSize,
						fontWeight: "bold",
						fontFamily: "Impact, sans-serif",
						opacity: textOpacity,
						filter: `blur(${textBlur}px)`,
						transform: `scale(${textScale})`,
						textAlign: "center",
						whiteSpace: "nowrap",
						zIndex: 2,
					}}
				>
					{text}
				</div>
			</div>
		</div>
	);
};
