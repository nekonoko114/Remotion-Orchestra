import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { NeonGlowText } from '../../../components/effects/NeonGlowText';

export type OpeningProps = {
  videoSrc: string;
  title1: string;
  title2: string;
  title3: string;
  date: string;
  subtitle: string;
};

export const Opening: React.FC<OpeningProps> = ({
  videoSrc,
  title1,
  title2,
  title3,
  date,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  const intensity = interpolate(
    frame,
    [0, 50, 110, 145, 165],
    [0.5, 0.8, 1.2, 1.8, 2.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const totalShakeX = (random(`shake-x-${frame}`) - 0.5) * intensity;
  const totalShakeY = (random(`shake-y-${frame}`) - 0.5) * intensity;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#000',
        transform: `translate(${totalShakeX}px, ${totalShakeY}px)`,
      }}
    >
      <AbsoluteFill style={{ zIndex: -1 }}>
        <OffthreadVideo
          src={staticFile(videoSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.7) contrast(1.2)',
            transform: 'scale(1.25)',
            mixBlendMode: 'screen',
          }}
          startFrom={0}
          playbackRate={1}
          muted
        />
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '50px', // Shifted slightly down for better centering with many lines
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px', // Increased gap between main sections
          }}
        >
          <NeonGlowText text={title1} fontSize={230} color="#FF0000" glowColor="#CC0000" delay={5} />
          <div style={{ margin: '10px 0' }}>
            <NeonGlowText text={title2} fontSize={124} color="#00f2ff" glowColor="#0088ff" delay={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <NeonGlowText text={title3} fontSize={140} color="#FFD700" glowColor="#FF8C00" delay={35} />
          </div>
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NeonGlowText text={subtitle} fontSize={160} color="#FFD700" glowColor="#FF8C00" delay={65} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
