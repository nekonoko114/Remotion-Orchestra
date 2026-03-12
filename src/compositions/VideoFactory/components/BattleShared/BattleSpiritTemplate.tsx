import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  spring,
  interpolate,
  random,
  Img,
} from 'remotion';
import {
  KaleidoscopeBackground,
  Particle,
  LightLeak,
  RotatingFocusLines,
  GlobalFrameThemed,
  GlitchedIcon,
  KineticText,
  MirrorLiver,
  SvgDefs,
  SunsetBackground,
} from './BattleSharedComponents';
import { BattleSpiritTheme } from './types';

// ========================
// Scene Components
// ========================

const SceneOpening: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase = Math.floor(frame / 60);
  const text = phase === 0 ? "ガチバトル<br/>決定‼️" : phase === 1 ? (theme.themeColor === 'orange' ? "みんな<br/>私についてきな！" : "全員の力で<br/>バチバチに行くぞ!") : (theme.themeColor === 'orange' ? "俺に力を<br/>貸してくれ！" : "俺に力を<br/>貸してくれ！"); 

  const localFrame = frame % 60;
  const entry = spring({ frame: localFrame, fps, config: { stiffness: 400, damping: 15 } });
  const pulse = Math.pow(Math.max(0, 1 - localFrame / 45), 4) * 1.5 + 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000' }}>
      {theme.themeColor === 'orange' ? <SunsetBackground frame={frame} /> : null}
      
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)',
        opacity: 0.6,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, ${theme.themeColor === 'orange' ? 'rgba(120,10,0,' : 'rgba(120,10,0,'}${0.7 * pulse}) 0%, transparent 70%)`,
      }} />

      {localFrame < 20 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 6 }}>
          <div style={{
            width: interpolate(localFrame, [0, 20], [0, 1600]),
            height: interpolate(localFrame, [0, 20], [0, 1600]),
            borderRadius: '50%',
            border: `${Math.max(0, 15 - localFrame * 0.7)}px solid rgba(255,100,0,${Math.max(0, 1 - localFrame / 20)})`,
            boxShadow: `0 0 60px rgba(255,60,0,${Math.max(0, 0.8 - localFrame / 20)})`,
            pointerEvents: 'none',
          }} />
        </AbsoluteFill>
      )}

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: 250 + 150 * pulse, height: 600 + 400 * pulse,
          background: `radial-gradient(ellipse at 50% 60%, white 0%, ${theme.glowColor} 35%, ${theme.themeColor} 65%, transparent 80%)`,
          filter: `blur(${20 + 20 * pulse}px)`, borderRadius: '40% 40% 60% 60%',
          boxShadow: `0 0 ${300 * pulse}px ${100 * pulse}px ${theme.themeColor}`, 
          transform: `scale(${pulse * entry})`,
        }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 50px' }}>
        <KineticText
          text={text}
          frame={localFrame}
          fps={fps}
          fontSize={theme.themeColor !== 'orange' && phase === 2 ? 210 : 120}
          color="#fff5f0"
          glowColor={theme.glowColor}
          style={{ 
            lineHeight: 1.2, 
            letterSpacing: 10,
            ...(theme.themeColor !== 'orange' && phase === 2 ? {
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '60px',
            } : {}),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneDate: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = Math.max(0, 1 - frame / 8); 
  const drop1 = spring({ frame: frame - 5, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const drop2 = spring({ frame: frame - 25, fps, config: { stiffness: 400, damping: 10, mass: 2 } });
  const shakeX = (random(frame) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 5) / 10);
  const shakeY = (random(frame + 11) - 0.5) * 40 * Math.max(0, 1 - Math.abs(frame - 25) / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      {theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 180} opacity={0.8} /> : null}
      <SvgDefs frame={frame} />
      {new Array(30).fill(0).map((_, i) => (
        <Particle key={i} seed={i * 8} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} />
      ))}
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash }} />}

      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 60 }}>
        <div style={{
          textAlign: 'center',
          transform: `scale(${interpolate(drop1, [0, 1], [5, 1])}) translateY(${interpolate(drop1, [0, 1], [-800, 0])}px)`,
          opacity: drop1 > 0.05 ? 1 : 0,
        }}>
          <KineticText
            text="2026年&#10;3月27日"
            frame={frame}
            fps={fps}
            startFrame={10}
            fontSize={210}
            color="#FFF"
            glowColor={theme.glowColor}
            style={{ marginBottom: 20 }}
          />
          <KineticText
            text="Friday"
            frame={frame}
            fps={fps}
            startFrame={30}
            fontSize={140}
            color="#FFF"
            glowColor={theme.glowColor}
            style={{ letterSpacing: 10 }}
          />
        </div>
        <div style={{
          transform: `scale(${interpolate(drop2, [0, 1], [3, 1])}) skewX(-15deg)`,
          opacity: drop2 > 0.05 ? 1 : 0,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <KineticText
            text="21:00"
            frame={frame}
            fps={fps}
            startFrame={45}
            fontSize={240}
            color="#FFF"
            glowColor={theme.glowColor}
            style={{ fontWeight: 900 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneLiver: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (theme.features.useDoublingGrid) {
    const staticImage = staticFile(theme.liver.image);
    const sequence = [16,9,4,2,1];
    const fpb = 30 / (174 / 30);
    const beatInterval = 6;
    const exponent = Math.floor(frame / (fpb * beatInterval));
    const count = sequence[Math.min(exponent, sequence.length - 1)];
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    return (
      <AbsoluteFill style={{ backgroundColor: '#100800', overflow: 'hidden' }}>
        <SunsetBackground frame={frame + 300} opacity={0.4} />
        <KaleidoscopeBackground imageSrc={staticImage} frame={frame} opacity={0.3} />
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {count === 1 ? (
             <div style={{ width: 800, height: 800, borderRadius: '50%', overflow: 'hidden', border: '15px solid #fff', boxShadow: `0 0 100px ${theme.themeColor}, 0 0 50px ${theme.themeColor}`, transform: `scale(${spring({ frame: frame % (fpb * beatInterval), fps, config: { stiffness: 200, damping: 20 } })})` }}>
               <Img src={staticImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: `${Math.max(2, 5 - exponent * 2)}px`, padding: '10px 0', width: '100%', height: '100%', boxSizing: 'border-box' }}>
              {new Array(count).fill(0).map((_, i) => (
                <div key={i} style={{ position: 'relative', width: '100%', borderRadius: '50%', overflow: 'hidden', border: `${Math.max(1, 4 - exponent * 0.5)}px solid ${theme.themeColor}`, transform: `scale(${spring({ frame: frame % 30, fps, config: { stiffness: 1000, damping: 50, mass: 0.5 } })}) rotate(${(random(i + theme.liver.name + exponent) - 0.5) * 5}deg)`, boxShadow: `0 0 ${Math.max(5, 20 - exponent * 3)}px rgba(255,165,0,0.5)`, margin: 'auto' }}>
                  <Img src={staticImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: 100, background: 'rgba(0,0,0,0.7)', padding: '20px 60px', borderRadius: '50px', border: '4px solid gold', fontSize: 60, fontWeight: 900, color: 'white', textShadow: `0 0 20px ${theme.themeColor}` }}>
            {theme.liver.name}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const flash = Math.max(0, 1 - frame / 15);
  const bounceIntensity = Math.abs(Math.sin((frame - 10) / 4)) * Math.max(0, 1 - (frame - 10) / 30) * 100;
  const nameGlitchOffset = theme.features.useGlitch ? (Math.max(0, 1 - (frame - 30) / 20) * (random(frame) - 0.5) * 40) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#080000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      <KaleidoscopeBackground imageSrc={staticFile(theme.liver.image)} frame={frame} opacity={0.4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${bounceIntensity}px)` }}>
          <MirrorLiver 
            frame={frame} 
            imageSrc={staticFile(theme.liver.image)} 
            color={theme.themeColor} 
            zoomProgress={spring({
              frame: frame - (180 - 10),
              fps,
              config: { stiffness: 200, damping: 20 }
            })}
            enabled={theme.features.useMirror}
          />
        </div>
        <KineticText
          text={theme.liver.name}
          frame={frame}
          fps={fps}
          startFrame={35}
          fontSize={120}
          color="#FFD700"
          glowColor={theme.glowColor}
          style={{ 
            marginTop: 40, 
            WebkitTextStroke: '4px #500', 
            letterSpacing: 5,
            transform: `scale(${spring({ frame: frame - 25, fps, config: { stiffness: 400 } })}) translateX(${nameGlitchOffset}px)`,
          }}
        />
      </AbsoluteFill>
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash }} />}
    </AbsoluteFill>
  );
};

