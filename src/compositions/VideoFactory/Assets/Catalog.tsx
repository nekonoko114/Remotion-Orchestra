import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import * as T from "./Transitions";
import * as E from "./Effects";
import * as A from "./TextAnimations";

const Label: React.FC<{ children: string }> = ({ children }) => (
    <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        fontSize: 18,
        color: "white",
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: "5px 10px",
        borderRadius: 5,
        zIndex: 1000,
        fontFamily: "sans-serif"
    }}>
        {children}
    </div>
);

const GridItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: "1px solid #444",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#050505"
    }}>
        <Label>{label}</Label>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            {children}
        </AbsoluteFill>
    </div>
);

const GridPage: React.FC<{ children: React.ReactNode[] }> = ({ children }) => (
    <AbsoluteFill style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 20,
        padding: 40,
        backgroundColor: "#111",
        boxSizing: "border-box"
    }}>
        {children}
    </AbsoluteFill>
);

const DemoBG: React.FC<{ color: string }> = ({ color }) => (
    <AbsoluteFill style={{ backgroundColor: color, opacity: 0.3 }} />
);

export const AssetCatalog: React.FC = () => {
    return (
        <AbsoluteFill>
            <Series>
                {/* --- Text Animations Grid Pages --- */}
                <Series.Sequence durationInFrames={150}>
                    <GridPage>
                        <GridItem label="1. WordSlideUp"><A.WordSlideUp text="Word Slide Up" /></GridItem>
                        <GridItem label="2. LetterBounce"><A.LetterBounce text="J-POP BOUNCE" /></GridItem>
                        <GridItem label="3. NeonGlowText"><A.NeonGlowText text="NEON GLOW" /></GridItem>
                        <GridItem label="4. GlitchText"><A.GlitchText text="GLITCH" /></GridItem>
                    </GridPage>
                </Series.Sequence>

                <Series.Sequence durationInFrames={150}>
                    <GridPage>
                        <GridItem label="5. TypingEffect"><A.TypingEffect text="Typing..." /></GridItem>
                        <GridItem label="6. ScaleReveal"><A.ScaleReveal text="REVEAL" /></GridItem>
                        <GridItem label="7. BlurReveal"><A.BlurReveal text="BLURRY" /></GridItem>
                        <GridItem label="8. StaggeredSlide"><A.StaggeredSlideIn text="STAGGERED" /></GridItem>
                    </GridPage>
                </Series.Sequence>

                {/* --- Effects Grid Pages --- */}
                <Series.Sequence durationInFrames={150}>
                    <GridPage>
                        <GridItem label="1. Scanline">
                            <DemoBG color="#222" /><E.ScanlineOverlay />
                        </GridItem>
                        <GridItem label="2. GlitchDistortion">
                            <DemoBG color="#222" /><E.GlitchDistortion />
                        </GridItem>
                        <GridItem label="3. ParticlesDust">
                            <DemoBG color="#222" /><E.ParticlesDust />
                        </GridItem>
                        <GridItem label="4. SpeedLines">
                            <DemoBG color="#222" /><E.SpeedLines />
                        </GridItem>
                    </GridPage>
                </Series.Sequence>

                <Series.Sequence durationInFrames={150}>
                    <GridPage>
                        <GridItem label="5. NeonGrid">
                            <DemoBG color="#000" /><E.NeonGrid />
                        </GridItem>
                        <GridItem label="9. DigitalRain">
                            <DemoBG color="#000" /><E.DigitalRain />
                        </GridItem>
                        <GridItem label="12. Bokeh">
                            <DemoBG color="#000" /><E.BokehOverlay />
                        </GridItem>
                        <GridItem label="13. VectorWave">
                            <DemoBG color="#000" /><E.VectorWave />
                        </GridItem>
                    </GridPage>
                </Series.Sequence>

                {/* --- Transition Grid Pages (Complex) --- */}
                <Series.Sequence durationInFrames={200}>
                    <GridPage>
                        <GridItem label="Transition Mix A">
                            <TransitionSeries>
                                <TransitionSeries.Sequence durationInFrames={40}><DemoBG color="#300" /></TransitionSeries.Sequence>
                                <TransitionSeries.Transition
                                    presentation={T.glitchSlideTransition("left")}
                                    timing={linearTiming({ durationInFrames: 20 })}
                                />
                                <TransitionSeries.Sequence durationInFrames={40}><DemoBG color="#030" /></TransitionSeries.Sequence>
                                <TransitionSeries.Transition
                                    presentation={T.starBurstTransition()}
                                    timing={linearTiming({ durationInFrames: 20 })}
                                />
                                <TransitionSeries.Sequence durationInFrames={40}><DemoBG color="#003" /></TransitionSeries.Sequence>
                            </TransitionSeries>
                        </GridItem>
                        <GridItem label="Transition Mix B">
                             <TransitionSeries>
                                <TransitionSeries.Sequence durationInFrames={40}><DemoBG color="#330" /></TransitionSeries.Sequence>
                                <TransitionSeries.Transition
                                    presentation={T.chromaticWipeTransition()}
                                    timing={linearTiming({ durationInFrames: 20 })}
                                />
                                <TransitionSeries.Sequence durationInFrames={40}><DemoBG color="#033" /></TransitionSeries.Sequence>
                                <TransitionSeries.Transition
                                    presentation={T.verticalShutterTransition()}
                                    timing={linearTiming({ durationInFrames: 20 })}
                                />
                                <TransitionSeries.Sequence durationInFrames={40}><DemoBG color="#303" /></TransitionSeries.Sequence>
                            </TransitionSeries>
                        </GridItem>
                        <GridItem label="Coming soon...">
                            <div style={{ color: "#666" }}>Next Assets Grid</div>
                        </GridItem>
                        <GridItem label="Coming soon...">
                            <div style={{ color: "#666" }}>Next Assets Grid</div>
                        </GridItem>
                    </GridPage>
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
