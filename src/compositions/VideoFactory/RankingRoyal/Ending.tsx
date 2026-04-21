import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { OffthreadVideo, staticFile, Img } from 'remotion';

export type EndingProps = {
  videoSrc: string;
};

export const Ending: React.FC<EndingProps> = ({ videoSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const scale = interpolate(entrance, [0, 1], [0.93, 1]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 1. 背景動画 */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo
          src={staticFile(videoSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.3) contrast(1.1) blur(10px)',
            opacity: 0.8,
          }}
          startFrom={600}
          muted
          playbackRate={0.8}
        />
      </AbsoluteFill>

      {/* 2. JOL ロゴを右下に配置する */}
      <div style={{ position: 'absolute', bottom: 80, right: 80, zIndex: 10 }}>
        <Img 
          src={staticFile('jol-logo-800.png')} 
          style={{
            width: 350,
            height: 'auto',
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))',
            opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [40, 70], [20, 0], { extrapolateRight: 'clamp' })}px)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
