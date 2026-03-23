import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  Img,
  staticFile,
  Video,
  random,
} from 'remotion';
import { z } from 'zod';
import { BurningLightningText, ElegantBokehText, StarburstCoreText } from './components/BattleShared/BattleSharedComponents';
import { NeonGlowText } from '../../components/effects/NeonGlowText';

export const ReservationBattleSchema = z.object({
  themeColor: z.string(),
  music: z.string().optional(),
  livers: z.array(
    z.object({
      name: z.string(),
      image: z.string(),
      borderColor: z.string().optional(),
    })
  ).length(4), // 主役(右)1人 + 左3人 = 計4人
  dateInfo: z.object({
    year: z.string(),
    date: z.string(),
    time: z.string(),
  }),
  rules: z.array(z.string()),
  finalMessage: z.string(),
});

type Props = z.infer<typeof ReservationBattleSchema>;

// === Scenes ===

// 導入 (2s -> 尺変更で 125fr)
const SceneOpening: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 30frからスライドアニメーション開始
  const yOffset = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // 30frから登場
  const opacity = interpolate(frame, [30, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 30fr以降でWiggle振動（激しく揺らす）
  const isWiggling = frame >= 30;
  // 激しさを決める（±20px程度）
  const wiggleIntensity = 20;
  const wiggleX = isWiggling ? (random(`${frame}-x`) - 0.5) * wiggleIntensity * 2 : 0;
  const wiggleY = isWiggling ? (random(`${frame}-y`) - 0.5) * wiggleIntensity * 2 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AbsoluteFill>
        <Video
          src={staticFile('assets/pixabay/particles/two-star-collision.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* 背景を少し暗くして文字を目立たせる */}
        <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />
      </AbsoluteFill>
      <div
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          transform: `translate(${wiggleX}px, ${(1 - yOffset) * 400 + wiggleY}px) rotate(10deg)`,
          filter: 'drop-shadow(0 0 15px rgba(255, 0, 0, 0.5))',
          opacity,
        }}
      >
        <NeonGlowText text="予約バトル！" color="#00f2ff" fontSize={150} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 1: 4人のライバーが順番に表示 (60-134fr)
const Scene1_LiversIntro: React.FC<{ livers: Props['livers'] }> = ({ livers }) => {
  const frame = useCurrentFrame();

  // 合計75fr (60-134fr) で4人表示 -> 1人あたり約18フレーム表示
  const durationPerLiver = 18;
  const transDur = 8; // トランジションにかけるフレーム数

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 🌟 背景動画（指定の素材を青系にカラーグレーディング） */}
      <AbsoluteFill>
        <Video
          src={staticFile('assets/pixabay/videos/pixabay_bokeh_particles_stars_rays_background_animation_341107.mp4')}
          style={{ 
            width: '100%', height: '100%', objectFit: 'cover',
            // 元の動画の色相に関わらずサイバー系に染め上げる
            filter: 'sepia(1) hue-rotate(190deg) saturate(4) brightness(0.9)',
            // 右下のPixabayのロゴが見切れるように動画自体を少し拡大（ズーム）する
            transform: 'scale(1.15)',
          }}
        />
        {/* さらに綺麗な青の深みと、手前のライバーが目立つように暗めのブルーオーバーレイを敷く */}
        <AbsoluteFill style={{ backgroundColor: 'rgba(0, 20, 80, 0.5)' }} />
      </AbsoluteFill>

      {/* ライバーの表示レイヤー */}
      <AbsoluteFill>
        {livers.map((liver, i) => {
          const startFrame = i * durationPerLiver;
        const endFrame = startFrame + durationPerLiver;

        if (frame < startFrame || (i < 3 && frame >= endFrame)) {
          return null;
        }

        const relativeFrame = frame - startFrame;
        const isExiting = i < 3 && frame >= endFrame - transDur;

        // Speed Ramp Zoom Blur ロジック
        let scale = 1;
        let blur = 0;
        let brightness = 1;
        let opacity = 1;

        if (relativeFrame <= transDur) {
          // 登場時 (Scene B 相当: Scale 0.2 -> 1, Blur 100 -> 0, Brightness 1.5 -> 1)
          const p = relativeFrame / transDur;
          scale = interpolate(p, [0, 1], [0.2, 1], { extrapolateRight: 'clamp' });
          blur = interpolate(p, [0, 1], [100, 0], { extrapolateRight: 'clamp' });
          brightness = interpolate(p, [0, 1], [1.5, 1], { extrapolateRight: 'clamp' });
          opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }); // 最初のブラックアウト回避
        } else if (isExiting) {
          // 退場時 (Scene A 相当: Scale 1 -> 5, Blur 0 -> 100, Brightness 1 -> 1.5)
          const p = (frame - (endFrame - transDur)) / transDur;
          scale = interpolate(p, [0, 1], [1, 5], { extrapolateRight: 'clamp' });
          blur = interpolate(p, [0, 1], [0, 100], { extrapolateRight: 'clamp' });
          brightness = interpolate(p, [0, 1], [1, 1.5], { extrapolateRight: 'clamp' });
        }

        return (
          <div
            key={`intro-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${scale})`,
              filter: `blur(${blur}px) brightness(${brightness})`,
              opacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Img
              src={staticFile(liver.image)}
              style={{
                width: 500,
                height: 500,
                objectFit: 'cover',
                borderRadius: '50%',
                border: `15px solid ${liver.borderColor || '#fff'}`,
                boxShadow: `0 0 50px ${liver.borderColor || '#fff'}`,
              }}
            />
            <h2
              style={{
                color: '#fff',
                fontSize: 60,
                marginTop: 40,
                fontWeight: 900,
                textShadow: '0 10px 30px rgba(0,0,0,0.8)',
                fontFamily: '"Noto Sans JP", sans-serif',
              }}
            >
              {liver.name}
            </h2>
          </div>
        );
      })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2: 左右カラム (135-254fr -> 現在は164~285fr設定)
const Scene2_TwoColumn: React.FC<{ livers: Props['livers'] }> = ({ livers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainLiver = livers[3]; // 右側に大きく表示（つれトラ🍭💟）
  const subLivers = [livers[0], livers[1], livers[2]]; // 左側の3人

  // 絶対フレーム194fr = ローカルフレーム30 とする。
  const startLiverAnimFrame = 30;
  const delayPerLiver = 10; // 10フレーム間隔で1人ずつ出現

  // VSテキストはライバーの前（ローカル15fr）くらいで先にドンと出す
  const vsScale = spring({ frame: frame - 15, fps, config: { damping: 15 } });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a', flexDirection: 'row', padding: 40, overflow: 'hidden' }}>
      {/* 背景動画 (青系をインラインCSSで赤系にカラーグレーディング) */}
      <AbsoluteFill>
        <Video
          src={staticFile('assets/pixabay/particles/paricle-blue-floating.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // 元の青色の色味を生かし、より鮮やかでクールなブルーの空間になるよう調整
            filter: 'saturate(2) brightness(0.9) contrast(1.2) hue-rotate(10deg)',
            // 念のためこちらの素材の右下ロゴも隠れるようにズーム
            transform: 'scale(1.1)',
          }}
        />
        <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />
      </AbsoluteFill>

      {/* --- 楽しそうな演出: 背景に舞い上がるキラキラ・キャンディパーティクル --- */}
      <AbsoluteFill>
         {new Array(25).fill(0).map((_, i) => {
           // 各パーティクルの速度やサイズを分散させる
           const speed = 3 + (i % 4);
           // 時間経過で下から上へ移動
           const particleY = (frame * speed + i * 130) % 2200; 
           const isEmoji = i % 2 === 0;
           return (
             <div key={`particle-${i}`} style={{
               position: 'absolute',
               // X座標はランダムっぽく散らばらせる
               left: `${(i * 379) % 1080}px`,
               bottom: `${particleY - 200}px`, // 画面下から上に
               fontSize: 30 + (i % 30),
               opacity: interpolate(particleY, [0, 200, 1800, 2200], [0, 0.4, 0.4, 0]),
               transform: `rotate(${frame * (i % 2 === 0 ? 3 : -3)}deg)`,
               zIndex: 1, // VSの後ろ、あるいは背景に乗せる
               filter: isEmoji ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none'
             }}>
               {['✨', '🍬', '🍭', '💖', '🎵', '⭐'][i % 6]}
             </div>
           );
         })}
      </AbsoluteFill>

      {/* 左カラム (3人) - Zインデックスを高くしてVSの手前に出す */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '20px 0', position: 'relative', zIndex: 10 }}>
        {subLivers.map((liver, i) => {
          const liverFrame = frame - (startLiverAnimFrame + i * delayPerLiver);
          const liverScale = spring({ frame: liverFrame, fps, config: { damping: 12 } });
          const liverOpacity = interpolate(liverFrame, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          // 登場後にフワフワと上下に浮遊する楽しいアニメーション
          const floatY = Math.sin(frame / (12 + i * 2)) * 15;
          
          return (
            <div
              key={`sub-${i}`}
              style={{
                display: 'flex',
                flexDirection: 'column', // ← 画像の下にテキストを配置
                alignItems: 'center',
                transform: `scale(${liverScale}) translateY(${liverFrame > 0 ? floatY : 0}px)`,
                opacity: liverOpacity,
              }}
            >
              <Img
                src={staticFile(liver.image)}
                style={{
                  width: 400, // 高さが足りなくなるため少し小さめにする
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 999,
                  border: `6px solid ${liver.borderColor || '#fff'}`,
                  marginBottom: 10, // 画像下に余白
                  boxShadow: `0 10px 20px rgba(0,0,0,0.5)`,
                }}
              />
              <div style={{ 
                color: '#fff', 
                fontSize: 35, // テキストサイズも微調整
                fontWeight: 'bold', 
                fontFamily: '"Noto Sans JP", sans-serif',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {/* 名前が長い場合や絵文字が多用されている場合でも綺麗に見えるようにする */}
                {liver.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* 中央の「VS」区切り */}
      <div style={{ width: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          transform: `scale(${vsScale})`,
          mixBlendMode: 'screen', // 背景を透過させる（黒い動画の枠を消すため）
        }}>
          <BurningLightningText text="VS" frame={frame} fontSize={600} />
        </div>
      </div>

      {/* 右カラム (1人) - Zインデックスを高くしてVSの手前に出す */}
      <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ 
            transform: `scale(${spring({ frame: frame - (startLiverAnimFrame + 3 * delayPerLiver), fps, config: { damping: 12 } })}) translateY(${Math.sin(frame / 15) * 20}px)`,
            opacity: interpolate(frame - (startLiverAnimFrame + 3 * delayPerLiver), [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        }}>
          <Img
            src={staticFile(mainLiver.image)}
            style={{
              width: 450,
              height: 450,
              objectFit: 'cover',
              borderRadius: '50%',
              border: `15px solid ${mainLiver.borderColor || '#ffbb00'}`,
              boxShadow: `0 0 50px ${mainLiver.borderColor || '#ffbb00'}`,
            }}
          />
          <div style={{ 
            color: '#fff', 
            fontSize: 60, 
            fontWeight: 900, 
            marginTop: 40, 
            textAlign: 'center',
            fontFamily: '"Noto Sans JP", sans-serif',
            background: 'linear-gradient(90deg, transparent, rgba(255,187,0,0.5), transparent)',
            padding: '10px 0'
          }}>
            {mainLiver.name}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: グリッチテキスト (285-404fr) 120fr
const Scene3_GlitchText: React.FC<{ dateInfo: Props['dateInfo'] }> = ({ dateInfo }) => {
  const frame = useCurrentFrame();
  const fps = 30; // 1秒 = 30fr

  // 1秒ごとにテキストを替える
  const stage = Math.floor(frame / fps);
  let text = '';
  switch (stage) {
    case 0: text = '人気アップバトル'; break;
    case 1: text = '🍦taka🍦\n🌸さくら🌸\n🌹夢一輪🌹\nvs\nつれトラ🍭💟'; break;
    case 2: text = dateInfo.year; break;
    case 3: text = `${dateInfo.date} ${dateInfo.time}`; break;
    default: text = ''; break;
  }

  // 文字数や改行によって枠に収まるようにフォントサイズを動的に変更
  const dynamicFontSize = text.length > 20 ? '110px' : text.length > 6 ? '110px' : '150px';

  // グリッチ風のCSSアニメーション用インラインスタイル
  const glitchOffset1 = Math.sin(frame * 0.5) * 10;
  const glitchOffset2 = Math.cos(frame * 0.8) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
      {text && (
        <div style={{ position: 'relative', whiteSpace: 'pre-wrap', width: '100%', textAlign: 'center' }}>
          <div style={{
            fontSize: dynamicFontSize,
            fontWeight: 900,
            color: '#fff',
            fontFamily: '"Mochiy Pop One", sans-serif',
            textAlign: 'center',
            textShadow: '5px 5px 0px #ff0055, -5px -5px 0px #00ccff',
            transform: `skewX(${Math.sin(frame) * 5}deg)`,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.3,
          }}>
            {text}
          </div>
          {/* グリッチレイヤー1 */}
          <div style={{
            position: 'absolute',
            top: 0, left: `calc(50% + ${glitchOffset1}px)`,
            transform: 'translateX(-50%)',
            width: '100%',
            fontSize: dynamicFontSize,
            fontWeight: 900,
            color: '#ff0055',
            fontFamily: '"Mochiy Pop One", sans-serif',
            textAlign: 'center',
            opacity: 0.5,
            clipPath: `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.3,
          }}>
            {text}
          </div>
          {/* グリッチレイヤー2 */}
          <div style={{
            position: 'absolute',
            top: 0, left: `calc(50% - ${glitchOffset2}px)`,
            transform: 'translateX(-50%)',
            width: '100%',
            fontSize: dynamicFontSize,
            fontWeight: 900,
            color: '#00ccff',
            fontFamily: '"Mochiy Pop One", sans-serif',
            textAlign: 'center',
            opacity: 0.5,
            clipPath: `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.3,
          }}>
            {text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Scene 4: ルール (375-494fr)
const Scene4_Rules: React.FC<{ rules: string[] }> = ({ rules }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: 'rgba(0,0,0,0.4)', 
      padding: '50px', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <div style={{ 
        color: '#ffdd00', 
        fontSize: 100, 
        fontWeight: 900, 
        textAlign: 'center',
        marginBottom: 80,
        fontFamily: '"Mochiy Pop One", sans-serif',
        transform: `scale(${titleScale})`
      }}>
        ルール
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
        {rules.map((rule, i) => {
          const delay = 15 + i * 20; // 順に表示
          const y = interpolate(frame - delay, [0, 15], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const o = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          return (
            <div key={`rule-${i}`} style={{
              color: '#fff',
              fontSize: 70,
              fontWeight: 'bold',
              fontFamily: '"Noto Sans JP", sans-serif',
              transform: `translateY(${y}px)`,
              opacity: o,
              display: 'flex',
              alignItems: 'center',
              gap: 30
            }}>
              <span style={{ color: '#ff0055', fontSize: 80 }}>■</span>
              {rule}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: エンドメッセージ
const Scene5_Ending: React.FC<{ msg: string; themeColor: string; livers: Props['livers'] }> = ({ msg, themeColor, livers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 155fr尺から245fr尺（555~799fr）に変更されたため、フェードアウトのタイミングを後ろにずらす
  const opacity = interpolate(frame, [0, 10, 235, 245], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // テキスト出現のスケールアニメーション
  const scale = spring({ frame, fps, config: { damping: 12, mass: 1.5 } });

  // 600fr = ローカルフレームだと 600 - 555 = 45fr
  const showLiversLocalFrame = 45;
  const showLiversScale = spring({ frame: frame - showLiversLocalFrame, fps, config: { damping: 12 } });
  // フレームごとに時計回りに回転（1秒で30度くらい）
  const circleRotation = frame >= showLiversLocalFrame ? (frame - showLiversLocalFrame) * 1.5 : 0;
  const radius = 380; // 円の半径

  // 指定された箇所でいい感じに改行（分割）する
  const splitKeyword = '座を';
  const splitIndex = msg.indexOf(splitKeyword);
  const line1 = splitIndex !== -1 ? msg.substring(0, splitIndex + splitKeyword.length) : msg;
  const line2 = splitIndex !== -1 ? msg.substring(splitIndex + splitKeyword.length) : '';

  return (
    <AbsoluteFill style={{ backgroundColor: '#fff', justifyContent: 'end', alignItems: 'center', opacity }}>
      {/* 背景動画と、文字を見やすくするための少し濃いめの暗いレイヤー（オーバーレイ） */}
      <AbsoluteFill>
        <Video
          src={staticFile('assets/pixabay/videos/boken-ball.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <AbsoluteFill  />
      </AbsoluteFill>

      {/* サークル状に配置して回転するライバーたち（テキストの後ろに置く） */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: 0, height: 0, // 中心点
        transform: `scale(${showLiversScale}) rotate(${circleRotation}deg)`,
      }}>
        {livers.map((liver, i) => {
          const angle = (i * 360) / livers.length; // 4人なら 0, 90, 180, 270 に配置
          const radian = (angle - 90) * (Math.PI / 180); // 上を起点(0度)にするための-90
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          // 親の回転と自身の配置位置から、現在の「世界座標上での一番上(0度)に近いか」を計算する
          // cos(0) = 1 (一番上), cos(180) = -1 (一番下)
          const currentAngle = angle + circleRotation;
          const currentRad = currentAngle * (Math.PI / 180);
          const topFactor = Math.cos(currentRad); // 1.0 に近いほど一番上

          // 上に来た時に 3倍 になるのはそのままで、輝度を「暗く」落として影のようにします（文字の視認性確保のため）
          const dynamicScale = interpolate(topFactor, [-1, 0, 1], [0.8, 1, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          // 上(-1->1)に来るにつれて明るく(1.0 -> 0.3)なる
          const dynamicBrightness = interpolate(topFactor, [-1, 0, 1], [0.4, 0.6, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div
              key={`circle-${i}`}
              style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                // 親が時計回りに回る分だけ、画像を逆回転させれば、顔が常に上向き（観覧車状態）になる
                transform: `translate(-50%, -50%) rotate(${-circleRotation}deg)`,
                width: 200,
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Img
                src={staticFile(liver.image)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: `6px solid ${liver.borderColor || '#fff'}`,
                  boxShadow: `0 0 30px ${liver.borderColor || '#fff'}`,
                  transform: `scale(${dynamicScale})`, // 大きさを変える
                  filter: `brightness(${dynamicBrightness}) drop-shadow(0 0 ${topFactor > 0.8 ? 20 : 0}px rgba(255,255,255,0.8))`, // 一番上で光る
                  transition: 'transform 0.1s ease-out, filter 0.1s ease-out', // 滑らかに補間
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 手前にテキスト (Elegant Bokeh) を配置 */}
      {/* 
        ElegantBokehText は背景が黒くないと綺麗に発光しない性質があるため、
        文字の周りに「黒い半透明のテロップ用座布団（プレート）」を敷いて完全に視認性を確保します
      */}
      <div style={{ 
        transform: `scale(${scale})`, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px', 
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // しっかりとした黒い座布団
        border: '3px solid rgba(255, 215, 0, 0.4)', // ゴールドの枠線で装飾
        borderRadius: '30px', // 角丸
        padding: '40px 60px', // 文字周りの余白
        boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)', // 立体感のある影
        backdropFilter: 'blur(5px)', // 後ろの背景を少しぼかしてより文字を際立たせる
      }}>
        <StarburstCoreText text={line1} frame={frame} fontSize={80} />
        {line2 && <StarburstCoreText text={line2} frame={frame} fontSize={100} />}
      </div>
    </AbsoluteFill>
  );
};


// Scene 6: JOLロゴ表示 (680-739fr)
const Scene6_Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14 } });
  // 最初フェードイン・最後フェードアウト
  const opacity = interpolate(frame, [0, 10, 50, 60], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Img 
        src={staticFile('jol-logo-800.png')} 
        style={{ 
          width: 500, 
          objectFit: 'contain',
          opacity,
          transform: `scale(${scale})`
        }} 
      />
    </AbsoluteFill>
  );
};


// === Main Composition ===
export const JolBattleReservation: React.FC<Props> = (props) => {
  const frame = useCurrentFrame();

  // Push 3D Cube トランジション (164 - 170fr)
  const transStart = 164;
  const transDur = 6;
  const tProgress = Math.min(Math.max((frame - transStart) / transDur, 0), 1); // 0〜1の進行度
  
  // キューブのように回転させるための計算
  const scene1RotY = interpolate(tProgress, [0, 1], [0, -90]); // 左へ奥に回る
  const scene1X = interpolate(tProgress, [0, 1], [0, -100]); // 少し左に押し出す
  
  const scene2RotY = interpolate(tProgress, [0, 1], [90, 0]); // 右手前から正面に回る
  const scene2X = interpolate(tProgress, [0, 1], [100, 0]); // 少し右から入る

  const zDepth = interpolate(tProgress, [0, 0.5, 1], [0, -500, 0]); // 中心点で少し奥に引っ込む

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', perspective: '1200px' }}>
      {props.music && <Audio src={staticFile(props.music)} volume={0.5} />}

      <Sequence from={0} durationInFrames={90}>
        <SceneOpening themeColor={props.themeColor} />
      </Sequence>

      {/* Scene1: 170フレーム目まで表示するよう延長（トランジション重なり分） */}
      <Sequence from={90} durationInFrames={80}>
        <AbsoluteFill style={{ 
          transformOrigin: 'left center',
          transform: frame >= transStart ? `translateZ(${zDepth}px) translateX(${scene1X}px) rotateY(${scene1RotY}deg)` : 'none',
          opacity: frame > transStart + transDur ? 0 : 1
        }}>
          <Scene1_LiversIntro livers={props.livers} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene2: 164フレーム目から出現 */}
      <Sequence from={164} durationInFrames={151}>
        <AbsoluteFill style={{ 
          transformOrigin: 'right center',
          transform: frame <= transStart + transDur ? `translateZ(${zDepth}px) translateX(${scene2X}px) rotateY(${scene2RotY}deg)` : 'none',
        }}>
          <Scene2_TwoColumn livers={props.livers} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene3 と Scene4 共通の背景動画 (315 - 554fr) */}
      <Sequence from={315} durationInFrames={240}>
        <AbsoluteFill>
          <Video
            src={staticFile('assets/pixabay/videos/five-element-explosion.mp4')}
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover',
              // 爆発動画素材の右下等のロゴを隠すためにズーム
              transform: 'scale(1.1)'
            }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={315} durationInFrames={120}>
        <Scene3_GlitchText dateInfo={props.dateInfo} />
      </Sequence>

      <Sequence from={435} durationInFrames={120}>
        <Scene4_Rules rules={props.rules} />
      </Sequence>

      <Sequence from={555} durationInFrames={245}>
        <Scene5_Ending msg={props.finalMessage} themeColor={props.themeColor} livers={props.livers} />
      </Sequence>

      {/* ラスト2秒 (60fr) でJOLロゴ。シーン5が終わった800frから開始 */}
      <Sequence from={800} durationInFrames={60}>
        <Scene6_Logo />
      </Sequence>
    </AbsoluteFill>
  );
};
