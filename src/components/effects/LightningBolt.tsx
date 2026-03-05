import type React from 'react';
import { useMemo } from 'react';
import { random, useCurrentFrame } from 'remotion';

export const LightningBolt: React.FC<{
  color?: string;
  intensity?: number;
  thickness?: number;
  size?: number;
}> = ({ color = '#b0e0ff', intensity = 1, thickness = 3, size }) => {
  const frame = useCurrentFrame();

  const isStrike = random(frame) > 0.85 / Math.min(intensity, 2);
  const segments = 4;

  const points = useMemo(() => {
    if (!isStrike) return '';
    let path = '';
    const startX = random(frame + 1) * 100;
    let currentX = startX;
    let currentY = 0;
    const stepY = 100 / segments;
    path += `${currentX},${currentY} `;
    for (let i = 0; i < segments; i++) {
      currentY += stepY;
      const drift = (random(frame + i + 10) - 0.5) * 30;
      currentX += drift;
      path += `${currentX},${currentY} `;
    }
    return path;
  }, [frame, isStrike]);

  const subPoints = useMemo(() => {
    if (!isStrike || random(frame + 99) > 0.3) return '';
    let path = '';
    const startX = random(frame + 10) * 100;
    let currentX = startX;
    let currentY = 0;
    const subSegments = 2;
    const stepY = 100 / subSegments;
    path += `${currentX},${currentY} `;
    for (let i = 0; i < subSegments; i++) {
      currentY += stepY;
      currentX += (random(frame + i + 200) - 0.5) * 40;
      path += `${currentX},${currentY} `;
    }
    return path;
  }, [frame, isStrike]);

  if (!isStrike) {
    return null;
  }

  const containerStyle: React.CSSProperties = size
    ? {
        width: size,
        height: size,
        position: 'relative',
        overflow: 'hidden',
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      };

  return (
    <div style={containerStyle}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: color,
          opacity: 0.05,
          mixBlendMode: 'screen',
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ willChange: 'opacity' }}
      >
        <defs>
          <filter id="lightningGlowSimple">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={thickness / 10}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lightningGlowSimple)"
        />
        {subPoints && (
          <polyline
            points={subPoints}
            fill="none"
            stroke={color}
            strokeWidth={(thickness / 10) * 0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
            filter="url(#lightningGlowSimple)"
          />
        )}
      </svg>
    </div>
  );
};
