import React from 'react';
import { useVideoConfig, spring, interpolate, Img, OffthreadVideo, staticFile, Sequence } from 'remotion';

export interface GridConvergenceEffectProps {
  imageSrc: string;
  gridImageSrc?: string;
  frame: number;
  themeColor: string;
  seedName?: string;
}

export const GridConvergenceEffect: React.FC<GridConvergenceEffectProps> = ({
  imageSrc,
  gridImageSrc,
  frame,
  themeColor,
  seedName = 'grid-convergence',
}) => {
  const { fps } = useVideoConfig();

  // フェーズ定義
  // Phase 1: 0〜60fr 画面上に16個の画像が待機
  // Phase 2: 60fr〜 順番に（1拍=15fr間隔で）中央へ吸い込まれる
  // Phase 3: 全てが集まりきったタイミングで爆発


  const cols = 4;
  const rows = 4;
  const totalCount = cols * rows;

  // SceneLiver は動画全体の 300fr から開始されます
  // そのため、フレームの相対値は以下のようになります
  // ユーザーの指定（全体時間基準）:
  // 365fr (相対 65fr): ここまでに全てが集まる
  // 366fr (相対 66fr): 爆発エフェクトが入る
  // 370fr (相対 70fr): 一つになった画像が大きくなる
  
  const gatherEndFrame = 65;
  const explodeFrame = 66; 
  const scaleUpFrame = 70;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {frame < explodeFrame ? (
        // --- フェーズ1 & フェーズ2 画面上に16個の画像があり中央に吸い込まれる ---
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {new Array(totalCount).fill(0).map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);

            // 画面全体への配置 (0~3 を 10% ~ 90% にマッピング)
            const startX = 10 + (80 / (cols - 1)) * col; // %
            const startY = 10 + (80 / (rows - 1)) * row; // %
            
            // 吸い込みの開始タイミング（全てが gatherEndFrame=65fr までに中央に到達するように計算）
            const moveDuration = 20; // 各画像が中央に向かう時間
            const stagger = 2; // 順番にずらすフレーム数
            
            // i番目の要素の開始時間を逆算
            const moveStartDelay = gatherEndFrame - moveDuration - ((totalCount - 1 - i) * stagger); 
            const moveEndFrame = moveStartDelay + moveDuration;
            
            // どれだけ中央に近づいたか (0.0 〜 1.0)
            const progress = interpolate(
              frame,
              [moveStartDelay, moveEndFrame],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // 現在地 = 初期位置 +進捗 * (中央への距離)
            // 中央は x: 50%, y: 50%
            const currentX = interpolate(progress, [0, 1], [startX, 50]);
            const currentY = interpolate(progress, [0, 1], [startY, 50]);

            // サイズ: 最初は200px程度、吸い込まれるにつれて少し小さくなる
            const size = interpolate(progress, [0, 1], [250, 100]);
            
            // ゆらゆら浮くアニメーション
            const floatY = progress === 0 ? Math.sin((frame + i * 10) * 0.05) * 20 : 0;
            const floatX = progress === 0 ? Math.cos((frame + i * 10) * 0.03) * 10 : 0;

            const rotate = progress === 0 
              ? Math.sin((frame + i * 5) * 0.02) * 10
              : interpolate(progress, [0, 1], [0, 360]); // 吸い込まれながら回転

            const opacity = interpolate(progress, [0, 0.9, 1], [1, 1, 0]); // 吸い込まれきる直前に消える

            return (
              <div 
                key={i} 
                style={{ 
                  position: 'absolute', 
                  left: `${currentX}%`, 
                  top: `${currentY}%`, 
                  width: size, 
                  height: size, 
                  transform: `translate(calc(-50% + ${floatX}px), calc(-50% + ${floatY}px)) rotate(${rotate}deg)`,
                  borderRadius: '50%', // 完全な正円にする
                  overflow: 'hidden', 
                  border: `4px solid ${themeColor}`, 
                  boxShadow: `0 0 20px ${themeColor}`, 
                  opacity,
                }}
              >
                <Img src={gridImageSrc || imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            );
          })}
        </div>
      ) : (
        // --- フェーズ3 全てが合体して爆発し、1つの大きな画像になる ---
        <div 
          style={{ 
            width: 800, 
            height: 800, 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '15px solid #fff', 
            // 爆発の衝撃波グロー（66frから一気に光り、70frから引いていく）
            boxShadow: `
              0 0 ${interpolate(frame, [explodeFrame, scaleUpFrame, scaleUpFrame + 10], [100, 500, 100])}px ${themeColor}, 
              0 0 ${interpolate(frame, [explodeFrame, scaleUpFrame, scaleUpFrame + 20], [50, 300, 50])}px #fff
            `, 
            // 爆発のバウンド拡大 (70fr から一気に大きくなる)
            transform: `scale(${frame < scaleUpFrame ? 0 : spring({ 
              frame: frame - scaleUpFrame, 
              fps, 
              config: { stiffness: 180, damping: 10, mass: 1 },
              from: 0,
              to: 1 
            })})`,
            // 出現時にフラッシュ
            filter: `brightness(${interpolate(frame, [scaleUpFrame, scaleUpFrame + 10], [3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`
          }}
        >
          <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* 爆発エフェクトを重ねる */}
      <Sequence from={explodeFrame - 5}>
        <OffthreadVideo
          src={staticFile('assets/pixabay/videos/pixabay_explosion_flash_fireworks_colorful_211718.mp4')}
          style={{ mixBlendMode: 'screen', opacity: 1, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Sequence>
    </div>
  );
};
