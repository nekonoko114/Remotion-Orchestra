import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  spring,
  random,
  Img,
} from 'remotion';
import {
  KaleidoscopeBackground,
  SunsetBackground,
  CustomBackgroundImage,
  MirrorLiver,
  SvgDefs,
  KineticText,
  VideoEffectStack,
} from '../BattleSharedComponents';
import { BattleSpiritTheme } from '../types';

export const SceneLiver: React.FC<{ theme: BattleSpiritTheme; duration: number }> = ({ theme, duration }) => {
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
        {theme.customBackground ? <CustomBackgroundImage src={theme.customBackground} frame={frame + 300} opacity={0.4} /> : (theme.themeColor === 'orange' ? <SunsetBackground frame={frame + 300} opacity={0.4} /> : null)}
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

        {/* --- EFFECT STACK --- */}
        <VideoEffectStack config={theme.sceneLiverEffect} />
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
              frame: frame - (duration - 10),
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
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', opacity: flash, zIndex: 5 }} />}
      
      {/* --- EFFECT STACK --- */}
      <VideoEffectStack config={theme.sceneLiverEffect} />
    </AbsoluteFill>
  );
};
