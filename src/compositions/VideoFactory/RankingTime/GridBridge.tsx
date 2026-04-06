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
import RANKING_DATA_JSON_RAW from '../data-time.json';
const RANKING_DATA_JSON = Array.isArray(RANKING_DATA_JSON_RAW) ? RANKING_DATA_JSON_RAW : [];
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

const BPM = 160;

export const GridBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

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
  const otherUsers = FETCHED_USERS.filter(
    (u) => u.localAvatar && u.localAvatar !== '',
  )
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

  const columns: any[][] = [[], [], []];
  combinedItems.forEach((item, index) => {
    const colIndex = index % 3;
    columns[colIndex].push(item);
  });

  const rotation = -6;

  const getGatherOffset = (colIndex: number, rank: number) => {
    if (rank > 3) return { x: 0, y: 0 };

    const gatherProgress = interpolate(
      frame,
      [beatFrames * 3, beatFrames * 5],
      [0, 1],
      {
        easing: Easing.out(Easing.back(2)),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      },
    );

    let offsetX = 0;
    if (colIndex === 0) offsetX = gatherProgress * 300 * (width / 1080);
    if (colIndex === 2) offsetX = -gatherProgress * 300 * (width / 1080);

    return { x: offsetX, y: 0 };
  };

  const columnWidth = width / 3;
  const itemHeight = 500 * (width / 1080);
  const gap = 20 * (width / 1080);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `rotate(${rotation}deg) scale(1.4)`,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {columns.map((columnItems, colIndex) => {
          const columnLong = [...columnItems, ...columnItems, ...columnItems, ...columnItems];
          const itemFullHeight = itemHeight + gap;
          const totalColumnHeight = columnItems.length * itemFullHeight;

          const speed = colIndex % 2 === 0 ? 20 : 24;
          const direction = colIndex % 2 === 0 ? -1 : 1;

          const baseOffset = (frame * speed * direction) % totalColumnHeight;
          const centeredOffset = baseOffset - totalColumnHeight;

          return (
            <div
              key={colIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: columnWidth,
                transform: `translateY(${centeredOffset}px)`,
                gap: gap,
                marginRight: 20,
                whiteSpace: 'nowrap',
              }}
            >
              {columnLong.map((item, rowIndex) => {
                const { x: ox } = getGatherOffset(colIndex, item.rank);
                const isTop3 = item.rank <= 3;

                const opacity = isTop3
                  ? 1
                  : interpolate(
                      frame,
                      [beatFrames * 4, beatFrames * 6],
                      [1, 0.75],
                      {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      },
                    );

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
                    key={rowIndex}
                    style={{
                      width: columnWidth - 40 * (width / 1080),
                      height: itemHeight,
                      position: 'relative',
                      transform: `translate(${ox}px, 0)`,
                      opacity,
                      borderRadius: 20 * (width / 1080),
                      flexShrink: 0,
                      overflow: 'hidden',
                      border: isTop3
                        ? `${12 * (width / 1080)}px solid #d000ff`
                        : `${4 * (width / 1080)}px solid #444`,
                      boxShadow: isTop3
                        ? `0 0 ${50 * (width / 1080)}px rgba(208, 0, 255, 0.8)`
                        : 'none',
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
                          bottom: 15 * (width / 1080),
                          left: 15 * (width / 1080),
                          right: 15 * (width / 1080),
                          color: 'white',
                          fontSize: 30 * (width / 1080),
                          fontWeight: 'bold',
                          textShadow: `0 ${2 * (width / 1080)}px ${5 * (width / 1080)}px rgba(0,0,0,1)`,
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
                          bottom: 20 * (width / 1080),
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: '#00f2ff',
                          fontSize: 60 * (width / 1080),
                          fontWeight: 'bold',
                          padding: `${10 * (width / 1080)}px 0`,
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
            [beatFrames * 8, beatFrames * 10],
            [0, 1],
            { extrapolateLeft: 'clamp' },
          ),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
