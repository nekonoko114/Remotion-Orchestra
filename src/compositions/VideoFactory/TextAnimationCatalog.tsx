import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, staticFile, Audio } from 'remotion';
import { SliceSplitText, KineticText } from './components/BattleShared/BattleSharedComponents';
import { 
  TypewriterText, BlurRevealText, DropInText, WaveBounceText, 
  RotateInText, SwingInText, ZoomOutFadeText, TrackingInText, 
  ElasticPopText, WipeRightText, FlipUp3DText, RevealUpText, 
  GlitchRevealText, FloatingText, ImpactScaleText,
  KineticSmashText, BlurStrobeText, LetterJumbleText, BoxSlideRevealText,
  TumblingLettersText, VibrateShakeText, TextEchoTrailText, HorizontalStretchText,
  CinematicSlowRevealText, BounceStompText,
  GlitchSliceText, NeonPulseText, RandomRevealBoxText, SwirlInText, CameraShakeText,
  WavyTypewriterText, DecodeScrambleText, BacklightSweepText, FlipFlopText, ElasticSkewText
} from './components/BattleShared/TextAnimations';

// Placeholder standard effect for animations testing
export const SlideInText: React.FC<{ text: string; frame: number; fps: number }> = ({ text, frame, fps }) => {
  return (
    <div style={{
      fontSize: 100, fontWeight: 900, color: 'white',
      transform: `translateY(${frame < 15 ? 100 - (frame/15)*100 : 0}px)`,
      opacity: frame < 15 ? frame / 15 : 1,
    }}>
      {text}
    </div>
  );
};

// Define all animations in an array for easy mapping
const allAnimations = [
  { label: 'スライドイン (Slide In)', Component: (props: any) => <SlideInText {...props} /> },
  { label: 'スライス＆スプリット (Slice & Split)', Component: (props: any) => <SliceSplitText {...props} /> },
  { label: 'フェードイン (Kinetic Fade)', Component: (props: any) => <KineticText {...props} animationType="fade" stagger={2} splitBy="character" /> },
  { label: 'ポップイン (Kinetic Pop)', Component: (props: any) => <KineticText {...props} animationType="kinetic" stagger={2} splitBy="character" /> },
  { label: 'タイプライター (Typewriter)', Component: (props: any) => <TypewriterText {...props} /> },
  { label: 'ボケからくっきり (Blur Reveal)', Component: (props: any) => <BlurRevealText {...props} /> },
  { label: '上から落ちてくる (Drop In)', Component: (props: any) => <DropInText {...props} /> },
  { label: 'ウェーブジャンプ (Wave Bounce)', Component: (props: any) => <WaveBounceText {...props} /> },
  { label: '回転しながら出現 (Rotate In)', Component: (props: any) => <RotateInText {...props} /> },
  { label: '振り子 (Swing In)', Component: (props: any) => <SwingInText {...props} /> },
  { label: '巨大から縮小 (Zoom Out Fade)', Component: (props: any) => <ZoomOutFadeText {...props} /> },
  { label: '文字間隔が縮まる (Tracking In)', Component: (props: any) => <TrackingInText {...props} /> },
  { label: 'ガチョーンと拡大 (Elastic Pop)', Component: (props: any) => <ElasticPopText {...props} /> },
  { label: '左から右へワイプ (Wipe Right)', Component: (props: any) => <WipeRightText {...props} /> },
  { label: '下から起き上がる (3D Flip Up)', Component: (props: any) => <FlipUp3DText {...props} /> },
  { label: 'マスク下から出現 (Reveal Up)', Component: (props: any) => <RevealUpText {...props} /> },
  { label: 'ノイズ出現 (Glitch Reveal)', Component: (props: any) => <GlitchRevealText {...props} /> },
  { label: 'ふわふわ漂う (Floating)', Component: (props: any) => <FloatingText {...props} /> },
  { label: 'ドカンと着地 (Impact Scale)', Component: (props: any) => <ImpactScaleText {...props} /> },
  { label: '衝撃波ズーム (Kinetic Smash)', Component: (props: any) => <KineticSmashText {...props} /> },
  { label: 'フラッシュ＆ボケ (Blur Strobe)', Component: (props: any) => <BlurStrobeText {...props} /> },
  { label: 'ランダム文字変化 (Letter Jumble)', Component: (props: any) => <LetterJumbleText {...props} /> },
  { label: 'ブロック隠し出現 (Box Slide Reveal)', Component: (props: any) => <BoxSlideRevealText {...props} /> },
  { label: 'スピンフォール (Tumbling Letters)', Component: (props: any) => <TumblingLettersText {...props} /> },
  { label: 'ビート振動 (Vibrate Shake)', Component: (props: any) => <VibrateShakeText {...props} /> },
  { label: '残像エコー (Text Echo Trail)', Component: (props: any) => <TextEchoTrailText {...props} /> },
  { label: '横ストレッチ (Horizontal Stretch)', Component: (props: any) => <HorizontalStretchText {...props} /> },
  { label: 'シネマティックフェード (Cinematic Fade)', Component: (props: any) => <CinematicSlowRevealText {...props} /> },
  { label: 'バウンスストンプ (Bounce Stomp)', Component: (props: any) => <BounceStompText {...props} /> },
  { label: 'グリッチスライス (Glitch Slice)', Component: (props: any) => <GlitchSliceText {...props} /> },
  { label: 'ネオンパルス (Neon Pulse)', Component: (props: any) => <NeonPulseText {...props} /> },
  { label: 'ランダムブロック出現 (Random Box)', Component: (props: any) => <RandomRevealBoxText {...props} /> },
  { label: 'スピンオービット (Swirl In)', Component: (props: any) => <SwirlInText {...props} /> },
  { label: 'カメラ破壊シェイク (Camera Shake)', Component: (props: any) => <CameraShakeText {...props} /> },
  { label: 'バウンドタイプ (Wavy Typewriter)', Component: (props: any) => <WavyTypewriterText {...props} /> },
  { label: '暗号解読 (Decode Scramble)', Component: (props: any) => <DecodeScrambleText {...props} /> },
  { label: 'リフレクション光 (Backlight Sweep)', Component: (props: any) => <BacklightSweepText {...props} /> },
  { label: 'パタパタ反転 (Flip Flop)', Component: (props: any) => <FlipFlopText {...props} /> },
  { label: 'スキューバネ (Elastic Skew)', Component: (props: any) => <ElasticSkewText {...props} /> },
];

