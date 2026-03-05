import type React from 'react';

/**
 * Standard props for transition components transitioning between two scenes.
 */
export interface TransitionProps {
  /** The scene to transition from */
  from: React.ReactNode;
  /** The scene to transition to */
  to: React.ReactNode;
  /** Optional override for transition duration in frames */
  durationInFrames?: number;
}
