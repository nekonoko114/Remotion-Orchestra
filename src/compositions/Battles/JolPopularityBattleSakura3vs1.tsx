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

// ポップでハジける星空・ネオン輝きテキストコンポーネント
const PopNeonText: React.FC<{ text: string; frame: number; fontSize: number; }> = ({ text, fontSize, frame }) => {
  const { fps } = useVideoConfig();
  // リズムに合わせた激しめのバウンス（スプリング）アニメーション
  const scale = spring({
    frame: Math.max(0, frame),
    fps,
    config: { stiffness: 450, damping: 10, mass: 0.8 },
  });

  return (
    <div style={{ transform: `scale(${scale})` }}>
      <h2 style={{
        color: '#fff',
        margin: 0,
        fontSize,
        fontFamily: '"Mochiy Pop One", sans-serif',
        // イエロー〜オレンジ〜ピンクのSuper Star的なネオン発光
        textShadow: `
          0 0 10px #fff7cc,
          0 0 20px #ffcc00,
          0 0 40px #ff8800,
          0 0 80px #ff007f,
          0 0 120px #ff007f
        `,
        textAlign: 'center'
      }}>
        {text}
      </h2>
    </div>
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

export const PopularityBattleSakura3vs1Schema = z.object({
  themeColor: z.string(),
  livers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
      borderColor: z.string().optional().default('#fff'),
    })
  ),
  dateInfo: z.object({
    year: z.string(),
    date: z.string(),
    time: z.string(),
  }),
  rules: z.array(z.string()).optional().default([]),
  finalMessage: z.string().optional().default(''),
  music: z.string().optional().default(''),
  customBackground: z.string().optional().default(''),
  sakuraImages: z.array(z.string()).optional().default([]),
});

type Props = z.infer<typeof PopularityBattleSakura3vs1Schema>;

// ---------- シーンごとのコンポーネント定義 ---------- //

