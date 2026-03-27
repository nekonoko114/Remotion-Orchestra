import type React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import RANKING_DATA_JSON from './data.json';
import FETCHED_USERS_JSON from '../../../jol-liver.json';
import type { Liver } from './types';

const RANKING_DATA = RANKING_DATA_JSON as unknown as Liver[];

// Define type for fetched users
type FetchedUser = {
  id: string;
  nickname: string;
  avatar: string;
  localAvatar: string;
};

const FETCHED_USERS = FETCHED_USERS_JSON as FetchedUser[];

const BPM = 152;

export const GridBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Timing setup based on BPM 152
  const beatFrames = (60 / BPM) * fps;

  // Ensure TOP 10 data is prioritized and formatted
  const top10Items = RANKING_DATA.map((liver) => {
    // Try to find the downloaded avatar
    const liverId = liver.id || liver.username;
    const fetchedMatch = FETCHED_USERS.find((fu) => fu.id === liverId);

    // Priority: localAvatar (if valid) -> saved_to (from data.json) -> image_url
    let avatarPath = liver.saved_to;
    if (fetchedMatch && fetchedMatch.localAvatar) {
      avatarPath = fetchedMatch.localAvatar;
    } else if (!liver.saved_to) {
      avatarPath = liver.image_url;
    }

    return {
      id: liver.id || liver.username,
      avatarPath,
      liver,
      rank: liver.rank,
      isTop10: true,
      nickname: liver.nickname,
    };
  });

  // Get successfully downloaded other users, excluding top 10 to avoid duplicates
  const top10Usernames = top10Items.map((item) => item.id);
  const otherUsers = FETCHED_USERS.filter(
    (u) => u.localAvatar && u.localAvatar !== '',
  ) // Only users with images
    .filter((u) => !top10Usernames.includes(u.id)) // Exclude top 10
    .map((u) => ({
      id: u.id,
      avatarPath: u.localAvatar,
      liver: null,
      rank: 99, // Lower rank priority
      isTop10: false,
      nickname: u.nickname === 'Not Found' ? u.id : u.nickname,
    }));

  // Combine them. To make the grid look mixed, we can interleave them or just append.
  // Let's just append and rely on the grid wrapping.
  // 均一にするため、3の倍数に切り捨てます
  const combinedItemsRaw = [...top10Items, ...otherUsers];
  const uniformCount = Math.floor(combinedItemsRaw.length / 3) * 3;
  const combinedItems = combinedItemsRaw.slice(0, uniformCount);

  // Split into 3 rows
  const rows: any[][] = [[], [], []];
  combinedItems.forEach((item, index) => {
    const rowIndex = index % 3;
    rows[rowIndex].push(item);
  });

  // Overall tilt
  const rotation = -6;

  // "Gathering" logic for Top 3 (Ranks 1, 2, 3)
  const getGatherOffset = (rowIndex: number, rank: number) => {
    if (rank > 3) return { x: 0, y: 0 };

    const gatherProgress = interpolate(
      frame,
      [beatFrames * 6, beatFrames * 14],
      [0, 1],
      {
        easing: Easing.out(Easing.back(2)),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      },
    );

    // Move towards middle row (rowIndex 1)
    let offsetY = 0;
    if (rowIndex === 0) offsetY = gatherProgress * 200;
    if (rowIndex === 2) offsetY = -gatherProgress * 200;

    return { x: 0, y: offsetY };
  };

  const rowHeight = 1900 / 3;
  const itemWidth = 500;
  const gap = 20;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `rotate(${rotation}deg) scale(1.4)`, // 元のスケールに戻す
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {rows.map((rowItems, rowIndex) => {
          // 画像をループさせるため配列を繰り返す (約20枚/行を2周させる)
          const rowLong = [...rowItems, ...rowItems];
          const totalRowWidth = rowItems.length * (itemWidth + gap); // 1セットの長さを全体の幅とする

          // 行ごとのスピードと方向
          const speed = rowIndex % 2 === 0 ? 30 : 35;
          const direction = rowIndex % 2 === 0 ? -1 : 1;

          // 継続的な移動
          const baseOffset = (frame * speed * direction) % totalRowWidth;

          return (
            <div
              key={rowIndex}
              style={{
                display: 'flex',
                height: rowHeight,
                transform: `translateX(${baseOffset - totalRowWidth / 2}px)`,
                gap: gap,
                marginBottom: 20,
                whiteSpace: 'nowrap',
              }}
            >
              {rowLong.map((item, colIndex) => {
                const { y: oy } = getGatherOffset(rowIndex, item.rank);
                const isTop3 = item.rank <= 3;

                const opacity = isTop3
                  ? 1
                  : interpolate(
                      frame,
                      [beatFrames * 15, beatFrames * 18],
                      [1, 0.75],
                      {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      },
                    );

                // Remove leading slash if present to make staticFile path relative to public/
                // localAvatar is usually "/assets/avatars/..." so we make it "assets/avatars/..."
                let imageSourcePath = item.avatarPath;
                if (imageSourcePath && imageSourcePath.startsWith('/')) {
                  imageSourcePath = imageSourcePath.substring(1);
                }

                // For HTTP urls (fallback), just pass as string.
                let imageSource = imageSourcePath;
                if (imageSourcePath && !imageSourcePath.startsWith('http')) {
                  imageSource = staticFile(imageSourcePath);
                }

                return (
                  <div
                    key={colIndex}
                    style={{
                      width: itemWidth,
                      height: rowHeight - 40,
                      position: 'relative',
                      transform: `translate(0, ${oy}px)`,
                      opacity,
                      borderRadius: 20,
                      flexShrink: 0,
                      overflow: 'hidden',
                      border: isTop3 ? '12px solid #FFD700' : '4px solid #444',
                      boxShadow: isTop3
                        ? '0 0 50px rgba(255, 215, 0, 0.8)'
                        : 'none',
                      backgroundColor: '#111', // Placeholder for when image takes time to load
                    }}
                  >
                    {imageSource && (
                      <Img
                        src={imageSource}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    {/* Add nickname overlay for non-top 3 to make it look active */}
                    {!isTop3 && (
                      <AbsoluteFill
                        style={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    {!isTop3 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 15,
                          left: 15,
                          right: 15,
                          color: 'white',
                          fontSize: 30,
                          fontWeight: 'bold',
                          textShadow: '0 2px 5px rgba(0,0,0,1)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.nickname}
                      </div>
                    )}
                    {isTop3 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 20,
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: '#FFD700',
                          fontSize: 60,
                          fontWeight: 'bold',
                          padding: '10px 0',
                        }}
                      >
                        {item.rank}位
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          backgroundColor: '#fff',
          opacity: interpolate(
            frame,
            [beatFrames * 18, beatFrames * 20],
            [0, 1],
            { extrapolateLeft: 'clamp' },
          ),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
