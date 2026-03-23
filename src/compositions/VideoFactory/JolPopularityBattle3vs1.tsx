import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
  Video,
  Audio,
} from 'remotion';
import { z } from 'zod';
import { ElegantBokehText } from './components/BattleShared/BattleSharedComponents';

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
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', opacity: globalOpacity }}>
      {/* 少し暗めの幕をかけて文字を見やすくする */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(0, 5, 20, 0.4)' }} />
      
      {/* 豪華で優しいオープニングテキスト */}
      <div style={{ position: 'absolute', top: '20%', transform: `scale(${titleScale})`, opacity: titleOpacity, filter: `blur(${titleBlur}px)` }}>
        <ElegantBokehText text="人気アップバトル" frame={frame} fontSize={120} />
      </div>

      <div style={{ position: 'absolute', top: '45%', transform: `scale(${dateScale})`, opacity: dateOpacity, width: '100%', textAlign: 'center' }}>
        <ElegantBokehText text={dateInfo.year} frame={frame - 30} fontSize={160} />
      </div>

      <div style={{ position: 'absolute', top: '70%', width: '100%', textAlign: 'center', opacity: timeOpacity }}>
        <h2 style={{ color: '#fff', fontSize: 130, margin: 0, textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 50px rgba(255,200,200,0.5)', fontFamily: '"Mochiy Pop One", sans-serif' }}>
          {dateInfo.time || dateInfo.date}
        </h2>
        <h3 style={{ color: '#ffb3c6', fontSize: 80, margin: 0, marginTop: 20, textShadow: '0 0 20px #ffb3c6', fontFamily: '"Mochiy Pop One", sans-serif' }}>START</h3>
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
      
      {/* 中央: 優しいテキスト */}
      <div style={{ position: 'absolute', top: '15%', width: '100%', textAlign: 'center' }}>
        <ElegantBokehText text="J.O.L LIVER" frame={frame} fontSize={120} />
      </div>

      {/* 3名の画像と直下の名前 */}
      <div style={{ position: 'absolute', top: '40%', width: '100%', display: 'flex', justifyContent: 'space-evenly', padding: '0 20px' }}>
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
              {/* ふんわり光る優しい枠 */}
              <Img src={staticFile(liver.image)} style={{ 
                width: 280, height: 280, 
                borderRadius: '50%', objectFit: 'cover', 
                border: `8px solid ${liver.borderColor || '#ffb3c6'}`, 
                boxShadow: `0 0 50px ${liver.borderColor || '#ffb3c6'}88, 0 10px 20px rgba(0,0,0,0.5)`
              }} />
              
              {/* 画像直下の名前 */}
              <h2 style={{ 
                color: '#fff', fontSize: 45, width: 320, textAlign: 'center', 
                marginTop: 30, textShadow: '0 5px 15px rgba(0,0,0,0.8), 0 0 20px #ffb3c6',
                fontFamily: '"Mochiy Pop One", sans-serif',
              }}>
                {liver.name}
              </h2>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 2: 1名のライバー (90fr) - つれトラさんなど
const Scene_SingleLiver: React.FC<{ liver: Props['livers'][0] }> = ({ liver }) => {
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
        {/* つれトラさん等、相手の枠も優しく */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -20, left: -20, right: -20, bottom: -20,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 100, 255, 0.4) 0%, transparent 70%)',
            animation: 'spin 10s linear infinite',
          }} />
          <Img src={staticFile(liver.image)} style={{ 
            width: 600, height: 600, borderRadius: '50%', objectFit: 'cover', 
            border: '12px solid rgba(255, 200, 255, 0.8)', 
            boxShadow: '0 0 100px rgba(200, 100, 255, 0.6)' 
          }} />
        </div>
        <h1 style={{ color: '#fff', fontSize: 100, margin: 0, textShadow: '0 0 30px rgba(200,100,255,0.8), 0 5px 15px rgba(0,0,0,0.5)', fontFamily: '"Mochiy Pop One", sans-serif' }}>
          {liver.name}
        </h1>
      </div>
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
      {/* 4分割グリッドレイアウトだが隙間と丸みを持たせる */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '100%', height: '100%', gap: 30, padding: 30 }}>
        {livers.slice(0, 4).map((liver, i) => {
          const isOpponent = i === 3;
          const auraColor = isOpponent ? 'rgba(200, 100, 255, 0.5)' : 'rgba(255, 180, 200, 0.5)';
          const delay = i * 10;
          const itemOpacity = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          
          return (
            <div key={`split-${liver.id}`} style={{ 
              position: 'relative', width: '100%', height: '100%', 
              borderRadius: 40, overflow: 'hidden',
              boxShadow: `0 0 50px ${auraColor}`,
              border: `4px solid ${isOpponent ? 'rgba(200,100,255,0.8)' : 'rgba(255,200,220,0.8)'}`,
              opacity: itemOpacity
            }}>
              <Img src={staticFile(liver.image)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              {/* ふんわりした名前グラデーション帯 */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', textAlign: 'center', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '40px 0 20px 0' }}>
                <span style={{ color: '#fff', fontSize: 45, textShadow: '0 0 10px rgba(255,255,255,0.5)', fontFamily: '"Mochiy Pop One", sans-serif' }}>{liver.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 中央に優しいVS */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`, width: '100%', textAlign: 'center' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 60%)', filter: 'blur(20px)' }} />
        </AbsoluteFill>
        <ElegantBokehText text="V S" frame={frame - 60} fontSize={180} />
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
          <ElegantBokehText text="R U L E" frame={frame} fontSize={120} />
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

// 📌 Scene 5: エンディングメッセージ (150fr)
const Scene_Ending: React.FC<{ message: string }> = ({ message }) => {
  const frame = useCurrentFrame();
  const [line1, line2] = message.split('\n');

  const sceneOpacity = interpolate(frame, [0, 30, 120, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 150], [0.95, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0, 10, 30, 0.4)' }} />
      <div style={{ transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ElegantBokehText text={line1 || ''} frame={frame} fontSize={80} />
        {line2 && (
          <div style={{ marginTop: 40 }}>
            <ElegantBokehText text={line2} frame={frame - 20} fontSize={110} />
          </div>
        )}
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
        src={staticFile('assets/images-01/jol-logo.png')} 
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
        
        {/* 名前 */}
        <div style={{ transform: `translateY(${interpolate(frame, [0, 40], [50, 0], { extrapolateRight: 'clamp'})}px)` }}>
          <ElegantBokehText text={liver.name} frame={frame} fontSize={130} />
        </div>
      </div>
    </AbsoluteFill>
  );
};


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

            {/* 画像本体 */}
            <Img 
              src={staticFile(img)} 
              style={{
                width: 900,
                height: 900,
                borderRadius: '50%',
                objectFit: 'cover',
                transform: `scale(${scale}) translateY(${floatY}px)`,
                filter: `blur(${blur}px) drop-shadow(0 0 50px rgba(255, 180, 200, 0.8))`,
                boxShadow: '0 0 100px rgba(255, 100, 150, 0.6), inset 0 0 50px rgba(255,255,255,0.3)',
                border: '15px solid rgba(255, 200, 230, 0.9)',
                zIndex: 10,
              }}
            />

            {/* 下から浮き上がってくる名前の演出 */}
            <div style={{ 
              position: 'absolute', 
              bottom: '12%',
              transform: `translateY(${interpolate(relativeFrame, [0, 40], [50, 0], { extrapolateRight: 'clamp'})}px)`,
              zIndex: 20
            }}>
              <ElegantBokehText text="🌸さくら🌸" frame={relativeFrame} fontSize={130} />
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};


// ---------- メインコンポジション ---------- //
export const JolPopularityBattle3vs1: React.FC<Props> = (props) => {
  const frame = useCurrentFrame();

  // 0〜1139フレーム（対戦相手紹介が終わるまで）にかけて、徐々に明るく華やかな色味に変えていくカラーグレーディング
  const gradingOpacity = interpolate(
    frame, 
    [0, 1100, 1135, 1140], 
    [0, 0.35, 0.35, 0], 
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // 1140フレーム（シーン切り替えの瞬間）の「真っ白なフラッシュ」
  const flashOpacity = interpolate(
    frame,
    [1125, 1140, 1155],
    [0, 1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  
  const flashScale = interpolate(
    frame,
    [1125, 1140, 1155],
    [0.5, 3, 4],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // オープニング: 300fr (0〜300)
  // SakuraMain: 450fr (300〜750)
  // TakaMain: 150fr (750〜900)
  // ThreeLivers: 150fr (900〜1050)
  // SingleLiver(Opponent): 90fr (1050〜1140) 短縮!!
  // BattleSplit: 200fr (1140〜1340)
  // Scene4(Rules): 120fr (1340〜1460)
  // Scene5(Ending): 150fr (1460〜1610)
  // Scene6(Logo): 60fr (1610〜1670)
  // トータル: 1670fr
  
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

      <Sequence from={0} durationInFrames={300}>
        <Scene_Opening dateInfo={props.dateInfo} />
      </Sequence>

      {/* さくらさんシーンを 450フレームに延長 (約15秒) */}
      <Sequence from={300} durationInFrames={450}>
        {props.sakuraImages && <Scene_SakuraMain images={props.sakuraImages} />}
      </Sequence>

      {/* takaさんシーンを新設 (150フレーム / 約5秒) */}
      <Sequence from={750} durationInFrames={150}>
        {props.livers[0] && <Scene_TakaMain liver={props.livers[0]} />}
      </Sequence>

      {/* 3人並ぶシーンは後ろへ下げる */}
      <Sequence from={900} durationInFrames={150}>
        <Scene_ThreeLivers livers={props.livers} />
      </Sequence>

      {/* 対戦相手(つれトラ) 単独シーン: 90フレームに短縮 */}
      <Sequence from={1050} durationInFrames={90}>
        {props.livers[3] && <Scene_SingleLiver liver={props.livers[3]} />}
      </Sequence>

      {/* 4分割 VSシーン */}
      <Sequence from={1140} durationInFrames={200}>
        <Scene_BattleSplit livers={props.livers} />
      </Sequence>

      <Sequence from={1340} durationInFrames={120}>
        {props.rules && <Scene_Rules rules={props.rules} />}
      </Sequence>

      <Sequence from={1460} durationInFrames={150}>
        {props.finalMessage && <Scene_Ending message={props.finalMessage} />}
      </Sequence>

      <Sequence from={1610} durationInFrames={60}>
        <Scene_Logo />
      </Sequence>

      {/* 全編を覆うカラーグレーディング・リッチ発光レイヤー（0〜1139で徐々に現れる） */}
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
