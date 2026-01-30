import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export interface SmokeEffectProps {
	color?: string;
	velocity?: number;
	density?: number;
}

export const SmokeEffect: React.FC<SmokeEffectProps> = ({
	color = "#ffffff",
	velocity = 0.5,
	density = 0.02,
}) => {
	const frame = useCurrentFrame();

	// フラクタルノイズのアニメーション
	// baseFrequencyを微妙に動かすことで、煙が流れる様子を表現
	const offset = frame * velocity * 0.5;

	return (
		<AbsoluteFill style={{ backgroundColor: "transparent" }}>
			<svg width="100%" height="100%" aria-label="Smoke effect">
				<title>Smoke Effect</title>
				<filter id="smokeFilter">
					{/* 乱気流ノイズを生成 */}
					<feTurbulence
						type="fractalNoise"
						baseFrequency={density}
						numOctaves="3"
						seed={1}
						result="noise"
					>
						<animate
							attributeName="baseFrequency"
							values={`${density};${density - 0.005};${density}`}
							dur="10s"
							repeatCount="indefinite"
						/>
					</feTurbulence>

					{/* ノイズを変位マップとして使用し、霧のような質感を作る */}
					<feDisplacementMap in="SourceGraphic" in2="noise" scale="50" />

					{/* 色の調整: ノイズの輝度を使って透明度変化を作る */}
					<feColorMatrix
						type="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
						result="smoke"
					/>
				</filter>

				{/* フィルター適用対象（ここでは透明な矩形だが、フィルタにより煙として可視化される） */}
				{/* 実際にはturbulance自体を表示する必要があるため、少しトリックを使う */}
			</svg>

			{/* SVGフィルターはDOM要素適用型。Turbulence自体を描画する別アプローチ */}
			<div
				style={{
					width: "100%",
					height: "100%",
					opacity: 0.5,
					background: color,
					// maskImage を使ってノイズで切り抜く手法に切り替え（Remotionで安定動作させるため）
				}}
			>
				<svg width="0" height="0" aria-label="Smoke mask">
					<title>Smoke Mask</title>
					<filter id="fractalNoiseMask">
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.015"
							numOctaves="5"
							seed={Math.floor(frame / 100)}
						/>
						{/* 動きをつけるためにtransformを使用 */}
					</filter>
				</svg>

				{/* CSS GradientとSVGフィルターの組み合わせで煙を模倣 */}
				<div
					style={{
						position: "absolute",
						width: "200%",
						height: "200%",
						top: "-50%",
						left: "-50%",
						backgroundImage:
							"radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)",
						filter: "url(#smoketurb)",
						transform: `translate(${-offset}px, ${-offset * 0.5}px)`,
						opacity: 0.3,
					}}
				/>
			</div>

			{/* 簡易実装版: CSS FilterとBlurを使った重層的な煙 */}
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: Smoke layers
					key={i}
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						width: 400 + i * 100,
						height: 400 + i * 100,
						borderRadius: "50%",
						background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
						transform: `translate(-50%, -50%) translate(${Math.sin(frame * 0.02 + i) * 100}px, ${Math.cos(frame * 0.03 + i) * 50}px)`,
						filter: `blur(${30 + i * 10}px)`,
						opacity: 0.15,
						mixBlendMode: "screen",
						willChange: "transform",
					}}
				/>
			))}
		</AbsoluteFill>
	);
};
