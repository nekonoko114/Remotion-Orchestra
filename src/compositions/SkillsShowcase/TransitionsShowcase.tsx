import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';

export const TransitionsShowcase: React.FC = () => {
    return (
        <TransitionSeries>
            {/* Scene 1: Wipe Transition */}
            <TransitionSeries.Sequence durationInFrames={60}>
                <AbsoluteFill style={{ backgroundColor: '#FF5733', justifyContent: 'center', alignItems: 'center' }}>
                     <h1 style={{ color: 'white', fontSize: 80, fontFamily: 'sans-serif' }}>Wipe Transition</h1>
                </AbsoluteFill>
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={wipe({ direction: 'from-left' })}
                timing={linearTiming({ durationInFrames: 15 })}
            />
            
            {/* Scene 2: Slide Transition */}
            <TransitionSeries.Sequence durationInFrames={60}>
                 <AbsoluteFill style={{ backgroundColor: '#33FF57', justifyContent: 'center', alignItems: 'center' }}>
                     <h1 style={{ color: 'white', fontSize: 80, fontFamily: 'sans-serif' }}>Slide Transition</h1>
                </AbsoluteFill>
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
                presentation={slide({ direction: 'from-bottom' })}
                timing={linearTiming({ durationInFrames: 20 })}
            />
            
            {/* Scene 3: Fade Transition */}
            <TransitionSeries.Sequence durationInFrames={60}>
                 <AbsoluteFill style={{ backgroundColor: '#3357FF', justifyContent: 'center', alignItems: 'center' }}>
                     <h1 style={{ color: 'white', fontSize: 80, fontFamily: 'sans-serif' }}>Fade Transition</h1>
                </AbsoluteFill>
            </TransitionSeries.Sequence>
             <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: 30 })}
            />

             {/* Scene 4: End */}
            <TransitionSeries.Sequence durationInFrames={60}>
                 <AbsoluteFill style={{ backgroundColor: '#FF33A8', justifyContent: 'center', alignItems: 'center' }}>
                     <h1 style={{ color: 'white', fontSize: 80, fontFamily: 'sans-serif' }}>Smooth & Easy!</h1>
                </AbsoluteFill>
            </TransitionSeries.Sequence>
        </TransitionSeries>
    );
};
