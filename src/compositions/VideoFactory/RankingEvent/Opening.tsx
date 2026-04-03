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

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beatScale = 1;

  // Staggered springs for each part
  const createSpring = (delay: number) => spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const spr1 = createSpring(0);   // J.O.L (最上段)
  const spr4 = createSpring(15);  // 団結No.1 (2段目)
  const spr2 = createSpring(30);  // イベント (3段目)
  const spr3 = createSpring(45);  // ランキング (4段目)
  const spr5 = createSpring(60);  // 結果発表 (5段目)

  // Glitch intensity
  const glitchIntensity = 0;

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
          src={staticFile('assets/pixabay/videos/absturact-turing.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(2.5) rotate(90deg)', 
          }}
          startFrom={0}
          playbackRate={1}
          muted
          loop
        />
        {/* Deep Matte Overlay matching Top1Reveal */}
        <AbsoluteFill style={{ backgroundColor: 'rgba(0,10,5,0.4)' }} />
        
        {/* Gold Tint Overlay matching AdjustmentLayer (rank 1) */}
        <AbsoluteFill style={{
          background: 'linear-gradient(to bottom, #FFD70000, #FFD7001a)',
          mixBlendMode: 'overlay',
        }} />

        {/* Gold Center Glow matching AdjustmentLayer (rank 1) */}
        <AbsoluteFill style={{
          background: 'radial-gradient(circle, #FFD70033 0%, transparent 60%)',
          mixBlendMode: 'screen',
          filter: 'blur(40px)',
        }} />

        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.4) 100%)', 
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
            <NeonGlowText text="J.O.L" fontSize={230} color="#FFFFFF" glowColor="#f85718" />
          </div>
          <div style={{ ...getEntryStyle(spr4, 'bottom'), transform: `${getEntryStyle(spr4, 'bottom').transform} scale(0.8)` }}>
            <NeonGlowText text="団結No.1" fontSize={160} color="#FFFFFF" glowColor="rgba(248, 87, 24, 0.6)" />
          </div>
          
          <div style={getEntryStyle(spr2, 'bottom')}>
            <NeonGlowText text="イベント" fontSize={120} color="#FFFFFF" glowColor="#f85718" />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
          <div style={{ ...getEntryStyle(spr3, 'top'), display: 'flex', alignItems: 'center' }}>
            <NeonGlowText text="ランキング" fontSize={160} color="#FFFFFF" glowColor="#f85718" />
          </div>
            <div style={getEntryStyle(spr5, 'top')}>
              <NeonGlowText text="結果発表" fontSize={180} color="#FFFFFF" glowColor="#f85718" />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
