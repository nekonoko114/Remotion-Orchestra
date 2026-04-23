import { AbsoluteFill, interpolate } from 'remotion';
import { TransitionPresentationComponentProps } from '@remotion/transitions';

export const EtherealGoldSweep: React.FC<TransitionPresentationComponentProps<{ color?: string, glareColor?: string }>> = (
  props
) => {
  const { children } = props;
  // 実行環境によってプロパティ名が異なるケースに対応
  const p = props as any;
  const progress = p.progress ?? p.presentationProgress ?? 0;
  const presentationArgs = p.presentationArgs ?? p.passedProps ?? {};
  
  const { color = '#F7E7CE', glareColor = '#00FF88' } = presentationArgs;
  
  // Wipe from left to right with a diagonal tilt
  const translateX = interpolate(progress, [0, 1], [-100, 100]);
  const rotation = -15; // Degree

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 映像本体（これがないと画面が消える） */}
      {children}
      
      {/* 1. Main Gold Sweep Bar */}
      <div style={{
          position: 'absolute',
          top: '-20%',
          left: `${translateX}%`,
          width: '60%',
          height: '140%',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          transform: `rotate(${rotation}deg)`,
          boxShadow: `0 0 100px ${color}88`,
          zIndex: 10,
          opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
      }} />

      {/* 2. Emerald Glare Follower */}
      <div style={{
          position: 'absolute',
          top: '-20%',
          left: `${translateX - 15}%`,
          width: '50%',
          height: '140%',
          background: `linear-gradient(90deg, transparent, ${glareColor}44, transparent)`,
          transform: `rotate(${rotation}deg)`,
          filter: 'blur(30px)',
          zIndex: 5,
          opacity: interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.8, 0.8, 0]),
      }} />

      {/* 3. Global Color Flash at midpoint */}
      <AbsoluteFill style={{
          backgroundColor: color,
          opacity: interpolate(progress, [0, 0.5, 1], [0, 0.4, 0]),
          mixBlendMode: 'screen',
          zIndex: 2,
      }} />
    </AbsoluteFill>
  );
};

export const etherealGoldSweep = (args?: { color?: string, glareColor?: string }) => {
    return {
        component: EtherealGoldSweep,
        props: args || {},
    };
};
