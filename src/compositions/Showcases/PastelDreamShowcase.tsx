import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  spring,
  Img,
} from 'remotion';
import { PastelBackground } from '../../components/backgrounds/PastelBackground';
import { HeartBubbles } from '../../components/effects/HeartBubbles';
import { z } from 'zod';
import { useBeatValue } from '../../utils/beat-sync';
import { GachiBattleMorph } from '../../components/effects/GachiBattleMorph';

// --- Mocks ---
export const playerSchema = z.object({
  name: z.string(),
  image: z.string(),
  color: z.string(),
});

export const pastelDreamSchema = z.object({
  player1: playerSchema,
  player2: playerSchema,
  player3: playerSchema,
  tatan: playerSchema,
  musicStartSec: z.number().default(60),
});

export type PastelDreamProps = z.infer<typeof pastelDreamSchema>;

export const defaultPastelDreamProps: PastelDreamProps = {
  player1: {
    name: '🌸さくら🌸',
    image: 'assets/images-01/l5332541.jpeg',
    color: '#FFB6C1',
  },
  player2: {
    name: '🌸さくら🌸',
    image: 'assets/images-01/l5332541-01.png',
    color: '#FFB6C1',
  },
  player3: {
    name: '🌸さくら🌸',
    image: 'assets/images-01/l5332541-02.png',
    color: '#FFB6C1',
  },
  tatan: {
    name: 'たー𝕥𝕒𝕟🏡☀️',
    image: 'assets/images-01/ta-tan.png',
    color: '#87CEEB',
  },
  musicStartSec: 60,
};

// --- White Flash Transition ---
const WhiteFlash: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  // 期間の半分で真っ白(1)になり、その後消える(0)
  const opacity = interpolate(
    frame,
    [0, duration / 2, duration],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'white', opacity, zIndex: 1000, pointerEvents: 'none' }} />
  );
};

// --- Profile Card (No Battle VS) ---
const ProfileCard: React.FC<{ player: z.infer<typeof playerSchema>; frame: number; pulse: number; isVsScene?: boolean; skipEntryAnim?: boolean }> = ({ player, frame, pulse, isVsScene = false, skipEntryAnim = false }) => {
  const { fps } = useVideoConfig();
  // 登場時の3Dフリップアニメーション (VSシーンや連続表示の場合は最初から完了状態にする)
  const entry = (isVsScene || skipEntryAnim) ? 1 : spring({ frame, fps, config: { stiffness: 80, damping: 12 } });
  const rotateY = interpolate(entry, [0, 1], [-90, 0]);
  
  // 音楽のビートに合わせたパルス（鼓動）と浮遊感
  const floatY = Math.sin(frame / 15) * 20;
  const beatScale = 1 + pulse * 0.05; // ドクンとする動き

  // 光が走るエフェクト (Shimmer)
  const shimmerProgress = (frame % 60) / 60; // 1秒ごとに光が走る

  return (
    <div
      style={{
        transform: `perspective(1000px) scale(${entry * beatScale}) translateY(${floatY}px) rotateY(${rotateY}deg)`,
        opacity: interpolate(entry, [0, 0.5, 1], [0, 1, 1]),
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: `drop-shadow(0 10px ${20 + pulse * 30}px ${player.color}88)`, // 影と光
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: 650 * (1 + pulse * 0.02),  // 500 -> 650
          height: 845 * (1 + pulse * 0.02), // 650 -> 845 (1.3倍)
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: 60,
          border: `15px solid ${player.color}`, // 枠線も少し太く
          boxShadow: `0 20px 50px rgba(0,0,0,0.1), inset 0 0 30px white`,
          overflow: 'hidden',
          position: 'relative',
          padding: 20,
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: 40, overflow: 'hidden', position: 'relative' }}>
          <Img src={staticFile(player.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Shimmer Effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              transform: `translateX(${shimmerProgress * 400}%) skewX(-20deg)`,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: -50, // カードが大きくなったので食い込みも少し深く
          background: 'white',
          padding: '20px 60px', // テキスト枠も少し大きく
          borderRadius: 60,
          color: player.color,
          fontSize: 60, // フォントサイズも 45 -> 60 に拡大
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          border: `8px solid ${player.color}`,
          zIndex: 10,
        }}
      >
        {player.name}
      </div>
    </div>
  );
};

