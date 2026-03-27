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
import { clockWipe } from '@remotion/transitions/clock-wipe';
import { flip } from '@remotion/transitions/flip';
import { GradientWipeTransition } from './components/BattleShared/Transitions15';

// 12. FLIP TRANSITION (Official)
export const flipTransition = (options?: { direction?: 'from-left' | 'from-right' | 'from-top' | 'from-bottom' }): TransitionPresentation<any> => {
  return flip({ direction: options?.direction || 'from-right' });
};

// 11. CLOCK WIPE TRANSITION (Official)
export const clockWipeTransition = (): TransitionPresentation<any> => {
  return clockWipe({ width: 1080, height: 1920 }); 
};
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
// 7. JITTER TRANSITION
export const jitterTransition = (): TransitionPresentation<any> => {
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

// 13. ULTIMATE GLITCH TRANSITION (Native Implementation)
export const glitchTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const p = presentationProgress;
      const isSecondHalf = p > 0.5;
      
      // Noise/Jitter intensity peaks at the middle
      const power = Math.sin(p * Math.PI);
      
      const jitterX = (random(p) - 0.5) * 100 * power;
      const banding = 12;

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
          {/* Base Layer */}
          <AbsoluteFill style={{ transform: `translateX(${jitterX}px)` }}>
            {isSecondHalf ? entering : exiting}
          </AbsoluteFill>

          {/* Sliced Layers for glitchy feel */}
          {power > 0.2 && new Array(banding).fill(0).map((_, i) => {
            const top = (i * 100) / banding;
            const height = 100 / banding;
            const sliceOffset = (random(p + i) - 0.5) * 300 * power;
            const src = (random(p + i + 10) > 0.5) ? exiting : entering;

            return (
              <AbsoluteFill
                key={i}
                style={{
                  clipPath: `polygon(0 ${top}%, 100% ${top}%, 100% ${top + height}%, 0 ${top + height}%)`,
                  transform: `translateX(${sliceOffset}px)`,
                  filter: random(p + i + 20) > 0.8 ? 'hue-rotate(90deg) brightness(2)' : 'none',
                  opacity: 0.8 * power,
                }}
              >
                {src}
              </AbsoluteFill>
            );
          })}

          {/* RGB Split Overlay */}
          {power > 0.3 && (
            <>
              <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.4 * power, transform: `translateX(${power * 40}px)`, backgroundColor: '#ff0000', pointerEvents: 'none' }} />
              <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.4 * power, transform: `translateX(${-power * 40}px)`, backgroundColor: '#00ffff', pointerEvents: 'none' }} />
            </>
          )}

          {/* Vertical Scanlines / Noise */}
          {power > 0.1 && (
            <AbsoluteFill style={{ 
              background: `repeating-linear-gradient(rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px)`,
              opacity: power * 0.5,
              pointerEvents: 'none' 
            }} />
          )}
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};


// 10. GRADIENT WIPE TRANSITION (from Catalog-Transitions-Ultimate-60 No.7)
export const gradientWipeTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress, presentationDurationInFrames } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];
      const frame = Math.round(presentationProgress * (presentationDurationInFrames - 1));

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <GradientWipeTransition
          frame={frame}
          duration={presentationDurationInFrames}
          SceneA={exiting}
          SceneB={entering}
        />
      );
    },
    props: {} as any,
  };
};

