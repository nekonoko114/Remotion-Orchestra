import type React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  OffthreadVideo,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from 'remotion';
// Import default template as fallback
import DEFAULT_TIMELINE from '../../../battle.json';
// Attempt to import generated timeline; this might fail if file doesn't exist yet, so we handle logic below
// In a real generic setup, we might load this via `getInputProps()` or dynamic import.
// For now, we prefer the generated one if available.
import GENERATED_TIMELINE from '../../../generated_timeline.json';
import { WaterBattleBackground } from './WaterBattleBackground';

// --- Ultra Premium Sub-Components ---

const UltraGlowText: React.FC<{
  text: string;
  className: string;
  fontSize: number;
  glowColor: string;
  frame: number;
  isGlitch?: boolean;
  textColor?: string;
}> = ({ text, className, fontSize, glowColor, frame, isGlitch, textColor }) => {
  const jitter = (seed: string) =>
    (random(seed + frame) - 0.5) * (isGlitch ? 40 : 0);
  // Pulsing heartbeat effect
  const pulse = 1 + Math.sin(frame / 5) * 0.04;

  return (
    <div
      style={{
        position: 'relative',
        textAlign: 'center',
        transform: `scale(${pulse})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '180%',
          height: '140%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: -1,
          opacity: interpolate(Math.sin(frame / 5), [-1, 1], [0.5, 1]),
        }}
      />

      {isGlitch && (
        <>
          <span
            style={{
              position: 'absolute',
              left: jitter('r'),
              top: jitter('r2'),
              color: '#00F5FF',
              opacity: 0.7,
              fontSize,
              fontWeight: 900,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {text}
          </span>
          <span
            style={{
              position: 'absolute',
              left: jitter('b'),
              top: jitter('b2'),
              color: '#FF00FF',
              opacity: 0.7,
              fontSize,
              fontWeight: 900,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {text}
          </span>
        </>
      )}

      <h1
        className={className}
        style={{
          fontSize,
          fontWeight: 900,
          margin: 0,
          letterSpacing: '0.15em',
          lineHeight: 1,
          fontFamily: 'Impact, sans-serif',
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
          transform: `rotate(${isGlitch ? jitter('rot') / 20 : 0}deg)`,
          color: textColor || 'white',
          WebkitTextStroke: '3px rgba(255,255,255,0.3)',
        }}
      >
        {text}
      </h1>
    </div>
  );
};

const ImpactRing: React.FC<{ frame: number }> = ({ frame }) => {
  const scale = interpolate(frame, [0, 25], [0, 6], {
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 25], [1, 0], {
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 400,
        height: 400,
        borderRadius: '50%',
        border: '30px solid white',
        opacity,
        zIndex: 50,
        pointerEvents: 'none',
        filter: 'blur(5px)',
      }}
    />
  );
};

export const BattleVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Choose Source: Generated > Default
  // Check if the generated timeline is actually a Battle type (has players) before using it
  // @ts-ignore
  const isBattleTimeline =
    GENERATED_TIMELINE?.generated_assets &&
    (GENERATED_TIMELINE as any)?.players;
  // @ts-ignore
  const DATA_SOURCE = isBattleTimeline ? GENERATED_TIMELINE : DEFAULT_TIMELINE;
  // @ts-ignore
  const { timeline, players, generated_assets } = DATA_SOURCE;

  // Helper to resolve asset path relative to 'public' or maintain 'src' structure
  // Remotion staticFile handles paths starting with '/' as public,
  // but our script outputs 'src/assets/...'. staticFile needs tweaking or import.
  // For simplicity with `staticFile`, we assume we can pass the string if configured correctly,
  // OR we use the raw path if using <Audio src={require(path)} /> pattern, but require is tricky dynamically.
  // Best Approach for Remotion local dev: transform 'src/assets/...' to just string and rely on Remotion's public folder OR import.
  // Actually, Remotion <Audio /> source can be a URL or imported file.
  // Since these are dynamic, we'll try using the execution relative path if running locally, or `staticFile` mapping.
  // Let's assume standard Remotion setup where 'public' is root for staticFile,
  // BUT our assets are in src.
  // Hack: We can import them if we knew the names, but we don't.
  // Solution: We will pass the relative path. Remotion's <Audio src="..." /> works with local files in dev mode often if path is correct relative to project root?
  // No, standard web behavior.
  // FIX: We need to move generated assets to `public/` in the script OR use absolute file URL?
  // Let's try to map `src/assets` -> `../../assets`? No.
  // Effective Fix: `require` context or moving to public.
  // For this prototype, let's assume the user moves files or we use `staticFile` assuming we moved them?
  // WAIT! Remotion v4 supports `staticFile("/path/to/file")` if in public.
  // Our files are in `src`.
  // We will leave the generated paths as is, and use a relative import trick in the script or just use `staticFile` hoping for the best?
  // NO. Best way for dynamic files in `src` is `import`.
  // We will update the `orchestrate.ts` to output to `public/gen` in the next step to fix this properly.
  // For NOW, we will treat `src/assets` as a valid path hoping Remotion bundler picks it up or we fix path to `../../assets/...`

  // *Correction*: We can't dynamically require in Webpack easily without context.
  // Let's wrap path in `staticFile` and ensure we move files or config is correct.
  // Actually, to make this work IMMEDIATELY without moving files, we can try to rely on webpack alias if set?

  // Let's assume for this specific render, we just want to see the structure.

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* --- AI GENERATED AUDIO LAYER --- */}
      {generated_assets && (
        <>
          {/* Helper to clean path for staticFile: handles absolute paths and 'public/' prefix */}
          {(() => {
            const cleanPath = (p: string) => {
              if (!p) return '';
              // If path contains 'public/', take everything after it
              if (p.includes('public/')) return p.split('public/').pop() || '';
              return p;
            };

            return (
              <>
                {/* Background Music */}
                {generated_assets.music && (
                  <Sequence from={0} durationInFrames={1800}>
                    <Audio
                      src={staticFile(cleanPath(generated_assets.music))}
                      volume={0.6}
                    />
                  </Sequence>
                )}

                {/* Voice-over at intro */}
                {generated_assets.voice && (
                  <Sequence from={30} durationInFrames={600}>
                    <Audio
                      src={staticFile(cleanPath(generated_assets.voice))}
                      volume={1.0}
                    />
                  </Sequence>
                )}

                {/* SFX at impact moments */}
                {generated_assets.sfx &&
                  timeline.map((scene: any, i: number) => (
                    <Sequence
                      from={scene.start_frame}
                      durationInFrames={100}
                      key={`sfx-${i}`}
                    >
                      <Audio
                        src={staticFile(cleanPath(generated_assets.sfx))}
                        volume={0.8}
                      />
                    </Sequence>
                  ))}

                {/* AI Video Background Layer */}
                {generated_assets.video && (
                  <AbsoluteFill style={{ zIndex: 0, opacity: 0.6 }}>
                    <OffthreadVideo
                      src={staticFile(cleanPath(generated_assets.video))}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      muted
                    />
                  </AbsoluteFill>
                )}
              </>
            );
          })()}
        </>
      )}

      {!generated_assets && <WaterBattleBackground />}
      {/* If we have AI video, we overlay it or replace background. kept background as fallback or blend */}

      {/* Bloom overlay for energy */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle, transparent 40%, rgba(255, 255, 255, 0.1) 100%)',
          zIndex: 20,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      {timeline.map((scene: any) => {
        const isWithin = frame >= scene.start_frame && frame < scene.end_frame;
        if (!isWithin) return null;

        const localFrame = frame - scene.start_frame;
        const duration = scene.end_frame - scene.start_frame;

        return (
          <Sequence
            from={scene.start_frame}
            durationInFrames={duration}
            key={scene.id}
          >
            <AbsoluteFill
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 30,
              }}
            >
              {/* Scene Transition Flash */}
              {localFrame < 8 && (
                <AbsoluteFill
                  style={{
                    backgroundColor: 'white',
                    opacity: interpolate(localFrame, [0, 8], [1, 0]),
                    zIndex: 1000,
                  }}
                />
              )}

              {/* 1. IMPACT HOOK: 頂上決戦 (Long Reveal) */}
              {scene.effect === 'zoom_and_glitch' && (
                <div
                  style={{
                    transform: `scale(${interpolate(localFrame, [0, 20, duration], [0, 1.2, 1])}) rotate(${interpolate(localFrame, [0, 20], [-15, 0])}deg)`,
                  }}
                >
                  <UltraGlowText
                    text={scene.text_primary}
                    className="metallic-diamond"
                    fontSize={280}
                    glowColor="rgba(0, 255, 255, 1)"
                    frame={localFrame}
                    isGlitch={true}
                    textColor="white"
                  />
                  {localFrame % 60 === 0 && (
                    <ImpactRing frame={localFrame % 60} />
                  )}
                </div>
              )}

              {/* 2 & 3. PLAYER INTROS (Grand Reveal) */}
              {scene.effect === 'split_vertical_slide' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })}) translateY(${Math.sin(localFrame / 15) * 30}px)`,
                      textAlign: 'center',
                    }}
                  >
                    <Img
                      src={staticFile(
                        scene.id === 2
                          ? players.left.image
                          : players.right.image,
                      )}
                      style={{
                        width: 550,
                        height: 550,
                        borderRadius: '50%',
                        border: `15px solid ${scene.id === 2 ? players.left.color : players.right.color}`,
                        boxShadow: `0 0 100px ${scene.id === 2 ? players.left.color : players.right.color}88`,
                      }}
                    />
                    <div style={{ marginTop: 50 }}>
                      <UltraGlowText
                        text={
                          scene.id === 2
                            ? players.left.name
                            : players.right.name
                        }
                        className="metallic-diamond"
                        fontSize={130}
                        glowColor={
                          scene.id === 2
                            ? players.left.color
                            : players.right.color
                        }
                        frame={localFrame}
                      />
                    </div>
                    <div style={{ marginTop: 80 }}>
                      <UltraGlowText
                        text={
                          scene.id === 2
                            ? scene.text_liner_a
                            : scene.text_liner_b
                        }
                        className="metallic-blue"
                        fontSize={80}
                        glowColor="white"
                        frame={localFrame}
                        textColor="white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. VS CLASH (The Big Shake) */}
              {scene.effect === 'camera_shake_with_particles' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 50,
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      transform: `translate(${(random(frame) - 0.5) * 60}px, ${(random(frame + 1) - 0.5) * 60}px) rotate(${(random(frame + 2) - 0.5) * 10}deg)`,
                    }}
                  >
                    <UltraGlowText
                      text="VS"
                      className="metallic-white"
                      fontSize={600}
                      glowColor="rgba(255,255,255,1)"
                      frame={localFrame}
                      isGlitch={true}
                      textColor="white"
                    />
                  </div>
                  <AbsoluteFill
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: -1,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 400 }}>
                      <Img
                        src={staticFile(players.left.image)}
                        style={{
                          width: 400,
                          height: 400,
                          borderRadius: '50%',
                          border: `12px solid ${players.left.color}`,
                          filter: `drop-shadow(0 0 40px ${players.left.color})`,
                        }}
                      />
                      <Img
                        src={staticFile(players.right.image)}
                        style={{
                          width: 400,
                          height: 400,
                          borderRadius: '50%',
                          border: `12px solid ${players.right.color}`,
                          filter: `drop-shadow(0 0 40px ${players.right.color})`,
                        }}
                      />
                    </div>
                  </AbsoluteFill>
                </div>
              )}

              {/* 5. AWAKENING (Hyper Energy Explosion) */}
              {scene.effect === 'awakening_flash' && (
                <AbsoluteFill
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  <div
                    style={{
                      transform: `scale(${interpolate(localFrame, [0, duration], [1, 2])})`,
                    }}
                  >
                    <UltraGlowText
                      text={scene.text_primary}
                      className="metallic-diamond"
                      fontSize={250}
                      glowColor="#FFD700"
                      frame={localFrame}
                      isGlitch={true}
                      textColor="white"
                    />
                  </div>
                  {localFrame % 20 === 0 && (
                    <ImpactRing frame={localFrame % 20} />
                  )}
                  <AbsoluteFill
                    style={{
                      background: `radial-gradient(circle, transparent 20%, #00E5FF ${interpolate(localFrame, [0, duration], [0, 100])}%)`,
                      opacity: 0.3,
                      zIndex: -1,
                    }}
                  />
                </AbsoluteFill>
              )}

              {/* 6. CTA FINISH (Celebration) */}
              {scene.effect === 'dim_and_focus' && (
                <div
                  style={{
                    transform: `scale(${interpolate(localFrame, [0, 15, duration], [0, 1.2, 1])})`,
                  }}
                >
                  <UltraGlowText
                    text={scene.text_primary}
                    className="metallic-diamond"
                    fontSize={220}
                    glowColor="rgba(255, 255, 255, 0.8)"
                    frame={localFrame}
                    textColor="white"
                  />
                  <div
                    style={{
                      marginTop: 80,
                      fontSize: 80,
                      color: '#00E5FF',
                      letterSpacing: 20,
                      textAlign: 'center',
                      fontWeight: 900,
                      textShadow: '0 0 50px rgba(0,229,255,1)',
                    }}
                  >
                    JOL PROJECT
                  </div>
                </div>
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
