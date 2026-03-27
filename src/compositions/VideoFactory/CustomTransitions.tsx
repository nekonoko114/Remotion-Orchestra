import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
  useVideoConfig,
  spring,
  random,
} from 'remotion';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';

type TransitionProps = TransitionPresentationComponentProps<any> & {
  from?: React.ReactNode;
  to?: React.ReactNode;
  durationInFrames?: number;
};

// Helper to wrap presentation into a component for EffectsCatalog
const TransitionWrapper: React.FC<{
  presentation: TransitionPresentation<any>;
  from: React.ReactNode;
  to: React.ReactNode;
  durationInFrames?: number;
}> = ({ presentation, from, to, durationInFrames = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create a cyclic progress for the catalog
  const progress = spring({
    frame: frame % (durationInFrames + 60), // Loop every duration + pause
    fps,
    durationInFrames,
    config: { damping: 200 },
  });

  const clampedProgress = Math.min(1, Math.max(0, progress));

  // The component function needs to be called as a component
  const Component = presentation.component;

  return (
    <Component
      presentationProgress={clampedProgress}
      presentationDirection="entering"
      presentationDurationInFrames={durationInFrames}
      passedProps={{}}
    >
      {from}
      {to}
    </Component>
  );
};

export const wipeTransition = (
  options: {
    direction?:
      | 'from-left'
      | 'from-top-left'
      | 'from-top'
      | 'from-top-right'
      | 'from-right'
      | 'from-bottom-right'
      | 'from-bottom'
      | 'from-bottom-left';
  } = {},
): TransitionPresentation<any> => {
  try {
    if (typeof wipe === 'function') {
      return wipe({ direction: options.direction || 'from-left' });
    }
    // Fallback to slide if wipe is failing
    console.warn('wipe is not a function, falling back to slide');
    return slide({
      direction: (options.direction?.includes('top')
        ? 'from-top'
        : options.direction?.includes('bottom')
          ? 'from-bottom'
          : options.direction?.includes('right')
            ? 'from-right'
            : 'from-left') as any,
    });
  } catch (e) {
    return slide({ direction: 'from-left' });
  }
};

export const WipeTransitionComponent: React.FC<
  TransitionProps & {
    direction?: 'from-left' | 'from-right' | 'from-top' | 'from-bottom';
  }
> = (props) => {
  return (
    <TransitionWrapper
      presentation={wipeTransition({ direction: props.direction })}
      from={props.from}
      to={props.to}
      durationInFrames={props.durationInFrames}
    />
  );
};

// 3. SLIDE TRANSITION (Whip Pan style)
export const slideTransition = (
  options: {
    direction?: 'from-left' | 'from-right' | 'from-top' | 'from-bottom';
  } = {},
): TransitionPresentation<any> => {
  return slide({
    direction: options.direction || 'from-left',
  }) as TransitionPresentation<any>;
};

export const SlideTransitionComponent: React.FC<
  TransitionProps & {
    direction?: 'from-left' | 'from-right' | 'from-top' | 'from-bottom';
  }
> = (props) => {
  return (
    <TransitionWrapper
      presentation={slideTransition({ direction: props.direction })}
      from={props.from}
      to={props.to}
      durationInFrames={props.durationInFrames}
    />
  );
};

// 4. ZOOM TRANSITION (Warp/Zoom)
export const zoomTransition = (options: {
  direction?: 'in' | 'out';
}): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const initialScale = options.direction === 'out' ? 1.5 : 0.5;

      const enterScale = interpolate(
        presentationProgress,
        [0, 1],
        [initialScale, 1],
        { extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1) },
      );
      const enterOpacity = interpolate(presentationProgress, [0, 0.5], [0, 1]);

      const exitScale = interpolate(presentationProgress, [0, 1], [1, 2]);
      const exitOpacity = interpolate(presentationProgress, [0, 1], [1, 0]);

      // Motion Blur: peaks in the middle of the transition
      const blurAmount = interpolate(
        presentationProgress,
        [0, 0.5, 1],
        [0, 20, 0],
      );

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `scale(${exitScale})`,
              opacity: exitOpacity,
              filter: `blur(${blurAmount}px)`,
            }}
          >
            {exiting}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `scale(${enterScale})`,
              opacity: enterOpacity,
              filter: `blur(${blurAmount}px)`,
            }}
          >
            {entering}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};

