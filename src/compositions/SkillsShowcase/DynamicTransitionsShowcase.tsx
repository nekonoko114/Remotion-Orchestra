import React from 'react';
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { AbsoluteFill } from 'remotion';

const ColorScene: React.FC<{ color: string, text: string }> = ({ color, text }) => (
    <AbsoluteFill style={{ backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 100, fontFamily: 'sans-serif', fontWeight: 'bold' }}>{text}</h1>
    </AbsoluteFill>
);

export const DynamicTransitionsShowcase: React.FC = () => {
    const duration = 20; // Short duration for rapid cuts
    const transitionDuration = 10; // Very fast transition

    return (
        <TransitionSeries>
            {/* Scene 1: Slide Left */}
            <TransitionSeries.Sequence durationInFrames={duration}>
                <ColorScene color="#ff0055" text="RAPID" />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={slide({ direction: 'from-right' })}
                timing={linearTiming({ durationInFrames: transitionDuration })}
            />
            
            {/* Scene 2: Slide Up */}
            <TransitionSeries.Sequence durationInFrames={duration}>
                <ColorScene color="#0055ff" text="FIRE" />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={slide({ direction: 'from-bottom' })}
                timing={linearTiming({ durationInFrames: transitionDuration })}
            />

            {/* Scene 3: Wipe */}
            <TransitionSeries.Sequence durationInFrames={duration}>
                <ColorScene color="#55ff00" text="CUTS" />
            </TransitionSeries.Sequence>
             <TransitionSeries.Transition
                presentation={wipe({ direction: 'from-top-right' })}
                timing={linearTiming({ durationInFrames: transitionDuration })}
            />

            {/* Scene 4: Flip */}
             <TransitionSeries.Sequence durationInFrames={duration}>
                <ColorScene color="#ffaa00" text="FLIP" />
            </TransitionSeries.Sequence>
             <TransitionSeries.Transition
                presentation={flip()}
                timing={linearTiming({ durationInFrames: transitionDuration })}
            />
             {/* Scene 5: Clock Wipe */}
             <TransitionSeries.Sequence durationInFrames={duration + 20}>
                <ColorScene color="#aa00ff" text="DONE" />
            </TransitionSeries.Sequence>
        </TransitionSeries>
    );
};
