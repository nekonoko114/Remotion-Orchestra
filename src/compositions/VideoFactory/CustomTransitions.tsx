import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import type { TransitionPresentation, TransitionProps } from "@remotion/transitions";

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
    config: { damping: 200 }
  });
  
  const clampedProgress = Math.min(1, Math.max(0, progress));

  // The component function needs to be called as a component
  const Component = presentation.component;

  return (
    <Component 
       presentationProgress={clampedProgress} 
       presentationDirection="in"
       passedProps={{}}
    >
       {from}
       {to}
    </Component>
  );
};

export const wipeTransition = (options: {
  direction?:
    | "from-left"
    | "from-top-left"
    | "from-top"
    | "from-top-right"
    | "from-right"
    | "from-bottom-right"
    | "from-bottom"
    | "from-bottom-left";
} = {}): TransitionPresentation<any> => {
    try {
        if (typeof wipe === 'function') {
            return wipe({ direction: options.direction || "from-left" });
        }
        // Fallback to slide if wipe is failing
        console.warn("wipe is not a function, falling back to slide");
        return slide({ direction: (options.direction?.includes('top') ? 'from-top' : options.direction?.includes('bottom') ? 'from-bottom' : options.direction?.includes('right') ? 'from-right' : 'from-left') as any });
    } catch (e) {
        return slide({ direction: 'from-left' });
    }
};

export const WipeTransitionComponent: React.FC<TransitionProps & { direction?: "from-left" | "from-right" | "from-top" | "from-bottom" }> = (props) => {
    return <TransitionWrapper presentation={wipeTransition({ direction: props.direction })} from={props.from} to={props.to} durationInFrames={props.durationInFrames} />;
};

// 3. SLIDE TRANSITION (Whip Pan style)
export const slideTransition = (options: {
  direction?: "from-left" | "from-right" | "from-top" | "from-bottom";
} = {}): TransitionPresentation<any> => {
    return slide({ direction: options.direction || "from-left" });
};

export const SlideTransitionComponent: React.FC<TransitionProps & { direction?: "from-left" | "from-right" | "from-top" | "from-bottom" }> = (props) => {
    return <TransitionWrapper presentation={slideTransition({ direction: props.direction })} from={props.from} to={props.to} durationInFrames={props.durationInFrames} />;
};

// 4. ZOOM TRANSITION (Warp/Zoom)
export const zoomTransition = (options: {
  direction?: "in" | "out";
}): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const initialScale = options.direction === "out" ? 1.5 : 0.5;
      
      const enterScale = interpolate(
        presentationProgress,
        [0, 1],
        [initialScale, 1],
        { extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) }
      );
      const enterOpacity = interpolate(presentationProgress, [0, 0.5], [0, 1]);

      const exitScale = interpolate(presentationProgress, [0, 1], [1, 2]);
      const exitOpacity = interpolate(presentationProgress, [0, 1], [1, 0]);

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ transform: `scale(${exitScale})`, opacity: exitOpacity }}>
            {exiting}
          </AbsoluteFill>
          <AbsoluteFill style={{ transform: `scale(${enterScale})`, opacity: enterOpacity }}>
            {entering}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    },
  };
};

export const ZoomTransitionComponent: React.FC<TransitionProps & { direction?: "in" | "out" }> = (props) => {
    return <TransitionWrapper presentation={zoomTransition({ direction: props.direction })} from={props.from} to={props.to} durationInFrames={props.durationInFrames} />;
};

// 5. SPIN TRANSITION (Whip Spin)
export const spinTransition = (): TransitionPresentation<any> => {
  return {
    component: (props: TransitionProps) => {
      const { children, presentationProgress } = props;
      const arr = React.Children.toArray(children);
      const exiting = arr[0];
      const entering = arr[1];

      const rotation = interpolate(presentationProgress, [0, 1], [0, 360], { easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
      const scale = interpolate(presentationProgress, [0, 0.5, 1], [1, 0.2, 1]); // Shrink then grow
      
      const exitOpacity = interpolate(presentationProgress, [0, 0.5], [1, 0]);
      const enterOpacity = interpolate(presentationProgress, [0.5, 1], [0, 1]);

      if (!entering) return exiting as React.ReactElement;
      if (!exiting) return entering as React.ReactElement;

      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ 
              transform: `rotate(${rotation}deg) scale(${scale})`, 
              opacity: exitOpacity,
              zIndex: 1 
          }}>
            {exiting}
          </AbsoluteFill>
          <AbsoluteFill style={{ 
              transform: `rotate(${rotation - 360}deg) scale(${scale})`, 
              opacity: enterOpacity,
              zIndex: 2
          }}>
            {entering}
          </AbsoluteFill>
        </AbsoluteFill>
      );
    },
  };
};

export const SpinTransitionComponent: React.FC<TransitionProps> = (props) => {
    return <TransitionWrapper presentation={spinTransition()} from={props.from} to={props.to} durationInFrames={props.durationInFrames} />;
};

// 6. BLACK/WHITE FADE
export const colorFadeTransition = (color: "black" | "white" = "black"): TransitionPresentation<any> => {
    return {
        component: (props: TransitionProps) => {
            const { children, presentationProgress } = props;
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];
            
            const overlayOpacity = interpolate(
                presentationProgress,
                [0, 0.5, 1],
                [0, 1, 0]
            );

            const showEntering = presentationProgress > 0.5;

            return (
                <AbsoluteFill>
                    {showEntering ? entering : exiting}
                    <AbsoluteFill 
                        style={{ 
                            backgroundColor: color, 
                            opacity: overlayOpacity,
                            pointerEvents: "none"
                        }} 
                    />
                </AbsoluteFill>
            );
        }
    };
};

export const ColorFadeTransitionComponent: React.FC<TransitionProps & { color?: "black" | "white" }> = (props) => {
    return <TransitionWrapper presentation={colorFadeTransition(props.color)} from={props.from} to={props.to} durationInFrames={props.durationInFrames} />;
};