// 📌 オープニング (4s = 120fr)
const Scene_Opening: React.FC<{ dateInfo: Props['dateInfo'], mainImage?: string }> = ({ dateInfo, mainImage }) => {
  const frame = useCurrentFrame();

  // オープニング全体 (120fr) のフェードアウト
  const globalOpacity = interpolate(frame, [90, 120], [1, 0], { extrapolateRight: 'clamp' });

  // 優しいフェードイン＆ズーム
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const titleBlur = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' });
  const dateOpacity = interpolate(frame - 30, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dateScale = interpolate(frame - 30, [0, 90], [0.9, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// dateScale is used in div below

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'start', alignItems: 'center', opacity: globalOpacity }}>
      {/* 星とパーティクルのアップテンポな背景に変更 */}
      <Video 
        src={staticFile('assets/pixabay/videos/webm/pixabay_bokeh_particles_stars_rays_background_animation_341107.webm')} 
        style={{ 
          position: 'absolute', 
          width: '100%', height: '100%', 
          objectFit: 'cover', 
          transform: 'scale(1.2)', 
          mixBlendMode: 'screen', 
          // Super Star のイメージに合わせるための色調＆明るさブースト
          filter: 'hue-rotate(330deg) saturate(250%) brightness(1.5)', 
          opacity: 0.6 
        }} 
      />
      {/* 文字を際立たせるための少し紫・ピンクがかったロマンチックな暗幕 */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(30, 0, 20, 0.4)' }} />
      {/* 予約バトル：左上に固定配置 */}
      <div style={{ position: 'absolute', top: '5%', left: '5%', opacity: titleOpacity, filter: `blur(${titleBlur}px)` }}>
        <PopNeonText text="予約バトル" frame={frame} fontSize={80} />
      </div>

      {/* メインタイトル (人気UP BATTLE) と装飾画像 */}
      <div style={{ 
        position: 'absolute', top: '40%', 
        transform: `scale(${dateScale})`, opacity: dateOpacity, 
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' 
      }}>
        {/* 人気UP と 左右の専用画像 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
          <Img 
            src={staticFile('assets/images/populer-up.png')} 
            style={{ width: 150, height: 150, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,200,0,0.8))' }} 
          />
          <PopNeonText text="人気UP" frame={frame - 15} fontSize={140} />
          <Img 
            src={staticFile('assets/images/pupuler-up-super.png')} 
            style={{ width: 150, height: 150, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,200,0,0.8))' }} 
          />
        </div>
        
        <PopNeonText text="BATTLE" frame={frame - 30} fontSize={160} />
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 3: 3名のライバー (4s = 120fr)
const Scene_ThreeLivers: React.FC<{ livers: Props['livers'] }> = ({ livers }) => {
  const frame = useCurrentFrame();
  const showLivers = livers.slice(0, 3); // 最初の3人

  // シーンのフェードイン・フェードアウト
  const sceneOpacity = interpolate(frame, [0, 20, 100, 120], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', opacity: sceneOpacity }}>
      {/* 優しい雰囲気を作るためのピンク/オレンジ系のふんわりとしたオーバーレイ */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(255, 150, 200, 0.1)' }} />
      
      {/* 中央: 優しいテキスト */}
      <div style={{ position: 'absolute', top: '15%', width: '100%', textAlign: 'center' }}>
        <PopNeonText text="J.O.L LIVER" frame={frame} fontSize={120} />
      </div>

      {/* 3名の画像と直下の名前 */}
      <div style={{ position: 'absolute', top: '40%', width: '100%', display: 'flex', justifyContent: 'space-evenly', padding: '0 20px' }}>
        {showLivers.map((liver, i) => {
          const delay = i * 20;
          
          // ボケながらゆっくりフェードイン
          const itemOpacity = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          const itemBlur = interpolate(frame - delay, [0, 30], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          const itemScale = interpolate(frame - delay, [0, 120], [0.9, 1.05], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          
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
                transform: `scale(${spring({ frame: Math.max(0, frame - delay - 10), fps: 30, config: { stiffness: 400, damping: 10 } })})`,
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
// Scene_SingleLiver is not used in this composition

// 📌 Scene 5: 4人全員 2x2分割 (4s = 120fr)
// バキッとした線ではなく、丸形にくり抜いて柔らかな光でつなぐ
const Scene_BattleSplit: React.FC<{ livers: Props['livers'] }> = ({ livers }) => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 20, 100, 120], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 120], [0.95, 1.05], { extrapolateRight: 'clamp' });

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
        <PopNeonText text="V S" frame={frame - 40} fontSize={180} />
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 6: ルール (3.5s = 105fr)
// 直線的ではなく、柔らかなガラスモーフパネルでふんわり表示
const Scene_Rules: React.FC<{ rules: string[] }> = ({ rules }) => {
  const frame = useCurrentFrame();
  
  const sceneOpacity = interpolate(frame, [0, 20, 85, 105], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 105], [0.95, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '50px', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      <div style={{ transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ marginBottom: 60 }}>
          <PopNeonText text="R U L E" frame={frame} fontSize={120} />
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
  
  // ユーザーが \n で意図した改行をすべて取得
  // （エスケープミス「\見」などはRoot.tsx側で直すか、このまま1行として扱う）
  const lines = message.split('\n');

  const sceneOpacity = interpolate(frame, [0, 30, 120, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 150], [0.95, 1.05], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0, 10, 30, 0.4)' }} />
      <div style={{ transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, width: '90%' }}>
        {lines.map((lineText, i) => (
          // 画面に収まるよう fontSize を 65 に統一。少しずつ遅れてアニメーションさせる
          <PopNeonText key={i} text={lineText} frame={frame - i * 15} fontSize={70} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 📌 Scene 6: ロゴ (60fr)
// Scene_Logo is not used in this composition


// 📌 Scene 2: takaさんメイン 爽やかで優雅なシーン (9s = 270fr)
const Scene_TakaMain: React.FC<{ liver: Props['livers'][0] }> = ({ liver }) => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 30, 240, 270], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemBlur = interpolate(frame, [0, 40], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const itemScale = interpolate(frame, [0, 270], [0.9, 1.05], { extrapolateRight: 'clamp' });
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


// ---------- 装飾削除によるロールバック済み ---------- //

// 📌 Scene 1: さくらさんメイン 幻想的シーン (3s = 90fr)
// 超絶リッチ＆幻想的エフェクト：後光、回転魔法陣、ボケフェードイン、呼吸のような浮遊感
const Scene_SakuraMain: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ 
        mixBlendMode: 'screen', 
        opacity: 0.9,
      }}>
        <Video 
          src={staticFile('assets/pixabay/videos/webm/pixabay_stars_christmas_loop_glowing_light_background_beau_183279.webm')} 
          playbackRate={1.5}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)', filter: 'brightness(1.5) saturate(2)' }} 
        />
      </AbsoluteFill>

      {/* うっすらピンク・オレンジ系の光全体シャワー */}
      <AbsoluteFill style={{ 
        background: 'radial-gradient(circle at center, rgba(255, 100, 150, 0.3) 0%, transparent 70%)' 
      }} />

      {/* さくらさんの画像（以前表示していた箇所）はご要望により削除 */}

      <div style={{ 
        position: 'absolute', 
        bottom: '10%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        zIndex: 20
      }}>
        <PopNeonText text="さくら組" frame={frame - 15} fontSize={100} />
        <PopNeonText text="いくよ！" frame={frame - 30} fontSize={140} />
      </div>

    </AbsoluteFill>
  );
};


// ---------- メインコンポジション ---------- //
export const JolPopularityBattleSakura3vs1: React.FC<Props> = (props) => {
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

  // ----------------------------------------
  // 指定タイムライン (fps=30計算)
  // Opening: 4s = 120fr (0〜120)
  // Scene1: 3s = 90fr (120〜210)
  // Scene2: 9s = 270fr (210〜480)
  // Scene3: 4s = 120fr (480〜600)
  // Scene5: 4s = 120fr (600〜720) ※scene4(つれトラ単独)はスキップ
  // Scene6: 3.5s = 105fr (720〜825)
  // Ending: (仮名で5s) = 150fr (825〜975)
  // ----------------------------------------
  
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
        <Audio src={staticFile(props.music)} />
      )}

      {/* Opening 4S (120fr) */}
      <Sequence from={0} durationInFrames={120}>
        <Scene_Opening dateInfo={props.dateInfo} mainImage={props.sakuraImages?.[0]} />
      </Sequence>

      {/* Scene1 3S (90fr) - 背景とテキストのみ */}
      <Sequence from={120} durationInFrames={90}>
        <Scene_SakuraMain />
      </Sequence>

      {/* Scene2 9S (270fr) -- tajaさんからさくらさんに変更 */}
      <Sequence from={210} durationInFrames={270}>
        {props.livers[1] && <Scene_TakaMain liver={props.livers[1]} />}
      </Sequence>

      {/* Scene3 4S (120fr) */}
      <Sequence from={480} durationInFrames={120}>
        <Scene_ThreeLivers livers={props.livers} />
      </Sequence>

      {/* Scene5 (4分割) 4S (120fr) */}
      <Sequence from={600} durationInFrames={120}>
        <Scene_BattleSplit livers={props.livers} />
      </Sequence>

      {/* Scene6 (ルール等) 3.5S (105fr) */}
      <Sequence from={720} durationInFrames={105}>
        {props.rules && <Scene_Rules rules={props.rules} />}
      </Sequence>

      {/* エンディング (150fr) */}
      <Sequence from={825} durationInFrames={150}>
        {props.finalMessage && <Scene_Ending message={props.finalMessage} />}
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
