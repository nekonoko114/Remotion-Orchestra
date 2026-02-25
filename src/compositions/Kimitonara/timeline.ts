import { staticFile } from 'remotion';

// Import visual components if needed for type definitions, 
// using string identifiers to avoid circular dependencies if simple mapping is preferred.
import { IntroSequence } from './Sequences/IntroSequence';
import { PreChorusSequence } from './Sequences/PreChorusSequence';
import { ChorusSequence } from './Sequences/ChorusSequence';
import { InterludeSequence } from './Sequences/InterludeSequence';
import { OutroSequence } from './Sequences/OutroSequence';

export type SectionType = 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro';
export type SceneId = 'Intro' | 'PreChorus' | 'Chorus' | 'Interlude' | 'Outro';

export interface TimelineSection {
    id: string;
    type: SectionType;
    start: number; // seconds
    end: number;   // seconds
    sceneId: SceneId;
    component: React.FC<{ beat?: number }>;
    // Character settings
    characterImage?: string;
    characterLayout?: 'center' | 'left' | 'right' | 'hidden';
    characterAnimation?: 'fade' | 'slide' | 'none';
    // Effect settings
    showSpeedLines?: boolean;
    showSpeedSlash?: boolean;
}

export const TIMELINE: TimelineSection[] = [
    {
        id: 'Intro-A-Melody',
        type: 'verse',
        start: 0,
        end: 43.0,
        sceneId: 'Intro',
        component: IntroSequence,
        characterImage: staticFile('assets/characters/nova-chracter-02.png'),
        characterLayout: 'center',
        characterAnimation: 'fade',
        showSpeedLines: false,
        showSpeedSlash: false,
    },
    {
        id: 'B-Melody',
        type: 'verse',
        start: 43.0,
        end: 55.0,
        sceneId: 'PreChorus',
        component: PreChorusSequence,
        characterImage: staticFile('assets/characters/nova-chracter-02.png'),
        characterLayout: 'center',
        characterAnimation: 'fade',
        showSpeedLines: false,
        showSpeedSlash: false,
    },
    {
        id: 'Chorus',
        type: 'chorus',
        start: 55.0,
        end: 84.0, // 1:24
        sceneId: 'Chorus',
        component: ChorusSequence,
        characterImage: staticFile('assets/characters/nova-chracter-02.png'),
        characterLayout: 'center',
        characterAnimation: 'slide',
        showSpeedLines: true,
        showSpeedSlash: true,
    },
    {
        id: 'Interlude',
        type: 'bridge',
        start: 84.0,
        end: 105.0, // 1:45
        sceneId: 'Interlude',
        component: InterludeSequence,
        characterImage: staticFile('assets/characters/nova-chracter-02.png'),
        characterLayout: 'center',
        characterAnimation: 'fade',
        showSpeedLines: false,
        showSpeedSlash: false,
    },
    {
        id: 'Outro',
        type: 'outro',
        start: 105.0,
        end: 999.0,
        sceneId: 'Outro',
        component: OutroSequence,
        characterImage: staticFile('assets/characters/nova-chracter-02.png'),
        characterLayout: 'hidden',
        characterAnimation: 'fade',
        showSpeedLines: false,
        showSpeedSlash: false,
    },
];

// Helper to find current section
export const getCurrentSection = (time: number): TimelineSection | undefined => {
    return TIMELINE.find(section => time >= section.start && time < section.end);
};
