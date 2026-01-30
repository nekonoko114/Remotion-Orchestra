import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type { TransitionPresentation, TransitionProps } from "@remotion/transitions";

// --- Transitions Implementation ---

/**
 * 1. GlitchSlide
 * A slide transition with chromatic aberration and digital noise.
 */
export const glitchSlideTransition = (direction: "left" | "right" | "top" | "bottom" = "left"): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const offset = interpolate(presentationProgress, [0, 1], [0, 100]);
            const glitch = presentationProgress > 0.4 && presentationProgress < 0.6 ? (Math.random() - 0.5) * 50 : 0;

            const transform = direction === "left" ? `translateX(${-offset + glitch}%)` :
                              direction === "right" ? `translateX(${offset + glitch}%)` :
                              direction === "top" ? `translateY(${-offset + glitch}%)` :
                              `translateY(${offset + glitch}%)`;

            const enterOffset = interpolate(presentationProgress, [0, 1], [100, 0]);
            const enterTransform = direction === "left" ? `translateX(${enterOffset + glitch}%)` :
                                   direction === "right" ? `translateX(${-enterOffset + glitch}%)` :
                                   direction === "top" ? `translateY(${enterOffset + glitch}%)` :
                                   `translateY(${-enterOffset + glitch}%)`;

            return (
                <AbsoluteFill>
                    <AbsoluteFill style={{ transform, filter: presentationProgress > 0.3 ? `hue-rotate(${presentationProgress * 90}deg)` : "none" }}>
                        {exiting}
                    </AbsoluteFill>
                    <AbsoluteFill style={{ transform: enterTransform }}>
                        {entering}
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 2. ChromaticWipe
 * A wipe transition that splits RGB channels at the edge.
 */
export const chromaticWipeTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            return (
                <AbsoluteFill>
                    <AbsoluteFill>{exiting}</AbsoluteFill>
                    <AbsoluteFill style={{ 
                        clipPath: `inset(0 0 0 ${100 - presentationProgress * 100}%)`,
                        boxShadow: `-20px 0 50px rgba(0, 240, 255, ${presentationProgress})`
                    }}>
                        <AbsoluteFill style={{ transform: `translateX(${(1 - presentationProgress) * 20}px)`, opacity: 0.5, filter: "matrix(1,0,0,1,2,0)" }}>{entering}</AbsoluteFill>
                        <AbsoluteFill>{entering}</AbsoluteFill>
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 3. RGBSplitZoom
 */
export const rgbSplitZoomTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const exitScale = interpolate(presentationProgress, [0, 1], [1, 2]);
            const enterScale = interpolate(presentationProgress, [0, 1], [0.5, 1]);
            const split = interpolate(presentationProgress, [0, 0.5, 1], [0, 30, 0]);

            return (
                <AbsoluteFill style={{ backgroundColor: "black" }}>
                    <AbsoluteFill style={{ transform: `scale(${exitScale})`, opacity: 1 - presentationProgress }}>
                        <AbsoluteFill style={{ transform: `translateX(${split}px)`, opacity: 0.5, filter: "sepia(1) saturate(10) hue-rotate(0deg)" }}>{exiting}</AbsoluteFill>
                        <AbsoluteFill style={{ transform: `translateX(${-split}px)`, opacity: 0.5, filter: "sepia(1) saturate(10) hue-rotate(240deg)" }}>{exiting}</AbsoluteFill>
                        <AbsoluteFill>{exiting}</AbsoluteFill>
                    </AbsoluteFill>
                    <AbsoluteFill style={{ transform: `scale(${enterScale})`, opacity: presentationProgress }}>
                        <AbsoluteFill style={{ transform: `translateX(${split}px)`, opacity: 0.5, filter: "sepia(1) saturate(10) hue-rotate(0deg)" }}>{entering}</AbsoluteFill>
                        <AbsoluteFill style={{ transform: `translateX(${-split}px)`, opacity: 0.5, filter: "sepia(1) saturate(10) hue-rotate(240deg)" }}>{entering}</AbsoluteFill>
                        <AbsoluteFill>{entering}</AbsoluteFill>
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 4. LensFlareFlareOut
 */
export const lensFlareTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const brightness = interpolate(presentationProgress, [0, 0.5, 1], [1, 5, 1]);
            const flareScale = interpolate(presentationProgress, [0, 0.5, 1], [0, 4, 0]);

            return (
                <AbsoluteFill>
                    <AbsoluteFill style={{ filter: `brightness(${brightness})` }}>
                        {presentationProgress < 0.5 ? exiting : entering}
                    </AbsoluteFill>
                    <AbsoluteFill style={{ 
                        justifyContent: "center", 
                        alignItems: "center", 
                        pointerEvents: "none" 
                    }}>
                        <div style={{
                            width: 200, height: 200,
                            background: "radial-gradient(circle, #fff 0%, #00f0ff 30%, transparent 70%)",
                            transform: `scale(${flareScale})`,
                            opacity: interpolate(presentationProgress, [0, 0.5, 1], [0, 1, 0]),
                            filter: "blur(20px)"
                        }} />
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 5. DigitalGridDissolve
 */
export const digitalGridTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            return (
                <AbsoluteFill>
                    <AbsoluteFill>{entering}</AbsoluteFill>
                    <AbsoluteFill style={{ 
                        clipPath: `inset(0 0 0 0)`, // Needs a grid mask logic
                        opacity: 1 - presentationProgress,
                    }}>
                        {/* Simplified grid-like opacity mask using multiple divs would be heavy, 
                            so we use a CSS radial-gradient mashup */}
                        <AbsoluteFill style={{ 
                            maskImage: `radial-gradient(circle at 50% 50%, transparent ${presentationProgress * 150}%, black ${presentationProgress * 150 + 10}%)`,
                            WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${presentationProgress * 150}%, black ${presentationProgress * 150 + 10}%)`,
                        }}>
                            {exiting}
                        </AbsoluteFill>
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 6. PixelationTransition
 */
export const pixelationTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];
            
            const pixelSize = interpolate(presentationProgress, [0, 0.5, 1], [0, 50, 0]);

            return (
                <AbsoluteFill>
                    <AbsoluteFill style={{ filter: pixelSize > 0 ? `url(#pixelate-${pixelSize})` : "none" }}>
                         {/* SVG Filter for pixelation is robust but requires an SVG in the DOM */}
                         {presentationProgress < 0.5 ? exiting : entering}
                    </AbsoluteFill>
                    {/* SVG filter definition could be injected globally, but for now simplified blur/scale */}
                    <AbsoluteFill style={{ 
                        filter: `blur(${pixelSize}px)`, 
                        opacity: interpolate(presentationProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 1]) 
                    }}>
                         {presentationProgress < 0.5 ? exiting : entering}
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 7. StarBurstTransition
 */
export const starBurstTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const scale = interpolate(presentationProgress, [0, 1], [0, 10], { easing: Easing.out(Easing.exp) });

            return (
                <AbsoluteFill>
                    <AbsoluteFill>{exiting}</AbsoluteFill>
                    <AbsoluteFill style={{
                        clipPath: `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`,
                        transform: `scale(${scale})`,
                        transformOrigin: "center center",
                    }}>
                        <AbsoluteFill style={{ transform: `scale(${1/scale})` }}>
                            {entering}
                        </AbsoluteFill>
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 8. VerticalShutter
 */
export const verticalShutterTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const shutter = interpolate(presentationProgress, [0, 1], [0, 100]);

            return (
                <AbsoluteFill>
                    <AbsoluteFill>{entering}</AbsoluteFill>
                    <AbsoluteFill style={{ clipPath: `inset(0 0 ${shutter}% 0)` }}>{exiting}</AbsoluteFill>
                    <AbsoluteFill style={{ clipPath: `inset(${shutter}% 0 0 0)` }}>{exiting}</AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 9. HexagonWipe
 */
export const hexagonWipeTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];
            
            const scale = interpolate(presentationProgress, [0, 1], [0, 5]);

            return (
                <AbsoluteFill>
                    <AbsoluteFill>{exiting}</AbsoluteFill>
                    <AbsoluteFill style={{
                        clipPath: `polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)`,
                        transform: `scale(${scale * 5})`,
                        transformOrigin: "center center",
                    }}>
                        <AbsoluteFill style={{ transform: `scale(${1/(scale * 5)})` }}>
                            {entering}
                        </AbsoluteFill>
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 10. NeonEdgeTrace
 */
export const neonEdgeTraceTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            return (
                <AbsoluteFill>
                    <AbsoluteFill>{exiting}</AbsoluteFill>
                    <AbsoluteFill style={{ 
                        clipPath: `inset(0 0 0 ${100 - presentationProgress * 100}%)`,
                    }}>
                        {entering}
                    </AbsoluteFill>
                    <div style={{
                        position: "absolute",
                        left: `${presentationProgress * 100}%`,
                        width: 10, height: "100%",
                        backgroundColor: "#00f0ff",
                        boxShadow: "0 0 20px #00f0ff",
                        opacity: interpolate(presentationProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
                    }} />
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 11. ImpactFlash
 */
export const impactFlashTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const opacity = interpolate(presentationProgress, [0, 0.5, 1], [0, 1, 0]);
            
            return (
                <AbsoluteFill>
                    {presentationProgress < 0.5 ? exiting : entering}
                    <AbsoluteFill style={{ backgroundColor: "white", opacity }} />
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 12. MotionBlurPush
 */
export const motionBlurPushTransition = (direction: "left" | "right" = "left"): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const offset = interpolate(presentationProgress, [0, 1], [0, 100]);
            const blur = interpolate(presentationProgress, [0, 0.5, 1], [0, 40, 0]);

            const exitTransform = direction === "left" ? `translateX(${-offset}%)` : `translateX(${offset}%)`;
            const enterTransform = direction === "left" ? `translateX(${100 - offset}%)` : `translateX(${-100 + offset}%)`;

            return (
                <AbsoluteFill>
                    <AbsoluteFill style={{ transform: exitTransform, filter: `blur(${blur}px)` }}>
                        {exiting}
                    </AbsoluteFill>
                    <AbsoluteFill style={{ transform: enterTransform, filter: `blur(${blur}px)` }}>
                        {entering}
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 13. RippleWave
 */
export const rippleWaveTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const scale = interpolate(presentationProgress, [0, 1], [1, 1.2]);

            return (
                <AbsoluteFill style={{ backgroundColor: "black" }}>
                    <AbsoluteFill style={{ 
                        transform: `scale(${scale})`, 
                        opacity: 1 - presentationProgress,
                        filter: `contrast(${1 + presentationProgress})`
                    }}>
                        {exiting}
                    </AbsoluteFill>
                    <AbsoluteFill style={{ 
                        transform: `scale(${2 - scale})`, 
                        opacity: presentationProgress,
                        filter: `contrast(${2 - presentationProgress})`
                    }}>
                        {entering}
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 14. PrismRefraction
 */
export const prismRefractionTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const split = interpolate(presentationProgress, [0, 0.5, 1], [0, 50, 0]);

            return (
                <AbsoluteFill>
                    <AbsoluteFill style={{ opacity: 1 - presentationProgress }}>
                        <AbsoluteFill style={{ clipPath: `inset(0 ${50 + split}% 0 0)` }}>{exiting}</AbsoluteFill>
                        <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${50 + split}%)` }}>{exiting}</AbsoluteFill>
                        <AbsoluteFill style={{ opacity: 0.5, filter: "hue-rotate(180deg)" }}>{exiting}</AbsoluteFill>
                    </AbsoluteFill>
                    <AbsoluteFill style={{ opacity: presentationProgress }}>
                        {entering}
                    </AbsoluteFill>
                </AbsoluteFill>
            );
        }
    };
};

/**
 * 15. TVStatic
 */
export const tvStaticTransition = (): TransitionPresentation<any> => {
    return {
        component: ({ children, presentationProgress }: TransitionProps) => {
            const arr = React.Children.toArray(children);
            const exiting = arr[0];
            const entering = arr[1];

            const noiseOpacity = interpolate(presentationProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

            return (
                <AbsoluteFill>
                    {presentationProgress < 0.5 ? exiting : entering}
                    <AbsoluteFill style={{ 
                        backgroundColor: "black", 
                        opacity: noiseOpacity,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundSize: "200px 200px"
                    }} />
                </AbsoluteFill>
            );
        }
    };
};
