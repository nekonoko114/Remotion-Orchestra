import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

export const NetworkGraph: React.FC<{
	color?: string;
	nodeCount?: number;
}> = ({ color = "#00aaff", nodeCount = 30 }) => {
	const frame = useCurrentFrame();

	// ノードの初期位置と動きのベクトルを生成
	// seed固定のため useMemo は本来不要だが、計算コスト考慮
	const nodes = useMemo(() => {
		return Array.from({ length: nodeCount }).map((_, i) => ({
			id: i,
			baseX: random(i) * 100, // %
			baseY: random(i + 100) * 100, // %
			speedX: (random(i + 200) - 0.5) * 0.2, // 速度
			speedY: (random(i + 300) - 0.5) * 0.2,
		}));
	}, [nodeCount]);

	// 現在フレームでの座標計算
	const currentNodes = nodes.map((node) => {
		// 画面端で折り返す動き（簡易的にサイン波でリピート）
		// baseX + frame * speed では無限に行ってしまうので、sinで揺らす
		const moveX = Math.sin(frame * 0.05 * node.speedX * 10 + node.id) * 10;
		const moveY = Math.cos(frame * 0.05 * node.speedY * 10 + node.id) * 10;

		return {
			...node,
			x: node.baseX + moveX,
			y: node.baseY + moveY,
		};
	});

	// ノード間の距離を計算し、近いもの同士を線で結ぶ
	const links: React.ReactNode[] = [];
	for (const [i, nodeA] of currentNodes.entries()) {
		for (const nodeB of currentNodes.slice(i + 1)) {
			const dx = nodeA.x - nodeB.x;
			const dy = nodeA.y - nodeB.y;
			const distSq = dx * dx + dy * dy; // 距離の二乗（%単位^2）

			// 閾値以下の距離なら線を引く (20%以内 = 400)
			if (distSq < 200) {
				const opacity = 1 - distSq / 200; // 遠いほど薄く
				links.push(
					<line
						key={`${nodeA.id}-${nodeB.id}`}
						x1={`${nodeA.x}%`}
						y1={`${nodeA.y}%`}
						x2={`${nodeB.x}%`}
						y2={`${nodeB.y}%`}
						stroke={color}
						strokeWidth="1"
						strokeOpacity={opacity * 0.6}
						style={{ willChange: "transform" }}
					/>,
				);
			}
		}
	}

	return (
		<AbsoluteFill style={{ backgroundColor: "transparent" }}>
			<svg width="100%" height="100%" aria-label="Network graph">
				<title>Network Graph</title>
				{/* Connection Lines */}
				{links}

				{/* Nodes */}
				{currentNodes.map((node) => (
					<circle
						key={node.id}
						cx={`${node.x}%`}
						cy={`${node.y}%`}
						r="3"
						fill={color}
						opacity={0.8}
						style={{ willChange: "transform" }}
					/>
				))}
			</svg>

			{/* Background Grid */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
					backgroundSize: "40px 40px",
					opacity: 0.1,
					zIndex: -1,
				}}
			/>
		</AbsoluteFill>
	);
};
