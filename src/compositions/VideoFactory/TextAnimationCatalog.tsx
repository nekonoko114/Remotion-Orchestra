import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, staticFile, Audio } from 'remotion';
import { SliceSplitText, KineticText } from './components/BattleShared/BattleSharedComponents';
import { 
  TypewriterText, BlurRevealText, DropInText, WaveBounceText, 
  RotateInText, SwingInText, ZoomOutFadeText, TrackingInText, 
  ElasticPopText, WipeRightText, FlipUp3DText, RevealUpText, 
  GlitchRevealText, FloatingText, ImpactScaleText 
} from './components/BattleShared/TextAnimations';

// Placeholder standard effect for animations testing
export const SlideInText: React.FC<{ text: string; frame: number; fps: number }> = ({ text, frame, fps }) => {
  return (
    <div style={{
      fontSize: 150, fontWeight: 900, color: 'white',
      transform: `translateY(${frame < 15 ? 500 - (frame/15)*500 : 0}px)`,
      opacity: frame < 15 ? frame / 15 : 1,
    }}>
      {text}
    </div>
  );
};

export const TextAnimationCatalog: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Each animation will get 3 seconds (90 frames)
  const ITEM_DUR = 90;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      <Audio src={staticFile('assets/audio/music/Blastwave.mp3')} volume={0.3} />
      
      <AbsoluteFill style={{ padding: 60, justifyContent: 'flex-start' }}>
        <h1 style={{ color: 'white', fontSize: 60, fontFamily: 'sans-serif', textAlign: 'center', opacity: 0.5, borderBottom: '2px solid #333', paddingBottom: 20 }}>
          TEXT ANIMATION CATALOG
        </h1>
      </AbsoluteFill>

      {/* 1. Slide In */}
      <Sequence from={0} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>1. シンプルなスライドイン (Slide In)</div>
          <SlideInText text="TEXT ANIMATION" frame={frame} fps={fps} />
        </AbsoluteFill>
      </Sequence>

      {/* 2. Slice & Split */}
      <Sequence from={ITEM_DUR * 1} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>2. スライス＆スプリット (Slice & Split)</div>
          <SliceSplitText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 1} fps={fps} fontSize={150} color="white" glowColor="#ff0055" />
        </AbsoluteFill>
      </Sequence>

      {/* 3. Kinetic Fade */}
      <Sequence from={ITEM_DUR * 2} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>3. 1文字ずつフェードイン (Kinetic Fade)</div>
          <KineticText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 2} fps={fps} fontSize={150} color="white" glowColor="#00ffcc" animationType="fade" stagger={2} splitBy="character" />
        </AbsoluteFill>
      </Sequence>

      {/* 4. Kinetic Pop */}
      <Sequence from={ITEM_DUR * 3} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>4. 1文字ずつポップ (Kinetic Pop)</div>
          <KineticText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 3} fps={fps} fontSize={150} color="white" glowColor="#ffaa00" animationType="kinetic" stagger={2} splitBy="character" />
        </AbsoluteFill>
      </Sequence>

      {/* 5. Typewriter */}
      <Sequence from={ITEM_DUR * 4} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>5. タイプライター (Typewriter)</div>
          <TypewriterText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 4} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 6. Blur Reveal */}
      <Sequence from={ITEM_DUR * 5} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>6. ボケからくっきり (Blur Reveal)</div>
          <BlurRevealText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 5} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 7. Drop In */}
      <Sequence from={ITEM_DUR * 6} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>7. 上から落ちてくる (Drop In)</div>
          <DropInText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 6} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 8. Wave Bounce */}
      <Sequence from={ITEM_DUR * 7} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>8. ウェーブジャンプ (Wave Bounce)</div>
          <WaveBounceText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 7} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 9. Rotate In */}
      <Sequence from={ITEM_DUR * 8} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>9. 回転しながら出現 (Rotate In)</div>
          <RotateInText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 8} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 10. Swing In */}
      <Sequence from={ITEM_DUR * 9} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>10. 振り子 (Swing In)</div>
          <SwingInText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 9} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 11. Zoom Out Fade */}
      <Sequence from={ITEM_DUR * 10} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>11. 巨大から縮小 (Zoom Out Fade)</div>
          <ZoomOutFadeText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 10} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 12. Tracking In */}
      <Sequence from={ITEM_DUR * 11} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>12. 文字間隔が縮まる (Tracking In)</div>
          <TrackingInText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 11} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 13. Elastic Pop */}
      <Sequence from={ITEM_DUR * 12} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>13. ガチョーンと拡大 (Elastic Pop)</div>
          <ElasticPopText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 12} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 14. Wipe Right */}
      <Sequence from={ITEM_DUR * 13} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>14. 左から右へワイプ (Wipe Right)</div>
          <WipeRightText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 13} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 15. 3D Flip Up */}
      <Sequence from={ITEM_DUR * 14} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>15. 下から起き上がる (3D Flip Up)</div>
          <FlipUp3DText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 14} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 16. Reveal Up */}
      <Sequence from={ITEM_DUR * 15} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>16. マスク下から出現 (Reveal Up)</div>
          <RevealUpText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 15} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 17. Glitch Reveal */}
      <Sequence from={ITEM_DUR * 16} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>17. ノイズ出現 (Glitch Reveal)</div>
          <GlitchRevealText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 16} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 18. Floating */}
      <Sequence from={ITEM_DUR * 17} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>18. ふわふわ漂う (Floating)</div>
          <FloatingText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 17} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

      {/* 19. Impact Scale */}
      <Sequence from={ITEM_DUR * 18} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'cyan', fontSize: 40 }}>19. ドカンと着地 (Impact Scale)</div>
          <ImpactScaleText text="TEXT ANIMATION" frame={frame - ITEM_DUR * 18} fps={fps} fontSize={150} color="white" />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
