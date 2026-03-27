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
import RANKING_DATA_JSON from '../data.json';
import FETCHED_USERS_JSON from '../../../../jol-liver.json';
import type { Liver } from '../types';

const RANKING_DATA = RANKING_DATA_JSON as unknown as Liver[];

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

  const beatFrames = (60 / BPM) * fps;

  const top10Items = RANKING_DATA.map((liver) => {
    const liverId = liver.id || liver.username;
    const fetchedMatch = FETCHED_USERS.find((fu) => fu.id === liverId);

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

  const top10Usernames = top10Items.map((item) => item.id);
  const otherUsers = FETCHED_USERS.filter((u) => u.localAvatar && u.localAvatar !== '')
    .filter((u) => !top10Usernames.includes(u.id))
    .map((u) => ({
      id: u.id,
      avatarPath: u.localAvatar,
      liver: null,
      rank: 99,
      isTop10: false,
      nickname: u.nickname === 'Not Found' ? u.id : u.nickname,
    }));

  const combinedItemsRaw = [...top10Items, ...otherUsers];
  const uniformCount = Math.floor(combinedItemsRaw.length / 3) * 3;
  const combinedItems = combinedItemsRaw.slice(0, uniformCount);

  const rows: any[][] = [[], [], []];
  combinedItems.forEach((item, index) => {
    const rowIndex = index % 3;
    rows[rowIndex].push(item);
  });

  const rotation = -6;

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
          transform: `rotate(${rotation}deg) scale(1.4)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {rows.map((rowItems, rowIndex) => {
          const rowLong = [...rowItems, ...rowItems];
          const totalRowWidth = rowItems.length * (itemWidth + gap);

          const speed = rowIndex % 2 === 0 ? 30 : 35;
          const direction = rowIndex % 2 === 0 ? -1 : 1;

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
                  : interpolate(frame, [beatFrames * 15, beatFrames * 18], [1, 0.75], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    });

                let imageSourcePath = item.avatarPath;
                if (imageSourcePath && imageSourcePath.startsWith('/')) {
                  imageSourcePath = imageSourcePath.substring(1);
                }

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
                      boxShadow: isTop3 ? '0 0 50px rgba(255, 215, 0, 0.8)' : 'none',
                      backgroundColor: '#111',
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
                    {!isTop3 && (
                      <AbsoluteFill
                        style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)',
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
          opacity: interpolate(frame, [beatFrames * 18, beatFrames * 20], [0, 1], {
            extrapolateLeft: 'clamp',
          }),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
