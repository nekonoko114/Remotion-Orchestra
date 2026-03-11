import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const RankingAnnouncement: React.FC<{ rank: number, color: string }> = ({ rank, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // スケールインアニメーション
  const scale = spring({
    frame,
    fps,
    config: { damping: 10 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
      
      {/* 順位表示 */}
      <div style={{
        position: 'absolute',
        top: 150,
        fontSize: 120,
        fontWeight: 'bold',
        color: color,
        textShadow: `0 0 20px ${color}`
      }}>
        {rank}位
      </div>

      {/* アイコン/動画枠（モック） */}
      <div style={{
        width: 600,
        height: 600,
        borderRadius: 300,
        border: `20px solid ${color}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale})`,
        backgroundColor: '#2c3e50',
        boxShadow: `0 0 50px ${color}`
      }}>
        <span style={{ fontSize: 60, color: 'white' }}>アイコン / 動画</span>
      </div>

      {/* ユーザー名テキスト枠（モック） */}
      <div style={{
        position: 'absolute',
        bottom: 300,
        width: 800,
        height: 150,
        backgroundColor: color,
        borderRadius: 75,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale})`,
      }}>
        <span style={{ fontSize: 70, fontWeight: 'bold', color: '#1a1a2e' }}>
          ユーザー名
        </span>
      </div>
      
    </AbsoluteFill>
  );
};
