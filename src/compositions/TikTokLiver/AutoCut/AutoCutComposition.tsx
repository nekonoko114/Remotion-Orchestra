import type React from 'react';
import { AbsoluteFill, Sequence, Video, staticFile } from 'remotion';
import { TikTokContainer } from '../../../components/TikTok/TikTokContainer';
import { KineticText } from '../../../components/effects/KineticText';
import { AUTOCUT_SEGMENTS } from './segments';

export const AutoCutComposition: React.FC = () => {
  let currentGlobalFrame = 0;

  return (
    <TikTokContainer>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        {AUTOCUT_SEGMENTS.map((segment) => {
          const from = currentGlobalFrame;
          currentGlobalFrame += segment.durationInFrames;

          return (
            <Sequence
              key={segment.id}
              from={from}
              durationInFrames={segment.durationInFrames}
            >
              {/* In a real scenario, use a real relative path or staticFile */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#555',
                  fontSize: '40px',
                }}
              >
                [RAW STREAM VIDEO CLIPPED]
              </div>

              <AbsoluteFill
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingBottom: '250px',
                }}
              >
                <KineticText
                  text={segment.text}
                  style={{
                    backgroundColor: 'rgba(255, 45, 85, 0.9)',
                    color: '#fff',
                    padding: '10px 40px',
                    fontSize: '44px',
                    fontWeight: '900',
                    borderRadius: '10px',
                  }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </TikTokContainer>
  );
};
