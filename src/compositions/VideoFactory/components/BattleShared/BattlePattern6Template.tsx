import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, OffthreadVideo, Img, random } from 'remotion';
import { GlobalFrameThemed, SparkleEffect, Particle, KineticText, MagicCircle, SliceSplitText, BurningLightningText } from './BattleSharedComponents';
import { BattleSpiritTheme } from './types';
import { SceneDate } from './scenes/SceneDate';
import { SceneVs } from './scenes/SceneVs';

const DiagonalLightningStorm: React.FC<{ frame: number }> = ({ frame }) => {
  // Rotate diagonally and scale up to avoid empty corners
  // Change hue every 30 frames (1 second)
  const currentSecond = Math.floor(frame / 30);
  const hueValue = 180 + (currentSecond * 70); // Starts at cyan (180), shifts every second

  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', alignItems: 'center', pointerEvents: 'none',
      transform: 'rotate(-15deg) scale(1.5)'
    }}>
      <OffthreadVideo 
        src={staticFile('assets/pixabay/videos/lightning-holizon.mp4')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          mixBlendMode: 'screen',
          filter: `hue-rotate(${hueValue}deg) saturate(1.8) contrast(1.3)`,
          opacity: 0.8
        }}
        muted
        // Use standard video loop if it exceeds duration
      />
    </AbsoluteFill>
  );
};

// Custom Opening for Pattern 6
const SceneOpeningPattern6: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Background Continuous Lightning */}
      <DiagonalLightningStorm frame={frame} />

      {/* First Text: ガチバトル (20fr~) */}
      {frame >= 20 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
           <div style={{ transform: `translateY(-150px) rotate(-8deg)`, zIndex: 10 }}>
             <BurningLightningText text="ガチバトル" frame={frame - 20} fontSize={220} />
           </div>
        </AbsoluteFill>
      )}

      {/* Second Text: 準備はいいか‼️ (60fr~) */}
      {frame >= 60 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
           <div style={{ transform: `translateY(100px) rotate(5deg)`, zIndex: 10 }}>
             <BurningLightningText text="準備はいいか‼️" frame={frame - 60} fontSize={160} />
           </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// --- Pattern 6 Custom Date Effects ---

const EldritchMagicCircle: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a001a', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
      <OffthreadVideo 
        src={staticFile('assets/pixabay/videos/circle-stoken.mp4')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          mixBlendMode: 'screen',
          filter: 'hue-rotate(-90deg) blur(1px) brightness(1.5)',
          opacity: 0.95
        }}
        muted
      />
    </AbsoluteFill>
  );
};

const BulgeStartText: React.FC<{ frame: number; text1: string; text2: string; color: string; glowColor: string }> = ({ frame, text1, text2, color, glowColor }) => {
  if (frame < 0) return null;
  const p1 = spring({ frame, fps: 30, config: { damping: 10 } });
  const p2 = spring({ frame: frame - 15, fps: 30, config: { damping: 10 } });
  const blur1 = interpolate(p1, [0, 1], [20, 0]);
  const blur2 = interpolate(p2, [0, 1], [20, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 500 }}>
      <svg width="0" height="0">
        <filter id="bulge-text-1">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={(1-p1)*100} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="bulge-text-2">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={(1-p2)*100} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {frame >= 0 && (
        <div style={{ filter: `url(#bulge-text-1) blur(${blur1}px)`, transform: `scale(${interpolate(p1, [0, 1], [2, 1])}) rotate(-10deg) translateY(-80px)`, position: 'absolute' }}>
          <h1 style={{ fontSize: 200, color, fontWeight: 900, textShadow: `0 0 40px ${glowColor}`, margin: 0, WebkitTextStroke: '8px black' }}>{text1}</h1>
        </div>
      )}
      {frame >= 15 && (
        <div style={{ filter: `url(#bulge-text-2) blur(${blur2}px)`, transform: `scale(${interpolate(p2, [0, 1], [3, 1.2])}) rotate(-5deg) translateY(120px)`, position: 'absolute' }}>
          <h1 style={{ fontSize: 220, color, fontWeight: 900, textShadow: `0 0 50px ${glowColor}`, margin: 0, WebkitTextStroke: '10px black' }}>{text2}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SceneDatePattern6: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Background */}
      <EldritchMagicCircle frame={frame} />
      
      {/* Date Information - First 4 seconds (120 frames) */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: interpolate(frame, [100, 120], [1, 0]) }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
           <SliceSplitText text="2026.03.20" frame={frame} fps={fps} color="white" glowColor="#ff0055" fontSize={120} />
           <SliceSplitText text="19:00 JST" frame={frame - 15} fps={fps} color="white" glowColor="#ffaa00" fontSize={100} />
        </div>
      </AbsoluteFill>

      {/* BATTLE START!! - Last 4 seconds (from frame 120 to 240) */}
      {frame > 120 && (
        <BulgeStartText frame={frame - 120} text1="BATTLE" text2="START!!" color="white" glowColor="#00ffcc" />
      )}
    </AbsoluteFill>
  );
};