export const ZoomTransitionComponent: React.FC<
  TransitionProps & { direction?: 'in' | 'out' }
> = (props) => {
  return (
    <TransitionWrapper
      presentation={zoomTransition({ direction: props.direction })}
      from={props.from}
      to={props.to}
      durationInFrames={props.durationInFrames}
    />
  );
};

// 5. SPIN TRANSITION (Whip Spin)
export const spinTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const rotation = interpolate(presentationProgress, [0, 1], [0, 360], {
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      const scale = interpolate(presentationProgress, [0, 0.5, 1], [1, 0.2, 1]); // Shrink then grow

      const exitOpacity = interpolate(presentationProgress, [0, 0.5], [1, 0]);
      const enterOpacity = interpolate(presentationProgress, [0.5, 1], [0, 1]);

      // Spin Motion Blur: peaks during the fastest part of the rotation
      const blurAmount = interpolate(
        presentationProgress,
        [0, 0.5, 1],
        [0, 30, 0],
      );

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `rotate(${rotation}deg) scale(${scale})`,
              opacity: exitOpacity,
              filter: `blur(${blurAmount}px)`,
              zIndex: 1,
            }}
          >
            {exiting}
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `rotate(${rotation - 360}deg) scale(${scale})`,
              opacity: enterOpacity,
              filter: `blur(${blurAmount}px)`,
              zIndex: 2,
            }}
          >
            {entering}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};

export const SpinTransitionComponent: React.FC<TransitionProps> = (props) => {
  return (
    <TransitionWrapper
      presentation={spinTransition()}
      from={props.from}
      to={props.to}
      durationInFrames={props.durationInFrames}
    />
  );
};