export const TextAnimationCatalog: React.FC = () => {
  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Each page will get 3 seconds (90 frames)
  const ITEM_DUR = 90;
  const ITEMS_PER_PAGE = 4;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      <Audio src={staticFile('assets/audio/music/Blastwave.mp3')} volume={0.3} />
      
      {/* Title */}
      <AbsoluteFill style={{ padding: 40, justifyContent: 'flex-start' }}>
        <h1 style={{ color: 'white', fontSize: 50, fontFamily: 'sans-serif', textAlign: 'center', opacity: 0.5, borderBottom: '2px solid #333', paddingBottom: 20 }}>
          TEXT ANIMATION CATALOG ({allAnimations.length} TYPES)
        </h1>
      </AbsoluteFill>

      {/* Pages generation */}
      {allAnimations.map((anim, index) => {
        const pageIndex = Math.floor(index / ITEMS_PER_PAGE);
        const positionIndex = index % ITEMS_PER_PAGE;
        
        // Offset Y for 4 items vertically
        // positions: 0 -> 250, 1 -> 650, 2 -> 1050, 3 -> 1450
        const yPos = 250 + positionIndex * 400;

        return (
          <Sequence key={index} from={pageIndex * ITEM_DUR} durationInFrames={ITEM_DUR}>
            <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: yPos }}>
              <div style={{ position: 'absolute', top: yPos - 80, color: 'cyan', fontSize: 30, opacity: 0.8, fontWeight: 700, letterSpacing: 2 }}>
                {index + 1}. {anim.label}
              </div>
              <anim.Component 
                text="TEXT ANIMATION" 
                frame={frame - pageIndex * ITEM_DUR} 
                fps={fps} 
                fontSize={100} 
                color="white" 
                glowColor={index % 2 === 0 ? '#ff00ff' : '#00ffcc'} // Alternate glow color for variety
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

    </AbsoluteFill>
  );
};
