import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
} from 'remotion';

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const scaleFactor = width / 1080;

  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.2], {
    extrapolateRight: 'clamp',
  });

  const rayRotate = frame * 0.2;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', zIndex: 5000 }}>
      <AbsoluteFill style={{ zIndex: 1 }}>
        <AbsoluteFill>
          <Img
            src={staticFile('assets/backgrounds/rank_3_bg.webp')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.5)',
              transform: `scale(${bgScale})`,
            }}
          />
        </AbsoluteFill>

        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile('assets/backgrounds/purple_loop.mp4')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              mixBlendMode: 'screen',
              filter: 'contrast(1.5) brightness(0.9)',
            }}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at center, rgba(160, 0, 255, 0.15) 0%, transparent 80%)',
            mixBlendMode: 'screen',
          }}
        />
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          width: width * 2,
          height: width * 2,
          background: `conic-gradient(from ${rayRotate}deg, 
                            transparent 0deg, 
                            rgba(0, 240, 255, 0.3) 20deg, 
                            transparent 40deg, 
                            rgba(0, 100, 255, 0.3) 60deg, 
                            transparent 80deg, 
                            rgba(0, 240, 255, 0.3) 100deg, 
                            transparent 120deg, 
                            rgba(0, 100, 255, 0.3) 140deg, 
                            transparent 160deg
                        )`,
          zIndex: 1,
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          filter: `blur(${80 * scaleFactor}px)`,
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: 1,
          zIndex: 9000,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 1200 * scaleFactor,
            height: 1200 * scaleFactor,
            background:
              'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, rgba(0, 50, 255, 0.1) 40%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            mixBlendMode: 'screen',
            filter: `blur(${60 * scaleFactor}px)`,
          }}
        />

        <div
          style={{
            position: 'relative',
            width: 800 * scaleFactor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${scale})`,
            filter: `drop-shadow(0px ${20 * scaleFactor}px ${60 * scaleFactor}px rgba(0, 0, 0, 1)) drop-shadow(0px 0px ${30 * scaleFactor}px rgba(0, 240, 255, 0.2))`,
            zIndex: 9001,
          }}
        >
          <Img
            src={staticFile('jol-logo-800.png')}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