// Helper for Star explosion effect
const StarExplosion: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  if (frame < 0 || frame > 60) return null;
  const p = spring({ frame, fps: 30, config: { damping: 100, mass: 1 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
      {new Array(12).fill(0).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = interpolate(p, [0, 1], [0, 800]);
        return (
          <div key={i} style={{
            position: 'absolute',
            width: 40, height: 40,
            backgroundColor: color,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(${1 - p*0.5}) rotate(${frame * 5}deg)`,
            opacity: interpolate(p, [0.8, 1], [1, 0])
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// SceneRule: ルール説明シーン (5S = 150fr)
const SceneRule: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 200, damping: 15 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050f1a', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'radial-gradient(circle, transparent 20%, #000 100%)' }} />
      <SparkleEffect frame={frame} count={50} color="#fff" glowColor={theme.glowColor} />
      
      <div style={{ transform: `rotate(-5deg)`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 }}>
        <SliceSplitText text="BATTLE RULES" frame={frame} fps={fps} fontSize={120} color="white" glowColor={theme.glowColor} />
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px 60px', borderRadius: 40, border: `4px solid ${theme.themeColor}` }}>
          <SliceSplitText text="ルール１：全力で応援！" frame={frame - 15} fps={fps} fontSize={70} color="white" glowColor={theme.themeColor} />
          <div style={{ height: 20 }} />
          <SliceSplitText text="ルール２：アイテム連打！" frame={frame - 30} fps={fps} fontSize={70} color="white" glowColor={theme.themeColor} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// LineBar: バトル用の縦型ゲージ
const LineBar: React.FC<{ progress: number; color: string; glow: string; side: 'left' | 'right' }> = ({ progress, color, glow, side }) => {
  return (
    <div style={{
      position: 'absolute',
      [side]: 40,
      bottom: 250,
      width: 40,
      height: 1400,
      backgroundColor: 'rgba(0,0,0,0.6)',
      border: `4px solid ${color}`,
      boxShadow: `0 0 20px ${glow}, inset 0 0 10px ${color}`,
      borderRadius: 20,
      overflow: 'hidden',
      zIndex: 5, // Behind the characters so it doesn't block their faces
      transform: 'skewY(-15deg)'
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: `${progress * 100}%`,
        backgroundColor: color,
        boxShadow: `0 0 30px ${glow}, 0 0 15px white`,
        transition: 'height 0.1s linear'
      }} />
    </div>
  );
};

// SceneMessage: 最後のメッセージシーン (10S = 300fr相当 -> 360frに変更)
const SceneMessage: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Phase 1 opacity (0 to 60fr)
  const textOpacity = interpolate(frame, [50, 60], [1, 0], { extrapolateRight: 'clamp' });
  
  // Phase 2: From 60fr onwards
  const faceOffEntry = spring({ frame: frame - 60, fps, config: { damping: 14 } });
  
  // Animated line bars progressing rapidly
  const liverProgress = interpolate(spring({ frame: frame - 70, fps, config: { damping: 20 } }), [0, 1], [0, 0.85]);
  const oppProgress = interpolate(spring({ frame: frame - 75, fps, config: { damping: 20 } }), [0, 1], [0, 0.75]);

  // Aggressive wiggle for images
  const seed = Math.floor(frame / 2);
  const wiggleX = frame >= 60 ? interpolate(random(`wx-${seed}`), [0, 1], [-25, 25]) : 0;
  const wiggleY = frame >= 60 ? interpolate(random(`wy-${seed}`), [0, 1], [-25, 25]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#020005', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <StarExplosion frame={frame} color={theme.glowColor} />
      {new Array(40).fill(0).map((_, i) => (
        <Particle key={i} seed={i} frame={frame} color="#fce4ec" direction="up" />
      ))}
      
      {/* PHASE 1: Text message */}
      <div style={{ transform: 'rotate(-5deg)', opacity: textOpacity }}>
        <SliceSplitText 
          text={'みんなの力で\n勝利を掴み取れ!!'} 
          frame={frame} fps={fps} 
          fontSize={140} color="white" glowColor={theme.glowColor}
        />
      </div>

      {/* PHASE 2: Flash Lightning and Face-off (from frame 60) */}
      {frame >= 60 && (
        <AbsoluteFill>
          {/* Lightning Flash Background */}
          <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.8 }}>
            <OffthreadVideo 
              src={staticFile("assets/pixabay/videos/litinig-blue.mp4")} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              muted 
            />
          </AbsoluteFill>

          {/* Player Images sliding in from sides */}
          <div style={{
            position: 'absolute',
            top: 100,
            left: interpolate(faceOffEntry, [0, 1], [-900, 140]),
            opacity: faceOffEntry,
            zIndex: 10,
            transform: `translate(${wiggleX}px, ${wiggleY}px)`,
          }}>
            <div style={{
              width: 800, height: 800,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `10px solid ${theme.liver.borderColor}`,
              boxShadow: `0 0 60px ${theme.liver.glowColor}`
            }}>
              <Img src={staticFile(theme.liver.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 100,
            right: interpolate(faceOffEntry, [0, 1], [-900, 140]),
            opacity: faceOffEntry,
            zIndex: 10,
            transform: `translate(${-wiggleX}px, ${-wiggleY}px)`, // Inverse wiggle for dynamic contrast
          }}>
            <div style={{
              width: 800, height: 800,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `10px solid ${theme.opponent.borderColor}`,
              boxShadow: `0 0 60px ${theme.opponent.glowColor}`
            }}>
              <Img src={staticFile(theme.opponent.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Line Bars / Gauges */}
          <LineBar progress={liverProgress} color={theme.liver.borderColor} glow={theme.liver.glowColor} side="left" />
          <LineBar progress={oppProgress} color={theme.opponent.borderColor} glow={theme.opponent.glowColor} side="right" />
          
          {/* Flash screen effect right at frame 60 */}
          {frame >= 60 && frame <= 75 && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'white',
              opacity: interpolate(frame, [60, 75], [1, 0])
            }} />
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const BattlePattern6Template: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  
  // 構成パターン6 の詳細
  // オープニング(4.5S=135) -> 日時＋スタート(8S=240) -> VS(3S=90) -> ルール(5S=150) -> 一言(10S=300) = 915 frames
  const OP_DUR = 135;
  const DATE_DUR = 240;
  const VS_DUR = 90;
  const RULE_DUR = 90;
  const MSG_DUR = 360;

  const s1 = 0;
  const s2 = s1 + OP_DUR; // 135
  const s3 = s2 + DATE_DUR; // 375
  const s4 = s3 + VS_DUR; // 465
  const s5 = s4 + RULE_DUR; // 615

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <GlobalFrameThemed color={theme.themeColor} glowColor={theme.glowColor} />
      <Audio src={staticFile('assets/audio/music/Blastwave.mp3')} volume={0.6} />

      {/* 常設UI: 予約バトルが常に右上に出ている */}
      <div style={{
        position: 'absolute', top: 50, right: 50, zIndex: 1000,
        background: 'linear-gradient(45deg, #ff0055, #ffaa00)',
        padding: '15px 40px', borderRadius: 40, border: '4px solid white',
        boxShadow: '0 10px 30px rgba(255,0,85,0.5)',
        transform: 'rotate(5deg)'
      }}>
        <span style={{ fontSize: 40, fontWeight: 900, color: 'white', letterSpacing: 4 }}>予約バトル</span>
      </div>

      <Sequence from={s1} durationInFrames={OP_DUR}>
        <SceneOpeningPattern6 theme={theme} />
      </Sequence>
      
      <Sequence from={s2} durationInFrames={DATE_DUR}>
        <SceneDatePattern6 theme={theme} />
      </Sequence>
      
      <Sequence from={s3} durationInFrames={VS_DUR}>
        <SceneVs theme={theme} />
      </Sequence>
      
      <Sequence from={s4} durationInFrames={RULE_DUR}>
        <SceneRule theme={theme} />
      </Sequence>
      
      <Sequence from={s5} durationInFrames={MSG_DUR}>
        <SceneMessage theme={theme} />
      </Sequence>

    </AbsoluteFill>
  );
};
