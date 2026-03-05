import React, { useEffect, useRef, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, Img, staticFile, Series, Audio } from 'remotion';
import gsap from 'gsap';
import timelineData from '../../../generated_timeline.json';

// 字幕データの型定義
interface Subtitle {
  text: string;
  start: number;
  end: number;
}

const GenkitScene: React.FC<{
  imageSrc: string;
  duration: number;
  subtitles: Subtitle[];
  sceneStartFrame: number;
}> = ({ imageSrc, duration, subtitles, sceneStartFrame }) => {
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement>(null);

  // 現在のフレームに該当する字幕を探す
  const currentSubtitle = subtitles.find(s => {
    const sStart = Math.floor(s.start * 30); // 30fps換算
    const sEnd = Math.floor(s.end * 30);
    const globalFrame = frame + sceneStartFrame;
    return globalFrame >= sStart && globalFrame < sEnd;
  });

  useEffect(() => {
    if (containerRef.current && currentSubtitle) {
      // 字幕が切り替わったタイミングでアニメーション
      gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
      );
    }
  }, [currentSubtitle?.text]);

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
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 150,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
        }}
      >
        <div
          ref={containerRef}
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 0 20px rgba(0,0,0,0.8)',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            padding: '0 50px',
            minHeight: '1.2em',
          }}
        >
          {currentSubtitle?.text || ''}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GenkitComposition: React.FC = () => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  useEffect(() => {
    // subtitles.json を動的にインポート（存在しない場合は空配列）
    import('./subtitles.json')
      .then((data) => setSubtitles(data.default))
      .catch(() => console.warn('subtitles.json not found'));
  }, []);

  // 各シーンの開始フレームを計算
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
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
