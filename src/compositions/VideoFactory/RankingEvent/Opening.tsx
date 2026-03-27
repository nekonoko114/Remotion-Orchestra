import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Video,
  staticFile,
  spring,
} from 'remotion';
import { NeonGlowText } from '../../../components/effects/NeonGlowText';
import { useBeatValue } from '../utils/beat-sync';

const BPM = 194;

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { pulse } = useBeatValue(BPM);

  const entrance = spring({
    frame,
    fps: 60,
    config: { damping: 10, stiffness: 200 },
  });

  const entranceScale = interpolate(entrance, [0, 1], [0.5, 1]);
  const beatScale = 1 + pulse * 0.04;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#000',
        transform: `scale(${entranceScale * beatScale})`,
      }}
    >
      <AbsoluteFill style={{ zIndex: -1 }}>
        <Video
          src={staticFile('assets/backgrounds/fire-ulf.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'hue-rotate(100deg) brightness(1.2) contrast(1.1) saturate(1.2)',
            transform: 'scale(1.1)',
          }}
          startFrom={0}
          playbackRate={1}
          muted
        />
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.8) 100%)', 
          }}
        />
      </AbsoluteFill>


      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '10px',
          }}
        >
          <NeonGlowText text="J.O.L" fontSize={230} color="#FFFFFF" glowColor="#00FF7F" delay={5} />
          <NeonGlowText text="EVENT" fontSize={120} color="#FFFFFF" glowColor="#0088FF" delay={20} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <NeonGlowText text="RANKING" fontSize={160} color="#FFFFFF" glowColor="#00FF7F" delay={35} />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ transform: 'scale(0.8)' }}>
              <NeonGlowText text="SPECIAL" fontSize={160} color="#FFFFFF" glowColor="rgba(0,255,100,0.4)" delay={50} />
            </div>
            <NeonGlowText text="結果発表" fontSize={180} color="#FFFFFF" glowColor="#00FF00" delay={65} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
