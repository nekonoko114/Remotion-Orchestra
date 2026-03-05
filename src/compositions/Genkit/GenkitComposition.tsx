import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile, Series, Audio } from 'remotion';
import gsap from 'gsap';
import { z } from 'zod';
import timelineData from '../../../generated_timeline.json';

// 字幕データの型定義
interface Subtitle {
  text: string;
  start: number;
  end: number;
}

export const genkitCompositionSchema = z.object({
  title: z.string(),
  concept: z.string(),
});

/**
 * 1. StaggerFade: 文字が1つずつふわっと出現
 */
const StaggerFade: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chars = text.split('');

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.char');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 0.8, 
          stagger: 0.05, 
          ease: 'power3.out' 
        }
      );
    }
  }, [text]);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {chars.map((char, i) => (
        <span key={i} className="char" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {char}
        </span>
      ))}
    </div>
  );
};

/**
 * 2. GlitchEffect: 激しい揺れと色の変化
 */
const GlitchEffect: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { skewX: 20, scale: 1.2, opacity: 0 },
        { skewX: 0, scale: 1, opacity: 1, duration: 0.2, ease: 'rough' }
      );
    }
  }, [text]);

  // フレームに基づいた微細な揺れ
  const offsetX = Math.sin(frame * 2.1) * 2;
  const offsetY = Math.cos(frame * 1.8) * 2;

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        color: frame % 4 < 2 ? '#ff00ff' : '#00ffff',
        textShadow: '2px 2px #ff0000, -2px -2px #0000ff',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 3. FloatAndRotate: 3D的な浮遊感
 */
const FloatAndRotate: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { rotationY: 90, z: -500, opacity: 0 },
        { rotationY: 0, z: 0, opacity: 1, duration: 1.5, ease: 'expo.out' }
      );
    }
  }, [text]);

  const floatY = Math.sin(frame / 15) * 10;
  const rotateZ = Math.cos(frame / 25) * 2;

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translateY(${floatY}px) rotateZ(${rotateZ}deg)`,
        perspective: '1000px',
      }}
    >
      {text}
    </div>
  );
};

const GenkitScene: React.FC<{
  imageSrc: string;
  duration: number;
  subtitles: Subtitle[];
  sceneStartFrame: number;
  sceneIndex: number;
}> = ({ imageSrc, duration, subtitles, sceneStartFrame, sceneIndex }) => {
  const frame = useCurrentFrame();
  
  const currentSubtitle = subtitles.find(s => {
    const sStart = Math.floor(s.start * 30);
    const sEnd = Math.floor(s.end * 30);
    const globalFrame = frame + sceneStartFrame;
    return globalFrame >= sStart && globalFrame < sEnd;
  });

  const scale = 1 + (frame / duration) * 0.1;

  // シーンや字幕の内容に合わせてアニメーションを切り替える
  const AnimationComponent = useMemo(() => {
    const type = sceneIndex % 3;
    if (type === 0) return StaggerFade;
    if (type === 1) return GlitchEffect;
    return FloatAndRotate;
  }, [sceneIndex]);

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
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 200,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 0 30px rgba(0,0,0,1)',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            padding: '0 60px',
          }}
        >
          {currentSubtitle && <AnimationComponent text={currentSubtitle.text} />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GenkitComposition: React.FC<z.infer<typeof genkitCompositionSchema>> = ({ title, concept }) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  useEffect(() => {
    import('./subtitles.json')
      .then((data) => setSubtitles(data.default))
      .catch(() => console.warn('subtitles.json not found'));
  }, []);

  let currentStart = 0;

  return (
    <AbsoluteFill>
      {timelineData.generated_assets.music && (
        <Audio src={staticFile(timelineData.generated_assets.music)} />
      )}
      <Series>
        {timelineData.timeline.map((scene, index) => {
          const startFrame = currentStart;
          currentStart += scene.duration_frames;
          return (
            <Series.Sequence key={scene.id} durationInFrames={scene.duration_frames}>
              <GenkitScene
                imageSrc={timelineData.generated_assets.images[index]}
                duration={scene.duration_frames}
                subtitles={subtitles}
                sceneStartFrame={startFrame}
                sceneIndex={index}
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
