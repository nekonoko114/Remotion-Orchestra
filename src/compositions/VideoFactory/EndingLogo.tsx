import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
} from 'remotion';

export const EndingLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 20, durationInFrames - 20, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  const logoSpring = spring({
    frame: frame - 10, // 少し遅れて登場
    fps,
    config: {
      damping: 14,
      mass: 0.8,
    },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* BASE BACKGROUND */}
      <AbsoluteFill>
        <Img
          src={staticFile('assets/backgrounds/dark_temple_bg_top6.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)',
          }}
        />
      </AbsoluteFill>

      {/* MIDDLE LAYER - RED LOOP with Luminance Key (Screen) */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('assets/backgrounds/red_loop.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'screen',
            filter: 'contrast(1.5) brightness(0.8)', // 黒をより沈ませて透過度を上げる
          }}
          muted
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
        }}
      >
        <div
          style={{
            transform: `scale(${scale * logoSpring})`,
            width: 800,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Img
            src={staticFile('jol-logo-800.png')}
            style={{
              width: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.8))',
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Cinematic Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
