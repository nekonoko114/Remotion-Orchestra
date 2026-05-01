import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, staticFile, Audio } from 'remotion';
import { 
  BurningLightningText,
  GalaxyGlowText,
  SakuraBreezeText,
  CyberpunkAbstractText,
  RainbowLiquidText,
  HeartSparkleText,
  Gold3DText,
  GlitchDisplacementText,
  InfernoOutlineText,
  HologramScanText,
  GlassRefractionText,
  LiquidAuraText,
  ThunderStrikeText,
  ExplosionImpactText,
  ElegantBokehText,
  TechCircuitText,
  StarburstCoreText,
  DeepHeartText,
  FireRingText,
  MatrixDataText,
  StarlightPulseText
} from '../Battles/shared/BattleSharedComponents';

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

      {/* 3. Burning Lightning Text */}
      <Sequence from={ITEM_DUR * 2} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: '#ffaaaa', fontSize: 40, zIndex: 100 }}>3. 雷鳴と業火 (Burning Lightning)</div>
          <BurningLightningText text="BURNING!!" frame={frame - ITEM_DUR * 2} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

      {/* 4. Galaxy Glow Effect (宇宙・銀河) */}
      <Sequence from={ITEM_DUR * 3} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: '#aa00ff', fontSize: 40, fontFamily: 'serif' }}>4. ギャラクシー宇宙空間 (Galaxy Glow)</div>
          <GalaxyGlowText text="UNIVERSE" frame={frame - ITEM_DUR * 3} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

      {/* 5. Sakura Breeze Effect (桜吹雪) */}
      <Sequence from={ITEM_DUR * 4} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: '#ff99cc', fontSize: 40 }}>5. 桜吹雪マスク (Sakura Breeze)</div>
          <SakuraBreezeText text="SPRING" frame={frame - ITEM_DUR * 4} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 6. Cyberpunk Abstract Effect */}
      <Sequence from={ITEM_DUR * 5} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: '#00ffff', fontSize: 40, fontStyle: 'italic', letterSpacing: 5 }}>6. サイバーパンク (Cyberpunk Abstract)</div>
          <CyberpunkAbstractText text="SYSTEM ERROR" frame={frame - ITEM_DUR * 5} fontSize={160} />
        </AbsoluteFill>
      </Sequence>

      {/* 7. Rainbow Liquid Effect */}
      <Sequence from={ITEM_DUR * 6} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 300, color: 'white', textShadow: '0 0 10px white', fontSize: 40 }}>7. レインボー流体 (Rainbow Liquid)</div>
          <RainbowLiquidText text="RAINBOW" frame={frame - ITEM_DUR * 6} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 8. Heart Sparkle Effect */}
      <Sequence from={ITEM_DUR * 7} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ff0066', fontSize: 40 }}>8. ハート・スパークル (Heart Sparkle)</div>
          <HeartSparkleText text="LOVE BEAT" frame={frame - ITEM_DUR * 7} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 9. Gold 3D Text */}
      <Sequence from={ITEM_DUR * 8} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ffd700', fontSize: 40 }}>9. 黄金3Dベベル (Gold 3D Extrusion)</div>
          <Gold3DText text="CHAMPION" frame={frame - ITEM_DUR * 8} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 10. Glitch Displacement */}
      <Sequence from={ITEM_DUR * 9} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ff0055', fontSize: 40 }}>10. ノイズ空間歪曲 (Glitch Displacement)</div>
          <GlitchDisplacementText text="CRITICAL" frame={frame - ITEM_DUR * 9} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 11. Inferno Outline */}
      <Sequence from={ITEM_DUR * 10} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ff5500', fontSize: 40 }}>11. 業火の輪郭線 (Inferno Outline)</div>
          <InfernoOutlineText text="HELLFIRE" frame={frame - ITEM_DUR * 10} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 12. Hologram Scanline */}
      <Sequence from={ITEM_DUR * 11} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#00ffff', fontSize: 40 }}>12. ホログラム投影 (Hologram Scan)</div>
          <HologramScanText text="HOLOGRAM" frame={frame - ITEM_DUR * 11} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 13. Glass Refraction */}
      <Sequence from={ITEM_DUR * 12} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ffffff', fontSize: 40 }}>13. ガラス・レンズ屈折 (Glass Refraction)</div>
          <GlassRefractionText text="REFRACTION" frame={frame - ITEM_DUR * 12} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

      {/* 14. Liquid Aura */}
      <Sequence from={ITEM_DUR * 13} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ff00ff', fontSize: 40 }}>14. リキッドオーラ (Liquid Aura)</div>
          <LiquidAuraText text="AURA BURST" frame={frame - ITEM_DUR * 13} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

      {/* 15. Thunder Strike */}
      <Sequence from={ITEM_DUR * 14} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#00ccff', fontSize: 40 }}>15. 蒼雷撃 (Thunder Strike)</div>
          <ThunderStrikeText text="THUNDER" frame={frame - ITEM_DUR * 14} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 16. Explosion Impact */}
      <Sequence from={ITEM_DUR * 15} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ff3300', fontSize: 40 }}>16. 爆炎インパクト (Explosion Impact)</div>
          <ExplosionImpactText text="EXPLOSION" frame={frame - ITEM_DUR * 15} fontSize={190} />
        </AbsoluteFill>
      </Sequence>

      {/* 17. Elegant Bokeh */}
      <Sequence from={ITEM_DUR * 16} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ffddaa', fontSize: 40 }}>17. エレガント・ボケ光 (Elegant Bokeh)</div>
          <ElegantBokehText text="ELEGANCE" frame={frame - ITEM_DUR * 16} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

      {/* 18. Tech Circuit */}
      <Sequence from={ITEM_DUR * 17} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#00ffaa', fontSize: 40 }}>18. サイバーライン・サーキット (Tech Circuit)</div>
          <TechCircuitText text="DATALINE" frame={frame - ITEM_DUR * 17} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 19. Starburst Core */}
      <Sequence from={ITEM_DUR * 18} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#fff8b0', fontSize: 40 }}>19. 星の煌めき (Starburst Core)</div>
          <StarburstCoreText text="STARLIGHT" frame={frame - ITEM_DUR * 18} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

      {/* 20. Deep Abyss Heart */}
      <Sequence from={ITEM_DUR * 19} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ffaaaa', fontSize: 40 }}>20. 深淵の鼓動 (Deep Abyss Heart)</div>
          <DeepHeartText text="HEARTBEAT" frame={frame - ITEM_DUR * 19} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

      {/* 21. Ring of Fire */}
      <Sequence from={ITEM_DUR * 20} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ff4400', fontSize: 40 }}>21. 炎輪 (Ring of Fire)</div>
          <FireRingText text="RING OF FIRE" frame={frame - ITEM_DUR * 20} fontSize={150} />
        </AbsoluteFill>
      </Sequence>

      {/* 22. Matrix DataStream */}
      <Sequence from={ITEM_DUR * 21} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#00ff66', fontSize: 40 }}>22. マトリックス・データストリーム (Matrix)</div>
          <MatrixDataText text="MATRIX" frame={frame - ITEM_DUR * 21} fontSize={200} />
        </AbsoluteFill>
      </Sequence>

      {/* 23. Starlight Pulse */}
      <Sequence from={ITEM_DUR * 22} durationInFrames={ITEM_DUR}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 200, color: '#ffffff', fontSize: 40 }}>23. 星脈の鼓動 (Starlight Pulse)</div>
          <StarlightPulseText text="ETERNAL" frame={frame - ITEM_DUR * 22} fontSize={180} />
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
