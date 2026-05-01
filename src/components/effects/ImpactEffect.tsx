import type React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from 'remotion';

import { z } from 'zod';

export const ImpactEffectSchema = z.object({
  color: z.string().optional().default('white'),
  intensity: z.enum(['normal', 'high', 'soft']).optional().default('normal'),
  beatPulse: z.number().optional().default(0),
  delay: z.number().optional().default(0),
});

type Props = z.infer<typeof ImpactEffectSchema> & {
  children?: React.ReactNode;
};

export const ImpactEffect: React.FC<Props> = ({
  color = 'white',
  intensity = 'normal',
  beatPulse = 0,
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - delay;

  if (relativeFrame < 0)
    return <div style={{ opacity: 0, pointerEvents: 'none' }}>{children}</div>;

  // 1. Flash Effect
  const baseFlash = intensity === 'soft' ? 0.4 : 0.8;
  const flashOpacity = interpolate(
    relativeFrame,
    [0, 5, 20],
    [baseFlash, 1 * baseFlash, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  // 2. Shockwave Rings
  const rings =
    intensity === 'high' ? [0, 5, 10] : intensity === 'soft' ? [] : [0];

  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 100,
        }}
      >
        {/* Background Flash Color Tint */}
        {intensity === 'high' && (
          <AbsoluteFill
            style={{
              backgroundColor: color,
              opacity: flashOpacity * 0.5,
              mixBlendMode: 'screen',
              zIndex: -1,
            }}
          />
        )}

        {/* White Flash Overlay */}
        <AbsoluteFill
          style={{
            backgroundColor: 'white',
            opacity: flashOpacity,
            mixBlendMode: 'overlay',
            zIndex: -1,
          }}
        />

        {/* Expanding Rings */}
        {rings.map((rDelay, i) => {
          const ringFrame = relativeFrame - rDelay;
          if (ringFrame < 0) return null;

          const ringScale = interpolate(ringFrame, [0, 20], [0, 2.5], {
            easing: Easing.out(Easing.ease),
            extrapolateRight: 'clamp',
          });
          const ringOpacity = interpolate(ringFrame, [0, 10, 20], [1, 0.5, 0], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                width: 1000,
                height: 1000,
                borderRadius: '50%',
                border: `${50}px solid ${i === 0 ? 'white' : color}`,
                transform: `scale(${ringScale})`,
                opacity: ringOpacity,
                boxShadow: `0 0 ${50}px ${color}, inset 0 0 50px ${color}`,
                position: 'absolute',
              }}
            />
          );
        })}

        {/* Particles */}
        {intensity === 'high' &&
          new Array(12).fill(0).map((_, i) => {
            const seed = i * 123;
            const angle = random(seed) * 360;
            const speed = random(seed + 1) * 10 + 10;

            const distance = interpolate(
              relativeFrame,
              [0, 20],
              [0, speed * 20],
              {
                easing: Easing.out(Easing.quad),
              },
            );
            const particleOpacity = interpolate(
              relativeFrame,
              [0, 10, 25],
              [1, 1, 0],
            );
            const particleSize = random(seed + 2) * 20 + 10;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: particleSize,
                  height: particleSize,
                  borderRadius: '50%',
                  background: color,
                  opacity: particleOpacity,
                  transform: `rotate(${angle}deg) translateX(${distance}px)`,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />
            );
          })}
      </AbsoluteFill>
      {/* Original Children positioned correctly by parent layout */}
      {children}
    </>
  );
};
