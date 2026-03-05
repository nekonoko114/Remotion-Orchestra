import type React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface TypewriterProps {
  text: string;
  speed?: number; // Frames per character. Default 3.
  style?: React.CSSProperties;
  cursor?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 3,
  style,
  cursor = true,
}) => {
  const frame = useCurrentFrame();

  // Calculate how many characters to show
  const charsToShow = Math.floor(frame / speed);
  const visibleText = text.slice(0, charsToShow);

  const showCursor = cursor && frame % 30 < 15; // Blink every 0.5s (assuming 30fps)

  return (
    <div
      style={{
        fontFamily: 'monospace',
        fontSize: 60,
        color: 'white',
        ...style,
      }}
    >
      {visibleText}
      {showCursor && <span style={{ opacity: 0.8 }}>|</span>}
    </div>
  );
};
