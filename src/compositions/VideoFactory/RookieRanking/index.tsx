import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Opening } from './Opening';
import { NextPage } from './NextPage';
import { AdditionalEffect } from './AdditionalEffect';
import { RankingAnnouncement } from './RankingAnnouncement';
import { Ending } from './Ending';

export const RookieRanking: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e', color: 'white' }}>
      {/* 0-5s: オープニング (150フレーム) */}
      <Sequence from={0} durationInFrames={150}>
        <Opening />
      </Sequence>

      {/* 5-9s: 次のページ (120フレーム) */}
      <Sequence from={150} durationInFrames={120}>
        <NextPage />
      </Sequence>

      {/* 9-14s: 追加演出 (150フレーム) */}
      <Sequence from={270} durationInFrames={150}>
        <AdditionalEffect />
      </Sequence>

      {/* 14-19.5s: 3位発表 (165フレーム) */}
      <Sequence from={420} durationInFrames={165}>
        <RankingAnnouncement rank={3} color="#cd7f32" /> {/* 銅 */}
      </Sequence>

      {/* 19.5-25s: 2位発表 (165フレーム) */}
      <Sequence from={585} durationInFrames={165}>
        <RankingAnnouncement rank={2} color="#c0c0c0" /> {/* 銀 */}
      </Sequence>

      {/* 25-37s: 1位発表 (360フレーム) */}
      <Sequence from={750} durationInFrames={360}>
        <RankingAnnouncement rank={1} color="#ffd700" /> {/* 金 */}
      </Sequence>

      {/* 37-42s: エンディング (150フレーム) */}
      <Sequence from={1110} durationInFrames={150}>
        <Ending />
      </Sequence>
    </AbsoluteFill>
  );
};
