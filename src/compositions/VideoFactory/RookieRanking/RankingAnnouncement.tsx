import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';
import { SpeedLines } from './AmecomiElements';
import { LuxuryJapaneseFont } from './fonts';
import { useBeat, BeatShake, GlitchOverlay } from './BeatSync';



export const RankingAnnouncement: React.FC<{ rank: number, color: string, name?: string, duration: number, bpm?: number, iconUrl?: string }> = ({ rank, color, name = "USER NAME", duration, bpm = 160, iconUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { kickStrength } = useBeat(bpm);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const baseScale = interpolate(entrance, [0, 1], [0, 1.1]);
  
  // Final Zoom: At the last 15 frames, scale up massively to 2.5x
  const finalZoom = interpolate(
    frame,
    [duration - 15, duration],
    [1, 2.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const textScale = baseScale * finalZoom;
  const rankImage = rank === 1 
    ? "assets/images/gold.svg" 
    : rank === 2 
      ? "assets/images/silver.svg" 
      : "assets/images/copper.svg";

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <GlitchOverlay bpm={bpm} />
      
      <BeatShake bpm={bpm}>
        {/* Background Layer (Moved to root index.tsx, keeping overlay here) */}
        <AbsoluteFill>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: rank === 1 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(26, 26, 46, 0.3)',
            mixBlendMode: 'overlay',
          }} />
        </AbsoluteFill>

        {/* Dynamic Overlay Effects */}
        <AbsoluteFill style={{ transform: `scale(${finalZoom * 0.2})`, opacity: 0.5 }}>
          <SpeedLines />
        </AbsoluteFill>

        {/* Rank Image (Centered & Pulsing, Moved below profile) */}
        <div style={{
          position: 'absolute',
          left: "50%",
          transform: `translateX(-50%) scale(${textScale * 0.9})`,
          top: 1550,
          width: 800,
          height: 300,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Contrast Backdrop */}
          <div style={{
            position: 'absolute',
            width: '60%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            filter: 'blur(40px)',
            borderRadius: '50%',
            zIndex: -1,
          }} />
          
          <Img 
            src={staticFile(rankImage)} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              filter: `drop-shadow(0 0 20px black) drop-shadow(0 0 40px ${color}88) contrast(1.2) brightness(1.1)`,
            }} 
          />
        </div>

        {/* Profile Frame (Smaller to show background) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${textScale * 0.7})`, 
          width: 750, 
          height: 750,
          borderRadius: "50%",
          border: `12px solid ${color}`,
          backgroundColor: '#111',
          boxShadow: `0 0 ${30 + kickStrength * 40}px ${color}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 6,
        }}>
          {iconUrl ? (
            <Img
              src={staticFile(iconUrl)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ 
              fontSize: 40, 
              color: color, 
              fontWeight: 'bold', 
              textAlign: 'center',
              opacity: 0.5 + kickStrength * 0.5
            }}>
              PHOTO<br/>OR<br/>VIDEO
            </div>
          )}
        </div>

        {/* Name Label (Premium Horizontal Plate) */}
        <div style={{
          position: 'absolute',
          bottom: 450,
          left: '50%',
          transform: `translateX(-50%) scale(${textScale})`,
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20,
        }}>
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            padding: '20px 60px',
            border: `3px solid ${color}`,
            borderRadius: '10px',
            boxShadow: `0 0 20px ${color}44`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 400,
          }}>
            <span style={{
              fontFamily: LuxuryJapaneseFont,
              fontSize: 70,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.05em',
              textShadow: `0 0 10px ${color}`,
            }}>
              {name}
            </span>
          </div>
        </div>
      </BeatShake>
    </AbsoluteFill>
  );
};
