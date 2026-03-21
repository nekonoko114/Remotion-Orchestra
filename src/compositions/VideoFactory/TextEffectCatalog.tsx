import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, staticFile, Audio } from 'remotion';
import { BurningLightningText } from './components/BattleShared/BattleSharedComponents';

export const TextEffectCatalog: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  const ITEM_DUR = 90;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#050510' }}>
      <Audio src={staticFile('assets/audio/music/Blastwave.mp3')} volume={0.3} />

      <AbsoluteFill style={{ padding: 60, justifyContent: 'flex-start' }}>
        <h1 style={{ color: 'white', fontSize: 60, fontFamily: 'sans-serif', textAlign: 'center', opacity: 0.5, borderBottom: '2px solid #333', paddingBottom: 20 }}>
          TEXT EFFECT CATALOG
        </h1>
      </AbsoluteFill>

      {/* 1. Neon Glow */}
      <Sequence from={0} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: '#ff00aa', fontSize: 40 }}>1. ネオン・グロウ (Neon Glow)</div>
          <div style={{
            fontSize: 160, fontWeight: 900, color: 'white', fontStyle: 'italic',
            textShadow: '0 0 10px #ff00aa, 0 0 40px #ff00aa, 0 0 80px #ff00aa',
            border: '8px solid white', padding: '0 40px', borderRadius: 40,
            boxShadow: '0 0 40px #ff00aa, inset 0 0 40px #ff00aa'
          }}>
            NEON EFFECT
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 2. Metallic 3D */}
      <Sequence from={ITEM_DUR * 1} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: '#aaa', fontSize: 40 }}>2. メタリック3Dエンボス (Metallic 3D)</div>
          <div style={{
            fontSize: 200, fontWeight: 900, color: '#e0e0e0', fontStyle: 'italic',
            background: 'linear-gradient(to bottom, #ffffff 0%, #999999 40%, #555555 50%, #aaaaaa 60%, #ffffff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0px 15px 5px rgba(0,0,0,0.8))'
          }}>
            METALLIC
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 3. Burning Lightning Text! */}
      <Sequence from={ITEM_DUR * 2} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: '#ffaaaa', fontSize: 40, zIndex: 100 }}>3. 雷鳴と業火 (Burning Lightning)</div>
          <BurningLightningText text="BURNING!!" frame={frame - ITEM_DUR * 2} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