// --- Clone Profile Card (分身演出) ---
const CloneProfileCard: React.FC<{ 
  player1: z.infer<typeof playerSchema>; 
  player2: z.infer<typeof playerSchema>; 
  player3: z.infer<typeof playerSchema>; 
  frame: number; 
  pulse: number; 
  duration: number; // このコンポーネント全体が表示される期間
}> = ({ player1, player2, player3, frame, pulse, duration }) => {
  const { fps } = useVideoConfig();

  // 1. 登場 (0〜1秒) : 中央に1枚ある状態から始まる (player1ベース)
  // 2. 分身 (1〜2秒) : 左右に2枚がスライドして飛び出す
  // 3. 維持 (2〜N-1秒) : 3枚が並んでいる状態
  // 4. 重なる (最後1秒) : 再び中央にシュッとまとまる

  const splitStart = fps * 1; // 1秒後から分身開始
  const splitEnd = fps * 2;   // 2秒後には分身完了
  const mergeStart = duration - fps * 1; // 終了の1秒前から重なる開始

  // スライド量のアニメーション (0 = 中央, 1 = 完全に横に離れた状態)
  const cloneSlide = interpolate(
    frame,
    [splitStart, splitEnd, mergeStart, duration],
    [0, 1, 1, 0], // 0 -> 1 (分身) -> 1 (維持) -> 0 (重なる)
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 左右のカードの不透明度 (最初は見えない、分身と同時に現れる)
  const cloneOpacity = interpolate(
    frame,
    [splitStart, splitStart + 10, mergeStart, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const spreadDistance = 600; // 横に広がる距離
  const depthDistance = 200; // 奥・手前の移動量

  // 1フレームに回る角度（度）をラジアンに変換
  const orbitAngleDeg = (frame - splitStart) * 1.5;
  const orbitAngleRad = (orbitAngleDeg * Math.PI) / 180;

  // 分身1（player2）の位置とスケール
  const x1 = Math.cos(orbitAngleRad) * spreadDistance;
  const z1 = Math.sin(orbitAngleRad) * depthDistance;
  const scale1 = 1 + (z1 / depthDistance) * 0.3; // z1がプラス(手前)なら大きく、マイナス(奥)なら小さく
  const zIndex1 = z1 > 0 ? 20 : 0; // 手前にあるなら中央より前面、奥なら背面

  // 分身2（player3）の位置とスケール（分身1の180度反対）
  const orbitAngleRad2 = orbitAngleRad + Math.PI;
  const x2 = Math.cos(orbitAngleRad2) * spreadDistance;
  const z2 = Math.sin(orbitAngleRad2) * depthDistance;
  const scale2 = 1 + (z2 / depthDistance) * 0.3;
  const zIndex2 = z2 > 0 ? 20 : 0;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      
      {/* 分身1 (player2) */}
      <div style={{ 
        position: 'absolute', 
        transform: `translateX(${x1 * cloneSlide}px) scale(${(scale1 * cloneSlide) + (1 - cloneSlide)})`,
        opacity: cloneOpacity,
        zIndex: zIndex1
      }}>
        <ProfileCard player={player2} frame={frame} pulse={pulse} skipEntryAnim />
      </div>

      {/* 分身2 (player3) */}
      <div style={{ 
        position: 'absolute', 
        transform: `translateX(${x2 * cloneSlide}px) scale(${(scale2 * cloneSlide) + (1 - cloneSlide)})`,
        opacity: cloneOpacity,
        zIndex: zIndex2
      }}>
        <ProfileCard player={player3} frame={frame} pulse={pulse} skipEntryAnim />
      </div>

      {/* 中央の本体 (player1) */}
      <div style={{ position: 'absolute', zIndex: 10 }}>
        {/* フレームが後半の時は画像をplayer1からplayer3のように切り替えるなどの工夫も可能ですが、まずはplayer1固定で */}
        <ProfileCard player={player1} frame={frame} pulse={pulse} />
      </div>

    </AbsoluteFill>
  );
};

// --- Main Composition ---
export const PastelDreamShowcase: React.FC<PastelDreamProps> = ({ player1, player2, player3, tatan, musicStartSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 音楽に関する設定（BPMとサビ出し時間）
  // ユーザーの要望により、BPMを1/8にする（よりゆったりとした鼓動にする）
  const BPM = 120 / 8; // ゆったりとした脈打ち
  const START_OFFSET_FRAMES = musicStartSec * fps;
  const { pulse } = useBeatValue(BPM, START_OFFSET_FRAMES);

  // シーンの時間配分
  // シーンの時間配分
  const OP_DUR = 2 * fps;      // オープニング「ガチバトル」 2秒
  const DATE_DUR = 2 * fps;    // 日時表示 2秒
  const INTRO_A_DUR = 3 * fps; // さくら 1枚目 3秒
  const INTRO_B_DUR = 3 * fps; // さくら 2枚目 3秒
  const INTRO_C_DUR = 3 * fps; // さくら 3枚目 3秒
  const MSG_DUR = 1.5 * fps;   // 「対戦相手は！」 1.5秒
  const TATAN_INTRO_DUR = 3 * fps; // たーたん個別紹介 3秒
  const VS_DUR = 4 * fps;      // VSショット 4秒
  const RULE_DUR = 3 * fps;    // ルール表示 3秒
  const ENDING_DUR = 5 * fps;  // エンディング 5秒



  // 完璧なシームレス遷移のためのフレーム計算
  const startOp = 0;
  const startDate = startOp + OP_DUR;
  const startA = startDate + DATE_DUR;
  const startB = startA + INTRO_A_DUR;
  const startC = startB + INTRO_B_DUR;
  const startOpponentMsg = startC + INTRO_C_DUR;
  const startTatanIntro = startOpponentMsg + MSG_DUR;
  const startVS = startTatanIntro + TATAN_INTRO_DUR;
  const startRule = startVS + VS_DUR;
  const startEnding = startRule + RULE_DUR;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFF0F5', overflow: 'hidden' }}>
      <PastelBackground />
      {/* 奥レイヤー: 大きなハートと星 */}
      <HeartBubbles count={30} layer="back" />
      {/* 手前レイヤー（テキストよりは背面へ移動） */}
      <HeartBubbles count={15} layer="front" />

      {/* 音楽 */}
      <Audio
        src={staticFile('assets/audio/music/冷蔵庫のメモ.mp3')}
        volume={0.6}
        loop
        startFrom={START_OFFSET_FRAMES}
      />

      {/* 1. オープニング (ガチバトル) */}
      <Sequence from={startOp} durationInFrames={startDate - startOp}>
        <GachiBattleMorph pulse={pulse} />
      </Sequence>

      {/* 2. 開催日時 */}
      <Sequence from={startDate} durationInFrames={startA - startDate}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              fontSize: 210,
              fontWeight: 900,
              color: '#FF1493',
              textAlign: 'center',
              marginBottom: 40,
              textShadow: '0 10px 30px rgba(255, 20, 147, 0.4), 4px 4px 0 white, -4px -4px 0 white, 4px -4px 0 white, -4px 4px 0 white',
              fontFamily: '"Zen Maru Gothic", sans-serif',
              transform: `scale(${spring({ frame: frame - startDate, fps, config: { stiffness: 100 } })})`,
            }}
          >
            3月14日<br/>
            SATURDAY
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #FF69B4, #FF1493)',
              color: 'white',
              padding: '30px 80px',
              borderRadius: 80,
              fontSize: 150,
              fontWeight: 'bold',
              fontFamily: '"Zen Maru Gothic", sans-serif',
              boxShadow: '0 20px 40px rgba(255, 20, 147, 0.5), inset 0 10px 20px rgba(255,255,255,0.3)',
              transform: `rotate(${Math.sin((frame - startDate) / 10) * 5}deg) scale(${spring({ frame: frame - startDate - 10, fps }) * (1 + pulse * 0.1)})`,
            }}
          >
            <span style={{ fontSize: 90, marginRight: 20 }}>🕒</span>
            22:30〜
          </div>
        </AbsoluteFill>
      </Sequence>
      {/* 2〜4. プロフィール紹介 (Sakura 1〜3) : 3体に分身する演出 */}
      <Sequence from={startA} durationInFrames={startOpponentMsg - startA}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CloneProfileCard 
            player1={player1} 
            player2={player2} 
            player3={player3} 
            frame={frame - startA} 
            pulse={pulse}
            duration={startOpponentMsg - startA}
          />
        </AbsoluteFill>
      </Sequence>

      {/* === ホワイトフラッシュ トランジション === */}
      <Sequence from={startOpponentMsg - 10} durationInFrames={20}>
        <WhiteFlash frame={frame - (startOpponentMsg - 10)} duration={20} />
      </Sequence>

      {/* 【NEW】対戦相手告知メッセージ */}
      <Sequence from={startOpponentMsg} durationInFrames={startTatanIntro - startOpponentMsg}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            fontSize: 120,
            color: 'white',
            fontWeight: 900,
            textShadow: '0 0 20px rgba(0,0,0,0.5), 5px 5px 0 #FF1493',
            textAlign: 'center',
            transform: `scale(${spring({ frame: frame - startOpponentMsg, fps, config: { stiffness: 200 } }) * (1 + pulse * 0.2)})`,
          }}>
            対戦相手は！
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 【NEW】たーたん個別紹介 */}
      <Sequence from={startTatanIntro} durationInFrames={startVS - startTatanIntro}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ProfileCard player={tatan} frame={frame - startTatanIntro} pulse={pulse} />
        </AbsoluteFill>
      </Sequence>

      {/* 5. VSショット (さくら vs たーたん) */}
      <Sequence from={startVS} durationInFrames={startRule - startVS}>
        {/* VS用フラッシュ演出 */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
           <div
             style={{
               width: 2000,
               height: 2000,
               background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,100,100,0.4) 20%, rgba(100,100,255,0.4) 40%, transparent 80%)',
               transform: `scale(${spring({ frame: frame - startVS, fps, config: { damping: 200 } }) * (1 + pulse * 0.2)})`,
               opacity: interpolate(frame - startVS, [0, 30, 60], [1, 0.5, 0]),
               mixBlendMode: 'screen',
             }}
           />
        </AbsoluteFill>
        
        <AbsoluteFill>
          {/* 左上 (さくら) */}
          <div style={{ position: 'absolute', top: -30, left: -20, transform: `scale(0.9) rotate(-5deg) translateY(${Math.sin(frame / 15) * 40}px)`, zIndex: 10 }}>
            <ProfileCard player={player3} frame={frame - startVS} pulse={pulse} isVsScene />
          </div>
          {/* 右下 (たーたん) */}
          <div style={{ position: 'absolute', bottom: -30, right: -20, transform: `scale(0.9) rotate(5deg) translateY(${Math.cos((frame + 10) / 15) * 40}px)`, zIndex: 10 }}>
            <ProfileCard player={tatan} frame={frame - startVS + 10} pulse={pulse} isVsScene />
          </div>
        </AbsoluteFill>

        {/* 稲妻/スプリット */}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', mixBlendMode: 'screen' }}>
            <div
              style={{
                width: 20,
                height: '150%',
                background: 'linear-gradient(to bottom, #FF69B4, white, #87CEEB)',
                transform: `rotate(15deg) scaleY(${spring({ frame: frame - startVS, fps, delay: 10, config: { stiffness: 50} })})`,
                boxShadow: '0 0 50px 20px white',
                opacity: 0.8,
              }}
            />
        </AbsoluteFill>

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 200 }}>
           <div
             style={{
               fontSize: 250,
               fontWeight: 'bold',
               color: 'white',
               fontStyle: 'italic',
               textShadow: '0 0 50px #FF0000, 5px 5px 0px #000',
               transform: `scale(${spring({ frame: frame - startVS, fps, delay: 15, config: { stiffness: 200, damping: 10 } }) * (1 + pulse * 0.3)}) rotate(-10deg)`,
             }}
           >
             VS
           </div>
        </AbsoluteFill>
      </Sequence>

      {/* 6. バトルルール */}
      <Sequence from={startRule} durationInFrames={startEnding - startRule}>
         <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,182,193,0.3)', zIndex: 100 }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              padding: '60px 80px', 
              borderRadius: 60, 
              border: '8px solid #FFB6C1',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              textAlign: 'center',
              width: '85%',
              transform: `scale(${spring({ frame: frame - startRule, fps })})`
            }}>
              <h2 style={{ fontSize: 110, color: '#FF1493', marginBottom: 40, fontWeight: 900 }}>予約バトル⚔️</h2>
              <div style={{ fontSize: 54, color: '#444', lineHeight: 1.4, fontWeight: 'bold' }}>
                <p>半年ぶりの予約バトル⚔️<br/>全員集合してね🥹</p>
                <hr style={{ border: 'none', borderTop: '4px dashed #FFB6C1', margin: '30px 0' }} />
                <p style={{ color: '#FF69B4', fontSize: 70 }}>【ルール】</p>
                <p>・グローブ 2個</p>
                <p>・その他のアイテム無し</p>
                <p>・スピチャ無しでも続行</p>
              </div>
            </div>
         </AbsoluteFill>
      </Sequence>

      {/* 7. エンディング (サプライズ) */}
      <Sequence from={startEnding} durationInFrames={ENDING_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF0F5', zIndex: 100 }}>
           <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 120, marginBottom: 40 }}>🎁</div>
              <h2 style={{ 
                fontSize: 120, 
                color: '#FF1493', 
                fontWeight: 900,
                lineHeight: 1.4,
                transform: `scale(${1 + pulse * 0.1})`
              }}>
                TOP5までは、<br/>後日🌸さくら🌸から<br/>サプライズ🎁
              </h2>
           </div>
        </AbsoluteFill>
      </Sequence>

      {/* 画面奥側のフラッシュ装飾 */}
      <AbsoluteFill style={{ pointerEvents: 'none', background: 'white', opacity: Math.max(0, 1 - frame / 15) }} />
    </AbsoluteFill>
  );
};
