import React from 'react';
import {
	AbsoluteFill,
	Img,
	staticFile,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {
	HUDCorners,
	GlassCard,
	Scanlines,
	fontFamily,
} from './StitchComponents';

// ─── タイミング定数 (フレーム) ─────────────────────────────
const T = {
	bgFadeIn: [0, 20],        // 背景: フェードイン
	hudIn: [10, 40],          // HUDコーナー: スケールイン
	liveBadgeIn: [15, 35],    // LIVEバッジ: フェードイン + スライド
	cardIn: [30, 65],         // ランキングカード: 右からスライドイン
	killFeedIn: [70, 95],     // キルフィード: 下からスライドイン
	sidebarIn: [55, 100],     // サイドバーアイコン: スタッガー
	controlsIn: [85, 115],    // 下部コントロール: 上からスライドイン
	progressBar: [100, 220],  // プログレスバー: 伸張
};

export const StitchOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// ── 背景 ──────────────────────────────────────────────
	const bgOpacity = interpolate(frame, T.bgFadeIn, [0, 1], { extrapolateRight: 'clamp' });
	const bgScale = interpolate(frame, [0, 300], [1.08, 1.0], { extrapolateRight: 'clamp' });

	// ── HUDコーナー ─────────────────────────────────────
	const hudScale = spring({ frame: frame - T.hudIn[0], fps, config: { stiffness: 180, damping: 20 } });
	const hudOpacity = interpolate(frame, T.hudIn, [0, 1], { extrapolateRight: 'clamp' });

	// ── LIVEバッジ ──────────────────────────────────────
	const liveY = interpolate(frame, T.liveBadgeIn, [-20, 0], { extrapolateRight: 'clamp' });
	const liveOpacity = interpolate(frame, T.liveBadgeIn, [0, 1], { extrapolateRight: 'clamp' });

	// ── ランキングカード ─────────────────────────────────
	const cardX = interpolate(frame, T.cardIn, [120, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
	const cardOpacity = interpolate(frame, T.cardIn, [0, 1], { extrapolateRight: 'clamp' });
	const cardScale = spring({ frame: frame - T.cardIn[0], fps, config: { stiffness: 120, damping: 20 } });

	// ── キルフィード ─────────────────────────────────────
	const killY = interpolate(frame, T.killFeedIn, [30, 0], { extrapolateRight: 'clamp' });
	const killOpacity = interpolate(frame, T.killFeedIn, [0, 1], { extrapolateRight: 'clamp' });

	// ── 下部コントロール ─────────────────────────────────
	const ctrlY = interpolate(frame, T.controlsIn, [40, 0], { extrapolateRight: 'clamp' });
	const ctrlOpacity = interpolate(frame, T.controlsIn, [0, 1], { extrapolateRight: 'clamp' });

	// ── プログレスバー ───────────────────────────────────
	const progressWidth = interpolate(frame, T.progressBar, [0, 66], { extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill
			className="bg-[#221019] overflow-hidden text-white"
			style={{ fontFamily }}
		>
			{/* === 背景 === */}
			<AbsoluteFill style={{ opacity: bgOpacity, transform: `scale(${bgScale})` }}>
				<Img
					src={staticFile('assets/stitch/bg_gaming.png')}
					className="w-full h-full object-cover"
				/>
				<AbsoluteFill className="bg-gradient-to-t from-[#221019]/80 via-transparent to-[#221019]/40" />
				<Scanlines />
			</AbsoluteFill>

			{/* === HUDコーナー === */}
			<div
				style={{
					opacity: hudOpacity,
					transform: `scale(${hudScale})`,
					position: 'absolute',
					inset: 0,
				}}
			>
				<HUDCorners />
			</div>

			{/* === LIVEバッジ === */}
			<div
				className="absolute top-12 left-12 flex items-center gap-2"
				style={{ opacity: liveOpacity, transform: `translateY(${liveY}px)` }}
			>
				<div className="w-2 h-2 rounded-full bg-[#f20d80] animate-pulse" />
				<span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#f20d80]">
					Live Signal Detected
				</span>
			</div>

			{/* === メインコンテンツ === */}
			<AbsoluteFill className="flex flex-col justify-center px-12 pointer-events-none">

				{/* ランキングカード */}
				<div
					className="self-end mt-24"
					style={{
						opacity: cardOpacity,
						transform: `translateX(${cardX}px) scale(${Math.min(cardScale, 1)})`,
					}}
				>
					<GlassCard className="p-6 pointer-events-auto max-w-[320px] shadow-2xl shadow-[#f20d80]/20">
						<div className="flex items-center gap-4 mb-6">
							<div className="relative">
								<div className="w-16 h-16 rounded-full border-2 border-[#f20d80] overflow-hidden bg-[#221019]">
									<Img
										src={staticFile('assets/stitch/avatar_cyberghost.png')}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="absolute -bottom-1 -right-1 bg-[#f20d80] text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase italic">
									Pro
								</div>
							</div>
							<div className="flex flex-col">
								<span className="text-[10px] text-[#f20d80]/80 font-black uppercase tracking-widest">
									Top Player
								</span>
								<h2 className="text-2xl font-bold leading-tight tracking-tight">
									CyberGhost
								</h2>
							</div>
						</div>

						<div className="flex items-center gap-3 mb-6 bg-[#f20d80]/10 p-3 rounded-lg border border-[#f20d80]/20">
							<div className="text-[#f20d80] text-2xl font-black">🏆</div>
							<div className="flex flex-col">
								<span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
									Rank Status
								</span>
								<span className="text-base font-black text-slate-100 italic">
									Platinum Elite
								</span>
							</div>
						</div>

						{/* スタット数値 — カードが入場後にカウントアップ */}
						<div className="grid grid-cols-2 gap-3">
							{[
								{ label: 'Kills', max: 24, suffix: '', badge: '+15%' },
								{ label: 'Damage', max: 45, suffix: '.0k', badge: '+20%' },
							].map(({ label, max, suffix, badge }) => {
								const countFrame = Math.max(0, frame - T.cardIn[1]);
								const val = Math.floor(interpolate(countFrame, [0, 40], [0, max], { extrapolateRight: 'clamp' }));
								return (
									<div key={label} className="bg-[#221019]/40 p-3 rounded border border-white/5">
										<p className="text-[9px] text-slate-400 uppercase font-bold">{label}</p>
										<div className="flex items-baseline gap-1">
											<span className="text-2xl font-black">{val}{suffix}</span>
											<span className="text-[10px] text-emerald-400 font-bold">{badge}</span>
										</div>
									</div>
								);
							})}
						</div>

						<button className="w-full mt-6 bg-[#f20d80] hover:bg-[#f20d80]/90 text-white py-3 rounded-lg text-xs font-black tracking-[0.1em] transition-all shadow-lg shadow-[#f20d80]/40">
							VIEW PROFILE
						</button>
					</GlassCard>
				</div>

				{/* キルフィード */}
				<div
					className="mt-8 flex flex-col gap-3"
					style={{ opacity: killOpacity, transform: `translateY(${killY}px)` }}
				>
					<div className="bg-[#221019]/60 backdrop-blur-md px-5 py-3 rounded-lg border-l-4 border-l-emerald-500 w-fit flex items-center gap-4 opacity-90 border border-[#f20d80]/10">
						<div className="text-emerald-500 text-xl font-bold">💀</div>
						<span className="text-xs font-bold tracking-tight">
							<span className="text-[#f20d80]">CyberGhost</span> eliminated{' '}
							<span className="text-slate-400">Wraith_99</span>
						</span>
					</div>
				</div>
			</AbsoluteFill>

			{/* === サイドバーアイコン (スタッガー) === */}
			<div className="absolute right-8 bottom-48 flex flex-col gap-8 z-10">
				{(['❤️', '💬', '🚀', '🔖'] as const).map((icon, i) => {
					const delay = T.sidebarIn[0] + i * 10;
					const iconOpacity = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: 'clamp' });
					const iconScale = spring({ frame: frame - delay, fps, config: { stiffness: 200, damping: 18 } });
					const counts = ['12.4k', '850', '2.1k', '3.2k'];
					return (
						<div
							key={i}
							className="flex flex-col items-center gap-2"
							style={{ opacity: iconOpacity, transform: `scale(${Math.min(iconScale, 1)})` }}
						>
							<div className="w-14 h-14 rounded-full bg-[#221019]/60 backdrop-blur-md flex items-center justify-center border border-[#f20d80]/30 shadow-xl">
								<span className="text-xl">{icon}</span>
							</div>
							<span className="text-[10px] font-black text-white/80">{counts[i]}</span>
						</div>
					);
				})}
			</div>

			{/* === 下部コントロール === */}
			<div
				className="absolute bottom-12 left-12 right-12 px-2"
				style={{ opacity: ctrlOpacity, transform: `translateY(${ctrlY}px)` }}
			>
				<div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-4 border border-white/5">
					<div
						className="bg-[#f20d80] h-full shadow-[0_0_15px_#f20d80] transition-all"
						style={{ width: `${progressWidth}%` }}
					/>
				</div>
				<div className="flex justify-between items-center opacity-70 mb-6">
					<span className="text-[11px] font-black tracking-widest">00:37</span>
					<span className="text-[11px] font-black tracking-widest text-[#f20d80]">02:23</span>
				</div>
				<div className="flex gap-5">
					<div className="w-14 h-14 rounded-xl bg-[#221019]/60 backdrop-blur-md border border-[#f20d80]/40 flex items-center justify-center shadow-lg">
						<div className="text-[#f20d80] text-3xl">▶️</div>
					</div>
					<div className="flex-1 bg-[#221019]/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center shadow-lg">
						<span className="text-[11px] font-black tracking-[0.3em] text-[#f20d80] uppercase">
							Rewatch Best Moment
						</span>
					</div>
				</div>
			</div>

			{/* Reflective Overlay */}
			<AbsoluteFill className="pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent" />
		</AbsoluteFill>
	);
};