const SceneOpponentAnnounce: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textFlash = Math.floor(frame / 4) % 2 === 0 ? 1 : 0.2;
  const scale = spring({ frame, fps, config: { stiffness: 400, damping: 10 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${theme.themeColor === 'orange' ? '#442200' : '#440000'} 0%, #000 70%)`, opacity: interpolate(frame, [0, 10], [0, 1]) }} />
      <AbsoluteFill style={{ filter: theme.themeColor === 'blue' ? 'none' : 'url(#glitch-red)', opacity: 0.6, transform: `translateX(${(frame % 2) * 20}px)` }}>
        <div style={{ flex: 1, border: `40px solid ${theme.themeColor}` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <KineticText text="対戦相手は！？" frame={frame} fps={fps} fontSize={120} color="#FFF" glowColor={theme.glowColor} style={{ letterSpacing: 20, transform: `scale(${interpolate(scale, [0, 1], [4.0, 1])}) rotate(${interpolate(scale, [0, 1], [360, 0])}deg) skewX(-15deg)`, opacity: textFlash }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneOpponent: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - 5, fps, config: { stiffness: 600, damping: 12, mass: 2 } });
  const impact = Math.max(0, 1 - Math.max(0, frame - 5) / 10);
  const shakeX = (random(frame) - 0.5) * 60 * impact;
  const shakeY = (random(frame + 11) - 0.5) * 60 * impact;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050000', overflow: 'hidden' }}>
      {theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 480} opacity={0.6} /> : null}
      <KaleidoscopeBackground imageSrc={staticFile(theme.opponent.image)} frame={frame} opacity={0.4} />
      <SvgDefs frame={frame} />
      {impact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: impact, zIndex: 10 }} />}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transform: `scale(${interpolate(drop, [0, 0.4, 1], [5, 0.9, 1])}) translateY(${interpolate(drop, [0, 1], [-1000, 0])}px)`, filter: `brightness(${1 + impact * 5}) drop-shadow(0 0 ${impact * 100}px ${theme.themeColor})`, opacity: drop > 0.05 ? 1 : 0 }}>
          <div style={{ width: 800, height: 800, borderRadius: '50%', overflow: 'hidden', border: `10px solid white`, marginBottom: 20, boxShadow: `0 0 50px ${theme.themeColor}` }}>
            <Img src={staticFile(theme.opponent.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <KineticText text={theme.opponent.name} frame={frame} fps={fps} startFrame={15} fontSize={140} color="white" glowColor={theme.glowColor} style={{ letterSpacing: 4, whiteSpace: 'nowrap' }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneVs: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 600, damping: 15 } }); 
  const shakeDecay = Math.max(0, 1 - frame / 40); 
  const shakeX = (random(frame) - 0.5) * 60 * shakeDecay; 
  const shakeY = (random(frame + 9) - 0.5) * 60 * shakeDecay; 
  const flashOpacity = Math.max(0, 1 - frame / 4); 

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {flashOpacity > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flashOpacity, zIndex: 10 }} />}
      <RotatingFocusLines frame={frame} color={theme.themeColor} />
      <AbsoluteFill style={{ transform: `scale(${1 + shakeDecay * 0.1}) translate(${shakeX}px, ${shakeY}px)` }}>
        <KaleidoscopeBackground imageSrc={staticFile(theme.opponent.image)} frame={frame} opacity={0.3} glowColor={theme.glowColor} />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop})`, gap: 20 }}>
            <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${theme.opponent.glowColor})` }}>
              <GlitchedIcon src={staticFile(theme.opponent.image)} frame={frame} size={600} borderColor={theme.opponent.borderColor} glowColor={theme.opponent.glowColor} style={{ margin: '0 auto 15px' }} enabled={theme.features.useGlitch} />
              <KineticText text={theme.opponent.name} frame={frame} fps={fps} startFrame={10} fontSize={90} color={theme.opponent.borderColor} glowColor={theme.opponent.glowColor} style={{ letterSpacing: 4 }} />
            </div>
            <div style={{ position: 'relative', height: 120, zIndex: 10 }}>
               <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: theme.themeColor, fontStyle: 'italic', transform: `translate(-20px, 10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ position: 'absolute', fontSize: 260, fontWeight: 900, color: 'cyan', fontStyle: 'italic', transform: `translate(20px, -10px) rotate(${Math.sin(frame / 3) * 15}deg)`, opacity: 0.7 }}>VS</div>
                 <div style={{ position: 'relative', fontSize: 260, fontWeight: 900, color: 'white', fontStyle: 'italic', transform: `rotate(${Math.sin(frame / 3) * 15}deg)`, WebkitTextStroke: '8px black', textShadow: `0 0 100px ${theme.glowColor}` }}>VS</div>
               </div>
            </div>
            <div style={{ textAlign: 'center', filter: `drop-shadow(0 0 100px ${theme.liver.glowColor})` }}>
              <GlitchedIcon src={staticFile(theme.liver.image)} frame={frame} size={600} borderColor={theme.liver.borderColor} glowColor={theme.liver.glowColor} style={{ margin: '15px auto 10px' }} enabled={theme.features.useGlitch} />
              <KineticText text={theme.liver.name} frame={frame} fps={fps} startFrame={20} fontSize={90} color={theme.liver.borderColor} glowColor={theme.liver.glowColor} style={{ letterSpacing: 4 }} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneRules: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r1 = spring({ frame: frame - 10, fps, config: { stiffness: 600, damping: 10 } });
  const r2 = spring({ frame: frame - 40, fps, config: { stiffness: 600, damping: 10 } });
  const rulesImpact = Math.max(0, 1 - Math.max(0, frame - 10) / 6) + Math.max(0, 1 - Math.max(0, frame - 40) / 6);
  const shakeX = (random(frame) - 0.5) * 30 * Math.min(1, rulesImpact);
  const shakeY = (random(frame + 77) - 0.5) * 30 * Math.min(1, rulesImpact);

  return (
    <AbsoluteFill style={{ backgroundColor: '#040000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {rulesImpact > 0.8 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: rulesImpact * 0.8, zIndex: 10 }} />}
      {new Array(30).fill(0).map((_, i) => <Particle key={i} seed={i * 19 + 800} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} />)}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)`, justifyContent: 'center', alignItems: 'center', gap: 80 }}>
        <div style={{ transform: `scale(${interpolate(r1, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${-(interpolate(r1, [0, 1], [20, 5]))}deg)`, opacity: r1 > 0.05 ? 1 : 0, filter: `drop-shadow(0 0 100px ${theme.themeColor})` }}>
          <KineticText text="やり直し無し<br/>一本勝負" frame={frame} fps={fps} startFrame={20} fontSize={160} color="#FFF" glowColor={theme.glowColor} style={{ fontWeight: 900 }} />
        </div>
        <div style={{ transform: `scale(${interpolate(r2, [0, 0.5, 1], [8, 0.9, 1])}) rotate(${interpolate(r2, [0, 1], [-20, 5])}deg)`, opacity: r2 > 0.05 ? 1 : 0, filter: `drop-shadow(0 0 100px orange)` }}>
          <KineticText text="フルアイテム" frame={frame} fps={fps} startFrame={50} fontSize={160} color="#FFF" glowColor="orange" style={{ fontWeight: 900 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneEndingList: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeOut = interpolate(frame, [240, 300], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <SvgDefs frame={frame} />
      {frame < 10 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: 1 - frame / 10, zIndex: 10 }} />}
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {new Array(60).fill(0).map((_, i) => <Particle key={i} seed={i * 31} frame={frame} color={i % 2 === 0 ? theme.particleColor1 : theme.particleColor2} />)}
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.7) 70%, transparent 100%)' }} />
          <KineticText text={theme.endingText} frame={frame} fps={fps} startFrame={30} fontSize={140} color="#FFFFFF" glowColor={theme.themeColor} style={{ lineHeight: 1.5, letterSpacing: 5, position: 'relative', zIndex: 2 }} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 180], [0.95, 1.05]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Img src={staticFile('jol-logo-800.png')} style={{ width: 800, opacity, transform: `scale(${scale})`, filter: 'drop-shadow(0 0 80px rgba(255,255,255,0.6))' }} />
    </AbsoluteFill>
  );
};

