import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  Easing,
  Audio,
  random,
} from 'remotion';
import { CrystalBackground } from '../../components/backgrounds/CrystalBackground';
import { useBeatValue } from '../../utils/beat-sync';
import { ImpactShockwave } from '../../components/effects/ImpactShockwave';
import { ThunderGodStrike } from '../../components/effects/UltraText';
import { LensFlare } from '../../components/effects/LensFlare';
import { CyberGrid } from '../../components/overlays/CyberGrid';
import { ZoomBlurTransition } from '../../components/transitions/ZoomBlurTransition';
import { HolographicHUD } from '../../components/effects/HolographicHUD';
import { LightningBolt } from '../../components/effects/LightningBolt';

// --- BEAT SYNC SETTINGS ---
const BPM = 124;
const BEATS_PER_MEASURE = 4;

// --- Types ---
interface BattlePlayer {
  name: string;
  id: string;
  image: string;
  color: string;
}

const MOCK_JOL_PLAYER: BattlePlayer = {
  name: 'J.O.L Creator',
  id: 'jol_creator_01',
  image: staticFile('video-factory/images/logo/logo.png'),
  color: '#00f0ff',
};

const MOCK_OPPONENT: BattlePlayer = {
  name: 'Rival King',
  id: 'rival_king_99',
  image: staticFile('video-factory/images/logo/logo.png'),
  color: '#aa00ff',
};

// --- Sub-Components ---

const EnergyAura: React.FC<{ color: string; pulse: number }> = ({
  color,
  pulse,
}) => {
  const scale = 1 + pulse * 0.4;
  const opacity = 0.3 + pulse * 0.4;
  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', alignItems: 'center', zIndex: 0 }}
    >
      <div
        style={{
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          transform: `scale(${scale})`,
          opacity,
          filter: 'blur(20px)',
        }}
      />
      <div
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          transform: `scale(${1 + pulse * 0.2})`,
          opacity: pulse * 0.5,
          filter: 'blur(5px)',
        }}
      />
    </AbsoluteFill>
  );
};

const FlyingShards: React.FC<{ frame: number }> = ({ frame }) => {
  const shards = Array.from({ length: 8 }).map((_, i) => {
    const seed = `shard-${i}`;
    const angle = random(`${seed}-angle`) * Math.PI * 2;
    const distance = interpolate(frame, [0, 15], [0, 800], {
      easing: Easing.out(Easing.quad),
    });
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const rotation = interpolate(frame, [0, 15], [0, 360]);
    const opacity = interpolate(frame, [10, 15], [1, 0]);
    const scale = random(`${seed}-scale`) * 0.5 + 0.5;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 40,
          height: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
          opacity,
          filter: 'blur(1px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>{shards}</AbsoluteFill>
  );
};

const ScanlineOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 999 }}>
      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%',
          opacity: 0.15,
        }}
      />
      {/* Subtle Grain/Noise */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.webp")`,
          opacity: 0.05,
          mixBlendMode: 'overlay',
        }}
      />
    </AbsoluteFill>
  );
};

