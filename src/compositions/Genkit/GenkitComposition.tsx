import React, { useEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile, Series } from 'remotion';
import gsap from 'gsap';
import timelineData from '../../../generated_timeline.json';

const GenkitScene: React.FC<{
  imageSrc: string;
  textPrimary: string;
  textSecondary: string;
  duration: number;
}> = ({ imageSrc, textPrimary, textSecondary, duration }) => {
  const frame = useCurrentFrame();
  const textRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && secondaryRef.current) {
      // Simple kinetic typography with GSAP
      gsap.fromTo(
        textRef.current,
        { x: -100, opacity: 0, scale: 0.5 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }
      );
      gsap.fromTo(
        secondaryRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  const scale = 1 + (frame / duration) * 0.1; // Gentle zoom in

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
      <Img
        src={staticFile(imageSrc)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      >
        <div
          ref={textRef}
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 0 20px rgba(0,0,0,0.8)',
            fontFamily: 'sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          {textPrimary}
        </div>
        <div
          ref={secondaryRef}
          style={{
            fontSize: 48,
            color: '#00ffcc',
            textShadow: '0 0 10px rgba(0,0,0,0.8)',
            fontFamily: 'sans-serif',
            marginTop: 20,
            letterSpacing: '0.05em',
          }}
        >
          {textSecondary}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GenkitComposition: React.FC = () => {
  return (
    <Series>
      {timelineData.timeline.map((scene, index) => (
        <Series.Sequence key={scene.id} durationInFrames={scene.duration_frames}>
          <GenkitScene
            imageSrc={timelineData.generated_assets.images[index]}
            textPrimary={scene.text_primary}
            textSecondary={scene.text_secondary}
            duration={scene.duration_frames}
          />
        </Series.Sequence>
      ))}
    </Series>
  );
};
