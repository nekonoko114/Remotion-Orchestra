import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, staticFile } from 'remotion';
import {
  GreenScreenOverlay, PanningVideoBackground, VsDiagonalLayout, CustomDateTextManager,
  SunsetBackground, Particle, SparkleEffect, LightLeak, GridConvergenceEffect, MirrorLiverEffect,
  KaleidoscopeBackground, RotatingFocusLines, GlobalFrameThemed, GlitchedIcon, KineticText,
  CustomBackgroundImage, CanvasImageKaleidoscope, CanvasKaleidoscope, MagicBackground,
  EmeraldBackground, MagicCircle, SpeedLinesBackground, GlitchNoise, FlashOverlay,
  CyberTunnel2D, ShockwaveEffect, SnowEffect, LightPillarEffect, GiantSnowflakeEffect
} from './components/BattleShared/BattleSharedComponents';
import { whiteSnowTheme } from './JolBattleWhiteSnow';

const mockTopPlayer = whiteSnowTheme.liver;
const mockBottomPlayer = whiteSnowTheme.opponent;
const mockTheme = whiteSnowTheme;

// --- 1. Backgrounds ---
const bgItems = [
  { name: 'PanningVideoBg', render: (f: number) => <PanningVideoBackground src="assets/pixabay/videos/pixabay_snow_globe_snowman_christmas_texture_snow_particle_98978.mp4" frame={f} startFrame={0} duration={90} startX={0} endX={-50} zIndex={1} /> },
  { name: 'SunsetBackground', render: (f: number) => <SunsetBackground frame={f} /> },
  { name: 'CustomBackgroundImage', render: (f: number) => <CustomBackgroundImage src={mockTheme.opponentBackground!} frame={f} /> },
  { name: 'KaleidoscopeBackground', render: (f: number) => <KaleidoscopeBackground imageSrc={staticFile(mockBottomPlayer.image)} frame={f} /> },
  { name: 'CanvasImageKaleidoscope', render: (f: number) => <CanvasImageKaleidoscope imageSrc={staticFile(mockTopPlayer.image)} frame={f} segments={8} /> },
  { name: 'CanvasKaleidoscope', render: (f: number) => <CanvasKaleidoscope frame={f} /> },
  { name: 'MagicBackground', render: (f: number) => <MagicBackground frame={f} /> },
  { name: 'EmeraldBackground', render: (f: number) => <EmeraldBackground frame={f} /> },
  { name: 'SpeedLinesBackground', render: (f: number) => <SpeedLinesBackground frame={f} color="#ff0055" /> },
  { name: 'CyberTunnel2D', render: (f: number) => <CyberTunnel2D frame={f} color="#00ffcc" /> },
];
export const SHOWCASE_BG_DURATION = bgItems.length * 90;
export const ShowcaseBackgrounds: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#111', color: 'white', fontFamily: 'sans-serif' }}>
      {bgItems.map((item, index) => (
        <Sequence key={index} from={index * 90} durationInFrames={90}>
          <AbsoluteFill style={{ backgroundColor: '#222', overflow: 'hidden' }}>
            {item.render(frame - index * 90)}
            <h2 style={{ position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center', fontSize: 60, background: 'rgba(0,0,0,0.8)', padding: 20, zIndex: 100 }}>{item.name}</h2>
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// --- 2. Effects ---
const fxItems = [
  { name: 'GreenScreenOverlay', render: (f: number) => <GreenScreenOverlay src="assets/pixabay/videos/pixabay_heart_sparkle_overlay_green_screen_4k_love_gold_he_111573.mp4" frame={f} startFrame={0} zIndex={10} /> },
  { name: 'Particles & Sparkles', render: (f: number) => <>{new Array(30).fill(0).map((_, i) => <Particle key={`p${i}`} seed={i} frame={f} color="#FFF" direction="down" />)}<SparkleEffect frame={f} count={10} color="#FFD700" glowColor="#FFA500" /></> },
  { name: 'LightLeak', render: (f: number) => <LightLeak frame={f} color="#00ffcc" /> },
  { name: 'RotatingFocusLines', render: (f: number) => <RotatingFocusLines frame={f} color="#ff0044" /> },
  { name: 'GlitchedIcon', render: (f: number) => <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><GlitchedIcon src={staticFile(mockTopPlayer.image)} frame={f} size={300} borderColor="#FFF" glowColor="#0ff" enabled={true} /></AbsoluteFill> },
  { name: 'MagicCircle', render: (f: number) => <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><MagicCircle frame={f} color="#ff00ff" glowColor="#ffaa00" /></AbsoluteFill> },
  { name: 'GlitchNoise', render: (f: number) => <GlitchNoise frame={f} opacity={0.5} /> },
  { name: 'FlashOverlay', render: (f: number) => <FlashOverlay frame={f} triggerFrames={[10, 40, 70]} /> },
  { name: 'ShockwaveEffect', render: (f: number) => <ShockwaveEffect frame={f} triggerFrame={20} color="#00ffff" /> },
  { name: 'SnowEffect', render: (f: number) => <SnowEffect frame={f} count={150} /> },
  { name: 'GiantSnowflakeEffect', render: (f: number) => <GiantSnowflakeEffect frame={f} /> },
  { name: 'LightPillarEffect', render: (f: number) => <LightPillarEffect frame={f} color="#00ffff" /> },
];
export const SHOWCASE_FX_DURATION = fxItems.length * 90;
export const ShowcaseEffects: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#111', color: 'white', fontFamily: 'sans-serif' }}>
      {fxItems.map((item, index) => (
        <Sequence key={index} from={index * 90} durationInFrames={90}>
          <AbsoluteFill style={{ backgroundColor: '#222', overflow: 'hidden' }}>
            {item.render(frame - index * 90)}
            <h2 style={{ position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center', fontSize: 60, background: 'rgba(0,0,0,0.8)', padding: 20, zIndex: 100 }}>{item.name}</h2>
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// --- 3. Transitions & Overlays ---
const transItems = [
  { name: 'GridConvergenceEffect', render: (f: number) => <GridConvergenceEffect imageSrc={mockBottomPlayer.image} frame={f} themeColor="#0277bd" /> },
  { name: 'MirrorLiverEffect', render: (f: number) => <MirrorLiverEffect imageSrc={mockTopPlayer.image} name={mockTopPlayer.name} frame={f} duration={90} themeColor="#0277bd" /> },
  { name: 'GlobalFrameThemed', render: () => <GlobalFrameThemed color="#0277bd" glowColor="#01579b" /> },
];
export const SHOWCASE_TRANS_DURATION = transItems.length * 90;
export const ShowcaseTransitions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#111', color: 'white', fontFamily: 'sans-serif' }}>
      {transItems.map((item, index) => (
        <Sequence key={index} from={index * 90} durationInFrames={90}>
          <AbsoluteFill style={{ backgroundColor: '#222', overflow: 'hidden' }}>
            {item.render(frame - index * 90)}
            <h2 style={{ position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center', fontSize: 60, background: 'rgba(0,0,0,0.8)', padding: 20, zIndex: 100 }}>{item.name}</h2>
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// --- 4. Text Animations & Layouts ---
const textItems = [
  { name: 'CustomDateTextManager', render: (f: number) => <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><CustomDateTextManager text="2026年<br/>3月28日" frame={f} fps={30} theme={mockTheme} fontSize1={100} fontSize2={200} startFrame1={5} startFrame2={15} /></AbsoluteFill> },
  { name: 'VsDiagonalLayout', render: (f: number) => <AbsoluteFill style={{ backgroundColor: '#e0f7fa' }}><VsDiagonalLayout frame={f} fps={30} topPlayer={mockTopPlayer} bottomPlayer={mockBottomPlayer} theme={mockTheme} popScale={1} /></AbsoluteFill> },
  { name: 'KineticText', render: (f: number) => <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><KineticText text="SUPER BATTLE!!" frame={f} fps={30} startFrame={10} fontSize={120} color="#FFD700" glowColor="#FFA500" animationType="pop" /></AbsoluteFill> },
];
export const SHOWCASE_TEXT_DURATION = textItems.length * 90;
export const ShowcaseTextLayouts: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#111', color: 'white', fontFamily: 'sans-serif' }}>
      {textItems.map((item, index) => (
        <Sequence key={index} from={index * 90} durationInFrames={90}>
          <AbsoluteFill style={{ backgroundColor: '#222', overflow: 'hidden' }}>
            {item.render(frame - index * 90)}
            <h2 style={{ position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center', fontSize: 60, background: 'rgba(0,0,0,0.8)', padding: 20, zIndex: 100 }}>{item.name}</h2>
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