const CrystalCard: React.FC<{
  player: BattlePlayer;
  frame: number;
  direction: 'left' | 'right';
  pulse?: number;
}> = ({ player, frame, direction, pulse = 0 }) => {
  const { fps } = useVideoConfig();
  const spr = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = interpolate(spr, [0, 1], [0.5, 1], {
    easing: Easing.out(Easing.back(1.2)),
  });
  const slide = interpolate(
    spr,
    [0, 1],
    [direction === 'left' ? -500 : 500, 0],
  );
  const opacity = interpolate(spr, [0, 0.5], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateX(${slide}px) scale(${scale})`,
        opacity,
        position: 'relative',
      }}
    >
      <EnergyAura color={player.color} pulse={pulse} />

      <div
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: `8px solid ${player.color}`,
          boxShadow: `0 0 60px ${player.color}66`,
          overflow: 'hidden',
          backgroundColor: '#000',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AbsoluteFill style={{ transform: 'scale(1.2)', opacity: 0.4 }}>
          <HolographicHUD color={player.color} />
        </AbsoluteFill>
        <Img
          src={player.image}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.1) 100%)',
            mixBlendMode: 'overlay',
            zIndex: 2,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          textAlign: 'center',
          padding: '10px 30px',
          background: 'rgba(0,0,0,0.8)',
          borderRadius: 15,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          width: 550,
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontSize: 55,
            margin: 0,
            color: 'white',
            fontFamily: 'Impact',
            textShadow: `0 0 20px ${player.color}`,
          }}
        >
          {player.name}
        </h2>
      </div>
    </div>
  );
};

// --- Main Composition ---

export const BattleCrystal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // --- OTOHAME LOGIC ---
  const { pulse, framesPerBeat } = useBeatValue(BPM);
  const measureFrames = framesPerBeat * BEATS_PER_MEASURE;

  const OP_DURATION = 2 * measureFrames;
  const JOL_INTRO_DURATION = 3 * measureFrames;
  const OPPONENT_INTRO_DURATION = 3 * measureFrames;
  const MATCHUP_DURATION = 3 * measureFrames;
  const VS_RULES_DURATION = 2 * measureFrames;
  const END_DURATION = 3 * fps;

  const startJol = OP_DURATION;
  const startOpponent = startJol + JOL_INTRO_DURATION;
  const startMatchup = startOpponent + OPPONENT_INTRO_DURATION;
  const startVs = startMatchup + MATCHUP_DURATION;
  const startEnd = startVs + VS_RULES_DURATION;

  // --- Visual Beats FX ---
  const flashOpacity = interpolate(pulse, [0, 1], [0, 0.2]);
  const screenBeatScale = 1 + pulse * 0.012;

  // NEW: Beat-synced Rotation (Subtle wobble)
  const beatRotation = interpolate(
    pulse,
    [0, 1],
    [0, (random(frame) - 0.5) * 2],
  );

  // NEW: Color Inversion pulse (Heavy flash on beat)
  const invertAmount = interpolate(pulse, [0.8, 1], [0, 0.4], {
    extrapolateLeft: 'clamp',
  });

  const glitchIntensity = pulse * 12;
  const gx = (random(`x-${frame}`) - 0.5) * glitchIntensity;
  const gy = (random(`y-${frame}`) - 0.5) * glitchIntensity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        transform: `scale(${screenBeatScale}) translate(${gx}px, ${gy}px) rotate(${beatRotation}deg)`,
        filter: `invert(${invertAmount})`,
      }}
    >
      <ScanlineOverlay />

      {/* BACKGROUND LAYER */}
      <CrystalBackground />
      <AbsoluteFill style={{ opacity: 0.3 }}>
        <CyberGrid />
      </AbsoluteFill>

      <Audio
        src={staticFile('assets/audio/music/Valor.mp3')}
        volume={0.6}
        loop
      />

      {/* 1. OPENING */}
      <Sequence durationInFrames={OP_DURATION}>
        <ZoomBlurTransition type="in" duration={20}>
          <AbsoluteFill
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <h1
              style={{
                fontSize: 220,
                color: 'white',
                fontFamily: 'Impact',
                letterSpacing: 10,
                textShadow: '0 0 50px #00f0ff, 0 0 100px #00f0ff',
                textAlign: 'center',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              GACHI
              <br />
              BATTLE
            </h1>
          </AbsoluteFill>
        </ZoomBlurTransition>
      </Sequence>

      {/* 2. JOL REVEAL */}
      <Sequence from={startJol} durationInFrames={JOL_INTRO_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <CrystalCard
            player={MOCK_JOL_PLAYER}
            frame={frame - startJol}
            direction="left"
            pulse={pulse}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 3. OPPONENT REVEAL */}
      <Sequence from={startOpponent} durationInFrames={OPPONENT_INTRO_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <CrystalCard
            player={MOCK_OPPONENT}
            frame={frame - startOpponent}
            direction="right"
            pulse={pulse}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 4. MATCH-UP (VS Scene) */}
      <Sequence from={startMatchup} durationInFrames={MATCHUP_DURATION}>
        <AbsoluteFill>
          <AbsoluteFill style={{ opacity: pulse * 0.6 }}>
            <LightningBolt color="#00f0ff" intensity={1.5} />
          </AbsoluteFill>

          {/* Screen Crack Overlay & Distortion Effect */}
          {frame - startMatchup >= 10 && frame - startMatchup < 25 && (
            <>
              {/* Shards flying out */}
              <FlyingShards frame={frame - startMatchup - 10} />

              {/* Crack Image */}
              <AbsoluteFill
                style={{
                  mixBlendMode: 'screen',
                  zIndex: 500,
                  opacity: interpolate(
                    frame - startMatchup - 10,
                    [0, 2, 12],
                    [0, 1, 0],
                  ),
                }}
              >
                <Img
                  src={staticFile('video-factory/images/vfx/screen_crack.png')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </AbsoluteFill>
            </>
          )}

          {/* 
						Main Content Wrapper with 'Refraction' Distortion 
						When the crack hits (frame 10), we jitter the scale and rotation.
					*/}
          <AbsoluteFill
            style={{
              transform:
                frame - startMatchup >= 10 && frame - startMatchup < 18
                  ? `scale(${1.05 + random(frame) * 0.05}) rotate(${(random(frame) - 0.5) * 2}deg)`
                  : 'scale(1)',
            }}
          >
            {/* TOP: JOL */}
            <div
              style={{
                position: 'absolute',
                top: '8%',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                transform: 'scale(0.6)',
              }}
            >
              <CrystalCard
                player={MOCK_JOL_PLAYER}
                frame={frame - startMatchup}
                direction="left"
                pulse={pulse}
              />
              {frame - startMatchup === 5 && <ImpactShockwave />}
            </div>

            {/* CENTER: VS */}
            <AbsoluteFill
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Sequence from={10} layout="none">
                <ThunderGodStrike text="VS" fontSize={260} />
              </Sequence>
            </AbsoluteFill>

            {/* BOTTOM: OPPONENT */}
            <div
              style={{
                position: 'absolute',
                bottom: '8%',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                transform: 'scale(0.6)',
              }}
            >
              <CrystalCard
                player={MOCK_OPPONENT}
                frame={frame - startMatchup}
                direction="right"
                pulse={pulse}
              />
              {frame - startMatchup === 15 && <ImpactShockwave />}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* 5. RULES */}
      <Sequence from={startVs} durationInFrames={VS_RULES_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '15%',
              textAlign: 'center',
              width: '100%',
              opacity: interpolate(frame - startVs, [0, 15], [0, 1]),
            }}
          >
            <h3
              style={{
                fontSize: 90,
                color: '#ffffff',
                fontFamily: 'Impact',
                margin: 0,
              }}
            >
              EVENT RULES
            </h3>
            <h2
              style={{
                fontSize: 110,
                color: '#00f0ff',
                fontFamily: 'Impact',
                margin: '10px 0 0 0',
              }}
            >
              2026.01.31 22:00
            </h2>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '42%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
            }}
          >
            {['GLOVE', 'NO BOOSTER', 'FREE STYLE', 'ONE SHOT'].map(
              (rule, i) => {
                const ruleFrame = frame - startVs - i * 8;
                const ruleSpr = spring({
                  frame: ruleFrame,
                  fps,
                  config: { damping: 15, stiffness: 200 },
                });
                if (ruleFrame < 0) return null;
                return (
                  <div
                    key={rule}
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                      padding: '20px 80px',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.2)',
                      width: 750,
                      textAlign: 'center',
                      transform: `translateX(${interpolate(ruleSpr, [0, 1], [width, 0])}px)`,
                      boxShadow: '0 0 20px rgba(0, 240, 255, 0.05)',
                    }}
                  >
                    <span
                      style={{
                        color: 'white',
                        fontSize: 60,
                        fontWeight: 900,
                        fontFamily: 'Impact',
                      }}
                    >
                      {rule === 'ONE SHOT' ? '💥 ' : '💎 '} {rule}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 6. ENDING */}
      <Sequence from={startEnd} durationInFrames={END_DURATION}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <AbsoluteFill style={{ zIndex: -1, opacity: 0.5 }}>
            <LensFlare />
          </AbsoluteFill>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                opacity: interpolate(frame - startEnd, [5, 25], [0, 1]),
                transform: `scale(${interpolate(frame - startEnd, [5, 25], [0.5, 1], { easing: Easing.out(Easing.back(1.5)) })})`,
                margin: '40px 0',
              }}
            >
              <Img
                src={staticFile('video-factory/images/logo/logo.png')}
                style={{ width: 600, filter: 'drop-shadow(0 0 30px #00f0ff)' }}
              />
            </div>
            <div
              style={{
                opacity: interpolate(frame - startEnd, [15, 35], [0, 1]),
              }}
            >
              <h2 style={{ fontSize: 60, color: 'white', fontWeight: 900 }}>
                応援よろしくお願いします！
              </h2>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* OVERLAY FLASH */}
      <AbsoluteFill
        style={{
          backgroundColor: 'white',
          opacity: flashOpacity,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