// ========================
// Main Template component
// ========================

export const BattleSpiritTemplate: React.FC<{ theme: BattleSpiritTheme }> = ({ theme }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const OP_DUR = 6 * fps;
  const DATE_DUR = 4 * fps;
  const INTRO_LIVER_DUR = 6 * fps;
  const MSG_DUR = 1.5 * fps;
  const OPPONENT_DUR = 3 * fps;
  const VS_DUR = 4 * fps;
  const RULE_DUR = 3 * fps;
  const ENDING_DUR = 5 * fps;
  const LOGO_DUR = 3 * fps;

  const s1 = 0;
  const s2 = s1 + OP_DUR;
  const s3 = s2 + DATE_DUR;
  const s4 = s3 + INTRO_LIVER_DUR;
  const s5 = s4 + MSG_DUR;
  const s6 = s5 + OPPONENT_DUR;
  const s7 = s6 + VS_DUR;
  const s8 = s7 + RULE_DUR;
  const s9 = s8 + ENDING_DUR;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <GlobalFrameThemed color={theme.themeColor} glowColor={theme.glowColor} />
      <Audio src={staticFile(theme.music.src)} volume={theme.music.volume ?? 0.6} loop startFrom={theme.music.startFrom} />
      <LightLeak frame={frame} color={theme.lightLeakColor || theme.themeColor} />

      <Sequence from={s1} durationInFrames={OP_DUR}><SceneOpening theme={theme} /></Sequence>
      <Sequence from={s2} durationInFrames={DATE_DUR}><SceneDate theme={theme} /></Sequence>
      <Sequence from={s3} durationInFrames={INTRO_LIVER_DUR}><SceneLiver theme={theme} /></Sequence>
      <Sequence from={s4} durationInFrames={MSG_DUR}><SceneOpponentAnnounce theme={theme} /></Sequence>
      <Sequence from={s5} durationInFrames={OPPONENT_DUR}><SceneOpponent theme={theme} /></Sequence>
      <Sequence from={s6} durationInFrames={VS_DUR}><SceneVs theme={theme} /></Sequence>
      <Sequence from={s7} durationInFrames={RULE_DUR}><SceneRules theme={theme} /></Sequence>
      <Sequence from={s8} durationInFrames={ENDING_DUR}><SceneEndingList theme={theme} /></Sequence>
      <Sequence from={s9} durationInFrames={LOGO_DUR}><SceneLogo /></Sequence>
    </AbsoluteFill>
  );
};
