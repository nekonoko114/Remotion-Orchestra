import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  Video,
  Audio,
} from 'remotion';
import { z } from 'zod';

// ピンク色のネオン輝きテキストコンポーネント (金色から変更)
const PinkNeonText: React.FC<{ text: string; frame: number; fontSize: number; }> = ({ text, fontSize }) => {
  return (
    <h2 style={{
      color: '#fff',
      margin: 0,
      fontSize,
      fontFamily: '"Mochiy Pop One", sans-serif',
      // ピンク〜マゼンタ系の強力なネオン発光シャドウ
      textShadow: `
        0 0 10px #ffb3d9,
        0 0 20px #ff66b2,
        0 0 40px #ff1493,
        0 0 80px #ff007f,
        0 0 120px #ff007f
      `,
      textAlign: 'center'
    }}>
      {text}
    </h2>
  );
};

// 青色のネオン輝きテキストコンポーネント (takaさん等のブルー系シーン用)
const BlueNeonText: React.FC<{ text: string; frame: number; fontSize: number; }> = ({ text, fontSize }) => {
  return (
    <h2 style={{
      color: '#fff',
      margin: 0,
      fontSize,
      fontFamily: '"Mochiy Pop One", sans-serif',
      // シアン〜ブルー系の強力なネオン発光シャドウ
      textShadow: `
        0 0 10px #b3e6ff,
        0 0 20px #66ccff,
        0 0 40px #0099ff,
        0 0 80px #0055ff,
        0 0 120px #0055ff
      `,
      textAlign: 'center'
    }}>
      {text}
    </h2>
  );
};

// マゼンタ色のネオン輝きテキストコンポーネント (夢一輪さん用)
const MagentaNeonText: React.FC<{ text: string; frame: number; fontSize: number; }> = ({ text, fontSize }) => {
  return (
    <h2 style={{
      color: '#fff',
      margin: 0,
      fontSize,
      fontFamily: '"Mochiy Pop One", sans-serif',
      // マゼンタ〜パープル系の強力なネオン発光シャドウ
      textShadow: `
        0 0 10px #ffb3ff,
        0 0 20px #ff66ff,
        0 0 40px #ff00ff,
        0 0 80px #cc00cc,
        0 0 120px #cc00cc
      `,
      textAlign: 'center'
    }}>
      {text}
    </h2>
  );
};

export const PopularityBattle3vs1Schema = z.object({
  themeColor: z.string(),
  livers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
      borderColor: z.string().optional(),
    })
  ),
  dateInfo: z.object({
    year: z.string(),
    date: z.string(),
    time: z.string(),
  }),
  rules: z.array(z.string()).optional(),
  finalMessage: z.string().optional(),
  music: z.string().optional(),
  customBackground: z.string().optional(),
  sakuraImages: z.array(z.string()).optional(),
});

type Props = z.infer<typeof PopularityBattle3vs1Schema>;

// ---------- シーンごとのコンポーネント定義 ---------- //