// 6. BLACK/WHITE FADE
export const colorFadeTransition = (
  color: 'black' | 'white' = 'black',
): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const overlayOpacity = interpolate(
        presentationProgress,
        [0, 0.5, 1],
        [0, 1, 0],
      );

      const showEntering = presentationProgress > 0.5;

      return (
        <AbsoluteFill>
          {showEntering ? entering : exiting}
          <AbsoluteFill
            style={{
              backgroundColor: color,
              opacity: overlayOpacity,
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};

export const ColorFadeTransitionComponent: React.FC<
  TransitionProps & { color?: 'black' | 'white' }
> = (props) => {
  return (
    <TransitionWrapper
      presentation={colorFadeTransition(props.color)}
      from={props.from}
      to={props.to}
      durationInFrames={props.durationInFrames}
    />
  );
};
// 7. GLITCH TRANSITION
export const glitchTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const isSecondHalf = presentationProgress > 0.5;
      const localProgress = isSecondHalf
        ? (presentationProgress - 0.5) * 2
        : presentationProgress * 2;

      // Jitter logic with localProgress scaling
      const jitter =
        random(presentationProgress) < 0.3
          ? (random(presentationProgress + 1) - 0.5) * 40 * (1 - localProgress)
          : 0;
      const split =
        random(presentationProgress + 2) < 0.4
          ? 10 * Math.sin(presentationProgress * 20) * localProgress
          : 0;

      return (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          <AbsoluteFill style={{ transform: `translateX(${jitter}px)` }}>
            {isSecondHalf ? entering : exiting}
          </AbsoluteFill>

          {/* RGB Split Simulation during transition */}
          {presentationProgress > 0.2 && presentationProgress < 0.8 && (
            <>
              <AbsoluteFill
                style={{
                  mixBlendMode: 'screen',
                  opacity: 0.3,
                  transform: `translateX(${jitter + split}px)`,
                  backgroundColor: '#ff0000',
                }}
              />
              <AbsoluteFill
                style={{
                  mixBlendMode: 'screen',
                  opacity: 0.3,
                  transform: `translateX(${jitter - split}px)`,
                  backgroundColor: '#00ffff',
                }}
              />
            </>
          )}
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};

// 8. FLARE TRANSITION (Light Sweep)
export const flareTransition = (
  options: { color?: string } = {},
): TransitionPresentation<any> => {
  const flareColor = options.color || '#00f0ff';
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const sweepX = interpolate(presentationProgress, [0, 1], [-100, 200]);
      const flareOpacity = interpolate(
        presentationProgress,
        [0, 0.5, 1],
        [0, 1, 0],
      );

      return (
        <AbsoluteFill>
          {presentationProgress < 0.5 ? exiting : entering}

          {/* Cinematic Light Sweep */}
          <AbsoluteFill
            style={{
              zIndex: 10,
              pointerEvents: 'none',
              opacity: flareOpacity,
              background: `linear-gradient(90deg, transparent, ${flareColor}44, #fff, ${flareColor}44, transparent)`,
              transform: `translateX(${sweepX}%) skewX(-20deg)`,
              width: '200%',
              left: '-50%',
            }}
          />

          {/* Global Glow Bloom */}
          <AbsoluteFill
            style={{
              zIndex: 9,
              pointerEvents: 'none',
              background: `radial-gradient(circle at center, ${flareColor}66 0%, transparent 70%)`,
              opacity: flareOpacity,
            }}
          />
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};
// 9. ULTIMATE TRANSITION (Hyperspace Warp Speed)
export const ultimateTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const p = presentationProgress;
      const z = interpolate(p, [0, 1], [0, 3000], {
        easing: Easing.bezier(0.7, 0, 0.3, 1),
      });

      const exitOpacity = interpolate(p, [0, 0.4], [1, 0]);
      const enterOpacity = interpolate(p, [0.6, 1], [0, 1]);

      // Motion Blur and Chromatic Aberration Power
      const power = interpolate(p, [0, 0.5, 1], [0, 1, 0]);

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <AbsoluteFill style={{ perspective: 1000, backgroundColor: '#000', overflow: 'hidden' }}>
          {/* Exiting Scene with Depth Fly-away */}
          <AbsoluteFill
            style={{
              transform: `translateZ(${z}px)`,
              opacity: exitOpacity,
              filter: `blur(${power * 40}px) brightness(${1 + power})`,
            }}
          >
            {exiting}
          </AbsoluteFill>

          {/* Entering Scene Flying into view */}
          <AbsoluteFill
            style={{
              transform: `translateZ(${z - 3000}px)`,
              opacity: enterOpacity,
              filter: `blur(${power * 40}px) brightness(${1 + power})`,
            }}
          >
            {entering}
          </AbsoluteFill>

          {/* Hyperactive Energy Lines */}
          {power > 0.1 && new Array(40).fill(0).map((_, i) => {
            const seed = i * 1.5;
            const x = random(seed) * 100;
            const y = random(seed + 1) * 100;
            const length = 200 + random(seed + 2) * 800;
            const speed = 1500 + random(seed + 3) * 2000;
            const lineZ = (p * speed + random(seed + 4) * 2000) % 4000;
            const color = i % 2 === 0 ? '#0ff' : '#d000ff';

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 2,
                  height: length,
                  backgroundColor: color,
                  boxShadow: `0 0 15px ${color}`,
                  transform: `translateZ(${lineZ - 2000}px) rotateX(90deg)`,
                  opacity: power * 0.8,
                }}
              />
            );
          })}

          {/* RGB Split Flash Overlay */}
          {power > 0.5 && (
            <>
              <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.4, transform: `translateX(${power * 20}px)`, backgroundColor: '#ff0000' }} />
              <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.4, transform: `translateX(${-power * 20}px)`, backgroundColor: '#00ffff' }} />
            </>
          )}
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};