export const ultimateTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const p = presentationProgress;
      
      // Sharper exponential curve for more "explosive" movement
      const zExit = interpolate(p, [0, 0.5, 1], [0, 5000, 10000], {
        easing: Easing.bezier(0.7, 0, 0.3, 1),
      });
      const zEnter = interpolate(p, [0, 0.5, 1], [-10000, -5000, 0], {
        easing: Easing.bezier(0.7, 0, 0.3, 1),
      });

      // Quick separation: Exit finishes fast, Enter starts late
      const exitOpacity = interpolate(p, [0, 0.45], [1, 0], { extrapolateRight: 'clamp' });
      const enterOpacity = interpolate(p, [0.55, 1], [0, 1], { extrapolateLeft: 'clamp' });

      // Peak power for FX
      const power = interpolate(p, [0, 0.5, 1], [0, 1, 0]);
      
      // Central Flash to cover the "Cut-over" point
      const flashOpacity = interpolate(p, [0.3, 0.5, 0.7], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <AbsoluteFill style={{ perspective: 1000, backgroundColor: '#000', overflow: 'hidden' }}>
          {/* Exiting Scene */}
          {p < 0.6 && (
            <AbsoluteFill
              style={{
                transform: `translateZ(${zExit}px)`,
                opacity: exitOpacity,
                filter: `blur(${power * 60}px) contrast(${1 + power * 2})`,
              }}
            >
              {exiting}
            </AbsoluteFill>
          )}

          {/* Entering Scene */}
          {p > 0.4 && (
            <AbsoluteFill
              style={{
                transform: `translateZ(${zEnter}px)`,
                opacity: enterOpacity,
                filter: `blur(${power * 60}px) contrast(${1 + power * 2})`,
              }}
            >
              {entering}
            </AbsoluteFill>
          )}

          {/* Warp Lines */}
          {power > 0.05 && new Array(50).fill(0).map((_, i) => {
            const seed = i * 2.1;
            const x = random(seed) * 100;
            const y = random(seed + 1) * 100;
            const length = 500 + random(seed + 2) * 1000;
            const speed = 2500 + random(seed + 3) * 3000;
            const lineZ = (p * speed + random(seed + 4) * 2000) % 6000;
            const color = i % 2 === 0 ? '#0ff' : '#d000ff';

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 3,
                  height: length,
                  backgroundColor: color,
                  boxShadow: `0 0 20px ${color}`,
                  transform: `translateZ(${lineZ - 3000}px) rotateX(90deg)`,
                  opacity: power * 0.9,
                }}
              />
            );
          })}

          {/* Central Flash Overlay (The "Cut-over" wall) */}
          <AbsoluteFill
            style={{
              zIndex: 100,
              pointerEvents: 'none',
              backgroundColor: '#fff',
              opacity: flashOpacity * 0.8,
              boxShadow: `inset 0 0 100px #d000ff`,
            }}
          />
          <AbsoluteFill
            style={{
              zIndex: 101,
              pointerEvents: 'none',
              background: `radial-gradient(circle, white 0%, transparent 70%)`,
              opacity: flashOpacity,
              transform: `scale(${1 + power * 2})`,
            }}
          />

          {/* RGB Distortion during transition peak */}
          {power > 0.4 && (
            <>
              <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.5, transform: `translateX(${power * 30}px) skewX(${power * 5}deg)`, backgroundColor: '#ff0000', pointerEvents: 'none' }} />
              <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.5, transform: `translateX(${-power * 30}px) skewX(${-power * 5}deg)`, backgroundColor: '#00ffff', pointerEvents: 'none' }} />
            </>
          )}
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};

// 14. WIPE + FLARE HYBRID (Official Stability + Custom Flare)
export const wipeWithFlareTransition = (options: { direction?: any } = {}): TransitionPresentation<any> => {
  const baseWipe = wipe({ direction: options.direction || 'from-left' });
  return {
    ...baseWipe,
    component: (props: TransitionProps) => {
      const p = props.presentationProgress;
      const flareOpacity = Math.sin(p * Math.PI);
      const flareColor = '#00f2ff'; // Cyan theme

      return (
        <AbsoluteFill>
          <baseWipe.component {...props} />
          {/* Overlaid Flare Effect */}
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              background: `radial-gradient(circle at center, ${flareColor}88 0%, transparent 70%)`,
              opacity: flareOpacity * 0.6,
              zIndex: 10,
            }}
          />
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              backgroundColor: 'white',
              opacity: flareOpacity * 0.3,
              zIndex: 11,
            }}
          />
        </AbsoluteFill>
      );
    },
  };
};

