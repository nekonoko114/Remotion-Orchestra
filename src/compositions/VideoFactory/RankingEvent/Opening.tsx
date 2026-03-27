import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Video,
  staticFile,
  spring,
  random,
} from 'remotion';
import { NeonGlowText } from '../../../components/effects/NeonGlowText';
import { useBeatValue } from '../utils/beat-sync';

const BPM = 194;

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeatValue(BPM);

  const beatScale = 1 + pulse * 0.04;

  // Staggered springs for each part
  const createSpring = (delay: number) => spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const spr1 = createSpring(0);   // J.O.L
  const spr2 = createSpring(15);  // EVENT
  const spr3 = createSpring(30);  // RANKING
  const spr4 = createSpring(45);  // SPECIAL
  const spr5 = createSpring(60);  // 結果発表

  // Glitch intensity
  const glitchIntensity = (pulse > 0.8 || random(frame) < 0.05) ? 15 : 2;

  const getEntryStyle = (spr: number, direction: 'top' | 'bottom' | 'center') => {
    const opacity = interpolate(spr, [0, 0.5], [0, 1]);
    const scale = interpolate(spr, [0, 1], [0.8, 1]);
    let translate = '0px';
    let blur = '0px';

    if (direction === 'top') {
      translate = `${interpolate(spr, [0, 1], [-200, 0])}px`;
      blur = `${interpolate(spr, [0, 1], [20, 0])}px`;
    } else if (direction === 'bottom') {
      translate = `${interpolate(spr, [0, 1], [200, 0])}px`;
      blur = `${interpolate(spr, [0, 1], [20, 0])}px`;
    }

    return {
      opacity,
      transform: `translateY(${translate}) scale(${scale})`,
      filter: `blur(${blur})`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#000',
        transform: `scale(${beatScale})`,
      }}
    >
      <AbsoluteFill style={{ zIndex: -1 }}>
        <Video
          src={staticFile('assets/pixabay/particles/particle-squere.mp4')}
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
            background: 'radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.2) 100%)', 
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
            transform: `translate(${random(frame) * glitchIntensity - glitchIntensity / 2}px, ${random(frame + 1) * glitchIntensity - glitchIntensity / 2}px)`,
          }}
        >
          <div style={getEntryStyle(spr1, 'top')}>
            <NeonGlowText text="J.O.L" fontSize={230} color="#FFFFFF" glowColor="#00FF7F" />
          </div>
          <div style={getEntryStyle(spr2, 'bottom')}>
            <NeonGlowText text="EVENT" fontSize={120} color="#FFFFFF" glowColor="#0088FF" />
          </div>
          <div style={{ ...getEntryStyle(spr3, 'top'), display: 'flex', alignItems: 'center' }}>
            <NeonGlowText text="RANKING" fontSize={160} color="#FFFFFF" glowColor="#00FF7F" />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ ...getEntryStyle(spr4, 'bottom'), transform: `${getEntryStyle(spr4, 'bottom').transform} scale(0.8)` }}>
              <NeonGlowText text="SPECIAL" fontSize={160} color="#FFFFFF" glowColor="rgba(0,255,100,0.4)" />
            </div>
            <div style={getEntryStyle(spr5, 'top')}>
              <NeonGlowText text="結果発表" fontSize={180} color="#FFFFFF" glowColor="#00FF00" />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