// 📌 オープニング (10s = 300fr)
const Scene_Opening: React.FC<{ dateInfo: Props['dateInfo'] }> = ({ dateInfo }) => {
  const frame = useCurrentFrame();

  // オープニング全体 (300fr) のフェードアウト
  const globalOpacity = interpolate(frame, [270, 300], [1, 0], { extrapolateRight: 'clamp' });

  // 優しいフェードイン＆ズーム
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleBlur = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [0, 300], [0.9, 1.1], { extrapolateRight: 'clamp' });

  const dateOpacity = interpolate(frame - 30, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dateScale = interpolate(frame - 30, [0, 270], [0.9, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const timeOpacity = interpolate(frame - 60, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'start', alignItems: 'center', opacity: globalOpacity }}>
      {/* ユーザーご提案のラインモーションハート背景動画：黒を抜いてメイン背景（星空等）にスクリーン合成 */}
      <Video 
        src={staticFile('assets/pixabay/videos/pixabay_hearts_line_motion_heart_motion_love_motion_love_h_151653.mp4')} 
        style={{ 
          position: 'absolute', 
          width: '100%', height: '100%', 
          objectFit: 'cover', 
          objectPosition: '20% center', // 左側のハートが描画される部分を画面の中央に持ってくる
          transform: 'scale(1.5)',      // 見やすく迫力を出すためにスケールアップ
          mixBlendMode: 'screen', 
          // CSSフィルターマジック：元の白や黄色の光を「強力なネオンピンク」に強制変換する
          filter: 'sepia(100%) hue-rotate(290deg) saturate(300%) brightness(1.5)', 
          opacity: 0.3 
        }} 
      />
      {/* 文字を際立たせるための少し紫・ピンクがかったロマンチックな暗幕 */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(30, 0, 20, 0.4)' }} />
      
      {/* 豪華で優しいオープニングテキスト */}
      <div style={{ position: 'absolute', top: '30%', transform: `scale(${titleScale})`, opacity: titleOpacity, filter: `blur(${titleBlur}px)`, width: '100%', height: '40%', textAlign: 'center' }}>
        <PinkNeonText text="人気アップバトル" frame={frame} fontSize={130} />
      </div>

      <div style={{ position: 'absolute', top: '45%', transform: `scale(${dateScale})`, opacity: dateOpacity, width: '100%', textAlign: 'center' }}>
        <PinkNeonText text={dateInfo.year} frame={frame - 30} fontSize={160} />
      </div>

      <div style={{ position: 'absolute', top: '70%', width: '100%', textAlign: 'center', opacity: timeOpacity }}>
        <h2 style={{ color: '#fff', fontSize: 150, margin: 0, textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,200,200,0.5)', fontFamily: '"Mochiy Pop One", sans-serif' }}>
          {dateInfo.time || dateInfo.date}
        </h2>
        <h3 style={{ color: '#ffb3c6', fontSize: 130, margin: 0, marginTop: 20, textShadow: '0 0 20px #ffb3c6', fontFamily: '"Mochiy Pop One", sans-serif' }}>START</h3>
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 1: 3名のライバー (150fr)
const Scene_ThreeLivers: React.FC<{ livers: Props['livers'] }> = ({ livers }) => {
  const frame = useCurrentFrame();
  const showLivers = livers.slice(0, 3); // 最初の3人

  // シーンのフェードイン・フェードアウト
  const sceneOpacity = interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', opacity: sceneOpacity }}>
      {/* 優しい雰囲気を作るためのピンク/オレンジ系のふんわりとしたオーバーレイ */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(255, 150, 200, 0.1)' }} />
      
      {/* 上部: 登場タイトル - より上に配置（15% -> 8%） */}
      <div style={{ position: 'absolute', top: '8%', width: '100%', textAlign: 'center' }}>
        <PinkNeonText text="3LIVERS" frame={frame} fontSize={140} />
      </div>

      {/* 3名の画像と直下の名前 - 中央より少し下に配置（40% -> 45%） */}
      <div style={{ position: 'absolute', top: '45%', width: '100%', display: 'flex', justifyContent: 'space-evenly', padding: '0 20px' }}>
        {showLivers.map((liver, i) => {
          const delay = i * 20;
          
          // ボケながらゆっくりフェードイン
          const itemOpacity = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          const itemBlur = interpolate(frame - delay, [0, 30], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          const itemScale = interpolate(frame - delay, [0, 150], [0.9, 1.05], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          
          const floatY = Math.sin((frame + i * 30) * 0.05) * 10; // 穏やかな浮遊感

          return (
            <div key={liver.id} style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              opacity: itemOpacity,
              filter: `blur(${itemBlur}px)`,
              transform: `scale(${itemScale}) translateY(${floatY}px)` 
            }}>
              {/* ふんわり光る優しい枠 - サイズを微調整（360->320）して端が切れないように */}
              <Img src={staticFile(liver.image)} style={{ 
                width: 320, height: 320, 
                borderRadius: '50%', objectFit: 'cover', 
                border: `10px solid ${liver.borderColor || '#ffb3c6'}`, 
                boxShadow: `0 0 60px ${liver.borderColor || '#ffb3c6'}88, 0 10px 20px rgba(0,0,0,0.5)`
              }} />
              
              {/* 画像直下の名前 - 端がはみ出さないように幅を画像と同じ320pxに制限 */}
              <h2 style={{ 
                color: '#fff', fontSize: 45, width: 320, textAlign: 'center', 
                marginTop: 40, textShadow: '0 5px 20px rgba(0,0,0,0.8), 0 0 25px #ffb3c6',
                fontFamily: '"Mochiy Pop One", sans-serif',
              }}>
                {liver.name}
              </h2>
            </div>
          );
        })}
      </div>

      {/* 下部: 装飾テキスト (空いた下部スペースを埋める) */}
      <div style={{ position: 'absolute', bottom: '10%', width: '100%', textAlign: 'center', opacity: interpolate(frame, [60, 90], [0, 0.8]) }}>
        <PinkNeonText text="POPULARITY BATTLE" frame={frame - 60} fontSize={60} />
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 2: 1名のライバー (90fr) - つれトラさんなど
const Scene_SingleLiver: React.FC<{ liver: Props['livers'][0]; showVsText?: boolean }> = ({ liver, showVsText }) => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemBlur = interpolate(frame, [0, 40], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemScale = interpolate(frame, [0, 90], [0.9, 1.05], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame * 0.03) * 15;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0, 5, 20, 0.2)' }} />
      <div style={{ 
        transform: `scale(${itemScale}) translateY(${floatY}px)`, 
        filter: `blur(${itemBlur}px)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 
      }}>
        {/* takaさん等、相手の枠をネオンブルーで表示 */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -20, left: -20, right: -20, bottom: -20,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 200, 255, 0.4) 0%, transparent 70%)',
            animation: 'spin 10s linear infinite',
          }} />
          <Img src={staticFile(liver.image)} style={{ 
            width: 600, height: 600, borderRadius: '50%', objectFit: 'cover', 
            border: '12px solid rgba(150, 230, 255, 0.8)', 
            boxShadow: '0 0 100px rgba(0, 200, 255, 0.6)' 
          }} />
        </div>
        <h1 style={{ color: '#fff', fontSize: 100, margin: 0, textShadow: '0 0 30px rgba(0,200,255,0.8), 0 5px 15px rgba(0,0,0,0.5)', fontFamily: '"Mochiy Pop One", sans-serif' }}>
          {liver.name}
        </h1>
      </div>

      {showVsText && (
        <div style={{
          position: 'absolute',
          top: '6%', // より上部へ移動（10% -> 6%）
          width: '100%',
          textAlign: 'center',
          transform: `scale(${spring({ frame: Math.max(0, frame - 15), fps: 30, config: { damping: 12 } })})`,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
        }}>
          <PinkNeonText text="V S" frame={frame} fontSize={180} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// 📌 Scene 3: 4人全員 2x2分割 (200fr)
// バキッとした線ではなく、丸形にくり抜いて柔らかな光でつなぐ
const Scene_BattleSplit: React.FC<{ livers: Props['livers'] }> = ({ livers }) => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 30, 170, 200], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 200], [0.95, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', opacity: sceneOpacity, transform: `scale(${scale})` }}>
      {/* 3対1の構図: 上段にチーム3名、下段に対戦相手1名 */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: 30, padding: 30 }}>
        
        {/* 上段: ピンク色チーム3名 (3カラム並列) */}
        <div style={{ flex: 1.2, display: 'flex', gap: 30 }}>
          {livers.slice(0, 3).map((liver, i) => {
            const delay = i * 10;
            const itemOpacity = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
            
            return (
              <div key={`split-top-${liver.id}`} style={{ 
                position: 'relative', flex: 1, height: '100%', 
                borderRadius: 40, overflow: 'hidden',
                boxShadow: `0 0 50px rgba(255, 180, 200, 0.5)`,
                border: `4px solid rgba(255,200,220,0.8)`,
                opacity: itemOpacity,
              }}>
                <Img src={staticFile(liver.image)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', textAlign: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '40px 0 20px 0' }}>
                  <span style={{ color: '#fff', fontSize: 40, textShadow: '0 0 10px rgba(0,0,0,0.8)', fontFamily: '"Mochiy Pop One", sans-serif' }}>{liver.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 下段: 紫色枠 対戦相手1名 (フル幅) */}
        <div style={{ flex: 1 }}>
          {livers[3] && (
            <div style={{ 
              position: 'relative', width: '100%', height: '100%', 
              borderRadius: 40, overflow: 'hidden',
              boxShadow: `0 0 60px rgba(200, 100, 255, 0.6)`,
              border: `6px solid rgba(200,100,255,0.9)`,
              opacity: interpolate(frame - 40, [0, 30], [0, 1], { extrapolateRight: 'clamp' })
            }}>
              <Img src={staticFile(livers[3].image)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', textAlign: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '60px 0 30px 0' }}>
                <span style={{ color: '#fff', fontSize: 75, textShadow: '0 0 20px rgba(0,0,0,0.8)', fontFamily: '"Mochiy Pop One", sans-serif' }}>{livers[3].name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 中央にVS */}
      <div style={{ position: 'absolute', top: '55%', left: '50%', transform: `translate(-50%, -50%)`, width: '100%', textAlign: 'center', zIndex: 100 }}>
        <PinkNeonText text="V S" frame={frame - 60} fontSize={220} />
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 4: ルール (120fr)
// 直線的ではなく、柔らかなガラスモーフパネルでふんわり表示
const Scene_Rules: React.FC<{ rules: string[] }> = ({ rules }) => {
  const frame = useCurrentFrame();
  
  const sceneOpacity = interpolate(frame, [0, 30, 90, 120], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 120], [0.95, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '50px', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      <div style={{ transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ marginBottom: 60 }}>
          <PinkNeonText text="R U L E" frame={frame} fontSize={120} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 50, width: '80%' }}>
          {rules.map((rule, i) => {
            const delay = 20 + i * 20;
            const y = interpolate(frame - delay, [0, 30], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const o = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const blur = interpolate(frame - delay, [0, 30], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

            return (
              <div key={`rule-${i}`} style={{ 
                opacity: o, transform: `translateY(${y}px)`, filter: `blur(${blur}px)`,
                background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)',
                borderRadius: 20, padding: '30px 40px', border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.1)'
              }}>
                <div style={{ color: '#fff', fontSize: 50, fontWeight: 'bold', fontFamily: '"Mochiy Pop One", sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {rule}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 5: エンディングメッセージ (150fr) + 3名の画像追加
const Scene_Ending: React.FC<{ message: string; images?: string[] }> = ({ message, images }) => {
  const frame = useCurrentFrame();
  const lines = message.split('\n');

  const sceneOpacity = interpolate(frame, [0, 30, 120, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 150], [0.95, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0, 10, 30, 0.4)' }} />
      
      {/* 舞い散るさくらの花びらパーティクル (画像などの手前に散るように zIndex を設定) */}
      <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 50 }}>
        {new Array(30).fill(0).map((_, i) => {
          const delay = (i * 123) % 150;
          const startX = (i * 456) % 1080;
          const speed = 2 + (i % 4);
          const f = (frame + delay) % 400;
          const py = -100 + f * speed;
          const px = startX + Math.sin(f / 20) * 50;
          const rot = f * 2;
          const svgId = (i % 8) + 1;
          
          return (
            <Img
              key={`petal-${i}`}
              src={staticFile(`assets/images/sakura-fill-0${svgId}.svg`)}
              style={{
                position: 'absolute',
                top: py,
                left: px,
                width: 30 + (i % 20),
                opacity: interpolate(py, [0, 100, 1500, 1800], [0, 0.6, 0.6, 0]),
                transform: `rotate(${rot}deg)`,
                filter: 'drop-shadow(0 0 5px rgba(255,182,193,0.5))'
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* 三枚の画像を扇状（ポラロイド風）に配置 - サイズを大きく（350->500, 650）調整 */}
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {images && images.length >= 3 && (
          <div style={{ 
            position: 'absolute', top: '5%', width: '100%', height: 1000, 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1, 
          }}>
            {images.slice(0, 3).map((img, i) => {
              const startFrame = i * 15;
              const spr = spring({ frame: frame - startFrame, fps: 30, config: { damping: 12, stiffness: 100 } });
              
              // 傾き: 左右に15度ずつ
              const rotation = (i - 1) * 15; 
              // 横移動: -320, 0, 320 (より広く)
              const tx = (i - 1) * 320;
              // 縦移動
              const ty = i === 1 ? 400 : -150;
              const zi = i === 1 ? 20 : 10;

              return (
                <div key={`end-sakura-${i}`} style={{
                  position: 'absolute',
                  transform: `translateX(${tx * spr}px) translateY(${ty * spr}px) rotate(${rotation * spr}deg) scale(${spr * (i === 1 ? 1.1 : 1)})`,
                  zIndex: zi,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
                  border: '20px solid #fff',
                  borderBottom: '70px solid #fff',
                  borderRadius: '15px',
                  backgroundColor: '#fff',
                }}>
                  <Img 
                    src={staticFile(img)} 
                    style={{
                      width: 480, // サイズアップ
                      height: 600, // 縦長に
                      objectFit: 'cover',
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 下から浮き上がるメッセージ - 最下部付近に配置（bottom: 10%）して画面全体を活用 */}
        <div style={{ 
          position: 'absolute',
          bottom: '8%',
          transform: `scale(${scale})`, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
          zIndex: 30 
        }}>
          {lines.map((lineText, i) => (
            <PinkNeonText key={i} text={lineText} frame={frame - i * 15} fontSize={100} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 6: ロゴ (60fr)
const Scene_Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <Img 
        src={staticFile('jol-logo-800.png')} 
        style={{ width: 800, opacity, transform: `scale(${scale})` }} 
      />
    </AbsoluteFill>
  );
};


// 📌 新規 Scene: takaさんメイン 爽やかで優雅なシーン (150fr)
const Scene_TakaMain: React.FC<{ liver: Props['livers'][0] }> = ({ liver }) => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 30, 120, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemBlur = interpolate(frame, [0, 40], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemScale = interpolate(frame, [0, 150], [0.9, 1.05], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame * 0.05) * 15;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      {/* 爽やかな水色～ゴールドの光シャワー */}
      <AbsoluteFill style={{ 
        background: 'radial-gradient(circle at center, rgba(100, 200, 255, 0.2) 0%, transparent 70%)' 
      }} />

      <div style={{ 
        transform: `scale(${itemScale}) translateY(${floatY}px)`, 
        filter: `blur(${itemBlur}px)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60, zIndex: 10 
      }}>
        {/* takaさん用の光背 */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -30, left: -30, right: -30, bottom: -30,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, rgba(255, 230, 150, 0.6) 0deg, transparent 90deg, rgba(100, 220, 255, 0.6) 180deg, transparent 270deg, rgba(255, 230, 150, 0.6) 360deg)',
            filter: 'blur(20px)',
            animation: 'spin 15s linear infinite',
            mixBlendMode: 'screen',
          }} />
          <Img src={staticFile(liver.image)} style={{ 
            width: 700, height: 700, borderRadius: '50%', objectFit: 'cover', 
            border: '10px solid rgba(255, 255, 255, 0.8)', 
            boxShadow: '0 0 100px rgba(100, 220, 255, 0.6)' 
          }} />
        </div>
        
        {/* 名前 (ネオンブルー) */}
        <div style={{ transform: `translateY(${interpolate(frame, [0, 40], [50, 0], { extrapolateRight: 'clamp'})}px)` }}>
          <BlueNeonText text={liver.name} frame={frame} fontSize={130} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 📌 新規 Scene: 🌹夢一輪🌹さんメイン (150fr)
const Scene_YumeIchirinMain: React.FC<{ liver: Props['livers'][0] }> = ({ liver }) => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 30, 120, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemBlur = interpolate(frame, [0, 40], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemScale = interpolate(frame, [0, 150], [0.9, 1.05], { extrapolateRight: 'clamp' });
  const floatY = Math.sin(frame * 0.05) * 15;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      {/* 幻想的なパープル～マゼンタの光シャワー */}
      <AbsoluteFill style={{ 
        background: 'radial-gradient(circle at center, rgba(180, 0, 255, 0.15) 0%, transparent 70%)' 
      }} />

      <div style={{ 
        transform: `scale(${itemScale}) translateY(${floatY}px)`, 
        filter: `blur(${itemBlur}px)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60, zIndex: 10 
      }}>
        {/* 🌹夢一輪🌹さん用の光背 */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -30, left: -30, right: -30, bottom: -30,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, rgba(255, 100, 200, 0.6) 0deg, transparent 10%, rgba(200, 50, 255, 0.7) 40%, transparent 50%, rgba(255, 100, 200, 0.6) 80%, transparent 90%, rgba(255, 100, 200, 0.6) 100%)',
            filter: 'blur(20px)',
            animation: 'spin 18s linear infinite reverse',
            mixBlendMode: 'screen',
          }} />
          <Img src={staticFile(liver.image)} style={{ 
            width: 700, height: 700, borderRadius: '50%', objectFit: 'cover', 
            border: `10px solid ${liver.borderColor || '#ff00ff'}`, 
            boxShadow: `0 0 100px ${liver.borderColor || 'rgba(255, 0, 255, 0.6)'}` 
          }} />
        </div>
        
        {/* 名前 (マゼンタネオン) */}
        <div style={{ transform: `translateY(${interpolate(frame, [0, 40], [50, 0], { extrapolateRight: 'clamp'})}px)` }}>
          <MagentaNeonText text={liver.name} frame={frame} fontSize={130} />
        </div>
      </div>
    </AbsoluteFill>
  );
};


// ---------- 装飾削除によるロールバック済み ---------- //

// 📌 新規 Scene: さくらさんメイン 幻想的シーン (450fr)
// 超絶リッチ＆幻想的エフェクト：後光、回転魔法陣、ボケフェードイン、呼吸のような浮遊感
const Scene_SakuraMain: React.FC<{ images: string[] }> = ({ images }) => {
  const frame = useCurrentFrame();

  const durationPerImage = 150; // 450 ÷ 3

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
      {/* 舞い散るハートの幻想的な動画レイヤー（スクリーン合成でゆっくりキラキラ光らせる） */}
      {/* 動画のフチ（角）が見えないように、マスクで境界を完全に溶かす */}
      <AbsoluteFill style={{ 
        mixBlendMode: 'screen', 
        opacity: 0.7,
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 40%, transparent 90%)',
        maskImage: 'radial-gradient(ellipse at center, black 0%, black 40%, transparent 90%)',
        zIndex: 100,
      }}>
        <Video 
          src={staticFile('assets/pixabay/videos/pixabay_hearts_valentines_beautiful_wallpaper_love_romanti_32261.mp4')} 
          playbackRate={0.8}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)' }} 
        />
      </AbsoluteFill>

      {/* うっすらピンク・オレンジ系の光全体シャワー */}
      <AbsoluteFill style={{ 
        background: 'radial-gradient(circle at center, rgba(255, 100, 150, 0.3) 0%, transparent 70%)' 
      }} />

      {images.map((img, i) => {
        const startFrame = i * durationPerImage;
        const relativeFrame = frame - startFrame;

        // クロスフェード全体 (前シーンと重なって現れる)
        const sceneOpacity = interpolate(relativeFrame, [0, 40, durationPerImage - 40, durationPerImage], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

        // カメラのピントが合うような幻想的なボケエフェクト
        const blur = interpolate(relativeFrame, [0, 30], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

        // ゆっくりズームインしつつ、呼吸するようなWiggle（揺らぎ）
        const scale = interpolate(relativeFrame, [0, durationPerImage], [0.85, 1.05], { extrapolateRight: 'clamp' });
        const floatY = Math.sin(relativeFrame * 0.05) * 20;

        // 後光（オーラ）の回転角度
        const rotation1 = relativeFrame * 1.5; // 時計回り
        const rotation2 = -relativeFrame * 1.0; // 反時計回り

        return (
          <AbsoluteFill key={`sakura-${i}`} style={{ justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
            
            {/* 後ろで回転する後光・フレアレイヤー 1 */}
            <div style={{
              position: 'absolute',
              width: 1400,
              height: 1400,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(255, 150, 200, 0.6) 0%, transparent 10%, rgba(255, 200, 250, 0.5) 20%, transparent 30%, rgba(255, 100, 150, 0.7) 40%, transparent 50%, rgba(255, 200, 250, 0.5) 60%, transparent 70%, rgba(255, 150, 200, 0.6) 80%, transparent 90%, rgba(255, 150, 200, 0.6) 100%)',
              filter: 'blur(30px)',
              transform: `rotate(${rotation1}deg)`,
              mixBlendMode: 'screen',
            }} />

            {/* 後ろで回転する後光・フレアレイヤー 2 (逆回転) */}
            <div style={{
              position: 'absolute',
              width: 1100,
              height: 1100,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(255, 255, 255, 0.8) 0deg, transparent 45deg, rgba(255, 150, 200, 0.8) 180deg, transparent 225deg, rgba(255, 255, 255, 0.8) 360deg)',
              filter: 'blur(15px)',
              transform: `rotate(${rotation2}deg)`,
              mixBlendMode: 'overlay',
            }} />

            {/* 画像本体 - サイズをさらに拡大（900->1000） */}
            <Img 
              src={staticFile(img)} 
              style={{
                width: 1000,
                height: 1000,
                borderRadius: '50%',
                objectFit: 'cover',
                transform: `scale(${scale}) translateY(${floatY}px)`,
                filter: `blur(${blur}px) drop-shadow(0 0 70px rgba(255, 180, 200, 0.9))`,
                boxShadow: '0 0 120px rgba(255, 100, 150, 0.7), inset 0 0 60px rgba(255,255,255,0.4)',
                border: '20px solid rgba(255, 200, 230, 0.9)',
                zIndex: 10,
              }}
            />

            {/* （名前の演出はここから削除して外側へ） */}
          </AbsoluteFill>
        );
      })}

      {/* 下から浮き上がってくる名前の演出 - 最下部付近（bottom: 8%）へ移動 */}
      <div style={{ 
        position: 'absolute', 
        bottom: '8%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        // シーン(450fr)開始時に40frかけて浮き上がり、そのまま固定
        transform: `translateY(${interpolate(frame, [0, 40], [50, 0], { extrapolateRight: 'clamp'})}px)`,
        zIndex: 20
      }}>
        <PinkNeonText text="🌸さくら🌸" frame={frame} fontSize={140} />
      </div>

    </AbsoluteFill>
  );
};


// ---------- メインコンポジション ---------- //
export const JolPopularityBattle3vs1: React.FC<Props> = (props) => {
  const frame = useCurrentFrame();

  // 0〜989フレーム（対戦相手紹介が終わるまで）にかけて、徐々に明るく華やかな色味に変えていくカラーグレーディング
  const gradingOpacity = interpolate(
    frame, 
    [0, 950, 985, 990], 
    [0, 0.35, 0.35, 0], 
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // 990フレーム（シーン切り替えの瞬間）の「真っ白なフラッシュ」
  const flashOpacity = interpolate(
    frame,
    [975, 990, 1005],
    [0, 1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  
  const flashScale = interpolate(
    frame,
    [975, 990, 1005],
    [0.5, 3, 4],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // オープニング: 150fr (0〜150)
  // Sakura: 150fr (150〜300)
  // Taka: 150fr (300〜450)
  // YumeIchirin: 150fr (450〜600)
  // ThreeLivers: 150fr (600〜750)
  // SingleLiver(Opponent): 90fr (750〜840)
  // (gap 150fr)
  // BattleSplit: 200fr (990〜1190)
  // Scene4(Rules): 120fr (1190〜1310)
  // Scene5(Ending): 150fr (1310〜1460)
  // Scene6(Logo): 60fr (1460〜1520)
  // トータル: 1520fr
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {props.customBackground && (
        <AbsoluteFill>
          <Video 
            src={staticFile(props.customBackground)} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </AbsoluteFill>
      )}

      {props.music && (
        <Audio src={staticFile(props.music)} startFrom={92*30} />
      )}

      <Sequence from={0} durationInFrames={150}>
        <Scene_Opening dateInfo={props.dateInfo} />
      </Sequence>

      {/* 150-299: さくらさん (150フレームに短縮) */}
      <Sequence from={150} durationInFrames={150}>
        {props.sakuraImages && <Scene_SakuraMain images={[props.sakuraImages[0]]} />}
      </Sequence>

      {/* 300-449: takaさん (前倒し) */}
      <Sequence from={300} durationInFrames={150}>
        {props.livers[0] && <Scene_TakaMain liver={props.livers[0]} />}
      </Sequence>

      {/* 450-599: 🌹夢一輪🌹さん (新設) */}
      <Sequence from={450} durationInFrames={150}>
        {props.livers[2] && <Scene_YumeIchirinMain liver={props.livers[2]} />}
      </Sequence>

      {/* 600-749: 3人並ぶシーン (前倒し) */}
      <Sequence from={600} durationInFrames={150}>
        <Scene_ThreeLivers livers={props.livers} />
      </Sequence>

      {/* 750-839: 対戦相手(つれトラ) 単独シーン (前倒し) */}
      <Sequence from={750} durationInFrames={90}>
        {props.livers[3] && <Scene_SingleLiver liver={props.livers[3]} showVsText={true} />}
      </Sequence>

      {/* 4分割 VSシーン: 990フレームから開始 (前倒し) */}
      <Sequence from={840} durationInFrames={200}>
        <Scene_BattleSplit livers={props.livers} />
      </Sequence>

      <Sequence from={1040} durationInFrames={120}>
        {props.rules && <Scene_Rules rules={props.rules} />}
      </Sequence>

      <Sequence from={1160} durationInFrames={150}>
        {props.finalMessage && <Scene_Ending message={props.finalMessage} images={props.sakuraImages} />}
      </Sequence>

      <Sequence from={1310} durationInFrames={60}>
        <Scene_Logo />
      </Sequence>

      {/* 全編を覆うカラーグレーディング・リッチ発光レイヤー（0〜989で徐々に現れる） */}
      <AbsoluteFill style={{
        background: 'linear-gradient(45deg, rgba(255, 180, 200, 1) 0%, rgba(255, 255, 255, 1) 100%)',
        mixBlendMode: 'screen', 
        opacity: gradingOpacity,
        pointerEvents: 'none',
      }} />

      {/* カラーグレーディングが切れてVSシーンが始まる瞬間の「ホワイトアウト・フラッシュ」 */}
      {flashOpacity > 0 && (
        <AbsoluteFill style={{
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          opacity: flashOpacity,
        }}>
          {/* レンズフレアのような巨大な光 */}
          <div style={{
            width: 1000,
            height: 1000,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 20%, transparent 60%)',
            filter: 'blur(30px)',
            transform: `scale(${flashScale})`,
          }} />
          <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${interpolate(flashOpacity, [0, 1], [0, 0.8])})` }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
