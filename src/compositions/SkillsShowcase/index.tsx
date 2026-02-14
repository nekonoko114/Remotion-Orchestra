import React from 'react';
import { Series } from 'remotion';
import { TextAnimations } from './TextAnimations';
import { TransitionsShowcase } from './TransitionsShowcase';
import { ThreeDShowcase } from './ThreeDShowcase';
import { AudioVisualizerShowcase } from './AudioVisualizerShowcase';
import { ImageEffectsShowcase } from './ImageEffectsShowcase';
import { LayoutShowcase } from './LayoutShowcase';
import { TypographyShowcase } from './TypographyShowcase';
import { VisualEffectsShowcase } from './VisualEffectsShowcase';
import { TechnicalShowcase } from './TechnicalShowcase';
import { SkiaShowcase } from './SkiaShowcase';
import { HighEnergyShowcase } from './HighEnergyShowcase';
import { DynamicTransitionsShowcase } from './DynamicTransitionsShowcase';
import { MusicVideoComposition } from './MusicVideo/MusicVideoComposition';

export const SkillsShowcase: React.FC = () => {
    return (
        <Series>
            {/* Part 1: Text Animations (Typewriter & Highlight) */}
            <Series.Sequence durationInFrames={150}>
                <TextAnimations />
            </Series.Sequence>

            {/* Part 2: Transitions Showcase (TransitionSeries) */}
            {/* Calculated duration: 175 frames (60*4 - 15 - 20 - 30) */}
            <Series.Sequence durationInFrames={175}>
                <TransitionsShowcase />
            </Series.Sequence>

            {/* Part 3: 3D Showcase (R3F) */}
            <Series.Sequence durationInFrames={150}>
                <ThreeDShowcase />
            </Series.Sequence>

            {/* Part 4: Audio Visualizer */}
            <Series.Sequence durationInFrames={150}>
                <AudioVisualizerShowcase />
            </Series.Sequence>

            {/* Part 5: Image Effects (Ken Burns) */}
            <Series.Sequence durationInFrames={150}>
                <ImageEffectsShowcase />
            </Series.Sequence>

            {/* Layout Showcase */}
            <Series.Sequence durationInFrames={150}>
                 <LayoutShowcase />
            </Series.Sequence>

             {/* Typography Showcase */}
             <Series.Sequence durationInFrames={150}>
                 <TypographyShowcase />
            </Series.Sequence>

             {/* Visual Effects Showcase */}
             <Series.Sequence durationInFrames={150}>
                 <VisualEffectsShowcase />
            </Series.Sequence>

             {/* Skia Showcase */}
             <Series.Sequence durationInFrames={150}>
                 <SkiaShowcase />
            </Series.Sequence>

            {/* High Energy Showcase */}
            <Series.Sequence durationInFrames={150}>
                <HighEnergyShowcase />
            </Series.Sequence>

            {/* Dynamic Transitions Showcase */}
            {/* Calculated approx 120 frames */}
            <Series.Sequence durationInFrames={120}>
                <DynamicTransitionsShowcase />
            </Series.Sequence>

            {/* Music Video Showcase (V2) */}
            <Series.Sequence durationInFrames={900}>
                <MusicVideoComposition />
            </Series.Sequence>

             {/* Technical Showcase */}
             <Series.Sequence durationInFrames={150}>
                 <TechnicalShowcase />
            </Series.Sequence>
        </Series>
    );
};