// 15. WIPE + GLITCH HYBRID (Official Stability + Custom Glitch)
export const wipeWithGlitchTransition = (options: { direction?: any } = {}): TransitionPresentation<any> => {
  const baseWipe = wipe({ direction: options.direction || 'from-left' });
  return {
    ...baseWipe,
    component: (props: TransitionProps) => {
      const p = props.presentationProgress;
      const power = Math.sin(p * Math.PI);
      const jitterX = (random(p) - 0.5) * 50 * power;

      return (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          <AbsoluteFill style={{ transform: `translateX(${jitterX}px)` }}>
            <baseWipe.component {...props} />
          </AbsoluteFill>
          {/* Subtle Glitch Pop while wiping */}
          {power > 0.4 && (
            <>
              <AbsoluteFill
                style={{
                  mixBlendMode: 'screen',
                  opacity: 0.3 * power,
                  transform: `translateX(${power * 20}px)`,
                  backgroundColor: '#ff0000',
                  pointerEvents: 'none',
                }}
              />
              <AbsoluteFill
                style={{
                  mixBlendMode: 'screen',
                  opacity: 0.3 * power,
                  transform: `translateX(${-power * 20}px)`,
                  backgroundColor: '#00ffff',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}
        </AbsoluteFill>
      );
    },
  };
};

// 16. HYPER ZOOM BLAST (Explosive depth transition)
export const hyperZoomBlastTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];
      const p = presentationProgress;

      // Exponential curves for "Explosive" feel
      const exitScale = interpolate(p, [0, 1], [1, 10], { easing: Easing.bezier(0.7, 0, 0.3, 1) });
      const enterScale = interpolate(p, [0, 1], [0.1, 1], { easing: Easing.bezier(0.2, 0, 0.1, 1) });
      const exitOpacity = interpolate(p, [0, 0.4], [1, 0], { extrapolateRight: 'clamp' });
      const enterOpacity = interpolate(p, [0.4, 1], [0, 1], { extrapolateLeft: 'clamp' });
      const power = Math.sin(p * Math.PI);

      return (
        <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
          {p < 0.5 && (
            <AbsoluteFill style={{ transform: `scale(${exitScale})`, opacity: exitOpacity, filter: `blur(${power * 40}px) brightness(${1 + power * 2})` }}>
              {exiting}
            </AbsoluteFill>
          )}
          {p > 0.3 && (
            <AbsoluteFill style={{ transform: `scale(${enterScale})`, opacity: enterOpacity, filter: `blur(${power * 40}px) brightness(${1 + power * 2})` }}>
              {entering}
            </AbsoluteFill>
          )}
          {/* Central Blast Flash */}
          <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(circle, white 0%, transparent 70%)`, opacity: power, transform: `scale(${1 + power * 3})` }} />
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};

// 17. CYBER SLICE 3D (Fragmented reconstruction)
export const cyberSlice3DTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];
      const p = presentationProgress;
      const power = Math.sin(p * Math.PI);
      const slices = 8;

      return (
        <AbsoluteFill style={{ backgroundColor: '#000', perspective: 1000, overflow: 'hidden' }}>
          {new Array(slices).fill(0).map((_, i) => {
            const top = (i * 100) / slices;
            const height = 100 / slices;
            const offset = (i % 2 === 0 ? 1 : -1) * power * 300;
            const rotateY = (i % 2 === 0 ? 1 : -1) * power * 45;
            const isSecondHalf = p > 0.5;

            return (
              <AbsoluteFill
                key={i}
                style={{
                  clipPath: `polygon(0 ${top}%, 100% ${top}%, 100% ${top + height}%, 0 ${top + height}%)`,
                  transform: `translateX(${offset}px) rotateY(${rotateY}deg) translateZ(${power * 200}px)`,
                  filter: `brightness(${1 + power}) contrast(${1 + power})`,
                }}
              >
                {isSecondHalf ? entering : exiting}
              </AbsoluteFill>
            );
          })}
          {/* Neon Scanklines during slice */}
          {power > 0.2 && (
            <AbsoluteFill style={{ pointerEvents: 'none', background: `linear-gradient(rgba(0,255,255,0), rgba(0,255,255,0.5), rgba(0,255,255,0))`, height: '2px', top: `${p * 100}%`, boxShadow: '0 0 20px #0ff' }} />
          )}
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};

// 18. NEURAL WARP (Blackhole / Dimension jump)
export const neuralWarpTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];
      const p = presentationProgress;
      const power = Math.sin(p * Math.PI);
      
      const angle = interpolate(p, [0, 1], [0, 180], { easing: Easing.bezier(0.4, 0, 0.2, 1) });
      const scale = interpolate(p, [0, 0.5, 1], [1, 0, 1]);

      return (
        <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
          <AbsoluteFill style={{ transform: `rotate(${angle}deg) scale(${scale})`, filter: `blur(${power * 50}px) hue-rotate(${p * 360}deg)` }}>
            {p < 0.5 ? exiting : entering}
          </AbsoluteFill>
          {/* Warp Particles */}
          {power > 0.1 && new Array(30).fill(0).map((_, i) => {
            const seed = i * 1.5;
            const x = random(seed) * 100;
            const y = random(seed + 1) * 100;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 4,
                  height: 4,
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px white',
                  transform: `translate(${(random(seed + 2) - 0.5) * power * 1000}px, ${(random(seed + 3) - 0.5) * power * 1000}px) scale(${power * 2})`,
                  opacity: power,
                }}
              />
            );
          })}
        </AbsoluteFill>
      );
    },
    props: {} as any,
  };
};
